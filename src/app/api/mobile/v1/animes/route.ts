import { NextRequest } from "next/request";
import { NextResponse } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // optional (movie, series)
        const status = searchParams.get('status'); // optional (ongoing, completed)
        const genre = searchParams.get('genre');

        const where: any = {};
        if (type) where.type = type;
        if (status) where.status = status;
        if (genre) where.genres = { has: genre };

        const animes = await prisma.anime.findMany({
            where,
            orderBy: { updatedAt: 'desc' }
        });

        const mappedAnimes = animes.map(a => ({
            id: a.id,
            title: a.title,
            coverImage: a.coverImage,
            rating: a.rating,
            releaseYear: a.releaseYear,
            type: a.type,
            status: a.status
        }));

        return mobileSuccess(mappedAnimes);
    } catch (error) {
        console.error("Mobile V1 Animes GET Error:", error);
        return mobileError("حدث خطأ أثناء جلب الأنميات", 500);
    }
}
