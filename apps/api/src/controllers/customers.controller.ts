import { Request, Response } from "express";
import { BookingModel } from "../models/Booking.js";

export async function getCustomers(_req: Request, res: Response) {
  const rows = await BookingModel.aggregate([
    {
      $group: {
        _id: "$email",
        name: { $first: "$name" },
        phone: { $first: "$phone" },
        bookingHistory: {
          $push: {
            bookingId: "$_id",
            service: "$service",
            status: "$status",
            date: "$date",
            value: "$servicePriceSnapshot"
          }
        },
        totalValue: { $sum: "$servicePriceSnapshot" }
      }
    },
    { $sort: { totalValue: -1 } }
  ]);

  return res.json(rows.map((r) => ({ email: r._id, ...r, _id: undefined })));
}
