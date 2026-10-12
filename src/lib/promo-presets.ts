import { PromoBannerConfig } from "@/server/types/settings.types";

export interface PresetPosterOption {
    label: string;
    url: string;
    caption: string;
    description?: string;
}

export const PRESET_POSTER_OPTIONS: PresetPosterOption[] = [
    { 
        label: "سبيستون كلاسيك", 
        url: "/hero-bg.jpg", 
        caption: "تجربة سبيستون الكلاسيكية الحديثة",
        description: "البوستر الرسمي لأنمي دايز المستوحى من كواكب وأعمال العصر الذهبي"
    },
    { 
        label: "سلام دانك HD", 
        url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80", 
        caption: "روائع الصقور وشوهوكو بدقة فائقة",
        description: "طابع حماسي لكرة السلة والبطولة الوطنية لشوهوكو والصقور"
    },
    { 
        label: "سينمائي داكن", 
        url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80", 
        caption: "تجربة سينمائية مسرحية 4K",
        description: "مظهر داكن بوهج نيون يناسب التجربة المسرحية والسينمائية"
    }
];

export const DEFAULT_PROMO_BANNER: PromoBannerConfig = {
    isEnabled: true,
    badgeText: "تجربة بث سينمائية بدون تقطيع",
    badgeIcon: "install_mobile",
    title: "ثبّت تطبيق ANIME DAZE كـ PWA خفيف على هاتفك وشاشتك الذكية",
    description: "استمتع بمشاهدة بدون إعلانات نهائياً، سرعة تشغيل فورية، تنبيهات عند صدور الحلقات المترجمة في نفس دقيقة نزولها في اليابان، مع إمكانية التحميل للمشاهدة بدون إنترنت.",
    features: [
        { id: "feat-1", icon: "block", text: "صفر إعلانات" },
        { id: "feat-2", icon: "bolt", text: "مشغل فائق السرعة" },
        { id: "feat-3", icon: "download_for_offline", text: "تحميل أوفلاين" },
        { id: "feat-4", icon: "notifications_active", text: "تنبيهات فورية" }
    ],
    primaryButtonText: "ترقية إلى VIP بخصم 40%",
    primaryButtonLink: "/pricing",
    primaryButtonIcon: "diamond",
    secondaryButtonText: "تصفح المكتبة المجانية",
    secondaryButtonLink: "/animes",
    imageUrl: "/hero-bg.jpg",
    imageCaption: "تجربة سبيستون الكلاسيكية الحديثة",
    appIconUrl: "/icon-192x192.png"
};
