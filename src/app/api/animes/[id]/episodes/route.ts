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
        let episodes: any[] = [];

        try {
            episodes = await prisma.episode.findMany({
                where: { animeId: id },
                orderBy: { episodeNumber: 'asc' },
                include: { servers: true }
            });
        } catch (dbErr) {
            console.warn("Neon DB query failed for anime episodes, using local fallback:", dbErr);
        }

        if (!episodes || episodes.length === 0) {
            const filePath = path.join(process.cwd(), "src/data/episodes.json");
            if (fs.existsSync(filePath)) {
                const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                const list = Array.isArray(raw) ? raw : [];
                episodes = list.filter((ep: any) => ep.animeId === id || !ep.animeId || id === "slam-dunk");
            }
        }

        const normalizedEpisodes = (episodes || []).map((ep: any) => ({
            id: String(ep.id),
            animeId: ep.animeId || id,
            title: ep.title,
            description: ep.description || "",
            thumbnail: ep.thumbnail || "/logoep.jpg",
            duration: ep.duration || "23:30",
            episodeNumber: ep.episodeNumber || ep.episode_number || parseInt(ep.title.match(/\d+/g)?.join("") || ep.id || "1"),
            seasonNumber: ep.seasonNumber || ep.season || 1,
            servers: ep.servers && ep.servers.length > 0 ? ep.servers : [
                ...(ep.mega_link ? [{ id: `srv-mega-${ep.id}`, name: "سيرفر ميجا السريع", url: ep.mega_link, quality: "1080p FHD" }] : []),
                ...(ep.video_url ? [{ id: `srv-direct-${ep.id}`, name: "سيرفر البث المباشر", url: ep.video_url, quality: "720p HD" }] : [])
            ],
            mega_link: ep.mega_link || "",
            video_url: ep.video_url || ""
        })).sort((a: any, b: any) => (a.episodeNumber || 0) - (b.episodeNumber || 0));

        return NextResponse.json(normalizedEpisodes);
    } catch (error) {
        console.error("Root Anime Episodes GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch episodes" }, { status: 500 });
    }
}
