import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { THEME } from '../constants/theme';
import { Anime } from '../types';
import { Icon } from './Icon';

interface AnimeCardProps {
  anime: Anime;
  onPress: (anime: Anime) => void;
  width?: number;
  cardWidth?: number;
  style?: any;
  showDetails?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - THEME.spacing.margin * 2 - CARD_GAP) / 2;

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  onPress,
  width,
  cardWidth,
  style,
  showDetails = true,
}) => {
  const finalWidth = cardWidth || width || CARD_WIDTH;
  const isVip = anime.type === 'vip' || anime.ageRating === 'VIP' || anime.id === 'slam-dunk';
  const isOngoing = anime.status === 'ongoing' || anime.status === 'مستمر';
  const isCompleted = anime.status === 'completed' || anime.status === 'مكتمل';
  const ratingValue = anime.rating || 9.4;
  const epCount = anime.totalEpisodes || (anime.episodes ? anime.episodes.length : 101);

  return (
    <TouchableOpacity
      style={[styles.container, { width: finalWidth }, style]}
      onPress={() => onPress(anime)}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={anime.title}
    >
      {/* 2:3 Poster Frame */}
      <View style={[styles.posterFrame, { width: finalWidth, height: finalWidth * 1.5 }]}>
        <Image
          source={{ uri: anime.coverImage || anime.bannerImage }}
          style={styles.poster}
          resizeMode="cover"
        />

        {/* Top Badges Row */}
        <View style={styles.topBadgesRow}>
          {/* Resolution Badge */}
          <View style={styles.badgeQuality}>
            <Text style={styles.badgeQualityText}>
              {isVip ? '1080p' : 'FHD'}
            </Text>
          </View>

          {/* VIP or Status Badge */}
          {isVip ? (
            <View style={styles.badgeVip}>
              <Text style={styles.badgeVipText}>VIP</Text>
            </View>
          ) : isOngoing ? (
            <View style={styles.badgeOngoing}>
              <View style={styles.ongoingDot} />
              <Text style={styles.badgeOngoingText}>مستمر</Text>
            </View>
          ) : isCompleted ? (
            <View style={styles.badgeCompleted}>
              <Text style={styles.badgeCompletedText}>مكتمل</Text>
            </View>
          ) : null}
        </View>

        {/* Bottom Vignette Overlay with Score and Ep Count */}
        <View style={styles.scrimBottom}>
          <View style={styles.scorePill}>
            <Icon name="star" size={13} color={THEME.colors.secondary} filled />
            <Text style={styles.scoreText}>{ratingValue.toFixed(1)}</Text>
          </View>

          <View style={styles.epPill}>
            <Text style={styles.epText}>{epCount} حلقة</Text>
          </View>
        </View>
      </View>

      {/* Card Info Details */}
      {showDetails && (
        <View style={styles.detailsContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {anime.title}
          </Text>

          <Text style={styles.genres} numberOfLines={1}>
            {anime.genres && anime.genres.length > 0
              ? anime.genres.slice(0, 3).join(' • ')
              : 'رياضي • كلاسيكي • سبيستون'}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.dubTag}>
              <Text style={styles.dubTagText}>
                {anime.studio || 'مدبلج + مترجم'}
              </Text>
            </View>

            <Text style={styles.yearText}>
              {anime.releaseYear || 1993}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderRadius: THEME.radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: THEME.spacing.spaceMd,
  },
  posterFrame: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: THEME.colors.surfaceContainerHighest,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  topBadgesRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  badgeQuality: {
    backgroundColor: 'rgba(10, 14, 22, 0.88)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeQualityText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  badgeVip: {
    backgroundColor: THEME.colors.secondaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    shadowColor: THEME.colors.secondaryContainer,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 3,
  },
  badgeVipText: {
    color: THEME.colors.onSecondary,
    fontSize: 10,
    fontWeight: '900',
  },
  badgeOngoing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ongoingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFF',
  },
  badgeOngoingText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  badgeCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeCompletedText: {
    color: THEME.colors.onSurface,
    fontSize: 9,
    fontWeight: '600',
  },
  scrimBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 52,
    backgroundColor: 'rgba(15, 19, 28, 0.72)',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 8,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(10, 14, 22, 0.82)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scoreText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },
  epPill: {
    backgroundColor: 'rgba(10, 14, 22, 0.82)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  epText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  detailsContainer: {
    padding: THEME.spacing.spaceSm,
    gap: 2,
  },
  title: {
    ...THEME.typography.headlineSm,
    fontSize: 16,
    color: THEME.colors.onSurface,
    textAlign: 'right',
  },
  genres: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'right',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 4,
  },
  dubTag: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dubTagText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryContainer,
    fontWeight: '700',
  },
  yearText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
});
