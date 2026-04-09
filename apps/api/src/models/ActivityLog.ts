import mongoose, { Schema } from "mongoose";

export interface ActivityLogDocument extends mongoose.Document {
  action: string;
  performedBy: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

const activityLogSchema = new Schema<ActivityLogDocument>(
  {
    action: { type: String, required: true },
    performedBy: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: Schema.Types.Mixed }
  },
  { versionKey: false }
);

activityLogSchema.index({ timestamp: -1 });

export const ActivityLogModel = mongoose.model<ActivityLogDocument>("ActivityLog", activityLogSchema);
