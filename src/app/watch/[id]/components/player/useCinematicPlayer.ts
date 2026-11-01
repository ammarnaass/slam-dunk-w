"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { resolveStreamUrl } from "@/lib/resolvers";

interface UseCinematicPlayerProps {
    currentServer: {
        id?: string;
        name: string;
        url: string;
        directUrl?: string | null;
        quality?: string | null;
        type?: string;
        isWorking?: boolean;
    };
    initialTime?: number;
    onAutoFailover?: (currentTime: number) => void;
    onShowToast: (message: string, icon?: string) => void;
}

export function useCinematicPlayer({
    currentServer,
    initialTime = 0,
    onAutoFailover,
    onShowToast,
}: UseCinematicPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(initialTime > 0 ? initialTime : 14 * 60 + 32);
    const [duration, setDuration] = useState(24 * 60 + 10);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const currentTimeRef = useRef(currentTime);
    useEffect(() => {
        currentTimeRef.current = currentTime;
    }, [currentTime]);

    // Resolve URL through the smart resolver engine
    const resolved = resolveStreamUrl(currentServer.url || "", currentServer.quality || undefined);
    
    // Direct playable: either MP4 / HLS direct stream or Dropbox raw=1 direct link
    const isDirectVideo = Boolean(
        resolved.isDirectPlayable ||
        (currentServer.url && (currentServer.url.endsWith(".mp4") || currentServer.url.includes("raw=1") || currentServer.url.includes(".m3u8")))
    );

    const effectiveStreamUrl = resolved.directUrl || currentServer.url;
    const embedUrl = isDirectVideo ? "" : (resolved.embedUrl || currentServer.url);

    // Failover handler triggered on video or network failure
    const triggerFailover = useCallback(() => {
        if (onAutoFailover) {
            onShowToast("جاري التبديل التلقائي إلى خادم بديل...", "autorenew");
            onAutoFailover(currentTimeRef.current);
        }
    }, [onAutoFailover, onShowToast]);

    // Reset loading and restore playback position when server changes
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
            if (videoRef.current && isDirectVideo && currentTimeRef.current > 0) {
                try {
                    videoRef.current.currentTime = currentTimeRef.current;
                } catch {
                    // Ignore if metadata not loaded yet
                }
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [currentServer.url, isDirectVideo]);

    // Video element event listeners if direct
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isDirectVideo) return;

        const handleTimeUpdate = () => setCurrentTime(video.currentTime);
        const handleLoadedMetadata = () => {
            setDuration(video.duration || 24 * 60 + 10);
            if (currentTimeRef.current > 0) {
                video.currentTime = Math.min(currentTimeRef.current, video.duration || currentTimeRef.current);
            }
        };
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleError = () => {
            console.warn("Video playback error on current server:", currentServer.name);
            triggerFailover();
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);
        video.addEventListener("error", handleError);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
            video.removeEventListener("error", handleError);
        };
    }, [isDirectVideo, triggerFailover, currentServer.name]);

    const togglePlay = () => {
        if (videoRef.current && isDirectVideo) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(() => {
                    // Autoplay restriction or format error
                });
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
        const percentage = 1 - clickX / rect.width;
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

    return {
        containerRef,
        videoRef,
        isPlaying,
        currentTime,
        duration,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
        playbackSpeed,
        isFullscreen,
        loading,
        showControls,
        setShowControls,
        isDirectVideo,
        effectiveStreamUrl,
        embedUrl,
        progressPercent,
        togglePlay,
        handleSkipIntro,
        handleSeek,
        handleRewind10,
        handleForward10,
        cycleSpeed,
        toggleFullscreen,
        formatTime,
        triggerFailover,
    };
}
