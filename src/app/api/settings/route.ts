import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prismadb";
import { verifyAuth } from "@/lib/auth";
import fs from "fs";
import path from "path";

function getLocalSettings() {
    try {
        const filePath = path.join(process.cwd(), "src/data/settings.json");
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }
    } catch (e) {
        console.error("Failed to read local settings.json:", e);
    }
    return {
        siteName: "سلام دانك",
        logoUrl: "",
        faviconUrl: "",
        maintenanceMode: false,
        maintenanceMessage: "التطبيق في وضع الصيانة حالياً. سنعود قريباً!",
        admob: {
            isEnabled: false,
            appId: "",
            bannerId: "",
            interstitialId: "",
            rewardedId: ""
        },
        apiApp: {
            isMaintenance: false,
            maintenanceTitle: "صيانة دورية مجدولة",
            maintenanceMessage: "التطبيق في وضع الصيانة حالياً. سنعود قريباً!",
            maintenanceEndTime: "",
            devBypassKey: "SLAM_DEV_2026",
            latestVersion: "1.2.0",
            latestBuild: 12,
            minSupportedVersion: "1.0.0",
            minSupportedBuild: 10,
            forceUpdate: false,
            updateUrl: "https://play.google.com/store/apps/details?id=com.slamdunk.app",
            directApkUrl: "https://slam-dunk-w.vercel.app/downloads/slamdunk-latest.apk",
            releaseNotes: [
                "إضافة دعم سيرفرات المشاهدة بدقة FHD 1080p",
                "تسريع تحميل وتشغيل الحلقات بنسبة 40%",
                "تحسين واجهة المستخدم ودعم الاستئناف التلقائي"
            ],
            apiUrl: "https://slam-dunk-w.vercel.app/api/mobile/v1",
            apiKey: "slam_live_app_key_2026",
            defaultQuality: "720p",
            defaultServer: "Mega",
            allowDownloads: true,
            interstitialInterval: 2
        }
    };
}

function saveLocalSettings(data: any) {
    try {
        const filePath = path.join(process.cwd(), "src/data/settings.json");
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
        console.error("Failed to save local settings.json:", e);
    }
}

export async function GET() {
    const local = getLocalSettings();

    try {
        const dbSettings = await prisma.settings.findUnique({
            where: { id: "global" }
        });

        if (dbSettings) {
            const merged = {
                ...local,
                siteName: dbSettings.siteName || local.siteName,
                logoUrl: dbSettings.logoUrl ?? local.logoUrl,
                faviconUrl: dbSettings.faviconUrl ?? local.faviconUrl,
                maintenanceMode: dbSettings.maintenanceMode ?? local.maintenanceMode,
                maintenanceMessage: dbSettings.maintenanceMessage ?? local.maintenanceMessage,
                admob: {
                    ...local.admob,
                    isEnabled: dbSettings.admobEnabled ?? local.admob?.isEnabled,
                    appId: dbSettings.admobAppId ?? local.admob?.appId,
                    bannerId: dbSettings.admobBannerId ?? local.admob?.bannerId,
                    interstitialId: dbSettings.admobInterstitialId ?? local.admob?.interstitialId,
                },
                apiApp: {
                    ...local.apiApp,
                    latestVersion: dbSettings.latestVersion ?? local.apiApp?.latestVersion,
                    updateUrl: dbSettings.updateUrl ?? local.apiApp?.updateUrl,
                    isMaintenance: dbSettings.maintenanceMode ?? local.apiApp?.isMaintenance,
                }
            };
            return NextResponse.json(merged);
        }
    } catch (error) {
        console.warn("Neon DB query failed for settings, returning local config:", error);
    }

    return NextResponse.json(local);
}

export async function POST(request: Request) {
    try {
        const auth = await verifyAuth(request);
        if (!auth || auth.role?.toUpperCase() !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const newSettings = await request.json();
        const currentLocal = getLocalSettings();

        const merged = {
            ...currentLocal,
            ...newSettings,
            admob: {
                ...currentLocal.admob,
                ...(newSettings.admob || {})
            },
            apiApp: {
                ...currentLocal.apiApp,
                ...(newSettings.apiApp || {})
            }
        };

        // Always persist to local settings.json
        saveLocalSettings(merged);

        // Attempt to sync to Neon DB
        try {
            await prisma.settings.upsert({
                where: { id: "global" },
                update: {
                    siteName: merged.siteName,
                    logoUrl: merged.logoUrl,
                    faviconUrl: merged.faviconUrl,
                    maintenanceMode: !!merged.apiApp?.isMaintenance || !!merged.maintenanceMode,
                    maintenanceMessage: merged.apiApp?.maintenanceMessage || merged.maintenanceMessage,
                    latestVersion: merged.apiApp?.latestVersion,
                    updateUrl: merged.apiApp?.updateUrl,
                    admobEnabled: !!merged.admob?.isEnabled,
                    admobAppId: merged.admob?.appId,
                    admobBannerId: merged.admob?.bannerId,
                    admobInterstitialId: merged.admob?.interstitialId
                },
                create: {
                    id: "global",
                    siteName: merged.siteName || "سلام دانك",
                    logoUrl: merged.logoUrl,
                    faviconUrl: merged.faviconUrl,
                    maintenanceMode: !!merged.apiApp?.isMaintenance,
                    maintenanceMessage: merged.apiApp?.maintenanceMessage,
                    latestVersion: merged.apiApp?.latestVersion,
                    updateUrl: merged.apiApp?.updateUrl,
                    admobEnabled: !!merged.admob?.isEnabled,
                    admobAppId: merged.admob?.appId,
                    admobBannerId: merged.admob?.bannerId,
                    admobInterstitialId: merged.admob?.interstitialId
                }
            });
        } catch (dbError) {
            console.warn("Neon DB sync failed, but local settings were updated:", dbError);
        }

        return NextResponse.json(merged);
    } catch (error) {
        console.error("Settings API Save Error:", error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
