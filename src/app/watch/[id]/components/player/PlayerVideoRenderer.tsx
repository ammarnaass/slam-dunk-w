"use client";

import React, { RefObject } from "react";

interface PlayerVideoRendererProps {
    isDirectVideo: boolean;
    embedUrl: string;
    videoRef: RefObject<HTMLVideoElement | null>;
    currentServerUrl: string;
    episodeThumbnail?: string | null;
    episodeTitle: string;
    isPlaying: boolean;
    loading: boolean;
    onTogglePlay: () => void;
}

export function PlayerVideoRenderer({
    isDirectVideo,
    embedUrl,
    videoRef,
    currentServerUrl,
    episodeThumbnail,
    episodeTitle,
    isPlaying,
    loading,
    onTogglePlay,
}: PlayerVideoRendererProps) {
    return (
        <>
            {/* Center Big Play Button (when not playing or iframe preview) */}
            {!isPlaying && (
                <button
                    onClick={onTogglePlay}
                    className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-primary-container/90 text-on-primary-container flex items-center justify-center backdrop-blur-md shadow-[0_0_32px_rgba(220,38,38,0.7)] hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
                    id="big-play-btn"
                    aria-label="تشغيل"
                    type="button"
                >
                    <span className="material-symbols-outlined text-[44px] pr-1">play_arrow</span>
                </button>
            )}

            {/* Loading state spinner */}
            {loading && (
                <div className="absolute inset-0 z-25 bg-surface-container-lowest/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full border-3 border-primary-container border-t-transparent animate-spin" />
                    <span className="font-label-sm text-label-sm text-primary font-bold">
                        جاري تحميل سيرفر البث...
                    </span>
                </div>
            )}

            {/* Video Content Renderer */}
            {isDirectVideo ? (
                <video
                    ref={videoRef}
                    key={currentServerUrl}
                    className="w-full h-full object-contain"
                    poster={episodeThumbnail || undefined}
                    controls={false}
                    onClick={onTogglePlay}
                >
                    <source src={currentServerUrl} type="video/mp4" />
                    المتصفح لا يدعم تشغيل هذا الفيديو.
                </video>
            ) : embedUrl ? (
                <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={episodeTitle}
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-surface-container-lowest">
                    <span className="material-symbols-outlined text-5xl text-primary-container mb-2">
                        video_camera_back
                    </span>
                    <h3 className="font-headline-sm text-on-surface font-bold">سيرفر البث قيد التحضير</h3>
                    <p className="font-body-sm text-on-surface-variant max-w-sm mt-1">
                        يتم تحديث جودة الـ 4K وسيرفرات البث حالياً، يمكنك التبديل لسيرفر آخر من القائمة أدناه.
                    </p>
                </div>
            )}
        </>
    );
}
