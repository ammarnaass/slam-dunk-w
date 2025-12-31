import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";

// PUT /api/admin/episodes/[id] - Update episode
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const auth = await verifyAuth(request);
    if (!auth || auth.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, episodeNumber, servers, mega_link, video_url, duration, thumbnail } = body;

    try {
        const updatedEpisode = await prisma.$transaction(async (tx) => {
            // 1. Update Episode basic fields
            const ep = await tx.episode.update({
                where: { id: id },
                data: {
                    title: title,
                    episodeNumber: episodeNumber ? Number(episodeNumber) : undefined,
                    duration: duration,
                    thumbnail: thumbnail
                }
            });

            // 2. Replace Servers
            await tx.server.deleteMany({
                where: { episodeId: id }
            });

            // Prepare new servers
            const serversToCreate = Array.isArray(servers) && servers.length > 0
                ? servers.map((s: any) => ({ name: s.name, url: s.url, quality: s.quality || "HD", episodeId: id }))
                : [
                    ...(mega_link ? [{ name: "Mega", url: mega_link, quality: "HD", episodeId: id }] : []),
                    ...(video_url ? [{ name: "Default", url: video_url, quality: "HD", episodeId: id }] : [])
                ];

            if (serversToCreate.length > 0) {
                await tx.server.createMany({
                    data: serversToCreate
                });
            }

            return ep;
        });

        // Return full object including servers if needed by admin
        // But PUT usually just returns the updated record.
        // Let's stick to returning basic info or re-fetch.
        // To be safe, let's re-fetch with servers to return "complete" object
        const fullEpisode = await prisma.episode.findUnique({
            where: { id: id },
            include: { servers: true }
        });

        return NextResponse.json(fullEpisode);

    } catch (error) {
        console.error("Admin Episode Update Error:", error);
        return NextResponse.json({ error: "Episode not found or update failed" }, { status: 404 });
    }
}

// DELETE /api/admin/episodes/[id] - Delete episode
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const auth = await verifyAuth(request);
    if (!auth || auth.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Servers should be deleted via cascade if configured, or manually
        // We manually delete servers first
        await prisma.server.deleteMany({
            where: { episodeId: id }
        });

        await prisma.episode.delete({
            where: { id: id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin Episode Delete Error:", error);
        return NextResponse.json({ error: "Failed to delete episode" }, { status: 500 });
    }
}
