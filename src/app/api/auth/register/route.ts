import { NextResponse } from "next/server";
import { z } from "zod";
import { login } from "@/lib/auth";
import { getUsers, saveUsers, hashPassword } from "@/lib/db";
import { User } from "@/types";

const RegisterSchema = z.object({
    username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        const result = RegisterSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const { username, email, password } = result.data;
        const users = getUsers();

        // Check if user exists
        if (users.find((u) => u.email === email || u.username === username)) {
            return NextResponse.json(
                { error: "المستخدم موجود بالفعل" },
                { status: 400 }
            );
        }

        // Create new user
        const newUser: User = {
            id: crypto.randomUUID(),
            username,
            email,
            password: await hashPassword(password),
            role: "USER", // Default role
            createdAt: new Date().toISOString(),
        };

        // Save user
        users.push(newUser);
        saveUsers(users);

        // Auto login
        const { password: _, ...userWithoutPassword } = newUser;
        await login(userWithoutPassword);

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        return NextResponse.json(
            { error: "حدث خطأ أثناء التسجيل" },
            { status: 500 }
        );
    }
}
