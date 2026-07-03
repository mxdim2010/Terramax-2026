"use client"

import Link from "next/link"
import { useActionState } from "react"

import { registerUser, type AuthActionState } from "@/app/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialState: AuthActionState = {
  error: "",
  success: "",
}

type SignupFormProps = {
  callbackUrl: string
}

export function SignupForm({ callbackUrl }: SignupFormProps) {
  const [state, formAction, isPending] = useActionState(registerUser, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="name">
          Full Name
        </label>
        <Input id="name" name="name" autoComplete="name" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="signup-email">
          Email
        </label>
        <Input id="signup-email" name="email" type="email" autoComplete="email" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="signup-password">
          Password
        </label>
        <Input id="signup-password" name="password" type="password" autoComplete="new-password" required minLength={8} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="company">
            Company
          </label>
          <Input id="company" name="company" autoComplete="organization" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="phone">
            Phone
          </label>
          <Input id="phone" name="phone" autoComplete="tel" />
        </div>
      </div>

      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}

      <Button className="w-full rounded-none bg-stone-900 uppercase tracking-[0.12em] hover:bg-stone-800" disabled={isPending} type="submit">
        {isPending ? "Creating Account..." : "Create Account"}
      </Button>

      <p className="text-sm text-stone-600">
        Already registered? <Link className="font-semibold text-amber-700 hover:text-amber-800" href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>Log in</Link>
      </p>
    </form>
  )
}