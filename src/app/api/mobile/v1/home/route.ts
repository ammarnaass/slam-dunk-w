import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { getAnimes, getEpisodes, getSettings } from "@/lib/db";

export async function GET() {
    try {
        const animes = getAnimes();
        const episodes = getEpisodes();
        const settings = getSettings();

        // 1. Slider Animes
        const sliderAnimes = animes
            .filter(a => settings.sliderAnimeIds.includes(a.id))
            .map(a => ({
                id: a.id,
                title: a.title,
                coverImage: a.coverImage,
                bannerImage: a.bannerImage || a.coverImage,
            }));

        // 2. Latest Episodes
        const latestEpisodes = episodes
            .sort((a, b) => b.id.localeCompare(a.id))
            .slice(0, 15)
            .map(ep => {
                const anime = animes.find(a => a.id === ep.animeId);
                return {
                    id: ep.id,
                    animeId: ep.animeId,
                    title: ep.title,
                    thumbnail: ep.thumbnail || anime?.coverImage || "",
                    animeTitle: anime?.title || "Unknown",
                    duration: ep.duration || "",
                    createdAt: ep.id, // Fallback to ID if no date
                };
            });

        // 3. Trending/Ongoing
        const ongoingAnimes = animes
            .filter(a => a.status === "Ongoing")
            .slice(0, 10)
            .map(a => ({
                id: a.id,
                title: a.title,
                coverImage: a.coverImage,
                status: a.status,
                genres: a.genres,
            }));

        // 4. Custom Sections
        const sections = [
            {
                title: "أضيف حديثاً",
                items: animes.slice(-10).reverse().map(a => ({
                    id: a.id,
                    title: a.title,
                    coverImage: a.coverImage,
                }))
            }
        ];

        return mobileSuccess({
            slider: sliderAnimes,
            latest: latestEpisodes,
            ongoing: ongoingAnimes,
            sections,
            settings: {
                siteName: settings.siteName,
                admob: settings.admob,
                socialLinks: settings.socialLinks
            }
        });
    } catch (error) {
        console.error("Mobile V1 Home API Error:", error);
        return mobileError("Failed to load home data", 500);
    }
}
