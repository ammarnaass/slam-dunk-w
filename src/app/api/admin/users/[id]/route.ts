import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import fs from "fs";
import path from "path";

const UpdateUserSchema = z.object({
    username: z.string().min(2).optional(),
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional().or(z.literal("")),
    role: z.string().optional(), // 'ADMIN' or 'USER'
    quickAction: z.string().optional(), // 'UPGRADE_30' | 'UPGRADE_90' | 'UPGRADE_365' | 'UPGRADE_LIFETIME' | 'CANCEL_VIP' | 'TOGGLE_ROLE'
    subscription: z.object({
        type: z.string().optional(),
        planType: z.string().optional(),
        status: z.string().optional(),
        isActive: z.boolean().optional(),
        endDate: z.string().optional().nullable(),
    }).optional(),
});

function getLocalUsers(): any[] {
    try {
        const filePath = path.join(process.cwd(), "src/data/users.json");
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, "utf-8");
            return JSON.parse(content);
        }
    } catch (e) {
        console.warn("Failed to read local users:", e);
    }
    return [];
}

function updateLocalUser(id: string, updateFn: (user: any) => any) {
    try {
        const filePath = path.join(process.cwd(), "src/data/users.json");
        if (fs.existsSync(filePath)) {
            const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            const idx = users.findIndex((u: any) => u.id === id);
            if (idx >= 0) {
                users[idx] = updateFn(users[idx]);
                fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
                return users[idx];
            }
        }
    } catch (e) {
        console.warn("Failed to update local user:", e);
    }
    return null;
}

