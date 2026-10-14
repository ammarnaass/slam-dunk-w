import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

function getLocalUsers(): any[] {
    try {
        const filePath = path.join(process.cwd(), "src/data/users.json");
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, "utf-8");
            const parsed = JSON.parse(content);
            return Array.isArray(parsed) ? parsed : [];
        }
    } catch (e) {
        console.warn("Failed to read local users:", e);
    }
    return [];
}

export async function GET() {
    try {
        const session = await getSession();

        // Check if user is logged in and is an admin
        if (!session || !session.user || session.user.role?.toUpperCase() !== "ADMIN") {
            console.warn("Unauthorized access attempt to Admin Users API");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let dbUsers: any[] = [];
        try {
            dbUsers = await prisma.user.findMany({
                include: {
                    subscription: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } catch (dbErr) {
            console.warn("Prisma users findMany failed:", dbErr);
        }

        const localUsers = getLocalUsers();

        // Map and merge
        const userMap = new Map<string, any>();

        // First populate local users
        for (const user of localUsers) {
            userMap.set(user.id, {
                id: user.id,
                name: user.name || user.username || "عضو",
                username: user.username || user.name || "",
                email: user.email,
                role: (user.role || "USER").toUpperCase(),
                avatar: user.avatar || user.profileImage || null,
                createdAt: user.createdAt || new Date().toISOString(),
                subscription: user.subscription ? {
                    planType: user.subscription.planType || "monthly",
                    isActive: Boolean(user.subscription.isActive),
                    endDate: user.subscription.endDate || null,
                } : null
            });
        }

        // Then override/add with DB users
        for (const user of dbUsers) {
            userMap.set(user.id, {
                id: user.id,
                name: user.name || "عضو",
                username: user.name || "",
                email: user.email,
                role: (user.role || "USER").toUpperCase(),
                avatar: user.avatar || null,
                createdAt: user.createdAt,
                subscription: user.subscription ? {
                    planType: user.subscription.planType || "monthly",
                    isActive: Boolean(user.subscription.isActive),
                    endDate: user.subscription.endDate ? new Date(user.subscription.endDate).toISOString() : null,
                } : (userMap.get(user.id)?.subscription || null)
            });
        }

        const safeUsers = Array.from(userMap.values());
        return NextResponse.json(safeUsers);
    } catch (error) {
        console.error("Admin Users GET Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

