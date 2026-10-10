import { NextResponse } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        let characters: any[] = [];

        try {
            characters = await prisma.character.findMany({
                orderBy: { number: 'asc' }
            });
        } catch (dbErr) {
            console.warn("Neon DB query failed for mobile characters, using local fallback:", dbErr);
        }

        if (characters.length === 0) {
            const filePath = path.join(process.cwd(), "src/data/characters.json");
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                characters = Array.isArray(data) ? data : (data.characters || []);
            }
        }

        return mobileSuccess(characters);
    } catch (error) {
        console.error("Mobile Characters API Error:", error);
        return mobileError("فشل جلب قائمة الشخصيات", 500);
    }
}
