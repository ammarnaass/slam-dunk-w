import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../../constants/theme';
import { Icon } from '../../../components/Icon';
import { WatchEpisodeInfoProps } from '../types/watch.types';
import { infoStyles } from '../styles/info.styles';

export const WatchEpisodeInfo: React.FC<WatchEpisodeInfoProps> = ({
  episode,
  epNum,
  nextEpNum,
  onNextEpisode,
  onShare,
}) => {
  return (
    <View style={infoStyles.episodeInfoPanel}>
      <View style={infoStyles.infoTagsRow}>
        <View style={infoStyles.seasonTag}>
          <Text style={infoStyles.seasonTagText}>الموسم 1</Text>
        </View>

        <View style={infoStyles.genreTag}>
          <Text style={infoStyles.genreTagText}>رياضي / إثارة</Text>
        </View>

        <View style={infoStyles.ratingTag}>
          <Icon name="star" size={14} color={THEME.colors.secondary} filled />
          <Text style={infoStyles.ratingTagText}>8.9</Text>
        </View>
      </View>

      <Text style={infoStyles.epMainTitle}>
        الحلقة {epNum}: {episode.title}
      </Text>

      <Text style={infoStyles.epSynopsis} numberOfLines={3}>
        {episode.description ||
          'مباراة مشتعلة تقترب من نهايتها وحسان يحاول السيطرة على المرتدات تحت السلة في مواجهة صعبة أمام لاعبي الخصم الكبار.'}
      </Text>

      <View style={infoStyles.actionsBar}>
        {onNextEpisode && nextEpNum <= 101 && (
          <TouchableOpacity
            style={infoStyles.nextEpBtn}
            onPress={onNextEpisode}
            activeOpacity={0.85}
          >
            <Icon name="fast_forward" size={20} color={THEME.colors.onPrimaryContainer} />
            <Text style={infoStyles.nextEpText}>الحلقة التالية ({nextEpNum})</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={infoStyles.shareActionBtn}
          onPress={onShare}
          activeOpacity={0.7}
        >
          <Icon name="share" size={20} color={THEME.colors.onSurface} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
