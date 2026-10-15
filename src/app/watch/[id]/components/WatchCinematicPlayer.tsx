"use client";

import { Episode } from "@/types";
import {
    useCinematicPlayer,
    PlayerTopVignette,
    PlayerSkipIntroButton,
    PlayerVideoRenderer,
    PlayerControlsScrim,
} from "./player";

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
    onShowToast,
}: WatchCinematicPlayerProps) {
    const {
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
    } = useCinematicPlayer({ currentServer, onShowToast });

    return (
        <div
            ref={containerRef}
            onMouseEnter={() => setShowControls(true)}
            className={`relative w-full aspect-video bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.85)] group select-none border border-white/[0.08] transition-all duration-300 ${
                lightsOff
                    ? "z-50 shadow-[0_0_80px_rgba(220,38,38,0.4)] ring-2 ring-primary-container/40"
                    : ""
            }`}
            id="video-player-container"
        >
            {/* Top Gradient Vignette & Badges */}
            <PlayerTopVignette quality={quality} audioTrack={audioTrack} />

            {/* Skip Intro Button */}
            <PlayerSkipIntroButton onSkip={handleSkipIntro} />

            {/* Video Content Renderer & Big Play & Loading */}
            <PlayerVideoRenderer
                isDirectVideo={isDirectVideo}
                embedUrl={embedUrl}
                videoRef={videoRef}
                currentServerUrl={currentServer.url}
                episodeThumbnail={episode.thumbnail}
                episodeTitle={episode.title}
                isPlaying={isPlaying}
                loading={loading}
                onTogglePlay={togglePlay}
            />

            {/* Bottom Cinematic Scrim & Controller Overlay */}
            <PlayerControlsScrim
                showControls={showControls}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                progressPercent={progressPercent}
                volume={volume}
                isMuted={isMuted}
                playbackSpeed={playbackSpeed}
                isFullscreen={isFullscreen}
                onTogglePlay={togglePlay}
                onSeek={handleSeek}
                onRewind10={handleRewind10}
                onForward10={handleForward10}
                onPrevEpisode={onPrevEpisode}
                onNextEpisode={onNextEpisode}
                onToggleMute={() => setIsMuted(!isMuted)}
                onVolumeChange={(v) => {
                    setVolume(v);
                    setIsMuted(false);
                }}
                onCycleSpeed={cycleSpeed}
                onToggleFullscreen={toggleFullscreen}
                onShowToast={onShowToast}
                formatTime={formatTime}
            />
        </div>
    );
}
