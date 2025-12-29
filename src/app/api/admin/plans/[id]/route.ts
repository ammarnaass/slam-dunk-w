import { NextResponse } from "next/server";
import { getPlans, savePlans } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const plans = getPlans();
    const plan = plans.find(p => p.id === id);

    if (!plan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(plan);
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
    const plans = getPlans();
    const index = plans.findIndex(p => p.id === id);

    if (index === -1) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Merge updates
    plans[index] = { ...plans[index], ...body, id }; // Prevent ID change
    savePlans(plans);

    return NextResponse.json(plans[index]);
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
    const plans = getPlans();
    const newPlans = plans.filter(p => p.id !== id);

    if (plans.length === newPlans.length) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    savePlans(newPlans);

    return NextResponse.json({ success: true });
}
