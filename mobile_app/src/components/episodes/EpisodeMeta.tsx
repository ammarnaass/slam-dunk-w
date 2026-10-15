import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from '../Icon';
import { THEME } from '../../constants/theme';
import { episodeCardStyles as styles } from './episode-card.styles';

interface EpisodeMetaProps {
  epNum: number;
  isPlaying: boolean;
  freeEpisode: boolean;
  vipRequired: boolean;
  title: string;
}

export const EpisodeMeta: React.FC<EpisodeMetaProps> = ({
  epNum,
  isPlaying,
  freeEpisode,
  vipRequired,
  title,
}) => {
  return (
    <View style={styles.metaContainer}>
      <View style={styles.numberRow}>
        <Text
          style={[
            styles.episodeNumber,
            isPlaying && styles.episodeNumberActive,
          ]}
        >
          الحلقة {epNum}
        </Text>

        {freeEpisode && (
          <View style={styles.badgeFree}>
            <Text style={styles.badgeFreeText}>مجانية</Text>
          </View>
        )}

        {vipRequired && (
          <View style={styles.badgeVip}>
            <Text style={styles.badgeVipText}>VIP</Text>
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.specRow}>
        <View style={styles.micSpec}>
          <Icon name="mic" size={13} color={THEME.colors.secondary} />
          <Text style={styles.specText}>دبلجة سبيستون</Text>
        </View>
        <Text style={styles.specDot}>•</Text>
        <Text style={styles.specText}>مترجم FHD</Text>
      </View>
    </View>
  );
};
