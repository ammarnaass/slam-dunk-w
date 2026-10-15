"use client";

import Link from "next/link";
import { SearchEpisodeItem } from "./useSearchModal";

interface SearchModalEpisodeResultsProps {
    episodes: SearchEpisodeItem[];
    onItemClick: () => void;
}

export function SearchModalEpisodeResults({
    episodes,
    onItemClick,
}: SearchModalEpisodeResultsProps) {
    if (!episodes || episodes.length === 0) return null;

    return (
        <div>
            <h3 className="text-red-400 font-bold text-xs uppercase tracking-wider mb-2.5 px-2 flex items-center gap-1.5 font-cairo">
                <span className="material-symbols-outlined text-sm">play_circle</span>
                الحلقات المباشرة ({episodes.length})
            </h3>
            <div className="grid gap-2">
                {episodes.map((ep) => (
                    <Link
                        key={ep.id}
                        href={`/watch/${ep.id}`}
                        onClick={onItemClick}
                        className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] transition-colors group border border-white/[0.04] hover:border-white/[0.1]"
                    >
                        <div className="w-20 aspect-video rounded-xl overflow-hidden shrink-0 relative bg-black/40">
                            <img
                                src={ep.thumbnail || "/hero-bg.jpg"}
                                alt={ep.title}
                                className="w-full h-full object-cover group-hover:scale-108 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span
                                    className="material-symbols-outlined text-white text-base"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                    play_circle
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-white font-cairo text-sm font-medium group-hover:text-red-400 transition-colors line-clamp-1">
                                {ep.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-[#94a3b8] mt-1">
                                <span className="text-red-400 font-bold bg-red-600/20 px-2 py-0.5 rounded text-[10px]">
                                    الحلقة {ep.episodeNumber || ep.episode_number}
                                </span>
                                <span className="truncate text-[#94a3b8] text-[11px]">
                                    {ep.animeTitle}
                                </span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-white/20 group-hover:text-white text-xl">
                            arrow_back
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
