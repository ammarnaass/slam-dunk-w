import React from 'react';
import { View, Text, Image } from 'react-native';
import { Icon } from '../Icon';
import { THEME } from '../../constants/theme';
import { episodeCardStyles as styles } from './episode-card.styles';

interface EpisodeThumbnailProps {
  thumbnailUri: string;
  vipRequired: boolean;
  isPlaying: boolean;
  durationText: string;
  progress?: number;
}

export const EpisodeThumbnail: React.FC<EpisodeThumbnailProps> = ({
  thumbnailUri,
  vipRequired,
  isPlaying,
  durationText,
  progress,
}) => {
  return (
    <View style={styles.thumbnailFrame}>
      <Image
        source={{ uri: thumbnailUri }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      {/* Center Scrim: Play / Lock */}
      <View style={styles.centerScrim}>
        {vipRequired ? (
          <View style={styles.lockBadge}>
            <Icon name="lock" size={14} color={THEME.colors.onSecondaryContainer} />
          </View>
        ) : isPlaying ? (
          <View style={styles.playBadgeActive}>
            <Icon name="play_arrow" size={16} color={THEME.colors.onPrimaryContainer} filled />
          </View>
        ) : (
          <View style={styles.playBadgeInactive}>
            <Icon name="play_arrow" size={18} color={THEME.colors.white} filled />
          </View>
        )}
      </View>

      {/* Duration Badge */}
      <View style={styles.durationPill}>
        <Text style={styles.durationText}>{durationText}</Text>
      </View>

      {/* Playback progress bar */}
      {progress !== undefined && progress > 0 ? (
        <View style={styles.progressBarBase}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(100, progress * 100)}%` },
            ]}
          />
        </View>
      ) : null}
    </View>
  );
};
