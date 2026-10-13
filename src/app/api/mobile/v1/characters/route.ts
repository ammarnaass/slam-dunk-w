import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const animeId = searchParams.get("animeId");

        let characters: any[] = [];

        try {
            const whereClause: any = {};
            if (animeId && animeId !== "all") {
                whereClause.animeId = { equals: animeId, mode: "insensitive" };
            }

            characters = await prisma.character.findMany({
                where: whereClause,
                orderBy: { createdAt: "asc" }
            });
        } catch (dbErr) {
            console.warn("Neon DB query failed for mobile characters, using local fallback:", dbErr);
        }

        if (characters.length === 0) {
            const filePath = path.join(process.cwd(), "src/data/characters.json");
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                let list = Array.isArray(data) ? data : (data.characters || []);
                if (animeId && animeId !== "all") {
                    list = list.filter((c: any) => c.animeId && c.animeId.toLowerCase() === animeId.toLowerCase());
                }
                characters = list;
            }
        }

        return mobileSuccess(characters);
    } catch (error) {
        console.error("Mobile Characters API Error:", error);
        return mobileError("فشل جلب قائمة الشخصيات", 500);
    }
}
