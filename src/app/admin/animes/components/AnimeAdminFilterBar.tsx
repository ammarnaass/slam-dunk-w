import { Search, X, Star } from "lucide-react";
import { AnimeFilterType, AnimeSortType } from "../hooks/useAdminAnimes";

interface AnimeAdminFilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: AnimeSortType;
    onSortChange: (sort: AnimeSortType) => void;
    selectedFilter: AnimeFilterType;
    onFilterChange: (filter: AnimeFilterType) => void;
    counts: {
        total: number;
        tv: number;
        movies: number;
        featured: number;
        ongoing: number;
    };
}

export default function AnimeAdminFilterBar({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    selectedFilter,
    onFilterChange,
    counts,
}: AnimeAdminFilterBarProps) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="ابحث باسم العمل، التصنيف، أو الكلمات المفتاحية..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
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
                        onChange={(e) => onSortChange(e.target.value as AnimeSortType)}
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
                    type="button"
                    onClick={() => onFilterChange("all")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        selectedFilter === "all"
                            ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                            : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
                    }`}
                >
                    الكل ({counts.total})
                </button>

                <button
                    type="button"
                    onClick={() => onFilterChange("tv")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        selectedFilter === "tv"
                            ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                            : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
                    }`}
                >
                    مسلسلات ({counts.tv})
                </button>

                <button
                    type="button"
                    onClick={() => onFilterChange("movie")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        selectedFilter === "movie"
                            ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                            : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
                    }`}
                >
                    أفلام ({counts.movies})
                </button>

                <button
                    type="button"
                    onClick={() => onFilterChange("featured")}
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
                    type="button"
                    onClick={() => onFilterChange("ongoing")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        selectedFilter === "ongoing"
                            ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                            : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
                    }`}
                >
                    مستمر ({counts.ongoing})
                </button>

                <button
                    type="button"
                    onClick={() => onFilterChange("completed")}
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
    );
}