function deleteLocalUser(id: string) {
    try {
        const filePath = path.join(process.cwd(), "src/data/users.json");
        if (fs.existsSync(filePath)) {
            const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            const filtered = users.filter((u: any) => u.id !== id);
            fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), "utf-8");
        }
    } catch (e) {
        console.warn("Failed to delete local user:", e);
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || !session.user || session.user.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        let user: any = null;

        try {
            user = await prisma.user.findUnique({
                where: { id },
                include: { subscription: true }
            });
        } catch (dbErr) {
            console.warn("Prisma user findUnique error:", dbErr);
        }

        if (!user) {
            const localUsers = getLocalUsers();
            user = localUsers.find((u: any) => u.id === id);
        }

        if (!user) {
            return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
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
        const session = await getSession();
        if (!session || !session.user || session.user.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const result = UpdateUserSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0]?.message || "بيانات غير صالحة" }, { status: 400 });
        }

        const { username, name, email, password, role, quickAction, subscription } = result.data;

        // Fetch current user data from DB or local
        let currentUser: any = null;
        try {
            currentUser = await prisma.user.findUnique({
                where: { id },
                include: { subscription: true }
            });
        } catch (e) {
            console.warn("Could not fetch current user from DB:", e);
        }
        if (!currentUser) {
            currentUser = getLocalUsers().find((u: any) => u.id === id);
        }

        if (!currentUser) {
            return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
        }

        // Prepare updates
        const updateData: any = {};
        const chosenName = username || name;
        if (chosenName) updateData.name = chosenName;
        if (email) updateData.email = email;
        if (role) updateData.role = role.toUpperCase();

        if (password && password.length >= 6) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Handle Quick Actions
        let targetSubscription = subscription ? { ...subscription } : undefined;

        if (quickAction) {
            const now = new Date();
            let baseDate = now;

            // If user already has an active subscription ending in the future, extend from that date
            if (currentUser.subscription?.endDate && new Date(currentUser.subscription.endDate) > now) {
                baseDate = new Date(currentUser.subscription.endDate);
            }

            if (quickAction === "UPGRADE_30") {
                const targetDate = new Date(baseDate);
                targetDate.setDate(targetDate.getDate() + 30);
                targetSubscription = {
                    type: "PREMIUM",
                    planType: "monthly",
                    status: "ACTIVE",
                    isActive: true,
                    endDate: targetDate.toISOString()
                };
            } else if (quickAction === "UPGRADE_90") {
                const targetDate = new Date(baseDate);
                targetDate.setDate(targetDate.getDate() + 90);
                targetSubscription = {
                    type: "PREMIUM",
                    planType: "quarterly",
                    status: "ACTIVE",
                    isActive: true,
                    endDate: targetDate.toISOString()
                };
            } else if (quickAction === "UPGRADE_365") {
                const targetDate = new Date(baseDate);
                targetDate.setDate(targetDate.getDate() + 365);
                targetSubscription = {
                    type: "PREMIUM",
                    planType: "yearly",
                    status: "ACTIVE",
                    isActive: true,
                    endDate: targetDate.toISOString()
                };
            } else if (quickAction === "UPGRADE_LIFETIME") {
                const targetDate = new Date(baseDate);
                targetDate.setFullYear(targetDate.getFullYear() + 10);
                targetSubscription = {
                    type: "PREMIUM",
                    planType: "lifetime",
                    status: "ACTIVE",
                    isActive: true,
                    endDate: targetDate.toISOString()
                };
            } else if (quickAction === "CANCEL_VIP") {
                targetSubscription = {
                    type: "FREE",
                    planType: "free",
                    status: "EXPIRED",
                    isActive: false,
                    endDate: null
                };
            } else if (quickAction === "TOGGLE_ROLE") {
                const isCurrentlyAdmin = currentUser.role?.toUpperCase() === "ADMIN";
                updateData.role = isCurrentlyAdmin ? "USER" : "ADMIN";
            }
        }

        // 1. Try to update in Prisma
        let updatedUser: any = null;
        try {
            updatedUser = await prisma.$transaction(async (tx: any) => {
                const user = await tx.user.update({
                    where: { id },
                    data: updateData
                });

                if (targetSubscription) {
                    const isActive = targetSubscription.isActive ?? (targetSubscription.status?.toLowerCase() === 'active');
                    const planType = (targetSubscription.type || targetSubscription.planType || 'monthly').toLowerCase();
                    const endDate = targetSubscription.endDate ? new Date(targetSubscription.endDate) : null;

                    await tx.userSubscription.upsert({
                        where: { userId: id },
                        update: {
                            planType,
                            isActive,
                            endDate
                        },
                        create: {
                            userId: id,
                            planType,
                            isActive,
                            endDate
                        }
                    });
                }

                return await tx.user.findUnique({
                    where: { id },
                    include: { subscription: true }
                });
            });
        } catch (dbErr) {
            console.warn("Prisma transaction failed, updating local json:", dbErr);
        }

        // 2. Sync to local users.json
        updateLocalUser(id, (user) => {
            const next = { ...user, ...updateData };
            if (targetSubscription) {
                const isActive = targetSubscription.isActive ?? (targetSubscription.status?.toLowerCase() === 'active');
                next.subscription = {
                    planType: (targetSubscription.type || targetSubscription.planType || 'monthly').toLowerCase(),
                    isActive,
                    endDate: targetSubscription.endDate || null
                };
            }
            return next;
        });

        if (!updatedUser) {
            // Build safe user from local
            const localUser = getLocalUsers().find((u: any) => u.id === id);
            if (localUser) {
                const { password: _, ...safe } = localUser;
                return NextResponse.json(safe);
            }
        }

        const { password: _, ...safeUser } = updatedUser || currentUser;
        return NextResponse.json(safeUser);
    } catch (error) {
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
        if (!session || !session.user || session.user.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Prevent deleting self
        if (session.user.id === id) {
            return NextResponse.json({ error: "لا يمكنك حذف حسابك الخاص الذي تستخدمه حالياً" }, { status: 400 });
        }

        // 1. Delete from Prisma
        try {
            await prisma.$transaction([
                prisma.userSubscription.deleteMany({ where: { userId: id } }),
                prisma.history.deleteMany({ where: { userId: id } }),
                prisma.review.deleteMany({ where: { userId: id } }),
                prisma.user.delete({ where: { id } })
            ]);
        } catch (dbErr) {
            console.warn("Prisma user delete error:", dbErr);
        }

        // 2. Delete from users.json
        deleteLocalUser(id);

        return NextResponse.json({ success: true, message: "تم حذف المستخدم بنجاح" });
    } catch (error) {
        console.error("Admin User Details DELETE Error:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}

