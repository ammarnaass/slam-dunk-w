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
        let episode: any = null;

        try {
            episode = await prisma.episode.findUnique({
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
        } catch (dbErr) {
            console.warn(`Prisma error for episode [${id}], attempting local fallback:`, dbErr);
        }

        if (!episode) {
            try {
                const episodesPath = path.join(process.cwd(), "src/data/episodes.json");
                const animesPath = path.join(process.cwd(), "src/data/animes.json");

                if (fs.existsSync(episodesPath)) {
                    const epList = JSON.parse(fs.readFileSync(episodesPath, "utf-8"));
                    const found = epList.find((ep: any) => ep.id === id || ep.episode_number?.toString() === id);
                    if (found) {
                        let animeTitle = "سلام دانك";
                        let animeCover = "/hero-bg.jpg";

                        if (fs.existsSync(animesPath)) {
                            const animes = JSON.parse(fs.readFileSync(animesPath, "utf-8"));
                            const animeFound = animes.find((a: any) => a.id === (found.animeId || "slam-dunk"));
                            if (animeFound) {
                                animeTitle = animeFound.title;
                                animeCover = animeFound.coverImage;
                            }
                        }

                        episode = {
                            id: found.id,
                            title: found.title,
                            thumbnail: found.thumbnail || "/logoep.jpg",
                            duration: found.duration || "23:30",
                            createdAt: new Date().toISOString(),
                            animeId: found.animeId || "slam-dunk",
                            animeTitle,
                            animeCover,
                            servers: found.mega_link ? [{
                                id: "srv-mega",
                                name: "سيرفر Mega الرسمي",
                                url: found.mega_link,
                                quality: "1080p FHD"
                            }] : []
                        };
                    }
                }
            } catch (fallbackErr) {
                console.error("Local episode fallback failed:", fallbackErr);
            }
        }

        if (!episode) {
            return mobileError("الحلقة غير موجودة", 404);
        }

        return mobileSuccess({
            id: episode.id,
            title: episode.title,
            thumbnail: episode.thumbnail || episode.anime?.coverImage,
            duration: episode.duration,
            createdAt: typeof episode.createdAt === 'string' ? episode.createdAt : episode.createdAt?.toISOString(),
            animeId: episode.animeId,
            animeTitle: episode.animeTitle || episode.anime?.title,
            servers: (episode.servers || []).map((s: any) => ({
                id: s.id,
                name: s.name,
                url: s.url,
                quality: s.quality || "720p"
            }))
        });

    } catch (error) {
        console.error("Mobile V1 Episode Details API Error:", error);
        return mobileError("حدث خطأ أثناء جلب تفاصيل الحلقة", 500);
    }
}
