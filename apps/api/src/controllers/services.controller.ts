import { Request, Response } from "express";
import { ServiceModel } from "../models/Service.js";
import { logActivity } from "../services/activity.service.js";

export async function createService(req: Request, res: Response) {
  const service = await ServiceModel.create(req.body);
  await logActivity("SERVICE_CREATED", req.admin?.adminId ?? "system", { serviceId: String(service._id) });
  return res.status(201).json(service);
}

export async function getServices(_req: Request, res: Response) {
  const services = await ServiceModel.find().sort({ createdAt: -1 });
  return res.json(services);
}

export async function getPublicServices(_req: Request, res: Response) {
  const services = await ServiceModel.find({ isActive: true }).sort({ createdAt: -1 });
  return res.json(services);
}

export async function updateService(req: Request, res: Response) {
  const service = await ServiceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!service) return res.status(404).json({ message: "Service not found" });

  await logActivity("SERVICE_UPDATED", req.admin?.adminId ?? "system", { serviceId: String(service._id) });
  return res.json(service);
}

export async function deleteService(req: Request, res: Response) {
  const deleted = await ServiceModel.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Service not found" });

  await logActivity("SERVICE_DELETED", req.admin?.adminId ?? "system", { serviceId: String(deleted._id) });
  return res.json({ ok: true });
}
