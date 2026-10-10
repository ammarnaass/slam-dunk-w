import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Episode } from '../types';
import { THEME } from '../constants/theme';

interface EpisodeCardProps {
  episode: Episode;
  onPress: (episode: Episode) => void;
  horizontal?: boolean;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  onPress,
  horizontal = false,
}) => {
  const epNum = episode.episode_number || episode.episodeNumber || (episode.title.match(/\d+/) ? episode.title.match(/\d+/)![0] : '1');

  // Fallback thumbnail if empty or placeholder
  let imageUri = episode.thumbnail;
  if (!imageUri || imageUri === '/logoep.jpg') {
    imageUri = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTxpjOV_-f3YQQLUb_T_57HXpyZ4NIlMatMg&s';
  }

  return (
    <TouchableOpacity
      style={[styles.container, horizontal && styles.horizontalContainer]}
      onPress={() => onPress(episode)}
      activeOpacity={0.85}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        {/* Play Overlay */}
        <View style={styles.playOverlay}>
          <View style={styles.playButtonCircle}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>

        {/* Top Badges */}
        <View style={styles.episodeBadge}>
          <Text style={styles.episodeBadgeText}>الحلقة {epNum}</Text>
        </View>

        {episode.duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{episode.duration}</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {episode.title}
        </Text>
        <Text style={styles.animeTitle} numberOfLines={1}>
          {episode.animeTitle || 'سلام دانك (Slam Dunk)'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginBottom: THEME.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  horizontalContainer: {
    width: 210,
    marginRight: THEME.spacing.md,
    marginBottom: 0,
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
    backgroundColor: THEME.colors.surface,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  playIcon: {
    color: THEME.colors.white,
    fontSize: 14,
    marginLeft: 2,
  },
  episodeBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  episodeBadgeText: {
    color: THEME.colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  durationText: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  info: {
    padding: THEME.spacing.sm,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.white,
    textAlign: 'right',
  },
  animeTitle: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 2,
    textAlign: 'right',
  },
});
