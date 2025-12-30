import { NextResponse } from "next/server";
import { getSession, login } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";

export async function POST(request: Request) {
    try {
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
        const selectedPlan = await prisma.plan.findUnique({
            where: { id: planId }
        });

        if (!selectedPlan) {
            return NextResponse.json({ error: "Plan not found" }, { status: 404 });
        }

        // Calculate end date based on plan duration
        const startDate = new Date();
        const endDate = new Date();
        // Assuming duration is in days (e.g. "30")
        const durationDays = parseInt(selectedPlan.duration) || 30;
        endDate.setDate(startDate.getDate() + durationDays);

        // Update User Subscription in transaction
        const updatedUser = await prisma.$transaction(async (tx) => {
            await tx.userSubscription.upsert({
                where: { userId: session.user.id },
                update: {
                    planType: selectedPlan.name.toLowerCase(),
                    isActive: true,
                    startDate: startDate,
                    endDate: endDate,
                    // Note: My schema has planType but some apps might use planId references.
                    // For now map labels as per legacy logic.
                },
                create: {
                    userId: session.user.id,
                    planType: selectedPlan.name.toLowerCase(),
                    isActive: true,
                    startDate: startDate,
                    endDate: endDate,
                }
            });

            // Re-fetch user to get full profile
            return await tx.user.findUnique({
                where: { id: session.user.id },
                include: { subscription: true }
            });
        });

        if (!updatedUser) {
            return NextResponse.json({ error: "User update failed" }, { status: 500 });
        }

        // Update session with new subscription data
        const { password: _, ...userWithoutPassword } = updatedUser;
        await login(userWithoutPassword);

        return NextResponse.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error("Subscription Verify Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
