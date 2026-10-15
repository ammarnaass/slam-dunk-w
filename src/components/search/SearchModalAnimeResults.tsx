"use client";

import Link from "next/link";
import { SearchAnimeItem } from "./useSearchModal";

interface SearchModalAnimeResultsProps {
    animes: SearchAnimeItem[];
    onItemClick: () => void;
}

export function SearchModalAnimeResults({
    animes,
    onItemClick,
}: SearchModalAnimeResultsProps) {
    if (!animes || animes.length === 0) return null;

    return (
        <div>
            <h3 className="text-[#ffb95f] font-bold text-xs uppercase tracking-wider mb-2.5 px-2 flex items-center gap-1.5 font-cairo">
                <span className="material-symbols-outlined text-sm">movie</span>
                الأنمي والأعمال ({animes.length})
            </h3>
            <div className="grid gap-2">
                {animes.map((anime) => (
                    <Link
                        key={anime.id}
                        href={`/animes/${anime.id}`}
                        onClick={onItemClick}
                        className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] transition-colors group border border-white/[0.04] hover:border-white/[0.1]"
                    >
                        <div className="w-12 h-16 rounded-xl overflow-hidden shrink-0 bg-black/40">
                            <img
                                src={anime.coverImage}
                                alt={anime.title}
                                className="w-full h-full object-cover group-hover:scale-108 transition-transform"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-white font-cairo text-sm font-bold group-hover:text-red-400 transition-colors truncate">
                                {anime.title}
                            </h4>
                            <div className="flex items-center gap-2.5 text-xs text-[#94a3b8] mt-1">
                                <span>{anime.type || "TV"}</span>
                                <span>•</span>
                                <span>
                                    {anime.totalEpisodes ? `${anime.totalEpisodes} حلقة` : "كامل"}
                                </span>
                                <span>•</span>
                                <span className="text-[#ffb95f] font-bold">
                                    ★ {anime.rating ? Number(anime.rating).toFixed(1) : "9.2"}
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
