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
        let anime: any = null;

        try {
            anime = await prisma.anime.findUnique({
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
                            createdAt: 'desc'
                        }
                    }
                }
            });
        } catch (dbErr) {
            console.warn(`Prisma error for anime [${id}], attempting local fallback:`, dbErr);
        }

        // Fallback to local files if not found in DB
        if (!anime) {
            try {
                const animesPath = path.join(process.cwd(), "src/data/animes.json");
                const episodesPath = path.join(process.cwd(), "src/data/episodes.json");

                if (fs.existsSync(animesPath)) {
                    const animesList = JSON.parse(fs.readFileSync(animesPath, "utf-8"));
                    const found = animesList.find((a: any) => a.id === id || (id === "slam-dunk" && a.id === "1"));
                    if (found) {
                        let episodes: any[] = [];
                        if (fs.existsSync(episodesPath)) {
                            const epList = JSON.parse(fs.readFileSync(episodesPath, "utf-8"));
                            episodes = epList
                                .filter((ep: any) => ep.animeId === found.id || found.id === "slam-dunk")
                                .map((ep: any) => ({
                                    id: ep.id,
                                    title: ep.title,
                                    thumbnail: ep.thumbnail || found.coverImage,
                                    duration: ep.duration || "23:30",
                                    createdAt: new Date().toISOString()
                                }));
                        }
                        anime = {
                            ...found,
                            episodes
                        };
                    }
                }
            } catch (fallbackErr) {
                console.error("Local anime fallback failed:", fallbackErr);
            }
        }

        if (!anime) {
            return mobileError("العمل غير موجود", 404);
        }

        return mobileSuccess({
            ...anime,
            episodes: (anime.episodes || []).map((ep: any) => ({
                ...ep,
                createdAt: typeof ep.createdAt === 'string' ? ep.createdAt : ep.createdAt?.toISOString()
            }))
        });

    } catch (error) {
        console.error("Mobile V1 Anime Details API Error:", error);
        return mobileError("حدث خطأ أثناء جلب تفاصيل العمل", 500);
    }
}
