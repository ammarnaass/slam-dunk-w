import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { UserService } from "@/server/services/user.service";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const user = await AuthService.authenticateRequest(req);
        const url = new URL(req.url);
        const limit = Number(url.searchParams.get("limit")) || 10;

        const items = await UserService.getContinueWatching(user.id, limit);
        return apiSuccess(items);
    } catch (error) {
        return handleRouteError(error);
    }
}
