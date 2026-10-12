export interface SpacetoonPlanetOption {
    id: string;
    name: string;
    badge: string;
    icon: string;
    slogan?: string;
    description: string;
    color: string;
    bgClass: string;
    gradient: string;
    glowColor?: string;
    anthemSnippet?: string;
    flagshipWorks?: string[];
}

export const SPACETOON_PLANETS: SpacetoonPlanetOption[] = [
    {
        id: "رياضة",
        name: "كوكب رياضة",
        badge: "🏀",
        icon: "sports_basketball",
        slogan: "كوكب التحدي والبطولة والمنافسة الشريفة",
        description: "موطن الرميات الحاسمة، الهتافات الجماهيرية، والروح الرياضية الخالدة التي لا تعرف المستحيل.",
        anthemSnippet: "في كل ركلة، في كل رمية، بالعزم والإصرار نحقق النصر!",
        flagshipWorks: ["سلام دانك", "كابتن ماجد", "بي بليد", "شبح بين الملاعب"],
        color: "text-red-400",
        bgClass: "bg-red-500/15 border-red-500/30 text-red-400",
        gradient: "linear-gradient(135deg, #dc2626, #b91c1c)",
        glowColor: "rgba(220, 38, 38, 0.4)"
    },
    {
        id: "مغامرات",
        name: "كوكب مغامرات",
        badge: "🚀",
        icon: "explore",
        slogan: "كوكب الخيال والرحلات الاستكشافية الكبرى",
        description: "عوالم الخيال الفسيحة، الجزر الغامضة، والرحلات الأسطورية لاكتشاف الكنوز وحماية الصداقة.",
        anthemSnippet: "مهما طال الطريق وصعب المسير، خلف الأفق ينتظرنا المجد الكبير!",
        flagshipWorks: ["داي الشجاع", "القناص", "هزيم الرعد", "عهد الأصدقاء"],
        color: "text-amber-400",
        bgClass: "bg-amber-500/15 border-amber-500/30 text-amber-400",
        gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
        glowColor: "rgba(245, 158, 11, 0.4)"
    },
    {
        id: "أكشن",
        name: "كوكب أكشن",
        badge: "⚡",
        icon: "flash_on",
        slogan: "كوكب القوة والشجاعة والمعارك المصيرية",
        description: "صرخات القتال، طاقات النينجا والأبطال الخارقين في مواجهة قوى الظلام لإنقاذ الكون.",
        anthemSnippet: "كالبرق في السماء، كالسيل حين ينهمر، لا ينحني الفارس الحق ولا ينكسر!",
        flagshipWorks: ["أبطال الديجيتال", "سيف النار", "دراغون بول", "أجنحة كاندام"],
        color: "text-orange-400",
        bgClass: "bg-orange-500/15 border-orange-500/30 text-orange-400",
        gradient: "linear-gradient(135deg, #ea580c, #c2410c)",
        glowColor: "rgba(234, 88, 12, 0.4)"
    },
    {
        id: "غموض",
        name: "كوكب غموض",
        badge: "🔍",
        icon: "search",
        slogan: "كوكب الألغاز والتحقيقات والذكاء الحاد",
        description: "خيوط الجرائم المعقدة، فك الشفرات المستعصية، ومطاردة الحقيقة مهما كانت محجوبة عن الأعين.",
        anthemSnippet: "الحقيقة دائماً واحدة، وعين المحقق الذكي لا تغفل عن التفاصيل!",
        flagshipWorks: ["المحقق كونان", "المحقق ريمي", "شارلوك هولمز", "باتمان"],
        color: "text-cyan-400",
        bgClass: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
        gradient: "linear-gradient(135deg, #06b6d4, #0284c7)",
        glowColor: "rgba(6, 182, 212, 0.4)"
    },
    {
        id: "كوميديا",
        name: "كوكب كوميديا",
        badge: "😄",
        icon: "sentiment_very_satisfied",
        slogan: "كوكب الضحك والمرح والطرائف العائلية",
        description: "مواقف طريفة يومية، مقالب مضحكة، وضحكات لا تتوقف تعيد الدفء والبهجة للقلوب.",
        anthemSnippet: "ابتسم للحياة تبتسم لك، واصنع من كل عثرة طرفة وضحكة!",
        flagshipWorks: ["القناع الأخضر", "تاما والأصدقاء", "الضاحكون", "مستر بين"],
        color: "text-emerald-400",
        bgClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
        gradient: "linear-gradient(135deg, #10b981, #059669)",
        glowColor: "rgba(16, 185, 129, 0.4)"
    },
    {
        id: "زمردة",
        name: "كوكب زمردة",
        badge: "💎",
        icon: "diamond",
        slogan: "كوكب الفتيات والرقة والمشاعر النبيلة",
        description: "قصص الكفاح والأمل، الصداقة الصادقة، ورقة المشاعر التي تبني جسوراً من النور في أصعب الظروف.",
        anthemSnippet: "كالزهرة في الصباح تنشر عطر الأمل، والقلب الصافي يهزم أصعب المحن!",
        flagshipWorks: ["دروب ريمي", "سالي", "ليدي أوسكار", "سندريلا"],
        color: "text-pink-400",
        bgClass: "bg-pink-500/15 border-pink-500/30 text-pink-400",
        gradient: "linear-gradient(135deg, #ec4899, #db2777)",
        glowColor: "rgba(236, 72, 153, 0.4)"
    },
    {
        id: "علوم",
        name: "كوكب علوم",
        badge: "🔬",
        icon: "science",
        slogan: "كوكب الاكتشاف والاختراع والمعرفة المدهشة",
        description: "رحلات في أعماق الطبيعة، أسرار الكون والفضاء، واختراعات المستقبل التي تغير مجرى التاريخ.",
        anthemSnippet: "بالعلم نبني صروح المجد ونفهم أسرار الحياة والكون الفسيح!",
        flagshipWorks: ["المخترع الصغير", "دكتور باسل", "إيكوسان", "باص المدرسة العجيب"],
        color: "text-violet-400",
        bgClass: "bg-violet-500/15 border-violet-500/30 text-violet-400",
        gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
        glowColor: "rgba(139, 92, 246, 0.4)"
    },
    {
        id: "تاريخ",
        name: "كوكب تاريخ",
        badge: "⚔️",
        icon: "castle",
        slogan: "كوكب الأمم والفرسان والأساطير الخالدة",
        description: "وقائع الحضارات القديمة، بسالة الفرسان النبلاء، وقصص العزة والوفاء المستوحاة من صفحات التاريخ.",
        anthemSnippet: "على صهوة الجياد تسطر ملاحم الأوفياء وتبقى ذكراهم فخراً للأجيال!",
        flagshipWorks: ["صقور الأرض", "الفرسان الثلاثة", "روبن هود", "فرسان الأرض"],
        color: "text-yellow-500",
        bgClass: "bg-yellow-500/15 border-yellow-500/30 text-yellow-500",
        gradient: "linear-gradient(135deg, #eab308, #ca8a04)",
        glowColor: "rgba(234, 179, 8, 0.4)"
    },
    {
        id: "أفلام",
        name: "كوكب أفلام",
        badge: "🎬",
        icon: "movie",
        slogan: "كوكب السينما المسرحية والعروض الكبرى 4K",
        description: "روائع الشاشة الفضية، إنتاجات سينمائية مبهرة بأعلى دقة 4K وصوت محيطي لتجربة مسرحية متكاملة.",
        anthemSnippet: "عندما تنطفئ الأنوار وتبدأ الحكاية الكبرى في رحاب السينما الساحرة!",
        flagshipWorks: ["أفلام سلام دانك", "أفلام المحقق كونان", "أفلام ون بيس", "أفلام دراغون بول"],
        color: "text-rose-400",
        bgClass: "bg-rose-500/15 border-rose-500/30 text-rose-400",
        gradient: "linear-gradient(135deg, #f43f5e, #e11d48)",
        glowColor: "rgba(244, 63, 94, 0.4)"
    }
];

