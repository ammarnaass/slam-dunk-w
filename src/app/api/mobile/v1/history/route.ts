import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return mobileError("يجب تسجيل الدخول أولاً", 401);
        }

        let history: any[] = [];
        try {
            history = await prisma.history.findMany({
                where: { userId: user.id },
                orderBy: { watchedAt: 'desc' },
                take: 20
            });
        } catch (dbErr) {
            console.warn("Prisma history GET error:", dbErr);
        }

        return mobileSuccess(history);
    } catch (error) {
        console.error("History GET Error:", error);
        return mobileError("حدث خطأ أثناء جلب تاريخ المشاهدة", 500);
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return mobileError("يجب تسجيل الدخول أولاً", 401);
        }

        const body = await req.json();
        const { animeId, episodeId, progress } = body;

        if (!animeId || !episodeId) {
            return mobileError("بيانات ناقصة", 400);
        }

        let savedEntry: any = {
            userId: user.id,
            animeId,
            episodeId,
            progress: progress || 0,
            watchedAt: new Date().toISOString()
        };

        try {
            savedEntry = await prisma.history.upsert({
                where: {
                    userId_animeId_episodeId: {
                        userId: user.id,
                        animeId,
                        episodeId,
                    }
                },
                update: {
                    progress: progress || 0,
                    watchedAt: new Date()
                },
                create: {
                    userId: user.id,
                    animeId,
                    episodeId,
                    progress: progress || 0,
                }
            });
        } catch (dbErr) {
            console.warn("Prisma history POST error:", dbErr);
        }

        return mobileSuccess(savedEntry);
    } catch (error) {
        console.error("History POST Error:", error);
        return mobileError("حدث خطأ أثناء حفظ تاريخ المشاهدة", 500);
    }
}
