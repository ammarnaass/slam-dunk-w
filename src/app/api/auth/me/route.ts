import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";

export async function GET() {
    try {
        const session = await getSession();

        if (!session || !session.user) {
            return NextResponse.json(null);
        }

        let user = null;
        try {
            user = await prisma.user.findUnique({
                where: { id: session.user.id },
                include: {
                    subscription: true
                }
            });
        } catch (dbErr) {
            console.warn("DB fetch failed in /api/auth/me, returning session user fallback:", dbErr);
        }

        if (user) {
            return NextResponse.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: (user.name === "admin" || user.email === "admin@slamdunk.com" || user.role?.toUpperCase() === "ADMIN") ? "ADMIN" : user.role,
                profileImage: user.avatar,
                avatar: user.avatar,
                gender: user.gender,
                phoneNumber: user.phoneNumber,
                birthDate: user.birthDate,
                createdAt: user.createdAt,
                watchlist: user.watchlist || [],
                subscription: user.subscription || null
            });
        }

        // Fallback to session user data
        return NextResponse.json({
            id: session.user.id,
            name: session.user.name || "مستخدم",
            email: session.user.email,
            role: (session.user.name === "admin" || session.user.email === "admin@slamdunk.com" || session.user.role?.toUpperCase() === "ADMIN") ? "ADMIN" : (session.user.role || "user"),
            profileImage: session.user.avatar || session.user.profileImage,
            avatar: session.user.avatar || session.user.profileImage,
            createdAt: session.user.createdAt || new Date().toISOString(),
            watchlist: session.user.watchlist || [],
            subscription: session.user.subscription || null
        });
    } catch (error) {
        console.error("Error in /api/auth/me:", error);
        return NextResponse.json(null, { status: 500 });
    }
}
