import { NextResponse } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');
        const genre = searchParams.get('genre');

        let animes: any[] = [];
        try {
            const where: any = {};
            if (type) where.type = type;
            if (status) where.status = status;
            if (genre) where.genres = { has: genre };

            animes = await prisma.anime.findMany({
                where,
                orderBy: { updatedAt: 'desc' }
            });
        } catch (dbErr) {
            console.warn("Prisma error in mobile animes list, falling back to JSON:", dbErr);
        }

        if (!animes || animes.length === 0) {
            try {
                const fs = await import("fs");
                const path = await import("path");
                const jsonPath = path.join(process.cwd(), "src/data/animes.json");
                if (fs.existsSync(jsonPath)) {
                    const localAnimes = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
                    if (Array.isArray(localAnimes)) {
                        animes = localAnimes.filter(a => {
                            if (type && a.type && a.type !== type) return false;
                            if (status && a.status && a.status !== status) return false;
                            if (genre && a.genres && !a.genres.includes(genre)) return false;
                            return true;
                        });
                    }
                }
            } catch (fallbackErr) {
                console.error("Local animes fallback error:", fallbackErr);
            }
        }

        const mappedAnimes = animes.map(a => ({
            id: a.id,
            title: a.title,
            description: a.description || "",
            coverImage: a.coverImage,
            rating: a.rating || "9.5",
            releaseYear: a.releaseYear || "1993",
            type: a.type || "TV Series",
            status: a.status || "Completed",
            totalEpisodes: a.totalEpisodes || (a.id === "slam-dunk" ? 101 : 1),
            genres: a.genres || []
        }));

        return mobileSuccess(mappedAnimes);
    } catch (error) {
        console.error("Mobile V1 Animes GET Error:", error);
        return mobileError("حدث خطأ أثناء جلب الأنميات", 500);
    }
}
