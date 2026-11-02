import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import {
  PROGRESS_SYNC_INTERVAL_SECONDS,
  LOCAL_TIMER_INTERVAL_MS,
} from '../constants/watch.constants';

interface UseWatchProgressParams {
  episodeId: string;
  totalDurationSeconds: number;
  visible: boolean;
  isPlaying: boolean;
}

export function useWatchProgress({
  episodeId,
  totalDurationSeconds,
  visible,
  isPlaying,
}: UseWatchProgressParams) {
  const { continueWatching, syncProgress } = useAppStore();
  const [positionSeconds, setPositionSeconds] = useState(0);

  const lastSyncedPositionRef = useRef(positionSeconds);

  // Initialize progress from existing continue watching entry
  useEffect(() => {
    if (!episodeId || !visible) return;

    const existing = continueWatching.find(
      (cw) => cw.episodeId === episodeId || cw.episode?.id === episodeId
    );
    if (existing?.positionSeconds) {
      setPositionSeconds(existing.positionSeconds);
    } else {
      setPositionSeconds(0);
    }
  }, [episodeId, visible, continueWatching]);

  // Local simulated progress increment while playing
  useEffect(() => {
    if (!visible || !episodeId || !isPlaying) return;

    const timer = setInterval(() => {
      setPositionSeconds((prev) => {
        const next = prev + 5;
        return next > totalDurationSeconds ? totalDurationSeconds : next;
      });
    }, LOCAL_TIMER_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [visible, episodeId, isPlaying, totalDurationSeconds]);

  // Sync to API periodically
  useEffect(() => {
    if (!visible || !episodeId || positionSeconds <= 0) return;

    if (
      Math.abs(positionSeconds - lastSyncedPositionRef.current) >=
      PROGRESS_SYNC_INTERVAL_SECONDS
    ) {
      lastSyncedPositionRef.current = positionSeconds;
      syncProgress(episodeId, positionSeconds, totalDurationSeconds);
    }
  }, [positionSeconds, visible, episodeId, totalDurationSeconds, syncProgress]);

  const forceSync = useCallback(() => {
    if (episodeId && positionSeconds > 0) {
      syncProgress(episodeId, positionSeconds, totalDurationSeconds);
    }
  }, [episodeId, positionSeconds, totalDurationSeconds, syncProgress]);

  return {
    positionSeconds,
    setPositionSeconds,
    forceSync,
  };
}
