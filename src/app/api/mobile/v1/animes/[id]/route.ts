import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const anime = await prisma.anime.findUnique({
            where: { id: id },
            include: {
                episodes: {
                    select: {
                        id: true,
                        title: true,
                        thumbnail: true,
                        duration: true,
                        createdAt: true
                    },
                    orderBy: {
                        // Assuming newer episodes have higher ID or created date.
                        // Standard practice often sorts episodes descending or ascending.
                        // Usually ascending for a list, descending for "latest".
                        // Let's stick to descending for now or standard.
                        // Actually, details page usually lists episodes.
                        // If it's a huge list, we might want to paginate, but existing code returned all.
                        // Let's sort by ID (often numeric string) or simple creation.
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!anime) {
            return mobileError("العمل غير موجود", 404);
        }

        // Transform if necessary to match exact expected shape,
        // but Prisma object is mostly compatible.
        // We might need to ensure 'episodes' are part of the return if the app expects them inline.
        // The original `getAnimes()` usually returned the anime metadata.
        // If episodes were separate, we should check `api/mobile/v1/episodes/[id]`.
        // But adding them here is safer for a "detail" view.

        return mobileSuccess({
            ...anime,
            episodes: anime.episodes.map(ep => ({
                ...ep,
                createdAt: ep.createdAt.toISOString()
            }))
        });

    } catch (error) {
        console.error("Mobile V1 Anime Details API (Prisma) Error:", error);
        return mobileError("حدث خطأ أثناء جلب تفاصيل العمل", 500);
    }
}
