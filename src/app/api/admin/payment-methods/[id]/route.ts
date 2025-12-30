import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const method = await prisma.paymentMethod.findUnique({
            where: { id }
        });

        if (!method) {
            return NextResponse.json({ error: "Payment Method not found" }, { status: 404 });
        }

        return NextResponse.json(method);
    } catch (error) {
        console.error("Admin Payment Method GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch payment method" }, { status: 500 });
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

        const updatedMethod = await prisma.paymentMethod.update({
            where: { id },
            data: {
                name: body.name,
                type: body.type,
                details: body.instructions || body.details,
                icon: body.logoUrl || body.icon,
                isActive: body.active !== undefined ? body.active : undefined,
            }
        });

        return NextResponse.json(updatedMethod);
    } catch (error) {
        console.error("Admin Payment Method PUT Error:", error);
        return NextResponse.json({ error: "Payment Method not found or update failed" }, { status: 404 });
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

        await prisma.paymentMethod.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin Payment Method DELETE Error:", error);
        return NextResponse.json({ error: "Payment Method not found or delete failed" }, { status: 404 });
    }
}
