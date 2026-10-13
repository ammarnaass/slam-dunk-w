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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const animeId = searchParams.get("animeId");
        const role = searchParams.get("role");
        const search = searchParams.get("search") || searchParams.get("q");

        let characters: any[] = [];

        try {
            const whereClause: any = {};
            if (animeId && animeId !== "all") {
                whereClause.animeId = { equals: animeId, mode: "insensitive" };
            }
            if (role && role !== "all") {
                whereClause.role = { contains: role, mode: "insensitive" };
            }
            if (search) {
                const s = search.trim();
                whereClause.OR = [
                    { name: { contains: s, mode: "insensitive" } },
                    { name_ar: { contains: s, mode: "insensitive" } },
                    { name_en: { contains: s, mode: "insensitive" } },
                    { name_jp: { contains: s, mode: "insensitive" } },
                    { description: { contains: s, mode: "insensitive" } },
                ];
            }

            characters = await prisma.character.findMany({
                where: whereClause,
                orderBy: { createdAt: "desc" },
            });
        } catch (dbError) {
            console.warn("DB Query failed for characters, using local fallback:", dbError);
        }

        if (characters.length === 0) {
            let list = loadLocalCharacters();
            if (animeId && animeId !== "all") {
                list = list.filter(c => c.animeId && c.animeId.toLowerCase() === animeId.toLowerCase());
            }
            if (role && role !== "all") {
                list = list.filter(c => c.role && c.role.toLowerCase().includes(role.toLowerCase()));
            }
            if (search) {
                const q = search.toLowerCase().trim();
                list = list.filter(c =>
                    (c.name || "").toLowerCase().includes(q) ||
                    (c.name_ar || "").toLowerCase().includes(q) ||
                    (c.name_en || "").toLowerCase().includes(q) ||
                    (c.name_jp || "").toLowerCase().includes(q) ||
                    (c.description || "").toLowerCase().includes(q) ||
                    (c.team || "").toLowerCase().includes(q)
                );
            }
            characters = list;
        }

        return NextResponse.json(characters);
    } catch (error) {
        console.error("Characters GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch characters" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        const displayName = body.name || body.name_ar || body.name_en;
        if (!displayName) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Generate clean slug ID from English name or timestamp
        const rawSlug = body.id || (body.name_en ? body.name_en : displayName);
        const id = rawSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || `char-${Date.now()}`;

        const characterRecord: any = {
            id,
            name: displayName,
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

        let savedCharacter = characterRecord;

        try {
            savedCharacter = await prisma.character.upsert({
                where: { id },
                create: characterRecord,
                update: characterRecord,
            });
        } catch (dbErr) {
            console.warn("DB Upsert failed for character, saving locally:", dbErr);
        }

        // Keep local characters.json updated as reliable fallback
        const localList = loadLocalCharacters();
        const existingIdx = localList.findIndex((c: any) => c.id === id);
        const jsonRecord = {
            ...characterRecord,
            voiceActorJa: body.voiceActorJa || null,
            voiceActorAr: body.voiceActorAr || null,
        };

        if (existingIdx >= 0) {
            localList[existingIdx] = { ...localList[existingIdx], ...jsonRecord };
        } else {
            localList.push(jsonRecord);
        }
        saveLocalCharacters(localList);

        return NextResponse.json(savedCharacter, { status: 201 });
    } catch (error) {
        console.error("Characters POST Error:", error);
        return NextResponse.json({ error: "Failed to create character" }, { status: 500 });
    }
}
