import { NextRequest } from "next/server";
import { EpisodeService } from "@/server/services/episode.service";
import { episodeIdSchema } from "@/server/validators/content.validator";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await context.params;
        const { id } = episodeIdSchema.parse(resolvedParams);

        const episode = await EpisodeService.getEpisodeById(id);
        return apiSuccess(episode);
    } catch (error) {
        return handleRouteError(error);
    }
}
