"use client"

import { useActionState } from "react"

import { resetPassword, type AuthActionState } from "@/app/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialState: AuthActionState = {
  error: "",
  success: "",
}

type ResetPasswordFormProps = {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(resetPassword, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="token" value={token} />

      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="new-password">
          New Password
        </label>
        <Input id="new-password" name="password" type="password" autoComplete="new-password" required minLength={8} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="confirm-password">
          Confirm Password
        </label>
        <Input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} />
      </div>

      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}

      <Button className="w-full rounded-none bg-stone-900 uppercase tracking-[0.12em] hover:bg-stone-800" disabled={isPending} type="submit">
        {isPending ? "Updating..." : "Update Password"}
      </Button>
    </form>
  )
}