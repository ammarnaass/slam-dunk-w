import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // Anime ID

        const episodesData = await prisma.episode.findMany({
            where: { animeId: id },
            orderBy: {
                // Determine order. If I used ID as string, it might be messy.
                // But migration script didn't parse IDs to number if they were strings.
                // However, usually episode IDs are numeric 1, 2, ...
                // Let's try to sort by createdAt desc or ID desc.
                // If ID is string "1", "10", "2", it sorts badly.
                // But typically we want standard order "1", "2", ...
                // If createdAt is available, use it.
                createdAt: 'desc'
            },
            include: {
                servers: true
            }
        });

        // Map to response format if necessary
        const episodes = episodesData.map(ep => ({
            id: ep.id,
            animeId: ep.animeId,
            title: ep.title,
            thumbnail: ep.thumbnail,
            duration: ep.duration,
            createdAt: ep.createdAt.toISOString(),
            servers: ep.servers.map(s => ({
                name: s.name,
                url: s.url,
                quality: s.quality
            }))
        }));

        return mobileSuccess(episodes);
    } catch (error) {
        console.error("Mobile V1 Anime Episodes API (Prisma) Error:", error);
        return mobileError("حدث خطأ أثناء جلب قائمة الحلقات", 500);
    }
}
