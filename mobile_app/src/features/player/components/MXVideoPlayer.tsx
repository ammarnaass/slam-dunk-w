import React, { useRef, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { MXVideoPlayerProps } from '../types/player.types';
import { DEMO_DIRECT_STREAM } from '../constants/player.constants';
import {
  isNativeRCTVideoAvailable,
  isDirectStreamUrl,
  RESIZE_MODE_MAP,
} from '../utils/player.utils';
import { usePlayerState } from '../hooks/usePlayerState';
import { MXGestureOverlay } from './MXGestureOverlay';
import { MXCinematicHUD } from './MXCinematicHUD';
import { MXEpisodesDrawer } from './MXEpisodesDrawer';
import { MXSimulatedCanvas } from './MXSimulatedCanvas';
import { MXCloudFallback } from './MXCloudFallback';
import { playerStyles } from '../styles/player.styles';

export const MXVideoPlayer: React.FC<MXVideoPlayerProps> = ({
  episode,
  allEpisodes = [],
  videoUrl,
  serverName,
  onClose,
  onEpisodeChange,
  onProgressUpdate,
}) => {
  const videoRef = useRef<VideoRef | null>(null);

  const isDirect = isDirectStreamUrl(videoUrl);
  const [useDemoStream, setUseDemoStream] = useState<boolean>(!isDirect);
  const activeStreamUrl = useDemoStream ? DEMO_DIRECT_STREAM : videoUrl;
  const isNativeRCTAvailable = isNativeRCTVideoAvailable();

  const {
    isPlaying,
    isBuffering,
    setIsBuffering,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    playbackRate,
    setPlaybackRate,
    aspectRatio,
    volume,
    setVolume,
    brightness,
    setBrightness,
    isLocked,
    isHudVisible,
    setIsHudVisible,
    isEpisodesDrawerOpen,
    setIsEpisodesDrawerOpen,
    resetHudTimer,
    togglePlay,
    toggleAspectRatio,
    toggleLock,
  } = usePlayerState();

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    videoRef.current?.seek(newTime);
    resetHudTimer();
  };

  const handleSkipSeconds = (deltaSeconds: number) => {
    const target = Math.max(0, Math.min(duration, currentTime + deltaSeconds));
    handleSeek(target);
  };

  const currentEpIndex = allEpisodes.findIndex((e) => e.id === episode.id);
  const prevEp = currentEpIndex > 0 ? allEpisodes[currentEpIndex - 1] : undefined;
  const nextEp = currentEpIndex < allEpisodes.length - 1 ? allEpisodes[currentEpIndex + 1] : undefined;

  return (
    <View style={playerStyles.container}>
      {/* 1. Video Layer / Simulated Canvas / Cloud Fallback */}
      {isDirect || useDemoStream ? (
        isNativeRCTAvailable ? (
          <Video
            ref={videoRef}
            source={{ uri: activeStreamUrl }}
            style={playerStyles.videoPlayer}
            resizeMode={RESIZE_MODE_MAP[aspectRatio]}
            rate={playbackRate}
            volume={volume}
            paused={!isPlaying}
            onLoad={(data) => {
              setDuration(data.duration || 1410);
              setIsBuffering(false);
            }}
            onProgress={(data) => {
              setCurrentTime(data.currentTime);
              onProgressUpdate?.(data.currentTime, data.seekableDuration || duration);
            }}
            onBuffer={({ isBuffering: buffering }) => setIsBuffering(buffering)}
            onError={() => setIsBuffering(false)}
            repeat={false}
          />
        ) : (
          <MXSimulatedCanvas thumbnail={episode.thumbnail} aspectRatio={aspectRatio} />
        )
      ) : (
        <MXCloudFallback
          episode={episode}
          serverName={serverName}
          videoUrl={videoUrl}
          onUseDemoStream={() => setUseDemoStream(true)}
        />
      )}

      {/* Buffering Indicator */}
      {isBuffering && (
        <View style={playerStyles.bufferingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={playerStyles.bufferingText}>جارٍ تحميل البث السينمائي...</Text>
        </View>
      )}

      {/* 2. Gestures Layer */}
      {(isDirect || useDemoStream) && (
        <MXGestureOverlay
          duration={duration}
          currentTime={currentTime}
          volume={volume}
          brightness={brightness}
          isLocked={isLocked}
          onSeek={handleSeek}
          onVolumeChange={setVolume}
          onBrightnessChange={setBrightness}
          onSingleTap={() => {
            setIsHudVisible((prev) => !prev);
            resetHudTimer();
          }}
          onDoubleTapSkip={(direction) =>
            handleSkipSeconds(direction === 'forward' ? 10 : -10)
          }
        />
      )}

      {/* 3. Cinematic In-Player HUD */}
      <MXCinematicHUD
        isVisible={isHudVisible}
        isPlaying={isPlaying}
        isLocked={isLocked}
        title={episode.title}
        episodeNumber={episode.episode_number || episode.episodeNumber || 1}
        quality="1080p FHD"
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        aspectRatio={aspectRatio}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
        onSkipSeconds={handleSkipSeconds}
        onNextEpisode={nextEp && onEpisodeChange ? () => onEpisodeChange(nextEp) : undefined}
        onPrevEpisode={prevEp && onEpisodeChange ? () => onEpisodeChange(prevEp) : undefined}
        onToggleLock={toggleLock}
        onChangeRate={setPlaybackRate}
        onToggleAspectRatio={toggleAspectRatio}
        onOpenEpisodesDrawer={() => setIsEpisodesDrawerOpen(true)}
        onBack={onClose}
      />

      {/* 4. In-Player Episodes Drawer */}
      {allEpisodes.length > 0 && (
        <MXEpisodesDrawer
          visible={isEpisodesDrawerOpen}
          episodes={allEpisodes}
          currentEpisodeId={episode.id}
          onSelectEpisode={(ep) => onEpisodeChange?.(ep)}
          onClose={() => setIsEpisodesDrawerOpen(false)}
        />
      )}
    </View>
  );
};
