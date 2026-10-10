import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Anime } from '../types';
import { THEME } from '../constants/theme';

interface AnimeCardProps {
  anime: Anime;
  onPress: (anime: Anime) => void;
  cardWidth?: number;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onPress, cardWidth = 155 }) => {
  const isOngoing = anime.status?.toLowerCase() === 'ongoing' || anime.status === 'مستمر';

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardWidth }]}
      onPress={() => onPress(anime)}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: anime.coverImage || anime.bannerImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTxpjOV_-f3YQQLUb_T_57HXpyZ4NIlMatMg&s' }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Top Badges */}
        <View style={styles.topBadgesRow}>
          {anime.type ? (
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{anime.type}</Text>
            </View>
          ) : <View />}

          <View style={[styles.statusBadge, isOngoing ? styles.ongoingBadge : styles.completedBadge]}>
            <View style={[styles.statusDot, isOngoing ? styles.ongoingDot : styles.completedDot]} />
            <Text style={styles.statusText}>{isOngoing ? 'مستمر' : 'مكتمل'}</Text>
          </View>
        </View>

        {/* Bottom Poster Gradient Info */}
        <View style={styles.bottomPosterInfo}>
          <View style={styles.episodesPill}>
            <Text style={styles.episodesPillText}>
              {anime.totalEpisodes ? `${anime.totalEpisodes} حلقة` : 'FHD'}
            </Text>
          </View>

          {anime.releaseYear && (
            <Text style={styles.yearText}>{anime.releaseYear}</Text>
          )}
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {anime.title}
        </Text>

        <Text style={styles.subtext} numberOfLines={1}>
          {Array.isArray(anime.genres) && anime.genres.length > 0
            ? anime.genres.join(' • ')
            : 'رياضي • إثارة • كوميديا'}
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
    marginRight: THEME.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 2 / 3,
    position: 'relative',
    backgroundColor: THEME.colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadgesRow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  typeText: {
    color: THEME.colors.white,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  ongoingBadge: {
    backgroundColor: 'rgba(14, 165, 233, 0.25)',
  },
  completedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  ongoingDot: {
    backgroundColor: THEME.colors.sky,
  },
  completedDot: {
    backgroundColor: THEME.colors.emerald,
  },
  statusText: {
    color: THEME.colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  bottomPosterInfo: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  episodesPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  episodesPillText: {
    color: THEME.colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  yearText: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  info: {
    padding: THEME.spacing.sm,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.white,
    textAlign: 'right',
  },
  subtext: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    marginTop: 2,
    textAlign: 'right',
  },
});
