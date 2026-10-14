import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";
import fs from "fs";
import path from "path";

function getLocalPlans(): any[] {
    try {
        const filePath = path.join(process.cwd(), "src/data/plans.json");
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, "utf-8");
            const parsed = JSON.parse(content);
            return Array.isArray(parsed) ? parsed : [];
        }
    } catch (e) {
        console.warn("Failed to read local plans:", e);
    }
    return [];
}

function saveLocalPlans(plans: any[]) {
    try {
        const filePath = path.join(process.cwd(), "src/data/plans.json");
        fs.writeFileSync(filePath, JSON.stringify(plans, null, 2), "utf-8");
    } catch (e) {
        console.warn("Failed to write plans.json:", e);
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        let plan: any = null;

        try {
            plan = await prisma.plan.findUnique({
                where: { id }
            });
        } catch (dbErr) {
            console.warn("Prisma plan findUnique error:", dbErr);
        }

        if (!plan) {
            const localPlans = getLocalPlans();
            plan = localPlans.find((p: any) => p.id === id);
        }

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
        const user = await verifyAuth(request);
        if (!user || user.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const updateData: any = {};
        if (body.name !== undefined) updateData.name = body.name;
        if (body.price !== undefined) updateData.price = Number(body.price);
        if (body.duration !== undefined) updateData.duration = String(body.duration);
        if (body.description !== undefined) updateData.description = body.description;
        if (body.features !== undefined) updateData.features = Array.isArray(body.features) ? body.features.filter(Boolean) : [];
        if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);
        else if (body.active !== undefined) updateData.isActive = Boolean(body.active);

        // 1. Update in Prisma
        let updatedPlan: any = null;
        try {
            updatedPlan = await prisma.plan.update({
                where: { id },
                data: updateData
            });
        } catch (dbErr) {
            console.warn("Prisma plan update error, falling back to json:", dbErr);
        }

        // 2. Sync to plans.json
        const localPlans = getLocalPlans();
        const existingIdx = localPlans.findIndex((p: any) => p.id === id);
        const finalPlan = {
            id,
            ...(existingIdx >= 0 ? localPlans[existingIdx] : {}),
            ...updateData,
            isPopular: body.isPopular !== undefined ? Boolean(body.isPopular) : (existingIdx >= 0 ? localPlans[existingIdx]?.isPopular : false)
        };

        if (existingIdx >= 0) {
            localPlans[existingIdx] = finalPlan;
        } else {
            localPlans.push(finalPlan);
        }
        saveLocalPlans(localPlans);

        return NextResponse.json(finalPlan);
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
        const user = await verifyAuth(request);
        if (!user || user.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // 1. Delete in Prisma
        try {
            await prisma.plan.delete({
                where: { id }
            });
        } catch (dbErr) {
            console.warn("Prisma plan delete error:", dbErr);
        }

        // 2. Delete in plans.json
        const localPlans = getLocalPlans();
        const filtered = localPlans.filter((p: any) => p.id !== id);
        saveLocalPlans(filtered);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin Plan DELETE Error:", error);
        return NextResponse.json({ error: "Plan not found or delete failed" }, { status: 404 });
    }
}

