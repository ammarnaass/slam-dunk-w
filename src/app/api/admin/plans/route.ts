import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
    try {
        const plans = await prisma.plan.findMany({
            orderBy: { price: 'asc' }
        });
        return NextResponse.json(plans);
    } catch (error) {
        console.error("Admin Plans GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        if (!body.name || typeof body.price !== 'number') {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const newPlan = await prisma.plan.create({
            data: {
                id: crypto.randomUUID(),
                name: body.name,
                price: body.price,
                duration: String(body.duration || 30),
                description: body.description || "",
                features: body.features || [],
                isActive: body.isActive !== undefined ? body.isActive : (body.active !== undefined ? body.active : true),
            }
        });

        return NextResponse.json(newPlan);
    } catch (error) {
        console.error("Admin Plans POST Error:", error);
        return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
    }
}
