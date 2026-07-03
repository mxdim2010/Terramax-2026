"use client"

import { useActionState } from "react"

import { resendVerificationEmail, type AuthActionState } from "@/app/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialState: AuthActionState = {
  error: "",
  success: "",
}

type ResendVerificationFormProps = {
  email?: string
}

export function ResendVerificationForm({ email = "" }: ResendVerificationFormProps) {
  const [state, formAction, isPending] = useActionState(resendVerificationEmail, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="verification-email">
          Email
        </label>
        <Input id="verification-email" name="email" type="email" autoComplete="email" defaultValue={email} required />
      </div>

      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}

      <Button className="rounded-none uppercase tracking-[0.12em]" disabled={isPending} type="submit" variant="outline">
        {isPending ? "Sending..." : "Resend Verification"}
      </Button>
    </form>
  )
}