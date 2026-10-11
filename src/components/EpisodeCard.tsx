"use client";

import Link from "next/link";
import { Episode } from "@/types";

interface EpisodeCardProps {
    episode: Episode & { 
        animeTitle?: string;
        progress?: number; // 0 to 100 percentage
        isVip?: boolean;
    };
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
    const isVip = episode.isVip || false;

    return (
        <Link
            href={`/watch/${episode.id}`}
            className="group flex flex-col rounded-2xl overflow-hidden bg-surface-container-low border border-white/[0.06] hover:border-primary-container/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-6px_rgba(220,38,38,0.35)]"
        >
            {/* 16:9 Thumbnail Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-surface-container-lowest">
                <img
                    src={episode.thumbnail || "/hero-bg.jpg"}
                    alt={episode.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                />

                {/* Ambient dark gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-black/40" />

                {/* Top Badges */}
                <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-lg bg-surface-container-highest/90 backdrop-blur-md text-primary font-headline-sm text-xs font-bold shadow">
                        الحلقة {episode.episodeNumber}
                    </span>
                    {isVip ? (
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary font-label-sm text-[10px] font-black shadow-[0_0_8px_rgba(238,152,0,0.5)]">
                            VIP
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high/90 backdrop-blur-md text-emerald-400 font-label-sm text-[10px] font-bold">
                            مجانية
                        </span>
                    )}
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_0_24px_rgba(220,38,38,0.7)] transform scale-75 group-hover:scale-100 transition-transform">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            play_arrow
                        </span>
                    </div>
                </div>

                {/* Duration Badge */}
                {episode.duration && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-surface-container-lowest/85 backdrop-blur-md text-on-surface-variant font-mono text-[11px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        <span>{episode.duration}</span>
                    </div>
                )}

                {/* Optional Progress Bar */}
                {episode.progress !== undefined && episode.progress > 0 && (
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-surface-container-highest">
                        <div 
                            className="h-full bg-primary-container shadow-[0_0_8px_rgba(220,38,38,0.8)]" 
                            style={{ width: `${Math.min(100, Math.max(0, episode.progress))}%` }}
                        />
                    </div>
                )}
            </div>

            {/* Episode Meta Content */}
            <div className="p-3.5 flex flex-col gap-1.5 flex-1 justify-between">
                <div>
                    <div className="flex items-center justify-between text-xs text-on-surface-variant font-tajawal mb-1">
                        <span className="text-secondary font-bold truncate max-w-[140px]">
                            {episode.animeTitle || "أنمي دايز"}
                        </span>
                        <span className="font-mono text-[11px]">
                            الموسم {episode.seasonNumber || 1}
                        </span>
                    </div>
                    <h3 className="font-cairo font-bold text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                        {episode.title}
                    </h3>
                </div>

                {episode.description && (
                    <p className="font-tajawal text-xs text-on-surface-variant line-clamp-2 leading-relaxed mt-0.5">
                        {episode.description}
                    </p>
                )}
            </div>
        </Link>
    );
}
