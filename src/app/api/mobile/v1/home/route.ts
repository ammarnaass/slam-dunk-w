import { NextResponse } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";

export async function GET() {
    try {
        const [featuredAnimes, latestEpisodes, settings] = await Promise.all([
            prisma.anime.findMany({
                where: { isFeatured: true },
                take: 5
            }),
            prisma.episode.findMany({
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: { anime: true }
            }),
            prisma.settings.findUnique({
                where: { id: "global" }
            })
        ]);

        const data = {
            slider: featuredAnimes.map((a: any) => ({
                id: a.id,
                title: a.title,
                description: a.description,
                coverImage: a.coverImage,
                bannerImage: a.bannerImage || a.coverImage,
                type: a.type || "Anime",
                status: a.status || "Ongoing",
                totalEpisodes: a.totalEpisodes || 0,
                releaseYear: a.releaseYear?.toString() || "",
                genres: a.genres || []
            })),
            latest: latestEpisodes.map((ep: any) => ({
                id: ep.id,
                animeId: ep.animeId,
                title: ep.title,
                description: ep.anime?.description || "",
                episode_number: ep.episodeNumber || 1,
                season_number: ep.seasonNumber || 1,
                thumbnail: ep.thumbnail || ep.anime?.coverImage || "",
                duration: ep.duration || "24:00",
                mega_link: "", // Fallback or fetch from servers if needed
                animeTitle: ep.anime?.title || "أنمي",
                animeCover: ep.anime?.coverImage || ""
            })),
            ongoing: featuredAnimes.map((a: any) => ({
                id: a.id,
                title: a.title,
                description: a.description,
                coverImage: a.coverImage,
                bannerImage: a.bannerImage || a.coverImage,
                type: a.type || "Anime",
                status: a.status || "Ongoing",
                totalEpisodes: a.totalEpisodes || 0,
                releaseYear: a.releaseYear?.toString() || "",
                genres: a.genres || []
            })),
            sections: [
                {
                    title: "الأنميات المقترحة",
                    items: featuredAnimes.map((a: any) => ({
                        id: a.id,
                        title: a.title,
                        description: a.description,
                        coverImage: a.coverImage,
                        bannerImage: a.bannerImage || a.coverImage,
                        type: a.type || "Anime",
                        status: a.status || "Ongoing",
                        totalEpisodes: a.totalEpisodes || 0,
                        releaseYear: a.releaseYear?.toString() || "",
                        genres: a.genres || []
                    }))
                }
            ],
            settings: {
                admob: {
                    isEnabled: settings?.admobEnabled || false,
                    appId: settings?.admobAppId,
                    bannerId: settings?.admobBannerId,
                    interstitialId: settings?.admobInterstitialId
                },
                apiApp: {
                    isMaintenance: settings?.maintenanceMode || false,
                    maintenanceMessage: settings?.maintenanceMessage || "Maintenance mode...",
                    latestVersion: settings?.latestVersion || "1.0.0",
                    updateUrl: settings?.updateUrl || ""
                }
            }
        };

        return mobileSuccess(data);
    } catch (error) {
        console.error("Mobile Home API Error:", error);
        return mobileError("حدث خطأ أثناء جلب بيانات الصفحة الرئيسية", 500);
    }
}
