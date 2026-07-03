import Link from "next/link"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { LoginForm } from "@/components/login-form"
import { ResendVerificationForm } from "@/components/resend-verification-form"
import { Card, CardContent } from "@/components/ui/card"

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string
    password?: string
    reset?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth()

  if (session?.user?.id) {
    redirect("/account")
  }

  const params = await searchParams
  const callbackUrl = params.callbackUrl || "/account"
  const passwordChanged = params.password === "changed"
  const resetSuccess = params.reset === "success"

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-start">
        <div className="max-w-xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Account Access</p>
          <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-stone-900 sm:text-5xl">
            Sign in to manage your projects.
          </h1>
          <p className="text-lg text-stone-600">
            Your account keeps design concepts, project briefs, and handoff requests tied to your profile.
          </p>
          <p className="text-sm text-stone-600">
            Return to the <Link className="font-semibold text-amber-700 hover:text-amber-800" href="/">homepage</Link>.
          </p>
        </div>

        <Card className="w-full border-stone-300 bg-white shadow-sm lg:max-w-md">
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-stone-900">Log In</h2>
              <p className="text-sm text-stone-600">Use your TerraMax account email and password.</p>
            </div>
            {passwordChanged ? <p className="text-sm text-emerald-700">Password changed. Sign in with your new credentials.</p> : null}
            {resetSuccess ? <p className="text-sm text-emerald-700">Password updated. You can sign in now.</p> : null}
            <LoginForm callbackUrl={callbackUrl} />
            <div className="border-t border-stone-200 pt-6">
              <h3 className="font-display text-lg uppercase tracking-[0.08em] text-stone-900">Need a new verification email?</h3>
              <p className="mt-2 text-sm text-stone-600">If your account is unverified, request a fresh activation link here.</p>
              <div className="mt-4">
                <ResendVerificationForm />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}