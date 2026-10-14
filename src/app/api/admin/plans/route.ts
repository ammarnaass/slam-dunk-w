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

export async function GET() {
    try {
        let dbPlans: any[] = [];
        try {
            dbPlans = await prisma.plan.findMany({
                orderBy: { price: 'asc' }
            });
        } catch (dbErr) {
            console.warn("Prisma plans findMany failed:", dbErr);
        }

        if (Array.isArray(dbPlans) && dbPlans.length > 0) {
            return NextResponse.json(dbPlans);
        }

        // Fallback to local plans.json
        const localPlans = getLocalPlans();
        return NextResponse.json(localPlans);
    } catch (error) {
        console.error("Admin Plans GET Error:", error);
        return NextResponse.json(getLocalPlans());
    }
}

export async function POST(request: Request) {
    try {
        const user = await verifyAuth(request);
        if (!user || user.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        if (!body.name || typeof body.price !== 'number') {
            return NextResponse.json({ error: "البيانات غير صالحة. يرجى إدخال اسم الخطة وسعرها." }, { status: 400 });
        }

        const planId = body.id || `plan-${Date.now()}`;
        const newPlanData = {
            id: planId,
            name: body.name,
            price: Number(body.price),
            duration: String(body.duration || "30"),
            description: body.description || "",
            features: Array.isArray(body.features) ? body.features.filter(Boolean) : [],
            isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
            isPopular: Boolean(body.isPopular)
        };

        // 1. Try to persist in Prisma
        let createdPlan = newPlanData;
        try {
            const dbCreated = await prisma.plan.create({
                data: {
                    id: newPlanData.id,
                    name: newPlanData.name,
                    price: newPlanData.price,
                    duration: newPlanData.duration,
                    description: newPlanData.description,
                    features: newPlanData.features,
                    isActive: newPlanData.isActive,
                }
            });
            createdPlan = { ...dbCreated, isPopular: newPlanData.isPopular };
        } catch (dbErr) {
            console.warn("Prisma plan create failed (using json fallback):", dbErr);
        }

        // 2. Sync to local plans.json
        const localPlans = getLocalPlans();
        const existingIdx = localPlans.findIndex((p: any) => p.id === planId);
        if (existingIdx >= 0) {
            localPlans[existingIdx] = createdPlan;
        } else {
            localPlans.push(createdPlan);
        }
        saveLocalPlans(localPlans);

        return NextResponse.json(createdPlan);
    } catch (error) {
        console.error("Admin Plans POST Error:", error);
        return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
    }
}

