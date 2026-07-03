import { buildAppUrl } from "@/lib/auth-tokens"

type AuthEmailPayload = {
  to: string
  subject: string
  html: string
  fallbackLogLabel: string
}

export type AuthEmailDelivery = {
  delivered: boolean
}

async function sendAuthEmail({ to, subject, html, fallbackLogLabel }: AuthEmailPayload): Promise<AuthEmailDelivery> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`${fallbackLogLabel}: email transport not configured`)
    console.log(`${fallbackLogLabel}:`, { to, subject, html })
    return { delivered: false }
  }

  const { Resend } = await import("resend")
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: process.env.AUTH_EMAIL_FROM ?? "TerraMax Accounts <noreply@terramaxdev.com>",
    to: [to],
    subject,
    html,
  })

  return { delivered: true }
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = buildAppUrl(`/verify-email?token=${token}`)

  return sendAuthEmail({
    to: email,
    subject: "Verify your TerraMax account",
    fallbackLogLabel: "VERIFY_EMAIL_LINK",
    html: `
      <h2>Verify your TerraMax account</h2>
      <p>Confirm your email address to activate your account.</p>
      <p><a href="${verificationUrl}">Verify email address</a></p>
      <p>If you did not create this account, you can ignore this message.</p>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = buildAppUrl(`/reset-password?token=${token}`)

  return sendAuthEmail({
    to: email,
    subject: "Reset your TerraMax password",
    fallbackLogLabel: "PASSWORD_RESET_LINK",
    html: `
      <h2>Reset your TerraMax password</h2>
      <p>Use the link below to set a new password. This link expires in 30 minutes.</p>
      <p><a href="${resetUrl}">Reset password</a></p>
      <p>If you did not request a reset, you can ignore this message.</p>
    `,
  })
}