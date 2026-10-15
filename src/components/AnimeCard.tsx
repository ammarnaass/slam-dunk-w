"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Film, Play, Sparkles, Volume2 } from "lucide-react";
import { Anime } from "@/types";

interface AnimeCardProps {
    anime: Anime;
    priority?: boolean;
}

const GENRE_TRANSLATIONS: Record<string, string> = {
    Sports: "رياضة",
    Comedy: "كوميديا",
    School: "مدرسي",
    Shounen: "شونين",
    Action: "أكشن",
    Mystery: "غموض",
    Drama: "دراما",
    Adventure: "مغامرات",
    Fantasy: "فانتازيا",
    Romance: "رومانسي",
    Supernatural: "خارق للطبيعة",
};

export default function AnimeCard({ anime, priority = false }: AnimeCardProps) {
    const [imgSrc, setImgSrc] = useState(anime.coverImage || "/hero-bg.jpg");
    const [isImgError, setIsImgError] = useState(false);

    // Calculated rating fallback
    const displayRating = anime.rating && anime.rating > 0 
        ? anime.rating.toFixed(1) 
        : (anime.id === "slam-dunk" ? "4.9" : "4.8");

    // Status label
    const isCompleted = anime.status?.toLowerCase() === "completed" || anime.status === "مكتمل";

    // Format genres in Arabic
    const genresList = (anime.genres || []).map(g => GENRE_TRANSLATIONS[g] || g);

    return (
        <Link
            href={`/animes/${anime.id}`}
            aria-label={`مشاهدة ${anime.title}`}
            className="group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-[#15151c] border border-white/[0.05] hover:border-[#dc2626]/50 transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] hover:shadow-[0_12px_32px_-6px_rgba(220,38,38,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]"
        >
            {/* Poster container with 2:3 ratio */}
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0b0b0f]">
                <img
                    src={imgSrc}
                    alt={anime.title}
                    loading={priority ? "eager" : "lazy"}
                    onError={() => {
                        if (!isImgError) {
                            setIsImgError(true);
                            setImgSrc("/hero-bg.jpg");
                        }
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-106"
                />

                {/* Dark Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#15151c] via-[#15151c]/30 to-transparent opacity-90 transition-opacity group-hover:opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-60" />

                {/* Top Badges */}
                <div className="absolute top-2 inset-x-2 sm:top-2.5 sm:inset-x-2.5 flex items-center justify-between z-10 pointer-events-none">
                    {/* Rating badge with amber gold */}
                    <div className="flex items-center gap-1 bg-[#15151c]/85 backdrop-blur-md border border-[#f59e0b]/30 text-[#f59e0b] px-1.5 sm:px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold shadow-md">
                        <Star size={11} className="fill-[#f59e0b] text-[#f59e0b]" />
                        <span>{displayRating}</span>
                    </div>

                    {/* Quality badge */}
                    <div className="bg-[#dc2626]/90 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-black px-1.5 sm:px-2 py-0.5 rounded-full tracking-wider shadow">
                        4K UHD
                    </div>
                </div>

                {/* Bottom Badges Strip on Poster */}
                <div className="absolute bottom-2 inset-x-2 sm:bottom-2.5 sm:inset-x-2.5 flex items-center justify-between z-10 pointer-events-none">
                    <span className="flex items-center gap-1 bg-black/75 backdrop-blur-md border border-white/10 text-[#e4e1e7] text-[9px] sm:text-[10px] font-tajawal font-medium px-1.5 sm:px-2 py-0.5 rounded-md">
                        <Volume2 size={10} className="text-[#ffb95f]" />
                        <span>مدبلج</span>
                    </span>

                    <span className="flex items-center gap-1 bg-black/75 backdrop-blur-md border border-white/10 px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium text-[#e4e1e7]">
                        <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-emerald-400" : "bg-[#dc2626] animate-pulse"}`} />
                        <span>{isCompleted ? "مكتمل" : "مستمر"}</span>
                    </span>
                </div>

                {/* Hover Play Button Glow */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 bg-black/35 backdrop-blur-[2px]">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#dc2626] text-white shadow-[0_0_24px_rgba(220,38,38,0.7)] transform scale-80 group-hover:scale-100 transition-all duration-300">
                        <Play size={20} className="fill-white translate-x-[-1px]" />
                    </div>
                </div>
            </div>

            {/* Content Details */}
            <div className="p-2.5 sm:p-3.5 flex flex-col justify-between flex-grow bg-[#15151c]">
                <h3 className="font-cairo font-bold text-xs sm:text-sm text-[#e4e1e7] group-hover:text-white group-hover:text-[#ffb4ab] transition-colors line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem] leading-snug">
                    {anime.title}
                </h3>

                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-tajawal text-[#94a3b8] mt-1.5 sm:mt-2">
                    <span className="truncate max-w-[90px] sm:max-w-[110px]">
                        {genresList[0] || anime.type || "أنمي"}
                    </span>
                    <span className="text-[#94a3b8] font-mono shrink-0">
                        {anime.releaseYear || (anime.totalEpisodes ? `${anime.totalEpisodes} حلقة` : "سبيستون")}
                    </span>
                </div>
            </div>
        </Link>
    );
}
