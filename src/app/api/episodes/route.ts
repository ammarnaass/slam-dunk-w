import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET() {
    try {
        const episodes = await prisma.episode.findMany({
            include: {
                anime: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to latest 50 for the public feed
        });

        const enrichedEpisodes = episodes.map(ep => ({
            id: ep.id,
            animeId: ep.animeId,
            title: ep.title,
            thumbnail: ep.thumbnail,
            duration: ep.duration,
            createdAt: ep.createdAt.toISOString(),
            animeTitle: ep.anime?.title || "أنمي غير معروف"
        }));

        return NextResponse.json(enrichedEpisodes);
    } catch (error) {
        console.error("Root Episodes GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch episodes" }, { status: 500 });
    }
}
