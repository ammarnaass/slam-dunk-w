import { NextResponse } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";

export async function GET() {
    try {
        const [featuredAnimes, latestEpisodes, settings] = await Promise.all([
            prisma.anime.findMany({
                where: { isFeatured: true },
                take: 5
            }),
            prisma.episode.findMany({
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: { anime: { select: { title: true } } }
            }),
            prisma.settings.findUnique({
                where: { id: "global" }
            })
        ]);

        const data = {
            slider: featuredAnimes.map(a => ({
                id: a.id,
                title: a.title,
                image: a.bannerImage || a.coverImage,
                animeId: a.id
            })),
            latestEpisodes: latestEpisodes.map(ep => ({
                id: ep.id,
                title: ep.title,
                thumbnail: ep.thumbnail,
                animeTitle: ep.anime?.title || "أنمي",
                createdAt: ep.createdAt.toISOString()
            })),
            settings: {
                appName: settings?.siteName || "سلام دانك",
                maintenance: settings?.maintenanceMode || false,
                message: settings?.maintenanceMessage || ""
            }
        };

        return mobileSuccess(data);
    } catch (error) {
        console.error("Mobile Home API Error:", error);
        return mobileError("حدث خطأ أثناء جلب بيانات الصفحة الرئيسية", 500);
    }
}
