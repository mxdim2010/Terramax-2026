"use server"

import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

import { signIn, signOut, auth } from "@/auth"
import { writeAuditLog } from "@/lib/audit"
import { hashPassword, verifyPassword } from "@/lib/password"
import { prisma } from "@/lib/prisma"
import {
  consumePasswordResetToken,
  createEmailVerificationToken,
  createPasswordResetToken,
  deletePasswordResetToken,
} from "@/lib/auth-tokens"
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/auth-email"

export type AuthActionState = {
  error: string
  success: string
}

const emptyState: AuthActionState = {
  error: "",
  success: "",
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

export async function authenticate(_prevState: AuthActionState, formData: FormData) {
  const email = readString(formData, "email").toLowerCase()
  const password = readString(formData, "password")
  const callbackUrl = readString(formData, "callbackUrl") || "/account"

  if (!email || !password) {
    await writeAuditLog({
      actorEmail: email || null,
      event: "AUTH_LOGIN",
      status: "FAILURE",
      target: "credentials",
      metadata: { reason: "missing_credentials" },
    })

    return {
      ...emptyState,
      error: "Email and password are required.",
    }
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (user && !user.emailVerified) {
    await writeAuditLog({
      actorUserId: user.id,
      actorEmail: user.email,
      event: "AUTH_LOGIN",
      status: "FAILURE",
      target: "credentials",
      metadata: { reason: "email_unverified" },
    })

    return {
      ...emptyState,
      error: "Verify your email before signing in. You can resend the verification email below.",
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      await writeAuditLog({
        actorUserId: user?.id,
        actorEmail: email,
        event: "AUTH_LOGIN",
        status: "FAILURE",
        target: "credentials",
        metadata: { reason: "invalid_credentials" },
      })

      return {
        ...emptyState,
        error: "Invalid email or password.",
      }
    }

    throw error
  }

  await writeAuditLog({
    actorUserId: user?.id,
    actorEmail: email,
    event: "AUTH_LOGIN",
    status: "SUCCESS",
    target: callbackUrl,
  })

  return emptyState
}

export async function registerUser(_prevState: AuthActionState, formData: FormData) {
  const name = readString(formData, "name")
  const email = readString(formData, "email").toLowerCase()
  const password = readString(formData, "password")
  const company = readString(formData, "company")
  const phone = readString(formData, "phone")

  if (!name || !email || !password) {
    return {
      ...emptyState,
      error: "Name, email, and password are required.",
    }
  }

  if (password.length < 8) {
    return {
      ...emptyState,
      error: "Password must be at least 8 characters long.",
    }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    await writeAuditLog({
      actorEmail: email,
      event: "AUTH_SIGNUP",
      status: "FAILURE",
      target: "user",
      metadata: { reason: "email_exists" },
    })

    return {
      ...emptyState,
      error: "An account with that email already exists.",
    }
  }

  const passwordHash = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "CUSTOMER",
      profile: {
        create: {
          company: company || null,
          phone: phone || null,
        },
      },
    },
  })

  const verificationToken = await createEmailVerificationToken(user.email)
  const verificationDelivery = await sendVerificationEmail(user.email, verificationToken)
  await writeAuditLog({
    actorUserId: user.id,
    actorEmail: user.email,
    event: "AUTH_SIGNUP",
    status: "SUCCESS",
    target: "user",
  })

  return {
    error: "",
    success: verificationDelivery.delivered
      ? `Account created. Verify ${user.email} before signing in.`
      : `Account created, but verification email could not be sent from this environment. Please contact support.`,
  }
}

export async function updateProfile(_prevState: AuthActionState, formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      ...emptyState,
      error: "You must be logged in to update your profile.",
    }
  }

  const name = readString(formData, "name")
  const company = readString(formData, "company")
  const phone = readString(formData, "phone")

  if (!name) {
    return {
      ...emptyState,
      error: "Name is required.",
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      profile: {
        upsert: {
          create: {
            company: company || null,
            phone: phone || null,
          },
          update: {
            company: company || null,
            phone: phone || null,
          },
        },
      },
    },
  })

  await writeAuditLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email ?? null,
    event: "PROFILE_UPDATE",
    status: "SUCCESS",
    target: "profile",
  })

  return {
    error: "",
    success: "Profile updated.",
  }
}

export async function signOutAction() {
  const session = await auth()

  await writeAuditLog({
    actorUserId: session?.user?.id ?? null,
    actorEmail: session?.user?.email ?? null,
    event: "AUTH_LOGOUT",
    status: "SUCCESS",
    target: "/",
  })

  await signOut({
    redirectTo: "/",
  })
}

