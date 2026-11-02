"use client";

import Link from "next/link";
import { EpisodeNavInfo, EpisodeWithAnime } from "./meta-bar.types";

interface MetaBarNavHeaderProps {
  episode: EpisodeWithAnime;
  prevEpisode: EpisodeNavInfo | null;
  nextEpisode: EpisodeNavInfo | null;
}

export function MetaBarNavHeader({
  episode,
  prevEpisode,
  nextEpisode,
}: MetaBarNavHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
      {/* Title & Metadata */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center gap-space-xs flex-wrap">
          <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm font-bold">
            الموسم {episode.seasonNumber || 1}
          </span>
          <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
            الحلقة {episode.episodeNumber || 1}
          </span>
          <span className="px-space-xs py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/20 font-label-sm text-label-sm font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            مصفوفة الخوادم النشطة
          </span>
        </div>

        <h1 className="font-headline-lg text-headline-lg text-on-surface font-black tracking-tight">
          {episode.anime?.title || "أنمي كلاسيكي"} - {episode.title}
        </h1>

        <p className="font-headline-sm text-headline-sm text-primary font-bold">
          عنوان الحلقة: "{episode.description?.slice(0, 50) || episode.title}..."
        </p>
      </div>

      {/* Previous / Next Navigation Controls */}
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
        {prevEpisode ? (
          <Link
            href={`/watch/${prevEpisode.id}`}
            className="flex-1 sm:flex-none min-h-[44px] flex items-center justify-center gap-1.5 px-4 sm:px-space-md py-2 sm:py-space-sm rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-all border border-white/5 font-headline-sm text-headline-sm text-xs sm:text-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            <span>السابقة ({prevEpisode.episodeNumber})</span>
          </Link>
        ) : (
          <button
            disabled
            className="flex-1 sm:flex-none min-h-[44px] flex items-center justify-center gap-1.5 px-4 sm:px-space-md py-2 sm:py-space-sm rounded-xl bg-surface-container-high/40 text-on-surface-variant/40 cursor-not-allowed border border-white/5 font-headline-sm text-headline-sm text-xs sm:text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            <span>السابقة</span>
          </button>
        )}

        {nextEpisode ? (
          <Link
            href={`/watch/${nextEpisode.id}`}
            className="flex-1 sm:flex-none min-h-[44px] flex items-center justify-center gap-1.5 px-4 sm:px-space-md py-2 sm:py-space-sm rounded-xl bg-primary-container text-on-primary-container shadow-md hover:brightness-110 transition-all font-headline-sm text-headline-sm text-xs sm:text-sm active:scale-95"
          >
            <span>التالية ({nextEpisode.episodeNumber})</span>
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </Link>
        ) : (
          <button
            disabled
            className="flex-1 sm:flex-none min-h-[44px] flex items-center justify-center gap-1.5 px-4 sm:px-space-md py-2 sm:py-space-sm rounded-xl bg-surface-container-high/40 text-on-surface-variant/40 cursor-not-allowed border border-white/5 font-headline-sm text-headline-sm text-xs sm:text-sm"
          >
            <span>التالية</span>
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
        )}
      </div>
    </div>
  );
}
