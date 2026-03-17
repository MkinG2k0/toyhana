import { NextResponse } from "next/server"
import type { NextFetchEvent, NextRequest } from "next/server"
import { auth } from "@/shared/lib/auth"

type MiddlewareHandler = (
  request: NextRequest,
  event: NextFetchEvent
) => ReturnType<ReturnType<typeof auth>>

const PROTECTED_ROUTES = ["/dashboard", "/booking"]
const OWNER_ROUTES = ["/dashboard"]
const AUTH_ROUTES = ["/login", "/register"]

const withAuth = auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth?.user
  const userRole = (req.auth?.user as { role?: string } | undefined)?.role

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  if (isProtected && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname)
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
    )
  }

  const isOwnerRoute = OWNER_ROUTES.some((r) => pathname.startsWith(r))
  if (isOwnerRoute && userRole !== "OWNER" && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return (withAuth as unknown as MiddlewareHandler)(request, event)
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/booking/:path*",
    "/login",
    "/register",
  ],
}
