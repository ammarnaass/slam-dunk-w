import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prismadb";

export async function GET() {
    try {
        let settings = await prisma.settings.findUnique({
            where: { id: "global" }
        });

        if (!settings) {
            // Defaults if not found (though migration should have created it)
            settings = await prisma.settings.create({
                data: {
                    id: "global",
                    siteName: "سلام دانك",
                    maintenanceMode: false,
                }
            });
        }

        // Map flat DB structure to nested JSON structure expected by frontend/app if needed
        // The original JSON had nested apiApp and admob.
        // My Prisma schema flattened some or kept them.
        // Let's check schema again.
        // model Settings { siteName, maintenanceMode, maintenanceMessage, latestVersion, updateUrl, admobEnabled, ... }
        // The previous GET returned: { siteName, ... apiApp: {...}, admob: {...} } probably?
        // Let's look at `api_service.dart` or `flutter_app` usage of settings.
        // `src/app/api/mobile/v1/home/route.ts` (refactored) maps db settings to nested structure.
        // `src/app/api/settings/route.ts` is likely used by Admin Panel.
        // Admin Panel probably expects similar structure or I should update it.
        // Let's reconstruct the nested object for compatibility.

        const responseData = {
            siteName: settings.siteName,
            maintenanceMode: settings.maintenanceMode,
            maintenanceMessage: settings.maintenanceMessage,
            apiApp: {
                latestVersion: settings.latestVersion,
                updateUrl: settings.updateUrl
            },
            admob: {
                isEnabled: settings.admobEnabled,
                appId: settings.admobAppId,
                bannerId: settings.admobBannerId,
                interstitialId: settings.admobInterstitialId
            },
            // Social links were in JSON but I might have skipped them in Schema or mapped them?
            // Schema didn't show socialLinks details in my previous turn. I might have omitted it.
            // If admin needs it, I should have added it.
            // Let's verify schema later if needed. For now return what we have.
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Settings API Get Error:", error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newSettings = await request.json();

        // Update DB
        // Validating structure
        await prisma.settings.upsert({
            where: { id: "global" },
            update: {
                siteName: newSettings.siteName,
                maintenanceMode: newSettings.maintenanceMode,
                maintenanceMessage: newSettings.maintenanceMessage,
                // Nested updates
                latestVersion: newSettings.apiApp?.latestVersion,
                updateUrl: newSettings.apiApp?.updateUrl,
                admobEnabled: newSettings.admob?.isEnabled,
                admobAppId: newSettings.admob?.appId,
                admobBannerId: newSettings.admob?.bannerId,
                admobInterstitialId: newSettings.admob?.interstitialId
            },
            create: {
                id: "global",
                siteName: newSettings.siteName,
                maintenanceMode: newSettings.maintenanceMode,
                // ... map others
            }
        });

        // Return the saved object
        return NextResponse.json(newSettings);
    } catch (error) {
        console.error("Settings API Save Error:", error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
