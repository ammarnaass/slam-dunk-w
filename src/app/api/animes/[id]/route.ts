import { NextResponse } from "next/server";
import { getAnimes } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const animes = getAnimes();
    const anime = animes.find(a => a.id === id);

    if (!anime) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(anime);
}
