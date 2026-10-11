import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const sessionUser = await verifyAuth(req);
        if (!sessionUser) {
            return mobileError("غير مصرح، يرجى تسجيل الدخول", 401);
        }

        let userDetails: any = null;
        try {
            userDetails = await prisma.user.findUnique({
                where: { id: sessionUser.id },
                include: { subscription: true }
            });
        } catch (dbErr) {
            console.warn("Prisma fetch user error:", dbErr);
        }

        if (!userDetails) {
            try {
                const fs = await import("fs");
                const path = await import("path");
                const usersPath = path.join(process.cwd(), "src/data/users.json");
                if (fs.existsSync(usersPath)) {
                    const localUsers = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
                    userDetails = (Array.isArray(localUsers) ? localUsers : []).find(
                        (u: any) => u.id === sessionUser.id || u.email?.toLowerCase() === sessionUser.email?.toLowerCase()
                    );
                }
            } catch (_) {}
        }

        const isAdmin = sessionUser.role?.toLowerCase() === "admin" || userDetails?.role?.toLowerCase() === "admin";
        const isVip = Boolean(userDetails?.subscription?.isActive || userDetails?.isVip || isAdmin);

        const data = {
            id: sessionUser.id,
            name: userDetails?.name || sessionUser.name,
            email: userDetails?.email || sessionUser.email,
            role: userDetails?.role || sessionUser.role,
            avatar: userDetails?.avatar || null,
            isVip,
            planType: userDetails?.subscription?.planType || (isAdmin ? "vip" : (isVip ? "yearly" : "free")),
            watchlist: userDetails?.watchlist || []
        };

        return mobileSuccess(data);
    } catch (error) {
        console.error("Mobile Auth Me Error:", error);
        return mobileError("حدث خطأ أثناء جلب الملف الشخصي", 500);
    }
}
