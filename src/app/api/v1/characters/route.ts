import { NextRequest } from "next/server";
import { CharacterService } from "@/server/services/character.service";
import { charactersQuerySchema } from "@/server/validators/content.validator";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const queryParams = Object.fromEntries(url.searchParams.entries());

        const validated = charactersQuerySchema.parse(queryParams);
        const { items, meta } = await CharacterService.getCharacters(validated);

        return apiSuccess(items, meta);
    } catch (error) {
        return handleRouteError(error);
    }
}
