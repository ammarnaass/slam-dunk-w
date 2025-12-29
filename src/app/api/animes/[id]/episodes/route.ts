import { NextResponse } from "next/server";
import { getEpisodes } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const episodes = getEpisodes();
    // Filter by animeId
    const animeEpisodes = episodes.filter(ep => ep.animeId === id);

    // Sort
    animeEpisodes.sort((a, b) => a.episode_number - b.episode_number);

    return NextResponse.json(animeEpisodes);
}
