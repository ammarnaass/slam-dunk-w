import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();

        // Check if user is logged in and is an admin
        if (!session || !session.user || session.user.role?.toUpperCase() !== "ADMIN") {
            console.warn("Unauthorized access attempt to Admin Users API");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch all users with their subscriptions
        const users = await prisma.user.findMany({
            include: {
                subscription: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Map data to ensure sensitive fields like password are not sent
        const safeUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            username: user.name, // Support both fields
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            profileImage: user.avatar,
            createdAt: user.createdAt,
            subscription: user.subscription
        }));

        return NextResponse.json(safeUsers);
    } catch (error) {
        console.warn("Admin Users GET Error, falling back to local users:", error);
        try {
            const fs = await import("fs");
            const path = await import("path");
            const filePath = path.join(process.cwd(), "src/data/users.json");
            if (fs.existsSync(filePath)) {
                const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                const safeUsers = users.map((user: any) => ({
                    id: user.id,
                    name: user.name,
                    username: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    profileImage: user.avatar,
                    createdAt: user.createdAt,
                    subscription: user.subscription
                }));
                return NextResponse.json(safeUsers);
            }
        } catch (fallbackError) {
            console.error("Local fallback failed:", fallbackError);
        }
        return NextResponse.json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
