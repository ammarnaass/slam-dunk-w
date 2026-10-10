"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Play, Info, Star, Film, Calendar, Flame } from "lucide-react";
import Link from "next/link";
import { Anime } from "@/types";

interface HomeSliderProps {
    animes: Anime[];
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
};

export default function HomeSlider({ animes }: HomeSliderProps) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (animes.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % animes.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [animes.length]);

    if (!animes || animes.length === 0) return null;

    const next = () => setCurrent((prev) => (prev + 1) % animes.length);
    const prev = () => setCurrent((prev) => (prev - 1 + animes.length) % animes.length);

    return (
        <section className="relative h-[85vh] min-h-[580px] max-h-[750px] w-full overflow-hidden bg-slate-950">
            {animes.map((anime, index) => {
                const isActive = index === current;
                const genresList = (anime.genres || []).map(g => GENRE_TRANSLATIONS[g] || g);
                const displayRating = anime.rating && anime.rating > 0 
                    ? anime.rating.toFixed(1) 
                    : (anime.id === "slam-dunk" ? "4.9" : "4.8");

                return (
                    <div
                        key={anime.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                            isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                        }`}
                    >
                        {/* Background Media Container */}
                        <div className="absolute inset-0 bg-slate-950">
                            <img
                                src={anime.bannerImage || anime.coverImage || "/hero-bg.jpg"}
                                alt={anime.title}
                                className={`h-full w-full object-cover object-center transition-transform duration-10000 ease-out ${
                                    isActive ? "scale-105" : "scale-100"
                                } opacity-50`}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/hero-bg.jpg";
                                }}
                            />

                            {/* Deep Cinema Gradients (Right to left for RTL reading, and bottom to top) */}
                            <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80" />
                        </div>

                        {/* Content Container */}
                        <div className="container relative mx-auto h-full px-4 flex flex-col justify-center">
                            <div className="max-w-2xl space-y-5">
                                {/* Badges Row */}
                                <div className="flex flex-wrap items-center gap-2.5">
                                    {/* Rating */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-amber-500/30 text-amber-400 text-xs font-bold backdrop-blur-md shadow-sm">
                                        <Star size={13} className="fill-amber-400 text-amber-400" />
                                        <span>{displayRating}</span>
                                    </div>

                                    {/* Type */}
                                    <span className="bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide shadow-sm shadow-red-600/30">
                                        {anime.type || "TV Series"}
                                    </span>

                                    {/* Year */}
                                    {anime.releaseYear && (
                                        <span className="inline-flex items-center gap-1 text-slate-300 text-xs font-semibold bg-slate-900/80 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
                                            <Calendar size={12} className="text-red-500" />
                                            {anime.releaseYear}
                                        </span>
                                    )}

                                    {/* Quality */}
                                    <span className="text-[10px] font-black uppercase text-red-400 bg-red-950/70 border border-red-800/50 px-2 py-0.5 rounded-md">
                                        FHD 1080p
                                    </span>
                                </div>

                                {/* Anime Title */}
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                                    {anime.title}
                                </h1>

                                {/* Synopsis */}
                                <p className="text-sm sm:text-base text-slate-300 line-clamp-3 md:line-clamp-4 leading-relaxed max-w-xl text-shadow-sm">
                                    {anime.description}
                                </p>

                                {/* Genre Tags */}
                                {genresList.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                        {genresList.slice(0, 4).map((genre, idx) => (
                                            <span 
                                                key={idx}
                                                className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 px-3 py-1 rounded-lg text-xs font-semibold"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* CTAs Buttons */}
                                <div className="flex flex-wrap items-center gap-3.5 pt-3">
                                    <Link
                                        href={`/animes/${anime.id}`}
                                        className="inline-flex items-center gap-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <Play size={18} className="fill-white translate-x-[-1px]" />
                                        <span>مشاهدة العمل</span>
                                    </Link>

                                    <Link
                                        href={`/animes/${anime.id}`}
                                        className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white px-5 py-3.5 rounded-xl font-bold text-sm border border-slate-700/80 transition-all hover:border-slate-500 backdrop-blur-md"
                                    >
                                        <Info size={16} />
                                        <span>تفاصيل القصة</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Slider Navigation Dots */}
            {animes.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 bg-slate-950/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    {animes.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            aria-label={`انتقال للشريحة ${index + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === current 
                                    ? "w-8 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" 
                                    : "w-2 bg-slate-700 hover:bg-slate-500"
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Prev / Next Chevrons */}
            {animes.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        aria-label="الشريحة السابقة"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 text-white hover:bg-red-600 hover:border-red-500 transition-all shadow-lg group hidden sm:flex items-center justify-center"
                    >
                        <ChevronLeft size={22} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={next}
                        aria-label="الشريحة التالية"
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 text-white hover:bg-red-600 hover:border-red-500 transition-all shadow-lg group hidden sm:flex items-center justify-center"
                    >
                        <ChevronRight size={22} className="group-hover:scale-110 transition-transform" />
                    </button>
                </>
            )}
        </section>
    );
}
