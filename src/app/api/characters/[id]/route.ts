import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "src/data/characters.json");

function loadLocalCharacters(): any[] {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
            return Array.isArray(raw) ? raw : (raw.characters || []);
        }
    } catch (e) {
        console.error("Local characters fallback error:", e);
    }
    return [];
}

function saveLocalCharacters(characters: any[]) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(characters, null, 2), "utf-8");
    } catch (e) {
        console.error("Local characters save error:", e);
    }
}

// ==================== GET ====================
export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        let character: any = null;

        try {
            character = await prisma.character.findUnique({
                where: { id },
            });
        } catch (dbErr) {
            console.warn("DB Query failed for single character, using local fallback:", dbErr);
        }

        if (!character) {
            const list = loadLocalCharacters();
            character = list.find((c: any) => c.id === id);
        }

        if (!character) {
            return NextResponse.json({ error: "الشخصية غير موجودة" }, { status: 404 });
        }

        return NextResponse.json(character);
    } catch (error) {
        console.error("Character GET Error:", error);
        return NextResponse.json({ error: "فشل جلب بيانات الشخصية" }, { status: 500 });
    }
}

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

        const displayName = body.name || body.name_ar || body.name_en;

        const updateData: any = {
            name: displayName || id,
            name_ar: body.name_ar || null,
            name_en: body.name_en || null,
            name_jp: body.name_jp || null,
            animeId: body.animeId || null,
            description: body.description || null,
            image: body.image || body.imageProfile || "/hero-bg.jpg",
            role: body.role || null,
            team: body.team || null,
            position: body.position || null,
            number: body.number != null ? String(body.number) : null,
            height: body.height || null,
            weight: body.weight || null,
        };

        let updatedCharacter: any = { id, ...updateData };

        try {
            updatedCharacter = await prisma.character.update({
                where: { id },
                data: updateData,
            });
        } catch (dbErr) {
            console.warn("Character DB update failed, falling back to local file:", dbErr);
        }

        // Sync local characters.json
        const localList = loadLocalCharacters();
        const existingIdx = localList.findIndex((c: any) => c.id === id);
        const jsonRecord = {
            id,
            ...updateData,
            voiceActorJa: body.voiceActorJa || null,
            voiceActorAr: body.voiceActorAr || null,
        };

        if (existingIdx >= 0) {
            localList[existingIdx] = { ...localList[existingIdx], ...jsonRecord };
        } else {
            localList.push(jsonRecord);
        }
        saveLocalCharacters(localList);

        return NextResponse.json(updatedCharacter);
    } catch (error) {
        console.error("Character PUT Error:", error);
        return NextResponse.json(
            { error: "Character not found or update failed" },
            { status: 500 }
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

        try {
            await prisma.character.delete({
                where: { id },
            });
        } catch (dbErr) {
            console.warn("Character DB delete failed or already deleted:", dbErr);
        }

        // Sync local characters.json
        const localList = loadLocalCharacters();
        const filteredList = localList.filter((c: any) => c.id !== id);
        saveLocalCharacters(filteredList);

        return NextResponse.json({ message: "Character deleted" });
    } catch (error) {
        console.error("Character DELETE Error:", error);
        return NextResponse.json(
            { error: "Character not found or delete failed" },
            { status: 500 }
        );
    }
}
