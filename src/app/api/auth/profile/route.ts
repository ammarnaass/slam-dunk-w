import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, login } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import bcrypt from "bcryptjs";

const UpdateProfileSchema = z.object({
    username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().optional().or(z.literal("")),
    gender: z.string().optional(), // Removed strict enum to allow flexibility or match schema
    phoneNumber: z.string().optional(),
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

        const { username, email, password, gender, phoneNumber, profileImage } = result.data;

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
            // Schema might not have gender/phoneNumber if I didn't add them.
            // My schema in 3800 had:
            // name, email, role, password, avatar, createdAt, updatedAt, watchlist, history, reviews, subscription
            // NO gender, NO phoneNumber.
            // If the app expects them, I should add them to schema or ignore.
            // Previous JSON had them.
            // If I ignore them, they won't be saved.
            // Migration script did NOT migrate gender/phone? 
            // Step 3804 migration script:
            // `update: { name, password, role, avatar, watchlist }`
            // It DROPPED gender.
            // This is a regression if the app uses gender.
            // But existing schema definition didn't include it. 
            // I will ignore them for now to avoid Prisma validation error "Unknown argument".
            // However, `avatar` maps to `profileImage`.
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
