import { NextResponse } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import fs from "fs";
import path from "path";
import { DEFAULT_API_APP_CONFIG } from "@/lib/app-presets";
import { DEFAULT_PROMO_BANNER } from "@/lib/promo-presets";
import { DEFAULT_HOME_SCREEN_CONFIG } from "@/lib/home-presets";

export const dynamic = "force-dynamic";

function getSettings() {
    try {
        const filePath = path.join(process.cwd(), "src/data/settings.json");
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }
    } catch (e) {
        console.error("Failed to read settings in mobile config:", e);
    }
    return {
        siteName: "أنمي دايز",
        siteNameEn: "ANIME DAZE",
        siteDescription: "منصة البث السينمائية الأولى لعشاق الأنمي في العالم العربي. مكتبة حصرية تجمع بين روائع الجيل الذهبي وأحدث إصدارات الأنمي المترجمة والمدبلجة بجودة فائقة 4K.",
        logoUrl: "https://lh3.googleusercontent.com/aida/AEtjO1UiSLhyw_pFl8EO-8FgL4HrDL2d9Oh8xf35S6mPsvN6CLAeTTpeY_Y4zm4rjsRuYww9UNqCIq98rij14h5osYHduHU73DQq5klCpJEZFM7q4WFwh529QyN14MBCOgwBQCafVH2D7Zqj8RtA7YeHEf53boMtjjIUflj41hkrmwwiWjLsz5RNzpHujzyYnwEwKNuokWsaRntGYjD842E14qpqp84ozsbd8Inmm-2ENPd6K5e0xdj7TSIckg",
        brandColor: "#dc2626",
        accentColor: "#ffb95f",
        admob: { isEnabled: false },
        apiApp: DEFAULT_API_APP_CONFIG
    };
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const clientVersion = searchParams.get("version") || request.headers.get("x-app-version") || "1.0.0";
        const clientBuild = parseInt(searchParams.get("build") || request.headers.get("x-build-number") || "0", 10);

        const settings = getSettings();
        const apiApp = {
            ...DEFAULT_API_APP_CONFIG,
            ...(settings.apiApp || {})
        };
        const admob = settings.admob || {};

        const minBuild = Number(apiApp.minSupportedBuild) || 1;
        const latestBuild = Number(apiApp.latestBuild) || 14;

        // Check if update is required or available
        const isOutdated = clientBuild > 0 && clientBuild < minBuild;
        const hasUpdate = clientBuild > 0 && clientBuild < latestBuild;
        const isForceUpdateRequired = apiApp.forceUpdate || isOutdated;

        const configData = {
            app: {
                name: settings.siteNameEn || "ANIME DAZE",
                name_ar: settings.siteName || "أنمي دايز",
                subtitle: "سبيس تون & أنمي كلاسيك",
                slogan: settings.siteDescription || "منصة البث السينمائية الأولى لعشاق الأنمي في العالم العربي.",
                logo_url: settings.logoUrl || "https://slam-dunk-w.vercel.app/logo.png",
                brand_color: settings.brandColor || "#dc2626",
                accent_color: settings.accentColor || "#ffb95f",
                support_email: "support@animedaze.com",
                privacy_policy_url: "https://slam-dunk-w.vercel.app/terms",
                terms_url: "https://slam-dunk-w.vercel.app/terms"
            },
            maintenance: {
                is_active: !!apiApp.isMaintenance,
                title: apiApp.maintenanceTitle || "صيانة دورية مجدولة",
                message: apiApp.maintenanceMessage || "نقوم حالياً بتحسين وتحديث سيرفرات المشاهدة لتوفير تجربة أسرع وأعلى جودة بدون تقطيع. سنعود خلال وقت قصير!",
                estimated_end_time: apiApp.maintenanceEndTime || null,
                allow_dev_bypass: true,
                dev_bypass_key: apiApp.devBypassKey || "SLAM_DEV_2026"
            },
            version_control: {
                latest_version: apiApp.latestVersion || "1.2.0",
                latest_build: latestBuild,
                min_supported_version: apiApp.minSupportedVersion || "1.0.0",
                min_supported_build: minBuild,
                force_update: isForceUpdateRequired,
                has_update: hasUpdate,
                store_url: apiApp.updateUrl || "https://play.google.com/store/apps/details?id=com.animedaze.app",
                direct_apk_url: apiApp.directApkUrl || "https://slam-dunk-w.vercel.app/downloads/animedaze-latest.apk",
                release_notes: Array.isArray(apiApp.releaseNotes) && apiApp.releaseNotes.length > 0
                    ? apiApp.releaseNotes
                    : DEFAULT_API_APP_CONFIG.releaseNotes
            },
            ads: {
                enabled: !!admob.isEnabled,
                provider: "admob",
                app_id: admob.appId || "ca-app-pub-3940256099942544~3347511713",
                banner_id: admob.bannerId || "ca-app-pub-3940256099942544/6300978111",
                interstitial_id: admob.interstitialId || "ca-app-pub-3940256099942544/1033173712",
                rewarded_id: admob.rewardedId || "ca-app-pub-3940256099942544/5224354917",
                interstitial_interval: Number(apiApp.interstitialInterval) || 2
            },
            player_settings: {
                default_quality: apiApp.defaultQuality || "1080p",
                default_server: apiApp.defaultServer || "Mega",
                allow_download: apiApp.allowDownloads !== false,
                auto_next_episode: true
            },
            promo_banner: {
                is_enabled: !!(settings.promoBanner?.isEnabled ?? DEFAULT_PROMO_BANNER.isEnabled),
                badge_text: settings.promoBanner?.badgeText || DEFAULT_PROMO_BANNER.badgeText,
                badge_icon: settings.promoBanner?.badgeIcon || DEFAULT_PROMO_BANNER.badgeIcon,
                title: settings.promoBanner?.title || DEFAULT_PROMO_BANNER.title,
                description: settings.promoBanner?.description || DEFAULT_PROMO_BANNER.description,
                primary_button_text: settings.promoBanner?.primaryButtonText || DEFAULT_PROMO_BANNER.primaryButtonText,
                primary_button_link: settings.promoBanner?.primaryButtonLink || DEFAULT_PROMO_BANNER.primaryButtonLink,
                primary_button_icon: settings.promoBanner?.primaryButtonIcon || DEFAULT_PROMO_BANNER.primaryButtonIcon,
                secondary_button_text: settings.promoBanner?.secondaryButtonText || DEFAULT_PROMO_BANNER.secondaryButtonText,
                secondary_button_link: settings.promoBanner?.secondaryButtonLink || DEFAULT_PROMO_BANNER.secondaryButtonLink,
                image_url: settings.promoBanner?.imageUrl || DEFAULT_PROMO_BANNER.imageUrl,
                image_caption: settings.promoBanner?.imageCaption || DEFAULT_PROMO_BANNER.imageCaption,
                app_icon_url: settings.promoBanner?.appIconUrl || DEFAULT_PROMO_BANNER.appIconUrl,
                features: settings.promoBanner?.features || DEFAULT_PROMO_BANNER.features
            },
            home_screen: {
                sections: (settings.homeConfig?.sections || DEFAULT_HOME_SCREEN_CONFIG.sections).map((s: any) => ({
                    id: s.id,
                    name_ar: s.nameAr,
                    is_enabled: s.isEnabled !== false,
                    order: s.order,
                    title: s.title,
                    subtitle: s.subtitle,
                    badge_text: s.badgeText || null,
                    item_limit: s.itemLimit || 6,
                    view_all_link: s.viewAllLink || null
                })),
                slider: {
                    is_enabled: settings.homeConfig?.slider?.isEnabled ?? DEFAULT_HOME_SCREEN_CONFIG.slider.isEnabled,
                    autoplay: settings.homeConfig?.slider?.autoplay ?? DEFAULT_HOME_SCREEN_CONFIG.slider.autoplay,
                    interval_seconds: settings.homeConfig?.slider?.intervalSeconds ?? DEFAULT_HOME_SCREEN_CONFIG.slider.intervalSeconds,
                    overlay_darkness: settings.homeConfig?.slider?.overlayDarkness ?? DEFAULT_HOME_SCREEN_CONFIG.slider.overlayDarkness,
                    max_slides: settings.homeConfig?.slider?.maxSlides ?? DEFAULT_HOME_SCREEN_CONFIG.slider.maxSlides,
                    show_rating_badge: settings.homeConfig?.slider?.showRatingBadge ?? DEFAULT_HOME_SCREEN_CONFIG.slider.showRatingBadge,
                    show_quality_badge: settings.homeConfig?.slider?.showQualityBadge ?? DEFAULT_HOME_SCREEN_CONFIG.slider.showQualityBadge,
                    show_vip_badge: settings.homeConfig?.slider?.showVipBadge ?? DEFAULT_HOME_SCREEN_CONFIG.slider.showVipBadge,
                    show_episode_count: settings.homeConfig?.slider?.showEpisodeCount ?? DEFAULT_HOME_SCREEN_CONFIG.slider.showEpisodeCount,
                    show_genres: settings.homeConfig?.slider?.showGenres ?? DEFAULT_HOME_SCREEN_CONFIG.slider.showGenres
                }
            },
            api_info: {
                base_url: apiApp.apiUrl || "https://slam-dunk-w.vercel.app/api/mobile/v1",
                version: "v1.2",
                status: "healthy",
                timestamp: new Date().toISOString()
            }
        };

        return mobileSuccess(configData);
    } catch (error) {
        console.error("Mobile Config API Error:", error);
        return mobileError("حدث خطأ أثناء قراءة إعدادات التطبيق", 500);
    }
}
