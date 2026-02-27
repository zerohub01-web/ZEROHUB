import { Request, Response } from "express";
import { WorkModel } from "../models/Work.js";
import { logActivity } from "../services/activity.service.js";

export async function createWork(req: Request, res: Response) {
  const work = await WorkModel.create(req.body);
  await logActivity("WORK_CREATED", req.admin?.adminId ?? "system", { workId: String(work._id) });
  return res.status(201).json(work);
}

export async function getWork(_req: Request, res: Response) {
  const items = await WorkModel.find().sort({ createdAt: -1 });
  return res.json(items);
}

export async function updateWork(req: Request, res: Response) {
  const work = await WorkModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!work) return res.status(404).json({ message: "Work not found" });

  await logActivity("WORK_UPDATED", req.admin?.adminId ?? "system", { workId: String(work._id) });
  return res.json(work);
}

export async function deleteWork(req: Request, res: Response) {
  const work = await WorkModel.findByIdAndDelete(req.params.id);
  if (!work) return res.status(404).json({ message: "Work not found" });

  await logActivity("WORK_DELETED", req.admin?.adminId ?? "system", { workId: String(work._id) });
  return res.json({ ok: true });
}
