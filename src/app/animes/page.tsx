"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Anime } from "@/types";
import AnimeCard from "@/components/AnimeCard";

const SPACETOON_PLANETS = [
    { name: "الكل", genre: "all", icon: "apps" },
    { name: "كوكب الأكشن والمغامرة", genre: "Action", icon: "swords" },
    { name: "كوكب الرياضة والحماس", genre: "Sports", icon: "sports_basketball" },
    { name: "كوكب المغامرات", genre: "Adventure", icon: "explore" },
    { name: "كوكب الغموض والخيال", genre: "Mystery", icon: "psychology" },
    { name: "شونين", genre: "Shounen", icon: "local_fire_department" },
    { name: "دراما ورومانسية", genre: "Drama", icon: "favorite" },
    { name: "كوكب الكوميديا", genre: "Comedy", icon: "sentiment_very_satisfied" },
    { name: "الخيال العلمي", genre: "Sci-Fi", icon: "rocket_launch" },
    { name: "خارق للطبيعة", genre: "Fantasy", icon: "auto_awesome" },
];

const RECENT_SEARCHES = [
    { label: "هجوم العمالقة", query: "هجوم العمالقة" },
    { label: "سولو ليفلينج", query: "سولو ليفلينج" },
    { label: "ون بيس", query: "ون بيس" },
    { label: "سلام دانك", query: "سلام دانك" },
    { label: "كوكب الأكشن", genre: "Action" },
];

const GENRE_MAPPING: Record<string, string> = {
    Sports: "رياضة",
    Comedy: "كوميديا",
    School: "مدرسي",
    Shounen: "شونين",
    Action: "أكشن",
    Mystery: "غموض",
    Drama: "دراما",
    Adventure: "مغامرات",
    Fantasy: "فانتازيا",
    "Sci-Fi": "خيال علمي"
};