export async function resendVerificationEmail(_prevState: AuthActionState, formData: FormData) {
  const email = readString(formData, "email").toLowerCase()

  if (!email) {
    return {
      ...emptyState,
      error: "Enter your email address.",
    }
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return {
      error: "",
      success: "If that account exists, a verification email has been sent.",
    }
  }

  if (user.emailVerified) {
    await writeAuditLog({
      actorUserId: user.id,
      actorEmail: user.email,
      event: "AUTH_RESEND_VERIFICATION",
      status: "FAILURE",
      target: "email_verification",
      metadata: { reason: "already_verified" },
    })

    return {
      error: "",
      success: "That account is already verified. You can log in now.",
    }
  }

  const verificationToken = await createEmailVerificationToken(user.email)
  const verificationDelivery = await sendVerificationEmail(user.email, verificationToken)
  await writeAuditLog({
    actorUserId: user.id,
    actorEmail: user.email,
    event: "AUTH_RESEND_VERIFICATION",
    status: "SUCCESS",
    target: "email_verification",
  })

  return {
    error: "",
    success: verificationDelivery.delivered
      ? "Verification email sent. Check your inbox for the activation link."
      : "Verification email could not be sent from this environment. Please contact support.",
  }
}

export async function requestPasswordReset(_prevState: AuthActionState, formData: FormData) {
  const email = readString(formData, "email").toLowerCase()

  if (!email) {
    return {
      ...emptyState,
      error: "Enter your email address.",
    }
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (user) {
    const resetToken = await createPasswordResetToken(user.id)
    await sendPasswordResetEmail(user.email, resetToken)

    await writeAuditLog({
      actorUserId: user.id,
      actorEmail: user.email,
      event: "AUTH_PASSWORD_RESET_REQUEST",
      status: "SUCCESS",
      target: "password_reset",
    })
  }

  return {
    error: "",
    success: "If that account exists, a password reset link has been sent.",
  }
}

export async function resetPassword(_prevState: AuthActionState, formData: FormData) {
  const token = readString(formData, "token")
  const password = readString(formData, "password")
  const confirmPassword = readString(formData, "confirmPassword")

  if (!token || !password || !confirmPassword) {
    return {
      ...emptyState,
      error: "Complete all password reset fields.",
    }
  }

  if (password.length < 8) {
    return {
      ...emptyState,
      error: "Password must be at least 8 characters long.",
    }
  }

  if (password !== confirmPassword) {
    return {
      ...emptyState,
      error: "Passwords do not match.",
    }
  }

  const record = await consumePasswordResetToken(token)

  if (!record) {
    return {
      ...emptyState,
      error: "This reset link is invalid or has expired.",
    }
  }

  const passwordHash = await hashPassword(password)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.session.deleteMany({
      where: { userId: record.userId },
    }),
  ])

  await deletePasswordResetToken(record.id)

  await writeAuditLog({
    actorUserId: record.userId,
    actorEmail: record.user.email,
    event: "AUTH_PASSWORD_RESET_COMPLETE",
    status: "SUCCESS",
    target: "password_reset",
  })

  redirect("/login?reset=success")
}

export async function changePassword(_prevState: AuthActionState, formData: FormData) {
  const session = await auth()

  if (!session?.user?.id || !session.user.email) {
    return {
      ...emptyState,
      error: "You must be logged in to change your password.",
    }
  }

  const currentPassword = readString(formData, "currentPassword")
  const newPassword = readString(formData, "newPassword")
  const confirmPassword = readString(formData, "confirmPassword")

  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      ...emptyState,
      error: "Complete all password fields.",
    }
  }

  if (newPassword.length < 8) {
    return {
      ...emptyState,
      error: "New password must be at least 8 characters long.",
    }
  }

  if (newPassword !== confirmPassword) {
    return {
      ...emptyState,
      error: "New passwords do not match.",
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user?.passwordHash) {
    return {
      ...emptyState,
      error: "Password change is not available for this account.",
    }
  }

  const matches = await verifyPassword(currentPassword, user.passwordHash)

  if (!matches) {
    await writeAuditLog({
      actorUserId: user.id,
      actorEmail: user.email,
      event: "AUTH_PASSWORD_CHANGE",
      status: "FAILURE",
      target: "password",
      metadata: { reason: "current_password_invalid" },
    })

    return {
      ...emptyState,
      error: "Current password is incorrect.",
    }
  }

  const passwordHash = await hashPassword(newPassword)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    }),
    prisma.session.deleteMany({
      where: { userId: user.id },
    }),
  ])

  await writeAuditLog({
    actorUserId: user.id,
    actorEmail: user.email,
    event: "AUTH_PASSWORD_CHANGE",
    status: "SUCCESS",
    target: "password",
  })

  await signOut({
    redirectTo: "/login?password=changed",
  })

  return emptyState
}