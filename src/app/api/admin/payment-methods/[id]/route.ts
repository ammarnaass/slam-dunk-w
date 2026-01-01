import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getSession } from "@/lib/auth";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || !session.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { name, type, details, icon, isActive } = body;

        const method = await prisma.paymentMethod.update({
            where: { id },
            data: {
                name,
                type,
                details,
                icon,
                isActive
            }
        });

        return NextResponse.json(method);
    } catch (error) {
        console.error("[PAYMENT_METHOD_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || !session.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        const method = await prisma.paymentMethod.delete({
            where: { id }
        });

        return NextResponse.json(method);
    } catch (error) {
        console.error("[PAYMENT_METHOD_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
