import { NextRequest } from "next/server";
import { EpisodeService } from "@/server/services/episode.service";
import { animeSlugSchema, episodesQuerySchema } from "@/server/validators/content.validator";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const resolvedParams = await context.params;
        const { slug } = animeSlugSchema.parse(resolvedParams);

        const url = new URL(req.url);
        const queryParams = Object.fromEntries(url.searchParams.entries());
        const validatedQuery = episodesQuerySchema.parse(queryParams);

        const { items, meta } = await EpisodeService.getAnimeEpisodes(slug, validatedQuery);
        return apiSuccess(items, meta);
    } catch (error) {
        return handleRouteError(error);
    }
}
