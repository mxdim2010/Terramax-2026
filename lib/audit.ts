import { prisma } from "@/lib/prisma"

type AuditPayload = {
  actorUserId?: string | null
  actorEmail?: string | null
  event: string
  status: "SUCCESS" | "FAILURE"
  target?: string | null
  metadata?: Record<string, string | number | boolean | null>
}

export async function writeAuditLog({
  actorUserId,
  actorEmail,
  event,
  status,
  target,
  metadata,
}: AuditPayload) {
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId: actorUserId ?? null,
        actorEmail: actorEmail ?? null,
        event,
        status,
        target: target ?? null,
        metadata: metadata ?? undefined,
      },
    })
  } catch (error) {
    console.error("Audit log write failed:", error)
  }
}