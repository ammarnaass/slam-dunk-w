import { NextResponse } from "next/server";
import { z } from "zod";
import { login } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import bcrypt from "bcryptjs";

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

        // Check if user exists (email or name)
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { name: username }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "المستخدم موجود بالفعل" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                // id: uuid auto generated or we can generate manually if we want to match legacy format,
                // but default(uuid()) in schema handles it.
                name: username,
                email: email,
                password: hashedPassword,
                role: "user", // Default role lowercase
                avatar: "" // or default
            }
        });

        // Auto login
        const userWithoutPassword = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            avatar: newUser.avatar
        };

        await login(userWithoutPassword);

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error("Register API Error:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء التسجيل" },
            { status: 500 }
        );
    }
}
