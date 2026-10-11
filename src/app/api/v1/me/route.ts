import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { updateMeSchema } from "@/server/validators/auth.validator";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const authUser = await AuthService.authenticateRequest(req);
        const profile = await AuthService.getMe(authUser.id);
        return apiSuccess(profile);
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const authUser = await AuthService.authenticateRequest(req);
        const body = await req.json();
        const validated = updateMeSchema.parse(body);

        const updated = await AuthService.updateMe(authUser.id, validated);
        return apiSuccess(updated);
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const authUser = await AuthService.authenticateRequest(req);
        const result = await AuthService.deleteAccount(authUser.id);
        return apiSuccess(result);
    } catch (error) {
        return handleRouteError(error);
    }
}
