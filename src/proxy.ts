import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    const path = request.nextUrl.pathname;

    const isPublicPath = path === "/login" || path === "/register";
    const user = session ? await decrypt(session) : null;

    // 1. If trying to access admin routes
    if (path.startsWith("/admin")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        // Check if user has admin role
        if (user.user.role !== "ADMIN") {
            // Redirect to home if logged in but not admin
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // 2. If trying to access protected user routes (like profile)
    // Add other protected routes here if needed
    if (path.startsWith("/profile")) {
        if (!user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // 3. If accessing public auth pages (login/register) while logged in
    if (isPublicPath && user) {
        if (user.user.role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/login", "/register", "/profile"],
};
