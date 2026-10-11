import { prisma } from "@/lib/prismadb";
import { EpisodeService } from "./episode.service";
import { AnimeService } from "./anime.service";
import { AppError, ErrorCode } from "../types/errors";

// In-memory store for fallback resilience
const memoryProgress = new Map<string, any>();
const memoryFavorites = new Map<string, any>();

function makeProgressKey(userId: string, episodeId: string) {
    return `${userId}:${episodeId}`;
}

function makeFavoriteKey(userId: string, type: string, id: string) {
    return `${userId}:${type}:${id}`;
}

export class UserService {
    /**
     * Save watch progress (Position in seconds and duration)
     */
    static async saveProgress(userId: string, episodeId: string, positionSeconds: number, durationSeconds = 0) {
        if (!userId || !episodeId) {
            throw new AppError(ErrorCode.BAD_REQUEST, "معرف المستخدم ورقم الحلقة مطلوبان", 400);
        }

        const completed = durationSeconds > 0 ? (positionSeconds / durationSeconds) >= 0.9 : false;

        let progressRecord: any = null;

        try {
            progressRecord = await prisma.watchProgress.upsert({
                where: {
                    userId_episodeId: { userId, episodeId }
                },
                update: {
                    positionSeconds,
                    durationSeconds,
                    completed,
                    updatedAt: new Date()
                },
                create: {
                    userId,
                    episodeId,
                    positionSeconds,
                    durationSeconds,
                    completed
                }
            });

            // Also maintain legacy History model for backward compatibility
            try {
                const ep = await EpisodeService.getEpisodeById(episodeId).catch(() => null);
                if (ep) {
                    const ratio = durationSeconds > 0 ? positionSeconds / durationSeconds : 0;
                    await prisma.history.upsert({
                        where: {
                            userId_animeId_episodeId: {
                                userId,
                                animeId: ep.animeId || "slam-dunk",
                                episodeId
                            }
                        },
                        update: {
                            progress: ratio,
                            watchedAt: new Date()
                        },
                        create: {
                            userId,
                            animeId: ep.animeId || "slam-dunk",
                            episodeId,
                            progress: ratio
                        }
                    });
                }
            } catch (_) {}
        } catch (dbErr) {
            console.warn("Prisma saveProgress failed, saving to memory fallback:", dbErr);
            const key = makeProgressKey(userId, episodeId);
            progressRecord = {
                userId,
                episodeId,
                positionSeconds,
                durationSeconds,
                completed,
                updatedAt: new Date()
            };
            memoryProgress.set(key, progressRecord);
        }

        return progressRecord;
    }

    /**
     * Get Continue Watching list
     */
    static async getContinueWatching(userId: string, limit = 10) {
        if (!userId) {
            throw new AppError(ErrorCode.UNAUTHORIZED, "يرجى تسجيل الدخول", 401);
        }

        let rawList: any[] = [];

        try {
            rawList = await prisma.watchProgress.findMany({
                where: {
                    userId,
                    completed: false,
                    positionSeconds: { gt: 5 } // Only show if watched more than 5 seconds
                },
                orderBy: { updatedAt: "desc" },
                take: limit
            });
        } catch (_) {
            for (const item of memoryProgress.values()) {
                if (item.userId === userId && !item.completed && item.positionSeconds > 5) {
                    rawList.push(item);
                }
            }
            rawList.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
            rawList = rawList.slice(0, limit);
        }

        // Enrich with episode and anime metadata
        const enriched = await Promise.all(
            rawList.map(async (item) => {
                try {
                    const ep = await EpisodeService.getEpisodeById(item.episodeId);
                    return {
                        episodeId: item.episodeId,
                        positionSeconds: item.positionSeconds,
                        durationSeconds: item.durationSeconds,
                        percentage: item.durationSeconds > 0 ? Math.round((item.positionSeconds / item.durationSeconds) * 100) : 0,
                        updatedAt: item.updatedAt,
                        episode: {
                            id: ep.id,
                            title: ep.title,
                            episodeNumber: ep.episodeNumber,
                            thumbnail: ep.thumbnail,
                            duration: ep.duration
                        },
                        anime: ep.anime || { id: ep.animeId, title: "سلام دانك" }
                    };
                } catch (_) {
                    return null;
                }
            })
        );

        return enriched.filter(Boolean);
    }

