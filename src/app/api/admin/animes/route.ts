import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";

// GET /api/admin/animes - List all animes
export async function GET() {
    try {
        const animes = await prisma.anime.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        return NextResponse.json(animes);
    } catch (error) {
        console.error("Admin Animes GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch animes" }, { status: 500 });
    }
}

// POST /api/admin/animes - Create new anime
export async function POST(request: Request) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, coverImage, type, totalEpisodes, genres, status, releaseYear } = body;

        if (!title || !description || !coverImage) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Generate simple ID from title
        let id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        // Fallback if title is non-latin (e.g. Arabic)
        if (!id) {
            id = 'anime-' + Math.random().toString(36).substr(2, 5);
        }

        // Check if ID exists
        const existingAnime = await prisma.anime.findUnique({
            where: { id }
        });

        if (existingAnime) {
            // Append random string to make it unique or fail?
            // User might prefer fail to avoid duplicates, but original code failed.
            return NextResponse.json({ error: "Anime with this title already exists" }, { status: 409 });
        }

        const newAnime = await prisma.anime.create({
            data: {
                id,
                title,
                description,
                coverImage,
                type: type || "TV Series",
                status: status || "ongoing", // Schema default lower
                totalEpisodes: Number(totalEpisodes) || 0,
                releaseYear: releaseYear ? Number(releaseYear) : null,
                genres: genres || []
            }
        });

        return NextResponse.json(newAnime, { status: 201 });
    } catch (error) {
        console.error("Admin Animes POST Error:", error);
        return NextResponse.json({ error: "Failed to create anime" }, { status: 500 });
    }
}
