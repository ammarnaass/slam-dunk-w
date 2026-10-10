"use client";

import { useEffect, useState, useMemo } from "react";
import { Anime } from "@/types";
import { 
    Loader2, 
    Plus, 
    Edit, 
    Trash2, 
    Tv, 
    Film, 
    Search, 
    Star, 
    ExternalLink, 
    Sparkles,
    CheckCircle2,
    Clock,
    X,
    Filter
} from "lucide-react";
import Link from "next/link";

export default function AnimesPage() {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<"all" | "tv" | "movie" | "featured" | "ongoing" | "completed">("all");
    const [sortBy, setSortBy] = useState<"recent" | "title" | "episodes">("recent");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/animes")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAnimes(data);
                } else if (data?.animes && Array.isArray(data.animes)) {
                    setAnimes(data.animes);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load animes:", err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`هل أنت متأكد من حذف "${title}"؟ سيتم حذف جميع حلقاته وسيرفرات البث المرتبطة به نهائياً!`)) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/animes/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setAnimes(prev => prev.filter(a => a.id !== id));
            } else {
                alert("حدث خطأ أثناء محاولة الحذف، يرجى المحاولة لاحقاً.");
            }
        } catch (error) {
            console.error("Error deleting anime:", error);
            alert("فشل الاتصال بالخادم.");
        } finally {
            setDeletingId(null);
        }
    };

    // Filter and sort animes
    const filteredAnimes = useMemo(() => {
        return animes.filter(anime => {
            // Text search
            const q = searchQuery.toLowerCase().trim();
            const matchesQuery = !q || 
                anime.title?.toLowerCase().includes(q) || 
                anime.description?.toLowerCase().includes(q) ||
                (Array.isArray(anime.genres) && anime.genres.some(g => g.toLowerCase().includes(q)));

            if (!matchesQuery) return false;

            // Category filter
            if (selectedFilter === "featured") return !!anime.isFeatured;
            if (selectedFilter === "tv") return anime.type?.toLowerCase().includes("tv") || anime.type?.includes("مسلسل");
            if (selectedFilter === "movie") return anime.type?.toLowerCase().includes("movie") || anime.type?.includes("فيلم");
            if (selectedFilter === "ongoing") return anime.status?.toLowerCase() === "ongoing" || anime.status === "مستمر";
            if (selectedFilter === "completed") return anime.status?.toLowerCase() === "completed" || anime.status === "مكتمل";

            return true;
        }).sort((a, b) => {
            if (sortBy === "title") return (a.title || "").localeCompare(b.title || "", "ar");
            if (sortBy === "episodes") return (Number(b.totalEpisodes) || 0) - (Number(a.totalEpisodes) || 0);
            return 0; // default order as returned (updatedAt desc)
        });
    }, [animes, searchQuery, selectedFilter, sortBy]);

    // Summary counts
    const counts = useMemo(() => {
        const total = animes.length;
        const tv = animes.filter(a => a.type?.toLowerCase().includes("tv") || a.type?.includes("مسلسل")).length;
        const movies = animes.filter(a => a.type?.toLowerCase().includes("movie") || a.type?.includes("فيلم")).length;
        const featured = animes.filter(a => a.isFeatured).length;
        const ongoing = animes.filter(a => a.status?.toLowerCase() === "ongoing" || a.status === "مستمر").length;
        return { total, tv, movies, featured, ongoing };
    }, [animes]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="w-9 h-9 animate-spin text-red-600" />
                <p className="text-sm font-medium text-slate-400">جاري تحميل قائمة الأعمال...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-1.5 h-6 bg-red-600 rounded-full" />
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                            إدارة المحتوى (الأنمي والأفلام)
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400">
                        إضافة وتعديل المسلسلات، الأجزاء، إدارة الحلقات وسيرفرات المشاهدة المباشرة.
                    </p>

                    {/* Quick Counters */}
                    <div className="flex flex-wrap items-center gap-2 pt-3">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                            الإجمالي: <strong className="text-white">{counts.total}</strong>
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                            مسلسلات: <strong className="text-red-400">{counts.tv}</strong>
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                            أفلام: <strong className="text-amber-400">{counts.movies}</strong>
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                            مميز بالسلايدر: <strong className="text-yellow-400">{counts.featured}</strong>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/slider"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all"
                    >
                        <Sparkles size={16} className="text-amber-400" />
                        <span>ترتيب السلايدر</span>
                    </Link>

                    <Link
                        href="/admin/animes/new"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                    >
                        <Plus size={18} />
                        <span>إضافة عمل جديد</span>
                    </Link>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="ابحث باسم العمل، التصنيف، أو الكلمات المفتاحية..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    {/* Sort Selector */}
                    <div className="flex items-center gap-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-300 focus:outline-none focus:border-red-500 cursor-pointer"
                        >
                            <option value="recent">الأحدث تحديثاً</option>
                            <option value="title">الترتيب الأبجدي (أ-ي)</option>
                            <option value="episodes">الأكثر حلقات</option>
                        </select>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    <button
                        onClick={() => setSelectedFilter("all")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            selectedFilter === "all"
                                ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                                : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
                        }`}
                    >
                        الكل ({counts.total})
                    </button>

                    <button
                        onClick={() => setSelectedFilter("tv")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            selectedFilter === "tv"
                                ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                                : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
                        }`}
                    >
                        مسلسلات ({counts.tv})
                    </button>

                    <button
                        onClick={() => setSelectedFilter("movie")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            selectedFilter === "movie"
                                ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                                : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
                        }`}
                    >
                        أفلام ({counts.movies})
                    </button>

                    <button
                        onClick={() => setSelectedFilter("featured")}
                        className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            selectedFilter === "featured"
                                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                                : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
                        }`}
                    >
                        <Star size={13} className="text-yellow-400 fill-yellow-400" />
                        <span>مميز بالسلايدر ({counts.featured})</span>
                    </button>

                    <button
                        onClick={() => setSelectedFilter("ongoing")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            selectedFilter === "ongoing"
                                ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                                : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
                        }`}
                    >
                        مستمر ({counts.ongoing})
                    </button>

                    <button
                        onClick={() => setSelectedFilter("completed")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            selectedFilter === "completed"
                                ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                                : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
                        }`}
                    >
                        مكتمل ({counts.total - counts.ongoing})
                    </button>
                </div>
            </div>

            {/* Empty State */}
            {filteredAnimes.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
                        <Tv size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                        لم يتم العثور على أي عمل
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mb-6">
                        {searchQuery 
                            ? `لا توجد نتائج مطابقة لبحثك عن "${searchQuery}". جرب كلمات أخرى أو قم بإلغاء الفلاتر.`
                            : "لا توجد أعمال مضافة في هذه الفئة حالياً. يمكنك إضافة عمل جديد بسهولة."}
                    </p>
                    {searchQuery ? (
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedFilter("all"); }}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                        >
                            إعادة ضبط البحث
                        </button>
                    ) : (
                        <Link
                            href="/admin/animes/new"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-colors"
                        >
                            <Plus size={16} />
                            <span>إضافة عمل جديد</span>
                        </Link>
                    )}
                </div>
            ) : (
                /* Anime Cards Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredAnimes.map((anime) => {
                        const isOngoing = anime.status?.toLowerCase() === "ongoing" || anime.status === "مستمر";
                        const isMovie = anime.type?.toLowerCase().includes("movie") || anime.type?.includes("فيلم");

                        return (
                            <div 
                                key={anime.id} 
                                className="group relative rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60"
                            >
                                {/* Media Banner Header */}
                                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                                    <img
                                        src={anime.coverImage || anime.bannerImage || "/hero-bg.jpg"}
                                        alt={anime.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                                    {/* Badges on Top */}
                                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/10">
                                                {anime.type || "TV Series"}
                                            </span>

                                            {anime.isFeatured && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/90 text-black backdrop-blur-md shadow-md">
                                                    <Star size={10} className="fill-black" />
                                                    مميز
                                                </span>
                                            )}
                                        </div>

                                        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold backdrop-blur-md ${
                                            isOngoing 
                                                ? "bg-sky-500/20 text-sky-300 border border-sky-400/30" 
                                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${isOngoing ? "bg-sky-400 animate-pulse" : "bg-emerald-400"}`} />
                                            {isOngoing ? "مستمر" : "مكتمل"}
                                        </span>
                                    </div>

                                    {/* Bottom Info on Poster */}
                                    <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between">
                                        <div className="flex items-center gap-2 text-[11px] text-slate-300 font-bold bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                                            <Film size={12} className="text-red-400" />
                                            <span>{anime.totalEpisodes ? `${anime.totalEpisodes} حلقة` : "فيلم كامل"}</span>
                                        </div>

                                        {anime.releaseYear && (
                                            <span className="text-[10px] font-semibold text-slate-400 bg-black/50 px-2 py-0.5 rounded-md">
                                                {anime.releaseYear}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 group-hover:text-red-400 transition-colors line-clamp-1">
                                            {anime.title}
                                        </h3>

                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                                            {anime.description || "لا يوجد وصف مدخل لهذا العمل."}
                                        </p>

                                        {/* Genres pills */}
                                        {Array.isArray(anime.genres) && anime.genres.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {anime.genres.slice(0, 3).map((g, gIdx) => (
                                                    <span 
                                                        key={gIdx}
                                                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50"
                                                    >
                                                        {g}
                                                    </span>
                                                ))}
                                                {anime.genres.length > 3 && (
                                                    <span className="text-[10px] text-slate-500 self-center">
                                                        +{anime.genres.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                                        <Link
                                            href={`/admin/animes/${anime.id}`}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors group/btn"
                                        >
                                            <Edit size={14} className="text-slate-400 group-hover/btn:text-white transition-colors" />
                                            <span>إدارة وتعديل</span>
                                        </Link>

                                        <Link
                                            href={`/animes/${anime.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/50"
                                            title="معاينة في الموقع"
                                        >
                                            <ExternalLink size={15} />
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(anime.id, anime.title)}
                                            disabled={deletingId === anime.id}
                                            className="p-2 rounded-xl bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 transition-colors border border-rose-900/30 disabled:opacity-50"
                                            title="حذف العمل"
                                        >
                                            {deletingId === anime.id ? (
                                                <Loader2 size={15} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={15} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
