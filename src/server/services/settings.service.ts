import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prismadb";
import { 
    SiteIdentity, 
    FullSiteSettings, 
    UpdateSiteIdentityDto, 
    UpdateSiteSettingsDto,
    PromoBannerConfig 
} from "@/server/types/settings.types";
import { 
    updateSiteIdentitySchema, 
    updateSiteSettingsSchema 
} from "@/server/validators/settings.validator";

const DATA_DIR = path.join(process.cwd(), "src/data");

export const DEFAULT_SITE_IDENTITY: SiteIdentity = {
    siteName: "أنمي دايز",
    siteNameEn: "ANIME DAZE",
    siteDescription: "منصة البث السينمائية الأولى لعشاق الأنمي في العالم العربي. مكتبة حصرية تجمع بين روائع الجيل الذهبي وأحدث إصدارات الأنمي المترجمة والمدبلجة بجودة فائقة 4K.",
    logoUrl: "https://lh3.googleusercontent.com/aida/AEtjO1UiSLhyw_pFl8EO-8FgL4HrDL2d9Oh8xf35S6mPsvN6CLAeTTpeY_Y4zm4rjsRuYww9UNqCIq98rij14h5osYHduHU73DQq5klCpJEZFM7q4WFwh529QyN14MBCOgwBQCafVH2D7Zqj8RtA7YeHEf53boMtjjIUflj41hkrmwwiWjLsz5RNzpHujzyYnwEwKNuokWsaRntGYjD842E14qpqp84ozsbd8Inmm-2ENPd6K5e0xdj7TSIckg",
    faviconUrl: "/favicon.ico",
    brandColor: "#dc2626",
    accentColor: "#ffb95f"
};

import { DEFAULT_PROMO_BANNER } from "@/lib/promo-presets";
import { DEFAULT_FOOTER_CONFIG } from "@/lib/footer-presets";
import { DEFAULT_API_APP_CONFIG } from "@/lib/app-presets";
import { DEFAULT_HOME_SCREEN_CONFIG } from "@/lib/home-presets";
export { DEFAULT_PROMO_BANNER, DEFAULT_FOOTER_CONFIG, DEFAULT_API_APP_CONFIG, DEFAULT_HOME_SCREEN_CONFIG };

function loadLocalSettings(): any {
    try {
        const filePath = path.join(DATA_DIR, "settings.json");
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }
    } catch (e) {
        console.error("Local settings fallback read error:", e);
    }
    return {
        ...DEFAULT_SITE_IDENTITY,
        currency: "ج.م",
        maintenanceMode: false,
        maintenanceMessage: "الموقع في وضع الصيانة حالياً. سنعود قريباً!",
        socialLinks: {},
        sliderAnimeIds: ["slam-dunk"],
        promoBanner: DEFAULT_PROMO_BANNER,
        footer: DEFAULT_FOOTER_CONFIG,
        apiApp: DEFAULT_API_APP_CONFIG,
        homeConfig: DEFAULT_HOME_SCREEN_CONFIG
    };
}

function persistLocalSettings(data: any) {
    try {
        const filePath = path.join(DATA_DIR, "settings.json");
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
        console.error("Local settings fallback write error:", e);
    }
}

let cachedSettings: FullSiteSettings | null = null;
let lastFetchTimestamp = 0;
const SETTINGS_CACHE_TTL_MS = 30 * 1000; // 30 seconds

export class SettingsService {
    static clearCache() {
        cachedSettings = null;
        lastFetchTimestamp = 0;
    }

    /**
     * Get consolidated settings with DB priority and JSON fallback.
     */
    static async getSettings(): Promise<FullSiteSettings> {
        const now = Date.now();
        if (cachedSettings && (now - lastFetchTimestamp < SETTINGS_CACHE_TTL_MS)) {
            return cachedSettings;
        }

        let dbSettings: any = null;
        try {
            const dbPromise = prisma.settings.findUnique({
                where: { id: "global" }
            });
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Settings DB Timeout")), 2500)
            );
            dbSettings = await Promise.race([dbPromise, timeoutPromise]);
        } catch (_) {}

        const local = loadLocalSettings();

