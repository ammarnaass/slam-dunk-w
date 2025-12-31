import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();

        // Check if user is logged in and is an admin
        if (!session || !session.user || session.user.role !== "ADMIN") {
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
        console.error("Admin Users GET Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
