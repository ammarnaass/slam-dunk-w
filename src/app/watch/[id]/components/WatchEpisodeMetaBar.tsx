"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Episode } from "@/types";

export interface ServerItem {
  id?: string;
  name: string;
  url: string;
  directUrl?: string | null;
  embedUrl?: string | null;
  downloadUrl?: string | null;
  quality?: string | null;
  provider?: string;
  category?: string;
  matrixCategory?: "direct" | "embed" | "download";
  type?: string;
  ping?: string;
  isWorking?: boolean;
}

interface WatchEpisodeMetaBarProps {
  episode: Episode & {
    anime?: { id?: string; title: string };
  };
  prevEpisode: { id: string; episodeNumber: number | string } | null;
  nextEpisode: { id: string; episodeNumber: number | string } | null;
  servers: ServerItem[];
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
  onShowToast,
}: WatchEpisodeMetaBarProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [serverCategoryTab, setServerCategoryTab] = useState<"direct" | "embed" | "download">("direct");
  const [showDownloadsDrawer, setShowDownloadsDrawer] = useState(false);

  // Group servers into Anime Slayer standard categories
  const directWatchServers = useMemo(() => {
    return servers.filter(
      (s) =>
        s.matrixCategory === "direct" ||
        ["hls", "dropbox", "mega", "gdrive", "4shared"].includes(s.provider || "") ||
        s.type === "mp4" ||
        s.type === "hls" ||
        s.type === "mega"
    );
  }, [servers]);

  const embedBackupServers = useMemo(() => {
    return servers.filter(
      (s) =>
        s.matrixCategory === "embed" ||
        ["vidmoly", "okru", "streamtape", "mp4upload"].includes(s.provider || "") ||
        s.type === "embed"
    );
  }, [servers]);

  const downloadServers = useMemo(() => {
    const list = servers.filter(
      (s) => s.category === "download" || s.category === "both" || s.downloadUrl || s.provider === "mediafire"
    );
    if (list.length > 0) return list;
    return servers;
  }, [servers]);

  // Current active server
  const currentServer = servers[activeServerIndex] || servers[0];

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
          url: shareUrl,
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
    onShowToast(`تم إرسال بلاغ فحص لسيرفر "${currentServer?.name || "الحالي"}"`, "check_circle");
    setTimeout(() => setIsReported(false), 4000);
  };

  const displayedWatchServers = serverCategoryTab === "embed" ? embedBackupServers : directWatchServers;

  return (
    <div className="w-full bg-surface-container p-space-md sm:p-space-lg rounded-2xl shadow-xl flex flex-col gap-space-md border border-white/[0.08]">
      {/* 1. Top Title & Navigation Row */}
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

      {/* 2. Anime Slayer Multi-Server Matrix Classification Bar */}
      <div className="w-full bg-surface-container-low p-3 sm:p-space-md rounded-xl border border-white/[0.06] flex flex-col gap-3">
        {/* Category Filter Tabs */}
        <div className="flex items-center justify-between gap-2 flex-wrap border-b border-white/[0.06] pb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                setServerCategoryTab("direct");
                setShowDownloadsDrawer(false);
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                serverCategoryTab === "direct" && !showDownloadsDrawer
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>سيرفرات فائقة السرعة ({directWatchServers.length})</span>
            </button>

            <button
              onClick={() => {
                setServerCategoryTab("embed");
                setShowDownloadsDrawer(false);
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                serverCategoryTab === "embed" && !showDownloadsDrawer
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">tv</span>
              <span>سيرفرات التضمين والاحتياط ({embedBackupServers.length})</span>
            </button>

            <button
              onClick={() => setShowDownloadsDrawer(!showDownloadsDrawer)}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                showDownloadsDrawer
                  ? "bg-secondary-container text-on-secondary-container shadow-sm"
                  : "bg-surface-container-high text-secondary hover:brightness-110"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>روابط التحميل المباشر ({downloadServers.length})</span>
            </button>
          </div>

          {/* Resolution Selector */}
          <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-white/5">
            {["1080p", "720p", "480p", "Auto"].map((q) => (
              <button
                key={q}
                onClick={() => onSelectQuality(q)}
                className={`min-h-[32px] px-2 rounded font-label-sm text-label-sm font-bold transition-all text-xs ${
                  activeQuality === q
                    ? "bg-primary-container text-on-primary-container shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Server Carousel List */}
        {!showDownloadsDrawer ? (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none touch-pan-x py-1 max-w-full">
            {displayedWatchServers.map((srv) => {
              const actualIdx = servers.findIndex((s) => (s.id && s.id === srv.id) || s.url === srv.url);
              const isActive = activeServerIndex === actualIdx;
              const pingText = srv.ping || "24ms";

              return (
                <button
                  key={srv.id || srv.url}
                  onClick={() => onSelectServer(actualIdx >= 0 ? actualIdx : 0)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 border shrink-0 text-xs sm:text-sm ${
                    isActive
                      ? "bg-primary-container text-on-primary-container border-primary-container shadow-md font-bold scale-[1.02]"
                      : "bg-surface-container-high text-on-surface hover:text-primary border-white/5"
                  }`}
                >
                  {/* Status Indicator */}
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-white animate-ping" : "bg-emerald-400"
                    }`}
                  />

                  {/* Server Name */}
                  <span>{srv.name}</span>

                  {/* Latency & Quality Tag */}
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {srv.quality || "FHD"} • {pingText}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          /* 3. Direct Downloads Matrix (Anime Slayer Grade) */
          <div className="w-full bg-surface-container-lowest p-3 sm:p-4 rounded-xl border border-secondary/20 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-secondary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                اختر جودة وسيرفر التحميل المباشر:
              </span>
              <span className="text-[11px] text-on-surface-variant">تحميل فوري دون إعلانات منبثقة</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* 1080p FHD */}
              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-surface-container-low border border-white/5">
                <div className="flex items-center justify-between text-xs font-bold text-primary">
                  <span>⚡ خارقة 1080p FHD</span>
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">الأعلى جودة</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">سيرفر ميجا / دروب بوكس السحابي</p>
                <a
                  href={currentServer.downloadUrl || currentServer.directUrl || currentServer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded bg-primary-container text-on-primary-container text-xs font-bold hover:brightness-110 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>تحميل الجودة الخارقة</span>
                </a>
              </div>

              {/* 720p HD */}
              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-surface-container-low border border-white/5">
                <div className="flex items-center justify-between text-xs font-bold text-secondary">
                  <span>⚡ عالية 720p HD</span>
                  <span className="text-[10px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded">متوازنة</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">سيرفر فورشيرد / جوجل درايف</p>
                <a
                  href={currentServer.downloadUrl || currentServer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded bg-secondary text-on-secondary text-xs font-bold hover:brightness-110 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>تحميل الجودة العالية</span>
                </a>
              </div>

              {/* 480p SD */}
              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-surface-container-low border border-white/5">
                <div className="flex items-center justify-between text-xs font-bold text-on-surface">
                  <span>⚡ متوسطة 480p SD</span>
                  <span className="text-[10px] bg-white/10 text-on-surface-variant px-1.5 py-0.5 rounded">حجم اقتصادي</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">سيرفر ميديا فاير السريع</p>
                <a
                  href={currentServer.downloadUrl || currentServer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded bg-surface-container-highest text-on-surface text-xs font-bold hover:bg-white/20 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span>تحميل 480p سريع</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Secondary Action Strip */}
      <div className="w-full flex flex-wrap items-center justify-between gap-space-sm pt-space-xs text-on-surface-variant border-t border-white/[0.04]">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Favorite */}
          <button
            onClick={handleFavoriteToggle}
            className={`min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer border ${
              isFavorited
                ? "bg-primary-container/20 text-primary border-primary-container/40"
                : "bg-surface-container-high hover:text-primary-container border-transparent"
            }`}
            id="favorite-btn"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isFavorited ? "favorite" : "favorite_border"}
            </span>
            <span className="font-body-md text-body-md font-semibold text-xs sm:text-sm">
              {isFavorited ? "في المفضلة" : "أضف للمفضلة"}
            </span>
          </button>

          {/* Direct MEGA / External Stream launcher */}
          {currentServer?.url && (
            <a
              href={currentServer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-container/20 hover:bg-primary-container text-primary hover:text-on-primary-container transition-all border border-primary-container/30 text-xs sm:text-sm font-bold"
              id="mega-direct-btn"
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              <span>مشاهدة عبر تطبيق MEGA المباشر</span>
            </a>
          )}

          {/* VIP Download */}
          <Link
            href="/pricing"
            className="min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:text-secondary transition-all text-on-surface-variant border border-transparent"
            id="vip-download-btn"
          >
            <span className="material-symbols-outlined text-secondary text-[18px]">workspace_premium</span>
            <span className="font-body-md text-body-md font-semibold text-xs sm:text-sm">تنزيل VIP (4K)</span>
          </Link>

          {/* Share */}
          <button
            onClick={handleShare}
            className="min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:text-on-surface transition-all cursor-pointer border border-transparent"
            id="share-btn"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            <span className="font-body-md text-body-md font-semibold text-xs sm:text-sm">مشاركة</span>
          </button>
        </div>

        {/* Broken link reporting */}
        <button
          onClick={handleReport}
          className={`min-h-[44px] flex items-center gap-1 px-3.5 py-2 rounded-xl transition-all cursor-pointer border ${
            isReported
              ? "bg-emerald-950 text-emerald-400 border-emerald-500/50"
              : "bg-surface-container-low hover:bg-error-container hover:text-on-error-container text-on-surface-variant border-transparent"
          }`}
          id="report-link-btn"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isReported ? "check_circle" : "report_problem"}
          </span>
          <span className="font-label-md text-label-md text-xs sm:text-sm">
            {isReported ? "تم الإبلاغ بنجاح" : "الإبلاغ عن سيرفر معطّل"}
          </span>
        </button>
      </div>
    </div>
  );
}
