import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prismadb";

const DATA_DIR = path.join(process.cwd(), "src/data");

function loadLocalSettings(): any {
    try {
        const filePath = path.join(DATA_DIR, "settings.json");
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }
    } catch (e) {
        console.error("Local settings fallback error:", e);
    }
    return {
        siteName: "ANIME DAZE",
        siteDescription: "منصة مشاهدة الأنمي الأولى بجودة عالية ومجاناً",
        maintenanceMode: false
    };
}

export class SettingsService {
    static async getSettings() {
        let dbSettings: any = null;
        try {
            dbSettings = await prisma.settings.findUnique({
                where: { id: "global" }
            });
        } catch (_) {}

        const localSettings = loadLocalSettings();

        return {
            siteName: dbSettings?.siteName || localSettings.siteName || "ANIME DAZE",
            siteDescription: localSettings.siteDescription || "شاهد أحدث حلقات أنمي سلام دانك وأروع الأعمال بجودة عالية",
            logoUrl: dbSettings?.logoUrl || localSettings.logoUrl || "",
            faviconUrl: dbSettings?.faviconUrl || localSettings.faviconUrl || "",
            maintenanceMode: dbSettings?.maintenanceMode ?? localSettings.maintenanceMode ?? false,
            maintenanceMessage: dbSettings?.maintenanceMessage || localSettings.maintenanceMessage || "الموقع في وضع الصيانة حالياً.",
            socialLinks: localSettings.socialLinks || {},
            sliderAnimeIds: localSettings.sliderAnimeIds || ["slam-dunk"]
        };
    }

    static async getMobileConfig() {
        const localSettings = loadLocalSettings();
        const apiApp = localSettings.apiApp || {};
        const admob = localSettings.admob || {};

        return {
            serverTime: new Date().toISOString(),
            status: apiApp.isMaintenance ? "maintenance" : "ok",
            maintenance: {
                isUnderMaintenance: apiApp.isMaintenance || false,
                title: apiApp.maintenanceTitle || "صيانة دورية",
                message: apiApp.maintenanceMessage || "التطبيق في وضع الصيانة حالياً. سنعود قريباً!",
                estimatedEnd: apiApp.maintenanceEndTime || null,
                devBypassKey: apiApp.devBypassKey || "SLAM_DEV_2026"
            },
            version: {
                latestVersion: apiApp.latestVersion || "1.0.0",
                latestBuild: apiApp.latestBuild || 12,
                minSupportedVersion: apiApp.minSupportedVersion || "1.0.0",
                minSupportedBuild: apiApp.minSupportedBuild || 10,
                forceUpdate: apiApp.forceUpdate || false,
                updateUrl: apiApp.updateUrl || "",
                directApkUrl: apiApp.directApkUrl || "https://slam-dunk-w.vercel.app/downloads/slamdunk-latest.apk",
                releaseNotes: apiApp.releaseNotes || []
            },
            admob: {
                isEnabled: admob.isEnabled ?? false,
                bannerId: admob.bannerId || "",
                interstitialId: admob.interstitialId || "",
                rewardedId: admob.rewardedId || "",
                interstitialInterval: apiApp.interstitialInterval || 2
            },
            features: {
                allowDownloads: apiApp.allowDownloads ?? true,
                defaultServer: apiApp.defaultServer || "Mega",
                defaultQuality: apiApp.defaultQuality || "720p"
            }
        };
    }
}
