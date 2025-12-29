import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, login } from "@/lib/auth";
import { getUsers, saveUsers, hashPassword } from "@/lib/db";
import { User } from "@/types";

const UpdateProfileSchema = z.object({
    username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().optional().or(z.literal("")),
    gender: z.enum(["male", "female", "other"]).optional(),
    phoneNumber: z.string().optional(),
    profileImage: z.string().optional(),
});

export async function PUT(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
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
        const users = getUsers();
        const currentUserIndex = users.findIndex((u) => u.id === session.user.id);

        if (currentUserIndex === -1) {
            return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
        }

        // Check availability if changing username/email
        const existingUser = users.find(
            (u) =>
                (u.email === email || u.username === username) &&
                u.id !== session.user.id
        );

        if (existingUser) {
            return NextResponse.json(
                { error: "اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل" },
                { status: 400 }
            );
        }

        // Update user data
        const updatedUser = { ...users[currentUserIndex] };
        updatedUser.username = username;
        updatedUser.email = email;
        if (gender) updatedUser.gender = gender;
        if (phoneNumber) updatedUser.phoneNumber = phoneNumber;
        if (profileImage) updatedUser.profileImage = profileImage;

        if (password && password.length >= 6) {
            updatedUser.password = await hashPassword(password);
        } else if (password && password.length < 6 && password !== "") {
            return NextResponse.json(
                { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
                { status: 400 }
            );
        }

        users[currentUserIndex] = updatedUser;
        saveUsers(users);

        // Update session
        const { password: _, ...userWithoutPassword } = updatedUser;
        await login(userWithoutPassword);

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        return NextResponse.json(
            { error: "حدث خطأ أثناء تحديث الملف الشخصي" },
            { status: 500 }
        );
    }
}
