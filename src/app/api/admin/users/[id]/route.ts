import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const UpdateUserSchema = z.object({
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional().or(z.literal("")),
    role: z.string().optional(), // 'admin' or 'user'
    subscription: z.object({
        type: z.string(),
        status: z.string(),
        endDate: z.string().optional().nullable(),
    }).optional(),
});

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { getSession } = await import("@/lib/auth");
        const session = await getSession();

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id },
            include: { subscription: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { password, ...safeUser } = user;
        return NextResponse.json(safeUser);
    } catch (error) {
        console.error("Admin User Details GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { getSession } = await import("@/lib/auth");
        const session = await getSession();

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const result = UpdateUserSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
        }

        const { username, email, password, role, subscription } = result.data;

        // Prepare update data
        const updateData: any = {};
        if (username) updateData.name = username;
        if (email) updateData.email = email;
        if (role) updateData.role = role.toLowerCase();

        if (password && password.length >= 6) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Use transaction for user and subscription
        const updatedUser = await prisma.$transaction(async (tx: any) => {
            const user = await tx.user.update({
                where: { id },
                data: updateData
            });

            if (subscription) {
                await tx.userSubscription.upsert({
                    where: { userId: id },
                    update: {
                        type: subscription.type.toLowerCase(),
                        status: subscription.status.toLowerCase(),
                        endDate: subscription.endDate ? new Date(subscription.endDate) : null
                    },
                    create: {
                        userId: id,
                        type: subscription.type.toLowerCase(),
                        status: subscription.status.toLowerCase(),
                        endDate: subscription.endDate ? new Date(subscription.endDate) : null
                    }
                });
            }

            return await tx.user.findUnique({
                where: { id },
                include: { subscription: true }
            });
        });

        const { password: _, ...safeUser } = updatedUser!;
        return NextResponse.json(safeUser);
    } catch (error) {
        console.error("Admin User Details PUT Error:", error);
        return NextResponse.json({ error: "User not found or update failed" }, { status: 404 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { getSession } = await import("@/lib/auth");
        const session = await getSession();

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Prevent deleting self
        if (session.user.id === id) {
            return NextResponse.json({ error: "لا يمكنك حذف حسابك الخاص" }, { status: 400 });
        }

        await prisma.$transaction([
            prisma.userSubscription.deleteMany({ where: { userId: id } }),
            prisma.history.deleteMany({ where: { userId: id } }),
            prisma.review.deleteMany({ where: { userId: id } }),
            prisma.user.delete({ where: { id } })
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin User Details DELETE Error:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
