import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function getLocalPlansFallback() {
    try {
        const filePath = path.join(process.cwd(), "src/data/plans.json");
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, "utf-8");
            const parsed = JSON.parse(content);
            return Array.isArray(parsed) ? parsed : [];
        }
    } catch (e) {
        console.warn("Failed to read local plans fallback:", e);
    }
    return [];
}

function saveLocalPlan(plan: any) {
    try {
        const filePath = path.join(process.cwd(), "src/data/plans.json");
        let list: any[] = [];
        if (fs.existsSync(filePath)) {
            try {
                list = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                if (!Array.isArray(list)) list = [];
            } catch (_) {
                list = [];
            }
        }
        list.push(plan);
        fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {
        console.warn("Failed to write plan to local json:", e);
    }
}

// 1. GET: Fetch available subscription plans for mobile app
export async function GET() {
    try {
        const queryPromise = prisma.plan.findMany({
            where: { isActive: true },
            orderBy: { price: "asc" }
        });
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("DB Timeout")), 2500)
        );

        const plans = await Promise.race([queryPromise, timeoutPromise]);
        if (Array.isArray(plans) && plans.length > 0) {
            return mobileSuccess(plans);
        }
    } catch (error) {
        console.warn("Prisma plans query failed or timed out, using fallback:", error);
    }

    const fallback = getLocalPlansFallback();
    return mobileSuccess(fallback);
}

// 2. POST: Create a new plan from mobile app (إنشاء الخطة)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const name = body.name?.trim();
        const price = typeof body.price === "number" ? body.price : parseFloat(body.price);

        if (!name) {
            return mobileError("اسم الخطة مطلوب", 400);
        }

        if (isNaN(price) || price < 0) {
            return mobileError("سعر الخطة غير صالح", 400);
        }

        const duration = String(body.duration || "30");
        const description = body.description ? String(body.description).trim() : "";
        const features = Array.isArray(body.features)
            ? body.features.filter((f: any) => typeof f === "string" && f.trim().length > 0)
            : [];
        const isActive = body.isActive !== undefined ? Boolean(body.isActive) : true;
        const newId = `plan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

        const planData = {
            id: newId,
            name,
            price,
            duration,
            description,
            features,
            isActive
        };

        let createdPlan: any = planData;

        // Try saving to Database
        try {
            const dbPromise = prisma.plan.create({
                data: planData
            });
            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("DB Timeout")), 3000)
            );
            createdPlan = await Promise.race([dbPromise, timeoutPromise]);
        } catch (dbError) {
            console.warn("Could not save plan to Prisma DB, saving to local json fallback:", dbError);
        }

        // Always sync with local file
        saveLocalPlan(createdPlan);

        return mobileSuccess(createdPlan, "تم إنشاء الخطة بنجاح");
    } catch (error: any) {
        console.error("Mobile Plan Creation Error:", error);
        return mobileError(error.message || "فشل إنشاء الخطة", 500);
    }
}
