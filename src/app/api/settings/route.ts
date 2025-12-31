import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
    try {
        let settings = await prisma.settings.findUnique({
            where: { id: "global" }
        });

        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    id: "global",
                    siteName: "سلام دانك",
                    maintenanceMode: false,
                }
            });
        }

        const responseData = {
            siteName: settings.siteName,
            logoUrl: settings.logoUrl,
            faviconUrl: settings.faviconUrl,
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
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Settings API Get Error:", error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const newSettings = await request.json();

        const updated = await prisma.settings.upsert({
            where: { id: "global" },
            update: {
                siteName: newSettings.siteName,
                logoUrl: newSettings.logoUrl,
                faviconUrl: newSettings.faviconUrl,
                maintenanceMode: newSettings.maintenanceMode,
                maintenanceMessage: newSettings.maintenanceMessage,
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
                logoUrl: newSettings.logoUrl,
                faviconUrl: newSettings.faviconUrl,
                maintenanceMode: newSettings.maintenanceMode || false,
                latestVersion: newSettings.apiApp?.latestVersion,
                updateUrl: newSettings.apiApp?.updateUrl,
                admobEnabled: newSettings.admob?.isEnabled || false,
                admobAppId: newSettings.admob?.appId,
            }
        });

        return NextResponse.json(newSettings);
    } catch (error) {
        console.error("Settings API Save Error:", error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
