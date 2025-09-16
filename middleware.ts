import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple public paths; everything else is treated as protected
const PUBLIC_PATHS = new Set<string>(["/", "/signin", "/signup", "/_next", "/favicon.ico"])

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow API and static assets
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.startsWith("/public")) {
    return NextResponse.next()
  }

  // Public pages
  if (pathname === "/" || pathname === "/signin" || pathname === "/signup") {
    return NextResponse.next()
  }

  const isAuthenticated = request.cookies.get("isAuthenticated")?.value === "true"

  // Protected routes: redirect to root if not authed
  if (!isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Run on all routes to apply simple protection, except static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}


