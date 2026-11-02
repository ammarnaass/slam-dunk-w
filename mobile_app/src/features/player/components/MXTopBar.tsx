import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '../../../components/Icon';
import { PlayerTopBarProps } from '../types/player.types';
import { hudStyles } from '../styles/hud.styles';

export const MXTopBar: React.FC<PlayerTopBarProps> = ({
  title,
  episodeNumber,
  quality,
  aspectRatio,
  onBack,
  onToggleAspectRatio,
  onToggleLock,
}) => {
  const aspectLabel =
    aspectRatio === 'contain'
      ? '16:9 أصلي'
      : aspectRatio === 'cover'
      ? 'اقتصاص Zoom'
      : 'تمديد Stretch';

  return (
    <View style={hudStyles.topBar}>
      <TouchableOpacity style={hudStyles.headerBtn} onPress={onBack} activeOpacity={0.7}>
        <Icon name="arrowRight" size={24} color="#FFF" />
      </TouchableOpacity>

      <View style={hudStyles.titleInfo}>
        <Text style={hudStyles.episodeTitle} numberOfLines={1}>
          الحلقة {episodeNumber}: {title}
        </Text>
        <View style={hudStyles.badgeRow}>
          <View style={hudStyles.qualityBadge}>
            <Text style={hudStyles.qualityText}>{quality || '1080p FHD'}</Text>
          </View>
          <View style={hudStyles.aspectBadge}>
            <Text style={hudStyles.aspectText}>{aspectLabel}</Text>
          </View>
        </View>
      </View>

      <View style={hudStyles.headerActions}>
        <TouchableOpacity
          style={hudStyles.headerBtn}
          onPress={onToggleAspectRatio}
          activeOpacity={0.7}
        >
          <Icon name="fullscreen" size={22} color="#E2E8F0" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[hudStyles.headerBtn, hudStyles.lockBtn]}
          onPress={onToggleLock}
          activeOpacity={0.7}
        >
          <Icon name="lock_open" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
