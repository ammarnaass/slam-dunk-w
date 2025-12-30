import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getSession } from "@/lib/auth";

async function getAuthUser() {
    const session = await getSession();
    if (!session || !session.user) return null;
    return session.user;
}

export async function POST(req: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { animeId } = await req.json();
        if (!animeId) {
            return NextResponse.json({ error: "Anime ID is required" }, { status: 400 });
        }

        // Fetch user watchlist
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { watchlist: true }
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const currentWatchlist = dbUser.watchlist || [];
        const isInWatchlist = currentWatchlist.includes(animeId);

        let updatedWatchlist: string[];
        if (isInWatchlist) {
            updatedWatchlist = currentWatchlist.filter((id) => id !== animeId);
        } else {
            updatedWatchlist = [...currentWatchlist, animeId];
        }

        // Update user
        await prisma.user.update({
            where: { id: user.id },
            data: { watchlist: updatedWatchlist }
        });

        return NextResponse.json({
            success: true,
            inWatchlist: !isInWatchlist,
            watchlist: updatedWatchlist
        });
    } catch (error) {
        console.error("Watchlist error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { watchlist: true }
        });

        return NextResponse.json({
            watchlist: dbUser?.watchlist || []
        });
    } catch (error) {
        console.error("Watchlist GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
