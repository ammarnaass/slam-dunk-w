import { notFound } from "next/navigation";
import { Suspense } from "react";
import { prisma } from "@/lib/prismadb";
import { Metadata } from "next";
import fs from "fs";
import path from "path";
import WatchClientTheater from "./components/WatchClientTheater";

interface PageProps {
    params: Promise<{ id: string }>;
}

function getLocalEpisodeData(id: string) {
    try {
        const episodesPath = path.join(process.cwd(), "src/data/episodes.json");
        const animesPath = path.join(process.cwd(), "src/data/animes.json");

        if (fs.existsSync(episodesPath)) {
            const allEpisodes = JSON.parse(fs.readFileSync(episodesPath, "utf-8"));
            const rawEp = allEpisodes.find((e: any) => 
                String(e.id) === String(id) || 
                String(e.episodeNumber) === String(id) || 
                String(e.episode_number) === String(id)
            );

            if (rawEp) {
                let animeData = {
                    id: "slam-dunk",
                    title: "Slam Dunk (سلام دانك)",
                    description: "هاناميتشي ساكوراجي هو جانح سيئ السمعة يخشاه الطلاب في مدرسته. بعد رفضه من قبل 50 فتاة، يلتقي بهاروكو أكاجي، الفتاة التي ستقوده إلى عالم كرة السلة.",
                    coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTxpjOV_-f3YQQLUb_T_57HXpyZ4NIlMatMg&s",
                    bannerImage: "/hero-bg.jpg"
                };

                if (fs.existsSync(animesPath)) {
                    try {
                        const allAnimes = JSON.parse(fs.readFileSync(animesPath, "utf-8"));
                        const animesList = Array.isArray(allAnimes) ? allAnimes : (allAnimes.animes || []);
                        const foundAnime = animesList.find((a: any) => a.id === (rawEp.animeId || "slam-dunk"));
                        if (foundAnime) animeData = foundAnime;
                    } catch (e) {
                        console.error("Error reading animes.json in watch fallback:", e);
                    }
                }

                const epNum = rawEp.episodeNumber || rawEp.episode_number || Number(rawEp.id) || 1;
                const seasonNum = rawEp.seasonNumber || rawEp.season || (epNum <= 60 ? 1 : 2);

                const episode = {
                    id: String(rawEp.id),
                    animeId: rawEp.animeId || "slam-dunk",
                    title: rawEp.title || `الحلقة ${epNum}`,
                    description: rawEp.description || `الحلقة ${epNum} من أنمي ${animeData.title}. تابع مغامرات ساكوراجي وفريق شوهوكو.`,
                    thumbnail: rawEp.thumbnail || "/logoep.jpg",
                    duration: rawEp.duration || "23:30",
                    episodeNumber: epNum,
                    seasonNumber: seasonNum,
                    anime: animeData,
                    servers: rawEp.servers && rawEp.servers.length > 0 ? rawEp.servers : [
                        ...(rawEp.mega_link ? [{ id: `srv-mega-${rawEp.id}`, name: "سيرفر ميجا السريع", url: rawEp.mega_link, quality: "1080p FHD" }] : []),
                        ...(rawEp.video_url ? [{ id: `srv-direct-${rawEp.id}`, name: "سيرفر البث المباشر", url: rawEp.video_url, quality: "720p HD" }] : [])
                    ],
                    mega_link: rawEp.mega_link || "",
                    video_url: rawEp.video_url || ""
                };

                const animeEpisodes = allEpisodes
                    .filter((e: any) => e.animeId === (rawEp.animeId || "slam-dunk") || !e.animeId)
                    .map((e: any) => ({
                        id: String(e.id),
                        title: e.title || `الحلقة ${e.episodeNumber || e.episode_number || e.id}`,
                        episodeNumber: e.episodeNumber || e.episode_number || Number(e.id) || 1,
                        seasonNumber: e.seasonNumber || e.season || 1,
                        thumbnail: e.thumbnail || "/logoep.jpg",
                        duration: e.duration || "23:30"
                    }))
                    .sort((a: any, b: any) => (a.episodeNumber || 0) - (b.episodeNumber || 0));

                return { episode, anime: animeData, animeEpisodes };
            }
        }
    } catch (err) {
        console.error("Local fallback error in watch page:", err);
    }
    return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    let episode: any = null;

    try {
        episode = await prisma.episode.findUnique({
            where: { id },
            include: { anime: { select: { title: true } } }
        });
    } catch {
        // Fallback to local
    }

    if (!episode) {
        const local = getLocalEpisodeData(id);
        if (local) episode = local.episode;
    }

    if (!episode) return { title: "الحلقة غير موجودة" };

    return {
        title: `${episode.title} - ${episode.anime?.title || "مشاهدة"} | ANIME DAZE`,
        description: `شاهد ${episode.title} من أنمي ${episode.anime?.title} بدقة فائقة وترجمة ودبلجة حصرية على ANIME DAZE.`,
    };
}

export default async function WatchPage({ params }: PageProps) {
    const { id } = await params;

    let episode: any = null;
    let animeEpisodes: any[] = [];
    let anime: any = null;

    try {
        episode = await prisma.episode.findUnique({
            where: { id },
            include: {
                servers: true,
                anime: true
            }
        });
        if (episode) {
            anime = episode.anime;
            animeEpisodes = await prisma.episode.findMany({
                where: { animeId: episode.animeId },
                orderBy: { episodeNumber: 'asc' }
            });
        }
    } catch (dbErr) {
        console.warn("Neon DB error in WatchPage, falling back to local dataset:", dbErr);
    }

    // Local JSON Fallback if DB doesn't have it or connection fails
    if (!episode) {
        const local = getLocalEpisodeData(id);
        if (local) {
            episode = local.episode;
            anime = local.anime;
            animeEpisodes = local.animeEpisodes;
        }
    }

    if (!episode) {
        notFound();
    }

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full border-3 border-primary-container border-t-transparent animate-spin" />
                <span className="font-cairo text-sm text-primary font-bold">جاري إعداد المسرح السينمائي...</span>
            </div>
        }>
            <WatchClientTheater
                episode={episode}
                anime={anime}
                animeEpisodes={animeEpisodes}
            />
        </Suspense>
    );
}
