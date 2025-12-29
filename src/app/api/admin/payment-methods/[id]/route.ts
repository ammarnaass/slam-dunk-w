import { NextResponse } from "next/server";
import { getPaymentMethods, savePaymentMethods } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const methods = getPaymentMethods();
    const method = methods.find(p => p.id === id);

    if (!method) {
        return NextResponse.json({ error: "Payment Method not found" }, { status: 404 });
    }

    return NextResponse.json(method);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const methods = getPaymentMethods();
    const index = methods.findIndex(p => p.id === id);

    if (index === -1) {
        return NextResponse.json({ error: "Payment Method not found" }, { status: 404 });
    }

    // Merge updates
    methods[index] = { ...methods[index], ...body, id }; // Prevent ID change
    savePaymentMethods(methods);

    return NextResponse.json(methods[index]);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const methods = getPaymentMethods();
    const newMethods = methods.filter(p => p.id !== id);

    if (methods.length === newMethods.length) {
        return NextResponse.json({ error: "Payment Method not found" }, { status: 404 });
    }

    savePaymentMethods(newMethods);

    return NextResponse.json({ success: true });
}
