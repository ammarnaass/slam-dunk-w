import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { apiSuccess, apiError, handleRouteError } from "@/server/response";
import { ErrorCode } from "@/server/types/errors";
import { 
    DEFAULT_ADMIN_PLANETS, 
    DEFAULT_PLANETS_SETTINGS,
    AdminPlanetItem,
    PlanetsSettingsConfig
} from "@/lib/planets-presets";
import { 
    getStoredPlanets, 
    saveStoredPlanets, 
    getStoredPlanetsSettings,
    saveStoredPlanetsSettings
} from "@/server/services/planets.service";
import { prisma } from "@/lib/prismadb";
import fs from "fs";
import path from "path";

// Helper to count animes matching a planet
async function getAnimesCountMap(planets: AdminPlanetItem[]): Promise<Record<string, number>> {
    let allAnimes: Array<{ id: string; title: string; genres?: string[] }> = [];

    try {
        allAnimes = await prisma.anime.findMany({
            select: { id: true, title: true, genres: true }
        });
    } catch (_) {
        // Fallback to local animes.json
        try {
            const jsonPath = path.join(process.cwd(), "src/data/animes.json");
            if (fs.existsSync(jsonPath)) {
                allAnimes = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
            }
        } catch (_) {}
    }

    const countMap: Record<string, number> = {};

    planets.forEach(planet => {
        const pGenre = (planet.genreKey || "").toLowerCase();
        const pArabic = (planet.arabicGenre || "").toLowerCase();
        const pFlagship = (planet.flagshipWorks || []).map(f => f.toLowerCase());

        const matching = allAnimes.filter(anime => {
            const animeTitle = (anime.title || "").toLowerCase();
            const animeGenres = (anime.genres || []).map(g => g.toLowerCase());

            // 1. Matches genre
            if (animeGenres.includes(pGenre) || animeGenres.includes(pArabic)) {
                return true;
            }

            // 2. Matches any flagship work in title
            if (pFlagship.some(fw => animeTitle.includes(fw))) {
                return true;
            }

            return false;
        });

        countMap[planet.id] = matching.length;
    });

    return countMap;
}

export async function GET(request: NextRequest) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role?.toUpperCase() !== "ADMIN") {
            return apiError(ErrorCode.FORBIDDEN, "غير مصرح لك بالوصول لإدارة الكواكب", 403);
        }

        const planets = getStoredPlanets();
        const settings = getStoredPlanetsSettings();
        const counts = await getAnimesCountMap(planets);

        const enriched = planets.map(p => ({
            ...p,
            worksCount: counts[p.id] || 0
        }));

        return apiSuccess({ planets: enriched, settings });
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role?.toUpperCase() !== "ADMIN") {
            return apiError(ErrorCode.FORBIDDEN, "غير مصرح لك بتعديل بيانات الكواكب", 403);
        }

        const body = await request.json();
        const { action } = body;

        // Action 0: Save Display Settings
        if (action === "save-settings" && body.settings) {
            saveStoredPlanetsSettings(body.settings as PlanetsSettingsConfig);
            return apiSuccess({ settings: body.settings });
        }

        // Action 1: Reset to Spacetoon Defaults
        if (action === "reset") {
            saveStoredPlanets(DEFAULT_ADMIN_PLANETS);
            saveStoredPlanetsSettings(DEFAULT_PLANETS_SETTINGS);
            const counts = await getAnimesCountMap(DEFAULT_ADMIN_PLANETS);
            const enriched = DEFAULT_ADMIN_PLANETS.map(p => ({ ...p, worksCount: counts[p.id] || 0 }));
            return apiSuccess({ planets: enriched, settings: DEFAULT_PLANETS_SETTINGS });
        }

        // Action 2: Toggle Visibility
        if (action === "toggle" && body.planetId) {
            const current = getStoredPlanets();
            const updated = current.map(p => 
                p.id === body.planetId ? { ...p, isEnabled: !p.isEnabled } : p
            );
            saveStoredPlanets(updated);
            const counts = await getAnimesCountMap(updated);
            const enriched = updated.map(p => ({ ...p, worksCount: counts[p.id] || 0 }));
            return apiSuccess({ planets: enriched });
        }

        // Action 3: Save Full Array or Reorder
        if (action === "save-all" || Array.isArray(body.planets)) {
            const list: AdminPlanetItem[] = Array.isArray(body.planets) ? body.planets : body;
            saveStoredPlanets(list);
            const counts = await getAnimesCountMap(list);
            const enriched = list.map(p => ({ ...p, worksCount: counts[p.id] || 0 }));
            return apiSuccess({ planets: enriched });
        }

        // Action 4: Create new custom planet
        if (action === "create" && body.planet) {
            const current = getStoredPlanets();
            const newPlanet: AdminPlanetItem = {
                ...body.planet,
                id: body.planet.id?.trim() || `custom-${Date.now()}`,
                order: current.length + 1,
                isEnabled: true,
                isCustom: true
            };
            const updated = [...current, newPlanet];
            saveStoredPlanets(updated);
            const counts = await getAnimesCountMap(updated);
            const enriched = updated.map(p => ({ ...p, worksCount: counts[p.id] || 0 }));
            return apiSuccess({ planets: enriched });
        }

        // Action 5: Update specific planet
        if (action === "update" && body.planet) {
            const current = getStoredPlanets();
            const updated = current.map(p => 
                p.id === body.planet.id ? { ...p, ...body.planet } : p
            );
            saveStoredPlanets(updated);
            const counts = await getAnimesCountMap(updated);
            const enriched = updated.map(p => ({ ...p, worksCount: counts[p.id] || 0 }));
            return apiSuccess({ planets: enriched });
        }

        // Action 6: Delete planet
        if (action === "delete" && body.planetId) {
            const current = getStoredPlanets();
            const updated = current.filter(p => p.id !== body.planetId);
            saveStoredPlanets(updated);
            const counts = await getAnimesCountMap(updated);
            const enriched = updated.map(p => ({ ...p, worksCount: counts[p.id] || 0 }));
            return apiSuccess({ planets: enriched });
        }

        return apiError(ErrorCode.BAD_REQUEST, "إجراء غير معروف", 400);
    } catch (error) {
        return handleRouteError(error);
    }
}
