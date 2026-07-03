"use client"

import { useActionState } from "react"

import { changePassword, type AuthActionState } from "@/app/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialState: AuthActionState = {
  error: "",
  success: "",
}

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePassword, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="current-password">
          Current Password
        </label>
        <Input id="current-password" name="currentPassword" type="password" autoComplete="current-password" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="new-password-account">
          New Password
        </label>
        <Input id="new-password-account" name="newPassword" type="password" autoComplete="new-password" required minLength={8} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="confirm-password-account">
          Confirm New Password
        </label>
        <Input id="confirm-password-account" name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} />
      </div>

      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}

      <Button className="rounded-none bg-stone-900 uppercase tracking-[0.12em] hover:bg-stone-800" disabled={isPending} type="submit">
        {isPending ? "Updating..." : "Change Password"}
      </Button>
    </form>
  )
}