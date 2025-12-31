import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Clean filename: timestamp + original name (slugified)
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase();
        const filename = `${timestamp}-${safeName}`;

        const uploadDir = path.join(process.cwd(), "public/uploads");

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Directory might already exist
        }

        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        return NextResponse.json({
            url: `/uploads/${filename}`,
            filename: filename
        });
    } catch (error: any) {
        console.error("Upload API Error:", error);
        return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
    }
}
