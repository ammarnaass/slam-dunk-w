import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, login } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import bcrypt from "bcryptjs";

const UpdateProfileSchema = z.object({
    username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().optional().or(z.literal("")),
    gender: z.string().optional(),
    phoneNumber: z.string().optional(),
    birthDate: z.string().optional(),
    profileImage: z.string().optional(),
});

export async function PUT(request: Request) {
    try {
        const session = await getSession();
        if (!session || !session.user) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const body = await request.json();
        const result = UpdateProfileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const { username, email, password, gender, phoneNumber, birthDate, profileImage } = result.data;

        // Check availability if changing username/email
        const existingUser = await prisma.user.findFirst({
            where: {
                AND: [
                    {
                        OR: [
                            { email: email },
                            { name: username }
                        ]
                    },
                    {
                        NOT: {
                            id: session.user.id
                        }
                    }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل" },
                { status: 400 }
            );
        }

        // Prepare update data
        const updateData: any = {
            name: username,
            email: email,
            gender: gender || null,
            phoneNumber: phoneNumber || null,
            birthDate: birthDate ? new Date(birthDate) : null,
            avatar: profileImage
        };

        if (password && password.length >= 6) {
            updateData.password = await bcrypt.hash(password, 10);
        } else if (password && password.length < 6 && password !== "") {
            return NextResponse.json(
                { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
                { status: 400 }
            );
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData
        });

        // Update session
        const userWithoutPassword = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profileImage: updatedUser.avatar,
            avatar: updatedUser.avatar
        };

        await login(userWithoutPassword);

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error("Profile API Error:", error);
        return NextResponse.json(
            { error: "حدث خطأ أثناء تحديث الملف الشخصي" },
            { status: 500 }
        );
    }
}
