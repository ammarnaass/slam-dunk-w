import { NextRequest } from "next/server";
import { AnimeService } from "@/server/services/anime.service";
import { animesQuerySchema } from "@/server/validators/content.validator";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const queryParams = Object.fromEntries(url.searchParams.entries());

        const validated = animesQuerySchema.parse(queryParams);
        const { items, meta } = await AnimeService.getAnimes(validated);

        return apiSuccess(items, meta);
    } catch (error) {
        return handleRouteError(error);
    }
}
