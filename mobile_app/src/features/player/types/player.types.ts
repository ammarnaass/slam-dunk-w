import { Episode } from '../../../types';

export type AspectRatioMode = 'contain' | 'cover' | 'stretch';

export type ActiveGestureType = 'none' | 'brightness' | 'volume' | 'seek';

export type DoubleTapDirection = 'forward' | 'backward';

export interface MXVideoPlayerProps {
  episode: Episode;
  allEpisodes?: Episode[];
  videoUrl: string;
  serverName: string;
  onClose: () => void;
  onEpisodeChange?: (newEpisode: Episode) => void;
  onProgressUpdate?: (currentTime: number, duration: number) => void;
}

export interface PlayerTopBarProps {
  title: string;
  episodeNumber: number;
  quality: string;
  aspectRatio: AspectRatioMode;
  onBack: () => void;
  onToggleAspectRatio: () => void;
  onToggleLock: () => void;
}

export interface PlayerBottomBarProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  playbackRate: number;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSkipSeconds: (seconds: number) => void;
  onOpenEpisodesDrawer: () => void;
  onOpenSpeedModal: () => void;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
}

export interface EpisodesDrawerProps {
  visible: boolean;
  episodes: Episode[];
  currentEpisodeId: string;
  onSelectEpisode: (episode: Episode) => void;
  onClose: () => void;
}
