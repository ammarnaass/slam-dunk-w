import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
    try {
        const methods = await prisma.paymentMethod.findMany();
        return NextResponse.json(methods);
    } catch (error) {
        console.error("Admin Payment Methods GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        if (!body.name || !body.type) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const newMethod = await prisma.paymentMethod.create({
            data: {
                id: crypto.randomUUID(),
                name: body.name,
                type: body.type, // 'card' or 'manual'
                details: body.instructions || "",
                icon: body.logoUrl || "",
                isActive: body.isActive !== undefined ? body.isActive : (body.active !== undefined ? body.active : true),
            }
        });

        return NextResponse.json(newMethod);
    } catch (error) {
        console.error("Admin Payment Methods POST Error:", error);
        return NextResponse.json({ error: "Failed to create payment method" }, { status: 500 });
    }
}
