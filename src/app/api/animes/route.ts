import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET() {
    try {
        const animes = await prisma.anime.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        return NextResponse.json(animes);
    } catch (error) {
        console.error("Root Animes GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch animes" }, { status: 500 });
    }
}
