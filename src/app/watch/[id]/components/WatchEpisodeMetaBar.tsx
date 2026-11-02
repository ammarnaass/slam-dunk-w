"use client";

import { useState, useMemo } from "react";
import {
  MetaBarActionStrip,
  MetaBarDownloadsDrawer,
  MetaBarNavHeader,
  MetaBarServerList,
  MetaBarServerTabs,
  ServerItem,
  WatchEpisodeMetaBarProps,
} from "./meta-bar";

export type { ServerItem, WatchEpisodeMetaBarProps };

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
      <MetaBarNavHeader
        episode={episode}
        prevEpisode={prevEpisode}
        nextEpisode={nextEpisode}
      />

      {/* 2. Anime Slayer Multi-Server Matrix Classification Bar */}
      <div className="w-full bg-surface-container-low p-3 sm:p-space-md rounded-xl border border-white/[0.06] flex flex-col gap-3">
        <MetaBarServerTabs
          serverCategoryTab={serverCategoryTab}
          onSelectCategoryTab={(tab) => {
            setServerCategoryTab(tab);
            setShowDownloadsDrawer(false);
          }}
          showDownloadsDrawer={showDownloadsDrawer}
          onToggleDownloadsDrawer={() => setShowDownloadsDrawer(!showDownloadsDrawer)}
          directServersCount={directWatchServers.length}
          embedServersCount={embedBackupServers.length}
          downloadServersCount={downloadServers.length}
          activeQuality={activeQuality}
          onSelectQuality={onSelectQuality}
        />

        {!showDownloadsDrawer ? (
          <MetaBarServerList
            displayedServers={displayedWatchServers}
            allServers={servers}
            activeServerIndex={activeServerIndex}
            onSelectServer={onSelectServer}
          />
        ) : (
          <MetaBarDownloadsDrawer currentServer={currentServer} />
        )}
      </div>

      {/* 3. Secondary Action Strip */}
      <MetaBarActionStrip
        currentServer={currentServer}
        isFavorited={isFavorited}
        onToggleFavorite={handleFavoriteToggle}
        onShare={handleShare}
        isReported={isReported}
        onReport={handleReport}
      />
    </div>
  );
}
