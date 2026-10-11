import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        let episodesData: any[] = [];

        try {
            episodesData = await prisma.episode.findMany({
                where: { animeId: id },
                orderBy: { createdAt: 'desc' },
                include: { servers: true }
            });
        } catch (dbErr) {
            console.warn("Neon DB query failed for mobile anime episodes, using local fallback:", dbErr);
        }

        if (!episodesData || episodesData.length === 0) {
            try {
                const filePath = path.join(process.cwd(), "src/data/episodes.json");
                if (fs.existsSync(filePath)) {
                    const allEpisodes = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                    const filtered = Array.isArray(allEpisodes)
                        ? allEpisodes.filter((ep: any) => ep.animeId === id || id === "slam-dunk")
                        : [];
                    episodesData = filtered.map((ep: any) => ({
                        id: ep.id,
                        animeId: ep.animeId || id,
                        title: ep.title,
                        thumbnail: ep.thumbnail || "/logoep.jpg",
                        duration: ep.duration || "23:30",
                        createdAt: new Date().toISOString(),
                        servers: ep.mega_link ? [{ name: "Mega", url: ep.mega_link, quality: "720p" }] : []
                    }));
                }
            } catch (localErr) {
                console.error("Local episodes fallback error:", localErr);
            }
        }

        const episodes = episodesData.map(ep => ({
            id: ep.id,
            animeId: ep.animeId,
            title: ep.title,
            thumbnail: ep.thumbnail,
            duration: ep.duration,
            createdAt: typeof ep.createdAt === 'string' ? ep.createdAt : ep.createdAt?.toISOString(),
            servers: (ep.servers || []).map((s: any) => ({
                name: s.name,
                url: s.url,
                quality: s.quality
            }))
        }));

        return mobileSuccess(episodes);
    } catch (error) {
        console.error("Mobile V1 Anime Episodes API Error:", error);
        return mobileError("حدث خطأ أثناء جلب قائمة الحلقات", 500);
    }
}
