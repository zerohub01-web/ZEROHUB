import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

export async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.error("Email Error: Resend is not configured (missing API key)");
    return;
  }
  try {
    const result = await resend.emails.send({ from: env.emailFrom, to, subject, html });
    if (result.error) {
      console.error(`Email delivery failed to ${to}:`, result.error);
    } else {
      console.log(`Email sent successfully to ${to}. ID: ${result.data?.id}`);
    }
  } catch (err) {
    console.error(`Email service crash while sending to ${to}:`, err);
  }
}

export async function sendBookingCreatedEmails(params: {
  customerEmail: string;
  customerName: string;
  service: string;
  date: string;
}) {
  await Promise.all([
    sendEmail(
      params.customerEmail,
      "Your ZERO booking is received",
      `<p>Hi ${params.customerName}, your booking for ${params.service} on ${params.date} has been received.</p>`
    ),
    sendEmail(
      env.adminNotifyEmail,
      "New booking received",
      `<p>New booking from ${params.customerName} for ${params.service} on ${params.date}.</p>`
    )
  ]);
}

export async function sendBookingStatusEmail(params: {
  customerEmail: string;
  customerName: string;
  status: "CONFIRMED" | "COMPLETED";
  service: string;
}) {
  const subject = params.status === "CONFIRMED" ? "Your booking is confirmed" : "Your booking is completed";
  await sendEmail(
    params.customerEmail,
    subject,
    `<p>Hi ${params.customerName}, your booking for ${params.service} is now <strong>${params.status}</strong>.</p>`
  );
}

export async function sendMilestoneUpdateEmail(params: {
  customerEmail: string;
  customerName: string;
  milestoneTitle: string;
  status: "PENDING" | "DONE";
}) {
  await sendEmail(
    params.customerEmail,
    `Project milestone updated: ${params.milestoneTitle}`,
    `<p>Hi ${params.customerName}, milestone <strong>${params.milestoneTitle}</strong> is now <strong>${params.status}</strong>.</p>`
  );
}

export async function sendVerificationEmail(to: string, otpCode: string) {
  await sendEmail(
    to,
    "Verify your ZERO account",
    `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
       <h1 style="color: #333;">Welcome to ZERO!</h1>
       <p style="font-size: 16px; color: #555;">Please enter the following 6-digit code to verify your email address and securely log in.</p>
       <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 30px 0;">
         <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000;">${otpCode}</span>
       </div>
       <p style="font-size: 14px; color: #888;">This code will expire in 20 minutes.</p>
     </div>`
  );
}
