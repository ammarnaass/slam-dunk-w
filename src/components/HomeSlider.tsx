"use client";

import { useState, useEffect } from "react";
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
    Fantasy: "خيال مظلم",
};

export default function HomeSlider({ animes }: HomeSliderProps) {
    const [current, setCurrent] = useState(0);

    // Filter or slice to top featured slides (up to 5)
    const featuredSlides = animes && animes.length > 0 ? animes.slice(0, 5) : [];

    useEffect(() => {
        if (featuredSlides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % featuredSlides.length);
        }, 7500);
        return () => clearInterval(timer);
    }, [featuredSlides.length]);

    if (featuredSlides.length === 0) return null;

    const activeAnime = featuredSlides[current] || featuredSlides[0];
    const genresList = (activeAnime?.genres || []).map(g => GENRE_TRANSLATIONS[g] || g);
    const displayRating = activeAnime?.rating && activeAnime.rating > 0 
        ? activeAnime.rating.toFixed(1) 
        : (activeAnime?.id === "slam-dunk" ? "4.9" : "9.2");

    return (
        <section className="relative w-full overflow-hidden bg-surface-container-lowest -mt-20">
            {/* Slider Master Container */}
            <div className="relative w-full min-h-[520px] sm:min-h-[620px] lg:min-h-[760px] lg:h-[840px] flex items-end">
                {/* Background Slides */}
                {featuredSlides.map((anime, index) => {
                    const isActive = index === current;
                    return (
                        <div
                            key={anime.id}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out ${
                                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                            }`}
                        >
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-105"
                                style={{
                                    backgroundImage: `url('${anime.bannerImage || anime.coverImage || "/hero-bg.jpg"}')`,
                                }}
                            />
                            {/* Multi-layer Vignette Gradients for Legibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/70 to-surface-container-lowest/30" />
                            <div className="absolute inset-0 bg-gradient-to-l from-surface-container-lowest/90 via-surface-container-lowest/40 to-transparent" />
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-surface-container-lowest/20 to-surface-container-lowest/80" />
                        </div>
                    );
                })}

                {/* Hero Content Foreground */}
                <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 pt-24 sm:pt-36">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-gutter-lg items-end">
                        
                        {/* Text & Meta Info (Columns 1-8) */}
                        <div className="lg:col-span-8 flex flex-col gap-3 sm:gap-space-md text-right">
                            {/* Badges Row */}
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-space-xs">
                                <span className="inline-flex items-center gap-1 px-2.5 sm:px-space-md py-0.5 sm:py-1 rounded-full bg-secondary-container/20 text-secondary font-label-md text-xs sm:text-label-md">
                                    <span className="material-symbols-outlined text-xs sm:text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    {displayRating}
                                </span>
                                <span className="px-2.5 sm:px-space-md py-0.5 sm:py-1 rounded-full bg-surface-container-high text-on-surface font-label-md text-xs sm:text-label-md">
                                    4K UHD
                                </span>
                                <span className="px-2.5 sm:px-space-md py-0.5 sm:py-1 rounded-full bg-primary-container text-on-primary-container font-label-md text-xs sm:text-label-md shadow-[0_0_12px_rgba(220,38,38,0.5)]">
                                    حصري VIP
                                </span>
                                <span className="px-2.5 sm:px-space-md py-0.5 sm:py-1 rounded-full bg-surface-container-high/80 text-on-surface-variant font-label-md text-xs sm:text-label-md">
                                    {activeAnime.totalEpisodes ? `${activeAnime.totalEpisodes} حلقة` : "كامل"}
                                </span>
                                <span className="hidden sm:inline-flex px-space-md py-1 rounded-full bg-surface-container-high/60 text-on-surface-variant font-label-md text-label-md">
                                    {genresList.slice(0, 3).join(" • ") || "أكشن • خيال • مغامرات"}
                                </span>
                            </div>

                            {/* Title & Trending Tag */}
                            <div className="space-y-1">
                                <p className="font-headline-sm text-xs sm:text-headline-sm text-primary tracking-wider uppercase font-bold flex items-center gap-1.5 sm:gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                                    العرض الأكثر رواجاً عالمياً
                                </p>
                                <h1 className="font-cairo font-black text-2xl sm:text-4xl lg:text-5xl text-on-surface tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] leading-tight">
                                    {activeAnime.title}
                                </h1>
                            </div>

                            {/* Synopsis Preview */}
                            <p className="font-body-md text-xs sm:text-body-lg text-on-surface-variant max-w-2xl leading-relaxed drop-shadow line-clamp-2 sm:line-clamp-3">
                                {activeAnime.description || "شاهد أحدث حلقات هذا العمل الملحمي بدقة 4K فائقة مع ترجمة ودبلجة احترافية وبدون فواصل إعلانية عبر سيرفرات البث السريع."}
                            </p>

                            {/* Metadata Row */}
                            <div className="hidden sm:flex flex-wrap items-center gap-space-lg text-body-sm text-on-surface-variant pt-space-xs">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base text-secondary">movie</span> 
                                    استوديو {(activeAnime as any).studio || "Toei / MAPPA"}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base text-primary">translate</span> 
                                    ترجمة عربية احترافية + دبلجة
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base text-secondary">schedule</span> 
                                    24 دقيقة / حلقة
                                </span>
                            </div>

                            {/* CTA Actions */}
                            <div className="flex flex-wrap items-center gap-2.5 sm:gap-space-md pt-2 sm:pt-space-sm">
                                <Link
                                    href={`/animes/${activeAnime.id}`}
                                    className="group flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-space-xl py-3 rounded-xl bg-primary-container text-on-primary-container font-cairo font-bold text-sm sm:text-base hover:brightness-110 transition-all shadow-[0_0_24px_rgba(220,38,38,0.45)] hover:shadow-[0_0_36px_rgba(220,38,38,0.7)] active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-xl sm:text-2xl group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        play_arrow
                                    </span>
                                    <span>شاهد الآن</span>
                                </Link>
                                <Link
                                    href="/pricing"
                                    className="flex items-center justify-center gap-1.5 px-4 sm:px-space-lg py-3 rounded-xl bg-surface-container-high/90 hover:bg-surface-container-highest text-on-surface font-cairo font-bold text-xs sm:text-sm transition-all hover:shadow-lg active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-base sm:text-lg text-secondary">workspace_premium</span>
                                    <span>ترقية VIP</span>
                                </Link>
                                <Link
                                    href={`/animes/${activeAnime.id}`}
                                    className="hidden xs:flex items-center justify-center gap-1.5 px-3.5 sm:px-space-md py-3 rounded-xl bg-surface-container-low/80 hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-cairo font-medium text-xs sm:text-sm transition-all"
                                >
                                    <span className="material-symbols-outlined text-base sm:text-lg">info</span>
                                    <span>التفاصيل</span>
                                </Link>
                            </div>

                            {/* Mobile / Tablet Pagination Dots */}
                            {featuredSlides.length > 1 && (
                                <div className="flex lg:hidden items-center gap-2 pt-3">
                                    {featuredSlides.map((_, dotIdx) => (
                                        <button
                                            key={dotIdx}
                                            onClick={() => setCurrent(dotIdx)}
                                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                                dotIdx === current 
                                                    ? "w-7 bg-[#dc2626] shadow-[0_0_8px_rgba(220,38,38,0.8)]" 
                                                    : "w-2 bg-white/20 hover:bg-white/40"
                                            }`}
                                            aria-label={`الشريحة ${dotIdx + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mini Previews / Slider Thumbs (Columns 9-12) */}
                        <div className="hidden lg:flex lg:col-span-4 flex-col gap-space-sm bg-surface-container-low/80 backdrop-blur-xl p-space-md rounded-2xl shadow-2xl border border-white/[0.05]">
                            <div className="flex items-center justify-between pb-space-xs">
                                <span className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-primary text-base">auto_awesome</span>
                                    أبرز اختيارات الأسبوع
                                </span>
                                <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm font-mono">
                                    <span className="text-primary font-bold">0{current + 1}</span>
                                    <span>/</span>
                                    <span>0{featuredSlides.length}</span>
                                </div>
                            </div>

                            {/* Mini Thumbs */}
                            <div className="flex flex-col gap-2">
                                {featuredSlides.slice(0, 3).map((slide, idx) => {
                                    const isSlideActive = idx === current;
                                    return (
                                        <button
                                            key={slide.id}
                                            onClick={() => setCurrent(idx)}
                                            className={`flex items-center gap-space-sm p-space-xs rounded-xl text-right w-full transition-all cursor-pointer border ${
                                                isSlideActive
                                                    ? "bg-surface-container-high border-primary-container/40 shadow-[0_0_16px_rgba(220,38,38,0.25)] text-on-surface"
                                                    : "bg-surface-container/50 border-transparent hover:bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface"
                                            }`}
                                        >
                                            <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 relative bg-surface-container-highest">
                                                <img
                                                    src={slide.coverImage || slide.bannerImage || "/hero-bg.jpg"}
                                                    alt={slide.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                {isSlideActive && (
                                                    <div className="absolute inset-0 bg-primary-container/20" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 pr-1">
                                                <h4 className="font-label-md text-label-md text-on-surface truncate font-bold">
                                                    {slide.title}
                                                </h4>
                                                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                                                    {slide.totalEpisodes ? `${slide.totalEpisodes} حلقة` : "حصري جديد"}
                                                </p>
                                            </div>
                                            {isSlideActive && (
                                                <span className="material-symbols-outlined text-primary text-base shrink-0 animate-pulse">
                                                    graphic_eq
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
