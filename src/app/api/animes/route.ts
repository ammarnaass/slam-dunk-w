import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import fs from "fs";
import path from "path";

let cachedAnimes: any = null;
let lastAnimesFetch = 0;
const ANIMES_CACHE_TTL = 60 * 1000; // 60 seconds

export async function GET() {
    try {
        const now = Date.now();
        if (cachedAnimes && (now - lastAnimesFetch < ANIMES_CACHE_TTL)) {
            return NextResponse.json(cachedAnimes, {
                headers: {
                    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
                }
            });
        }

        const animesPromise = prisma.anime.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Neon DB Timeout")), 2500)
        );
        const animes = await Promise.race([animesPromise, timeoutPromise]);
        cachedAnimes = animes;
        lastAnimesFetch = now;
        return NextResponse.json(animes, {
            headers: {
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
            }
        });
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
