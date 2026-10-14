import React from 'react';
import { THEME } from '../constants/theme';
import { renderNavigationIcon, IconRenderContext } from './icons/NavigationIcons';
import { renderMediaIcon } from './icons/MediaIcons';
import { renderActionIcon } from './icons/ActionIcons';
import { renderFeatureIcon } from './icons/FeatureIcons';

export type IconName =
  | 'home'
  | 'tv'
  | 'movie'
  | 'user'
  | 'person'
  | 'account_circle'
  | 'basketball'
  | 'search'
  | 'play'
  | 'play_arrow'
  | 'pause'
  | 'flame'
  | 'local_fire_department'
  | 'star'
  | 'stars'
  | 'arrowLeft'
  | 'arrowRight'
  | 'arrow_forward'
  | 'arrow-forward'
  | 'arrow_back'
  | 'arrow-right'
  | 'chevronLeft'
  | 'chevronRight'
  | 'check'
  | 'close'
  | 'server'
  | 'dns'
  | 'filter'
  | 'tune'
  | 'sort'
  | 'sparkles'
  | 'settings'
  | 'download'
  | 'download_for_offline'
  | 'download-for-offline'
  | 'tool'
  | 'crown'
  | 'workspace_premium'
  | 'bell'
  | 'notifications'
  | 'clock'
  | 'schedule'
  | 'share'
  | 'bookmark'
  | 'bookmark_add'
  | 'bookmark-add'
  | 'bookmark_border'
  | 'heart'
  | 'favorite'
  | 'chat'
  | 'forum'
  | 'trash'
  | 'lock'
  | 'lock_open'
  | 'lock-open'
  | 'verified'
  | 'wifiOff'
  | 'radar'
  | 'shield-check'
  | 'film'
  | 'video_library'
  | 'video-library'
  | 'arrow-up-down'
  | 'swap_vert'
  | 'swap-vert'
  | 'users'
  | 'more-vertical'
  | 'more_vert'
  | 'more_horiz'
  | 'thumbs-up'
  | 'thumb_up'
  | 'reply'
  | 'compass'
  | 'explore'
  | 'play-circle'
  | 'mic'
  | 'zap'
  | 'bolt'
  | 'cloud_sync'
  | 'memory'
  | 'checklist'
  | 'grid_view'
  | 'view_agenda'
  | 'format_quote'
  | 'cached'
  | 'flag'
  | 'sentiment_satisfied'
  | 'replay_10'
  | 'forward_10'
  | 'volume_up'
  | 'fullscreen'
  | 'done_all'
  | 'history'
  | 'photo_camera'
  | 'calendar_month'
  | 'cleaning_services'
  | 'auto_delete'
  | 'sync_saved_locally'
  | 'offline_pin'
  | 'check_box'
  | 'check_box_outline_blank'
  | 'delete'
  | 'delete_sweep'
  | 'delete_forever'
  | 'check_circle'
  | 'sports_basketball'
  | 'search_insights'
  | 'swords'
  | 'translate'
  | 'visibility'
  | 'visibility_off'
  | 'mail'
  | 'alternate_email'
  | 'badge'
  | 'lock_reset'
  | 'rocket_launch'
  | 'login'
  | 'logout'
  | 'devices'
  | 'fast_forward'
  | 'hd'
  | 'sports_mma'
  | 'psychology'
  | 'history_edu'
  | 'verified_user'
  | 'signal_cellular_alt_2_bar'
  | 'cloud_download'
  | 'notifications_active'
  | 'record_voice_over'
  | 'category'
  | 'auto_awesome'
  | 'hotel_class';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 22,
  color = THEME.colors.text,
  strokeWidth = 2,
  filled = false,
}) => {
  const ctx: IconRenderContext = {
    size,
    color,
    strokeWidth,
    filled,
    containerStyle: {
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  const node =
    renderNavigationIcon(name, ctx) ||
    renderMediaIcon(name, ctx) ||
    renderActionIcon(name, ctx) ||
    renderFeatureIcon(name, ctx);

  return <>{node}</>;
};
