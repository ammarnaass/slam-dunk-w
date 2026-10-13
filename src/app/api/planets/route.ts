import { NextRequest } from "next/server";
import { apiSuccess, handleRouteError } from "@/server/response";
import { getStoredPlanets, getStoredPlanetsSettings } from "@/server/services/planets.service";

export async function GET(request: NextRequest) {
    try {
        const planets = getStoredPlanets();
        const settings = getStoredPlanetsSettings();
        const enabledOnly = planets.filter(p => p.isEnabled).sort((a, b) => a.order - b.order);
        return apiSuccess({ planets: enabledOnly, settings });
    } catch (error) {
        return handleRouteError(error);
    }
}
