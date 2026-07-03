import Link from "next/link"

import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { Card, CardContent } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-stone-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-start">
        <div className="max-w-xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Password Reset</p>
          <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-stone-900 sm:text-5xl">
            Request a secure reset link.
          </h1>
          <p className="text-lg text-stone-600">
            We will send a short-lived reset URL to the email address attached to your TerraMax account.
          </p>
          <p className="text-sm text-stone-600">
            Remembered your password? <Link className="font-semibold text-amber-700 hover:text-amber-800" href="/login">Return to login</Link>.
          </p>
        </div>

        <Card className="w-full border-stone-300 bg-white shadow-sm lg:max-w-md">
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-stone-900">Forgot Password</h2>
              <p className="text-sm text-stone-600">Enter your account email to receive a reset link.</p>
            </div>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}