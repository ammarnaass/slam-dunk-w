import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prismadb";

export interface DashboardStats {
    animeCount: number;
    episodeCount: number;
    characterCount: number;
    userCount: number;
    latestAnimes: any[];
    featuredCount: number;
}

export async function getAdminDashboardStats(): Promise<DashboardStats> {
    let animeCount = 0;
    let episodeCount = 0;
    let characterCount = 0;
    let userCount = 0;
    let latestAnimes: any[] = [];
    let featuredCount = 0;

    const dataDir = path.join(process.cwd(), "src/data");

    // Fetch from database with fallback
    try {
        [animeCount, episodeCount, characterCount, userCount, latestAnimes, featuredCount] = await Promise.all([
            prisma.anime.count(),
            prisma.episode.count(),
            prisma.character.count(),
            prisma.user.count(),
            prisma.anime.findMany({
                take: 6,
                orderBy: { updatedAt: "desc" }
            }),
            prisma.anime.count({ where: { isFeatured: true } })
        ]);
    } catch (err) {
        console.warn("Prisma query fallback on Admin Dashboard:", err);
    }

    // Local JSON fallback if needed
    if (animeCount === 0 && fs.existsSync(path.join(dataDir, "animes.json"))) {
        try {
            const animesData = JSON.parse(fs.readFileSync(path.join(dataDir, "animes.json"), "utf-8"));
            const list = Array.isArray(animesData) ? animesData : (animesData.animes || []);
            animeCount = list.length;
            latestAnimes = list.slice(0, 6);
            featuredCount = list.filter((a: any) => a.isFeatured).length;
        } catch (e) {
            console.error(e);
        }
    }

    if (episodeCount === 0 && fs.existsSync(path.join(dataDir, "episodes.json"))) {
        try {
            const eps = JSON.parse(fs.readFileSync(path.join(dataDir, "episodes.json"), "utf-8"));
            episodeCount = (Array.isArray(eps) ? eps : (eps.episodes || [])).length;
        } catch (e) {
            console.error(e);
        }
    }

    if (characterCount === 0 && fs.existsSync(path.join(dataDir, "characters.json"))) {
        try {
            const chars = JSON.parse(fs.readFileSync(path.join(dataDir, "characters.json"), "utf-8"));
            characterCount = (Array.isArray(chars) ? chars : (chars.characters || [])).length;
        } catch (e) {
            console.error(e);
        }
    }

    if (userCount === 0 && fs.existsSync(path.join(dataDir, "users.json"))) {
        try {
            const users = JSON.parse(fs.readFileSync(path.join(dataDir, "users.json"), "utf-8"));
            userCount = users.length;
        } catch (e) {
            console.error(e);
        }
    }

    return {
        animeCount,
        episodeCount,
        characterCount,
        userCount,
        latestAnimes,
        featuredCount
    };
}
