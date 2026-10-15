"use client";

import React from "react";
import Link from "next/link";
import { Episode } from "@/types";
import EpisodeCard from "@/components/EpisodeCard";

interface AnimeEpisodesSectionProps {
    episodes: Episode[];
    firstEpisodeId?: string;
    filterEpisodeType: "all" | "free" | "vip";
    setFilterEpisodeType: (type: "all" | "free" | "vip") => void;
}

export function AnimeEpisodesSection({
    episodes,
    firstEpisodeId,
    filterEpisodeType,
    setFilterEpisodeType,
}: AnimeEpisodesSectionProps) {
    const filteredEpisodes = episodes.filter((ep) => {
        if (filterEpisodeType === "free") return ep.episodeNumber <= 2;
        if (filterEpisodeType === "vip") return (ep as any).isVip || ep.episodeNumber > 2;
        return true;
    });

    return (
        <section className="w-full max-w-7xl mx-auto px-gutter-lg py-space-xl">
            {/* Header & Filter Controls */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg mb-space-xl">
                <div className="flex items-baseline gap-space-md">
                    <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold flex items-center gap-space-sm">
                        <span className="w-2.5 h-6 rounded-full bg-primary-container"></span>
                        قائمة الحلقات
                    </h2>
                    <span className="font-label-md text-label-md text-secondary bg-secondary-container/15 px-space-sm py-0.5 rounded-full">
                        {episodes.length} حلقة متوفرة
                    </span>
                </div>

                {/* Filter Tabs */}
                <div className="w-full lg:w-auto flex items-center overflow-x-auto scrollbar-none touch-pan-x bg-surface-container-low p-1 rounded-xl border border-white/[0.05]">
                    <button
                        onClick={() => setFilterEpisodeType("all")}
                        className={`flex-1 sm:flex-initial px-3 sm:px-space-md py-2 min-h-[44px] rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                            filterEpisodeType === "all" ? "bg-primary-container text-on-primary-container font-bold shadow" : "text-on-surface-variant hover:text-on-surface"
                        }`}
                    >
                        الكل ({episodes.length})
                    </button>
                    <button
                        onClick={() => setFilterEpisodeType("free")}
                        className={`flex-1 sm:flex-initial px-3 sm:px-space-md py-2 min-h-[44px] rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                            filterEpisodeType === "free" ? "bg-primary-container text-on-primary-container font-bold shadow" : "text-on-surface-variant hover:text-on-surface"
                        }`}
                    >
                        مجانية (أول حلقتين)
                    </button>
                    <button
                        onClick={() => setFilterEpisodeType("vip")}
                        className={`flex-1 sm:flex-initial px-3 sm:px-space-md py-2 min-h-[44px] rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                            filterEpisodeType === "vip" ? "bg-secondary-container text-on-secondary font-bold shadow" : "text-on-surface-variant hover:text-on-surface"
                        }`}
                    >
                        حصريات VIP
                    </button>
                </div>
            </div>

            {/* Resume Playback Banner */}
            {episodes.length > 0 && (
                <div className="mb-space-lg p-space-md rounded-2xl bg-gradient-to-r from-primary-container/20 via-surface-container to-surface-container-low border border-primary-container/30 flex flex-col sm:flex-row items-center justify-between gap-space-md shadow-lg">
                    <div className="flex items-center gap-space-md w-full sm:w-auto">
                        <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(220,38,38,0.5)]">
                            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                        </div>
                        <div className="text-right">
                            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">استئناف المشاهدة السريعة</h4>
                            <p className="font-body-md text-body-md text-on-surface-variant">
                                انقر للمتابعة الفورية من حيث توقفت بأعلى سرعة سيرفر سحابي
                            </p>
                        </div>
                    </div>
                    {firstEpisodeId && (
                        <Link
                            href={`/watch/${firstEpisodeId}`}
                            className="w-full sm:w-auto text-center inline-flex items-center justify-center min-h-[44px] px-space-lg py-2.5 rounded-xl bg-primary-container text-on-primary-container font-label-md text-label-md font-bold hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0"
                        >
                            تشغيل الآن
                        </Link>
                    )}
                </div>
            )}

            {/* Grid of Episode Cards */}
            {filteredEpisodes.length === 0 ? (
                <div className="text-center py-space-2xl bg-surface-container-low/40 rounded-2xl border border-white/[0.04]">
                    <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-space-sm">videocam_off</span>
                    <p className="font-headline-sm text-headline-sm text-on-surface-variant">
                        لا توجد حلقات مطابقة لهذا التصنيف حالياً
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md">
                    {filteredEpisodes.map((ep) => (
                        <EpisodeCard key={ep.id} episode={ep} />
                    ))}
                </div>
            )}
        </section>
    );
}
