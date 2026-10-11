import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { UserService } from "@/server/services/user.service";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const user = await AuthService.authenticateRequest(req);
        const url = new URL(req.url);
        const page = Number(url.searchParams.get("page")) || 1;
        const limit = Number(url.searchParams.get("limit")) || 20;

        const { items, meta } = await UserService.getHistory(user.id, { page, limit });
        return apiSuccess(items, meta);
    } catch (error) {
        return handleRouteError(error);
    }
}
