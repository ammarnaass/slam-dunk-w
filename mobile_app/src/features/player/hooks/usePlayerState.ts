import { useState, useRef, useEffect, useCallback } from 'react';
import { AspectRatioMode } from '../types/player.types';
import { HUD_HIDE_TIMEOUT_MS, DEFAULT_DURATION_SECONDS } from '../constants/player.constants';
import { isNativeRCTVideoAvailable } from '../utils/player.utils';

export function usePlayerState() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(DEFAULT_DURATION_SECONDS);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('contain');

  const [volume, setVolume] = useState<number>(1.0);
  const [brightness, setBrightness] = useState<number>(0.9);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isHudVisible, setIsHudVisible] = useState<boolean>(true);
  const [isEpisodesDrawerOpen, setIsEpisodesDrawerOpen] = useState<boolean>(false);

  const hudTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHudTimer = useCallback(() => {
    if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
    if (!isLocked && isPlaying) {
      hudTimerRef.current = setTimeout(() => {
        setIsHudVisible(false);
      }, HUD_HIDE_TIMEOUT_MS);
    }
  }, [isLocked, isPlaying]);

  useEffect(() => {
    if (isHudVisible) {
      resetHudTimer();
    }
    return () => {
      if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
    };
  }, [isHudVisible, resetHudTimer]);

  // Simulated timer for platforms without native RCTVideo
  useEffect(() => {
    if (!isNativeRCTVideoAvailable() && isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1 * playbackRate;
          return next >= duration ? 0 : next;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, playbackRate, duration]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
    resetHudTimer();
  }, [resetHudTimer]);

  const toggleAspectRatio = useCallback(() => {
    setAspectRatio((prev) => {
      if (prev === 'contain') return 'cover';
      if (prev === 'cover') return 'stretch';
      return 'contain';
    });
    resetHudTimer();
  }, [resetHudTimer]);

  const toggleLock = useCallback(() => {
    setIsLocked((prev) => {
      const next = !prev;
      setIsHudVisible(!next);
      return next;
    });
  }, []);

  return {
    isPlaying,
    setIsPlaying,
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
  };
}
