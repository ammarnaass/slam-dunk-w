import { NextResponse } from "next/server";
import { getUsers } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = getUsers();
    // Return users without passwords for security
    const safeUsers = users.map(({ password, ...user }) => user);

    return NextResponse.json(safeUsers);
}
