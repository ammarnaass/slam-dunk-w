import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";

// GET /api/admin/animes/[id]/episodes - Get episodes for an anime
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Fetch from Prisma
    const episodes = await prisma.episode.findMany({
        where: { animeId: id },
        orderBy: { createdAt: 'asc' }, // Fallback to creation time
        include: {
            servers: true
        }
    });

    // Map to legacy structure if needed, but returning clean list is better for admin?
    // Admin likely expects list.
    // We can map servers back to flat fields if the admin frontend relies on them, 
    // but better to return the full object so admin can see servers.
    // Existing frontend might break if it expects "mega_link" property directly.
    // But since "video_url" and "mega_link" were separate, maybe I should map the first server?
    // Let's return the Prisma object structure. The admin panel might need update if it uses specific fields, 
    // but usually admin panels are flexible or I can't see the frontend code for admin easy.
    // I will return the Prisma structure.

    return NextResponse.json(episodes);
}

// POST /api/admin/animes/[id]/episodes - Add new episode to anime
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const auth = await verifyAuth(request);
    if (!auth || auth.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, episodeNumber, servers, mega_link, video_url, duration, thumbnail, seasonNumber } = body;

    // Basic validation
    if (!episodeNumber) {
        return NextResponse.json({ error: "Episode number is required" }, { status: 400 });
    }

    // Prepare servers data
    const serversToCreate = Array.isArray(servers) && servers.length > 0
        ? servers.map((s: any) => ({ name: s.name, url: s.url, quality: s.quality || "HD" }))
        : [
            ...(mega_link ? [{ name: "Mega", url: mega_link, quality: "HD" }] : []),
            ...(video_url ? [{ name: "Default", url: video_url, quality: "HD" }] : [])
        ];

    // Generate ID
    const episodeId = Math.random().toString(36).substr(2, 9);

    try {
        // Create Episode
        const newEpisode = await prisma.episode.create({
            data: {
                id: episodeId,
                animeId: id,
                title: title || `Episode ${episodeNumber}`,
                episodeNumber: Number(episodeNumber),
                seasonNumber: Number(seasonNumber || 1),
                thumbnail: thumbnail || "/logoep.jpg",
                duration: duration || "24:00",
                servers: {
                    create: serversToCreate
                }
            },
            include: {
                servers: true
            }
        });

        // Optionally update Anime totalEpisodes? 
        // We can do a count and update.
        const count = await prisma.episode.count({ where: { animeId: id } });
        await prisma.anime.update({
            where: { id: id },
            data: { totalEpisodes: count }
        });

        return NextResponse.json(newEpisode, { status: 201 });

    } catch (error) {
        console.error("Admin Episode Create Error:", error);
        return NextResponse.json({ error: "Failed to create episode" }, { status: 500 });
    }
}
