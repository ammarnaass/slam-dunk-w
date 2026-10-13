import { FooterConfig } from "@/server/types/settings.types";

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
    subtitle: "سبيس تون & أنمي كلاسيك",
    description: "منصة البث السينمائية الأولى لعشاق الأنمي في العالم العربي. مكتبة حصرية تجمع بين روائع الجيل الذهبي وأحدث إصدارات الأنمي المترجمة والمدبلجة بجودة فائقة 4K.",
    socialLinks: [
        { id: "yt", name: "يوتيوب", icon: "play_circle", url: "https://youtube.com", isEnabled: true },
        { id: "tg", name: "تيليغرام", icon: "send", url: "https://t.me", isEnabled: true },
        { id: "dc", name: "ديسكورد", icon: "forum", url: "https://discord.com", isEnabled: true },
        { id: "pod", name: "بودكاست", icon: "podcasts", url: "#", isEnabled: true },
    ],
    exploreTitle: "استكشف المنصة",
    exploreLinks: [
        { id: "exp-1", label: "أحدث الحلقات المضافة", href: "/animes" },
        { id: "exp-2", label: "كواكب الأكشن والمغامرة", href: "/planets?planet=action" },
        { id: "exp-3", label: "كواكب الأنمي وسبيستون", href: "/planets" },
        { id: "exp-4", label: "مكتبة ومواسم الأنمي", href: "/animes" },
        { id: "exp-5", label: "اشتراكات الدايزر VIP", href: "/pricing", isVip: true },
    ],
    helpTitle: "المساعدة والدعم",
    helpLinks: [
        { id: "hlp-1", label: "مركز المساعدة والأسئلة الشائعة", href: "/terms" },
        { id: "hlp-2", label: "الأجهزة المدعومة (Smart TV)", href: "/terms" },
        { id: "hlp-3", label: "شروط الاستخدام والخصوصية", href: "/terms" },
        { id: "hlp-4", label: "تواصل مع فريق الدعم", href: "/terms" },
    ],
    appCardTitle: "تطبيق ANIME DAZE",
    appCardDescription: "ثبّت التطبيق الآن على جهازك واستمتع بالمشاهدة بلا انقطاع وبدون اتصال بالإنترنت وتجربة شاشة كاملة.",
    appCardButtonText: "تثبيت التطبيق (PWA)",
    appCardButtonIcon: "download",
    isAppCardEnabled: true,
    copyrightText: "جميع الحقوق محفوظة لروائع الرسوم المتحركة وعشاق الأنمي في العالم العربي.",
    serverStatusText: "خوادم البث المباشر نشطة ومستقرة",
    isStatusIndicatorActive: true,
};
