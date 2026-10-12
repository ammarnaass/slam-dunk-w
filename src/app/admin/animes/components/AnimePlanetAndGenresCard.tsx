"use client";

import { useState } from "react";
import { SPACETOON_PLANETS, POPULAR_GENRES, SpacetoonPlanetOption } from "@/lib/anime-presets";
import { Plus, X } from "lucide-react";

interface AnimePlanetAndGenresCardProps {
    currentPlanet?: string;
    genres: string[];
    ageRating?: string;
    onChangeField: (field: string, value: any) => void;
}

export default function AnimePlanetAndGenresCard({
    currentPlanet = "مغامرات",
    genres,
    ageRating = "+16",
    onChangeField,
}: AnimePlanetAndGenresCardProps) {
    const [customGenre, setCustomGenre] = useState("");

    const handleToggleGenre = (genre: string) => {
        if (genres.includes(genre)) {
            onChangeField("genres", genres.filter(g => g !== genre));
        } else {
            onChangeField("genres", [...genres, genre]);
        }
    };

    const handleAddCustomGenre = () => {
        const trimmed = customGenre.trim();
        if (trimmed && !genres.includes(trimmed)) {
            onChangeField("genres", [...genres, trimmed]);
            setCustomGenre("");
        }
    };

    return (
        <div className="bg-[#121217] rounded-2xl border border-white/[0.06] p-6 shadow-xl space-y-5 text-right">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-[#ffb95f] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">public</span>
                    </div>
                    <div>
                        <h3 className="font-cairo font-bold text-base text-white">كواكب سبيستون والتصنيفات</h3>
                        <p className="text-xs text-[#94a3b8]">ربط العمل بكوكب سبيستون الذهبي والوسوم التصنيفية</p>
                    </div>
                </div>
            </div>

            {/* 1. Spacetoon Planet Selector */}
            <div className="space-y-2">
                <label className="block text-xs font-bold text-[#e4e1e7]">
                    كوكب سبيستون التابع له العمل <span className="text-[#dc2626]">*</span>
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {SPACETOON_PLANETS.map((planet: SpacetoonPlanetOption) => {
                        const isSelected = currentPlanet === planet.id;
                        return (
                            <button
                                key={planet.id}
                                type="button"
                                onClick={() => onChangeField("planet", planet.id)}
                                className={`p-3 rounded-xl border text-right transition-all flex flex-col gap-1 cursor-pointer ${
                                    isSelected
                                        ? "bg-[#1f1a1c] border-[#dc2626] ring-1 ring-[#dc2626]/50 shadow-md scale-[1.02]"
                                        : "bg-[#181820] border-white/5 hover:border-white/15"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-lg">{planet.badge}</span>
                                    {isSelected && (
                                        <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse" />
                                    )}
                                </div>
                                <span className={`text-xs font-bold font-cairo ${isSelected ? "text-white" : "text-[#e4e1e7]"}`}>
                                    {planet.name}
                                </span>
                                <span className="text-[10px] text-[#94a3b8] line-clamp-1">
                                    {planet.description}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Popular Genres Chips Multi-Select */}
            <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#e4e1e7]">
                        وسوم التصنيف (Genres) ({genres.length} محددة)
                    </label>
                    <span className="text-[10px] text-[#ffb95f]">انقر للتبديل الفوري</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {POPULAR_GENRES.map((genre) => {
                        const isSelected = genres.includes(genre);
                        return (
                            <button
                                key={genre}
                                type="button"
                                onClick={() => handleToggleGenre(genre)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                                    isSelected
                                        ? "bg-[#dc2626] text-white border-[#dc2626] shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                                        : "bg-[#181820] text-[#94a3b8] border-white/5 hover:border-white/10 hover:text-white"
                                }`}
                            >
                                <span>{genre}</span>
                                {isSelected && <span className="text-[10px]">✓</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Custom Genre Adder */}
                <div className="flex items-center gap-2 pt-1.5">
                    <input
                        type="text"
                        value={customGenre}
                        onChange={(e) => setCustomGenre(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddCustomGenre();
                            }
                        }}
                        placeholder="أضف تصنيفاً إضافياً مخصصاً..."
                        className="flex-1 bg-[#181820] border border-white/5 focus:border-[#dc2626] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                    <button
                        type="button"
                        onClick={handleAddCustomGenre}
                        disabled={!customGenre.trim()}
                        className="px-3.5 py-2 rounded-xl bg-[#22222d] hover:bg-[#dc2626] text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
                    >
                        <Plus size={14} />
                        <span>إضافة</span>
                    </button>
                </div>

                {/* Selected Custom Tags Badges */}
                {genres.filter(g => !POPULAR_GENRES.includes(g)).length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                        {genres.filter(g => !POPULAR_GENRES.includes(g)).map((g) => (
                            <span
                                key={g}
                                className="px-2.5 py-1 rounded-md bg-[#252532] text-white text-xs font-bold flex items-center gap-1.5 border border-white/10"
                            >
                                <span>{g}</span>
                                <button
                                    type="button"
                                    onClick={() => handleToggleGenre(g)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. Age Rating Pills */}
            <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                <label className="block text-xs font-bold text-[#e4e1e7]">الفئة العمرية (Age Rating)</label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: "+16", label: "+16 (إثارة وشونين)" },
                        { id: "+13", label: "+13 (مراهقين)" },
                        { id: "all", label: "مناسب لجميع الأعمار (G)" },
                    ].map((rating) => {
                        const isSelected = ageRating === rating.id;
                        return (
                            <button
                                key={rating.id}
                                type="button"
                                onClick={() => onChangeField("ageRating", rating.id)}
                                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                                    isSelected
                                        ? "bg-red-600/20 border-[#dc2626] text-white shadow"
                                        : "bg-[#181820] border-white/5 text-[#94a3b8] hover:text-white"
                                }`}
                            >
                                {rating.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
