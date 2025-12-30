import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
    try {
        const auth = await verifyAuth(new Request("http://localhost")); // dummy request or just check session
        // Wait, verifyAuth takes Request. But usually we use getSession() directly if no req needed or use cookies()
        // Let's use getSession() for simpler logic here.
        const { getSession } = await import("@/lib/auth");
        const session = await getSession();

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                createdAt: true,
                subscription: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Admin Users GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
