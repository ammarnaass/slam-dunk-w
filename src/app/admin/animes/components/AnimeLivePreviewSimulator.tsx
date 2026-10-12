"use client";

import { Eye, Star, Flame, Sparkles } from "lucide-react";
import { SPACETOON_PLANETS } from "@/lib/anime-presets";

interface AnimeLivePreviewSimulatorProps {
    title: string;
    description: string;
    coverImage: string;
    bannerImage?: string;
    planet?: string;
    genres: string[];
    rating: number;
    status: string;
    type: string;
    totalEpisodes: number;
    quality?: string;
    isFeatured: boolean;
    isTrending: boolean;
}

export default function AnimeLivePreviewSimulator({
    title,
    description,
    coverImage,
    bannerImage,
    planet = "مغامرات",
    genres = [],
    rating = 9.2,
    status = "Ongoing",
    type = "TV Series",
    totalEpisodes = 0,
    quality = "4K",
    isFeatured = false,
    isTrending = false,
}: AnimeLivePreviewSimulatorProps) {
    const activePlanet = SPACETOON_PLANETS.find(p => p.id === planet) || SPACETOON_PLANETS[0];
    const poster = coverImage || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80";
    const banner = bannerImage || "/hero-bg.jpg";

    return (
        <div className="bg-[#121217] rounded-2xl border border-white/[0.06] overflow-hidden shadow-2xl sticky top-20 text-right space-y-4 p-4">
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Eye size={16} className="text-[#dc2626]" />
                    <span>محاكي العرض الحي في المنصة</span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    مباشر (Live)
                </span>
            </div>

            {/* 1. Hero Billboard Header Preview */}
            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/10 shadow-lg group">
                <div
                    className="w-full h-full bg-cover bg-center transition-all duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${banner}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-[#121217]/50 to-transparent" />
                
                <div className="absolute top-2 right-2 flex items-center gap-1">
                    {isFeatured && (
                        <span className="px-2 py-0.5 rounded-md bg-[#dc2626] text-white text-[9px] font-bold shadow flex items-center gap-1">
                            <Sparkles size={10} /> سلايدر
                        </span>
                    )}
                    {isTrending && (
                        <span className="px-2 py-0.5 rounded-md bg-[#f59e0b] text-black text-[9px] font-black shadow flex items-center gap-1">
                            <Flame size={10} /> رائج
                        </span>
                    )}
                </div>

                <div className="absolute bottom-2 right-3 left-3 flex items-center justify-between">
                    <span className="font-cairo font-black text-xs text-white line-clamp-1 drop-shadow-md">
                        {title || "عنوان الأنمي الجديد"}
                    </span>
                    <span className="text-[10px] text-[#ffb95f] font-mono font-bold">
                        {quality || "4K"}
                    </span>
                </div>
            </div>

            {/* 2. Public AnimeCard Simulator (as seen on /animes) */}
            <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#94a3b8] block">
                    معاينة بطاقة الأنمي (Anime Card)
                </span>

                <div className="w-full max-w-[200px] mx-auto rounded-2xl overflow-hidden bg-[#181820] border border-white/5 shadow-xl transition-all duration-300 hover:border-[#dc2626]/50">
                    {/* Poster Image with Badges */}
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
                        <img
                            src={poster}
                            alt={title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/hero-bg.jpg";
                            }}
                        />

                        {/* Top Overlays */}
                        <div className="absolute top-2 inset-x-2 flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded-md bg-[#181820]/90 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                {status === "Ongoing" ? "مستمر" : "مكتمل"}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-[#dc2626] text-white text-[10px] font-black">
                                {quality || "4K"}
                            </span>
                        </div>

                        {/* Planet Floating Pill */}
                        <div className="absolute bottom-2 right-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md bg-black/70 backdrop-blur-md border border-white/10 ${activePlanet.color}`}>
                                <span>{activePlanet.badge}</span>
                                <span>{activePlanet.name}</span>
                            </span>
                        </div>
                    </div>

                    {/* Metadata Body */}
                    <div className="p-3 space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-[#ffb95f] font-bold flex items-center gap-0.5">
                                <Star size={11} className="fill-[#ffb95f]" />
                                <span>{rating ? Number(rating).toFixed(1) : "9.0"}</span>
                            </span>
                            <span className="text-[10px] text-[#94a3b8] font-mono">
                                {totalEpisodes ? `${totalEpisodes} ح` : type}
                            </span>
                        </div>

                        <h4 className="font-cairo font-bold text-xs text-white line-clamp-1">
                            {title || "عنوان الأنمي"}
                        </h4>

                        <div className="flex flex-wrap gap-1 pt-1">
                            {genres.slice(0, 2).map((g) => (
                                <span key={g} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-[#94a3b8]">
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Synopsis Peek */}
            <div className="p-3 rounded-xl bg-[#181820]/70 border border-white/[0.03] space-y-1">
                <span className="text-[10px] font-bold text-[#94a3b8] block">معاينة نص القصة:</span>
                <p className="text-[11px] text-[#e4e1e7] line-clamp-2 leading-relaxed">
                    {description || "اكتب قصة العمل لتظهر هنا في المعاينة التفاعلية..."}
                </p>
            </div>
        </div>
    );
}
