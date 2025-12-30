import { NextResponse } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session || !session.user) {
            return mobileError("يجب تسجيل الدخول أولاً", 401);
        }

        const history = await prisma.history.findMany({
            where: { userId: session.user.id },
            orderBy: { watchedAt: 'desc' },
            include: {
                // Ideally we'd include anime info for display
                // Need to ensure relations are mapped in schema
            },
            take: 20
        });

        // Enrich with anime details if schema allows
        // Since my schema has animeId but not a direct relation defined for History -> Anime yet,
        // I might need to fetch them if I want titles. 
        // But for mobile client, maybe IDs are enough or let's assume UI handles it.

        return mobileSuccess(history);
    } catch (error) {
        console.error("History GET Error:", error);
        return mobileError("حدث خطأ أثناء جلب تاريخ المشاهدة", 500);
    }
}

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session || !session.user) {
            return mobileError("يجب تسجيل الدخول أولاً", 401);
        }

        const { animeId, episodeId, progress } = await req.json();

        if (!animeId || !episodeId) {
            return mobileError("بيانات ناقصة", 400);
        }

        const history = await prisma.history.upsert({
            where: {
                userId_animeId_episodeId: {
                    userId: session.user.id,
                    animeId,
                    episodeId,
                }
            },
            update: {
                progress: progress || 0,
                watchedAt: new Date()
            },
            create: {
                userId: session.user.id,
                animeId,
                episodeId,
                progress: progress || 0
            }
        });

        return mobileSuccess(history);
    } catch (error) {
        console.error("History POST Error:", error);
        return mobileError("حدث خطأ أثناء حفظ المشاهدة", 500);
    }
}
