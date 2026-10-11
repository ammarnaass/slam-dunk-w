import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { InteractionService } from "@/server/services/interaction.service";
import { reportCommentSchema } from "@/server/validators/interaction.validator";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        let userId: string | null = null;
        try {
            const user = await AuthService.authenticateRequest(req);
            userId = user.id;
        } catch (_) {}

        const { id } = await context.params;
        const body = await req.json();
        const { reason } = reportCommentSchema.parse(body);

        const result = await InteractionService.reportComment(userId, id, reason);
        return apiSuccess(result);
    } catch (error) {
        return handleRouteError(error);
    }
}
