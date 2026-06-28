import { NextResponse } from "next/server"

export async function GET() {
  const hasApiKey = !!process.env.RESEND_API_KEY
  const apiKeyPreview = process.env.RESEND_API_KEY
    ? `${process.env.RESEND_API_KEY.substring(0, 8)}...`
    : "Not found"

  return NextResponse.json({
    hasApiKey,
    apiKeyPreview,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}
