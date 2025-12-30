import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";

// ==================== PUT ====================
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(req);
        if (!auth || auth.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;
        const body = await req.json();

        const updatedCharacter = await prisma.character.update({
            where: { id },
            data: {
                name: body.name,
                description: body.description,
                image: body.image || body.imageProfile,
                role: body.role,
                team: body.team,
                position: body.position,
                number: body.number,
                height: body.height,
                weight: body.weight,
            }
        });

        return NextResponse.json(updatedCharacter);
    } catch (error) {
        console.error("Character PUT Error:", error);
        return NextResponse.json(
            { error: "Character not found or update failed" },
            { status: 404 }
        );
    }
}

// ==================== DELETE ====================
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(req);
        if (!auth || auth.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;

        await prisma.character.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Character deleted" });
    } catch (error) {
        console.error("Character DELETE Error:", error);
        return NextResponse.json(
            { error: "Character not found or delete failed" },
            { status: 404 }
        );
    }
}
