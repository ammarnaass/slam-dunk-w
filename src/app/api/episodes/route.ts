import { NextResponse } from "next/server";
import { getEpisodes, getAnimes } from "@/lib/db";

export async function GET() {
    const episodes = getEpisodes();
    const animes = getAnimes();

    // Enrich episodes with anime title
    const enrichedEpisodes = episodes.map(ep => {
        const anime = animes.find(a => a.id === ep.animeId);
        return {
            ...ep,
            animeTitle: anime?.title || "أنمي غير معروف"
        };
    });

    return NextResponse.json(enrichedEpisodes);
}
