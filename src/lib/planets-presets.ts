export interface Planet3DConfig {
    hasRings: boolean;          // تفعيل حلقات الكوكب المدارية
    ringColor: string;          // لون وتدرج الحلقة المدارية
    ringTilt?: number;          // درجة ميلان الحلقة (بالدرجات)
    textureStyle: string;       // نمط القوام: "sports" | "action" | "adventure" | "comedy" | "emerald" | "mystery" | "scifi" | "classics" | "movies" | "bonbon"
    rotationSpeed: number;      // سرعة الدوران الذاتي
    atmosphereGlow: string;     // لون هالة الغلاف الجوي
    atmosphereSize?: number;    // حجم التوهج
    scale?: number;             // الحجم النسبي للجرم
}

export interface AdminPlanetItem {
    id: string;             // Unique slug: "sports", "action", "adventure", "comedy", "emerald", "mystery", "scifi", "classics", "movies", "bonbon"
    name: string;           // Display Name: "كوكب رياضة"
    arabicGenre: string;    // Arabic genre: "رياضة"
    genreKey: string;       // Database genre tag: "Sports", "Action", "Adventure", "Comedy", "Drama", "Mystery", "Sci-Fi", "Historical", "Movie", "Kids"
    badge: string;          // Emoji: "🏀", "⚔️", "🚀", "😄", "💎", "🔍", "🔬", "📜", "🎬", "🍭"
    icon: string;           // Icon name: "sports_basketball", "swords", "explore", "sentiment_very_satisfied", "diamond", "search", "rocket_launch", "history_edu", "movie", "child_care"
    slogan: string;         // Catchy tagline
    description: string;    // Cosmic description
    anthemSnippet?: string; // Nostalgic anthem quote
    flagshipWorks: string[];// Representative animes
    color: string;          // Hex accent color: e.g. "#ef4444"
    bgClass: string;        // Tailwind style class
    glowColor: string;      // Glow rgba
    isEnabled: boolean;     // Toggle display on site
    order: number;          // Sort order
    isCustom?: boolean;     // Flag if created by admin
    threeDConfig?: Planet3DConfig; // 3D Spacetoon Celestial parameters
}

export interface PlanetsSettingsConfig {
    displayMode: "2d_grid" | "3d_spacetoon" | "hybrid";
    soundEffectsEnabled: boolean;
    autoRotate3D: boolean;
    homeStyle: "compact_grid" | "interactive_3d_orbit";
}

export const DEFAULT_PLANETS_SETTINGS: PlanetsSettingsConfig = {
    displayMode: "hybrid",
    soundEffectsEnabled: true,
    autoRotate3D: true,
    homeStyle: "compact_grid"
};

