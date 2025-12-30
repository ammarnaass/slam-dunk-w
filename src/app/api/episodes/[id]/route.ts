import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const updatedEpisode = await prisma.episode.update({
            where: { id },
            data: {
                title: body.title,
                thumbnail: body.thumbnail,
                duration: body.duration,
                // Servers are handled in sub-routes usually, but if provided here:
                // We'd need to clear and recreate or update.
            }
        });

        return NextResponse.json(updatedEpisode);
    } catch (error) {
        console.error("Root Episode PUT Error:", error);
        return NextResponse.json({ error: 'Failed to update episode' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Cascade delete via transaction if manual is needed, 
        // but Prisma schema should handle it if set.
        await prisma.episode.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Episode deleted' });
    } catch (error) {
        console.error("Root Episode DELETE Error:", error);
        return NextResponse.json({ error: 'Failed to delete episode' }, { status: 500 });
    }
}
