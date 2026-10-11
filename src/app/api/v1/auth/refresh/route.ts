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

        const userAgent = req.headers.get("user-agent") || undefined;
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || undefined;
        const deviceName = req.headers.get("x-device-name") || "Client";

        const tokens = await AuthService.refreshTokens(refreshToken || "", { deviceName, userAgent, ip });

        // Update web cookies
        try {
            const cookieStore = await cookies();
            cookieStore.set("session", tokens.accessToken, {
                httpOnly: true,
                path: "/",
                sameSite: "lax",
                maxAge: 15 * 60
            });
            cookieStore.set("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                path: "/",
                sameSite: "lax",
                maxAge: 30 * 24 * 60 * 60
            });
        } catch (_) {}

        return apiSuccess(tokens);
    } catch (error) {
        return handleRouteError(error);
    }
}
