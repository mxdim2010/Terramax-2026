import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

function hasValue(name: string) {
  const value = process.env[name]
  return Boolean(value && value.trim().length > 0)
}

export async function GET() {
  let prismaOk = false
  let prismaError: string | null = null

  try {
    await prisma.$queryRaw`SELECT 1`
    prismaOk = true
  } catch (error) {
    prismaError = error instanceof Error ? error.message : "Unknown Prisma error"
  }

  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    auth: {
      hasAuthSecret: hasValue("AUTH_SECRET"),
      hasNextAuthSecret: hasValue("NEXTAUTH_SECRET"),
      hasAuthUrl: hasValue("AUTH_URL"),
      hasNextAuthUrl: hasValue("NEXTAUTH_URL"),
      hasAuthTrustHost: hasValue("AUTH_TRUST_HOST"),
      hasAppUrl: hasValue("APP_URL"),
    },
    database: {
      hasDatabaseUrl: hasValue("DATABASE_URL"),
      prismaOk,
      prismaError,
    },
  })
}
