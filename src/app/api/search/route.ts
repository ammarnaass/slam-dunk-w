import { NextResponse } from "next/server";
import { getAnimes, getEpisodes } from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase();

    if (!query) return NextResponse.json({ animes: [], episodes: [] });

    const animes = getAnimes();
    const episodes = getEpisodes();

    const filteredAnimes = animes.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.genres.some(g => g.toLowerCase().includes(query))
    );

    const filteredEpisodes = episodes.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
    ).slice(0, 10); // Limit episodes for preview

    // Enrich episodes with anime title
    const enrichedEpisodes = filteredEpisodes.map(ep => {
        const anime = animes.find(a => a.id === ep.animeId);
        return {
            ...ep,
            animeTitle: anime?.title || "أنمي"
        };
    });

    return NextResponse.json({
        animes: filteredAnimes,
        episodes: enrichedEpisodes
    });
}
