import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    url: process.env.NEXT_PUBLIC_API_BASE_URL || 'NONE',
    node_env: process.env.NODE_ENV
  });
}
