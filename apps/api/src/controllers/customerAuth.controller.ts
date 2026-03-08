import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { CustomerModel } from "../models/Customer.js";
import { BookingModel } from "../models/Booking.js";
import { signCustomerToken } from "../utils/customerAuth.js";
import { env } from "../config/env.js";
import { ensureTimelineForBooking } from "./projectTimeline.controller.js";

const googleClient = env.googleClientId ? new OAuth2Client(env.googleClientId) : null;

function setCustomerCookie(res: Response, token: string) {
  res.cookie("customer_token", token, {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSecure ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
}

export async function signupCustomer(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const exists = await CustomerModel.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const customer = await CustomerModel.create({ name, email, password, authProvider: "local" });
  const token = signCustomerToken({ customerId: String(customer._id), email: customer.email });
  setCustomerCookie(res, token);

  return res.status(201).json({ customer: { id: customer._id, name: customer.name, email: customer.email } });
}

export async function loginCustomer(req: Request, res: Response) {
  const { email, password } = req.body;

  const customer = await CustomerModel.findOne({ email });
  if (!customer) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await customer.comparePassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signCustomerToken({ customerId: String(customer._id), email: customer.email });
  setCustomerCookie(res, token);

  return res.json({ customer: { id: customer._id, name: customer.name, email: customer.email } });
}

export async function loginWithGoogle(req: Request, res: Response) {
  const { credential } = req.body as { credential: string };
  if (!googleClient || !env.googleClientId) {
    return res.status(400).json({ message: "Google auth is not configured" });
  }

  const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: env.googleClientId });
  const payload = ticket.getPayload();
  if (!payload?.email) return res.status(400).json({ message: "Invalid Google token" });

  let customer = await CustomerModel.findOne({ email: payload.email });
  if (!customer) {
    customer = await CustomerModel.create({
      name: payload.name ?? payload.email.split("@")[0],
      email: payload.email,
      authProvider: "google"
    });
  }

  const token = signCustomerToken({ customerId: String(customer._id), email: customer.email });
  setCustomerCookie(res, token);

  return res.json({ customer: { id: customer._id, name: customer.name, email: customer.email } });
}

export async function meCustomer(req: Request, res: Response) {
  if (!req.customer) return res.status(401).json({ message: "Unauthorized" });
  const customer = await CustomerModel.findById(req.customer.customerId).select("name email");
  if (!customer) return res.status(404).json({ message: "Customer not found" });
  return res.json(customer);
}

export async function logoutCustomer(_req: Request, res: Response) {
  res.clearCookie("customer_token");
  return res.json({ ok: true });
}

export async function getCustomerProjects(req: Request, res: Response) {
  if (!req.customer) return res.status(401).json({ message: "Unauthorized" });

  const bookings = await BookingModel.find({ email: req.customer.email }).sort({ createdAt: -1 });
  const projects = await Promise.all(
    bookings.map(async (b) => {
      const timeline = await ensureTimelineForBooking(String(b._id));
      return {
        id: b._id,
        title: b.service,
        status: b.status,
        date: b.date,
        value: b.servicePriceSnapshot,
        businessType: b.businessType,
        milestones: timeline?.milestones ? JSON.parse(JSON.stringify(timeline.milestones)) : []
      };
    })
  );

  return res.json({ projects });
}
