import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

const FROM = "ZERO <noreply@noreply.zeroops.in>";

// ─── Base layout wrapper ───────────────────────────────────────────────────────
function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ZERO</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border-radius:16px;overflow:hidden;border:1px solid #222;">
        <!-- Header -->
        <tr>
          <td style="padding:32px 40px;background:linear-gradient(135deg,#0d0d0d 0%,#1a1a1a 100%);border-bottom:1px solid #222;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="display:inline-block;background:#fff;border-radius:8px;padding:6px 14px;">
                    <span style="font-size:20px;font-weight:900;letter-spacing:-1px;color:#000;">ZERO</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:40px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;background:#0d0d0d;border-top:1px solid #222;text-align:center;">
            <p style="color:#444;font-size:12px;margin:0 0 4px;">© 2025 ZERO. All rights reserved.</p>
            <p style="color:#333;font-size:11px;margin:0;">
              <a href="https://zeroops.in" style="color:#555;text-decoration:none;">zeroops.in</a>
              &nbsp;·&nbsp;
              <a href="https://zeroops.in/portal" style="color:#555;text-decoration:none;">Client Portal</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Button component ─────────────────────────────────────────────────────────
function btn(text: string, url: string) {
  return `<a href="${url}" style="display:inline-block;margin-top:28px;padding:14px 32px;background:#fff;color:#000;font-weight:700;font-size:15px;border-radius:8px;text-decoration:none;letter-spacing:0.2px;">${text}</a>`;
}

// ─── Heading + Sub ────────────────────────────────────────────────────────────
function heading(title: string, sub?: string) {
  return `
    <h1 style="color:#fff;font-size:26px;font-weight:800;margin:0 0 8px;letter-spacing:-0.5px;">${title}</h1>
    ${sub ? `<p style="color:#888;font-size:15px;margin:0 0 24px;">${sub}</p>` : ""}
  `;
}

// ─── Divider ─────────────────────────────────────────────────────────────────
const divider = `<div style="height:1px;background:#222;margin:28px 0;"></div>`;

