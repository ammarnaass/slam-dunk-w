import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { AuthService } from "@/server/services/auth.service";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        let refreshToken: string | undefined;

        try {
            const body = await req.json();
            refreshToken = body.refreshToken;
        } catch (_) {}

        if (!refreshToken) {
            const cookieStore = await cookies();
            refreshToken = cookieStore.get("refreshToken")?.value;
        }

        const result = await AuthService.logout(refreshToken);
        return apiSuccess(result);
    } catch (error) {
        return handleRouteError(error);
    }
}
