import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { THEME } from '../constants/theme';
import { Episode } from '../types';
import { Icon } from './Icon';

interface EpisodeCardProps {
  episode: Episode;
  onPress: (episode: Episode) => void;
  isPlaying?: boolean;
  isFree?: boolean;
  isVip?: boolean;
  progress?: number; // 0 to 1
  showDownload?: boolean;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  onPress,
  isPlaying = false,
  isFree,
  isVip,
  progress,
  showDownload = false,
}) => {
  const epNum = episode.episode_number || episode.episodeNumber || 1;
  const freeEpisode = isFree ?? epNum <= 2;
  const vipRequired = isVip ?? epNum > 2;
  const durationText = episode.duration || '24:10';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isPlaying ? styles.containerActive : styles.containerNormal,
      ]}
      onPress={() => onPress(episode)}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`الحلقة ${epNum}: ${episode.title}`}
    >
      {/* 16:9 Thumbnail Frame */}
      <View style={styles.thumbnailFrame}>
        <Image
          source={{
            uri:
              episode.thumbnail ||
              episode.animeCover ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAa22K0JBF4QhJ9mQXDk9PkD67Tc79VEHj2z4D7680YXWv4h0BrZUMWmriKAZtuJZyAu0oP6ub8gtma9AAzrDc2zZ_Cw2GPx8mF4-GT_SvOcLLq_pI86EABgDazcY7cNSxC7U16BzgYin3GgZ3btJSryGdduw4tYlK4NFw3BnAv0J7B5YgRhmfulyYUtXtDSuIC2WImPmXZ7mOSbPIi3PhtZ2osA_RcaqUqM5yEMjpE36kArz0tDWYT',
          }}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        {/* Center Overlay: Play / Lock */}
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

        {/* Duration badge */}
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

      {/* Episode Metadata */}
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
          {episode.title}
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

      {/* Trailing Action */}
      <View style={styles.actionSection}>
        {showDownload ? (
          <View style={styles.actionCircle}>
            <Icon name="download" size={18} color={THEME.colors.onSurfaceVariant} />
          </View>
        ) : vipRequired ? (
          <View style={styles.actionCircleVip}>
            <Icon name="lock_open" size={18} color={THEME.colors.secondary} />
          </View>
        ) : (
          <View style={styles.actionCircle}>
            <Icon name="more_vert" size={18} color={THEME.colors.onSurfaceVariant} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.spaceSm,
    gap: THEME.spacing.spaceSm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  containerNormal: {
    backgroundColor: THEME.colors.surfaceContainer,
  },
  containerActive: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.35)',
  },
  thumbnailFrame: {
    width: 120,
    aspectRatio: 16 / 9,
    borderRadius: THEME.radius.DEFAULT,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surfaceContainerLowest,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  centerScrim: {
    ...StyleSheet.absoluteFill as object,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBadgeActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  playBadgeInactive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: THEME.colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationPill: {
    position: 'absolute',
    bottom: 3,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  durationText: {
    ...THEME.typography.labelSm,
    fontSize: 9,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  progressBarBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: THEME.colors.surfaceContainerHighest,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.primaryContainer,
  },
  metaContainer: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  episodeNumber: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    fontWeight: '700',
  },
  episodeNumberActive: {
    color: THEME.colors.primaryContainer,
  },
  badgeFree: {
    backgroundColor: 'rgba(214, 49, 53, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  badgeFreeText: {
    color: THEME.colors.tertiary,
    fontSize: 9,
    fontWeight: '700',
  },
  badgeVip: {
    backgroundColor: 'rgba(238, 152, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  badgeVipText: {
    color: THEME.colors.secondary,
    fontSize: 9,
    fontWeight: '800',
  },
  title: {
    ...THEME.typography.headlineSm,
    fontSize: 15,
    color: THEME.colors.onSurface,
    textAlign: 'right',
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  micSpec: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  specText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  specDot: {
    color: THEME.colors.onSurfaceVariant,
    fontSize: 10,
  },
  actionSection: {
    justifyContent: 'center',
  },
  actionCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCircleVip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(238, 152, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
