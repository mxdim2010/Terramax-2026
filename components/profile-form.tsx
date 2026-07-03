"use client"

import { useActionState } from "react"

import { updateProfile, type AuthActionState } from "@/app/auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialState: AuthActionState = {
  error: "",
  success: "",
}

type ProfileFormProps = {
  email: string
  name: string
  company: string
  phone: string
}

export function ProfileForm({ email, name, company, phone }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="profile-name">
            Full Name
          </label>
          <Input id="profile-name" name="name" defaultValue={name} required />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="profile-email">
            Email
          </label>
          <Input id="profile-email" value={email} disabled readOnly />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="profile-company">
            Company
          </label>
          <Input id="profile-company" name="company" defaultValue={company} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-600" htmlFor="profile-phone">
            Phone
          </label>
          <Input id="profile-phone" name="phone" defaultValue={phone} />
        </div>
      </div>

      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}

      <Button className="rounded-none bg-stone-900 uppercase tracking-[0.12em] hover:bg-stone-800" disabled={isPending} type="submit">
        {isPending ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
}