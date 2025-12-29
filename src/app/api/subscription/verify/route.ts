import { NextResponse } from "next/server";
import { getSession, login } from "@/lib/auth";
import { getUsers, saveUsers, getPlans } from "@/lib/db";

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { transactionId, planId, paymentMethodId } = body;

    if (!transactionId || !planId) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Verify Plan exists
    const plans = getPlans();
    const selectedPlan = plans.find(p => p.id === planId);

    if (!selectedPlan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === session.user.id);

    if (userIndex === -1) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate end date based on plan duration
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + selectedPlan.duration);

    const updatedUser = { ...users[userIndex] };
    updatedUser.subscription = {
        type: "PREMIUM", // Assuming all paid plans give Premium access for now
        status: "ACTIVE",
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        planId: selectedPlan.id,
        paymentMethodId: paymentMethodId || "unknown"
    };

    users[userIndex] = updatedUser;
    saveUsers(users);

    // Update session with new subscription data
    const { password: _, ...userWithoutPassword } = updatedUser;
    await login(userWithoutPassword);

    return NextResponse.json({ success: true, user: userWithoutPassword });
}
