import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";

export async function GET() {
    try {
        const session = await getSession();

        if (!session || !session.user) {
            return NextResponse.json(null);
        }

        // Fetch full user data from database
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                subscription: true
            }
        });

        if (!user) {
            return NextResponse.json(null);
        }

        // Return user data with properly mapped fields
        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.avatar,
            avatar: user.avatar,
            createdAt: user.createdAt,
            watchlist: user.watchlist || [],
            subscription: user.subscription || null
        });
    } catch (error) {
        console.error("Error in /api/auth/me:", error);
        return NextResponse.json(null, { status: 500 });
    }
}
