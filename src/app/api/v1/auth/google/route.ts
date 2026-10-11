import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { AuthService } from "@/server/services/auth.service";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const idToken = body.idToken || body.credential;

        if (!idToken) {
            return handleRouteError(new Error("رمز Google مطلوب"));
        }

        const userAgent = req.headers.get("user-agent") || undefined;
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || undefined;
        const deviceName = body.deviceName || req.headers.get("x-device-name") || "Google Sign-In Client";

        const result = await AuthService.googleLogin(idToken, { deviceName, userAgent, ip });

        // Set HttpOnly cookies for web browsers
        try {
            const cookieStore = await cookies();
            cookieStore.set("session", result.accessToken, {
                httpOnly: true,
                path: "/",
                sameSite: "lax",
                maxAge: 15 * 60
            });
            cookieStore.set("refreshToken", result.refreshToken, {
                httpOnly: true,
                path: "/",
                sameSite: "lax",
                maxAge: 30 * 24 * 60 * 60
            });
        } catch (_) {}

        return apiSuccess(result);
    } catch (error) {
        return handleRouteError(error);
    }
}
