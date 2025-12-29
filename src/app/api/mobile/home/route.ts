import { NextResponse } from "next/server";
import { getAnimes, getEpisodes, getSettings } from "@/lib/db";
import { Anime, Episode } from "@/types";

export async function GET() {
    try {
        const animes = getAnimes();
        const episodes = getEpisodes();
        const settings = getSettings();

        // 1. Slider Animes (based on settings)
        const sliderAnimes = animes.filter(a => settings.sliderAnimeIds.includes(a.id));

        // 2. Latest Episodes (top 10)
        const latestEpisodes = episodes
            .sort((a, b) => b.id.localeCompare(a.id)) // Assuming IDs or timestamp help
            .slice(0, 10)
            .map(ep => {
                const anime = animes.find(a => a.id === ep.animeId);
                return {
                    ...ep,
                    animeTitle: anime?.title || "Unknown Anime",
                    animeCover: anime?.coverImage || ""
                };
            });

        // 3. Recommended / Trending (e.g., Ongoing)
        const trendingAnimes = animes.filter(a => a.status === "Ongoing").slice(0, 10);

        // 4. Categories (Mapping genres to lists)
        const categories = settings.socialLinks ? ["الكل", "رياضة", "دراما", "أكشن", "مغامرة"] : [];
        // Note: For now, I'll return a hardcoded but useful list of sections
        const sections = [
            { title: "الأكثر مشاهدة", items: animes.slice(0, 6) },
            { title: "أضيف حديثاً", items: animes.reverse().slice(0, 6) }
        ];

        return NextResponse.json({
            sliderAnimes,
            latestEpisodes,
            trendingAnimes,
            sections,
            settings: {
                siteName: settings.siteName,
                socialLinks: settings.socialLinks,
                admob: settings.admob
            }
        });
    } catch (error) {
        console.error("Mobile Home API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
