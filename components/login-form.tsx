"use client"

import Link from "next/link"
import { useActionState } from "react"

import { authenticate, type AuthActionState } from "@/app/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialState: AuthActionState = {
  error: "",
  success: "",
}

type LoginFormProps = {
  callbackUrl: string
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(authenticate, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="email">
          Email
        </label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="password">
          Password
        </label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>

      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}

      <Button className="w-full rounded-none bg-stone-900 uppercase tracking-[0.12em] hover:bg-stone-800" disabled={isPending} type="submit">
        {isPending ? "Signing In..." : "Sign In"}
      </Button>

      <p className="text-sm text-stone-600">
        Need an account? <Link className="font-semibold text-amber-700 hover:text-amber-800" href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}>Create one</Link>
      </p>
      <p className="text-sm text-stone-600">
        Forgot your password? <Link className="font-semibold text-amber-700 hover:text-amber-800" href="/forgot-password">Reset it</Link>
      </p>
    </form>
  )
}