import Link from "next/link"
import { redirect } from "next/navigation"
import { unstable_noStore as noStore } from "next/cache"

import { auth } from "@/auth"
import { ChangePasswordForm } from "@/components/change-password-form"
import { ProfileForm } from "@/components/profile-form"
import { SignOutForm } from "@/components/sign-out-form"
import { Card, CardContent } from "@/components/ui/card"
import { WorkspaceSummary } from "@/components/workspace-summary"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function AccountPage() {
  noStore()

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const [user, projectCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    }),
    prisma.interiorDesignProject.count({
      where: { userId: session.user.id },
    }),
  ])

  if (!user) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Profile</p>
            <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-stone-900 sm:text-5xl">
              Manage your TerraMax account.
            </h1>
            <p className="max-w-3xl text-lg text-stone-600">
              Update your profile and access the private interior design workspace attached to your login.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user.role === "ADMIN" ? (
              <Link
                className="inline-flex h-11 items-center justify-center rounded-none border border-stone-300 px-5 text-sm font-semibold uppercase tracking-[0.12em] text-stone-700 transition-colors hover:bg-stone-200"
                href="/admin"
              >
                Admin
              </Link>
            ) : null}
            <Link
              className="inline-flex h-11 items-center justify-center rounded-none border border-stone-300 px-5 text-sm font-semibold uppercase tracking-[0.12em] text-stone-700 transition-colors hover:bg-stone-200"
              href="/interior-design-helper"
            >
              Open Workspace
            </Link>
            <SignOutForm />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-stone-300 bg-white shadow-sm">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-stone-900">Account Details</h2>
                <p className="text-sm text-stone-600">This profile is stored in your own PostgreSQL-backed account database.</p>
              </div>

              <ProfileForm
                email={user.email}
                name={user.name ?? ""}
                company={user.profile?.company ?? ""}
                phone={user.profile?.phone ?? ""}
              />

              <div className="border-t border-stone-200 pt-6">
                <div className="space-y-2">
                  <h3 className="font-display text-xl uppercase tracking-[0.08em] text-stone-900">Password</h3>
                  <p className="text-sm text-stone-600">
                    Changing your password signs out other active sessions and forces a fresh login.
                  </p>
                </div>
                <div className="mt-5">
                  <ChangePasswordForm />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-stone-300 bg-white shadow-sm">
              <CardContent className="space-y-4 p-8">
                <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-stone-900">Workspace Summary</h2>
                <WorkspaceSummary initialProjectCount={projectCount} role={user.role} />
              </CardContent>
            </Card>

            <Card className="border-stone-300 bg-white shadow-sm">
              <CardContent className="space-y-4 p-8">
                <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-stone-900">Verification Status</h2>
                <p className="text-sm text-stone-600">
                  {user.emailVerified
                    ? `Verified on ${new Date(user.emailVerified).toLocaleString()}.`
                    : "This account is not verified yet. Sign-in remains blocked until the email address is confirmed."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-stone-300 bg-white shadow-sm">
              <CardContent className="space-y-4 p-8">
                <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-stone-900">Ownership Model</h2>
                <p className="text-sm text-stone-600">
                  Your login, profile, and project history are owned by this application through Auth.js, Prisma, and your database.
                </p>
                <p className="text-sm text-stone-600">
                  This avoids vendor lock-in and lets TerraMax control user records, permissions, and data retention policy directly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}