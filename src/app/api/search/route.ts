import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function normalizeArabic(text: string): string {
    if (!text) return "";
    return text
        .toLowerCase()
        .replace(/[أإآ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي")
        .replace(/[\u064B-\u065F]/g, "") // remove tashkeel
        .trim();
}

function getLocalData() {
    try {
        const cwd = process.cwd();
        const dataDir = path.join(cwd, "src/data");
        const animesPath = path.join(dataDir, "animes.json");
        const episodesPath = path.join(dataDir, "episodes.json");
        const charactersPath = path.join(dataDir, "characters.json");

        const animesRaw = fs.existsSync(animesPath) ? JSON.parse(fs.readFileSync(animesPath, "utf-8")) : [];
        const episodesRaw = fs.existsSync(episodesPath) ? JSON.parse(fs.readFileSync(episodesPath, "utf-8")) : [];
        const charactersRaw = fs.existsSync(charactersPath) ? JSON.parse(fs.readFileSync(charactersPath, "utf-8")) : [];

        const animes = Array.isArray(animesRaw) ? animesRaw : (animesRaw.animes || []);
        const episodes = Array.isArray(episodesRaw) ? episodesRaw : (episodesRaw.episodes || []);
        const characters = Array.isArray(charactersRaw) ? charactersRaw : (charactersRaw.characters || []);

        return { animes, episodes, characters };
    } catch (e) {
        console.error("Local data read error in search:", e);
        return { animes: [], episodes: [], characters: [] };
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const rawQuery = searchParams.get("q") || "";
        const query = rawQuery.trim();

        if (!query) {
            return NextResponse.json({ animes: [], episodes: [], characters: [] });
        }

        const normalizedQ = normalizeArabic(query);
        const isNumeric = /^\d+$/.test(query);

        let dbAnimes: any[] = [];
        let dbEpisodes: any[] = [];
        let dbCharacters: any[] = [];

        // Attempt Prisma DB search with strict 1.5s timeout
        try {
            const queryPromise = Promise.all([
                prisma.anime.findMany({
                    where: {
                        OR: [
                            { title: { contains: query, mode: "insensitive" } },
                            { description: { contains: query, mode: "insensitive" } }
                        ]
                    },
                    take: 10
                }),
                prisma.episode.findMany({
                    where: {
                        OR: [
                            { title: { contains: query, mode: "insensitive" } },
                            ...(isNumeric ? [{ episodeNumber: parseInt(query, 10) }] : [])
                        ]
                    },
                    include: {
                        anime: { select: { title: true, id: true } }
                    },
                    take: 15
                }),
                prisma.character.findMany({
                    where: {
                        OR: [
                            { name: { contains: query, mode: "insensitive" } }
                        ]
                    },
                    take: 10
                })
            ]);

            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("Search DB Timeout")), 1500)
            );

            [dbAnimes, dbEpisodes, dbCharacters] = await Promise.race([queryPromise, timeoutPromise]);
        } catch (_) {
            // Graceful fallback to local JSON data
        }

        // Always merge with or fall back to local seed data
        const local = getLocalData();
        const animeMap = new Map((local.animes || []).map((a: any) => [a.id, a.title]));

        // Match Animes
        let finalAnimes = dbAnimes;
        if (!finalAnimes || finalAnimes.length === 0) {
            finalAnimes = (local.animes || []).filter((a: any) => {
                const titleNorm = normalizeArabic(a.title || "");
                const titleArNorm = normalizeArabic(a.title_ar || "");
                const titleEnNorm = normalizeArabic(a.title_en || "");
                const descNorm = normalizeArabic(a.description || "");
                const idNorm = normalizeArabic(a.id || "");
                const genresNorm = (a.genres || []).map((g: string) => normalizeArabic(g));

                return (
                    titleNorm.includes(normalizedQ) ||
                    titleArNorm.includes(normalizedQ) ||
                    titleEnNorm.includes(normalizedQ) ||
                    descNorm.includes(normalizedQ) ||
                    idNorm.includes(normalizedQ) ||
                    genresNorm.some((g: string) => g.includes(normalizedQ))
                );
            }).slice(0, 10);
        }

        // Match Episodes
        let finalEpisodes = dbEpisodes.map((ep: any) => ({
            id: ep.id,
            animeId: ep.animeId || ep.anime?.id || "slam-dunk",
            title: ep.title,
            thumbnail: ep.thumbnail,
            duration: ep.duration || "24 دقيقة",
            episodeNumber: ep.episodeNumber || ep.episode_number || 1,
            animeTitle: ep.anime?.title || animeMap.get(ep.animeId) || "سلام دانك"
        }));

        if (finalEpisodes.length === 0) {
            finalEpisodes = (local.episodes || [])
                .filter((ep: any) => {
                    const epTitleNorm = normalizeArabic(ep.title || "");
                    const epNumStr = String(ep.episode_number || ep.episodeNumber || "");

                    if (isNumeric && epNumStr === query) return true;
                    return epTitleNorm.includes(normalizedQ) || (normalizedQ.includes("حلق") && epTitleNorm.includes(normalizedQ));
                })
                .slice(0, 15)
                .map((ep: any) => ({
                    id: ep.id,
                    animeId: ep.animeId || "slam-dunk",
                    title: ep.title,
                    thumbnail: ep.thumbnail || "/hero-bg.jpg",
                    duration: ep.duration || "24 دقيقة",
                    episodeNumber: ep.episode_number || ep.episodeNumber || 1,
                    animeTitle: animeMap.get(ep.animeId) || "سلام دانك"
                }));
        }

        // Match Characters
        let finalCharacters = dbCharacters.map((c: any) => ({
            id: c.id,
            name: c.name,
            name_ar: c.name,
            image: c.image || "/hero-bg.jpg",
            role: c.role || "شخصية رئيسية",
            team: c.team || "أنمي دايز"
        }));

        if (finalCharacters.length === 0) {
            finalCharacters = (local.characters || [])
                .filter((c: any) => {
                    const nameNorm = normalizeArabic(c.name || "");
                    const nameArNorm = normalizeArabic(c.name_ar || "");
                    const nameEnNorm = normalizeArabic(c.name_en || "");
                    const teamNorm = normalizeArabic(c.team || "");
                    const bioNorm = normalizeArabic(c.bio || "");
                    const idNorm = normalizeArabic(c.id || "");

                    return (
                        nameNorm.includes(normalizedQ) ||
                        nameArNorm.includes(normalizedQ) ||
                        nameEnNorm.includes(normalizedQ) ||
                        teamNorm.includes(normalizedQ) ||
                        bioNorm.includes(normalizedQ) ||
                        idNorm.includes(normalizedQ)
                    );
                })
                .slice(0, 10)
                .map((c: any) => ({
                    id: c.id,
                    name: c.name_ar || c.name,
                    name_en: c.name_en || c.name,
                    image: c.image || "/hero-bg.jpg",
                    role: c.role || "شخصية رئيسية",
                    team: c.team || c.animeTitle || "أنمي دايز"
                }));
        }

        return NextResponse.json({
            animes: finalAnimes,
            episodes: finalEpisodes,
            characters: finalCharacters
        });
    } catch (error) {
        console.error("Root Search GET Error:", error);
        // Never return 500 so frontend never crashes!
        return NextResponse.json({
            animes: [],
            episodes: [],
            characters: []
        });
    }
}
