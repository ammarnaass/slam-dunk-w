import { z } from "zod";

const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const updateSiteIdentitySchema = z.object({
    siteName: z.string()
        .min(2, "اسم الموقع يجب أن يحتوي على حرفين على الأقل")
        .max(60, "اسم الموقع لا يمكن أن يتجاوز 60 حرفاً"),
    siteNameEn: z.string().max(60, "اسم الموقع بالإنجليزية لا يتجاوز 60 حرفاً").optional(),
    siteDescription: z.string().max(500, "وصف الموقع لا يتجاوز 500 حرف").optional().default(""),
    logoUrl: z.string().min(1, "رابط أو بيانات الشعار مطلوبة"),
    faviconUrl: z.string().optional().default(""),
    brandColor: z.string().regex(hexColorRegex, "صيغة لون الهوية غير صالحة (مثال: #dc2626)").optional().default("#dc2626"),
    accentColor: z.string().regex(hexColorRegex, "صيغة اللون التكميلي غير صالحة (مثال: #ffb95f)").optional().default("#ffb95f")
});

export const updateSiteSettingsSchema = z.object({
    siteName: z.string().min(2, "اسم الموقع يجب أن يحتوي على حرفين على الأقل").max(60).optional(),
    siteNameEn: z.string().max(60).optional(),
    siteDescription: z.string().max(500).optional(),
    logoUrl: z.string().min(1, "رابط الشعار مطلوب").optional(),
    faviconUrl: z.string().optional(),
    brandColor: z.string().regex(hexColorRegex, "صيغة اللون غير صالحة").optional(),
    accentColor: z.string().regex(hexColorRegex, "صيغة اللون غير صالحة").optional(),
    currency: z.string().max(10).optional().default("ج.م"),
    maintenanceMode: z.boolean().optional().default(false),
    maintenanceMessage: z.string().max(300).optional().default("الموقع في وضع الصيانة حالياً."),
    socialLinks: z.object({
        facebook: z.string().optional().default(""),
        twitter: z.string().optional().default(""),
        instagram: z.string().optional().default(""),
        youtube: z.string().optional().default(""),
        telegram: z.string().optional().default(""),
        discord: z.string().optional().default("")
    }).optional(),
    admob: z.object({
        isEnabled: z.boolean().optional().default(false),
        appId: z.string().optional().default(""),
        bannerId: z.string().optional().default(""),
        interstitialId: z.string().optional().default(""),
        rewardedId: z.string().optional().default("")
    }).optional(),
    apiApp: z.object({
        isMaintenance: z.boolean().optional().default(false),
        maintenanceTitle: z.string().optional().default("صيانة دورية مجدولة"),
        maintenanceMessage: z.string().optional().default("نقوم حالياً بتحسين وتحديث سيرفرات المشاهدة لتوفير تجربة أسرع وأعلى جودة بدون تقطيع. سنعود خلال وقت قصير!"),
        maintenanceEndTime: z.string().optional().default(""),
        devBypassKey: z.string().optional().default("SLAM_DEV_2026"),
        latestVersion: z.string().optional().default("1.2.0"),
        latestBuild: z.number().optional().default(14),
        minSupportedVersion: z.string().optional().default("1.0.0"),
        minSupportedBuild: z.number().optional().default(10),
        forceUpdate: z.boolean().optional().default(false),
        updateUrl: z.string().optional().default(""),
        directApkUrl: z.string().optional().default(""),
        releaseNotes: z.array(z.string()).optional().default([]),
        apiUrl: z.string().optional().default("https://slam-dunk-w.vercel.app/api/mobile/v1"),
        apiKey: z.string().optional().default("slam_live_app_key_2026"),
        defaultQuality: z.string().optional().default("1080p"),
        defaultServer: z.string().optional().default("Mega"),
        allowDownloads: z.boolean().optional().default(true),
        interstitialInterval: z.number().optional().default(2)
    }).optional(),
    sliderAnimeIds: z.array(z.string()).optional(),
    promoBanner: z.object({
        isEnabled: z.boolean().optional().default(true),
        badgeText: z.string().optional().default("تجربة بث سينمائية بدون تقطيع"),
        badgeIcon: z.string().optional().default("install_mobile"),
        title: z.string().optional().default("ثبّت تطبيق ANIME DAZE كـ PWA خفيف على هاتفك وشاشتك الذكية"),
        description: z.string().optional().default("استمتع بمشاهدة بدون إعلانات نهائياً، سرعة تشغيل فورية، تنبيهات عند صدور الحلقات المترجمة في نفس دقيقة نزولها في اليابان، مع إمكانية التحميل للمشاهدة بدون إنترنت."),
        features: z.array(z.object({
            id: z.string(),
            icon: z.string(),
            text: z.string()
        })).optional(),
        primaryButtonText: z.string().optional().default("ترقية إلى VIP بخصم 40%"),
        primaryButtonLink: z.string().optional().default("/pricing"),
        primaryButtonIcon: z.string().optional().default("diamond"),
        secondaryButtonText: z.string().optional().default("تصفح المكتبة المجانية"),
        secondaryButtonLink: z.string().optional().default("/animes"),
        imageUrl: z.string().optional().default("/hero-bg.jpg"),
        imageCaption: z.string().optional().default("تجربة سبيستون الكلاسيكية الحديثة"),
        appIconUrl: z.string().optional()
    }).optional(),
    footer: z.object({
        subtitle: z.string().optional().default("سبيس تون & أنمي كلاسيك"),
        description: z.string().optional().default("منصة البث السينمائية الأولى لعشاق الأنمي في العالم العربي."),
        socialLinks: z.array(z.object({
            id: z.string(),
            name: z.string(),
            icon: z.string(),
            url: z.string(),
            isEnabled: z.boolean()
        })).optional(),
        exploreTitle: z.string().optional().default("استكشف المنصة"),
        exploreLinks: z.array(z.object({
            id: z.string(),
            label: z.string(),
            href: z.string(),
            isVip: z.boolean().optional()
        })).optional(),
        helpTitle: z.string().optional().default("المساعدة والدعم"),
        helpLinks: z.array(z.object({
            id: z.string(),
            label: z.string(),
            href: z.string(),
            isVip: z.boolean().optional()
        })).optional(),
        appCardTitle: z.string().optional().default("تطبيق ANIME DAZE"),
        appCardDescription: z.string().optional().default("ثبّت التطبيق الآن على جهازك واستمتع بالمشاهدة بلا انقطاع وبدون اتصال بالإنترنت وتجربة شاشة كاملة."),
        appCardButtonText: z.string().optional().default("تثبيت التطبيق (PWA)"),
        appCardButtonIcon: z.string().optional().default("download"),
        isAppCardEnabled: z.boolean().optional().default(true),
        copyrightText: z.string().optional().default("جميع الحقوق محفوظة لروائع الرسوم المتحركة وعشاق الأنمي في العالم العربي."),
        serverStatusText: z.string().optional().default("خوادم البث المباشر نشطة ومستقرة"),
        isStatusIndicatorActive: z.boolean().optional().default(true)
    }).optional()
});
