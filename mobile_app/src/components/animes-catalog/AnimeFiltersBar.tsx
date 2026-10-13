import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';

export const GENRES = [
  { key: 'all', label: 'الكل' },
  { key: 'sports', label: 'رياضي' },
  { key: 'mystery', label: 'غموض وتحقيق' },
  { key: 'adventure', label: 'مغامرات وشونين' },
  { key: 'comedy', label: 'كوميديا' },
  { key: 'scifi', label: 'خيال علمي' },
];

interface AnimeFiltersBarProps {
  selectedGenre: string;
  onSelectGenre: (genreKey: string) => void;
  activeFilterAudio: 'all' | 'dub' | 'sub';
  onToggleFilterAudio: () => void;
  activeFilterStatus: 'all' | 'completed' | 'ongoing';
  onToggleFilterStatus: () => void;
}

export const AnimeFiltersBar: React.FC<AnimeFiltersBarProps> = ({
  selectedGenre,
  onSelectGenre,
  activeFilterAudio,
  onToggleFilterAudio,
  activeFilterStatus,
  onToggleFilterStatus,
}) => {
  return (
    <View style={styles.filtersSection}>
      {/* Category Filter Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genresScroll}
      >
        {GENRES.map((genre) => {
          const isSelected = selectedGenre === genre.key;
          return (
            <TouchableOpacity
              key={genre.key}
              style={[
                styles.genrePill,
                isSelected && styles.genrePillActive,
              ]}
              onPress={() => onSelectGenre(genre.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.genrePillText,
                  isSelected && styles.genrePillTextActive,
                ]}
              >
                {genre.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sub-Filters Strip */}
      <View style={styles.subFiltersStrip}>
        <View style={styles.subFiltersLeft}>
          {/* Audio Toggle */}
          <TouchableOpacity
            style={styles.subFilterTag}
            onPress={onToggleFilterAudio}
            activeOpacity={0.8}
          >
            <Icon name="mic" size={13} color={THEME.colors.secondary} />
            <Text style={styles.subFilterTagGold}>
              {activeFilterAudio === 'all'
                ? 'مدبلج ومترجم'
                : activeFilterAudio === 'dub'
                ? 'مدبلج فقط'
                : 'مترجم فقط'}
            </Text>
          </TouchableOpacity>

          {/* Status Indicator */}
          <TouchableOpacity
            style={styles.subFilterTag}
            onPress={onToggleFilterStatus}
            activeOpacity={0.8}
          >
            <View style={styles.statusDot} />
            <Text style={styles.subFilterTagText}>
              {activeFilterStatus === 'all'
                ? 'مكتمل ومستمر'
                : activeFilterStatus === 'completed'
                ? 'مكتمل فقط'
                : 'مستمر فقط'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sorter */}
        <View style={styles.sortPill}>
          <Icon name="sort" size={14} color={THEME.colors.primaryContainer} />
          <Text style={styles.sortPillText}>الأعلى تقييماً (9.0+)</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filtersSection: {
    backgroundColor: 'rgba(10, 14, 22, 0.6)',
    paddingVertical: 8,
    gap: 8,
  },
  genresScroll: {
    paddingHorizontal: THEME.spacing.margin,
    gap: 8,
  },
  genrePill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: THEME.radius.full,
  },
  genrePillActive: {
    backgroundColor: THEME.colors.primaryContainer,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 4,
  },
  genrePillText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurfaceVariant,
  },
  genrePillTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '800',
  },
  subFiltersStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.margin,
  },
  subFiltersLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subFilterTagGold: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
  },
  subFilterTagText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurface,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.emerald,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sortPillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurface,
  },
});
