"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Anime } from "@/types";

interface AnimeHeroSectionProps {
    anime: Anime;
    firstEpisodeId?: string;
    isInWatchlist: boolean;
    toggling: boolean;
    onWatchlistToggle: () => void;
    onCopyShare: () => void;
}

export function AnimeHeroSection({
    anime,
    firstEpisodeId,
    isInWatchlist,
    toggling,
    onWatchlistToggle,
    onCopyShare,
}: AnimeHeroSectionProps) {
    const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
    const ratingVal = anime.rating ? Number(anime.rating).toFixed(1) : "9.8";

    return (
        <section className="relative w-full overflow-hidden border-b border-white/[0.06]">
            {/* Cinematic Background Backdrop */}
            <div className="absolute inset-0 z-0">
                <img
                    src={(anime.bannerImage || (anime as any).backdropImage) || anime.coverImage || "/hero-bg.jpg"}
                    alt={anime.title}
                    className="w-full h-full object-cover object-top opacity-20 filter blur-md scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-gutter-lg pt-space-2xl pb-space-xl">
                {/* Breadcrumbs Navigation */}
                <div className="flex items-center gap-space-sm text-on-surface-variant font-label-md text-label-md mb-space-lg">
                    <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
                    <span>/</span>
                    <Link href="/animes" className="hover:text-primary transition-colors">المكتبة</Link>
                    <span>/</span>
                    <span className="text-on-surface font-semibold truncate max-w-[200px] sm:max-w-none">{anime.title}</span>
                </div>

                {/* Hero Showcase Grid */}
                <div className="flex flex-col lg:flex-row items-start gap-space-xl">
                    
                    {/* RTL Right: Poster Card */}
                    <div className="flex-shrink-0 w-full max-w-[280px] sm:max-w-[320px] mx-auto lg:mx-0 group">
                        <div className="relative rounded-2xl overflow-hidden bg-surface-container-low shadow-[0_16px_40px_rgba(0,0,0,0.8)] border border-white/[0.08] transition-all duration-300 group-hover:shadow-[0_20px_50px_rgba(220,38,38,0.25)] group-hover:-translate-y-1">
                            <img
                                src={anime.coverImage || "/hero-bg.jpg"}
                                alt={anime.title}
                                className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Top Badges */}
                            <div className="absolute top-space-md inset-x-space-md flex items-center justify-between">
                                <span className="px-space-sm py-1 rounded-full bg-surface-container-high/90 backdrop-blur-md font-label-sm text-label-sm text-on-surface flex items-center gap-1 shadow-md">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    {anime.status || "مستمر"}
                                </span>
                                <span className="px-space-sm py-1 rounded-full bg-primary-container/90 backdrop-blur-md text-on-primary-container font-label-sm text-label-sm font-black shadow-md">
                                    ULTRA HD 4K
                                </span>
                            </div>

                            {/* Bottom Strip */}
                            <div className="absolute bottom-0 inset-x-0 p-space-md bg-gradient-to-t from-surface-container-lowest to-transparent flex items-center justify-between">
                                <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                                    دبلجة يابانية + عربية
                                </span>
                                <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                                    24m/حلقة
                                </span>
                            </div>
                        </div>

                        {/* PWA Fast Streaming Hint */}
                        <div className="mt-space-md p-space-sm rounded-xl bg-surface-container-low/70 backdrop-blur-sm flex items-center justify-center gap-space-sm text-on-surface-variant text-center border border-white/5 shadow-inner">
                            <span className="material-symbols-outlined text-secondary text-[18px]">bolt</span>
                            <span className="font-label-sm text-label-sm">متاح للبث التكيفي السريع 1080p / 4K</span>
                        </div>
                    </div>

                    {/* RTL Left: Details & Actions */}
                    <div className="flex-1 flex flex-col gap-space-lg w-full text-right">
                        {/* Badges & Titles */}
                        <div className="flex flex-col gap-space-xs">
                            <div className="flex items-center gap-space-sm flex-wrap">
                                <span className="font-label-md text-label-md text-secondary tracking-widest uppercase bg-secondary-container/20 px-space-sm py-0.5 rounded">
                                    العرض الحصري لموسم الأنمي
                                </span>
                                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                                    استوديو {(anime as any).studio || "Toei Animation"} • ترخيص رسمي
                                </span>
                            </div>
                            <h1 className="font-headline-hero text-headline-hero text-on-surface font-extrabold tracking-tight mt-1">
                                {anime.title}
                            </h1>
                            <div className="flex items-center gap-space-md text-on-surface-variant font-label-md text-label-md pt-1">
                                <span className="font-bold tracking-widest text-primary">スラムダンク • 作品</span>
                                <span>•</span>
                                <span className="font-medium tracking-wide">ANIME DAZE Exclusive Remaster</span>
                            </div>
                        </div>

                        {/* Metadata Badges Strip */}
                        <div className="flex flex-wrap items-center gap-space-sm">
                            <div className="flex items-center gap-1.5 px-space-md py-1.5 rounded-xl bg-secondary-container/25 text-secondary shadow-sm">
                                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="font-headline-sm text-headline-sm leading-none font-bold">{ratingVal}</span>
                                <span className="font-label-sm text-label-sm text-on-surface-variant pr-1 font-normal">(تقييم الجمهور)</span>
                            </div>
                            <div className="px-space-md py-1.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md">
                                {anime.releaseYear || "2024"}
                            </div>
                            <div className="px-space-md py-1.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                                +16 (إثارة وشونين)
                            </div>
                            <div className="px-space-md py-1.5 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md">
                                {anime.totalEpisodes ? `${anime.totalEpisodes} حلقة` : "كامل"}
                            </div>
                        </div>

                        {/* Genres Row */}
                        <div className="flex flex-wrap items-center gap-space-xs">
                            <span className="px-space-md py-1.5 rounded-full bg-primary-container/20 text-primary font-label-md text-label-md flex items-center gap-1.5 border border-primary-container/30">
                                <span className="material-symbols-outlined text-[16px]">public</span>
                                <span>كوكب الرياضة والأكشن</span>
                            </span>
                            {(anime.genres || []).map((genre) => (
                                <span key={genre} className="px-space-md py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-all font-label-md text-label-md">
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* Story Synopsis */}
                        <div className="p-space-lg rounded-2xl bg-surface-container-low/60 border border-white/[0.05] flex flex-col gap-space-xs">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">ملخص القصة الرسمية:</h3>
                            <p className={`font-body-lg text-body-lg text-on-surface-variant leading-relaxed transition-all ${isSynopsisExpanded ? "" : "line-clamp-3"}`}>
                                {anime.description || "ملحمة رياضية شيقة تروي حكاية الشغف، التحدي، وروح الفريق في الطريق نحو قمة البطولة الوطنية..."}
                            </p>
                            <button
                                onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
                                className="self-start text-primary font-label-md text-label-md font-bold mt-1 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <span>{isSynopsisExpanded ? "عرض أقل" : "عرض المزيد"}</span>
                                <span className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${isSynopsisExpanded ? "rotate-180" : ""}`}>
                                    expand_more
                                </span>
                            </button>
                        </div>

                        {/* CTA Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-space-md pt-space-xs w-full">
                            {firstEpisodeId ? (
                                <Link
                                    href={`/watch/${firstEpisodeId}`}
                                    className="relative group flex items-center justify-center gap-space-sm px-space-xl py-3.5 sm:py-space-md min-h-[48px] rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-bold shadow-[0_8px_24px_rgba(220,38,38,0.4)] hover:brightness-110 active:scale-95 transition-all text-center"
                                >
                                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                    <span>ابدأ المشاهدة (الحلقة 1)</span>
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="px-space-xl py-3.5 sm:py-space-md min-h-[48px] rounded-xl bg-surface-container-high text-on-surface-variant font-headline-sm text-center"
                                >
                                    الحلقات قادمة قريباً
                                </button>
                            )}

                            <div className="flex items-center gap-2.5 sm:gap-space-md">
                                <button
                                    onClick={onWatchlistToggle}
                                    disabled={toggling}
                                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-space-xs px-space-md py-3 sm:py-space-md min-h-[48px] rounded-xl font-label-md text-label-md transition-all border cursor-pointer active:scale-95 ${
                                        isInWatchlist 
                                            ? "bg-primary-container/20 border-primary-container text-primary" 
                                            : "bg-surface-container-low hover:bg-surface-container-high border-white/[0.08] text-on-surface-variant hover:text-on-surface"
                                    }`}
                                >
                                    <span 
                                        className={`material-symbols-outlined text-[20px] ${isInWatchlist ? "text-primary-container" : ""}`}
                                        style={{ fontVariationSettings: isInWatchlist ? "'FILL' 1" : "'FILL' 0" }}
                                    >
                                        favorite
                                    </span>
                                    <span>{isInWatchlist ? "في المفضلة ❤️" : "أضف للمفضلة"}</span>
                                </button>

                                <button
                                    onClick={onCopyShare}
                                    className="flex items-center justify-center w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-white/[0.08] text-on-surface-variant hover:text-on-surface transition-all active:scale-95 cursor-pointer shrink-0"
                                    title="مشاركة الرابط"
                                    aria-label="مشاركة رابط العمل"
                                >
                                    <span className="material-symbols-outlined text-[20px]">share</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
