import { Request, Response } from "express";
import { BookingModel } from "../models/Booking.js";
import { ServiceModel } from "../models/Service.js";
import { sendBookingCreatedEmails, sendBookingStatusEmail } from "../services/email.service.js";
import { logActivity } from "../services/activity.service.js";

export async function createBooking(req: Request, res: Response) {
  const { name, email, phone, businessType, teamSize, monthlyLeads, budgetRange, service, date } = req.body;

  const serviceDoc = await ServiceModel.findOne({ title: service, isActive: true });
  if (!serviceDoc) return res.status(400).json({ message: "Service unavailable" });

  const booking = await BookingModel.create({
    name,
    email,
    phone,
    businessType,
    teamSize,
    monthlyLeads,
    budgetRange,
    service,
    servicePriceSnapshot: serviceDoc.price,
    date,
    status: "NEW"
  });

  await sendBookingCreatedEmails({
    customerEmail: booking.email,
    customerName: booking.name,
    service: booking.service,
    date: new Date(booking.date).toDateString()
  });

  await logActivity("BOOKING_CREATED", booking.email, { bookingId: String(booking._id) });

  return res.status(201).json({ booking, message: "Booking created" });
}

export async function getBookings(_req: Request, res: Response) {
  const bookings = await BookingModel.find().sort({ createdAt: -1 });
  return res.json(bookings);
}

export async function updateBookingStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body as { status: "NEW" | "CONFIRMED" | "COMPLETED" };

  const booking = await BookingModel.findById(id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  booking.status = status;
  await booking.save();

  if (status === "CONFIRMED" || status === "COMPLETED") {
    await sendBookingStatusEmail({
      customerEmail: booking.email,
      customerName: booking.name,
      status,
      service: booking.service
    });
  }

  await logActivity("BOOKING_STATUS_CHANGED", req.admin?.adminId ?? "system", {
    bookingId: String(booking._id),
    status
  });

  return res.json(booking);
}
