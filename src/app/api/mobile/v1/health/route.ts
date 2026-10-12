import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        let latestVersion = "1.2.0";
        let isMaintenance = false;
        let siteName = "ANIME DAZE";

        try {
            const settingsPath = path.join(process.cwd(), "src/data/settings.json");
            if (fs.existsSync(settingsPath)) {
                const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
                latestVersion = settings.apiApp?.latestVersion || latestVersion;
                isMaintenance = !!settings.apiApp?.isMaintenance;
                siteName = settings.siteNameEn || settings.siteName || siteName;
            }
        } catch (_) {}

        return NextResponse.json({
            success: true,
            status: "healthy",
            service: "ANIME DAZE Mobile API V1",
            siteName,
            version: latestVersion,
            isMaintenance,
            timestamp: new Date().toISOString()
        }, {
            headers: {
                "Cache-Control": "no-store, max-age=0"
            }
        });
    } catch (e: any) {
        return NextResponse.json({
            success: false,
            status: "error",
            message: e.message || "Failed health check"
        }, { status: 500 });
    }
}
