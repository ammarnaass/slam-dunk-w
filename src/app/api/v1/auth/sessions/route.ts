import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const user = await AuthService.authenticateRequest(req);
        const sessions = await AuthService.getSessions(user.id);
        return apiSuccess(sessions);
    } catch (error) {
        return handleRouteError(error);
    }
}
