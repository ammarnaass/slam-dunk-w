import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { AnimeAdminService } from "@/server/services/anime-admin.service";
import { AppError } from "@/server/types/errors";

// GET /api/admin/animes/[id] - Get single anime
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const anime = await AnimeAdminService.getAnimeById(id);
        return NextResponse.json(anime);
    } catch (error: any) {
        if (error instanceof AppError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ error: "العمل غير موجود" }, { status: 404 });
    }
}

// PUT /api/admin/animes/[id] - Update anime
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const auth = await verifyAuth(request);
        if (!auth || auth.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "غير مصرح، يتطلب صلاحيات المشرف" }, { status: 401 });
        }

        const body = await request.json();
        const updated = await AnimeAdminService.updateAnime(id, body);

        return NextResponse.json(updated);
    } catch (error: any) {
        if (error instanceof AppError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode });
        }
        console.error("Admin Anime Update Error:", error);
        return NextResponse.json({ error: error?.message || "فشل تحديث العمل" }, { status: 500 });
    }
}

// DELETE /api/admin/animes/[id] - Delete anime
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const auth = await verifyAuth(request);
        if (!auth || auth.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "غير مصرح، يتطلب صلاحيات المشرف" }, { status: 401 });
        }

        await AnimeAdminService.deleteAnime(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Admin Anime Delete Error:", error);
        return NextResponse.json({ error: "فشل حذف العمل" }, { status: 500 });
    }
}
