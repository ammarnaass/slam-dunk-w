import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        let episodes: any[] = [];

        try {
            episodes = await prisma.episode.findMany({
                include: {
                    anime: {
                        select: {
                            title: true
                        }
                    }
                },
                orderBy: { episodeNumber: 'asc' },
                take: 150
            });
        } catch (dbErr) {
            console.warn("Neon DB query failed for episodes feed, using local fallback:", dbErr);
        }

        if (!episodes || episodes.length === 0) {
            const episodesPath = path.join(process.cwd(), "src/data/episodes.json");
            const animesPath = path.join(process.cwd(), "src/data/animes.json");

            if (fs.existsSync(episodesPath)) {
                const rawEpisodes = JSON.parse(fs.readFileSync(episodesPath, "utf-8"));
                let animesMap: Record<string, string> = { "slam-dunk": "Slam Dunk" };

                if (fs.existsSync(animesPath)) {
                    try {
                        const rawAnimes = JSON.parse(fs.readFileSync(animesPath, "utf-8"));
                        const animesList = Array.isArray(rawAnimes) ? rawAnimes : (rawAnimes.animes || []);
                        animesList.forEach((a: any) => { animesMap[a.id] = a.title; });
                    } catch (e) {
                        console.error("Error reading animes.json:", e);
                    }
                }

                const enriched = (rawEpisodes || []).map((ep: any) => ({
                    id: String(ep.id),
                    animeId: ep.animeId || "slam-dunk",
                    title: ep.title,
                    thumbnail: ep.thumbnail || "/logoep.jpg",
                    duration: ep.duration || "23:30",
                    episodeNumber: ep.episodeNumber || ep.episode_number || Number(ep.id) || 1,
                    seasonNumber: ep.seasonNumber || ep.season || 1,
                    createdAt: new Date().toISOString(),
                    animeTitle: animesMap[ep.animeId || "slam-dunk"] || "Slam Dunk",
                    mega_link: ep.mega_link || "",
                    video_url: ep.video_url || ""
                })).sort((a: any, b: any) => (a.episodeNumber || 0) - (b.episodeNumber || 0));

                return NextResponse.json(enriched);
            }
        }

        const enrichedEpisodes = episodes.map(ep => ({
            id: ep.id,
            animeId: ep.animeId,
            title: ep.title,
            thumbnail: ep.thumbnail || "/logoep.jpg",
            duration: ep.duration || "23:30",
            episodeNumber: ep.episodeNumber,
            seasonNumber: ep.seasonNumber,
            createdAt: ep.createdAt.toISOString(),
            animeTitle: ep.anime?.title || "Slam Dunk"
        })).sort((a: any, b: any) => (a.episodeNumber || 0) - (b.episodeNumber || 0));

        return NextResponse.json(enrichedEpisodes);
    } catch (error) {
        console.error("Root Episodes GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch episodes" }, { status: 500 });
    }
}
