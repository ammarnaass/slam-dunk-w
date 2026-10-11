"use client";

import { useState, useEffect } from "react";
export const dynamic = "force-dynamic";
import EpisodeCard from "@/components/EpisodeCard";

export default function EpisodesPage() {
    const [episodes, setEpisodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAnime, setSelectedAnime] = useState<string>("all");

    useEffect(() => {
        fetch("/api/episodes")
            .then(res => res.json())
            .then(data => {
                setEpisodes(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredEpisodes = episodes.filter((episode) => {
        const titleMatch = (episode.title || "").toLowerCase().includes(searchTerm.toLowerCase());
        const descMatch = (episode.description || "").toLowerCase().includes(searchTerm.toLowerCase());
        const animeMatch = (episode.animeTitle || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearch = titleMatch || descMatch || animeMatch;
        const matchesAnime = selectedAnime === "all" || episode.animeId === selectedAnime;
        return matchesSearch && matchesAnime;
    });

    const uniqueAnimes = Array.from(new Set(episodes.map(e => JSON.stringify({ id: e.animeId, title: e.animeTitle }))))
        .map(s => JSON.parse(s))
        .filter(a => a.id && a.title);

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center justify-center gap-space-sm pt-20">
                <div className="w-12 h-12 rounded-full border-3 border-primary-container border-t-transparent animate-spin" />
                <span className="font-tajawal text-sm text-on-surface-variant font-bold">جاري تحميل دليل الحلقات...</span>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-surface-container-lowest text-on-surface font-body-md pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-gutter-lg">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl border-b border-white/[0.06] pb-space-lg">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-space-xs text-primary font-label-md text-label-md font-bold">
                            <span className="material-symbols-outlined text-[18px]">play_circle</span>
                            <span>أرشيف البث الرقمي</span>
                        </div>
                        <h1 className="font-headline-hero text-headline-hero font-extrabold text-on-surface tracking-tight">
                            دليل الحلقات المباشرة
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                            تصفح وشاهد أحدث الحلقات الصادرة بدقة 4K الفائقة وترجمة ودبلجة أصلية دون فواصل.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 px-space-md py-2 rounded-xl bg-surface-container-high border border-white/[0.06] text-secondary font-mono text-sm font-bold">
                        <span className="material-symbols-outlined text-base">video_library</span>
                        <span>{filteredEpisodes.length} حلقة متوفرة</span>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="bg-surface-container-low p-space-md rounded-2xl mb-space-xl border border-white/[0.06] shadow-lg">
                    <div className="flex flex-col md:flex-row gap-space-md">
                        <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="ابحث عن حلقة أو عمل..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-surface-container-lowest border border-white/[0.08] focus:border-primary-container rounded-xl py-3.5 pr-12 pl-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-all shadow-inner font-tajawal text-sm"
                            />
                        </div>

                        <select
                            value={selectedAnime}
                            onChange={(e) => setSelectedAnime(e.target.value)}
                            className="bg-surface-container-lowest border border-white/[0.08] focus:border-primary-container rounded-xl px-6 py-3.5 text-on-surface font-tajawal font-bold text-sm focus:outline-none transition-all cursor-pointer"
                        >
                            <option value="all">جميع الأعمال والمسلسلات</option>
                            {uniqueAnimes.map(anime => (
                                <option key={anime.id} value={anime.id}>{anime.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Episode Cards Grid */}
                {filteredEpisodes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
                        {filteredEpisodes.map((episode) => (
                            <EpisodeCard key={episode.id} episode={episode} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-28 bg-surface-container-low rounded-3xl border border-dashed border-white/[0.08] flex flex-col items-center justify-center gap-space-md">
                        <span className="material-symbols-outlined text-6xl text-on-surface-variant/40">smart_display</span>
                        <p className="font-headline-sm text-headline-sm text-on-surface-variant font-medium">
                            لا توجد حلقات تطابق بحثك حالياً.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
