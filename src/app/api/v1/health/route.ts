import { apiSuccess } from "@/server/response";

export const dynamic = "force-dynamic";

export async function GET() {
    return apiSuccess({
        status: "healthy",
        version: "v1",
        timestamp: new Date().toISOString()
    });
}
