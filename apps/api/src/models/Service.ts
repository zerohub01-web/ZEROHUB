import mongoose, { Schema } from "mongoose";

export interface ServiceDocument extends mongoose.Document {
  title: string;
  price: number;
  isActive: boolean;
}

const serviceSchema = new Schema<ServiceDocument>(
  {
    title: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const ServiceModel = mongoose.model<ServiceDocument>("Service", serviceSchema);
