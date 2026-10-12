import { ApiAppConfig } from "@/server/types/settings.types";

export const DEFAULT_API_APP_CONFIG: ApiAppConfig = {
    isMaintenance: false,
    maintenanceTitle: "صيانة دورية مجدولة",
    maintenanceMessage: "نقوم حالياً بتحسين وتحديث سيرفرات المشاهدة لتوفير تجربة أسرع وأعلى جودة بدون تقطيع. سنعود خلال وقت قصير!",
    maintenanceEndTime: "",
    devBypassKey: "SLAM_DEV_2026",
    latestVersion: "1.2.0",
    latestBuild: 14,
    minSupportedVersion: "1.0.0",
    minSupportedBuild: 10,
    forceUpdate: false,
    updateUrl: "https://play.google.com/store/apps/details?id=com.animedaze.app",
    directApkUrl: "https://slam-dunk-w.vercel.app/downloads/animedaze-latest.apk",
    releaseNotes: [
        "إضافة مكتبة أعمال وكواكب سبيستون والأنمي الكلاسيكي كاملة بدقة FHD",
        "مشغل فائق السرعة مع دعم سيرفرات متعددة (Mega و Google Drive)",
        "إمكانية التحميل للمشاهدة أوفلاين بدون إنترنت وبدون إعلانات",
        "تصميم سينمائي داكن متوافق بالكامل مع الهوية الجديدة لمنصة ANIME DAZE"
    ],
    apiUrl: "https://slam-dunk-w.vercel.app/api/mobile/v1",
    apiKey: "slam_live_app_key_2026",
    defaultQuality: "1080p",
    defaultServer: "Mega",
    allowDownloads: true,
    interstitialInterval: 2
};

export const AVAILABLE_STREAMING_QUALITIES = [
    { label: "1080p FHD (فائقة الوضوح)", value: "1080p" },
    { label: "720p HD (متوسطة سريعة)", value: "720p" },
    { label: "480p SD (موفرة للبيانات)", value: "480p" },
    { label: "4K Cinema (سينمائية فائقة)", value: "4K" }
];

export const AVAILABLE_DEFAULT_SERVERS = [
    { label: "سيرفر Mega الرسمي (سريع ومباشر)", value: "Mega" },
    { label: "سيرفر Google Drive السحابي", value: "Google Drive" },
    { label: "سيرفر خاص عالي الأداء (Direct FHD)", value: "Direct FHD" },
    { label: "سيرفر OkRu الاحتياطي", value: "OkRu" }
];
