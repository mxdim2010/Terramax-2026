import Link from "next/link"

import { consumeEmailVerificationToken } from "@/lib/auth-tokens"
import { Card, CardContent } from "@/components/ui/card"

type VerifyEmailPageProps = {
  searchParams: Promise<{
    token?: string
  }>
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams
  const token = params.token || ""
  const verifiedEmail = token ? await consumeEmailVerificationToken(token) : null

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Card className="border-stone-300 bg-white shadow-sm">
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Email Verification</p>
              <h1 className="font-display text-3xl uppercase tracking-[0.08em] text-stone-900 sm:text-4xl">
                {verifiedEmail ? "Your account is now active." : "This verification link is no longer valid."}
              </h1>
            </div>

            {verifiedEmail ? (
              <>
                <p className="text-stone-600">
                  {verifiedEmail} has been verified. You can now sign in and access your private TerraMax workspace.
                </p>
                <Link className="inline-flex h-11 items-center justify-center rounded-none bg-stone-900 px-5 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-stone-800" href="/login">
                  Continue to Login
                </Link>
              </>
            ) : (
              <>
                <p className="text-stone-600">
                  The link may have expired, already been used, or been copied incorrectly. Request a fresh verification email from the login page.
                </p>
                <Link className="inline-flex h-11 items-center justify-center rounded-none border border-stone-300 px-5 text-sm font-semibold uppercase tracking-[0.12em] text-stone-700 transition-colors hover:bg-stone-200" href="/login">
                  Back to Login
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}