import mongoose, { Schema } from "mongoose";

export type BookingStatus = "NEW" | "CONFIRMED" | "COMPLETED";

export interface BookingDocument extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  businessType: string;
  teamSize?: string;
  monthlyLeads?: string;
  budgetRange?: string;
  service: string;
  currentWorkflow: string;
  servicePriceSnapshot: number;
  date: Date;
  status: BookingStatus;
  createdAt: Date;
}

const bookingSchema = new Schema<BookingDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    businessType: { type: String, required: true, trim: true },
    teamSize: { type: String, trim: true, default: "" },
    monthlyLeads: { type: String, trim: true, default: "" },
    budgetRange: { type: String, trim: true, default: "" },
    service: { type: String, required: true, trim: true },
    currentWorkflow: { type: String, default: "" },
    servicePriceSnapshot: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    status: { type: String, enum: ["NEW", "CONFIRMED", "COMPLETED"], default: "NEW" }
  },
  { timestamps: true }
);

bookingSchema.index({ createdAt: 1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ status: 1 });

export const BookingModel = mongoose.model<BookingDocument>("Booking", bookingSchema);
