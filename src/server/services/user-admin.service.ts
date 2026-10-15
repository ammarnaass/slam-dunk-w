import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prismadb";
import { AppError, ErrorCode } from "../types/errors";
import { UpdateUserAdminDto, SafeAdminUser } from "../types/user-admin.types";

const USERS_FILE = path.join(process.cwd(), "src/data/users.json");

export class UserAdminService {
    /**
     * Read local JSON users fallback
     */
    static getLocalUsers(): any[] {
        try {
            if (fs.existsSync(USERS_FILE)) {
                const content = fs.readFileSync(USERS_FILE, "utf-8");
                const parsed = JSON.parse(content);
                return Array.isArray(parsed) ? parsed : [];
            }
        } catch (e) {
            console.warn("Failed to read local users:", e);
        }
        return [];
    }

    /**
     * Update a user inside local JSON
     */
    static updateLocalUser(id: string, updateFn: (user: any) => any) {
        try {
            if (fs.existsSync(USERS_FILE)) {
                const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
                const idx = users.findIndex((u: any) => u.id === id);
                if (idx >= 0) {
                    users[idx] = updateFn(users[idx]);
                    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
                    return users[idx];
                }
            }
        } catch (e) {
            console.warn("Failed to update local user:", e);
        }
        return null;
    }

    /**
     * Delete user from local JSON
     */
    static deleteLocalUser(id: string) {
        try {
            if (fs.existsSync(USERS_FILE)) {
                const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
                const filtered = users.filter((u: any) => u.id !== id);
                fs.writeFileSync(USERS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
            }
        } catch (e) {
            console.warn("Failed to delete local user:", e);
        }
    }

    /**
     * Fetch user by ID from DB or local JSON
     */
    static async getUserById(id: string): Promise<SafeAdminUser> {
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
            const localUsers = this.getLocalUsers();
            user = localUsers.find((u: any) => u.id === id);
        }

        if (!user) {
            throw new AppError(ErrorCode.NOT_FOUND, "المستخدم غير موجود", 404);
        }

        const { password, ...safeUser } = user;
        return safeUser;
    }

    /**
     * Update user details, subscription, or role
     */
    static async updateUser(id: string, dto: UpdateUserAdminDto): Promise<SafeAdminUser> {
        const { username, name, email, password, role, quickAction, subscription } = dto;

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
            currentUser = this.getLocalUsers().find((u: any) => u.id === id);
        }

        if (!currentUser) {
            throw new AppError(ErrorCode.NOT_FOUND, "المستخدم غير موجود", 404);
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
                await tx.user.update({
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
        this.updateLocalUser(id, (user) => {
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
            const localUser = this.getLocalUsers().find((u: any) => u.id === id);
            if (localUser) {
                const { password: _, ...safe } = localUser;
                return safe;
            }
        }

        const { password: _, ...safeUser } = updatedUser || currentUser;
        return safeUser;
    }

    /**
     * Delete user and all related records
     */
    static async deleteUser(id: string, requesterId: string): Promise<void> {
        if (requesterId === id) {
            throw new AppError(ErrorCode.BAD_REQUEST, "لا يمكنك حذف حسابك الخاص الذي تستخدمه حالياً", 400);
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
        this.deleteLocalUser(id);
    }
}
