import { NextResponse } from "next/server";
import { getAnimes, saveAnimes } from "@/lib/db";
import { Anime } from "@/types";
import { verifyAuth } from "@/lib/auth";

// GET /api/admin/animes - List all animes
export async function GET() {
    return NextResponse.json(getAnimes());
}

// POST /api/admin/animes - Create new anime
export async function POST(request: Request) {
    const auth = await verifyAuth(request);
    if (!auth || auth.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, coverImage, type, totalEpisodes, genres, status, releaseYear } = body;

    if (!title || !description || !coverImage) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const animes = getAnimes();

    // Generate simple ID from title
    let id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Fallback if title is non-latin (e.g. Arabic)
    if (!id) {
        id = 'anime-' + Math.random().toString(36).substr(2, 5);
    }

    // Check if ID exists
    if (animes.find(a => a.id === id)) {
        return NextResponse.json({ error: "Anime with this title already exists" }, { status: 409 });
    }

    const newAnime: Anime = {
        id,
        title,
        description,
        coverImage,
        type: type || "TV Series",
        status: status || "Ongoing",
        totalEpisodes: Number(totalEpisodes) || 0,
        releaseYear,
        genres: genres || []
    };

    animes.push(newAnime);
    saveAnimes(animes);

    return NextResponse.json(newAnime, { status: 201 });
}
