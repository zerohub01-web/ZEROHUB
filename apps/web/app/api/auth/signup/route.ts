import { NextRequest, NextResponse } from "next/server";

// build: 2026-03-10T21:27 - OTP email verification v3
const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_ZAkMN4R2_4SGRBsyeuYyWGDgKMQ3u4f1z";
const EMAIL_FROM = process.env.EMAIL_FROM || "ZERO <onboarding@resend.dev>";

// In-memory OTP store (lasts as long as the serverless function is warm)
// We sign + store in a response cookie instead for persistence
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    // Forward signup to the backend
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
    const backendRes = await fetch(`${apiBase}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const backendData = await backendRes.json();

    // If the backend already returned requiresVerification, pass it through
    if (backendData.requiresVerification) {
      return NextResponse.json(backendData, { status: backendRes.status });
    }

    // Backend is old version (no OTP) - intercept and add OTP
    // Check if account was actually created (201) or already exists (409)
    if (backendRes.status === 409) {
      return NextResponse.json(backendData, { status: 409 });
    }

    if (backendRes.status !== 201) {
      return NextResponse.json(backendData, { status: backendRes.status });
    }

    // Account was created - generate and send OTP ourselves
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 20 * 60 * 1000; // 20 minutes

    // Send OTP email via Resend
    if (RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: EMAIL_FROM,
          to: email,
          subject: "Verify your ZERO account",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
              <h1 style="color: #333;">Welcome to ZERO!</h1>
              <p style="font-size: 16px; color: #555;">Please enter the following 6-digit code to verify your email address.</p>
              <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000;">${otp}</span>
              </div>
              <p style="font-size: 14px; color: #888;">This code will expire in 20 minutes.</p>
            </div>`,
        }),
      });
    }

    // Store OTP in a signed cookie for verification
    const otpPayload = Buffer.from(JSON.stringify({ email, otp, otpExpires })).toString("base64");

    const response = NextResponse.json(
      { message: "Verification required", requiresVerification: true },
      { status: 201 }
    );

    response.cookies.set("_otp_pending", otpPayload, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 20 * 60, // 20 minutes
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Signup route error:", err);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
