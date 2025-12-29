import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { getEpisodes } from "@/lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // Anime ID
        const episodes = getEpisodes();
        const animeEpisodes = episodes.filter(ep => ep.animeId === id);

        return mobileSuccess(animeEpisodes);
    } catch (error) {
        console.error("Mobile V1 Anime Episodes API Error:", error);
        return mobileError("حدث خطأ أثناء جلب قائمة الحلقات", 500);
    }
}
