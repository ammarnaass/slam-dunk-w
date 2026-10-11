import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { prisma } from "@/lib/prismadb";
import { encrypt } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return mobileError("يرجى إدخال البريد الإلكتروني وكلمة المرور", 400);
        }

        let user: any = null;

        try {
            user = await prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() },
                include: { subscription: true }
            });
        } catch (dbErr) {
            console.warn("Prisma login error, trying local users fallback:", dbErr);
        }

        // Fallback to local users.json if DB fails
        if (!user) {
            try {
                const usersPath = path.join(process.cwd(), "src/data/users.json");
                if (fs.existsSync(usersPath)) {
                    const localUsers = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
                    const found = (Array.isArray(localUsers) ? localUsers : []).find(
                        (u: any) => u.email?.toLowerCase() === email.toLowerCase().trim()
                    );
                    if (found) {
                        user = {
                            id: found.id || "usr-local-1",
                            name: found.name || "مستخدم سلام دانك",
                            email: found.email,
                            role: found.role || "user",
                            password: found.password || "123456",
                            avatar: found.avatar || null,
                            subscription: {
                                planType: found.isVip ? "yearly" : "free",
                                isActive: found.isVip || false
                            }
                        };
                    }
                }
            } catch (fallbackErr) {
                console.error("Local users fallback error:", fallbackErr);
            }
        }

        let isPasswordValid = false;
        if (user && user.password) {
            if (user.password === password) {
                isPasswordValid = true;
            } else {
                try {
                    const bcrypt = await import("bcryptjs");
                    isPasswordValid = await bcrypt.compare(password, user.password);
                } catch (_) {}
            }
        }

        if (!user || !isPasswordValid) {
            return mobileError("البريد الإلكتروني أو كلمة المرور غير صحيحة", 401);
        }

        // Generate JWT Token (valid for 30 days for mobile app convenience)
        const token = await encrypt({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar || null,
            isVip: user.subscription?.isActive || user.role?.toLowerCase() === "admin",
            planType: user.subscription?.planType || (user.role?.toLowerCase() === "admin" ? "vip" : "free"),
            token
        };

        return mobileSuccess(userData);
    } catch (error) {
        console.error("Mobile Login Error:", error);
        return mobileError("حدث خطأ أثناء تسجيل الدخول", 500);
    }
}
