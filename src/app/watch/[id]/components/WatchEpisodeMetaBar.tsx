"use client";

import { useState } from "react";
import Link from "next/link";
import { Episode } from "@/types";

interface WatchEpisodeMetaBarProps {
  episode: Episode & {
    anime?: { id?: string; title: string };
  };
  prevEpisode: { id: string; episodeNumber: number | string } | null;
  nextEpisode: { id: string; episodeNumber: number | string } | null;
  servers: Array<{ id?: string; name: string; url: string; quality?: string | null }>;
  activeServerIndex: number;
  onSelectServer: (idx: number) => void;
  activeQuality: string;
  onSelectQuality: (q: string) => void;
  onShowToast: (message: string, icon?: string) => void;
}

export default function WatchEpisodeMetaBar({
  episode,
  prevEpisode,
  nextEpisode,
  servers,
  activeServerIndex,
  onSelectServer,
  activeQuality,
  onSelectQuality,
  onShowToast
}: WatchEpisodeMetaBarProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isReported, setIsReported] = useState(false);

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    if (!isFavorited) {
      onShowToast("تمت إضافة الحلقة إلى قائمة المفضلة", "favorite");
    } else {
      onShowToast("تمت إزالة الحلقة من قائمة المفضلة", "favorite_border");
    }
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${episode.title} - ${episode.anime?.title || "ANIME DAZE"}`,
          url: shareUrl
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      onShowToast("تم نسخ رابط الحلقة بنجاح!", "link");
    }
  };

  const handleReport = () => {
    setIsReported(true);
    onShowToast("تم إرسال إشعار فحص السيرفر للدعم الفني", "check_circle");
    setTimeout(() => setIsReported(false), 4000);
  };

  return (
    <div className="w-full bg-surface-container p-space-md sm:p-space-lg rounded-xl shadow-md flex flex-col gap-space-md border border-white/[0.06]">
      {/* Top Title & Navigation Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        {/* Title & Metadata */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm font-bold">
              الموسم {episode.seasonNumber || 1}
            </span>
            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
              الآرك: عهد البطولة
            </span>
            <span className="px-space-xs py-0.5 rounded bg-emerald-950 text-emerald-400 font-label-sm text-label-sm font-semibold">
              تم البث حديثاً
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
        <div className="flex items-center gap-2 shrink-0">
          {prevEpisode ? (
            <Link
              href={`/watch/${prevEpisode.id}`}
              className="min-h-[44px] flex items-center gap-1.5 px-3 sm:px-space-md py-2 sm:py-space-sm rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-bright transition-all shadow-sm border border-white/5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              <span className="font-headline-sm text-headline-sm text-xs sm:text-sm font-bold">
                السابقة ({prevEpisode.episodeNumber})
              </span>
            </Link>
          ) : (
            <button
              disabled
              className="min-h-[44px] flex items-center gap-1.5 px-3 sm:px-space-md py-2 sm:py-space-sm rounded-xl bg-surface-container-high/40 text-on-surface-variant/40 cursor-not-allowed border border-white/5"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              <span className="font-headline-sm text-headline-sm text-xs sm:text-sm">السابقة</span>
            </button>
          )}

          {nextEpisode ? (
            <Link
              href={`/watch/${nextEpisode.id}`}
              className="min-h-[44px] flex items-center gap-1.5 px-4 sm:px-space-md py-2 sm:py-space-sm rounded-xl bg-primary-container text-on-primary-container hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              <span className="font-headline-sm text-headline-sm text-xs sm:text-sm font-bold">
                التالية ({nextEpisode.episodeNumber})
              </span>
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </Link>
          ) : (
            <button
              disabled
              className="min-h-[44px] flex items-center gap-1.5 px-4 sm:px-space-md py-2 sm:py-space-sm rounded-xl bg-surface-container-high/40 text-on-surface-variant/40 cursor-not-allowed border border-white/5"
            >
              <span className="font-headline-sm text-headline-sm text-xs sm:text-sm">التالية</span>
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
          )}
        </div>
      </div>

      {/* Broadcast Servers Selector & Quality Switcher */}
      <div className="w-full pt-space-xs flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-low p-3 sm:p-space-md rounded-xl border border-white/5">
        {/* Servers - Horizontal Touch Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-full">
          <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1 font-bold shrink-0">
            <span className="material-symbols-outlined text-primary-container text-[18px]">dns</span>
            <span className="hidden sm:inline">خوادم البث المباشر:</span>
            <span className="sm:hidden">السيرفر:</span>
          </span>

          {servers.map((srv, idx) => {
            const isActive = activeServerIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => onSelectServer(idx)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl font-label-md text-label-md transition-all cursor-pointer flex items-center gap-1.5 border shrink-0 text-xs sm:text-sm ${
                  isActive
                    ? "bg-primary-container text-on-primary-container border-primary-container shadow-md font-bold"
                    : "bg-surface-container-high text-on-surface hover:text-primary border-white/5"
                }`}
              >
                <span>{srv.name || `سيرفر ${idx + 1}`}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Resolution Switcher */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-surface-container-lowest p-1 rounded-xl border border-white/5 shrink-0 overflow-x-auto">
          {["4K", "1080p", "720p", "480p", "تلقائي"].map((q) => (
            <button
              key={q}
              onClick={() => onSelectQuality(q)}
              className={`min-h-[36px] px-2.5 py-0.5 rounded-lg font-label-sm text-label-sm font-bold transition-all cursor-pointer shrink-0 ${
                activeQuality === q
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : q === "تلقائي"
                  ? "text-secondary hover:text-on-surface"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Interaction Strip */}
      <div className="w-full flex flex-wrap items-center justify-between gap-space-sm pt-space-xs text-on-surface-variant border-t border-white/[0.04]">
        <div className="flex items-center gap-space-xs flex-wrap">
          {/* Favorite */}
          <button
            onClick={handleFavoriteToggle}
            className={`flex items-center gap-1.5 px-space-md py-space-xs rounded-lg transition-all cursor-pointer border ${
              isFavorited
                ? "bg-primary-container/20 text-primary border-primary-container/40"
                : "bg-surface-container-high hover:text-primary-container border-transparent"
            }`}
            id="favorite-btn"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isFavorited ? "favorite" : "favorite_border"}
            </span>
            <span className="font-body-md text-body-md font-semibold">
              {isFavorited ? "في المفضلة" : "أضف للمفضلة"}
            </span>
          </button>

          {/* VIP Download */}
          <Link
            href="/pricing"
            className="flex items-center gap-1.5 px-space-md py-space-xs rounded-lg bg-surface-container-high hover:text-secondary transition-all text-on-surface-variant border border-transparent"
            id="vip-download-btn"
          >
            <span className="material-symbols-outlined text-secondary text-[18px]">download_for_offline</span>
            <span className="font-body-md text-body-md font-semibold">تنزيل بجودة 4K (VIP)</span>
          </Link>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-space-md py-space-xs rounded-lg bg-surface-container-high hover:text-on-surface transition-all cursor-pointer border border-transparent"
            id="share-btn"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            <span className="font-body-md text-body-md font-semibold">مشاركة</span>
          </button>
        </div>

        {/* Broken link reporting */}
        <button
          onClick={handleReport}
          className={`flex items-center gap-1 px-space-md py-space-xs rounded-lg transition-all cursor-pointer border ${
            isReported
              ? "bg-emerald-950 text-emerald-400 border-emerald-500/50"
              : "bg-surface-container-low hover:bg-error-container hover:text-on-error-container text-on-surface-variant border-transparent"
          }`}
          id="report-link-btn"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isReported ? "check_circle" : "report_problem"}
          </span>
          <span className="font-label-md text-label-md">
            {isReported ? "تم الإبلاغ بنجاح" : "الإبلاغ عن سيرفر معطّل"}
          </span>
        </button>
      </div>
    </div>
  );
}
