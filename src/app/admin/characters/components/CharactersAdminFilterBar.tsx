import { Search, X, Film, Filter } from "lucide-react";
import { Character, Anime } from "@/types";

interface CharactersAdminFilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedAnime: string;
    onAnimeChange: (value: string) => void;
    selectedRole: string;
    onRoleChange: (value: string) => void;
    characters: Character[];
    animes: Anime[];
}

export default function CharactersAdminFilterBar({
    searchTerm,
    onSearchChange,
    selectedAnime,
    onAnimeChange,
    selectedRole,
    onRoleChange,
    characters,
    animes,
}: CharactersAdminFilterBarProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                    type="text"
                    placeholder="ابحث باسم الشخصية (عربي/إنجليزي/ياباني)، الفصيل، أو الدور..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
                    >
                        <X size={15} />
                    </button>
                )}
            </div>

            {/* Anime Filter */}
            <div className="md:col-span-3">
                <div className="relative">
                    <select
                        value={selectedAnime}
                        onChange={(e) => onAnimeChange(e.target.value)}
                        className="w-full appearance-none bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 transition-all cursor-pointer"
                    >
                        <option value="all">كل الأعمال والأنميات ({characters.length})</option>
                        {animes.map(anime => {
                            const count = characters.filter(c => c.animeId === anime.id).length;
                            return (
                                <option key={anime.id} value={anime.id}>
                                    {anime.title} ({count})
                                </option>
                            );
                        })}
                    </select>
                    <Film size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
            </div>

            {/* Role Filter */}
            <div className="md:col-span-3">
                <div className="relative">
                    <select
                        value={selectedRole}
                        onChange={(e) => onRoleChange(e.target.value)}
                        className="w-full appearance-none bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 transition-all cursor-pointer"
                    >
                        <option value="all">كل الأدوار الدرامية</option>
                        <option value="بطل">أبطال رئيسيون</option>
                        <option value="مساند">شخصيات مساندة</option>
                        <option value="خصم">خصوم ومنافسون</option>
                        <option value="شرير">أشرار ومنظمات</option>
                    </select>
                    <Filter size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
