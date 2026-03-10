import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { CustomerModel } from "../models/Customer.js";
import { BookingModel } from "../models/Booking.js";
import { signCustomerToken } from "../utils/customerAuth.js";
import { env } from "../config/env.js";
import { ensureTimelineForBooking } from "./projectTimeline.controller.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../services/email.service.js";
import crypto from "crypto";

const googleClient = env.googleClientId ? new OAuth2Client(env.googleClientId) : null;

function setCustomerCookie(res: Response, token: string) {
  res.cookie("customer_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
}

export async function signupCustomer(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const exists = await CustomerModel.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationExpires = new Date(Date.now() + 20 * 60 * 1000); // 20 mins

  const customer = await CustomerModel.create({ 
    name, 
    email, 
    password, 
    authProvider: "local",
    isVerified: false,
    otpCode,
    verificationExpires
  });
  
  await sendVerificationEmail(customer.email, otpCode);

  return res.status(201).json({ 
    message: "Verification required",
    requiresVerification: true 
  });
}

export async function loginCustomer(req: Request, res: Response) {
  const { email, password } = req.body;

  const customer = await CustomerModel.findOne({ email });
  if (!customer) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await customer.comparePassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  
  if (!customer.isVerified) {
    if (customer.verificationExpires && customer.verificationExpires < new Date()) {
      // Regenerate token if expired
      customer.otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      customer.verificationExpires = new Date(Date.now() + 20 * 60 * 1000);
      await customer.save();
      await sendVerificationEmail(customer.email, customer.otpCode);
      return res.status(403).json({ message: "Verification link expired. A new code has been sent to your email." });
    }
    return res.status(403).json({ 
      message: "Please enter your 6-digit confirmation code to complete setup.",
      requiresVerification: true
    });
  }

  const token = signCustomerToken({ customerId: String(customer._id), email: customer.email });
  setCustomerCookie(res, token);

  return res.json({ customer: { id: customer._id, name: customer.name, email: customer.email } });
}

export async function loginWithGoogle(req: Request, res: Response) {
  try {
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
        authProvider: "google",
        isVerified: true
      });
    } else if (!customer.isVerified) {
      customer.isVerified = true;
      customer.otpCode = undefined;
      customer.verificationExpires = undefined;
      await customer.save();
    }

    const token = signCustomerToken({ customerId: String(customer._id), email: customer.email });
    setCustomerCookie(res, token);

    return res.json({ customer: { id: customer._id, name: customer.name, email: customer.email } });
  } catch (err: any) {
    console.error("Google verify token error:", err);
    return res.status(400).json({ message: `Google login failed: ${err.message}` });
  }
}

export async function verifyEmail(req: Request, res: Response) {
  const { email, otp } = req.body as { email: string; otp: string };

  if (!email || !otp) return res.status(400).json({ message: "Email and code are required" });

  const customer = await CustomerModel.findOne({
    email: email.toLowerCase(),
    otpCode: otp,
    verificationExpires: { $gt: new Date() }
  });

  if (!customer) return res.status(400).json({ message: "Invalid or expired verification code" });

  customer.isVerified = true;
  customer.otpCode = undefined;
  customer.verificationExpires = undefined;
  await customer.save();

  // Send welcome email
  sendWelcomeEmail(customer.email, customer.name).catch(console.error);

  const sessionToken = signCustomerToken({ customerId: String(customer._id), email: customer.email });
  setCustomerCookie(res, sessionToken);

  return res.json({ message: "Email verified successfully", customer: { id: customer._id, name: customer.name, email: customer.email } });
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
        milestones: timeline ? timeline.toObject().milestones : []
      };
    })
  );

  return res.json({ projects });
}

export async function postClientComment(req: Request, res: Response) {
  if (!req.customer) return res.status(401).json({ message: "Unauthorized" });

  const { bookingId, milestoneKey } = req.params;
  const { comment } = req.body as { comment?: string };

  if (!comment?.trim()) return res.status(400).json({ message: "Comment is required" });

  // Import here to avoid circular deps
  const { ensureTimelineForBooking } = await import("./projectTimeline.controller.js");
  const timeline = await ensureTimelineForBooking(bookingId);
  if (!timeline) return res.status(404).json({ message: "Timeline not found" });

  // Ensure the timeline belongs to this customer
  if (timeline.customerEmail.toLowerCase() !== req.customer.email.toLowerCase()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const milestone = timeline.milestones.find((m) => m.key === milestoneKey);
  if (!milestone) return res.status(404).json({ message: "Milestone not found" });

  milestone.comments.push({ text: comment.trim(), by: "client", at: new Date() });
  milestone.updatedAt = new Date();
  timeline.markModified("milestones");
  await timeline.save();

  return res.json({ ok: true });
}
