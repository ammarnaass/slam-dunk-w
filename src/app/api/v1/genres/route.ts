import { AnimeService } from "@/server/services/anime.service";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const genres = await AnimeService.getGenres();
        return apiSuccess(genres);
    } catch (error) {
        return handleRouteError(error);
    }
}
