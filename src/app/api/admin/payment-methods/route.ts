import { NextResponse } from "next/server";
import { getPaymentMethods, savePaymentMethods, PaymentMethod } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
    const methods = getPaymentMethods();
    return NextResponse.json(methods);
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name || !body.type || !body.instructions) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const methods = getPaymentMethods();
    const newMethod: PaymentMethod = {
        id: crypto.randomUUID(),
        name: body.name,
        type: body.type, // 'card' or 'manual'
        instructions: body.instructions,
        logoUrl: body.logoUrl || "",
        active: true,
    };

    methods.push(newMethod);
    savePaymentMethods(methods);

    return NextResponse.json(newMethod);
}
