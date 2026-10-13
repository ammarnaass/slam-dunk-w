import { NextRequest } from "next/server";
import { apiSuccess, handleRouteError } from "@/server/response";
import { getStoredPlanets } from "@/lib/planets-presets";

export async function GET(request: NextRequest) {
    try {
        const planets = getStoredPlanets();
        const enabledOnly = planets.filter(p => p.isEnabled).sort((a, b) => a.order - b.order);
        return apiSuccess(enabledOnly);
    } catch (error) {
        return handleRouteError(error);
    }
}
