import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q"); // Prisma handles case sensitivity with mode: 'insensitive'

        if (!query) {
            return mobileSuccess([]);
        }

        const results = await prisma.anime.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 20, // Limit results
            select: {
                id: true,
                title: true,
                coverImage: true,
                genres: true
            }
        });

        return mobileSuccess(results);
    } catch (error) {
        console.error("Mobile V1 Search API (Prisma) Error:", error);
        return mobileError("فشل البحث", 500);
    }
}
