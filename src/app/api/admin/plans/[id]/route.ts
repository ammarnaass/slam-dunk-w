import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const plan = await prisma.plan.findUnique({
            where: { id }
        });

        if (!plan) {
            return NextResponse.json({ error: "Plan not found" }, { status: 404 });
        }

        return NextResponse.json(plan);
    } catch (error) {
        console.error("Admin Plan GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const updatedPlan = await prisma.plan.update({
            where: { id },
            data: {
                name: body.name,
                price: body.price,
                duration: String(body.duration),
                description: body.description,
                features: body.features,
                isActive: body.active !== undefined ? body.active : undefined,
            }
        });

        return NextResponse.json(updatedPlan);
    } catch (error) {
        console.error("Admin Plan PUT Error:", error);
        return NextResponse.json({ error: "Plan not found or update failed" }, { status: 404 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await prisma.plan.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin Plan DELETE Error:", error);
        return NextResponse.json({ error: "Plan not found or delete failed" }, { status: 404 });
    }
}
