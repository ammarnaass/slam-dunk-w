import { NextRequest } from "next/server";
import { AuthService } from "@/server/services/auth.service";
import { InteractionService } from "@/server/services/interaction.service";
import { addCommentSchema, commentsQuerySchema } from "@/server/validators/interaction.validator";
import { apiSuccess, handleRouteError } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const url = new URL(req.url);
        const queryParams = Object.fromEntries(url.searchParams.entries());
        const { cursor, limit } = commentsQuerySchema.parse(queryParams);

        const { items, meta } = await InteractionService.getEpisodeComments(id, cursor, limit);
        return apiSuccess(items, meta);
    } catch (error) {
        return handleRouteError(error);
    }
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const user = await AuthService.authenticateRequest(req);
        const { id } = await context.params;

        const body = await req.json();
        const { content } = addCommentSchema.parse(body);

        const comment = await InteractionService.addComment(user.id, id, content);
        return apiSuccess(comment, undefined, 201);
    } catch (error) {
        return handleRouteError(error);
    }
}
