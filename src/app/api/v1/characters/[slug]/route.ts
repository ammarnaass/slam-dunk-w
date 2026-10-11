import { NextRequest } from "next/server";
import { CharacterService } from "@/server/services/character.service";
import { characterSlugSchema } from "@/server/validators/content.validator";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    try {
        const resolvedParams = await context.params;
        const { slug } = characterSlugSchema.parse(resolvedParams);

        const character = await CharacterService.getCharacterBySlug(slug);
        return apiSuccess(character);
    } catch (error) {
        return handleRouteError(error);
    }
}
