import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { AuthService } from "@/server/services/auth.service";
import { loginSchema } from "@/server/validators/auth.validator";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validated = loginSchema.parse(body);

        const userAgent = req.headers.get("user-agent") || undefined;
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || undefined;
        const deviceName = validated.deviceName || req.headers.get("x-device-name") || "Web Client";

        const result = await AuthService.login(validated, { deviceName, userAgent, ip });

        // Set HttpOnly cookies for web browsers
        try {
            const cookieStore = await cookies();
            cookieStore.set("session", result.accessToken, {
                httpOnly: true,
                path: "/",
                sameSite: "lax",
                maxAge: 15 * 60 // 15 mins
            });
            cookieStore.set("refreshToken", result.refreshToken, {
                httpOnly: true,
                path: "/",
                sameSite: "lax",
                maxAge: 30 * 24 * 60 * 60 // 30 days
            });
        } catch (_) {}

        return apiSuccess(result);
    } catch (error) {
        return handleRouteError(error);
    }
}
