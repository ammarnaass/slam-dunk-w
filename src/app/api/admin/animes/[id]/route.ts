import { NextResponse } from "next/server";
import { getAnimes, saveAnimes, getEpisodes, saveEpisodes } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

// GET /api/admin/animes/[id] - Get single anime
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const animes = getAnimes();
    const anime = animes.find(a => a.id === id);

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
    if (!auth || auth.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const animes = getAnimes();
    const index = animes.findIndex(a => a.id === id);

    if (index === -1) {
        return NextResponse.json({ error: "Anime not found" }, { status: 404 });
    }

    const updatedAnime = { ...animes[index], ...body, id: id }; // ID cannot be changed
    animes[index] = updatedAnime;
    saveAnimes(animes);

    return NextResponse.json(updatedAnime);
}

// DELETE /api/admin/animes/[id] - Delete anime
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const auth = await verifyAuth(request);
    if (!auth || auth.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const animes = getAnimes();
    const newAnimes = animes.filter(a => a.id !== id);

    if (animes.length === newAnimes.length) {
        return NextResponse.json({ error: "Anime not found" }, { status: 404 });
    }

    // Cascading delete: Remove episodes associated with this anime
    const episodes = getEpisodes();
    const newEpisodes = episodes.filter(ep => ep.animeId !== id);

    saveAnimes(newAnimes);
    saveEpisodes(newEpisodes);

    return NextResponse.json({ success: true });
}