export const DEFAULT_ADMIN_PLANETS: AdminPlanetItem[] = [
    {
        id: "sports",
        name: "كوكب رياضة",
        arabicGenre: "رياضة",
        genreKey: "Sports",
        badge: "🏀",
        icon: "sports_basketball",
        slogan: "كوكب التحدي والبطولة والمنافسة الشريفة",
        description: "موطن الرميات الحاسمة، الهتافات الجماهيرية، والروح الرياضية الخالدة التي لا تعرف المستحيل.",
        anthemSnippet: "في كل ركلة، في كل رمية، بالعزم والإصرار نحقق النصر!",
        flagshipWorks: ["سلام دانك", "كابتن ماجد", "بي بليد", "شبح بين الملاعب"],
        color: "#dc2626",
        bgClass: "bg-red-500/15 border-red-500/30 text-red-400",
        glowColor: "rgba(220, 38, 38, 0.4)",
        isEnabled: true,
        order: 1,
        threeDConfig: {
            hasRings: true,
            ringColor: "rgba(239, 68, 68, 0.8)",
            ringTilt: 25,
            textureStyle: "sports",
            rotationSpeed: 1.2,
            atmosphereGlow: "#ef4444",
            scale: 1.05
        }
    },
    {
        id: "action",
        name: "كوكب أكشن",
        arabicGenre: "أكشن",
        genreKey: "Action",
        badge: "⚔️",
        icon: "swords",
        slogan: "كوكب القوة والشجاعة والمعارك المصيرية",
        description: "صرخات القتال، طاقات النينجا والأبطال الخارقين في مواجهة قوى الظلام لإنقاذ الكون.",
        anthemSnippet: "كالبرق في السماء، كالسيل حين ينهمر، لا ينحني الفارس الحق ولا ينكسر!",
        flagshipWorks: ["أبطال الديجيتال", "سيف النار", "دراغون بول", "أجنحة كاندام"],
        color: "#ea580c",
        bgClass: "bg-orange-500/15 border-orange-500/30 text-orange-400",
        glowColor: "rgba(234, 88, 12, 0.4)",
        isEnabled: true,
        order: 2,
        threeDConfig: {
            hasRings: true,
            ringColor: "rgba(234, 88, 12, 0.85)",
            ringTilt: 35,
            textureStyle: "action",
            rotationSpeed: 1.4,
            atmosphereGlow: "#ea580c",
            scale: 1.15
        }
    },
    {
        id: "adventure",
        name: "كوكب مغامرات",
        arabicGenre: "مغامرات",
        genreKey: "Adventure",
        badge: "🚀",
        icon: "explore",
        slogan: "كوكب الخيال والرحلات الاستكشافية الكبرى",
        description: "عوالم الخيال الفسيحة، الجزر الغامضة، والرحلات الأسطورية لاكتشاف الكنوز وحماية الصداقة.",
        anthemSnippet: "مهما طال الطريق وصعب المسير، خلف الأفق ينتظرنا المجد الكبير!",
        flagshipWorks: ["داي الشجاع", "القناص", "هزيم الرعد", "عهد الأصدقاء"],
        color: "#f59e0b",
        bgClass: "bg-amber-500/15 border-amber-500/30 text-amber-400",
        glowColor: "rgba(245, 158, 11, 0.4)",
        isEnabled: true,
        order: 3,
        threeDConfig: {
            hasRings: true,
            ringColor: "rgba(245, 158, 11, 0.75)",
            ringTilt: 20,
            textureStyle: "adventure",
            rotationSpeed: 1.0,
            atmosphereGlow: "#f59e0b",
            scale: 1.1
        }
    },
    {
        id: "comedy",
        name: "كوكب كوميديا",
        arabicGenre: "كوميديا",
        genreKey: "Comedy",
        badge: "😄",
        icon: "sentiment_very_satisfied",
        slogan: "كوكب الضحك والمرح والطرائف العائلية",
        description: "مواقف يومية طريفة وشخصيات غريبة الأطوار لجرعات لا تتوقف من الضحك والبهجة.",
        anthemSnippet: "ابتسم للحياة تبتسم لك، واصنع من كل عثرة طرفة وضحكة!",
        flagshipWorks: ["القناع الأخضر", "تاما والأصدقاء", "الضاحكون", "مستر بين"],
        color: "#10b981",
        bgClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
        glowColor: "rgba(16, 185, 129, 0.4)",
        isEnabled: true,
        order: 4,
        threeDConfig: {
            hasRings: false,
            ringColor: "rgba(16, 185, 129, 0.6)",
            ringTilt: 15,
            textureStyle: "comedy",
            rotationSpeed: 1.3,
            atmosphereGlow: "#10b981",
            scale: 0.96
        }
    },
    {
        id: "emerald",
        name: "كوكب زمردة",
        arabicGenre: "زمردة",
        genreKey: "Drama",
        badge: "💎",
        icon: "diamond",
        slogan: "كوكب الفتيات والرقة والمشاعر النبيلة",
        description: "قصص الكفاح والأمل، الصداقة الصادقة، ورقة المشاعر التي تبني جسوراً من النور في أصعب الظروف.",
        anthemSnippet: "كالزهرة في الصباح تنشر عطر الأمل، والقلب الصافي يهزم أصعب المحن!",
        flagshipWorks: ["دروب ريمي", "سالي", "ليدي أوسكار", "سندريلا"],
        color: "#ec4899",
        bgClass: "bg-pink-500/15 border-pink-500/30 text-pink-400",
        glowColor: "rgba(236, 72, 153, 0.4)",
        isEnabled: true,
        order: 5,
        threeDConfig: {
            hasRings: true,
            ringColor: "rgba(236, 72, 153, 0.8)",
            ringTilt: -25,
            textureStyle: "emerald",
            rotationSpeed: 0.85,
            atmosphereGlow: "#ec4899",
            scale: 1.02
        }
    },
    {
        id: "mystery",
        name: "كوكب غموض",
        arabicGenre: "غموض",
        genreKey: "Mystery",
        badge: "🔍",
        icon: "search",
        slogan: "كوكب الألغاز والتحقيقات والذكاء الحاد",
        description: "خيوط الجرائم المعقدة، فك الشفرات المستعصية، ومطاردة الحقيقة مهما كانت محجوبة عن الأعين.",
        anthemSnippet: "الحقيقة دائماً واحدة، وعين المحقق الذكي لا تغفل عن التفاصيل!",
        flagshipWorks: ["المحقق كونان", "المحقق ريمي", "شارلوك هولمز", "باتمان"],
        color: "#06b6d4",
        bgClass: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
        glowColor: "rgba(6, 182, 212, 0.4)",
        isEnabled: true,
        order: 6,
        threeDConfig: {
            hasRings: true,
            ringColor: "rgba(6, 182, 212, 0.65)",
            ringTilt: 45,
            textureStyle: "mystery",
            rotationSpeed: 0.7,
            atmosphereGlow: "#06b6d4",
            scale: 1.0
        }
    },
    {
        id: "scifi",
        name: "كوكب علوم",
        arabicGenre: "علوم",
        genreKey: "Sci-Fi",
        badge: "🔬",
        icon: "rocket_launch",
        slogan: "كوكب الاكتشافات والتكنولوجيا والكون الفسيح",
        description: "آفاق المستقبل، مجرات الفضاء الخارجي، والروبوتات المتقدمة في خدمة البشرية.",
        anthemSnippet: "بالعلم والإرادة نصل إلى النجوم ونبني غد المستقبل المشرق!",
        flagshipWorks: ["غرندايزر", "أبطال الجزيرة", "مدينة النخيل", "باص المدرسة العجيب"],
        color: "#14b8a6",
        bgClass: "bg-teal-500/15 border-teal-500/30 text-teal-400",
        glowColor: "rgba(20, 184, 166, 0.4)",
        isEnabled: true,
        order: 7,
        threeDConfig: {
            hasRings: true,
            ringColor: "rgba(20, 184, 166, 0.75)",
            ringTilt: -15,
            textureStyle: "scifi",
            rotationSpeed: 1.35,
            atmosphereGlow: "#14b8a6",
            scale: 1.08
        }
    },
    {
        id: "classics",
        name: "كوكب تاريخ",
        arabicGenre: "تاريخ",
        genreKey: "Historical",
        badge: "📜",
        icon: "history_edu",
        slogan: "كوكب العبر والأمجاد وسير الكبار الخالدة",
        description: "أرشيف الزهرة الذهبي وسير الأبطال التاريخية التي ألهمت أجيالاً عبر الزمان.",
        anthemSnippet: "من ماضينا العريق نستلهم العبر، لنسير في درب المجد والظفر!",
        flagshipWorks: ["صقور الأرض", "الرمية الملتهبة", "ماوكلي", "جزيرة الكنز"],
        color: "#d97706",
        bgClass: "bg-amber-600/15 border-amber-600/30 text-amber-500",
        glowColor: "rgba(217, 119, 6, 0.4)",
        isEnabled: true,
        order: 8,
        threeDConfig: {
            hasRings: true,
            ringColor: "rgba(217, 119, 6, 0.7)",
            ringTilt: 30,
            textureStyle: "classics",
            rotationSpeed: 0.6,
            atmosphereGlow: "#d97706",
            scale: 1.12
        }
    },
    {
        id: "movies",
        name: "كوكب أفلام",
        arabicGenre: "أفلام",
        genreKey: "Movie",
        badge: "🎬",
        icon: "movie",
        slogan: "كوكب العروض الكبرى والشاشات العملاقة",
        description: "أروع الأفلام الطويلة الحصرية والإنتاجات الخاصة بجودة سينمائية فائقة 4K.",
        anthemSnippet: "تجربة سينمائية تأسر الحواس وتنقلك إلى قلب القصة!",
        flagshipWorks: ["فيلم سلام دانك", "فيلم المحقق كونان", "فيلم ون بيس ريد"],
        color: "#8b5cf6",
        bgClass: "bg-purple-500/15 border-purple-500/30 text-purple-400",
        glowColor: "rgba(139, 92, 246, 0.4)",
        isEnabled: true,
        order: 9,
        threeDConfig: {
            hasRings: true,
            ringColor: "rgba(139, 92, 246, 0.8)",
            ringTilt: 18,
            textureStyle: "movies",
            rotationSpeed: 0.9,
            atmosphereGlow: "#8b5cf6",
            scale: 1.05
        }
    },
    {
        id: "bonbon",
        name: "كوكب بون بون",
        arabicGenre: "أطفال",
        genreKey: "Kids",
        badge: "🍭",
        icon: "child_care",
        slogan: "كوكب الصغار والمرح والبدايات اللطيفة",
        description: "حكايات تربوية دافئة ورسوم متحركة مرحة مناسبة لكافة أفراد العائلة والبراعم.",
        anthemSnippet: "كوكب الأبطال الصغار حيث المرح والتعلم والأحلام الوردية!",
        flagshipWorks: ["بابار الفيل", "بيل وسباستيان", "فلونة", "تاما والأصدقاء"],
        color: "#f43f5e",
        bgClass: "bg-rose-500/15 border-rose-500/30 text-rose-400",
        glowColor: "rgba(244, 63, 94, 0.4)",
        isEnabled: true,
        order: 10,
        threeDConfig: {
            hasRings: true,
            ringColor: "rgba(244, 63, 94, 0.75)",
            ringTilt: -20,
            textureStyle: "bonbon",
            rotationSpeed: 1.1,
            atmosphereGlow: "#f43f5e",
            scale: 0.94
        }
    }
];

