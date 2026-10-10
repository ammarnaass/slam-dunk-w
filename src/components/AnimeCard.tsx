"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Calendar, Film, Play, Sparkles } from "lucide-react";
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

    // Calculated rating fallback if 0
    const displayRating = anime.rating && anime.rating > 0 
        ? anime.rating.toFixed(1) 
        : (anime.id === "slam-dunk" ? "4.9" : "4.8");

    // Status label and color
    const isCompleted = anime.status?.toLowerCase() === "completed" || anime.status === "مكتمل";

    // Format genres in Arabic
    const genresList = (anime.genres || []).map(g => GENRE_TRANSLATIONS[g] || g);

    return (
        <Link
            href={`/animes/${anime.id}`}
            aria-label={`مشاهدة تفاصيل ${anime.title}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800/80 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_36px_-8px_rgba(220,38,38,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
            {/* Top subtle highlight hairline */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none" />

            {/* Poster container with 2:3 ratio */}
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
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
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                />

                {/* Multi-tier dark gradient overlay for deep contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-60" />

                {/* Top badges bar */}
                <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10 pointer-events-none">
                    {/* Rating badge */}
                    <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-lg text-xs font-bold shadow-md">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span>{displayRating}</span>
                    </div>

                    {/* Anime Type Badge */}
                    <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-200 px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wide shadow-md">
                        <span>{anime.type || "TV Series"}</span>
                    </div>
                </div>

                {/* Status indicator badge (pill on bottom-right of poster) */}
                <div className="absolute bottom-3 right-3 z-10 pointer-events-none flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-300">
                    <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-sky-400 animate-pulse shadow-[0_0_6px_rgba(56,189,248,0.8)]"}`} />
                    <span>{isCompleted ? "مكتمل" : "مستمر"}</span>
                </div>

                {/* Quality pill */}
                <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
                    <span className="bg-red-600/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider shadow">
                        FHD
                    </span>
                </div>

                {/* Interactive Center Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 bg-slate-950/40 backdrop-blur-[2px]">
                    <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-[0_0_30px_rgba(220,38,38,0.6)] transform scale-75 group-hover:scale-100 transition-all duration-300">
                        <Play size={24} className="fill-white translate-x-[-1px]" />
                        <span className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-25" />
                    </div>
                </div>

                {/* Description snippet preview on desktop hover */}
                {anime.description && (
                    <div className="absolute inset-x-2.5 bottom-12 z-10 hidden md:block opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                        <p className="text-[11px] text-slate-300 line-clamp-2 bg-slate-950/85 backdrop-blur-md p-2 rounded-lg border border-white/10 leading-relaxed shadow-lg">
                            {anime.description}
                        </p>
                    </div>
                )}
            </div>

            {/* Information container below poster */}
            <div className="flex flex-col p-3.5 sm:p-4 flex-1 justify-between gap-2.5 bg-slate-900/60">
                <div>
                    {/* Genre Tags */}
                    {genresList.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            {genresList.slice(0, 2).map((genre, idx) => (
                                <span
                                    key={idx}
                                    className="text-[10px] font-medium text-slate-400 bg-slate-800/80 border border-slate-700/50 px-1.5 py-0.5 rounded"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Anime Title */}
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 leading-snug">
                        {anime.title}
                    </h3>
                </div>

                {/* Meta details footer */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                        <Calendar size={12} className="text-red-500" />
                        <span>{anime.releaseYear || "1993"}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                        <Film size={12} className="text-red-500" />
                        <span>{anime.totalEpisodes ? `${anime.totalEpisodes} حلقة` : "كامل الحلقات"}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
