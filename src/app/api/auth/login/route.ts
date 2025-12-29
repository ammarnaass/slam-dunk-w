import { NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { getUsers, verifyPassword } from "@/lib/db";
import { z } from "zod";

const LoginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        const result = LoginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: "بيانات غير صالحة" },
                { status: 400 }
            );
        }

        const { username, password } = result.data;
        const users = getUsers();

        // Find user
        const user = users.find((u) => u.username === username || u.email === username);

        // Check credentials
        if (!user || !user.password || !(await verifyPassword(password, user.password))) {
            // Fallback for hardcoded admin if not in DB yet (migration phase)
            if (username === "admin" && password === "admin") {
                const adminUser = {
                    id: "admin-id",
                    username: "admin",
                    email: "admin@example.com",
                    role: "ADMIN" as const,
                    createdAt: new Date().toISOString(),
                };
                await login(adminUser);
                return NextResponse.json(adminUser);
            }

            return NextResponse.json(
                { error: "اسم المستخدم أو كلمة المرور غير صحيحة" },
                { status: 401 }
            );
        }

        // Login successful
        const { password: _, ...userWithoutPassword } = user;
        await login(userWithoutPassword);

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        return NextResponse.json(
            { error: "حدث خطأ أثناء تسجيل الدخول" },
            { status: 500 }
        );
    }
}
