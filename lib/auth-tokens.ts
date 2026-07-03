import { createHash, randomBytes } from "node:crypto"

import { prisma } from "@/lib/prisma"

const EMAIL_VERIFICATION_TTL_MS = 1000 * 60 * 60 * 24
const PASSWORD_RESET_TTL_MS = 1000 * 60 * 30
const EMAIL_VERIFICATION_PREFIX = "email-verification:"

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

function futureDate(ttlMs: number) {
  return new Date(Date.now() + ttlMs)
}

export function buildAppUrl(pathname: string) {
  const baseUrl = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  return new URL(pathname, baseUrl).toString()
}

export async function createEmailVerificationToken(email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const rawToken = randomBytes(32).toString("hex")
  const tokenHash = hashToken(rawToken)

  await prisma.verificationToken.deleteMany({
    where: {
      identifier: `${EMAIL_VERIFICATION_PREFIX}${normalizedEmail}`,
    },
  })

  await prisma.verificationToken.create({
    data: {
      identifier: `${EMAIL_VERIFICATION_PREFIX}${normalizedEmail}`,
      token: tokenHash,
      expires: futureDate(EMAIL_VERIFICATION_TTL_MS),
    },
  })

  return rawToken
}

export async function consumeEmailVerificationToken(rawToken: string) {
  const tokenHash = hashToken(rawToken)

  const record = await prisma.verificationToken.findUnique({
    where: { token: tokenHash },
  })

  if (!record || !record.identifier.startsWith(EMAIL_VERIFICATION_PREFIX) || record.expires < new Date()) {
    if (record) {
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: record.identifier,
            token: record.token,
          },
        },
      })
    }

    return null
  }

  const email = record.identifier.slice(EMAIL_VERIFICATION_PREFIX.length)

  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
      },
    }),
    prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: record.identifier,
          token: record.token,
        },
      },
    }),
  ])

  return email
}

export async function createPasswordResetToken(userId: string) {
  const rawToken = randomBytes(32).toString("hex")
  const tokenHash = hashToken(rawToken)

  await prisma.passwordResetToken.deleteMany({
    where: { userId },
  })

  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash,
      expires: futureDate(PASSWORD_RESET_TTL_MS),
    },
  })

  return rawToken
}

export async function consumePasswordResetToken(rawToken: string) {
  const tokenHash = hashToken(rawToken)
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  })

  if (!record || record.expires < new Date()) {
    if (record) {
      await prisma.passwordResetToken.delete({
        where: { id: record.id },
      })
    }

    return null
  }

  return record
}

export async function deletePasswordResetToken(id: string) {
  await prisma.passwordResetToken.delete({
    where: { id },
  })
}