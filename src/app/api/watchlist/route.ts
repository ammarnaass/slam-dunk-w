import { NextRequest, NextResponse } from "next/server";
import { getUsers, saveUsers } from "@/lib/db";
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

        const users = getUsers();
        const userIndex = users.findIndex((u) => u.id === user.id);

        if (userIndex === -1) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const currentUser = users[userIndex];
        if (!currentUser.watchlist) {
            currentUser.watchlist = [];
        }

        const isInWatchlist = currentUser.watchlist.includes(animeId);

        if (isInWatchlist) {
            // Remove from watchlist
            currentUser.watchlist = currentUser.watchlist.filter((id) => id !== animeId);
        } else {
            // Add to watchlist
            currentUser.watchlist.push(animeId);
        }

        users[userIndex] = currentUser;
        saveUsers(users);

        return NextResponse.json({
            success: true,
            inWatchlist: !isInWatchlist,
            watchlist: currentUser.watchlist
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

    const users = getUsers();
    const currentUser = users.find((u) => u.id === user.id);

    return NextResponse.json({
        watchlist: currentUser?.watchlist || []
    });
}
