"use client";

import React from "react";

interface PlayerControlsScrimProps {
    showControls: boolean;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    progressPercent: number;
    volume: number;
    isMuted: boolean;
    playbackSpeed: number;
    isFullscreen: boolean;
    onTogglePlay: () => void;
    onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
    onRewind10: () => void;
    onForward10: () => void;
    onPrevEpisode?: () => void;
    onNextEpisode?: () => void;
    onToggleMute: () => void;
    onVolumeChange: (vol: number) => void;
    onCycleSpeed: () => void;
    onToggleFullscreen: () => void;
    onShowToast: (message: string, icon?: string) => void;
    formatTime: (secs: number) => string;
}

export function PlayerControlsScrim({
    showControls,
    isPlaying,
    currentTime,
    duration,
    progressPercent,
    volume,
    isMuted,
    playbackSpeed,
    isFullscreen,
    onTogglePlay,
    onSeek,
    onRewind10,
    onForward10,
    onPrevEpisode,
    onNextEpisode,
    onToggleMute,
    onVolumeChange,
    onCycleSpeed,
    onToggleFullscreen,
    onShowToast,
    formatTime,
}: PlayerControlsScrimProps) {
    return (
        <div
            className={`absolute inset-x-0 bottom-0 pt-20 pb-space-sm px-space-md bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent z-20 flex flex-col gap-1 transition-opacity duration-300 ${
                showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
        >
            {/* Scrubber Timeline */}
            <div
                onClick={onSeek}
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
                        onClick={onTogglePlay}
                        className="hover:text-primary-container transition-colors flex items-center cursor-pointer"
                        title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                        type="button"
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
                            type="button"
                        >
                            <span className="material-symbols-outlined text-[22px]">skip_next</span>
                        </button>
                    )}

                    <button
                        onClick={onRewind10}
                        className="hover:text-primary-container transition-colors flex items-center cursor-pointer"
                        title="ترجيع 10 ثواني"
                        type="button"
                    >
                        <span className="material-symbols-outlined text-[20px]">replay_10</span>
                    </button>

                    <button
                        onClick={onForward10}
                        className="hover:text-primary-container transition-colors flex items-center cursor-pointer"
                        title="تقديم 10 ثواني"
                        type="button"
                    >
                        <span className="material-symbols-outlined text-[20px]">forward_10</span>
                    </button>

                    {onNextEpisode && (
                        <button
                            onClick={onNextEpisode}
                            className="hover:text-primary-container transition-colors flex items-center cursor-pointer"
                            title="الحلقة التالية"
                            type="button"
                        >
                            <span className="material-symbols-outlined text-[22px]">skip_previous</span>
                        </button>
                    )}

                    {/* Volume Control */}
                    <div className="flex items-center gap-1 group/vol">
                        <button
                            onClick={onToggleMute}
                            className="hover:text-primary-container transition-colors cursor-pointer"
                            type="button"
                        >
                            <span className="material-symbols-outlined text-[22px]">
                                {isMuted ? "volume_off" : "volume_up"}
                            </span>
                        </button>
                        <div
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const p = (e.clientX - rect.left) / rect.width;
                                onVolumeChange(Math.max(0, Math.min(1, p)));
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
                        onClick={onCycleSpeed}
                        className="hover:text-on-surface px-2 py-0.5 rounded bg-surface-container-high/60 text-xs font-mono font-bold transition-colors cursor-pointer"
                        title="سرعة التشغيل"
                        type="button"
                    >
                        {playbackSpeed}x
                    </button>

                    <button
                        onClick={() => onShowToast("وضع نافذة مصغرة قيد التفعيل", "picture_in_picture_alt")}
                        className="hover:text-on-surface p-1 rounded transition-colors hidden sm:inline-flex cursor-pointer"
                        title="وضع نافذة مصغرة (PIP)"
                        type="button"
                    >
                        <span className="material-symbols-outlined text-[20px]">picture_in_picture_alt</span>
                    </button>

                    <button
                        onClick={onToggleFullscreen}
                        className="hover:text-on-surface p-1 rounded transition-colors cursor-pointer"
                        title="وضع ملء الشاشة"
                        type="button"
                    >
                        <span className="material-symbols-outlined text-[24px]">
                            {isFullscreen ? "fullscreen_exit" : "fullscreen"}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
