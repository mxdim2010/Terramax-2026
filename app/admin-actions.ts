"use server"

import { redirect } from "next/navigation"
import type { UserRole } from "@prisma/client"

import { auth } from "@/auth"
import { writeAuditLog } from "@/lib/audit"
import { prisma } from "@/lib/prisma"

type RoleValue = UserRole

function toRole(value: string): RoleValue | null {
  if (value === "ADMIN" || value === "CUSTOMER") {
    return value
  }

  return null
}

function redirectWith(status: "success" | "error", code: string): never {
  return redirect(`/admin?status=${status}&code=${code}`)
}

export async function updateUserRole(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id || !session.user.email) {
    redirect("/login?callbackUrl=/admin")
  }

  const actor = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, role: true },
  })

  if (!actor || actor.role !== "ADMIN") {
    await writeAuditLog({
      actorUserId: session.user.id,
      actorEmail: session.user.email,
      event: "ADMIN_ROLE_CHANGE",
      status: "FAILURE",
      target: "user-role",
      metadata: { reason: "actor_not_admin" },
    })

    return redirectWith("error", "unauthorized")
  }

  const targetUserId = String(formData.get("targetUserId") || "")
  const requestedRole = toRole(String(formData.get("role") || ""))

  if (!targetUserId || !requestedRole) {
    await writeAuditLog({
      actorUserId: actor.id,
      actorEmail: actor.email,
      event: "ADMIN_ROLE_CHANGE",
      status: "FAILURE",
      target: "user-role",
      metadata: { reason: "invalid_payload" },
    })

    return redirectWith("error", "invalid-request")
  }

  if (targetUserId === actor.id) {
    await writeAuditLog({
      actorUserId: actor.id,
      actorEmail: actor.email,
      event: "ADMIN_ROLE_CHANGE",
      status: "FAILURE",
      target: "self",
      metadata: { reason: "self_change_blocked" },
    })

    return redirectWith("error", "self-change-blocked")
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, email: true, role: true },
  })

  if (!targetUser) {
    await writeAuditLog({
      actorUserId: actor.id,
      actorEmail: actor.email,
      event: "ADMIN_ROLE_CHANGE",
      status: "FAILURE",
      target: targetUserId,
      metadata: { reason: "target_not_found" },
    })

    return redirectWith("error", "user-not-found")
  }

  if (targetUser.role === requestedRole) {
    return redirectWith("success", "no-change")
  }

  if (targetUser.role === "ADMIN" && requestedRole === "CUSTOMER") {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    })

    if (adminCount <= 1) {
      await writeAuditLog({
        actorUserId: actor.id,
        actorEmail: actor.email,
        event: "ADMIN_ROLE_CHANGE",
        status: "FAILURE",
        target: targetUser.email,
        metadata: { reason: "last_admin_protection" },
      })

      return redirectWith("error", "last-admin-protected")
    }
  }

  await prisma.user.update({
    where: { id: targetUser.id },
    data: { role: requestedRole },
  })

  await writeAuditLog({
    actorUserId: actor.id,
    actorEmail: actor.email,
    event: "ADMIN_ROLE_CHANGE",
    status: "SUCCESS",
    target: targetUser.email,
    metadata: {
      previousRole: targetUser.role,
      nextRole: requestedRole,
    },
  })

  return redirectWith("success", "role-updated")
}