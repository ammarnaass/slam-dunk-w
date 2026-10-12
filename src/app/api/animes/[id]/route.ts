import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import fs from "fs";
import path from "path";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        let anime: any = null;

        try {
            anime = await prisma.anime.findUnique({
                where: { id: id }
            });
        } catch (dbErr) {
            console.warn("Neon DB query failed for anime details, using local fallback:", dbErr);
        }

        if (!anime) {
            const filePath = path.join(process.cwd(), "src/data/animes.json");
            if (fs.existsSync(filePath)) {
                const list = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                anime = list.find((a: any) => a.id === id);
            }
        }

        if (!anime) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(anime);
    } catch (error) {
        console.error("Root Anime Details GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch anime" }, { status: 500 });
    }
}
