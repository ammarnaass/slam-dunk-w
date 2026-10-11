import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { UserService } from "@/server/services/user.service";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const user = await AuthService.authenticateRequest(req);
        const favorites = await UserService.getFavorites(user.id);
        return apiSuccess(favorites);
    } catch (error) {
        return handleRouteError(error);
    }
}
