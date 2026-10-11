import { NextRequest } from "next/server";
import { AnimeService } from "@/server/services/anime.service";
import { animeSlugSchema } from "@/server/validators/content.validator";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const resolvedParams = await context.params;
        const { slug } = animeSlugSchema.parse(resolvedParams);

        const anime = await AnimeService.getAnimeBySlug(slug);
        return apiSuccess(anime);
    } catch (error) {
        return handleRouteError(error);
    }
}
