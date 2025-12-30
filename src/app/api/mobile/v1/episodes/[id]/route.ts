import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const episode = await prisma.episode.findUnique({
            where: { id: id },
            include: {
                servers: true,
                anime: {
                    select: {
                        id: true,
                        title: true,
                        coverImage: true
                    }
                }
            }
        });

        if (!episode) {
            return mobileError("الحلقة غير موجودة", 404);
        }

        return mobileSuccess({
            id: episode.id,
            title: episode.title,
            thumbnail: episode.thumbnail || episode.anime?.coverImage,
            duration: episode.duration,
            createdAt: episode.createdAt.toISOString(),
            animeId: episode.animeId,
            animeTitle: episode.anime?.title,
            servers: episode.servers.map(s => ({
                name: s.name,
                url: s.url,
                quality: s.quality
            })),
            // Fallback for direct videoUrl if no servers are migrated yet but exists in legacy or logic
            // In schema we have videoUrl on Episode? Let's check schema.
            // Schema has `thumbnail`, `duration`, `servers`. It does NOT have videoUrl on Episode model directly in the simplified version I wrote?
            // Wait, let me check schema again. `model Episode { ... servers Server[] }`.
            // Ah, I recall `fields: [animeId]`.
            // If the JSON had `videoUrl` directly on episode, my migration script might have missed it if I didn't add it to schema.
            // Let's check `prisma/schema.prisma` content I wrote earlier.
            // It has `thumbnail String?`. It does NOT have `videoUrl` column in Episode model.
            // It has `servers`.
            // The JSON migration `ep.servers` was migrated.
            // The `api/mobile/v1/watch` might be the one handling video extraction.
        });

    } catch (error) {
        console.error("Mobile V1 Episode Details API (Prisma) Error:", error);
        return mobileError("حدث خطأ أثناء جلب تفاصيل الحلقة", 500);
    }
}
