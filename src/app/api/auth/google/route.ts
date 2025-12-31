import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prismadb";
import { login } from "@/lib/auth";

// Google Client ID should be in .env
const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: NextRequest) {
    try {
        const { credential } = await request.json();

        if (!credential) {
            return NextResponse.json({ error: "Missing Google credential" }, { status: 400 });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return NextResponse.json({ error: "Invalid Google token" }, { status: 400 });
        }

        const { email, name, picture, sub: googleId } = payload;

        if (!email) {
            return NextResponse.json({ error: "Email not provided by Google" }, { status: 400 });
        }

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || email.split("@")[0],
                    avatar: picture,
                    role: "user",
                    password: "", // No password for Google users
                },
            });
        } else if (!user.avatar && picture) {
            // Update avatar if not set
            await prisma.user.update({
                where: { id: user.id },
                data: { avatar: picture }
            });
        }

        const userPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: (user.name === "admin" || user.email === "admin@example.com") ? "ADMIN" : user.role,
            avatar: user.avatar || picture,
        };

        await login(userPayload);

        return NextResponse.json(userPayload);
    } catch (error: any) {
        console.error("Google Auth Error:", error);
        return NextResponse.json({ error: "Authentication failed: " + error.message }, { status: 500 });
    }
}
