import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const animes = await prisma.anime.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        return NextResponse.json(animes);
    } catch (error) {
        console.warn("Neon DB query failed, falling back to local data:", error);
        try {
            const filePath = path.join(process.cwd(), "src/data/animes.json");
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                const list = Array.isArray(data) ? data : (data.animes || []);
                return NextResponse.json(list);
            }
        } catch (fallbackError) {
            console.error("Local JSON fallback failed:", fallbackError);
        }
        return NextResponse.json({ error: "Failed to fetch animes" }, { status: 500 });
    }
}
