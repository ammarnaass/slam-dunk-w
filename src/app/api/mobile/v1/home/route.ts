import { NextResponse } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function getLocalData() {
    try {
        const cwd = process.cwd();
        const animesPath = path.join(cwd, "src/data/animes.json");
        const episodesPath = path.join(cwd, "src/data/episodes.json");
        const settingsPath = path.join(cwd, "src/data/settings.json");

        const animes = fs.existsSync(animesPath) ? JSON.parse(fs.readFileSync(animesPath, "utf-8")) : [];
        const episodes = fs.existsSync(episodesPath) ? JSON.parse(fs.readFileSync(episodesPath, "utf-8")) : [];
        const settings = fs.existsSync(settingsPath) ? JSON.parse(fs.readFileSync(settingsPath, "utf-8")) : {};

        return { animes, episodes, settings };
    } catch (e) {
        console.error("Failed to read local fallback data:", e);
        return { animes: [], episodes: [], settings: {} };
    }
}

export async function GET() {
    try {
        let featuredAnimes: any[] = [];
        let latestEpisodes: any[] = [];
        let settings: any = null;

        try {
            const [animesRes, epsRes, settingsRes] = await Promise.all([
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
            featuredAnimes = animesRes;
            latestEpisodes = epsRes;
            settings = settingsRes;
        } catch (dbErr) {
            console.warn("Neon DB query failed for mobile home, using local data fallback:", dbErr);
        }

        // Fallback to local files if DB is unavailable or empty
        if (!featuredAnimes || featuredAnimes.length === 0) {
            const local = getLocalData();
            featuredAnimes = local.animes;
            if (!settings) settings = local.settings;

            if (!latestEpisodes || latestEpisodes.length === 0) {
                const animeMap = new Map((local.animes || []).map((a: any) => [a.id, a]));
                latestEpisodes = (local.episodes || []).slice(0, 15).map((ep: any) => ({
                    ...ep,
                    episodeNumber: ep.episode_number || 1,
                    seasonNumber: ep.season || 1,
                    anime: animeMap.get(ep.animeId) || { title: "سلام دانك", coverImage: "/hero-bg.jpg" }
                }));
            }
        }

        const isSliderActive = settings?.homeConfig?.slider?.isEnabled !== false;
        const sliderLimit = Number(settings?.homeConfig?.slider?.maxSlides) || 5;
        const sliderList = isSliderActive ? featuredAnimes.slice(0, sliderLimit) : [];

        const data = {
            slider: sliderList.map((a: any) => ({
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
                animeId: ep.animeId || ep.anime?.id || "slam-dunk",
                title: ep.title,
                description: ep.anime?.description || ep.description || "",
                episode_number: ep.episodeNumber || ep.episode_number || 1,
                season_number: ep.seasonNumber || ep.season || 1,
                thumbnail: ep.thumbnail || ep.anime?.coverImage || "",
                duration: ep.duration || "23:30",
                mega_link: ep.mega_link || "",
                animeTitle: ep.anime?.title || "سلام دانك",
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
                    title: "الأعمال المميزة",
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
                    isEnabled: settings?.admobEnabled || settings?.admob?.isEnabled || false,
                    appId: settings?.admobAppId || settings?.admob?.appId,
                    bannerId: settings?.admobBannerId || settings?.admob?.bannerId,
                    interstitialId: settings?.admobInterstitialId || settings?.admob?.interstitialId
                },
                apiApp: {
                    isMaintenance: settings?.maintenanceMode || settings?.apiApp?.isMaintenance || false,
                    maintenanceMessage: settings?.maintenanceMessage || settings?.apiApp?.maintenanceMessage || "صيانة دورية",
                    latestVersion: settings?.latestVersion || settings?.apiApp?.latestVersion || "1.0.0",
                    updateUrl: settings?.updateUrl || settings?.apiApp?.updateUrl || ""
                }
            }
        };

        return mobileSuccess(data);
    } catch (error) {
        console.error("Mobile Home API Error:", error);
        return mobileError("حدث خطأ أثناء جلب بيانات الصفحة الرئيسية", 500);
    }
}
