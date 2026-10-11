import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { InteractionService } from "@/server/services/interaction.service";
import { rateEpisodeSchema } from "@/server/validators/interaction.validator";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = await AuthService.authenticateRequest(req);
        const { id } = await context.params;

        const body = await req.json();
        const { rating } = rateEpisodeSchema.parse(body);

        const result = await InteractionService.rateEpisode(user.id, id, rating);
        return apiSuccess(result);
    } catch (error) {
        return handleRouteError(error);
    }
}