function AnimesListContent() {
    const searchParams = useSearchParams();
    const urlGenre = searchParams.get("genre") || searchParams.get("planet") || "";
    const urlSearch = searchParams.get("q") || searchParams.get("search") || "";

    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(urlSearch);
    const [selectedPlanet, setSelectedPlanet] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"latest" | "rating" | "episodes" | "year">("latest");

    // Sync URL query params with state
    useEffect(() => {
        if (urlGenre) {
            const lower = urlGenre.trim().toLowerCase();
            const matched = SPACETOON_PLANETS.find(p => 
                p.genre.toLowerCase() === lower ||
                p.name.toLowerCase().includes(lower) ||
                (GENRE_MAPPING[p.genre] && GENRE_MAPPING[p.genre].toLowerCase() === lower)
            );
            if (matched) {
                setSelectedPlanet(matched.genre);
            } else {
                setSelectedPlanet(urlGenre);
            }
        }
        if (urlSearch) {
            setSearchQuery(urlSearch);
        }
    }, [urlGenre, urlSearch]);

    useEffect(() => {
        fetch("/api/animes")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAnimes(data);
                } else {
                    setAnimes([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching animes:", err);
                setLoading(false);
            });
    }, []);

    // Filter and Sort Logic
    const filteredAnimes = useMemo(() => {
        return animes
            .filter(anime => {
                // Search filter
                const query = searchQuery.trim().toLowerCase();
                const matchesSearch = !query || 
                    anime.title.toLowerCase().includes(query) ||
                    (anime.description && anime.description.toLowerCase().includes(query)) ||
                    (anime.genres && anime.genres.some(g => {
                        const ar = GENRE_MAPPING[g] || g;
                        return ar.toLowerCase().includes(query) || g.toLowerCase().includes(query);
                    }));

                // Planet/Genre filter
                const matchesPlanet = selectedPlanet === "all" || (anime.genres && anime.genres.some(g => {
                    return g.toLowerCase() === selectedPlanet.toLowerCase() || 
                           GENRE_MAPPING[g]?.toLowerCase() === selectedPlanet.toLowerCase();
                }));

                // Status filter
                const isCompleted = anime.status?.toLowerCase() === "completed" || anime.status === "مكتمل";
                const matchesStatus = 
                    selectedStatus === "all" ||
                    (selectedStatus === "completed" && isCompleted) ||
                    (selectedStatus === "ongoing" && !isCompleted);

                return matchesSearch && matchesPlanet && matchesStatus;
            })
            .sort((a, b) => {
                if (sortBy === "rating") {
                    return (b.rating || 0) - (a.rating || 0);
                }
                if (sortBy === "episodes") {
                    return (b.totalEpisodes || 0) - (a.totalEpisodes || 0);
                }
                if (sortBy === "year") {
                    return (b.releaseYear || 0) - (a.releaseYear || 0);
                }
                return 0; // default latest
            });
    }, [animes, searchQuery, selectedPlanet, selectedStatus, sortBy]);

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedPlanet("all");
        setSelectedStatus("all");
        setSortBy("latest");
    };

    return (
        <div className="min-h-screen bg-surface-container-lowest text-on-surface font-body-md pt-20 sm:pt-24 pb-12 sm:pb-20">
            {/* Top Atmospheric Glow */}
            <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-primary-container/10 rounded-full blur-[140px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                
                {/* Header Banner Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-white/[0.06]">
                    <div className="flex flex-col gap-2">
                        <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-surface-container-low border border-white/5 text-xs text-secondary">
                            <span className="material-symbols-outlined text-[16px] text-primary-container">video_library</span>
                            <span className="font-bold">الأرشيف الرقمي الشامل</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-container shadow-[0_0_8px_rgba(220,38,38,0.9)]" />
                            <span className="text-on-surface-variant">تحديث مباشر 2025</span>
                        </div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                            دليل الأنميات والمكتبة الشاملة
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                            استكشف آلاف الأعمال والمسلسلات والأفلام مع إمكانية التصفية المتقدمة وفق الكواكب والتصنيفات ودقة العرض.
                        </p>
                    </div>

                    {/* Summary Badge */}
                    <div className="bg-surface-container-low p-4 rounded-2xl border border-white/[0.06] flex items-center gap-4 shadow-md self-start md:self-auto">
                        <div className="flex flex-col text-right">
                            <span className="text-xs text-on-surface-variant font-label-sm">إجمالي الأعمال المتوفرة</span>
                            <span className="font-headline-md text-headline-md text-on-surface font-bold">
                                {loading ? "..." : animes.length} <span className="text-xs text-secondary font-tajawal">عمل</span>
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary border border-white/5">
                            <span className="material-symbols-outlined text-xl">auto_awesome</span>
                        </div>
                    </div>
                </div>

                {/* Main Search & Filters Bar */}
                <div className="py-4 sm:py-6 flex flex-col gap-3.5 sm:gap-5">
                    {/* Search Input Box */}
                    <div className="relative w-full">
                        <div className="relative flex items-center bg-surface-container-low rounded-2xl border border-white/[0.08] shadow-lg focus-within:border-primary-container focus-within:shadow-[0_0_24px_rgba(220,38,38,0.3)] min-h-[50px] sm:min-h-[54px] transition-all">
                            <div className="pr-3.5 sm:pr-4 pl-2 flex items-center pointer-events-none text-on-surface-variant shrink-0">
                                <span className="material-symbols-outlined text-[22px]">search</span>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ابحث بالاسم، الكوكب، أو التصنيف..."
                                className="w-full bg-transparent py-3 sm:py-3.5 pr-1 pl-12 text-base sm:text-sm font-tajawal text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute left-1.5 sm:left-2 w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center rounded-xl bg-surface-container-high/90 text-on-surface-variant hover:text-on-surface active:scale-95 transition-all cursor-pointer"
                                    title="مسح"
                                    aria-label="مسح البحث"
                                >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick Searches Tags Ribbon */}
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none touch-pan-x -mt-1 pb-0.5 text-xs">
                        <span className="text-on-surface-variant shrink-0 flex items-center gap-1 font-tajawal px-1 text-xs">
                            <span className="material-symbols-outlined text-[15px] text-primary">trending_up</span>
                            <span className="font-bold">شائع:</span>
                        </span>
                        {RECENT_SEARCHES.map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => {
                                    if (item.genre) {
                                        setSelectedPlanet(item.genre);
                                    } else if (item.query) {
                                        setSearchQuery(item.query);
                                    }
                                }}
                                className="inline-flex items-center px-3 py-1.5 min-h-[36px] rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-tajawal whitespace-nowrap border border-white/5 active:scale-95 transition-all cursor-pointer"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Spacetoon Planets Filter Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none touch-pan-x py-1">
                        {SPACETOON_PLANETS.map((planet) => {
                            const isSelected = selectedPlanet === planet.genre;
                            return (
                                <button
                                    key={planet.name}
                                    onClick={() => setSelectedPlanet(planet.genre)}
                                    className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-cairo font-bold transition-all whitespace-nowrap cursor-pointer border active:scale-95 ${
                                        isSelected
                                            ? "bg-primary-container text-on-primary-container border-primary-container shadow-[0_0_16px_rgba(220,38,38,0.45)]"
                                            : "bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container border-white/5"
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">
                                        {planet.icon}
                                    </span>
                                    <span>{planet.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Secondary Filter Controls (Status & Sort) */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-surface-container-low border border-white/[0.05]">
                        {/* Status Segmented Control */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-on-surface-variant flex items-center gap-1 font-bold shrink-0">
                                <span className="material-symbols-outlined text-[16px] text-primary-container">filter_list</span>
                                <span>الحالة:</span>
                            </span>
                            <div className="flex-1 sm:flex-initial grid grid-cols-3 sm:flex items-center gap-1 bg-surface-container p-1 rounded-xl border border-white/5">
                                {[
                                    { label: "الكل", value: "all" },
                                    { label: "مكتمل", value: "completed" },
                                    { label: "مستمر", value: "ongoing" },
                                ].map((s) => (
                                    <button
                                        key={s.value}
                                        onClick={() => setSelectedStatus(s.value)}
                                        className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-tajawal transition-all cursor-pointer text-center active:scale-95 ${
                                            selectedStatus === s.value
                                                ? "bg-primary-container text-on-primary-container font-bold shadow-[0_2px_8px_rgba(220,38,38,0.3)]"
                                                : "text-on-surface-variant hover:text-on-surface"
                                        }`}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort and Reset controls */}
                        <div className="flex items-center gap-2 justify-between sm:justify-end">
                            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                                <span className="text-xs text-on-surface-variant shrink-0 font-tajawal">الترتيب:</span>
                                <div className="relative flex-1 sm:flex-initial">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="w-full sm:w-auto bg-surface-container text-on-surface text-xs sm:text-sm font-cairo py-2.5 px-3 pl-8 min-h-[44px] rounded-xl border border-white/10 focus:outline-none focus:border-primary-container cursor-pointer appearance-none"
                                    >
                                        <option value="latest">الأحدث إضافة</option>
                                        <option value="rating">الأعلى تقييماً</option>
                                        <option value="episodes">الأكثر حلقات</option>
                                        <option value="year">سنة الإنتاج</option>
                                    </select>
                                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                        expand_more
                                    </span>
                                </div>
                            </div>

                            {(searchQuery || selectedPlanet !== "all" || selectedStatus !== "all" || sortBy !== "latest") && (
                                <button
                                    onClick={resetFilters}
                                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary active:scale-95 transition-all border border-white/5 cursor-pointer shrink-0"
                                    title="إعادة ضبط الفلاتر"
                                    aria-label="إعادة ضبط الفلاتر"
                                >
                                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Anime Cards Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="aspect-[2/3] rounded-xl bg-surface-container animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : filteredAnimes.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
                        {filteredAnimes.map((anime, index) => (
                            <AnimeCard
                                key={anime.id}
                                anime={anime}
                                priority={index < 5}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 sm:py-20 px-4 bg-surface-container-low rounded-2xl border border-dashed border-white/10 flex flex-col items-center gap-3">
                        <span className="material-symbols-outlined text-5xl text-on-surface-variant">search_off</span>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">لم نجد أي نتائج مطابقة</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                            جرب البحث بكلمات أخرى أو اختر كوكب مختلف من قائمة التصفية أعلاه.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="mt-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-cairo font-bold text-xs sm:text-sm active:scale-95 shadow-md cursor-pointer transition-all"
                        >
                            إلغاء جميع الفلاتر
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AnimesListPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-surface-container-lowest text-on-surface flex items-center justify-center font-cairo">
                جاري تحميل مكتبة الأنمي...
            </div>
        }>
            <AnimesListContent />
        </Suspense>
    );
}
