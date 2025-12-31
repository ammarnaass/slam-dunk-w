import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";

// Toggle anime in user's watchlist
export async function POST(request: Request) {
    try {
        const session = await getSession();

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { animeId } = await request.json();

        if (!animeId) {
            return NextResponse.json({ error: "Anime ID is required" }, { status: 400 });
        }

        // Get current user
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const currentWatchlist = user.watchlist || [];
        let updatedWatchlist: string[];
        let action: string;

        // Toggle: if anime is in watchlist, remove it; otherwise, add it
        if (currentWatchlist.includes(animeId)) {
            updatedWatchlist = currentWatchlist.filter((id: string) => id !== animeId);
            action = "removed";
        } else {
            updatedWatchlist = [...currentWatchlist, animeId];
            action = "added";
        }

        // Update user watchlist
        await prisma.user.update({
            where: { id: session.user.id },
            data: { watchlist: updatedWatchlist }
        });

        return NextResponse.json({
            success: true,
            action,
            watchlist: updatedWatchlist
        });
    } catch (error) {
        console.error("Watchlist API error:", error);
        return NextResponse.json({ error: "Failed to update watchlist" }, { status: 500 });
    }
}