        const result: FullSiteSettings = {
            siteName: dbSettings?.siteName || local.siteName || DEFAULT_SITE_IDENTITY.siteName,
            siteNameEn: local.siteNameEn || DEFAULT_SITE_IDENTITY.siteNameEn,
            siteDescription: local.siteDescription || DEFAULT_SITE_IDENTITY.siteDescription,
            logoUrl: dbSettings?.logoUrl || local.logoUrl || DEFAULT_SITE_IDENTITY.logoUrl,
            faviconUrl: dbSettings?.faviconUrl || local.faviconUrl || DEFAULT_SITE_IDENTITY.faviconUrl,
            brandColor: local.brandColor || DEFAULT_SITE_IDENTITY.brandColor,
            accentColor: local.accentColor || DEFAULT_SITE_IDENTITY.accentColor,
            currency: local.currency || "ج.م",
            maintenanceMode: dbSettings?.maintenanceMode ?? local.maintenanceMode ?? false,
            maintenanceMessage: dbSettings?.maintenanceMessage || local.maintenanceMessage || "الموقع في وضع الصيانة حالياً.",
            socialLinks: local.socialLinks || {},
            admob: local.admob || {
                isEnabled: dbSettings?.admobEnabled ?? false,
                appId: dbSettings?.admobAppId ?? "",
                bannerId: dbSettings?.admobBannerId ?? "",
                interstitialId: dbSettings?.admobInterstitialId ?? ""
            },
            apiApp: local.apiApp ? {
                ...DEFAULT_API_APP_CONFIG,
                ...local.apiApp,
                releaseNotes: Array.isArray(local.apiApp.releaseNotes)
                    ? local.apiApp.releaseNotes
                    : DEFAULT_API_APP_CONFIG.releaseNotes
            } : DEFAULT_API_APP_CONFIG,
            sliderAnimeIds: local.sliderAnimeIds || ["slam-dunk"],
            promoBanner: local.promoBanner ? {
                ...DEFAULT_PROMO_BANNER,
                ...local.promoBanner,
                features: local.promoBanner.features || DEFAULT_PROMO_BANNER.features
            } : DEFAULT_PROMO_BANNER,
            footer: local.footer ? {
                ...DEFAULT_FOOTER_CONFIG,
                ...local.footer,
                socialLinks: local.footer.socialLinks || DEFAULT_FOOTER_CONFIG.socialLinks,
                exploreLinks: local.footer.exploreLinks || DEFAULT_FOOTER_CONFIG.exploreLinks,
                helpLinks: local.footer.helpLinks || DEFAULT_FOOTER_CONFIG.helpLinks,
            } : DEFAULT_FOOTER_CONFIG,
            homeConfig: local.homeConfig ? {
                sections: Array.isArray(local.homeConfig.sections) && local.homeConfig.sections.length > 0
                    ? local.homeConfig.sections
                    : DEFAULT_HOME_SCREEN_CONFIG.sections,
                slider: {
                    ...DEFAULT_HOME_SCREEN_CONFIG.slider,
                    ...(local.homeConfig.slider || {})
                }
            } : DEFAULT_HOME_SCREEN_CONFIG
        };

