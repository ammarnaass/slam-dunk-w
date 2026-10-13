import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { SettingsService } from "@/server/services/settings.service";

export async function GET() {
    try {
        const settings = await SettingsService.getSettings();
        return NextResponse.json(settings, {
            headers: {
                "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120"
            }
        });
    } catch (error) {
        console.error("Public Settings API Error:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const newSettings = await request.json();
        const updated = await SettingsService.updateFullSettings(newSettings);

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Settings API Save Error:", error);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}
