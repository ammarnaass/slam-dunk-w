import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";

// GET /api/admin/animes/[id] - Get single anime
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Using Prisma to fetch logic
    const anime = await prisma.anime.findUnique({
        where: { id: id },
        include: {
            // Include counts or minimal info if needed, usually details view needs it
            // For now just basic fields as per original API
            _count: {
                select: { episodes: true }
            }
        }
    });

    if (!anime) {
        return NextResponse.json({ error: "Anime not found" }, { status: 404 });
    }

    return NextResponse.json(anime);
}

// PUT /api/admin/animes/[id] - Update anime
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const auth = await verifyAuth(request);
    if (!auth || auth.role?.toUpperCase() !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    try {
        const updatedAnime = await prisma.anime.update({
            where: { id: id },
            data: {
                title: body.title,
                description: body.description,
                coverImage: body.coverImage,
                bannerImage: body.bannerImage,
                type: body.type,
                status: body.status,
                releaseYear: body.releaseYear ? Number(body.releaseYear) : undefined,
                totalEpisodes: body.totalEpisodes ? Number(body.totalEpisodes) : undefined,
                genres: body.genres,
                isFeatured: body.isFeatured
            }
        });

        return NextResponse.json(updatedAnime);
    } catch (error) {
        // P2025 = Record not found
        console.error("Admin Anime Update Error:", error);
        return NextResponse.json({ error: "Anime not found or update failed" }, { status: 404 });
    }
}

// DELETE /api/admin/animes/[id] - Delete anime
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const auth = await verifyAuth(request);
    if (!auth || auth.role?.toUpperCase() !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Manual Cascade Delete if not set in DB
        // Delete episodes first
        await prisma.episode.deleteMany({
            where: { animeId: id }
        });

        // Delete anime
        await prisma.anime.delete({
            where: { id: id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin Anime Delete Error:", error);
        return NextResponse.json({ error: "Failed to delete anime" }, { status: 500 });
    }
}
