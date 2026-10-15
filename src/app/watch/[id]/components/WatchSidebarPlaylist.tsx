"use client";

import { useState } from "react";
import Link from "next/link";

interface EpisodeItem {
  id: string;
  title: string;
  episodeNumber: number | string;
  seasonNumber?: number | string;
  thumbnail?: string;
  duration?: string;
}

interface WatchSidebarPlaylistProps {
  currentEpisodeId: string;
  episodes: EpisodeItem[];
  fallbackCoverImage?: string;
}

export default function WatchSidebarPlaylist({
  currentEpisodeId,
  episodes,
  fallbackCoverImage
}: WatchSidebarPlaylistProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAscending, setIsAscending] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState("all");

  const filteredEpisodes = episodes
    .filter((ep) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        ep.title.toLowerCase().includes(q) ||
        String(ep.episodeNumber).includes(q)
      );
    })
    .sort((a, b) => {
      const numA = Number(a.episodeNumber) || 0;
      const numB = Number(b.episodeNumber) || 0;
      return isAscending ? numA - numB : numB - numA;
    });

  const currentEpIndex = episodes.findIndex(e => String(e.id) === String(currentEpisodeId));

  return (
    <div className="w-full bg-surface-container rounded-xl p-space-md shadow-xl flex flex-col gap-space-md max-h-[calc(100vh-120px)] overflow-hidden border border-white/[0.06]">
      {/* Playlist Header */}
      <div className="flex flex-col gap-space-xs pb-space-xs border-b border-white/[0.04]">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 font-bold">
            <span className="material-symbols-outlined text-primary-container">playlist_play</span>
            <span>قائمة الحلقات</span>
          </h2>
          <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/20 px-2.5 py-0.5 rounded-full font-bold border border-secondary-container/30">
            {episodes.length} حلقة كاملة
          </span>
        </div>

        {/* Season Selector Dropdown */}
        <div className="relative w-full mt-1">
          <select 
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="w-full min-h-[44px] bg-surface-container-low text-on-surface text-base sm:text-body-sm px-space-md py-2.5 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-container border border-white/5"
          >
            <option value="all">الموسم الأول: عهد البطولة (الحلقات 1 - {episodes.length})</option>
            <option value="s2">الموسم الثاني: صعود الأبطال (قريباً)</option>
            <option value="ova">الحلقات الخاصة والأوفا (OVAs)</option>
          </select>
          <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
            expand_more
          </span>
        </div>

        {/* Search in Episodes & Sort Controls */}
        <div className="flex items-center gap-space-xs mt-space-xs">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute right-space-sm top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[44px] bg-surface-container-lowest text-on-surface placeholder:text-outline text-base sm:text-body-sm pr-9 pl-space-sm py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-container border border-white/5"
              id="episode-search"
              placeholder="بحث برقم أو اسم الحلقة..."
            />
          </div>

          <button
            onClick={() => setIsAscending(!isAscending)}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer border border-white/5 shrink-0"
            id="sort-order-btn"
            title={isAscending ? "الترتيب: تصاعدي (انقر للعكس)" : "الترتيب: تنازلي (انقر للعكس)"}
          >
            <span className="material-symbols-outlined text-[18px]">swap_vert</span>
          </button>
        </div>
      </div>

      {/* Quick Horizontal Episode Selector for Mobile Swiping */}
      <div className="xl:hidden pb-1 border-b border-white/[0.04]">
        <div className="flex items-center justify-between text-xs text-on-surface-variant font-bold mb-2">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary">touch_app</span>
            <span>تنقل سريع بين الحلقات:</span>
          </span>
          <span className="text-[10px] text-secondary font-mono">اسحب أفقياً ←</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none touch-pan-x pb-2 snap-x">
          {filteredEpisodes.map((ep) => {
            const isCur = String(ep.id) === String(currentEpisodeId);
            return (
              <Link
                key={`quick-${ep.id}`}
                href={`/watch/${ep.id}`}
                className={`snap-start shrink-0 min-h-[44px] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border active:scale-95 ${
                  isCur
                    ? "bg-primary-container text-on-primary-container border-primary-container shadow-md"
                    : "bg-surface-container-low text-on-surface-variant hover:text-on-surface border-white/5"
                }`}
              >
                <span>حلقة {ep.episodeNumber}</span>
                {isCur && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Scrollable Episode Items List */}
      <div className="flex flex-col gap-space-sm overflow-y-auto pr-1 -mr-1 max-h-[580px] scrollbar-none" id="episodes-container">
        {filteredEpisodes.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant font-body-sm text-body-sm">
            لا توجد حلقات تطابق بحثك "{searchQuery}"
          </div>
        ) : (
          filteredEpisodes.map((ep, idx) => {
            const isCurrent = String(ep.id) === String(currentEpisodeId);
            const epNum = Number(ep.episodeNumber) || idx + 1;
            const isWatched = !isCurrent && currentEpIndex >= 0 && idx < currentEpIndex;

            if (isCurrent) {
              return (
                <div
                  key={ep.id}
                  className="flex items-center gap-space-sm p-space-xs rounded-xl bg-surface-container-highest shadow-[0_0_20px_rgba(220,38,38,0.35)] relative overflow-hidden border border-primary-container/40"
                >
                  <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-primary-container" />
                  
                  {/* Thumbnail with Active Pulse */}
                  <div className="relative w-28 aspect-video rounded-lg overflow-hidden shrink-0 bg-surface-container-lowest mr-1">
                    <img
                      src={ep.thumbnail || fallbackCoverImage || "/logoep.jpg"}
                      alt={ep.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary-container/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[24px] animate-pulse">
                        play_circle
                      </span>
                    </div>
                    {/* Active Progress */}
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-surface-variant">
                      <div className="h-full w-[58%] bg-primary-container shadow-[0_0_8px_#dc2626]" />
                    </div>
                    <span className="absolute bottom-1.5 left-1 text-[10px] font-bold bg-primary-container text-white px-1 rounded font-mono">
                      {ep.duration || "24:10"}
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 min-w-0 pr-1">
                    <span className="font-headline-sm text-headline-sm text-on-surface truncate font-bold text-sm">
                      الحلقة {String(ep.episodeNumber).padStart(2, "0")}: {ep.title}
                    </span>
                    <span className="font-label-sm text-label-sm text-primary flex items-center gap-1 font-bold text-xs mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping" />
                      قيد المشاهدة الآن
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={ep.id}
                href={`/watch/${ep.id}`}
                className="group flex items-center gap-space-sm p-space-xs rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all border border-transparent hover:border-white/5 min-h-[56px] active:scale-[0.99]"
              >
                {/* Thumbnail */}
                <div className="relative w-28 aspect-video rounded-lg overflow-hidden shrink-0 bg-surface-container-lowest">
                  <img
                    src={ep.thumbnail || fallbackCoverImage || "/logoep.jpg"}
                    alt={ep.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isWatched && (
                    <>
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-emerald-500" />
                      <span className="absolute top-1 right-1 bg-surface-container-lowest/80 text-emerald-400 p-0.5 rounded-full flex items-center shadow">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </span>
                    </>
                  )}
                  <span className="absolute bottom-1.5 left-1 text-[10px] font-bold bg-black/70 text-white px-1 rounded font-mono">
                    {ep.duration || "23:30"}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-headline-sm text-headline-sm text-on-surface-variant group-hover:text-on-surface truncate text-xs sm:text-sm font-semibold transition-colors">
                    الحلقة {String(ep.episodeNumber).padStart(2, "0")}: {ep.title}
                  </span>
                  <span className="font-body-sm text-body-sm text-outline text-[11px] mt-0.5">
                    {isWatched ? "تمت المشاهدة بالكامل" : `الحلقة ${ep.episodeNumber}`}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* VIP Upgrade Banner */}
      <div className="p-space-md rounded-xl bg-gradient-to-br from-primary-container/20 to-surface-container-low border border-primary-container/30 flex items-center justify-between gap-space-sm shadow-md mt-auto">
        <div>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold text-xs block">
            مشاهدة فورية بدون إعلانات
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
            احصل على جودة 4K مع اشتراك الدايزر VIP
          </span>
        </div>
        <Link
          href="/pricing"
          className="px-3 py-1.5 rounded-xl bg-secondary-container text-on-secondary font-cairo font-bold text-xs shrink-0 shadow hover:brightness-110 active:scale-95 transition-all"
        >
          ترقية VIP
        </Link>
      </div>
    </div>
  );
}
