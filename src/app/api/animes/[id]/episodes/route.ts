import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const episodes = await prisma.episode.findMany({
            where: { animeId: id },
            orderBy: { createdAt: 'asc' } // Heuristic for order if no number exists
        });

        // If your episodes have numeric titles or we need to sort by number:
        const sortedEpisodes = episodes.sort((a, b) => {
            const numA = parseInt(a.title.match(/\d+/)?.at(0) || "0");
            const numB = parseInt(b.title.match(/\d+/)?.at(0) || "0");
            return numA - numB;
        });

        return NextResponse.json(sortedEpisodes);
    } catch (error) {
        console.error("Root Anime Episodes GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch episodes" }, { status: 500 });
    }
}
