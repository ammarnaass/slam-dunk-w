import { SettingsService } from "@/server/services/settings.service";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const config = await SettingsService.getMobileConfig();
        return apiSuccess(config);
    } catch (error) {
        return handleRouteError(error);
    }
}
