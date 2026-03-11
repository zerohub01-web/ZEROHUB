import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credential } = body;

    if (!credential) {
      return NextResponse.json({ message: "Google credential is required" }, { status: 400 });
    }

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "https://zero-api-m0an.onrender.com";
    
    const backendRes = await fetch(`${apiBase}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });

    // Safely parse the response (Render may return empty or HTML on error)
    let backendData;
    try {
      const responseText = await backendRes.text();
      if (!responseText || responseText.trim() === "") {
        backendData = { message: "Backend returned empty response" };
      } else {
        backendData = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error("Failed to parse Google auth backend response:", parseError);
      return NextResponse.json(
        { message: "The server is temporarily unavailable. Please try again later." },
        { status: 502 }
      );
    }

    // Forward the response including Set-Cookie headers
    const response = NextResponse.json(backendData, { status: backendRes.status });
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }
    return response;
  } catch (err) {
    console.error("Google auth route error:", err);
    return NextResponse.json({ message: "An error occurred during Google authentication" }, { status: 500 });
  }
}
