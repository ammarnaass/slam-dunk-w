import { NextResponse } from "next/server";
import { getPlans, savePlans, Plan } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
    const plans = getPlans();
    return NextResponse.json(plans);
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    // Basic validation could be improved with Zod
    if (!body.name || typeof body.price !== 'number') {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const plans = getPlans();
    const newPlan: Plan = {
        id: crypto.randomUUID(),
        name: body.name,
        price: body.price,
        duration: body.duration || 30,
        features: body.features || [],
        isPopular: body.isPopular || false,
        active: true,
    };

    plans.push(newPlan);
    savePlans(plans);

    return NextResponse.json(newPlan);
}
