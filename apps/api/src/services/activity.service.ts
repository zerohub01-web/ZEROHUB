import { ActivityLogModel } from "../models/ActivityLog.js";

export async function logActivity(action: string, performedBy: string, metadata?: Record<string, unknown>) {
  await ActivityLogModel.create({ action, performedBy, metadata });
}
