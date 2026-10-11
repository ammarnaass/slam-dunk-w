import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { InteractionService } from "@/server/services/interaction.service";
import { updateCommentSchema } from "@/server/validators/interaction.validator";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = await AuthService.authenticateRequest(req);
        const { id } = await context.params;

        const body = await req.json();
        const { content } = updateCommentSchema.parse(body);

        const isAdmin = user.role?.toUpperCase() === "ADMIN";
        const updated = await InteractionService.updateComment(user.id, id, content, isAdmin);
        return apiSuccess(updated);
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = await AuthService.authenticateRequest(req);
        const { id } = await context.params;

        const isAdmin = user.role?.toUpperCase() === "ADMIN";
        const result = await InteractionService.deleteComment(user.id, id, isAdmin);
        return apiSuccess(result);
    } catch (error) {
        return handleRouteError(error);
    }
}
