import { AnimeAvatarPreset, CoverBannerPreset, OtakuTitle } from "@/server/types/profile.types";

export interface AuraGlowOption {
    id: string;
    name: string;
    nameEn: string;
    cssClass: string;
    borderGlow: string;
    gradient: string;
    badgeColor: string;
}

export const ANIME_AVATAR_PRESETS: AnimeAvatarPreset[] = [
    {
        id: "hanamichi",
        name: "حسان (Sakuragi)",
        anime: "سلام دانك",
        url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: "rukawa",
        name: "فادي (Rukawa)",
        anime: "سلام دانك",
        url: "https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: "luffy",
        name: "لوفي (Luffy)",
        anime: "ون بيس",
        url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: "zoro",
        name: "زورو (Zoro)",
        anime: "ون بيس",
        url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: "conan",
        name: "كونان (Conan)",
        anime: "المحقق كونان",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: "goku",
        name: "غوكو (Goku)",
        anime: "دراغون بول",
        url: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: "killua",
        name: "كيلوا (Killua)",
        anime: "القناص",
        url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: "gon",
        name: "غون (Gon)",
        anime: "القناص",
        url: "https://images.unsplash.com/photo-1560972550-aba3456b5564?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: "tsubasa",
        name: "كابتن ماجد",
        anime: "كابتن ماجد",
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80"
    },
    {
        id: "grendizer",
        name: "غريندايزر",
        anime: "مغامرات الفضاء",
        url: "/logoep.jpg"
    }
];

export const COVER_BANNER_PRESETS: CoverBannerPreset[] = [
    {
        id: "shohoku_court",
        name: "صالة صقور شوهوكو",
        description: "أرضية ملعب كرة السلة الأسطوري لسلام دانك",
        url: "/hero-bg.jpg"
    },
    {
        id: "spacetoon_galaxy",
        name: "سديم كوكب مغامرات",
        description: "فضاء سبيستون اللانهائي المليء بالذكريات الذهبية",
        url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80"
    },
    {
        id: "grand_line",
        name: "أفق الغراند لاين",
        description: "شروق الشمس الساحر فوق مياه البحار السبع",
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80"
    },
    {
        id: "neo_tokyo",
        name: "نيو طوكيو السايبربانك",
        description: "أضواء النيون البنفسجية في ليل العاصمة اليابانية",
        url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80"
    },
    {
        id: "fuji_sunset",
        name: "غروب جبل فوجي الكلاسيكي",
        description: "جمال الطبيعة اليابانية الساحرة عند مغيب الشمس",
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80"
    }
];

export const AURA_GLOW_OPTIONS: AuraGlowOption[] = [
    {
        id: "crimson",
        name: "لهيب الصقور (قرمزي)",
        nameEn: "Crimson Flame",
        cssClass: "from-red-600 via-rose-500 to-amber-500",
        borderGlow: "rgba(239, 68, 68, 0.6)",
        gradient: "linear-gradient(135deg, #dc2626, #f43f5e, #f59e0b)",
        badgeColor: "bg-red-500/20 text-red-400 border-red-500/30"
    },
    {
        id: "gold",
        name: "الهالة الذهبية الخارقة (VIP)",
        nameEn: "Golden Super Saiyan",
        cssClass: "from-amber-400 via-yellow-300 to-amber-600",
        borderGlow: "rgba(245, 158, 11, 0.7)",
        gradient: "linear-gradient(135deg, #f59e0b, #fde047, #d97706)",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30"
    },
    {
        id: "cyan",
        name: "صاعقة البرق (سماوي)",
        nameEn: "Cyan Lightning",
        cssClass: "from-cyan-400 via-sky-300 to-blue-600",
        borderGlow: "rgba(6, 182, 212, 0.6)",
        gradient: "linear-gradient(135deg, #06b6d4, #38bdf8, #2563eb)",
        badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
    },
    {
        id: "emerald",
        name: "طاقة النين الحيوية (زمردي)",
        nameEn: "Emerald Nen",
        cssClass: "from-emerald-400 via-teal-300 to-green-600",
        borderGlow: "rgba(16, 185, 129, 0.6)",
        gradient: "linear-gradient(135deg, #10b981, #2dd4bf, #059669)",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    },
    {
        id: "amethyst",
        name: "مجال الظلال (أرجواني)",
        nameEn: "Amethyst Shadow",
        cssClass: "from-purple-500 via-fuchsia-400 to-indigo-600",
        borderGlow: "rgba(168, 85, 247, 0.6)",
        gradient: "linear-gradient(135deg, #a855f7, #e879f9, #4f46e5)",
        badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30"
    }
];

export const OTAKU_TITLES: OtakuTitle[] = [
    {
        id: "shohoku_hawk",
        title: "صقر شوهوكو",
        badge: "🏀",
        color: "text-red-400 bg-red-950/50 border-red-500/30"
    },
    {
        id: "pirate_king",
        title: "ملك القراصنة القادم",
        badge: "🏴‍☠️",
        color: "text-amber-400 bg-amber-950/50 border-amber-500/30"
    },
    {
        id: "legendary_hunter",
        title: "صياد أسطوري 3 نجوم",
        badge: "🎯",
        color: "text-emerald-400 bg-emerald-950/50 border-emerald-500/30"
    },
    {
        id: "spacetoon_pioneer",
        title: "رائد كوكب مغامرات",
        badge: "🚀",
        color: "text-cyan-400 bg-cyan-950/50 border-cyan-500/30"
    },
    {
        id: "master_detective",
        title: "المحقق العبقري",
        badge: "🔍",
        color: "text-blue-400 bg-blue-950/50 border-blue-500/30"
    },
    {
        id: "super_saiyan",
        title: "محارب السايان الأسطوري",
        badge: "⚡",
        color: "text-yellow-400 bg-yellow-950/50 border-yellow-500/30"
    }
];

export const DEFAULT_PREFERENCES = {
    audioLanguage: "dubbed" as const,
    quality: "1080p" as const,
    autoplay: true,
    favoritePlanet: "مغامرات"
};
