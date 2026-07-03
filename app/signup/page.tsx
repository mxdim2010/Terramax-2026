import Link from "next/link"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { SignupForm } from "@/components/signup-form"
import { Card, CardContent } from "@/components/ui/card"

type SignupPageProps = {
  searchParams: Promise<{
    callbackUrl?: string
  }>
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const session = await auth()

  if (session?.user?.id) {
    redirect("/account")
  }

  const params = await searchParams
  const callbackUrl = params.callbackUrl || "/account"

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-start">
        <div className="max-w-xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Create Account</p>
          <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-stone-900 sm:text-5xl">
            Build a private workspace for your renovation planning.
          </h1>
          <p className="text-lg text-stone-600">
            Sign up to store design concepts, export briefs, and keep handoff requests attached to your account.
          </p>
          <p className="text-sm text-stone-600">
            Prefer to browse first? Visit the <Link className="font-semibold text-amber-700 hover:text-amber-800" href="/">homepage</Link>.
          </p>
        </div>

        <Card className="w-full border-stone-300 bg-white shadow-sm lg:max-w-md">
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-stone-900">Sign Up</h2>
              <p className="text-sm text-stone-600">Create your owner-managed TerraMax account.</p>
            </div>
            <SignupForm callbackUrl={callbackUrl} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}