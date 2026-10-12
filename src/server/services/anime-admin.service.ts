import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prismadb";
import { AppError, ErrorCode } from "../types/errors";
import { CreateAnimeDto, UpdateAnimeDto, AnimeAdminData } from "../types/anime-admin.types";
import { animeAdminSchema } from "../validators/anime-admin.validator";

const DATA_DIR = path.join(process.cwd(), "src/data");
const ANIMES_FILE = path.join(DATA_DIR, "animes.json");

function loadLocalAnimes(): any[] {
    try {
        if (fs.existsSync(ANIMES_FILE)) {
            const content = fs.readFileSync(ANIMES_FILE, "utf-8");
            const parsed = JSON.parse(content);
            return Array.isArray(parsed) ? parsed : (parsed.animes || []);
        }
    } catch (e) {
        console.error("Failed to read local animes.json:", e);
    }
    return [];
}

function saveLocalAnimes(list: any[]) {
    try {
        fs.writeFileSync(ANIMES_FILE, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {
        console.error("Failed to write local animes.json:", e);
    }
}

/**
 * Generate a clean, human-readable SEO slug
 */
function generateSlug(title: string, customId?: string, englishTitle?: string | null): string {
    if (customId && customId.trim()) {
        return customId
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    }

    const source = (englishTitle && englishTitle.trim()) ? englishTitle : title;
    let slug = source
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    if (!slug) {
        // Fallback for Arabic characters
        const translitMap: Record<string, string> = {
            "سلام دانك": "slam-dunk",
            "كونان": "conan",
            "ون بيس": "one-piece",
            "القناص": "hunter-x-hunter",
            "دراغون بول": "dragon-ball",
            "سبيستون": "spacetoon"
        };
        for (const [ar, en] of Object.entries(translitMap)) {
            if (title.includes(ar)) return en;
        }
        slug = "anime-" + Math.random().toString(36).substring(2, 7);
    }

    return slug;
}

export class AnimeAdminService {
    /**
     * List all animes with merged extended metadata
     */
    static async getAllAnimes(): Promise<AnimeAdminData[]> {
        let dbList: any[] = [];
        try {
            dbList = await prisma.anime.findMany({
                orderBy: { updatedAt: "desc" }
            });
        } catch (dbErr) {
            console.warn("Prisma fetch failed, using local JSON:", dbErr);
        }

        const localList = loadLocalAnimes();
        const localMap = new Map<string, any>(localList.map(a => [a.id, a]));

        if (dbList.length > 0) {
            return dbList.map(dbAnime => {
                const localExt = localMap.get(dbAnime.id) || {};
                return {
                    id: dbAnime.id,
                    title: dbAnime.title,
                    title_en: localExt.title_en || null,
                    title_jp: localExt.title_jp || null,
                    description: dbAnime.description,
                    coverImage: dbAnime.coverImage,
                    bannerImage: dbAnime.bannerImage || localExt.bannerImage || null,
                    trailerUrl: localExt.trailerUrl || null,
                    type: (dbAnime.type || "TV Series") as any,
                    status: (dbAnime.status || "Ongoing") as any,
                    totalEpisodes: dbAnime.totalEpisodes || 0,
                    releaseYear: dbAnime.releaseYear || null,
                    genres: dbAnime.genres || [],
                    rating: dbAnime.rating || localExt.rating || 9.0,
                    isFeatured: dbAnime.isFeatured || false,
                    isTrending: dbAnime.isTrending || false,
                    planet: localExt.planet || (dbAnime.genres?.[0] ? dbAnime.genres[0] : "مغامرات"),
                    studio: localExt.studio || "Toei Animation",
                    ageRating: localExt.ageRating || "+16",
                    audioLanguage: localExt.audioLanguage || "dubbed",
                    quality: localExt.quality || "4K",
                    createdAt: dbAnime.createdAt,
                    updatedAt: dbAnime.updatedAt
                };
            });
        }

        return localList.map(item => ({
            id: item.id,
            title: item.title,
            title_en: item.title_en || null,
            title_jp: item.title_jp || null,
            description: item.description,
            coverImage: item.coverImage,
            bannerImage: item.bannerImage || null,
            trailerUrl: item.trailerUrl || null,
            type: item.type || "TV Series",
            status: item.status || "Ongoing",
            totalEpisodes: item.totalEpisodes || 0,
            releaseYear: item.releaseYear || null,
            genres: item.genres || [],
            rating: item.rating || 9.0,
            isFeatured: item.isFeatured || false,
            isTrending: item.isTrending || false,
            planet: item.planet || "مغامرات",
            studio: item.studio || "Toei Animation",
            ageRating: item.ageRating || "+16",
            audioLanguage: item.audioLanguage || "dubbed",
            quality: item.quality || "4K"
        }));
    }

    /**
     * Get single anime by ID with merged attributes
     */
    static async getAnimeById(id: string): Promise<AnimeAdminData> {
        let dbAnime: any = null;
        try {
            dbAnime = await prisma.anime.findUnique({
                where: { id }
            });
        } catch (_) {}

        const localList = loadLocalAnimes();
        const localAnime = localList.find(a => a.id === id);

        if (!dbAnime && !localAnime) {
            throw new AppError(ErrorCode.NOT_FOUND, "العمل المطلوب غير موجود", 404);
        }

        const base = dbAnime || localAnime;
        const localExt = localAnime || {};

        return {
            id: base.id,
            title: base.title,
            title_en: localExt.title_en || null,
            title_jp: localExt.title_jp || null,
            description: base.description,
            coverImage: base.coverImage,
            bannerImage: base.bannerImage || localExt.bannerImage || null,
            trailerUrl: localExt.trailerUrl || null,
            type: (base.type || "TV Series") as any,
            status: (base.status || "Ongoing") as any,
            totalEpisodes: base.totalEpisodes || 0,
            releaseYear: base.releaseYear || null,
            genres: base.genres || [],
            rating: base.rating || localExt.rating || 9.0,
            isFeatured: base.isFeatured || false,
            isTrending: base.isTrending || false,
            planet: localExt.planet || (base.genres?.[0] || "مغامرات"),
            studio: localExt.studio || "Toei Animation",
            ageRating: localExt.ageRating || "+16",
            audioLanguage: localExt.audioLanguage || "dubbed",
            quality: localExt.quality || "4K",
            createdAt: base.createdAt,
            updatedAt: base.updatedAt
        };
    }

    /**
     * Create a new Anime with dual-write persistence
     */
    static async createAnime(data: CreateAnimeDto): Promise<AnimeAdminData> {
        const validation = animeAdminSchema.safeParse(data);
        if (!validation.success) {
            const firstMsg = validation.error.issues[0]?.message || "بيانات العمل غير صالحة";
            throw new AppError(ErrorCode.BAD_REQUEST, firstMsg, 400);
        }

        const valid = validation.data;
        let slug = generateSlug(valid.title, valid.id, valid.title_en);

        // Check if slug already exists
        const localList = loadLocalAnimes();
        let exists = localList.some(a => a.id === slug);
        try {
            const dbExists = await prisma.anime.findUnique({ where: { id: slug } });
            if (dbExists) exists = true;
        } catch (_) {}

        if (exists) {
            slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
        }

        const richRecord: any = {
            id: slug,
            title: valid.title.trim(),
            title_en: valid.title_en?.trim() || null,
            title_jp: valid.title_jp?.trim() || null,
            description: valid.description.trim(),
            coverImage: valid.coverImage.trim(),
            bannerImage: valid.bannerImage?.trim() || null,
            trailerUrl: valid.trailerUrl?.trim() || null,
            type: valid.type || "TV Series",
            status: valid.status || "Ongoing",
            totalEpisodes: Number(valid.totalEpisodes) || 0,
            releaseYear: valid.releaseYear ? Number(valid.releaseYear) : null,
            genres: valid.genres || [],
            rating: Number(valid.rating) || 9.0,
            isFeatured: Boolean(valid.isFeatured),
            isTrending: Boolean(valid.isTrending),
            planet: valid.planet || "مغامرات",
            studio: valid.studio || "Toei Animation",
            ageRating: valid.ageRating || "+16",
            audioLanguage: valid.audioLanguage || "dubbed",
            quality: valid.quality || "4K",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // 1. Prisma database write
        try {
            await prisma.anime.create({
                data: {
                    id: slug,
                    title: richRecord.title,
                    description: richRecord.description,
                    coverImage: richRecord.coverImage,
                    bannerImage: richRecord.bannerImage,
                    type: richRecord.type,
                    status: richRecord.status,
                    totalEpisodes: richRecord.totalEpisodes,
                    releaseYear: richRecord.releaseYear,
                    genres: richRecord.genres,
                    rating: richRecord.rating,
                    isFeatured: richRecord.isFeatured,
                    isTrending: richRecord.isTrending
                }
            });
        } catch (dbErr) {
            console.warn("Prisma anime.create failed, continuing with local JSON save:", dbErr);
        }

        // 2. Local JSON dual-save
        localList.unshift(richRecord);
        saveLocalAnimes(localList);

        return richRecord;
    }

    /**
     * Update existing Anime
     */
    static async updateAnime(id: string, data: UpdateAnimeDto): Promise<AnimeAdminData> {
        const existing = await this.getAnimeById(id);

        const merged: any = {
            ...existing,
            ...data,
            id: existing.id,
            totalEpisodes: data.totalEpisodes !== undefined ? Number(data.totalEpisodes) : existing.totalEpisodes,
            releaseYear: data.releaseYear !== undefined ? (data.releaseYear ? Number(data.releaseYear) : null) : existing.releaseYear,
            rating: data.rating !== undefined ? Number(data.rating) : existing.rating,
            updatedAt: new Date().toISOString()
        };

        // 1. Update Prisma
        try {
            await prisma.anime.update({
                where: { id },
                data: {
                    title: merged.title,
                    description: merged.description,
                    coverImage: merged.coverImage,
                    bannerImage: merged.bannerImage,
                    type: merged.type,
                    status: merged.status,
                    totalEpisodes: merged.totalEpisodes,
                    releaseYear: merged.releaseYear,
                    genres: merged.genres,
                    rating: merged.rating,
                    isFeatured: merged.isFeatured,
                    isTrending: merged.isTrending
                }
            });
        } catch (dbErr) {
            console.warn("Prisma anime.update failed, continuing with local JSON save:", dbErr);
        }

        // 2. Update local JSON
        const localList = loadLocalAnimes();
        const index = localList.findIndex(a => a.id === id);
        if (index >= 0) {
            localList[index] = { ...localList[index], ...merged };
        } else {
            localList.push(merged);
        }
        saveLocalAnimes(localList);

        return merged;
    }

    /**
     * Delete an Anime
     */
    static async deleteAnime(id: string): Promise<boolean> {
        try {
            await prisma.anime.delete({ where: { id } });
        } catch (dbErr) {
            console.warn("Prisma anime.delete failed:", dbErr);
        }

        const localList = loadLocalAnimes().filter(a => a.id !== id);
        saveLocalAnimes(localList);
        return true;
    }
}
