import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q") || "";

        if (!query || query.length < 2) {
            return NextResponse.json({ animes: [], episodes: [] });
        }

        // Search Animes
        const animes = await prisma.anime.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { genres: { hasSome: [query] } }
                ]
            },
            take: 10
        });

        // Search Episodes
        const episodes = await prisma.episode.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } }
                ]
            },
            include: {
                anime: {
                    select: { title: true }
                }
            },
            take: 10
        });

        const enrichedEpisodes = episodes.map(ep => ({
            id: ep.id,
            animeId: ep.animeId,
            title: ep.title,
            thumbnail: ep.thumbnail,
            duration: ep.duration,
            createdAt: ep.createdAt.toISOString(),
            animeTitle: ep.anime?.title || "أنمي"
        }));

        return NextResponse.json({
            animes: animes,
            episodes: enrichedEpisodes
        });
    } catch (error) {
        console.error("Root Search GET Error:", error);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
