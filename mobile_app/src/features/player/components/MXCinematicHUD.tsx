import React, { useState } from 'react';
import { View } from 'react-native';
import { AspectRatioMode } from '../types/player.types';
import { MXTopBar } from './MXTopBar';
import { MXBottomBar } from './MXBottomBar';
import { MXLockOverlay } from './MXLockOverlay';
import { MXSpeedModal } from './MXSpeedModal';
import { hudStyles } from '../styles/hud.styles';

interface MXCinematicHUDProps {
  isVisible: boolean;
  isPlaying: boolean;
  isLocked: boolean;
  title: string;
  episodeNumber: number;
  quality: string;
  currentTime: number;
  duration: number;
  playbackRate: number;
  aspectRatio: AspectRatioMode;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSkipSeconds: (seconds: number) => void;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  onToggleLock: () => void;
  onChangeRate: (rate: number) => void;
  onToggleAspectRatio: () => void;
  onOpenEpisodesDrawer: () => void;
  onBack: () => void;
}

export const MXCinematicHUD: React.FC<MXCinematicHUDProps> = ({
  isVisible,
  isPlaying,
  isLocked,
  title,
  episodeNumber,
  quality,
  currentTime,
  duration,
  playbackRate,
  aspectRatio,
  onTogglePlay,
  onSeek,
  onSkipSeconds,
  onNextEpisode,
  onPrevEpisode,
  onToggleLock,
  onChangeRate,
  onToggleAspectRatio,
  onOpenEpisodesDrawer,
  onBack,
}) => {
  const [showSpeedModal, setShowSpeedModal] = useState(false);

  if (isLocked) {
    return <MXLockOverlay isLocked={isLocked} onToggleLock={onToggleLock} />;
  }

  if (!isVisible) return null;

  return (
    <View style={hudStyles.hudOverlay} pointerEvents="box-none">
      <MXTopBar
        title={title}
        episodeNumber={episodeNumber}
        quality={quality}
        aspectRatio={aspectRatio}
        onBack={onBack}
        onToggleAspectRatio={onToggleAspectRatio}
        onToggleLock={onToggleLock}
      />

      <MXBottomBar
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        playbackRate={playbackRate}
        onTogglePlay={onTogglePlay}
        onSeek={onSeek}
        onSkipSeconds={onSkipSeconds}
        onOpenEpisodesDrawer={onOpenEpisodesDrawer}
        onOpenSpeedModal={() => setShowSpeedModal(true)}
        onNextEpisode={onNextEpisode}
        onPrevEpisode={onPrevEpisode}
      />

      <MXSpeedModal
        visible={showSpeedModal}
        currentRate={playbackRate}
        onSelectRate={onChangeRate}
        onClose={() => setShowSpeedModal(false)}
      />
    </View>
  );
};
