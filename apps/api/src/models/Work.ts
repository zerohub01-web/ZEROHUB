import mongoose, { Schema } from "mongoose";

export interface WorkDocument extends mongoose.Document {
  title: string;
  slug: string;
  coverImage: string;
  gallery: string[];
  seoTitle: string;
  seoDescription: string;
}

const workSchema = new Schema<WorkDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" }
  },
  { timestamps: true }
);

export const WorkModel = mongoose.model<WorkDocument>("Work", workSchema);
