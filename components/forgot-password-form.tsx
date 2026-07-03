"use client"

import { useActionState } from "react"

import { requestPasswordReset, type AuthActionState } from "@/app/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialState: AuthActionState = {
  error: "",
  success: "",
}

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="forgot-email">
          Email
        </label>
        <Input id="forgot-email" name="email" type="email" autoComplete="email" required />
      </div>

      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}

      <Button className="w-full rounded-none bg-stone-900 uppercase tracking-[0.12em] hover:bg-stone-800" disabled={isPending} type="submit">
        {isPending ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  )
}