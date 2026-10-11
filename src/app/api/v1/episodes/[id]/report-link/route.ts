import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { InteractionService } from "@/server/services/interaction.service";
import { reportLinkSchema } from "@/server/validators/interaction.validator";
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
        const { reason, serverId } = reportLinkSchema.parse(body);

        const result = await InteractionService.reportLink(userId, id, reason, serverId);
        return apiSuccess(result);
    } catch (error) {
        return handleRouteError(error);
    }
}