        cachedSettings = result;
        lastFetchTimestamp = now;
        return result;
    }

    /**
     * Fast retrieval of site identity for public consumer pages (Navbar, Footer, SEO).
     */
    static async getPublicIdentity(): Promise<SiteIdentity> {
        const settings = await this.getSettings();
        return {
            siteName: settings.siteName,
            siteNameEn: settings.siteNameEn,
            siteDescription: settings.siteDescription,
            logoUrl: settings.logoUrl,
            faviconUrl: settings.faviconUrl,
            brandColor: settings.brandColor,
            accentColor: settings.accentColor
        };
    }

    /**
     * Update site identity (name, logo, favicon, colors).
     */
    static async updateIdentity(input: UpdateSiteIdentityDto): Promise<SiteIdentity> {
        const validated = updateSiteIdentitySchema.parse(input);
        const currentLocal = loadLocalSettings();

        const updatedData = {
            ...currentLocal,
            siteName: validated.siteName,
            siteNameEn: validated.siteNameEn ?? currentLocal.siteNameEn ?? DEFAULT_SITE_IDENTITY.siteNameEn,
            siteDescription: validated.siteDescription ?? currentLocal.siteDescription,
            logoUrl: validated.logoUrl,
            faviconUrl: validated.faviconUrl ?? currentLocal.faviconUrl,
            brandColor: validated.brandColor ?? currentLocal.brandColor ?? DEFAULT_SITE_IDENTITY.brandColor,
            accentColor: validated.accentColor ?? currentLocal.accentColor ?? DEFAULT_SITE_IDENTITY.accentColor
        };

        // 1. Persist locally
        persistLocalSettings(updatedData);

        // 2. Sync to Neon DB
        try {
            await prisma.settings.upsert({
                where: { id: "global" },
                update: {
                    siteName: updatedData.siteName,
                    logoUrl: updatedData.logoUrl,
                    faviconUrl: updatedData.faviconUrl
                },
                create: {
                    id: "global",
                    siteName: updatedData.siteName,
                    logoUrl: updatedData.logoUrl,
                    faviconUrl: updatedData.faviconUrl
                }
            });
        } catch (dbError) {
            console.warn("Neon DB sync failed for identity, persisted locally:", dbError);
        }

        // 3. Clear in-memory cache & revalidate Next.js cache
        SettingsService.clearCache();
        try {
            revalidatePath("/", "layout");
            revalidatePath("/admin", "layout");
        } catch (_) {}

        return {
            siteName: updatedData.siteName,
            siteNameEn: updatedData.siteNameEn,
            siteDescription: updatedData.siteDescription,
            logoUrl: updatedData.logoUrl,
            faviconUrl: updatedData.faviconUrl,
            brandColor: updatedData.brandColor,
            accentColor: updatedData.accentColor
        };
    }

    /**
     * Update full settings payload.
     */
    static async updateFullSettings(input: UpdateSiteSettingsDto): Promise<FullSiteSettings> {
        const validated = updateSiteSettingsSchema.parse(input);
        const currentLocal = loadLocalSettings();

        const merged = {
            ...currentLocal,
            ...validated,
            socialLinks: {
                ...(currentLocal.socialLinks || {}),
                ...(validated.socialLinks || {})
            },
            admob: {
                ...(currentLocal.admob || {}),
                ...(validated.admob || {})
            },
            apiApp: {
                ...(currentLocal.apiApp || DEFAULT_API_APP_CONFIG),
                ...(validated.apiApp || {})
            },
            promoBanner: validated.promoBanner ? {
                ...(currentLocal.promoBanner || DEFAULT_PROMO_BANNER),
                ...validated.promoBanner
            } : (currentLocal.promoBanner || DEFAULT_PROMO_BANNER),
            footer: validated.footer ? {
                ...(currentLocal.footer || DEFAULT_FOOTER_CONFIG),
                ...validated.footer
            } : (currentLocal.footer || DEFAULT_FOOTER_CONFIG),
            homeConfig: validated.homeConfig ? {
                sections: validated.homeConfig.sections || currentLocal.homeConfig?.sections || DEFAULT_HOME_SCREEN_CONFIG.sections,
                slider: {
                    ...DEFAULT_HOME_SCREEN_CONFIG.slider,
                    ...(currentLocal.homeConfig?.slider || {}),
                    ...(validated.homeConfig.slider || {})
                }
            } : (currentLocal.homeConfig || DEFAULT_HOME_SCREEN_CONFIG)
        };

        // 1. Persist locally
        persistLocalSettings(merged);

        // 2. Sync to DB
        try {
            await prisma.settings.upsert({
                where: { id: "global" },
                update: {
                    siteName: merged.siteName,
                    logoUrl: merged.logoUrl,
                    faviconUrl: merged.faviconUrl,
                    maintenanceMode: !!merged.maintenanceMode,
                    maintenanceMessage: merged.maintenanceMessage,
                    admobEnabled: !!merged.admob?.isEnabled,
                    admobAppId: merged.admob?.appId,
                    admobBannerId: merged.admob?.bannerId,
                    admobInterstitialId: merged.admob?.interstitialId
                },
                create: {
                    id: "global",
                    siteName: merged.siteName || DEFAULT_SITE_IDENTITY.siteName,
                    logoUrl: merged.logoUrl || DEFAULT_SITE_IDENTITY.logoUrl,
                    faviconUrl: merged.faviconUrl || DEFAULT_SITE_IDENTITY.faviconUrl,
                    maintenanceMode: !!merged.maintenanceMode,
                    maintenanceMessage: merged.maintenanceMessage,
                    admobEnabled: !!merged.admob?.isEnabled,
                    admobAppId: merged.admob?.appId,
                    admobBannerId: merged.admob?.bannerId,
                    admobInterstitialId: merged.admob?.interstitialId
                }
            });
        } catch (dbError) {
            console.warn("Neon DB sync failed for full settings, persisted locally:", dbError);
        }

        // 3. Clear in-memory cache & revalidate Next.js cache
        SettingsService.clearCache();
        try {
            revalidatePath("/", "layout");
            revalidatePath("/admin", "layout");
        } catch (_) {}

        return this.getSettings();
    }

    /**
     * Emergency reset back to the official "أنمي دايز" branding presets.
     */
    static async resetToDefaultIdentity(): Promise<SiteIdentity> {
        return this.updateIdentity(DEFAULT_SITE_IDENTITY);
    }

    /**
     * Mobile app configuration (backward compatibility).
     */
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
