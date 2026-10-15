import { FullSiteSettings } from "@/server/types/settings.types";
import { DEFAULT_PROMO_BANNER } from "@/lib/promo-presets";
import { DEFAULT_FOOTER_CONFIG } from "@/lib/footer-presets";
import { DEFAULT_API_APP_CONFIG } from "@/lib/app-presets";
import { DEFAULT_HOME_SCREEN_CONFIG } from "@/lib/home-presets";

export type ValidTab = "logo" | "identity" | "system" | "home" | "slider" | "promo" | "footer" | "app";

export const INITIAL_SETTINGS: FullSiteSettings = {
    siteName: "أنمي دايز",
    siteNameEn: "ANIME DAZE",
    siteDescription: "منصتك الأولى لمشاهدة وتحميل أفضل مسلسلات وأفلام الأنمي المترجمة والمدبلجة بدقة عالية وبدون إعلانات مزعجة.",
    logoUrl: "https://lh3.googleusercontent.com/aida/AEtjO1UiSLhyw_pFl8EO-8FgL4HrDL2d9Oh8xf35S6mPsvN6CLAeTTpeY_Y4zm4rjsRuYww9UNqCIq98rij14h5osYHduHU73DQq5klCpJEZFM7q4WFwh529QyN14MBCOgwBQCafVH2D7Zqj8RtA7YeHEf53boMtjjIUflj41hkrmwwiWjLsz5RNzpHujzyYnwEwKNuokWsaRntGYjD842E14qpqp84ozsbd8Inmm-2ENPd6K5e0xdj7TSIckg",
    faviconUrl: "/favicon.ico",
    brandColor: "#dc2626",
    accentColor: "#ffb95f",
    currency: "ج.م",
    maintenanceMode: false,
    maintenanceMessage: "",
    socialLinks: {
        facebook: "",
        twitter: "",
        instagram: "",
        youtube: "",
        telegram: "",
        discord: "",
    },
    admob: {
        isEnabled: false,
        appId: "",
        bannerId: "",
        interstitialId: "",
        rewardedId: "",
    },
    promoBanner: DEFAULT_PROMO_BANNER,
    footer: DEFAULT_FOOTER_CONFIG,
    apiApp: DEFAULT_API_APP_CONFIG,
    homeConfig: DEFAULT_HOME_SCREEN_CONFIG
};
