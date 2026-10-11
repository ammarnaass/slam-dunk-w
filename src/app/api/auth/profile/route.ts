import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { ProfileService } from "@/server/services/profile.service";
import { AppError } from "@/server/types/errors";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const profile = await ProfileService.getProfile(session.user.id);
        return NextResponse.json(profile);
    } catch (error: any) {
        if (error instanceof AppError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode });
        }
        console.error("Profile GET Error:", error);
        return NextResponse.json({ error: "تعذر جلب بيانات الملف الشخصي" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getSession();
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const body = await request.json();
        const updatedProfile = await ProfileService.updateProfile(session.user.id, body);

        return NextResponse.json(updatedProfile);
    } catch (error: any) {
        if (error instanceof AppError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode });
        }
        console.error("Profile PUT Error:", error);
        return NextResponse.json(
            { error: error?.message || "حدث خطأ أثناء تحديث الملف الشخصي" },
            { status: 500 }
        );
    }
}
