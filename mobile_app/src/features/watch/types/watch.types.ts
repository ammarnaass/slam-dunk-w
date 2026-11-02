import { Episode } from '../../../types';

export type ServerCategoryTab = 'direct' | 'embed' | 'download';

export type AudioTrackType = 'dub' | 'sub';

export interface ServerOption {
  id: string;
  name: string;
  desc: string;
  url?: string;
  directUrl?: string;
  downloadUrl?: string;
  category?: 'streaming' | 'download' | 'both';
  matrixCategory?: 'direct' | 'embed' | 'download';
  provider?: string;
  ping?: string;
  isWorking?: boolean;
}

export interface CommentItem {
  id: string;
  userName: string;
  avatar: string;
  isVip: boolean;
  timeAgo: string;
  content: string;
  likes: number;
  isLiked?: boolean;
}

export interface WatchModalProps {
  visible: boolean;
  episode: Episode | null;
  onClose: () => void;
  onNextEpisode?: () => void;
}

export interface WatchPlayerHeaderProps {
  onClose: () => void;
  onShare: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export interface WatchEpisodeInfoProps {
  episode: Episode;
  epNum: number;
  nextEpNum: number;
  onNextEpisode?: () => void;
  onShare: () => void;
}

export interface WatchCommentsPanelProps {
  comments: CommentItem[];
  epNum: number;
  newComment: string;
  onNewCommentChange: (text: string) => void;
  onSendComment: () => void;
  onToggleLike: (id: string) => void;
}
