import { NextResponse } from "next/server";
import { getEpisodes, saveEpisodes } from "@/lib/db";
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
    const episodes = getEpisodes();
    const index = episodes.findIndex(ep => ep.id === id);

    if (index === -1) {
        return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    const updatedEpisode = { ...episodes[index], ...body, id: id };
    episodes[index] = updatedEpisode;
    saveEpisodes(episodes);

    return NextResponse.json(updatedEpisode);
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

    const episodes = getEpisodes();
    const newEpisodes = episodes.filter(ep => ep.id !== id);

    if (episodes.length === newEpisodes.length) {
        return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    saveEpisodes(newEpisodes);

    return NextResponse.json({ success: true });
}
