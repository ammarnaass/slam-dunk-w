import { HomeService } from "@/server/services/home.service";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const homeData = await HomeService.getHomeData();
        return apiSuccess(homeData);
    } catch (error) {
        return handleRouteError(error);
    }
}
