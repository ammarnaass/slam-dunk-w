"use client";

import { useState, useRef, useEffect } from "react";

interface UseCinematicPlayerProps {
    currentServer: {
        name: string;
        url: string;
        quality?: string | null;
    };
    onShowToast: (message: string, icon?: string) => void;
}

export function useCinematicPlayer({ currentServer, onShowToast }: UseCinematicPlayerProps) {
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

    const isDirectVideo = Boolean(
        currentServer.url &&
            (currentServer.url.endsWith(".mp4") || currentServer.name.toLowerCase().includes("direct"))
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
    };
}
