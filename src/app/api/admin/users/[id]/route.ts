import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { UserAdminService } from "@/server/services/user-admin.service";
import { updateUserAdminSchema } from "@/server/validators/user-admin.validator";
import { AppError } from "@/server/types/errors";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.user || session.user.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const user = await UserAdminService.getUserById(id);
        return NextResponse.json(user);
    } catch (error) {
        if (error instanceof AppError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode });
        }
        console.error("Admin User Details GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.user || session.user.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const parseResult = updateUserAdminSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json(
                { error: parseResult.error.issues[0]?.message || "بيانات غير صالحة" },
                { status: 400 }
            );
        }

        const updatedUser = await UserAdminService.updateUser(id, parseResult.data);
        return NextResponse.json(updatedUser);
    } catch (error) {
        if (error instanceof AppError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode });
        }
        console.error("Admin User Details PUT Error:", error);
        return NextResponse.json({ error: "فشل تحديث بيانات المستخدم" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.user || session.user.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await UserAdminService.deleteUser(id, session.user.id);

        return NextResponse.json({ success: true, message: "تم حذف المستخدم بنجاح" });
    } catch (error) {
        if (error instanceof AppError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode });
        }
        console.error("Admin User Details DELETE Error:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
