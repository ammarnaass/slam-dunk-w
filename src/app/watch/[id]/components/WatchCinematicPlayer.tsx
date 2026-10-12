"use client";

import { useState, useRef, useEffect } from "react";
import { Episode } from "@/types";

interface WatchCinematicPlayerProps {
  episode: Episode & {
    anime?: { title: string };
  };
  currentServer: {
    name: string;
    url: string;
    quality?: string | null;
  };
  audioTrack: "arabic" | "japanese";
  quality: string;
  lightsOff: boolean;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export default function WatchCinematicPlayer({
  episode,
  currentServer,
  audioTrack,
  quality,
  lightsOff,
  onNextEpisode,
  onPrevEpisode,
  onShowToast
}: WatchCinematicPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(14 * 60 + 32); // Default to 14:32 for preview if iframe
  const [duration, setDuration] = useState(24 * 60 + 10); // Default to 24:10
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Parse embed URLs for Mega / 4shared
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("mega.nz/file/")) {
      const match = url.match(/mega\.nz\/file\/([^#]+)#(.+)/);
      if (match) return `https://mega.nz/embed/${match[1]}!${match[2]}`;
    }
    if (url.includes("4shared.com")) {
      const match = url.match(/4shared\.com\/(?:video|file|rar|zip|mp3)\/([^/]+)/);
      if (match) return `https://www.4shared.com/web/embed/file/${match[1]}`;
    }
    return url;
  };

  const isDirectVideo = currentServer.url && (
    currentServer.url.endsWith(".mp4") || 
    currentServer.name.toLowerCase().includes("direct")
  );

  const embedUrl = isDirectVideo ? "" : getEmbedUrl(currentServer.url);

  // Reset loading when server changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [currentServer.url]);

  // Video element event listeners if direct
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isDirectVideo) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration || 24 * 60 + 10);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [isDirectVideo]);

  const togglePlay = () => {
    if (videoRef.current && isDirectVideo) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkipIntro = () => {
    const skipSeconds = 90; // 01:30
    if (videoRef.current && isDirectVideo) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + skipSeconds, duration);
    } else {
      setCurrentTime(prev => Math.min(prev + skipSeconds, duration));
    }
    onShowToast("تم تخطي الشارة بنجاح (01:30)", "fast_forward");
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    // In RTL, 0 is at right if flipped, but rect coords are left-to-right.
    const percentage = 1 - (clickX / rect.width);
    const newTime = Math.max(0, Math.min(percentage * duration, duration));
    
    if (videoRef.current && isDirectVideo) {
      videoRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const handleRewind10 = () => {
    if (videoRef.current && isDirectVideo) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    } else {
      setCurrentTime(prev => Math.max(0, prev - 10));
    }
    onShowToast("ترجيع 10 ثوانٍ", "replay_10");
  };

  const handleForward10 = () => {
    if (videoRef.current && isDirectVideo) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
    } else {
      setCurrentTime(prev => Math.min(duration, prev + 10));
    }
    onShowToast("تقديم 10 ثوانٍ", "forward_10");
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current && isDirectVideo) {
      videoRef.current.playbackRate = nextSpeed;
    }
    onShowToast(`سرعة التشغيل: ${nextSpeed}x`, "speed");
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setShowControls(true)}
      className={`relative w-full aspect-video bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.85)] group select-none border border-white/[0.08] transition-all duration-300 ${
        lightsOff ? "z-50 shadow-[0_0_80px_rgba(220,38,38,0.4)] ring-2 ring-primary-container/40" : ""
      }`}
      id="video-player-container"
    >
      {/* Top Gradient Vignette & Badges */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface-container-lowest/90 via-surface-container-lowest/40 to-transparent p-space-md flex items-center justify-between pointer-events-none z-20 transition-opacity duration-300">
        <div className="flex items-center gap-space-xs pointer-events-auto flex-wrap">
          <span className="px-space-sm py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm tracking-widest uppercase font-extrabold shadow-[0_0_12px_rgba(220,38,38,0.6)]">
            {quality}
          </span>
          <span className="px-space-sm py-0.5 rounded bg-surface-container-high/90 text-on-surface font-label-sm text-label-sm backdrop-blur-md">
            صوت محيطي 5.1
          </span>
          <span className="px-space-sm py-0.5 rounded bg-surface-container-high/90 text-secondary font-label-sm text-label-sm flex items-center gap-1 backdrop-blur-md">
            <span className="material-symbols-outlined text-[14px]">translate</span>
            {audioTrack === "arabic" ? "دبلجة مركز الزهرة" : "ياباني أصلي + ترجمة"}
          </span>
        </div>

        {/* Watermark / Brand */}
        <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity pointer-events-auto">
          <span className="font-headline-sm text-headline-sm tracking-widest font-extrabold text-on-surface">
            ANIME<span className="text-primary-container">DAZE</span>
          </span>
          <span className="material-symbols-outlined text-primary-container text-[18px]">stream</span>
        </div>
      </div>

      {/* Skip Intro Button */}
      <button
        onClick={handleSkipIntro}
        className="absolute top-16 right-space-md sm:right-space-lg z-30 flex items-center gap-1.5 px-space-md py-space-xs rounded-full bg-surface-container-high/85 text-on-surface hover:bg-primary-container hover:text-on-primary-container backdrop-blur-xl shadow-lg transition-all duration-200 group/skip cursor-pointer border border-white/10"
        id="skip-intro-btn"
      >
        <span className="material-symbols-outlined text-[18px] group-hover/skip:animate-pulse">fast_forward</span>
        <span className="font-label-md text-label-md font-bold">تخطي الشارة (01:30)</span>
      </button>

      {/* Center Big Play Button (when not playing or iframe preview) */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-primary-container/90 text-on-primary-container flex items-center justify-center backdrop-blur-md shadow-[0_0_32px_rgba(220,38,38,0.7)] hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
          id="big-play-btn"
          aria-label="تشغيل"
        >
          <span className="material-symbols-outlined text-[44px] pr-1">play_arrow</span>
        </button>
      )}

      {/* Loading state spinner */}
      {loading && (
        <div className="absolute inset-0 z-25 bg-surface-container-lowest/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full border-3 border-primary-container border-t-transparent animate-spin" />
          <span className="font-label-sm text-label-sm text-primary font-bold">جاري تحميل سيرفر البث...</span>
        </div>
      )}

      {/* Video Content Renderer */}
      {isDirectVideo ? (
        <video
          ref={videoRef}
          key={currentServer.url}
          className="w-full h-full object-contain"
          poster={episode.thumbnail || undefined}
          controls={false}
          onClick={togglePlay}
        >
          <source src={currentServer.url} type="video/mp4" />
          المتصفح لا يدعم تشغيل هذا الفيديو.
        </video>
      ) : embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={episode.title}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-surface-container-lowest">
          <span className="material-symbols-outlined text-5xl text-primary-container mb-2">video_camera_back</span>
          <h3 className="font-headline-sm text-on-surface font-bold">سيرفر البث قيد التحضير</h3>
          <p className="font-body-sm text-on-surface-variant max-w-sm mt-1">
            يتم تحديث جودة الـ 4K وسيرفرات البث حالياً، يمكنك التبديل لسيرفر آخر من القائمة أدناه.
          </p>
        </div>
      )}

      {/* Bottom Cinematic Scrim & Controller Overlay */}
      <div 
        className={`absolute inset-x-0 bottom-0 pt-20 pb-space-sm px-space-md bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent z-20 flex flex-col gap-1 transition-opacity duration-300 ${
          showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Scrubber Timeline */}
        <div 
          onClick={handleSeek}
          className="relative w-full group/scrubber cursor-pointer py-1"
          id="timeline-rail"
        >
          {/* Background Track */}
          <div className="w-full h-1.5 bg-surface-variant/80 rounded-full overflow-hidden relative">
            {/* Buffered */}
            <div className="absolute top-0 right-0 h-full w-[85%] bg-outline-variant/60 rounded-full" />
            {/* Played */}
            <div 
              className="absolute top-0 right-0 h-full bg-primary-container rounded-full shadow-[0_0_12px_rgba(220,38,38,0.8)] transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Thumb */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 bg-on-primary-container rounded-full shadow-[0_0_10px_#dc2626] scale-0 group-hover/scrubber:scale-100 transition-transform pointer-events-none"
            style={{ right: `${progressPercent}%` }}
          />
        </div>

        {/* Playback Controls Row */}
        <div className="flex items-center justify-between gap-space-md pt-space-xs text-on-surface flex-wrap">
          {/* Right Action Group (RTL Primary Controls) */}
          <div className="flex items-center gap-space-sm sm:gap-space-md">
            <button 
              onClick={togglePlay}
              className="hover:text-primary-container transition-colors flex items-center cursor-pointer" 
              title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
            >
              <span className="material-symbols-outlined text-[28px]">
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            </button>

            {onPrevEpisode && (
              <button 
                onClick={onPrevEpisode}
                className="hover:text-primary-container transition-colors flex items-center cursor-pointer" 
                title="الحلقة السابقة"
              >
                <span className="material-symbols-outlined text-[22px]">skip_next</span>
              </button>
            )}

            <button 
              onClick={handleRewind10}
              className="hover:text-primary-container transition-colors flex items-center cursor-pointer" 
              title="ترجيع 10 ثواني"
            >
              <span className="material-symbols-outlined text-[20px]">replay_10</span>
            </button>

            <button 
              onClick={handleForward10}
              className="hover:text-primary-container transition-colors flex items-center cursor-pointer" 
              title="تقديم 10 ثواني"
            >
              <span className="material-symbols-outlined text-[20px]">forward_10</span>
            </button>

            {onNextEpisode && (
              <button 
                onClick={onNextEpisode}
                className="hover:text-primary-container transition-colors flex items-center cursor-pointer" 
                title="الحلقة التالية"
              >
                <span className="material-symbols-outlined text-[22px]">skip_previous</span>
              </button>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-1 group/vol">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-primary-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">
                  {isMuted ? "volume_off" : "volume_up"}
                </span>
              </button>
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const p = (e.clientX - rect.left) / rect.width;
                  setVolume(Math.max(0, Math.min(1, p)));
                  setIsMuted(false);
                }}
                className="w-14 h-1 bg-surface-variant rounded-full overflow-hidden hidden sm:block cursor-pointer"
              >
                <div 
                  className="h-full bg-on-surface group-hover/vol:bg-primary-container transition-colors"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
              </div>
            </div>

            {/* Timestamps */}
            <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 tracking-wider mr-space-xs font-mono">
              <span className="text-on-surface font-semibold">{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Left Action Group (Speed, Settings, PiP, Fullscreen) */}
          <div className="flex items-center gap-space-xs sm:gap-space-sm text-on-surface-variant">
            <button 
              onClick={cycleSpeed}
              className="hover:text-on-surface px-2 py-0.5 rounded bg-surface-container-high/60 text-xs font-mono font-bold transition-colors cursor-pointer"
              title="سرعة التشغيل"
            >
              {playbackSpeed}x
            </button>

            <button 
              onClick={() => onShowToast("وضع نافذة مصغرة قيد التفعيل", "picture_in_picture_alt")}
              className="hover:text-on-surface p-1 rounded transition-colors hidden sm:inline-flex cursor-pointer" 
              title="وضع نافذة مصغرة (PIP)"
            >
              <span className="material-symbols-outlined text-[20px]">picture_in_picture_alt</span>
            </button>

            <button 
              onClick={toggleFullscreen}
              className="hover:text-on-surface p-1 rounded transition-colors cursor-pointer" 
              title="وضع ملء الشاشة"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isFullscreen ? "fullscreen_exit" : "fullscreen"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
