import { Request, Response } from "express";
import { BookingModel } from "../models/Booking.js";

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfWeek() {
  const date = startOfToday();
  const day = date.getDay();
  const diff = date.getDate() - day;
  date.setDate(diff);
  return date;
}

function startOfMonth() {
  const date = startOfToday();
  date.setDate(1);
  return date;
}

export async function getAnalytics(req: Request, res: Response) {
  const filter = (req.query.filter as string) || "month";
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;

  let startDate = startOfMonth();
  const endDate = new Date();

  if (filter === "today") startDate = startOfToday();
  if (filter === "week") startDate = startOfWeek();
  if (filter === "month") startDate = startOfMonth();
  if (filter === "custom" && from && to) {
    startDate = new Date(from);
    endDate.setTime(new Date(to).getTime());
  }

  const bookings = await BookingModel.find({ createdAt: { $gte: startDate, $lte: endDate } });
  const prevPeriodLength = endDate.getTime() - startDate.getTime();
  const prevStart = new Date(startDate.getTime() - prevPeriodLength);
  const prevBookings = await BookingModel.find({ createdAt: { $gte: prevStart, $lt: startDate } });

  const totalBookings = bookings.length;
  const revenue = bookings.reduce((sum, b) => sum + (b.servicePriceSnapshot || 0), 0);
  const prevRevenue = prevBookings.reduce((sum, b) => sum + (b.servicePriceSnapshot || 0), 0);
  const growthPercent = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 100;

  const emails = bookings.map((b) => b.email);
  const uniqueEmails = new Set(emails);
  const repeatCustomers = emails.length - uniqueEmails.size;
  const conversionRate = totalBookings > 0 ? (bookings.filter((b) => b.status !== "NEW").length / totalBookings) * 100 : 0;

  const serviceCount = new Map<string, number>();
  bookings.forEach((b) => serviceCount.set(b.service, (serviceCount.get(b.service) ?? 0) + 1));
  const topService = [...serviceCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  return res.json({
    kpis: {
      totalBookings,
      revenue,
      growthPercent: Number(growthPercent.toFixed(2)),
      activeCustomers: uniqueEmails.size,
      conversionRate: Number(conversionRate.toFixed(2)),
      repeatCustomers,
      topService
    },
    charts: {
      bookingsOverTime: bookings.map((b) => ({ date: b.createdAt, count: 1 })),
      revenueTrend: bookings.map((b) => ({ date: b.createdAt, amount: b.servicePriceSnapshot })),
      servicePerformance: [...serviceCount.entries()].map(([service, count]) => ({ service, count }))
    }
  });
}
