import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';

interface GenrePreferenceSelectorProps {
  selectedGenres: string[];
  onToggleGenre: (genreKey: string) => void;
}

const GENRE_ITEMS = [
  { id: 'shonen', label: 'شونين وحماسي', icon: 'sports_mma' as const },
  { id: 'sports', label: 'رياضي وتنافسي', icon: 'sports_basketball' as const },
  { id: 'mystery', label: 'غموض ومحققين', icon: 'psychology' as const },
  { id: 'classic', label: 'كلاسيكيات زمان', icon: 'history_edu' as const },
];

export const GenrePreferenceSelector: React.FC<GenrePreferenceSelectorProps> = ({
  selectedGenres,
  onToggleGenre,
}) => {
  return (
    <View style={styles.genreSection}>
      <Text style={styles.genreTitle}>أنواع الأنمي المفضلة للبدء:</Text>
      <View style={styles.genreChipsRow}>
        {GENRE_ITEMS.map((item) => {
          const isSelected = selectedGenres.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.genrePill, isSelected && styles.genrePillActive]}
              onPress={() => onToggleGenre(item.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.genrePillText, isSelected && styles.genrePillTextActive]}>
                {item.label}
              </Text>
              <Icon
                name={item.icon}
                size={14}
                color={isSelected ? '#FFF' : undefined}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  genreSection: {
    gap: 8,
    marginTop: 4,
  },
  genreTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.onSurface,
    textAlign: 'right',
  },
  genreChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genrePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME.colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  genrePillActive: {
    backgroundColor: THEME.colors.primaryContainer,
    borderColor: THEME.colors.primaryContainer,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
  },
  genrePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  genrePillTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
});
