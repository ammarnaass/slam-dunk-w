import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || !session.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const methods = await prisma.paymentMethod.findMany({
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(methods);
    } catch (error) {
        console.error("[PAYMENT_METHODS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session || !session.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { id, name, type, details, icon, isActive } = body;

        if (!id || !name || !type) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const existing = await prisma.paymentMethod.findUnique({
            where: { id }
        });

        if (existing) {
            return new NextResponse("Payment method ID already exists", { status: 400 });
        }

        const method = await prisma.paymentMethod.create({
            data: {
                id,
                name,
                type,
                details,
                icon,
                isActive
            }
        });

        return NextResponse.json(method);
    } catch (error) {
        console.error("[PAYMENT_METHODS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
