import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prismadb";
import { AppError, ErrorCode } from "../types/errors";

const DATA_DIR = path.join(process.cwd(), "src/data");

export interface AnimeFilters {
    q?: string;
    genre?: string;
    year?: number;
    status?: "all" | "ongoing" | "completed";
    sort?: "latest" | "rating" | "year" | "title";
    page?: number;
    limit?: number;
}

function loadLocalAnimes(): any[] {
    try {
        const filePath = path.join(DATA_DIR, "animes.json");
        if (fs.existsSync(filePath)) {
            const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            return Array.isArray(raw) ? raw : (raw.animes || []);
        }
    } catch (e) {
        console.error("Local animes fallback error:", e);
    }
    return [];
}

export class AnimeService {
    static async getAnimes(filters: AnimeFilters = {}) {
        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;
        const skip = (page - 1) * limit;

        let dbAnimes: any[] = [];
        let totalCount = 0;

        try {
            const whereClause: any = {};

            if (filters.q) {
                whereClause.OR = [
                    { title: { contains: filters.q, mode: "insensitive" } },
                    { description: { contains: filters.q, mode: "insensitive" } }
                ];
            }

            if (filters.genre) {
                whereClause.genres = { has: filters.genre };
            }

            if (filters.year) {
                whereClause.releaseYear = filters.year;
            }

            if (filters.status && filters.status !== "all") {
                whereClause.status = { equals: filters.status, mode: "insensitive" };
            }

            const orderByClause: any = {};
            switch (filters.sort) {
                case "rating":
                    orderByClause.rating = "desc";
                    break;
                case "year":
                    orderByClause.releaseYear = "desc";
                    break;
                case "title":
                    orderByClause.title = "asc";
                    break;
                case "latest":
                default:
                    orderByClause.updatedAt = "desc";
                    break;
            }

            [dbAnimes, totalCount] = await Promise.all([
                prisma.anime.findMany({
                    where: whereClause,
                    orderBy: orderByClause,
                    skip,
                    take: limit
                }),
                prisma.anime.count({ where: whereClause })
            ]);
        } catch (dbErr) {
            console.warn("Prisma error in getAnimes, falling back to local files:", dbErr);
        }

        // Resilient fallback to local json if DB is empty or failed
        if (dbAnimes.length === 0 && totalCount === 0) {
            let list = loadLocalAnimes();

            if (filters.q) {
                const query = filters.q.toLowerCase();
                list = list.filter(a =>
                    (a.id && a.id.toLowerCase().includes(query)) ||
                    (a.title && a.title.toLowerCase().includes(query)) ||
                    (a.title_ar && a.title_ar.toLowerCase().includes(query)) ||
                    (a.description && a.description.toLowerCase().includes(query))
                );
            }

            if (filters.genre) {
                list = list.filter(a =>
                    Array.isArray(a.genres) && a.genres.some((g: string) => g.toLowerCase() === filters.genre?.toLowerCase())
                );
            }

            if (filters.year) {
                list = list.filter(a => Number(a.releaseYear) === filters.year);
            }

            if (filters.status && filters.status !== "all") {
                list = list.filter(a => a.status && a.status.toLowerCase() === filters.status?.toLowerCase());
            }

            if (filters.sort === "title") {
                list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
            } else if (filters.sort === "rating") {
                list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            }

            totalCount = list.length;
            dbAnimes = list.slice(skip, skip + limit);
        }

        return {
            items: dbAnimes,
            meta: {
                page,
                limit,
                total: totalCount,
                nextCursor: skip + limit < totalCount ? String(page + 1) : null
            }
        };
    }

    static async getAnimeBySlug(slug: string) {
        if (!slug) {
            throw new AppError(ErrorCode.BAD_REQUEST, "معرّف العمل مطلوب", 400);
        }

        let anime: any = null;

        try {
            anime = await prisma.anime.findUnique({
                where: { id: slug },
                include: {
                    _count: {
                        select: { episodes: true, reviews: true }
                    }
                }
            });
        } catch (dbErr) {
            console.warn("Prisma error in getAnimeBySlug:", dbErr);
        }

        if (!anime) {
            const list = loadLocalAnimes();
            anime = list.find(a => a.id === slug);
            if (anime) {
                anime = {
                    ...anime,
                    _count: {
                        episodes: anime.totalEpisodes || 101,
                        reviews: 0
                    }
                };
            }
        }

        if (!anime) {
            throw new AppError(ErrorCode.ANIME_NOT_FOUND, "العمل المطلوب غير موجود", 404);
        }

        return anime;
    }

    static async getGenres(): Promise<string[]> {
        try {
            const animes = await prisma.anime.findMany({ select: { genres: true } });
            const set = new Set<string>();
            animes.forEach(a => {
                if (Array.isArray(a.genres)) {
                    a.genres.forEach(g => set.add(g.trim()));
                }
            });
            if (set.size > 0) return Array.from(set);
        } catch (_) {}

        const list = loadLocalAnimes();
        const fallbackSet = new Set<string>();
        list.forEach(a => {
            if (Array.isArray(a.genres)) {
                a.genres.forEach((g: string) => fallbackSet.add(g.trim()));
            }
        });

        const defaults = ["رياضة", "كوميديا", "مدرسي", "شونين", "أكشن", "دراما", "غموض"];
        defaults.forEach(d => fallbackSet.add(d));
        return Array.from(fallbackSet);
    }
}