// ─── Info row ────────────────────────────────────────────────────────────────
function infoRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;">
        <span style="color:#555;font-size:13px;">${label}</span>
        <div style="color:#e0e0e0;font-size:15px;font-weight:600;margin-top:2px;">${value}</div>
      </td>
    </tr>
  `;
}

// ─── sendEmail ────────────────────────────────────────────────────────────────
export async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.error("Email Error: Resend is not configured (missing API key)");
    return;
  }
  try {
    const result = await resend.emails.send({ from: FROM, to, subject, html });
    if (result.error) {
      console.error(`Email delivery failed to ${to}:`, result.error);
    } else {
      console.log(`Email sent to ${to}. ID: ${result.data?.id}`);
    }
  } catch (err) {
    console.error(`Email crash while sending to ${to}:`, err);
  }
}

// ─── 1. OTP Verification ─────────────────────────────────────────────────────
export async function sendVerificationEmail(to: string, otpCode: string) {
  await sendEmail(
    to,
    "Your ZERO verification code",
    layout(`
      ${heading("Verify your account", "Enter the code below to complete your sign-up.")}
      <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:32px;text-align:center;margin:8px 0 24px;">
        <p style="color:#888;font-size:13px;margin:0 0 16px;text-transform:uppercase;letter-spacing:2px;">Your code</p>
        <div style="font-size:40px;font-weight:900;letter-spacing:14px;color:#fff;font-family:'Courier New',monospace;">${otpCode}</div>
        <p style="color:#555;font-size:12px;margin:16px 0 0;">Expires in 20 minutes</p>
      </div>
      <p style="color:#666;font-size:13px;margin:0;">If you didn't request this, you can safely ignore this email.</p>
    `)
  );
}

// ─── 2. Welcome Email ─────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string) {
  await sendEmail(
    to,
    "Welcome to ZERO — Your portal is ready",
    layout(`
      ${heading(`Welcome, ${name}! 👋`)}
      <p style="color:#aaa;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Your ZERO client portal is ready. From here you can track your projects, view milestones, 
        review files, and communicate with our team — all in one place.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #222;border-radius:10px;overflow:hidden;margin-bottom:8px;">
        <tr><td style="background:#1a1a1a;padding:14px 20px;">
          <div style="color:#fff;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">What you can do</div>
        </td></tr>
        <tr><td style="padding:16px 20px;">
          <p style="color:#888;font-size:14px;margin:0 0 10px;">✦ &nbsp;Track your project milestones in real-time</p>
          <p style="color:#888;font-size:14px;margin:0 0 10px;">✦ &nbsp;View and download project deliverables</p>
          <p style="color:#888;font-size:14px;margin:0 0 10px;">✦ &nbsp;Leave comments directly on project phases</p>
          <p style="color:#888;font-size:14px;margin:0;">✦ &nbsp;Get instant email updates at every milestone</p>
        </td></tr>
      </table>
      ${btn("Go to my portal", "https://zeroops.in/portal")}
    `)
  );
}

// ─── 3. Booking Created (Client) ──────────────────────────────────────────────
export async function sendBookingCreatedEmails(params: {
  customerEmail: string;
  customerName: string;
  service: string;
  date: string;
}) {
  await Promise.all([
    // Client email
    sendEmail(
      params.customerEmail,
      "ZERO — Booking received! We'll be in touch.",
      layout(`
        ${heading("Booking received!", "Thanks for choosing ZERO. We've got your request.")}
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #222;border-radius:10px;overflow:hidden;margin-bottom:8px;">
          ${infoRow("Service", params.service)}
          ${infoRow("Date Requested", params.date)}
          ${infoRow("Client", params.customerName)}
          ${infoRow("Status", "Under Review")}
        </table>
        <p style="color:#888;font-size:14px;line-height:1.7;margin:20px 0 0;">
          Our team will review your booking and get back to you within 1–2 business days 
          with a confirmation and next steps. You can track your project's progress from your client portal.
        </p>
        ${btn("View my portal", "https://zeroops.in/portal")}
      `)
    ),
    // Admin email
    sendEmail(
      env.adminNotifyEmail,
      `⚡ New booking: ${params.service} — ${params.customerName}`,
      layout(`
        ${heading("New booking received", "A new client has submitted a booking request.")}
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #222;border-radius:10px;overflow:hidden;margin-bottom:8px;">
          ${infoRow("Client Name", params.customerName)}
          ${infoRow("Client Email", params.customerEmail)}
          ${infoRow("Service Requested", params.service)}
          ${infoRow("Date Requested", params.date)}
        </table>
        ${btn("Go to Admin Panel", "https://zeroops.in/zero-control")}
      `)
    )
  ]);
}

// ─── 4. Booking Status Update (Confirmed or Completed) ───────────────────────
export async function sendBookingStatusEmail(params: {
  customerEmail: string;
  customerName: string;
  status: "CONFIRMED" | "COMPLETED";
  service: string;
}) {
  const isConfirmed = params.status === "CONFIRMED";
  await sendEmail(
    params.customerEmail,
    isConfirmed
      ? `ZERO — Your booking for ${params.service} is confirmed!`
      : `ZERO — Your project "${params.service}" is complete!`,
    layout(`
      ${heading(
        isConfirmed ? "You're confirmed! 🎉" : "Project complete! 🏁",
        isConfirmed
          ? "Your booking has been approved and your project is starting soon."
          : "Your project has been successfully completed."
      )}
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #222;border-radius:10px;overflow:hidden;margin-bottom:8px;">
        ${infoRow("Service", params.service)}
        ${infoRow("Status", params.status)}
        ${infoRow("Client", params.customerName)}
      </table>
      <p style="color:#888;font-size:14px;line-height:1.7;margin:20px 0 0;">
        ${isConfirmed
          ? "Our team will be in contact shortly to kick things off. You can follow along with every step of the process from your client portal."
          : "Thank you for working with ZERO. You can download all project deliverables from your client portal."}
      </p>
      ${btn("View Project Progress", "https://zeroops.in/portal")}
    `)
  );
}

// ─── 5. Milestone Update ──────────────────────────────────────────────────────
const MILESTONE_META: Record<string, { emoji: string; headline: string; body: string }> = {
  planning: {
    emoji: "📋",
    headline: "Planning phase has started",
    body: "Our team is actively planning your project. This includes scoping, resource allocation, and setting up your project timeline."
  },
  development: {
    emoji: "⚙️",
    headline: "Development has started",
    body: "We've kicked off the build phase of your project. Our team is now actively working on delivering your solution."
  },
  review: {
    emoji: "🔍",
    headline: "Your project is ready for review",
    body: "We've completed a build cycle and your project is ready for internal review. We'll be in touch soon with a preview or update."
  },
  launch: {
    emoji: "🚀",
    headline: "Project is being launched",
    body: "Your project is going live! Our team is handling the final deployment and handoff steps."
  },
  completed: {
    emoji: "✅",
    headline: "Project complete!",
    body: "Your project has been marked as complete. All deliverables are now available in your client portal. Thank you for choosing ZERO."
  }
};

export async function sendMilestoneUpdateEmail(params: {
  customerEmail: string;
  customerName: string;
  milestoneTitle: string;
  status: "PENDING" | "DONE";
}) {
  if (params.status !== "DONE") return; // Only send on completion

  const key = params.milestoneTitle.toLowerCase();
  const meta = Object.entries(MILESTONE_META).find(([k]) => key.includes(k))?.[1] ?? {
    emoji: "📌",
    headline: `Milestone updated: ${params.milestoneTitle}`,
    body: `The milestone "${params.milestoneTitle}" has been marked as complete. Check your portal for more details.`
  };

  await sendEmail(
    params.customerEmail,
    `ZERO — ${meta.headline}`,
    layout(`
      <div style="font-size:40px;margin-bottom:16px;">${meta.emoji}</div>
      ${heading(meta.headline, `Hi ${params.customerName}, here's an update on your project.`)}
      <div style="background:#1a1a1a;border-left:3px solid #fff;border-radius:4px;padding:16px 20px;margin:0 0 24px;">
        <p style="color:#aaa;font-size:14px;line-height:1.8;margin:0;">${meta.body}</p>
      </div>
      <p style="color:#666;font-size:13px;line-height:1.7;margin:0 0 4px;">
        Milestone: <strong style="color:#888;">${params.milestoneTitle}</strong>
      </p>
      ${btn("Track My Project", "https://zeroops.in/portal")}
    `)
  );
}
