import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q")?.trim() || "";

        if (!query) {
            return mobileSuccess({ animes: [], episodes: [] });
        }

        let animes: any[] = [];
        let episodes: any[] = [];

        try {
            const [animeResults, episodeResults] = await Promise.all([
                prisma.anime.findMany({
                    where: {
                        OR: [
                            { title: { contains: query, mode: 'insensitive' } },
                            { description: { contains: query, mode: 'insensitive' } }
                        ]
                    },
                    take: 10
                }),
                prisma.episode.findMany({
                    where: {
                        OR: [
                            { title: { contains: query, mode: 'insensitive' } },
                            { description: { contains: query, mode: 'insensitive' } }
                        ]
                    },
                    take: 20
                })
            ]);
            animes = animeResults;
            episodes = episodeResults;
        } catch (dbErr) {
            console.warn("Prisma search failed, attempting local fallback:", dbErr);
        }

        if (animes.length === 0 && episodes.length === 0) {
            try {
                const animesPath = path.join(process.cwd(), "src/data/animes.json");
                const episodesPath = path.join(process.cwd(), "src/data/episodes.json");
                const lowerQuery = query.toLowerCase();

                if (fs.existsSync(animesPath)) {
                    const allAnimes = JSON.parse(fs.readFileSync(animesPath, "utf-8"));
                    animes = (Array.isArray(allAnimes) ? allAnimes : []).filter((a: any) =>
                        (a.title && a.title.toLowerCase().includes(lowerQuery)) ||
                        (a.description && a.description.toLowerCase().includes(lowerQuery)) ||
                        (a.genres && a.genres.some((g: string) => g.toLowerCase().includes(lowerQuery)))
                    );
                }

                if (fs.existsSync(episodesPath)) {
                    const allEpisodes = JSON.parse(fs.readFileSync(episodesPath, "utf-8"));
                    episodes = (Array.isArray(allEpisodes) ? allEpisodes : [])
                        .filter((ep: any) =>
                            (ep.title && ep.title.toLowerCase().includes(lowerQuery)) ||
                            (ep.episode_number && ep.episode_number.toString() === query) ||
                            (ep.description && ep.description.toLowerCase().includes(lowerQuery))
                        )
                        .slice(0, 30);
                }
            } catch (fallbackErr) {
                console.error("Local search fallback failed:", fallbackErr);
            }
        }

        return mobileSuccess({
            animes: animes.map(a => ({
                id: a.id,
                title: a.title,
                description: a.description,
                coverImage: a.coverImage,
                type: a.type || "TV Series",
                status: a.status || "Completed"
            })),
            episodes: episodes.map(ep => ({
                id: ep.id,
                animeId: ep.animeId || "slam-dunk",
                title: ep.title,
                episode_number: ep.episode_number || ep.episodeNumber || 1,
                thumbnail: ep.thumbnail || "/logoep.jpg",
                duration: ep.duration || "23:30"
            }))
        });
    } catch (error) {
        console.error("Mobile V1 Search API Error:", error);
        return mobileError("فشل البحث", 500);
    }
}
