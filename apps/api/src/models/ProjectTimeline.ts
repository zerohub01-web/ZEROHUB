import mongoose, { Schema } from "mongoose";

export type MilestoneKey = "planned" | "in_progress" | "delivered";
export type MilestoneStatus = "PENDING" | "DONE";

interface MilestoneComment {
  text: string;
  by: string;
  at: Date;
}

export interface MilestoneItem {
  key: MilestoneKey;
  title: string;
  status: MilestoneStatus;
  files: string[];
  comments: MilestoneComment[];
  updatedAt: Date;
}

export interface ProjectTimelineDocument extends mongoose.Document {
  bookingId: mongoose.Types.ObjectId;
  customerEmail: string;
  customerName: string;
  milestones: MilestoneItem[];
}

const commentSchema = new Schema<MilestoneComment>(
  {
    text: { type: String, required: true, trim: true },
    by: { type: String, required: true, trim: true },
    at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const milestoneSchema = new Schema<MilestoneItem>(
  {
    key: { type: String, enum: ["planned", "in_progress", "delivered"], required: true },
    title: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "DONE"], default: "PENDING" },
    files: [{ type: String }],
    comments: [commentSchema],
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const projectTimelineSchema = new Schema<ProjectTimelineDocument>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true, unique: true, index: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    customerName: { type: String, required: true, trim: true },
    milestones: { type: [milestoneSchema], default: [] }
  },
  { timestamps: true }
);

export const ProjectTimelineModel = mongoose.model<ProjectTimelineDocument>("ProjectTimeline", projectTimelineSchema);
