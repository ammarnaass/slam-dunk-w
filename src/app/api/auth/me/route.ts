import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { ProfileService } from "@/server/services/profile.service";
import { AppError } from "@/server/types/errors";

export async function GET() {
    try {
        const session = await getSession();

        if (!session || !session.user?.id) {
            return NextResponse.json(null);
        }

        try {
            const profile = await ProfileService.getProfile(session.user.id);
            return NextResponse.json({
                ...profile,
                profileImage: profile.avatar
            });
        } catch (err) {
            console.warn("ProfileService.getProfile failed in /api/auth/me, returning session user fallback:", err);
            return NextResponse.json({
                id: session.user.id,
                name: session.user.name || "مستخدم",
                email: session.user.email,
                role: session.user.role || "USER",
                profileImage: session.user.avatar || "/logoep.jpg",
                avatar: session.user.avatar || "/logoep.jpg",
                createdAt: session.user.createdAt || new Date().toISOString(),
                watchlist: session.user.watchlist || [],
                subscription: session.user.subscription || null
            });
        }
    } catch (error) {
        console.error("Error in /api/auth/me GET:", error);
        return NextResponse.json(null, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getSession();
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const body = await request.json();
        const updated = await ProfileService.updateProfile(session.user.id, body);

        return NextResponse.json({
            ...updated,
            profileImage: updated.avatar
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode });
        }
        console.error("Error in /api/auth/me PUT:", error);
        return NextResponse.json(
            { error: error?.message || "حدث خطأ أثناء تحديث الملف الشخصي" },
            { status: 500 }
        );
    }
}
