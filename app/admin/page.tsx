import Link from "next/link"
import { redirect } from "next/navigation"

import { updateUserRole } from "@/app/admin-actions"
import { auth } from "@/auth"
import { Card, CardContent } from "@/components/ui/card"
import { writeAuditLog } from "@/lib/audit"
import { prisma } from "@/lib/prisma"

type AdminPageProps = {
  searchParams: Promise<{
    status?: string
    code?: string
  }>
}

const statusMessages: Record<string, string> = {
  "role-updated": "User role updated.",
  "no-change": "No role change was required.",
  "unauthorized": "You are not authorized to change roles.",
  "invalid-request": "The role update request was invalid.",
  "self-change-blocked": "You cannot change your own role from this screen.",
  "user-not-found": "The selected user no longer exists.",
  "last-admin-protected": "Cannot demote the last remaining admin.",
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin")
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (currentUser?.role !== "ADMIN") {
    redirect("/account")
  }

  await writeAuditLog({
    actorUserId: session.user.id,
    actorEmail: session.user.email ?? null,
    event: "ADMIN_ACCESS",
    status: "SUCCESS",
    target: "/admin",
  })

  const params = await searchParams
  const status = params.status === "error" ? "error" : params.status === "success" ? "success" : null
  const message = params.code ? statusMessages[params.code] : null

  const [users, totalProjects, recentAuditLogs] = await Promise.all([
    prisma.user.findMany({
      include: {
        profile: true,
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.interiorDesignProject.count(),
    prisma.auditLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 15,
    }),
  ])

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Admin</p>
          <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-stone-900 sm:text-5xl">Account oversight</h1>
          <p className="max-w-3xl text-lg text-stone-600">
            This admin view stays inside your own application boundary and exposes user and project totals without relying on an external identity dashboard.
          </p>
          {status && message ? (
            <p className={status === "success" ? "text-sm text-emerald-700" : "text-sm text-red-700"}>{message}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-stone-300 bg-white shadow-sm">
            <CardContent className="p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Total Users</p>
              <p className="mt-2 font-display text-4xl text-stone-900">{users.length}</p>
            </CardContent>
          </Card>
          <Card className="border-stone-300 bg-white shadow-sm">
            <CardContent className="p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Total Projects</p>
              <p className="mt-2 font-display text-4xl text-stone-900">{totalProjects}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-stone-300 bg-white shadow-sm">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-stone-900">Users</h2>
              <Link className="text-sm font-semibold uppercase tracking-[0.12em] text-amber-700 hover:text-amber-800" href="/account">
                Back to Account
              </Link>
            </div>

            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="grid gap-2 rounded-sm border border-stone-200 bg-stone-50 p-4 md:grid-cols-[1.2fr_1fr_0.7fr_0.8fr_1fr] md:items-center">
                  <div>
                    <p className="font-semibold text-stone-900">{user.name || "Unnamed user"}</p>
                    <p className="text-sm text-stone-600">{user.email}</p>
                  </div>
                  <div className="text-sm text-stone-600">
                    <p>{user.profile?.company || "No company"}</p>
                    <p>{user.profile?.phone || "No phone"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Role</p>
                    <p className="font-semibold uppercase text-stone-900">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Projects</p>
                    <p className="font-semibold text-stone-900">{user._count.projects}</p>
                  </div>
                  <div className="flex items-center gap-2 md:justify-end">
                    {user.id === session.user.id ? (
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Current Admin</p>
                    ) : user.role === "ADMIN" ? (
                      <form action={updateUserRole}>
                        <input type="hidden" name="targetUserId" value={user.id} />
                        <input type="hidden" name="role" value="CUSTOMER" />
                        <button
                          className="inline-flex h-9 items-center justify-center rounded-none border border-stone-300 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-stone-700 transition-colors hover:bg-stone-200"
                          type="submit"
                        >
                          Demote
                        </button>
                      </form>
                    ) : (
                      <form action={updateUserRole}>
                        <input type="hidden" name="targetUserId" value={user.id} />
                        <input type="hidden" name="role" value="ADMIN" />
                        <button
                          className="inline-flex h-9 items-center justify-center rounded-none border border-stone-300 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-stone-700 transition-colors hover:bg-stone-200"
                          type="submit"
                        >
                          Promote
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-stone-300 bg-white shadow-sm">
          <CardContent className="p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-stone-900">Recent Audit Activity</h2>
            </div>

            <div className="space-y-4">
              {recentAuditLogs.map((entry) => (
                <div key={entry.id} className="rounded-sm border border-stone-200 bg-stone-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-stone-900">{entry.event.replace(/_/g, " ")}</p>
                      <p className="text-sm text-stone-600">{entry.actorEmail || "System"}</p>
                    </div>
                    <div className="text-sm text-stone-600 sm:text-right">
                      <p className="font-semibold uppercase text-stone-900">{entry.status}</p>
                      <p>{new Date(entry.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {entry.target ? <p className="mt-2 text-sm text-stone-600">Target: {entry.target}</p> : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}