"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Episode } from "@/types";
import WatchTheaterHeader from "./WatchTheaterHeader";
import WatchCinematicPlayer from "./WatchCinematicPlayer";
import WatchEpisodeMetaBar from "./WatchEpisodeMetaBar";
import WatchEpisodeDetails from "./WatchEpisodeDetails";
import WatchCommentsSection from "./WatchCommentsSection";
import WatchSidebarPlaylist from "./WatchSidebarPlaylist";
import { DEFAULT_ANIME_CASTS, PRESET_SERVERS, AnimeCastData } from "./watch-stitch-data";

interface WatchClientTheaterProps {
  episode: Episode & {
    anime?: { id?: string; title: string; description?: string; coverImage?: string };
  };
  anime: any;
  animeEpisodes: any[];
}

export default function WatchClientTheater({
  episode,
  anime,
  animeEpisodes
}: WatchClientTheaterProps) {
  const router = useRouter();

  // State Management
  const [lightsOff, setLightsOff] = useState(false);
  const [activeServerIndex, setActiveServerIndex] = useState(0);
  const [activeQuality, setActiveQuality] = useState("1080p");
  const [audioTrack, setAudioTrack] = useState<"arabic" | "japanese">("arabic");

  // Toast state
  const [toast, setToast] = useState<{ visible: boolean; message: string; icon: string }>({
    visible: false,
    message: "",
    icon: "check_circle"
  });

  const showToast = (message: string, icon = "check_circle") => {
    setToast({ visible: true, message, icon });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3200);
  };

  // Determine servers
  const servers = episode.servers && episode.servers.length > 0 
    ? episode.servers 
    : [
        ...(episode.video_url ? [{ id: "srv-direct", name: "سيرفر البث المباشر (FHD)", url: episode.video_url, quality: "1080p FHD" }] : []),
        ...(episode.mega_link ? [{ id: "srv-mega", name: "سيرفر ميجا السريع", url: episode.mega_link, quality: "1080p FHD" }] : []),
        ...PRESET_SERVERS.map(s => ({ ...s, url: episode.mega_link || episode.video_url || "" }))
      ];

  const currentServer = servers[activeServerIndex] || servers[0] || {
    name: "سيرفر البث السحابي",
    url: episode.mega_link || episode.video_url || ""
  };

  // Navigation indices
  const currentIndex = animeEpisodes.findIndex(e => String(e.id) === String(episode.id));
  const prevEpisode = currentIndex > 0 ? animeEpisodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < animeEpisodes.length - 1 ? animeEpisodes[currentIndex + 1] : null;

  // Cast & Planet mapping
  const animeId = anime?.id || episode.animeId || "default";
  const castData: AnimeCastData = DEFAULT_ANIME_CASTS[animeId] || DEFAULT_ANIME_CASTS["default"];

  // Mobile Active Tab State
  const [mobileTab, setMobileTab] = useState<"episodes" | "details" | "comments">("episodes");

  return (
    <div className={`w-full min-h-screen text-on-surface transition-colors duration-500 ${lightsOff ? "bg-[#070709]" : "bg-surface"}`}>
      {/* Toast Notification (Stitch 2 Component) */}
      <div 
        className={`fixed bottom-6 left-6 z-50 flex items-center gap-space-sm bg-surface-container-high/95 backdrop-blur-md text-on-surface px-space-md py-space-sm rounded-xl shadow-2xl border border-white/10 transition-all duration-300 ${
          toast.visible 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        id="toast-notification"
      >
        <span className="material-symbols-outlined text-secondary" id="toast-icon">
          {toast.icon}
        </span>
        <span className="font-body-md text-body-md font-bold" id="toast-text">
          {toast.message}
        </span>
      </div>

      <div className="max-w-[1440px] mx-auto px-gutter-md lg:px-gutter-lg py-space-md pt-20 sm:pt-28">
        {/* Header Breadcrumbs, Sync Indicator & Lights Toggle */}
        <WatchTheaterHeader
          anime={anime}
          episode={episode}
          planetInfo={castData.planet}
          lightsOff={lightsOff}
          onToggleLights={() => setLightsOff(!lightsOff)}
        />

        {/* Main Two-Column Layout (RTL: Theater Right visual / Column 1, Sidebar Left visual / Column 2) */}
        <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-gutter-lg items-start">
          {/* Main Streaming Theater Column */}
          <div className="xl:col-span-8 flex flex-col gap-space-md sm:gap-space-lg min-w-0">
            {/* 16:9 Cinematic Video Player */}
            <WatchCinematicPlayer
              episode={episode}
              currentServer={currentServer}
              audioTrack={audioTrack}
              quality={activeQuality}
              lightsOff={lightsOff}
              onPrevEpisode={prevEpisode ? () => router.push(`/watch/${prevEpisode.id}`) : undefined}
              onNextEpisode={nextEpisode ? () => router.push(`/watch/${nextEpisode.id}`) : undefined}
              onShowToast={showToast}
            />

            {/* Episode Meta & Action Bar */}
            <WatchEpisodeMetaBar
              episode={episode}
              prevEpisode={prevEpisode}
              nextEpisode={nextEpisode}
              servers={servers}
              activeServerIndex={activeServerIndex}
              onSelectServer={(idx) => setActiveServerIndex(idx)}
              activeQuality={activeQuality}
              onSelectQuality={(q) => setActiveQuality(q)}
              onShowToast={showToast}
            />

            {/* Mobile Tab Switcher (Visible on mobile/tablet < xl) */}
            <div className="xl:hidden flex items-center justify-between bg-surface-container-low p-1.5 rounded-2xl border border-white/[0.08] shadow-md gap-1">
              <button
                type="button"
                onClick={() => setMobileTab("episodes")}
                className={`flex-1 min-h-[44px] px-2 py-2 rounded-xl font-cairo text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  mobileTab === "episodes"
                    ? "bg-primary-container text-on-primary-container shadow-md"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">playlist_play</span>
                <span>الحلقات ({animeEpisodes.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileTab("details")}
                className={`flex-1 min-h-[44px] px-2 py-2 rounded-xl font-cairo text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  mobileTab === "details"
                    ? "bg-primary-container text-on-primary-container shadow-md"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">info</span>
                <span>عن الحلقة</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileTab("comments")}
                className={`flex-1 min-h-[44px] px-2 py-2 rounded-xl font-cairo text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  mobileTab === "comments"
                    ? "bg-primary-container text-on-primary-container shadow-md"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">forum</span>
                <span>النقاشات</span>
              </button>
            </div>

            {/* Mobile Tab Content */}
            <div className="xl:hidden">
              {mobileTab === "episodes" && (
                <WatchSidebarPlaylist
                  currentEpisodeId={episode.id}
                  episodes={animeEpisodes}
                  fallbackCoverImage={anime?.coverImage}
                />
              )}
              {mobileTab === "details" && (
                <WatchEpisodeDetails
                  episode={episode}
                  castData={castData}
                />
              )}
              {mobileTab === "comments" && (
                <WatchCommentsSection
                  onShowToast={showToast}
                />
              )}
            </div>

            {/* Desktop Views (Always visible on desktop xl+) */}
            <div className="hidden xl:flex flex-col gap-space-lg">
              {/* Episode Details & Seiyuu Info */}
              <WatchEpisodeDetails
                episode={episode}
                castData={castData}
              />

              {/* Community & Comments Discussions Section */}
              <WatchCommentsSection
                onShowToast={showToast}
              />
            </div>
          </div>

          {/* Sidebar Playlist Rail Column (Desktop xl+ only) */}
          <div className="hidden xl:flex xl:col-span-4 flex-col gap-space-md w-full sticky top-24">
            <WatchSidebarPlaylist
              currentEpisodeId={episode.id}
              episodes={animeEpisodes}
              fallbackCoverImage={anime?.coverImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
