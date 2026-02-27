import { Request, Response } from "express";
import { AdminModel } from "../models/Admin.js";
import { signToken } from "../utils/auth.js";
import { env } from "../config/env.js";
import { logActivity } from "../services/activity.service.js";

export async function loginAdmin(req: Request, res: Response) {
  const { adminId, password } = req.body;

  const admin = await AdminModel.findOne({ adminId });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ adminId: admin.adminId, role: admin.role });

  res.cookie("token", token, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7
  });

  await logActivity("ADMIN_LOGIN", admin.adminId);

  return res.json({ adminId: admin.adminId, role: admin.role });
}

export async function loginAdminFromCustomer(req: Request, res: Response) {
  if (!req.customer?.email) return res.status(401).json({ message: "Unauthorized" });

  const customerEmail = req.customer.email.trim().toLowerCase();
  const allowedEmail = env.adminNotifyEmail.trim().toLowerCase();

  if (customerEmail !== allowedEmail) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const token = signToken({ adminId: customerEmail, role: "SUPER_ADMIN" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7
  });

  await logActivity("ADMIN_LOGIN_CUSTOMER_BRIDGE", customerEmail);

  return res.json({ adminId: customerEmail, role: "SUPER_ADMIN" });
}

export async function logoutAdmin(_req: Request, res: Response) {
  res.clearCookie("token");
  return res.json({ ok: true });
}

export async function me(req: Request, res: Response) {
  if (!req.admin) return res.status(401).json({ message: "Unauthorized" });
  return res.json(req.admin);
}
