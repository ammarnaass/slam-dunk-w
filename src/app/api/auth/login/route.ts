import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { z } from "zod";
import bcrypt from "bcryptjs";

const LoginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export async function POST(request: NextRequest) {
    try {
        console.log("Login API: Starting request processing...");
        // Clone to avoid "Body already disturbed" error if something else touched it
        const clonedRequest = request.clone();
        const body = await clonedRequest.json();
        console.log("Login API: Body parsed successfully");

        // Validate input
        const result = LoginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: "بيانات غير صالحة" },
                { status: 400 }
            );
        }

        const { username, password } = result.data;

        // Find user by email or name
        // Note: Schema has 'name' and 'email'. Legacy used 'username'.
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: username }, // username field in form might be email
                    { name: username }
                ]
            }
        });

        // Check credentials
        // Fallback for hardcoded admin if database is empty or explicitly set
        // But better to stick to DB. If migraton worked, admin should be in DB.
        // If not, allow hardcoded fallback ONLY if user not found?
        // Let's rely on DB. If migration ran, existing users are there.

        if (!user || !user.password) {
            // Admin fallback for initial setup if needed
            if (username === "admin" && password === "admin") {
                // Check if admin exists in DB to prevent duplicate/confusion?
                // If not in DB, maybe we should CREATE it?
                // Or just allow login.
                const adminPayload = {
                    id: "admin-id",
                    name: "admin",
                    email: "admin@example.com",
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

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { error: "اسم المستخدم أو كلمة المرور غير صحيحة" },
                { status: 401 }
            );
        }

        // Login successful
        // Return user info without password
        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: (user.name === "admin" || user.email === "admin@example.com" || user.role?.toUpperCase() === "ADMIN") ? "ADMIN" : user.role,
            profileImage: user.avatar,
            avatar: user.avatar
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
