import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    // Allow login page
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Check admin session cookie
    const adminSession = request.cookies.get("admin_session");

    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
