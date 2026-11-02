import { UIManager } from 'react-native';
import { ResizeMode } from 'react-native-video';
import { AspectRatioMode } from '../types/player.types';

export function isNativeRCTVideoAvailable(): boolean {
  return Boolean(
    UIManager.getViewManagerConfig?.('RCTVideo') ||
    (UIManager as any)['RCTVideo']
  );
}

export function isDirectStreamUrl(url?: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.endsWith('.mp4') ||
    lower.endsWith('.m3u8') ||
    lower.endsWith('.mkv') ||
    lower.includes('googleapis.com') ||
    lower.includes('cdn') ||
    lower.includes('stream')
  );
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.floor(Math.max(0, seconds) % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const RESIZE_MODE_MAP: Record<AspectRatioMode, ResizeMode> = {
  contain: ResizeMode.CONTAIN,
  cover: ResizeMode.COVER,
  stretch: ResizeMode.STRETCH,
};
