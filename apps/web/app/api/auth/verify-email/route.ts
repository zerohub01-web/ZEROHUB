import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, _t } = body;

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and code are required" }, { status: 400 });
    }

    // --- Vercel-layer stateless token validation ---
    if (_t) {
      try {
        const payload = JSON.parse(Buffer.from(_t, "base64").toString("utf-8"));

        if (Date.now() > payload.otpExpires) {
          return NextResponse.json(
            { message: "Verification code has expired. Please sign up again." },
            { status: 400 }
          );
        }

        if (payload.email.toLowerCase() !== email.toLowerCase()) {
          return NextResponse.json({ message: "Invalid verification code" }, { status: 400 });
        }

        if (payload.otp !== otp.trim()) {
          return NextResponse.json({ message: "Invalid verification code" }, { status: 400 });
        }

        // OTP is valid! Try to mark as verified on the backend
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
        const backendRes = await fetch(`${apiBase}/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });

        if (backendRes.ok) {
          const backendData = await backendRes.json();
          const response = NextResponse.json(backendData, { status: 200 });
          const setCookie = backendRes.headers.get("set-cookie");
          if (setCookie) {
            response.headers.set("set-cookie", setCookie);
          }
          return response;
        }

        // Backend is old (no verify endpoint) — log the user in directly
        const loginRes = await fetch(`${apiBase}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: body.password ?? "" }),
        });

        // Can't log in without the password — tell user to log in manually
        return NextResponse.json(
          { message: "Email verified! Please log in to continue.", verified: true, needsLogin: true },
          { status: 200 }
        );
      } catch {
        return NextResponse.json(
          { message: "Invalid verification state. Please sign up again." },
          { status: 400 }
        );
      }
    }

    // --- Fallback: forward to backend directly ---
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
    const backendRes = await fetch(`${apiBase}/api/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const backendData = await backendRes.json();
    const response = NextResponse.json(backendData, { status: backendRes.status });
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }
    return response;
  } catch (err) {
    console.error("Verify email route error:", err);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