export const POPULAR_GENRES = [
    "رياضة",
    "شونين",
    "مغامرات",
    "أكشن",
    "حماسي",
    "غموض",
    "كوميديا",
    "سبيستون كلاسيك",
    "دراما",
    "خيال علمي",
    "خوارق",
    "بطولات",
    "مدرسي",
    "تاريخي",
    "فنون قتالية"
];

export const POPULAR_STUDIOS = [
    "Toei Animation",
    "Nippon Animation",
    "TMS Entertainment",
    "Sunrise",
    "Studio Pierrot",
    "Madhouse",
    "Mappa",
    "Kyoto Animation",
    "Bones",
    "Ufotable"
];

export const CURATED_POSTER_PRESETS = [
    {
        name: "سلام دانك - الصقور",
        url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"
    },
    {
        name: "المحقق كونان - غموض",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
    },
    {
        name: "ون بيس - فجر المغامرة",
        url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"
    },
    {
        name: "دراغون بول - السايان",
        url: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=600&auto=format&fit=crop&q=80"
    },
    {
        name: "القناص - امتحان الصيادين",
        url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80"
    }
];

export const CURATED_BANNER_PRESETS = [
    {
        name: "ملعب شوهوكو السينمائي",
        url: "/hero-bg.jpg"
    },
    {
        name: "سديم كوكب مغامرات",
        url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80"
    },
    {
        name: "طوكيو النيون السايبربانك",
        url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80"
    },
    {
        name: "شروق الغراند لاين",
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80"
    }
];

