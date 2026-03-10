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
