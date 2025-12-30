import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
    try {
        const characters = await prisma.character.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(characters);
    } catch (error) {
        console.error("Characters GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch characters' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        if (!body.name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Generate ID from name
        const id = body.id || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const newCharacter = await prisma.character.create({
            data: {
                id,
                name: body.name,
                description: body.description,
                image: body.image || body.imageProfile, // Support both naming variants if any
                role: body.role,
                team: body.team,
                position: body.position,
                number: body.number,
                height: body.height,
                weight: body.weight,
            }
        });

        return NextResponse.json(newCharacter, { status: 201 });
    } catch (error) {
        console.error("Characters POST Error:", error);
        return NextResponse.json({ error: 'Failed to create character' }, { status: 500 });
    }
}
