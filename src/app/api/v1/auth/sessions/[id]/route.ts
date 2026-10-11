import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = await AuthService.authenticateRequest(req);
        const { id } = await context.params;

        const result = await AuthService.revokeSession(user.id, id);
        return apiSuccess(result);
    } catch (error) {
        return handleRouteError(error);
    }
}
