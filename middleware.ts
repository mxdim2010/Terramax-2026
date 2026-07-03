import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

function hasSessionCookie(request: NextRequest): boolean {
  return (
    Boolean(request.cookies.get("authjs.session-token")?.value) ||
    Boolean(request.cookies.get("__Secure-authjs.session-token")?.value)
  )
}

export default function middleware(request: NextRequest) {
  if (hasSessionCookie(request)) {
    return NextResponse.next()
  }

  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/interior-design-helper/:path*"],
}