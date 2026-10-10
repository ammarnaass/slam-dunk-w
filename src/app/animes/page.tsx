"use client";

import { useEffect, useMemo, useState } from "react";
import { Anime } from "@/types";
import { 
    Search, 
    X, 
    SlidersHorizontal, 
    Sparkles, 
    Film, 
    Tv, 
    Flame, 
    RotateCcw,
    Layers,
    CheckCircle2
} from "lucide-react";
import AnimeCard from "@/components/AnimeCard";
import Breadcrumbs from "@/components/Breadcrumbs";

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
};

export default function AnimesListPage() {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"latest" | "rating" | "episodes" | "year">("latest");

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

    // Extract all unique genres from available animes
    const availableGenres = useMemo(() => {
        const genreSet = new Set<string>();
        animes.forEach(anime => {
            (anime.genres || []).forEach(g => {
                const arabicGenre = GENRE_MAPPING[g] || g;
                genreSet.add(arabicGenre);
            });
        });
        return Array.from(genreSet);
    }, [animes]);

    // Filter and Sort Logic
    const filteredAnimes = useMemo(() => {
        return animes
            .filter(anime => {
                // Search filter (title or description or genres)
                const query = searchQuery.trim().toLowerCase();
                const matchesSearch = !query || 
                    anime.title.toLowerCase().includes(query) ||
                    (anime.description && anime.description.toLowerCase().includes(query)) ||
                    (anime.genres && anime.genres.some(g => {
                        const ar = GENRE_MAPPING[g] || g;
                        return ar.toLowerCase().includes(query) || g.toLowerCase().includes(query);
                    }));

                // Genre filter
                const matchesGenre = selectedGenre === "all" || (anime.genres && anime.genres.some(g => {
                    const ar = GENRE_MAPPING[g] || g;
                    return ar === selectedGenre || g === selectedGenre;
                }));

                // Status filter
                const isCompleted = anime.status?.toLowerCase() === "completed" || anime.status === "مكتمل";
                const matchesStatus = 
                    selectedStatus === "all" ||
                    (selectedStatus === "completed" && isCompleted) ||
                    (selectedStatus === "ongoing" && !isCompleted);

                return matchesSearch && matchesGenre && matchesStatus;
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
                // default: latest (based on updatedAt or createdAt)
                return 0;
            });
    }, [animes, searchQuery, selectedGenre, selectedStatus, sortBy]);

    // Total counts for stats
    const totalEpisodesCount = useMemo(() => {
        return animes.reduce((acc, curr) => acc + (curr.totalEpisodes || 0), 0);
    }, [animes]);

    const hasActiveFilters = searchQuery !== "" || selectedGenre !== "all" || selectedStatus !== "all" || sortBy !== "latest";

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedGenre("all");
        setSelectedStatus("all");
        setSortBy("latest");
    };

    return (
        <div className="min-h-screen bg-slate-950 pb-24 text-slate-100">
            {/* Ambient Background Radial Glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(220,38,38,0.18),transparent_80%)]" />

            {/* Breadcrumbs */}
            <div className="relative border-b border-slate-900/80 bg-slate-950/40 backdrop-blur-md">
                <Breadcrumbs customLabels={{ animes: "دليل الأنميات" }} />
            </div>

            {/* Hero Header Section */}
            <header className="relative pt-8 pb-10 sm:py-12 border-b border-slate-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        {/* Top Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/60 border border-red-800/40 text-red-400 text-xs font-semibold mb-4 backdrop-blur-md">
                            <Sparkles size={13} className="animate-pulse" />
                            <span>مكتبة الأنمي الشاملة</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                            دليل مسلسلات وأفلام <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-orange-500">الأنمي</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
                            استكشف أروع أعمال الأنمي الكلاسيكية والحديثة بأعلى دقة عرض وترجمة احترافية، مع دعم السيرفرات المتعددة والمشاهدة السلسة بدون إعلانات.
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-900">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                                <div className="p-2.5 rounded-lg bg-red-600/10 text-red-500">
                                    <Tv size={18} />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{animes.length || "2"}</div>
                                    <div className="text-[11px] text-slate-400">أعمال متاحة</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                                <div className="p-2.5 rounded-lg bg-rose-600/10 text-rose-500">
                                    <Film size={18} />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{totalEpisodesCount > 0 ? `+${totalEpisodesCount}` : "+250"}</div>
                                    <div className="text-[11px] text-slate-400">حلقة مترجمة</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                                <div className="p-2.5 rounded-lg bg-amber-600/10 text-amber-500">
                                    <Layers size={18} />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">FHD 1080p</div>
                                    <div className="text-[11px] text-slate-400">أعلى جودة</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                                <div className="p-2.5 rounded-lg bg-emerald-600/10 text-emerald-500">
                                    <CheckCircle2 size={18} />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">سيرفرات سريعة</div>
                                    <div className="text-[11px] text-slate-400">مشاهدة مباشرة</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Interactive Filters & Search Controls */}
            <section className="sticky top-16 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-slate-900 shadow-md">
                <div className="container mx-auto px-4 py-4 space-y-3.5">
                    {/* Top Controls: Search Bar + Status & Sort */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-lg">
                            <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ابحث عن اسم الأنمي، التصنيف، القصة..."
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                                    aria-label="مسح البحث"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Status Tabs + Sort Dropdown */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                            {/* Status Filter */}
                            <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs shrink-0">
                                <button
                                    onClick={() => setSelectedStatus("all")}
                                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                        selectedStatus === "all"
                                            ? "bg-red-600 text-white shadow-sm"
                                            : "text-slate-400 hover:text-white"
                                    }`}
                                >
                                    الكل
                                </button>
                                <button
                                    onClick={() => setSelectedStatus("completed")}
                                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                        selectedStatus === "completed"
                                            ? "bg-red-600 text-white shadow-sm"
                                            : "text-slate-400 hover:text-white"
                                    }`}
                                >
                                    مكتمل
                                </button>
                                <button
                                    onClick={() => setSelectedStatus("ongoing")}
                                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                        selectedStatus === "ongoing"
                                            ? "bg-red-600 text-white shadow-sm"
                                            : "text-slate-400 hover:text-white"
                                    }`}
                                >
                                    مستمر
                                </button>
                            </div>

                            {/* Sort Selector */}
                            <div className="relative shrink-0">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-red-500 cursor-pointer transition-colors"
                                >
                                    <option value="latest">الأحدث إضافة</option>
                                    <option value="rating">الأعلى تقييماً</option>
                                    <option value="episodes">الأكثر حلقات</option>
                                    <option value="year">سنة الإنتاج</option>
                                </select>
                            </div>

                            {/* Reset Filters button if any is active */}
                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    title="إعادة تعيين الفلاتر"
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors shrink-0"
                                >
                                    <RotateCcw size={13} />
                                    <span className="hidden sm:inline">مسح الفلاتر</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Genre Chips Row */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
                        <span className="text-xs font-semibold text-slate-400 shrink-0 ml-1">
                            التصنيفات:
                        </span>

                        <button
                            onClick={() => setSelectedGenre("all")}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                                selectedGenre === "all"
                                    ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                                    : "bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
                            }`}
                        >
                            جميع التصنيفات
                        </button>

                        {availableGenres.map(genre => (
                            <button
                                key={genre}
                                onClick={() => setSelectedGenre(genre)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                                    selectedGenre === genre
                                        ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                                        : "bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
                                }`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <main className="container mx-auto px-4 pt-8">
                {/* Results count bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                        <h2 className="text-sm font-semibold text-slate-400">
                            النتائج المتاحة ({loading ? "..." : filteredAnimes.length})
                        </h2>
                    </div>

                    {hasActiveFilters && (
                        <div className="text-xs text-slate-400">
                            تم تصفية النتائج بحسب اختياراتك
                        </div>
                    )}
                </div>

                {/* Loading Skeleton State */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                            <div
                                key={item}
                                className="flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden animate-pulse"
                            >
                                <div className="aspect-[2/3] bg-slate-800/70" />
                                <div className="p-4 space-y-3">
                                    <div className="h-3 w-16 bg-slate-800 rounded" />
                                    <div className="h-4 w-3/4 bg-slate-800 rounded" />
                                    <div className="flex justify-between pt-2 border-t border-slate-800">
                                        <div className="h-3 w-12 bg-slate-800 rounded" />
                                        <div className="h-3 w-12 bg-slate-800 rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Loaded Grid */}
                {!loading && filteredAnimes.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                        {filteredAnimes.map((anime, index) => (
                            <AnimeCard 
                                key={anime.id} 
                                anime={anime} 
                                priority={index < 4}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredAnimes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 my-6">
                        <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-900/40 flex items-center justify-center text-red-500 mb-4 shadow-lg shadow-red-950/50">
                            <SlidersHorizontal size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                            لم يتم العثور على أي عمل مطابق
                        </h3>
                        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
                            {searchQuery
                                ? `لم نجد أي أنمي يطابق كلمة البحث "${searchQuery}". جرب كلمة بحث أخرى أو مسح الفلاتر المحددة.`
                                : "لا توجد نتائج تطابق التصنيفات أو الفلاتر المحددة حالياً."}
                        </p>
                        <button
                            onClick={resetFilters}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-600/30 transition-all hover:-translate-y-0.5"
                        >
                            <RotateCcw size={16} />
                            <span>إعادة تعيين جميع الفلاتر</span>
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
