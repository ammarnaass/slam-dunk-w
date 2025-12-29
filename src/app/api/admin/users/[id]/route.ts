import { NextResponse } from "next/server";
import { getUsers, saveUsers, hashPassword } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const UpdateUserSchema = z.object({
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional().or(z.literal("")),
    role: z.enum(["ADMIN", "USER"]).optional(),
    subscription: z.object({
        type: z.enum(["FREE", "PREMIUM"]),
        status: z.enum(["ACTIVE", "EXPIRED"]),
        endDate: z.string().optional(),
    }).optional(),
});

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const users = getUsers();
    const user = users.find(u => u.id === id);

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Prevent admin from changing their own role to USER effectively locking themselves out? 
    // Maybe allow it but warn. For now let's just allow it.

    const result = UpdateUserSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = { ...users[index] };
    const { username, email, password, role, subscription } = result.data;

    if (username) updatedUser.username = username;
    if (email) updatedUser.email = email;
    if (role) updatedUser.role = role;
    if (subscription) updatedUser.subscription = subscription;

    if (password && password.length >= 6) {
        updatedUser.password = await hashPassword(password);
    }

    users[index] = updatedUser;
    saveUsers(users);

    const { password: _, ...safeUser } = updatedUser;
    return NextResponse.json(safeUser);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Prevent deleting self
    if (session.user.id === id) {
        return NextResponse.json({ error: "لا يمكنك حذف حسابك الخاص" }, { status: 400 });
    }

    const users = getUsers();
    const newUsers = users.filter(u => u.id !== id);

    if (users.length === newUsers.length) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    saveUsers(newUsers);

    return NextResponse.json({ success: true });
}