    /**
     * Get User Watch History
     */
    static async getHistory(userId: string, options: { page?: number; limit?: number } = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 20;
        const skip = (page - 1) * limit;

        let total = 0;
        let rawList: any[] = [];

        try {
            [rawList, total] = await Promise.all([
                prisma.watchProgress.findMany({
                    where: { userId },
                    orderBy: { updatedAt: "desc" },
                    skip,
                    take: limit
                }),
                prisma.watchProgress.count({ where: { userId } })
            ]);
        } catch (_) {
            const userItems = Array.from(memoryProgress.values()).filter(p => p.userId === userId);
            total = userItems.length;
            rawList = userItems
                .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                .slice(skip, skip + limit);
        }

        const items = await Promise.all(
            rawList.map(async (item) => {
                const ep = await EpisodeService.getEpisodeById(item.episodeId).catch(() => null);
                return {
                    episodeId: item.episodeId,
                    positionSeconds: item.positionSeconds,
                    durationSeconds: item.durationSeconds,
                    completed: item.completed,
                    updatedAt: item.updatedAt,
                    episode: ep ? {
                        id: ep.id,
                        title: ep.title,
                        episodeNumber: ep.episodeNumber,
                        thumbnail: ep.thumbnail
                    } : null
                };
            })
        );

        return {
            items,
            meta: {
                page,
                limit,
                total,
                nextCursor: skip + limit < total ? String(page + 1) : null
            }
        };
    }

    /**
     * Get Favorites list
     */
    static async getFavorites(userId: string) {
        if (!userId) {
            throw new AppError(ErrorCode.UNAUTHORIZED, "يرجى تسجيل الدخول", 401);
        }

        let rawList: any[] = [];

        try {
            rawList = await prisma.favorite.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" }
            });
        } catch (_) {
            for (const item of memoryFavorites.values()) {
                if (item.userId === userId) {
                    rawList.push(item);
                }
            }
        }

        const items = await Promise.all(
            rawList.map(async (fav) => {
                if (fav.targetType === "anime") {
                    const anime = await AnimeService.getAnimeBySlug(fav.targetId).catch(() => null);
                    return {
                        id: fav.id,
                        type: "anime",
                        targetId: fav.targetId,
                        createdAt: fav.createdAt,
                        data: anime
                    };
                } else {
                    const episode = await EpisodeService.getEpisodeById(fav.targetId).catch(() => null);
                    return {
                        id: fav.id,
                        type: "episode",
                        targetId: fav.targetId,
                        createdAt: fav.createdAt,
                        data: episode
                    };
                }
            })
        );

        return items.filter(i => i.data !== null);
    }

    /**
     * Add to Favorites
     */
    static async addFavorite(userId: string, targetType: "anime" | "episode", targetId: string) {
        let favoriteRecord: any = null;

        try {
            favoriteRecord = await prisma.favorite.upsert({
                where: {
                    userId_targetType_targetId: { userId, targetType, targetId }
                },
                update: {},
                create: {
                    userId,
                    targetType,
                    targetId
                }
            });
        } catch (dbErr) {
            const key = makeFavoriteKey(userId, targetType, targetId);
            favoriteRecord = {
                id: key,
                userId,
                targetType,
                targetId,
                createdAt: new Date()
            };
            memoryFavorites.set(key, favoriteRecord);
        }

        return { favorited: true, item: favoriteRecord };
    }

    /**
     * Remove from Favorites
     */
    static async removeFavorite(userId: string, targetType: "anime" | "episode", targetId: string) {
        try {
            await prisma.favorite.deleteMany({
                where: { userId, targetType, targetId }
            });
        } catch (_) {
            const key = makeFavoriteKey(userId, targetType, targetId);
            memoryFavorites.delete(key);
        }

        return { removed: true };
    }
}
