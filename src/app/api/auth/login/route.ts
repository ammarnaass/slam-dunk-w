import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        // Simple hardcoded credentials
        // In a real app, use environment variables and hashed passwords
        const ADMIN_USER = process.env.ADMIN_USER || 'admin';
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

        if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
            // Set a cookie
            (await cookies()).set('admin_session', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
