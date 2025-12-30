import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const anime = await prisma.anime.findUnique({
            where: { id: id }
        });

        if (!anime) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(anime);
    } catch (error) {
        console.error("Root Anime Details GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch anime" }, { status: 500 });
    }
}
