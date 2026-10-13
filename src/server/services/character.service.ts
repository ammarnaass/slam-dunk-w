import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prismadb";
import { AppError, ErrorCode } from "../types/errors";

const DATA_DIR = path.join(process.cwd(), "src/data");

function loadLocalCharacters(): any[] {
    try {
        const filePath = path.join(DATA_DIR, "characters.json");
        if (fs.existsSync(filePath)) {
            const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            return Array.isArray(raw) ? raw : [];
        }
    } catch (e) {
        console.error("Local characters fallback error:", e);
    }
    return [];
}

export class CharacterService {
    static async getCharacters(options: { 
        animeId?: string; 
        role?: string; 
        search?: string; 
        team?: string; 
        page?: number; 
        limit?: number 
    } = {}) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const limit = options.limit && options.limit > 0 ? options.limit : 50;
        const skip = (page - 1) * limit;

        let dbCharacters: any[] = [];
        let totalCount = 0;

        try {
            const whereClause: any = {};
            if (options.animeId) {
                whereClause.animeId = { equals: options.animeId, mode: "insensitive" };
            }
            if (options.team) {
                whereClause.team = { equals: options.team, mode: "insensitive" };
            }
            if (options.role) {
                whereClause.role = { contains: options.role, mode: "insensitive" };
            }
            if (options.search) {
                const s = options.search.trim();
                whereClause.OR = [
                    { name: { contains: s, mode: "insensitive" } },
                    { name_ar: { contains: s, mode: "insensitive" } },
                    { name_en: { contains: s, mode: "insensitive" } },
                    { name_jp: { contains: s, mode: "insensitive" } },
                    { description: { contains: s, mode: "insensitive" } },
                ];
            }

            [dbCharacters, totalCount] = await Promise.all([
                prisma.character.findMany({
                    where: whereClause,
                    orderBy: { createdAt: "asc" },
                    skip,
                    take: limit
                }),
                prisma.character.count({ where: whereClause })
            ]);
        } catch (dbErr) {
            console.warn("Prisma error in getCharacters:", dbErr);
        }

        if (dbCharacters.length === 0 && totalCount === 0) {
            let list = loadLocalCharacters();
            if (options.animeId) {
                list = list.filter(c => c.animeId && c.animeId.toLowerCase() === options.animeId?.toLowerCase());
            }
            if (options.team) {
                list = list.filter(c => c.team && c.team.toLowerCase().includes(options.team?.toLowerCase() || ""));
            }
            if (options.role) {
                list = list.filter(c => c.role && c.role.toLowerCase().includes(options.role?.toLowerCase() || ""));
            }
            if (options.search) {
                const q = options.search.toLowerCase().trim();
                list = list.filter(c =>
                    (c.name || "").toLowerCase().includes(q) ||
                    (c.name_ar || "").toLowerCase().includes(q) ||
                    (c.name_en || "").toLowerCase().includes(q) ||
                    (c.name_jp || "").toLowerCase().includes(q) ||
                    (c.description || "").toLowerCase().includes(q)
                );
            }
            totalCount = list.length;
            dbCharacters = list.slice(skip, skip + limit);
        }

        return {
            items: dbCharacters,
            meta: {
                page,
                limit,
                total: totalCount,
                nextCursor: skip + limit < totalCount ? String(page + 1) : null
            }
        };
    }

    static async getCharacterBySlug(slug: string) {
        if (!slug) {
            throw new AppError(ErrorCode.BAD_REQUEST, "معرّف الشخصية مطلوب", 400);
        }

        let character: any = null;

        try {
            character = await prisma.character.findUnique({
                where: { id: slug }
            });
        } catch (dbErr) {
            console.warn("Prisma error in getCharacterBySlug:", dbErr);
        }

        if (!character) {
            const list = loadLocalCharacters();
            character = list.find(c => c.id === slug);
        }

        if (!character) {
            throw new AppError(ErrorCode.CHARACTER_NOT_FOUND, "الشخصية المطلوبة غير موجودة", 404);
        }

        return character;
    }
}
