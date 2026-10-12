export interface CommentItem {
  id: string;
  author: string;
  avatarLetter: string;
  avatarBg?: string;
  isVip?: boolean;
  isPinned?: boolean;
  timeAgo: string;
  isVerified?: boolean;
  text: string;
  timestamp?: string; // e.g. "16:40"
  hasSpoiler?: boolean;
  likes: number;
  dislikes: number;
  repliesCount: number;
}

export interface CastMember {
  role: string;
  actor: string;
  isMemorial?: boolean;
}

export interface AnimeCastData {
  arabicDub: CastMember[];
  japaneseSeiyuu: CastMember[];
  planet: {
    id: string;
    name: string;
    href: string;
  };
  tags: string[];
}

export const DEFAULT_ANIME_CASTS: Record<string, AnimeCastData> = {
  "slam-dunk": {
    arabicDub: [
      { role: "حسان (هاناميتشي ساكوراجي)", actor: "عادل أبو حسون" },
      { role: "فادي (كايدي روكاوا)", actor: "رأفت بازو" },
      { role: "سعد (تاكينوري أكاجي)", actor: "مروان فرحات" },
      { role: "ميسون (هاروكو أكاجي)", actor: "فاطمة سعد" },
      { role: "جواد (ميتسوي هيساشي)", actor: "زياد الرفاعي", isMemorial: true },
      { role: "بدر (ريوتا مياجي)", actor: "قاسم ملحو" },
      { role: "المدرب غسان (أنزاي سينسي)", actor: "مأمون الرفاعي" }
    ],
    japaneseSeiyuu: [
      { role: "Hanamichi Sakuragi", actor: "Takeshi Kusao" },
      { role: "Kaede Rukawa", actor: "Hikaru Midorikawa" },
      { role: "Takenori Akagi", actor: "Kiyoyuki Yanada" },
      { role: "Haruko Akagi", actor: "Akiko Hiramatsu" }
    ],
    planet: {
      id: "sports",
      name: "كوكب رياضة",
      href: "/planets?planet=sports"
    },
    tags: ["كرة سلة", "روح قتالية", "كوميديا شبابية", "بطولة وطنية", "شونين كلاسيكي"]
  },
  "conan": {
    arabicDub: [
      { role: "كونان إيدوجاوا", actor: "آمال سعد الدين" },
      { role: "سينشي كودو", actor: "مأمون الرفاعي" },
      { role: "ران موري", actor: "سمر كوكش" },
      { role: "توغو موري", actor: "مروان فرحات" },
      { role: "المفتش ميغوري", actor: "رأفت بازو" }
    ],
    japaneseSeiyuu: [
      { role: "Conan Edogawa", actor: "Minami Takayama" },
      { role: "Shinichi Kudo", actor: "Kappei Yamaguchi" },
      { role: "Ran Mouri", actor: "Wakana Yamazaki" },
      { role: "Kogoro Mouri", actor: "Akira Kamiya" }
    ],
    planet: {
      id: "action",
      name: "كوكب أكشن",
      href: "/planets?planet=action"
    },
    tags: ["تحقيق وجرائم", "ذكاء خارق", "غموض وتشويق", "المنظمة السوداء", "أسطورة سبيستون"]
  },
  "default": {
    arabicDub: [
      { role: "البطل المقنع / الفارس", actor: "مأمون الرفاعي" },
      { role: "المعلم الأسطوري", actor: "زياد الرفاعي", isMemorial: true },
      { role: "المعالج كين", actor: "أمل حويجة" },
      { role: "فارس الظل الملكي", actor: "عادل أبو حسون" }
    ],
    japaneseSeiyuu: [
      { role: "Protagonist Lead", actor: "Mamoru Miyano" },
      { role: "Shadow Mentor", actor: "Kenjiro Tsuda" },
      { role: "Sacred Spirit", actor: "Rie Takahashi" },
      { role: "Lord of Chaos", actor: "Takehito Koyasu" }
    ],
    planet: {
      id: "action",
      name: "كوكب أكشن",
      href: "/planets?planet=action"
    },
    tags: ["قتال سيوف", "قوى خارقة", "دراما أسطورية", "شونين مظلم", "دبلجة ذهبية"]
  }
};

export const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: "comm-1",
    author: "طارق الأسطوري",
    avatarLetter: "ط",
    avatarBg: "bg-secondary-container text-on-secondary-container",
    isVip: true,
    isPinned: true,
    timeAgo: "منذ 3 ساعات",
    isVerified: true,
    timestamp: "16:40",
    text: "يا إلهي على الإخراج في الدقيقة 16:40! الموسيقى التصويرية التصاعدية مع صوت المعلق ذكرتني بأعظم قتالات الجيل الذهبي. التحريك في مشهد التسديدة كان سلساً بشكل لا يصدق!",
    hasSpoiler: false,
    likes: 342,
    dislikes: 4,
    repliesCount: 14
  },
  {
    id: "comm-2",
    author: "نور الدين أوتاكو",
    avatarLetter: "ن",
    avatarBg: "bg-surface-container-highest text-on-surface",
    timeAgo: "منذ 5 ساعات",
    isVerified: false,
    hasSpoiler: true,
    text: "تلميح لما سيحدث: المنافس ليس شخصاً غريباً، إنه في الحقيقة خصم ريان القديم الذي تنبأ بسقوط البطولة في الحلقة السابقة! لا تفوتوا المشهد الأخير بعد شارة النهاية.",
    likes: 88,
    dislikes: 12,
    repliesCount: 4
  },
  {
    id: "comm-3",
    author: "سبيستوني قديم",
    avatarLetter: "س",
    avatarBg: "bg-primary-container text-on-primary-container",
    timeAgo: "منذ 8 ساعات",
    isVerified: true,
    hasSpoiler: false,
    text: "الدبلجة في هذه النسخة فخمة لأبعد حد! شكراً لمنصة ANIME DAZE على الحفاظ على نبرات المؤدين القدامى في مركز الزهرة.",
    likes: 219,
    dislikes: 2,
    repliesCount: 8
  }
];

export const PRESET_SERVERS = [
  { id: "srv-alpha", name: "سيرفر ألفا السريع", quality: "1080p FHD", ping: "24ms" },
  { id: "srv-veda", name: "سيرفر فيدا المشفر", quality: "1080p FHD", ping: "38ms" },
  { id: "srv-cloud", name: "سيرفر السحابة 4K", quality: "4K HDR", ping: "18ms" },
  { id: "srv-classic", name: "سيرفر سبيستون الكلاسيكي", quality: "720p HD", ping: "45ms" }
];
