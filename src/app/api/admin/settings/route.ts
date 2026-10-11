import { NextRequest } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { apiSuccess, apiError, handleRouteError } from "@/server/response";
import { ErrorCode } from "@/server/types/errors";
import { SettingsService } from "@/server/services/settings.service";

export async function GET(request: NextRequest) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role?.toUpperCase() !== "ADMIN") {
            return apiError(ErrorCode.FORBIDDEN, "غير مصرح لك بالوصول لإعدادات الإدارة", 403);
        }

        const settings = await SettingsService.getSettings();
        return apiSuccess(settings);
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role?.toUpperCase() !== "ADMIN") {
            return apiError(ErrorCode.FORBIDDEN, "غير مصرح لك بتعديل إعدادات الإدارة", 403);
        }

        const body = await request.json();

        // Action 1: Reset identity back to official default preset
        if (body.action === "reset-identity") {
            const defaultIdentity = await SettingsService.resetToDefaultIdentity();
            return apiSuccess(defaultIdentity);
        }

        // Action 2: Update identity specifically (Name, Logo, Favicon, Colors)
        if (body.action === "update-identity" || body.identity) {
            const identityPayload = body.identity || body;
            const updatedIdentity = await SettingsService.updateIdentity(identityPayload);
            return apiSuccess(updatedIdentity);
        }

        // Action 3: Full settings update
        const updatedSettings = await SettingsService.updateFullSettings(body);
        return apiSuccess(updatedSettings);
    } catch (error) {
        return handleRouteError(error);
    }
}
