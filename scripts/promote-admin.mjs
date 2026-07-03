import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const email = process.argv[2]?.trim().toLowerCase()

if (!email) {
  console.error("Usage: npm run promote-admin -- user@example.com")
  process.exit(1)
}

try {
  const user = await prisma.user.update({
    where: { email },
    data: {
      role: "ADMIN",
      emailVerified: {
        set: new Date(),
      },
    },
  })

  await prisma.auditLog.create({
    data: {
      actorUserId: user.id,
      actorEmail: user.email,
      event: "ADMIN_PROMOTION",
      status: "SUCCESS",
      target: "role",
      metadata: {
        source: "promote-admin-script",
      },
    },
  })

  console.log(`Promoted ${user.email} to ADMIN.`)
} catch (error) {
  console.error("Failed to promote user to ADMIN:", error)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}