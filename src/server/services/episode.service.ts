import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prismadb";
import { AppError, ErrorCode } from "../types/errors";
import { resolveStreamUrl, categorizeServers } from "@/lib/resolvers";

const DATA_DIR = path.join(process.cwd(), "src/data");

function loadLocalEpisodes(): any[] {
    try {
        const filePath = path.join(DATA_DIR, "episodes.json");
        if (fs.existsSync(filePath)) {
            const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            return Array.isArray(raw) ? raw : [];
        }
    } catch (e) {
        console.error("Local episodes fallback error:", e);
    }
    return [];
}

export class EpisodeService {
    static async getAnimeEpisodes(animeSlug: string, options: { page?: number; limit?: number } = {}) {
        if (!animeSlug) {
            throw new AppError(ErrorCode.BAD_REQUEST, "معرّف العمل مطلوب", 400);
        }

        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 100;
        const skip = (page - 1) * limit;

        let dbEpisodes: any[] = [];
        let totalCount = 0;

        try {
            [dbEpisodes, totalCount] = await Promise.all([
                prisma.episode.findMany({
                    where: { animeId: animeSlug },
                    orderBy: { episodeNumber: "asc" },
                    skip,
                    take: limit,
                    include: {
                        servers: true
                    }
                }),
                prisma.episode.count({ where: { animeId: animeSlug } })
            ]);
        } catch (dbErr) {
            console.warn("Prisma error in getAnimeEpisodes:", dbErr);
        }

        if (dbEpisodes.length === 0 && totalCount === 0) {
            const list = loadLocalEpisodes().filter(ep => ep.animeId === animeSlug || !ep.animeId);
            totalCount = list.length;
            dbEpisodes = list.slice(skip, skip + limit).map(ep => ({
                id: String(ep.id),
                animeId: ep.animeId || animeSlug,
                title: ep.title,
                description: ep.description || null,
                thumbnail: ep.thumbnail || "/logoep.jpg",
                duration: ep.duration || "23:30",
                episodeNumber: ep.episode_number || Number(ep.id) || 1,
                seasonNumber: ep.season || 1,
                servers: [
                    ...(ep.mega_link ? [{ id: `srv-mega-${ep.id}`, name: "سيرفر Mega الرئيسي", url: ep.mega_link, quality: "1080p FHD" }] : []),
                    ...(ep.video_url ? [{ id: `srv-direct-${ep.id}`, name: "سيرفر البث المباشر", url: ep.video_url, quality: "720p HD" }] : [])
                ]
            }));
        }

        return {
            items: dbEpisodes,
            meta: {
                page,
                limit,
                total: totalCount,
                nextCursor: skip + limit < totalCount ? String(page + 1) : null
            }
        };
    }

    static async getEpisodeById(id: string) {
        if (!id) {
            throw new AppError(ErrorCode.BAD_REQUEST, "معرّف الحلقة مطلوب", 400);
        }

        let episode: any = null;

        try {
            episode = await prisma.episode.findUnique({
                where: { id },
                include: {
                    servers: {
                        orderBy: [
                            { isWorking: "desc" },
                            { priority: "asc" }
                        ]
                    },
                    anime: {
                        select: {
                            id: true,
                            title: true,
                            coverImage: true,
                            bannerImage: true
                        }
                    }
                }
            });
        } catch (dbErr) {
            console.warn("Prisma error in getEpisodeById:", dbErr);
        }

        if (!episode) {
            const list = loadLocalEpisodes();
            const found = list.find(ep => String(ep.id) === String(id) || String(ep.episodeNumber) === String(id) || String(ep.episode_number) === String(id));
            if (found) {
                const epNum = found.episode_number || Number(found.id) || 1;
                const rawServers = found.servers && found.servers.length > 0 
                    ? found.servers 
                    : [
                        ...(found.mega_link ? [{ id: `srv-mega-${found.id}`, name: "سيرفر ميجا الخارق", url: found.mega_link, quality: "1080p FHD" }] : []),
                        ...(found.video_url ? [{ id: `srv-direct-${found.id}`, name: "سيرفر البث المباشر", url: found.video_url, quality: "720p HD" }] : [])
                    ];

                episode = {
                    id: String(found.id),
                    animeId: found.animeId || "slam-dunk",
                    title: found.title,
                    description: found.description,
                    thumbnail: found.thumbnail || "/logoep.jpg",
                    duration: found.duration || "23:30",
                    episodeNumber: epNum,
                    seasonNumber: found.season || 1,
                    servers: rawServers,
                    anime: {
                        id: "slam-dunk",
                        title: "سلام دانك (Slam Dunk)",
                        coverImage: "/hero-bg.jpg"
                    }
                };
            }
        }

        if (!episode) {
            throw new AppError(ErrorCode.EPISODE_NOT_FOUND, "الحلقة المطلوبة غير موجودة", 404);
        }

        // Format and resolve all servers
        const rawServersList = Array.isArray(episode.servers) ? episode.servers : [];
        const formattedServers = rawServersList.map((s: any, idx: number) => {
            const resolved = resolveStreamUrl(s.url, s.quality || undefined);
            return {
                id: s.id || `srv-${idx + 1}`,
                name: s.name || resolved.defaultName,
                url: s.url,
                directUrl: s.directUrl || resolved.directUrl,
                embedUrl: resolved.embedUrl,
                downloadUrl: resolved.downloadUrl,
                provider: s.provider || resolved.provider,
                category: s.category || resolved.category,
                type: s.type || resolved.type,
                quality: s.quality || resolved.quality,
                matrixCategory: resolved.matrixCategory,
                isDirectPlayable: resolved.isDirectPlayable,
                priority: s.priority || idx + 1,
                isWorking: s.isWorking ?? true,
                latencyMs: s.latencyMs ?? null,
                lastCheckedAt: s.lastCheckedAt ?? null,
                supportedQualities: s.supportedQualities && s.supportedQualities.length > 0 
                    ? s.supportedQualities 
                    : resolved.supportedQualities
            };
        });

        const classified = categorizeServers(formattedServers);

        return {
            ...episode,
            servers: formattedServers,
            watchServers: classified.watchServers,
            downloadServers: classified.downloadServers,
            directServers: classified.directServers,
            backupServers: classified.backupServers,
        };
    }
}
