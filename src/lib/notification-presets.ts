import { SiteNotification } from "@/types/notification.types";

export const DEFAULT_NOTIFICATIONS: SiteNotification[] = [
    {
        id: "notif-slam-101",
        type: "episode",
        title: "نزول الحلقة 101 من سلام دانك بدقة 1080p FHD",
        message: "مباراة شوهوكو والساموراي الحاسمة باتت متوفرة الآن بأعلى جودة مع دبلجة سبيستون الكلاسيكية الأصلية وبدون تقطيع.",
        timestamp: "منذ 10 دقائق",
        createdAt: Date.now() - 10 * 60 * 1000,
        isRead: false,
        link: "/watch/slam-dunk-101",
        actionLabel: "مشاهدة الحلقة الآن",
        imageUrl: "/hero-bg.jpg",
        badgeText: "حلقة جديدة 1080p",
        badgeColor: "crimson"
    },
    {
        id: "notif-vip-discount",
        type: "vip",
        title: "عرض اشتراك VIP خاص: خصم 40% لفترة محدودة",
        message: "استمتع بمشاهدة بدون إعلانات نهائياً، سرعة تشغيل فورية، تنبيهات عند صدور الحلقات المترجمة في نفس دقيقة نزولها، مع التحميل أوفلاين.",
        timestamp: "منذ ساعة",
        createdAt: Date.now() - 60 * 60 * 1000,
        isRead: false,
        link: "/pricing",
        actionLabel: "ترقية إلى VIP بخصم",
        imageUrl: "/icon-192x192.png",
        badgeText: "خصم VIP 40%",
        badgeColor: "amber"
    },
    {
        id: "notif-server-speed",
        type: "server",
        title: "إضافة سيرفرات بث سحابية فائقة السرعة بدون تقطيع",
        message: "تم تحديث مشغل الفيديو وإضافة سيرفرات Mega و Google Drive المباشرة لتشغيل سلس وسريع على جميع سرعات الإنترنت.",
        timestamp: "منذ 3 ساعات",
        createdAt: Date.now() - 3 * 60 * 60 * 1000,
        isRead: false,
        link: "/animes",
        actionLabel: "تصفح المكتبة",
        badgeText: "تحديث السيرفرات",
        badgeColor: "emerald"
    },
    {
        id: "notif-spacetoon-planets",
        type: "system",
        title: "روائع كواكب سبيستون: مغامرة وأكشن والجيل الذهبي",
        message: "مجموعة جديدة من الأنميات الكلاسيكية المدبلجة والمترجمة بجودة محسنة أضيفت إلى كوكب مغامرة وأكشن.",
        timestamp: "أمس",
        createdAt: Date.now() - 24 * 60 * 60 * 1000,
        isRead: true,
        link: "/animes?planet=spacetoon",
        actionLabel: "استكشف الكواكب",
        badgeText: "كلاسيك سبيستون",
        badgeColor: "sky"
    }
];
