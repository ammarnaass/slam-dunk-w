import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { UserService } from "@/server/services/user.service";
import { watchProgressSchema } from "@/server/validators/interaction.validator";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ episodeId: string }> }
) {
    try {
        const user = await AuthService.authenticateRequest(req);
        const { episodeId } = await context.params;

        const body = await req.json();
        const { positionSeconds, durationSeconds } = watchProgressSchema.parse(body);

        const progress = await UserService.saveProgress(user.id, episodeId, positionSeconds, durationSeconds);
        return apiSuccess(progress);
    } catch (error) {
        return handleRouteError(error);
    }
}
