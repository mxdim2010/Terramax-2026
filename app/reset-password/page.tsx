import Link from "next/link"

import { ResetPasswordForm } from "@/components/reset-password-form"
import { Card, CardContent } from "@/components/ui/card"

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string
  }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams
  const token = params.token || ""

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-start">
        <div className="max-w-xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Reset Password</p>
          <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-stone-900 sm:text-5xl">
            Set a new password for your account.
          </h1>
          <p className="text-lg text-stone-600">
            Reset links are single-use and time-limited to reduce account takeover risk.
          </p>
          <p className="text-sm text-stone-600">
            Need a fresh link? <Link className="font-semibold text-amber-700 hover:text-amber-800" href="/forgot-password">Request another reset</Link>.
          </p>
        </div>

        <Card className="w-full border-stone-300 bg-white shadow-sm lg:max-w-md">
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-stone-900">New Password</h2>
              <p className="text-sm text-stone-600">Choose a password with at least 8 characters.</p>
            </div>
            {token ? (
              <ResetPasswordForm token={token} />
            ) : (
              <p className="text-sm text-red-700">This reset link is missing a token. Request a new password reset email.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}