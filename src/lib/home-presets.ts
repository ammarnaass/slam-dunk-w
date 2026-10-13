export type HomeSectionId = 
    | "heroSlider" 
    | "continueWatching" 
    | "planets" 
    | "latestEpisodes" 
    | "topTrending" 
    | "classics" 
    | "characters" 
    | "promoBanner";

export interface HomeSectionItem {
    id: HomeSectionId;
    nameAr: string;
    isEnabled: boolean;
    order: number;
    title: string;
    subtitle: string;
    badgeText?: string;
    itemLimit: number;
    viewAllLink?: string;
}

export interface HeroSliderSettings {
    isEnabled: boolean;
    autoplay: boolean;
    intervalSeconds: number; // e.g. 7.5
    transitionEffect: "fade" | "slide";
    overlayDarkness: number; // 20 to 90 %
    maxSlides: number; // 1 to 10
    showRatingBadge: boolean;
    showQualityBadge: boolean;
    showVipBadge: boolean;
    showEpisodeCount: boolean;
    showGenres: boolean;
    slideAnimeIds?: string[];
}

export interface HomeScreenConfig {
    sections: HomeSectionItem[];
    slider: HeroSliderSettings;
}

export const DEFAULT_HOME_SECTIONS: HomeSectionItem[] = [
    {
        id: "heroSlider",
        nameAr: "السلايدر السينمائي التفاعلي",
        isEnabled: true,
        order: 1,
        title: "العرض الأكثر رواجاً عالمياً",
        subtitle: "شاهد أحدث حلقات الأعمال الملحمية بدقة فائقة 4K",
        badgeText: "حصري VIP",
        itemLimit: 5,
        viewAllLink: "/animes"
    },
    {
        id: "continueWatching",
        nameAr: "شريط استكمال المشاهدة",
        isEnabled: true,
        order: 2,
        title: "استكمل المشاهدة",
        subtitle: "تابع من النقطة التي توقفت عندها بالضبط",
        badgeText: "تقدم المشاهدة",
        itemLimit: 3,
        viewAllLink: "/profile?tab=history"
    },
    {
        id: "planets",
        nameAr: "كواكب وعوالم الأنمي",
        isEnabled: true,
        order: 3,
        title: "كواكب الأنمي",
        subtitle: "سافر بين عوالم التصنيفات المستوحاة من كواكب الطفولة والخيال",
        badgeText: "كواكب سبيستون",
        itemLimit: 6,
        viewAllLink: "/planets"
    },
    {
        id: "latestEpisodes",
        nameAr: "أحدث الحلقات المضافة (مباشر)",
        isEnabled: true,
        order: 4,
        title: "أحدث الحلقات المضافة",
        subtitle: "تحديث فوري فور البث الياباني بدون فواصل إعلانية",
        badgeText: "مباشر الآن",
        itemLimit: 6,
        viewAllLink: "/animes"
    },
    {
        id: "topTrending",
        nameAr: "الأكثر مشاهدة هذا الأسبوع (Top Ranked)",
        isEnabled: true,
        order: 5,
        title: "الأكثر مشاهدة هذا الأسبوع",
        subtitle: "أفضل الأعمال التي تتصدر تصويت ومتابعات الجماهير العربية",
        badgeText: "توب 10",
        itemLimit: 10,
        viewAllLink: "/animes"
    },
    {
        id: "classics",
        nameAr: "سبيستون كلاسيك دايز (الجيل الذهبي)",
        isEnabled: true,
        order: 6,
        title: "سبيستون كلاسيك دايز",
        subtitle: "ذكريات الزمن الجميل • دبلجة عربية مركز الزهرة الأيقونية",
        badgeText: "مركز الزهرة",
        itemLimit: 5,
        viewAllLink: "/animes?planet=spacetoon"
    },
    {
        id: "characters",
        nameAr: "أبطال وشخصيات الأنمي (الموسوعة)",
        isEnabled: true,
        order: 7,
        title: "أبطال وشخصيات الأنمي",
        subtitle: "تعرف على أبطال الأنمي ونخبة فناني الدبلجة",
        badgeText: "الموسوعة",
        itemLimit: 6,
        viewAllLink: "/characters"
    },
    {
        id: "promoBanner",
        nameAr: "بانر الترويج وتطبيق PWA والاشتراكات",
        isEnabled: true,
        order: 8,
        title: "ثبّت تطبيق ANIME DAZE كـ PWA خفيف على هاتفك وشاشتك الذكية",
        subtitle: "استمتع بمشاهدة بدون إعلانات نهائياً وسرعة تشغيل فورية",
        badgeText: "تطبيق الهاتف",
        itemLimit: 1,
        viewAllLink: "/pricing"
    }
];

export const DEFAULT_HERO_SLIDER_SETTINGS: HeroSliderSettings = {
    isEnabled: true,
    autoplay: true,
    intervalSeconds: 7.5,
    transitionEffect: "fade",
    overlayDarkness: 70,
    maxSlides: 5,
    showRatingBadge: true,
    showQualityBadge: true,
    showVipBadge: true,
    showEpisodeCount: true,
    showGenres: true,
    slideAnimeIds: ["slam-dunk", "conan"]
};

export const DEFAULT_HOME_SCREEN_CONFIG: HomeScreenConfig = {
    sections: DEFAULT_HOME_SECTIONS,
    slider: DEFAULT_HERO_SLIDER_SETTINGS
};
