import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    const { pathname, search } = request.nextUrl;

    // Define protected routes
    const isProtectedRoute = pathname.startsWith('/admin') ||
        pathname.startsWith('/profile') ||
        pathname.startsWith('/checkout');

    // Define auth routes (pages that shouldn't be accessible if logged in)
    const isAuthRoute = pathname === '/login' || pathname === '/register';

    if (isProtectedRoute && !session) {
        // Redirect to login if trying to access a protected route without a session
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname + search);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && session) {
        // Redirect to home if already logged in and trying to access login/register
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Next.js convention for this project uses proxy instead of middleware
export const config = {
    matcher: ['/admin/:path*', '/profile/:path*', '/checkout/:path*', '/login', '/register'],
};
