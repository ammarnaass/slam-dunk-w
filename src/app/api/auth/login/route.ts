import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { z } from "zod";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const LoginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export async function POST(request: NextRequest) {
    try {
        const clonedRequest = request.clone();
        const body = await clonedRequest.json();

        // Validate input
        const result = LoginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: "بيانات غير صالحة" },
                { status: 400 }
            );
        }

        const { username, password } = result.data;

        let user: any = null;

        // Try Prisma query
        try {
            user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: username },
                        { name: username }
                    ]
                }
            });
        } catch (dbError) {
            console.warn("Prisma user lookup failed, trying local fallback:", dbError);
        }

        // Fallback to local users.json if database was unreachable or user not found
        if (!user) {
            try {
                const usersFilePath = path.join(process.cwd(), "src/data/users.json");
                if (fs.existsSync(usersFilePath)) {
                    const localUsers = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
                    user = localUsers.find((u: any) => 
                        u.email === username || u.name === username || u.username === username
                    );
                }
            } catch (e) {
                console.error("Local users read error:", e);
            }
        }

        // Check fallback admin credentials
        if (!user) {
            if ((username === "admin" || username === "admin@slamdunk.com") && 
                (password === "admin123456" || password === "admin")) {
                const adminPayload = {
                    id: "admin-system-id",
                    name: "مدير النظام",
                    email: "admin@slamdunk.com",
                    role: "ADMIN",
                    avatar: "/logoep.jpg"
                };
                await login(adminPayload);
                return NextResponse.json(adminPayload);
            }

            return NextResponse.json(
                { error: "اسم المستخدم أو كلمة المرور غير صحيحة" },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = user.password 
            ? await bcrypt.compare(password, user.password)
            : false;

        // Also check if admin with master password
        const isMasterAdmin = (username === "admin" || user.name === "admin" || user.email === "admin@slamdunk.com") && 
                              (password === "admin123456" || password === "admin");

        if (!isValid && !isMasterAdmin) {
            return NextResponse.json(
                { error: "اسم المستخدم أو كلمة المرور غير صحيحة" },
                { status: 401 }
            );
        }

        // Login successful
        const userWithoutPassword = {
            id: user.id,
            name: user.name || user.username || "مدير النظام",
            email: user.email,
            role: (user.name === "admin" || user.email === "admin@slamdunk.com" || user.email === "admin@example.com" || user.role?.toUpperCase() === "ADMIN") ? "ADMIN" : user.role,
            profileImage: user.avatar || user.profileImage,
            avatar: user.avatar || user.profileImage
        };

        await login(userWithoutPassword);

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء تسجيل الدخول" },
            { status: 500 }
        );
    }
}
