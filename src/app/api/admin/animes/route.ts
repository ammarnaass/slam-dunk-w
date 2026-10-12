import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { AnimeAdminService } from "@/server/services/anime-admin.service";
import { AppError } from "@/server/types/errors";

// GET /api/admin/animes - List all animes
export async function GET() {
    try {
        const list = await AnimeAdminService.getAllAnimes();
        return NextResponse.json(list);
    } catch (error: any) {
        console.error("Admin Animes GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch animes" }, { status: 500 });
    }
}

// POST /api/admin/animes - Create new anime
export async function POST(request: Request) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "غير مصرح، يتطلب صلاحيات المشرف" }, { status: 401 });
        }

        const body = await request.json();
        const created = await AnimeAdminService.createAnime(body);

        return NextResponse.json(created, { status: 201 });
    } catch (error: any) {
        if (error instanceof AppError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode });
        }
        console.error("Admin Animes POST Error:", error);
        return NextResponse.json({ error: error?.message || "فشل إنشاء العمل الجديد" }, { status: 500 });
    }
}
