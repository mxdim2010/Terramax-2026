import { NextResponse } from "next/server"

export async function GET() {
  try {
    const hasApiKey = !!process.env.RESEND_API_KEY
    const apiKeyPreview = process.env.RESEND_API_KEY
      ? `${process.env.RESEND_API_KEY.substring(0, 8)}...`
      : "Not found"

    let resendImportWorking = false
    try {
      await import("resend")
      resendImportWorking = true
    } catch (err) {
      console.error("Resend import failed:", err)
    }

    return NextResponse.json({
      status: "Contact API is working",
      hasApiKey,
      apiKeyPreview,
      resendImportWorking,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      status: "Error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    })
  }
}
