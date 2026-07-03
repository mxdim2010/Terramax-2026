import { signOutAction } from "@/app/auth-actions"
import { Button } from "@/components/ui/button"

export function SignOutForm() {
  return (
    <form action={signOutAction}>
      <Button className="rounded-none uppercase tracking-[0.12em]" type="submit" variant="outline">
        Sign Out
      </Button>
    </form>
  )
}