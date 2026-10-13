import fs from "fs";
import path from "path";

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
}

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
        order: 1
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
        order: 2
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
        order: 3
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
        order: 4
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
        order: 5
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
        order: 6
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
        order: 7
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
        order: 8
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
        order: 9
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
        order: 10
    }
];

const DATA_DIR = path.join(process.cwd(), "src/data");
const PLANETS_FILE = path.join(DATA_DIR, "planets.json");

export function getStoredPlanets(): AdminPlanetItem[] {
    try {
        if (fs.existsSync(PLANETS_FILE)) {
            const raw = fs.readFileSync(PLANETS_FILE, "utf-8");
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
            }
        }
    } catch (e) {
        console.error("Failed to read planets.json:", e);
    }
    return DEFAULT_ADMIN_PLANETS;
}

export function saveStoredPlanets(planets: AdminPlanetItem[]): void {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(PLANETS_FILE, JSON.stringify(planets, null, 2), "utf-8");
    } catch (e) {
        console.error("Failed to write planets.json:", e);
        throw e;
    }
}
