import { NextRequest } from "next/server";
import { SearchService } from "@/server/services/search.service";
import { searchQuerySchema } from "@/server/validators/content.validator";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const queryParams = Object.fromEntries(url.searchParams.entries());

        const { q, type, limit } = searchQuerySchema.parse(queryParams);
        const results = await SearchService.search(q, type, limit);

        return apiSuccess(results);
    } catch (error) {
        return handleRouteError(error);
    }
}
