import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { UserService } from "@/server/services/user.service";
import { favoriteParamsSchema } from "@/server/validators/interaction.validator";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ type: string; id: string }> }
) {
    try {
        const user = await AuthService.authenticateRequest(req);
        const resolved = await context.params;
        const { type, id } = favoriteParamsSchema.parse(resolved);

        const result = await UserService.addFavorite(user.id, type, id);
        return apiSuccess(result);
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ type: string; id: string }> }
) {
    try {
        const user = await AuthService.authenticateRequest(req);
        const resolved = await context.params;
        const { type, id } = favoriteParamsSchema.parse(resolved);

        const result = await UserService.removeFavorite(user.id, type, id);
        return apiSuccess(result);
    } catch (error) {
        return handleRouteError(error);
    }
}
