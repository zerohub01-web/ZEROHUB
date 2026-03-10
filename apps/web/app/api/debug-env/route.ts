import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    env_api_base: process.env.NEXT_PUBLIC_API_BASE_URL || "NOT_SET",
    NODE_ENV: process.env.NODE_ENV || "NOT_SET",
    edge_runtime: typeof EdgeRuntime !== "undefined" ? "yes" : "no",
  }, { status: 200 });
}
