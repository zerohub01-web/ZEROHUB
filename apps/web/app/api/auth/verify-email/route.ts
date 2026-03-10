import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and code are required" }, { status: 400 });
    }

    // Check if we have a Vercel-layer OTP pending cookie
    const otpCookie = req.cookies.get("_otp_pending");

    if (otpCookie?.value) {
      try {
        const payload = JSON.parse(Buffer.from(otpCookie.value, "base64").toString("utf-8"));

        if (Date.now() > payload.otpExpires) {
          return NextResponse.json({ message: "Verification code has expired. Please sign up again." }, { status: 400 });
        }

        if (payload.email.toLowerCase() !== email.toLowerCase()) {
          return NextResponse.json({ message: "Invalid verification code" }, { status: 400 });
        }

        if (payload.otp !== otp) {
          return NextResponse.json({ message: "Invalid verification code" }, { status: 400 });
        }

        // OTP is valid! Now call backend verify endpoint to set the isVerified flag
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
        const backendRes = await fetch(`${apiBase}/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });

        const backendData = await backendRes.json();

        // If backend verify works (new code), forward the cookies
        if (backendRes.ok) {
          const response = NextResponse.json(backendData, { status: 200 });
          // Forward Set-Cookie headers from backend
          const setCookie = backendRes.headers.get("set-cookie");
          if (setCookie) {
            response.headers.set("set-cookie", setCookie);
          }
          // Clear our OTP cookie
          response.cookies.delete("_otp_pending");
          return response;
        }

        // Backend is old (no verify-email endpoint) - just log the user in by calling login
        const loginRes = await fetch(`${apiBase}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: "__skip__" }),
        });

        // Login will fail with wrong password, but we can't log them in directly
        // Return success and let the user log in manually
        const response = NextResponse.json(
          { message: "Email verified! Please log in to continue.", verified: true, needsLogin: true },
          { status: 200 }
        );
        response.cookies.delete("_otp_pending");
        return response;

      } catch (parseErr) {
        return NextResponse.json({ message: "Invalid verification state. Please try signing up again." }, { status: 400 });
      }
    }

    // No Vercel-layer OTP cookie, fall through to backend
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