// Curated Showcase Works representing the planets with rich nostalgia
export const PLANET_SHOWCASE_WORKS: Record<string, any[]> = {
    "رياضة": [
        {
            id: "slam-dunk",
            title: "سلام دانك (Slam Dunk)",
            subtitle: "مباراة شوهوكو والساموراي الحاسمة",
            coverImage: "/hero-bg.jpg",
            rating: "9.9",
            episodes: "101 حلقة",
            year: "1993",
            badge: "مدبلج سبيستون كامل 1080p",
            badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
            link: "/watch/slam-dunk-101",
            desc: "أسطورة الصقور وشوهوكو والملتقط البارع حسان في رحلة البطولة الوطنية."
        },
        {
            id: "captain-tsubasa",
            title: "كابتن ماجد (الشبح)",
            subtitle: "رمية الصاعقة وهداف المجد",
            coverImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
            rating: "9.5",
            episodes: "52 حلقة",
            year: "2001",
            badge: "مدبلج كلاسيك",
            badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
            link: "/animes",
            desc: "قصة ماجد كامل وبسام ووليد في منافسات بطولة كأس العالم للناشئين."
        },
        {
            id: "beyblade",
            title: "بي بليد (صراع البلابل)",
            subtitle: "التنين الخارق ومنصور وعلاء",
            coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
            rating: "9.2",
            episodes: "51 حلقة",
            year: "2002",
            badge: "سبيستون كلاسيك",
            badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
            link: "/animes",
            desc: "نزالات البلابل السريعة وقوى الوحوش الأسطورية في حلبات المنافسة."
        }
    ],
    "مغامرات": [
        {
            id: "hunter-x-hunter",
            title: "القناص (Hunter x Hunter)",
            subtitle: "امتحان الصيادين ورحلة غون",
            coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
            rating: "9.9",
            episodes: "62 حلقة",
            year: "1999",
            badge: "مدبلج سبيستون أصلي",
            badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
            link: "/animes",
            desc: "رحلة غون وكيلوا وكورابيكا ويوريو بحثاً عن الحقيقة والشهادة الأسطورية."
        },
        {
            id: "dai-no-daibouken",
            title: "داي الشجاع (Dragon Quest)",
            subtitle: "سيف الرمز وضربة أفان الحاسمة",
            coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
            rating: "9.6",
            episodes: "46 حلقة",
            year: "1991",
            badge: "الجيل الذهبي",
            badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
            link: "/animes",
            desc: "كفاح الفتى الشجاع داي وتلامذة المعلم أفان لإنقاذ الجزيرة والعالم."
        },
        {
            id: "hazim-alraad",
            title: "هزيم الرعد (Thunder Jet)",
            subtitle: "نسر المجرة ومعارك الفضاء",
            coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
            rating: "9.7",
            episodes: "52 حلقة",
            year: "1994",
            badge: "شارة خالدة",
            badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
            link: "/animes",
            desc: "ملحمة توحيد مجرة الفضاء وحروب السفن الفضائية الكبرى."
        }
    ],
    "أكشن": [
        {
            id: "dragon-ball",
            title: "دراغون بول Z",
            subtitle: "كرات التنين وطاقات السايانز",
            coverImage: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
            rating: "9.8",
            episodes: "291 حلقة",
            year: "1989",
            badge: "أكشن كلاسيك",
            badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
            link: "/animes",
            desc: "غوكو وفيجيتا وتدريبات القوة الخارقة لحماية كوكب الأرض من الغزاة."
        },
        {
            id: "digimon-adventure",
            title: "أبطال الديجيتال (الجزء الأول)",
            subtitle: "عالم الأرقام والوحوش الرقمية",
            coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
            rating: "9.7",
            episodes: "54 حلقة",
            year: "1999",
            badge: "مدبلج سبيستون",
            badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
            link: "/animes",
            desc: "أمجد ويامن وسمر في العالم الرقمي بمساعدة المرافقين لإنقاذ العالمين."
        }
    ],
    "غموض": [
        {
            id: "conan",
            title: "المحقق كونان (Detective Conan)",
            subtitle: "الحقيقة دائماً واحدة",
            coverImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
            rating: "9.9",
            episodes: "+1000 حلقة",
            year: "1996",
            badge: "قمة الغموض",
            badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
            link: "/animes/conan",
            desc: "المتحري الذكي سينشي كودو يحل أعقد القضايا ويطارد المنظمة السوداء."
        }
    ]
};
