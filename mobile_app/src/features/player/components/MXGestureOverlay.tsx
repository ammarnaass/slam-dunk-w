import React from 'react';
import { View } from 'react-native';
import { DoubleTapDirection } from '../types/player.types';
import { usePlayerGestures } from '../hooks/usePlayerGestures';
import { MXGestureIndicators } from './MXGestureIndicators';
import { MXDoubleTapRipple } from './MXDoubleTapRipple';
import { gestureStyles } from '../styles/gesture.styles';

interface MXGestureOverlayProps {
  duration: number;
  currentTime: number;
  volume: number;
  brightness: number;
  isLocked: boolean;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onBrightnessChange: (brightness: number) => void;
  onSingleTap: () => void;
  onDoubleTapSkip: (direction: DoubleTapDirection) => void;
  children?: React.ReactNode;
}

export const MXGestureOverlay: React.FC<MXGestureOverlayProps> = ({
  duration,
  currentTime,
  volume,
  brightness,
  isLocked,
  onSeek,
  onVolumeChange,
  onBrightnessChange,
  onSingleTap,
  onDoubleTapSkip,
  children,
}) => {
  const {
    panHandlers,
    activeGesture,
    seekOffset,
    doubleTapSide,
    rippleOpacity,
  } = usePlayerGestures({
    duration,
    currentTime,
    volume,
    brightness,
    isLocked,
    onSeek,
    onVolumeChange,
    onBrightnessChange,
    onSingleTap,
    onDoubleTapSkip,
  });

  return (
    <View style={gestureStyles.container} {...panHandlers}>
      {children}

      <MXGestureIndicators
        activeGesture={activeGesture}
        volume={volume}
        brightness={brightness}
        seekOffset={seekOffset}
        currentTime={currentTime}
        duration={duration}
      />

      <MXDoubleTapRipple side={doubleTapSide} opacity={rippleOpacity} />
    </View>
  );
};
