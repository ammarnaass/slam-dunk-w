import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { GENRE_OPTIONS } from '../../constants/filter-options';
import { filterStyles as styles } from './filter.styles';

interface GenreFilterSectionProps {
  localGenres: string[];
  onToggleGenre: (genreId: string) => void;
}

export const GenreFilterSection: React.FC<GenreFilterSectionProps> = ({
  localGenres,
  onToggleGenre,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon name="category" size={18} color={THEME.colors.primaryContainer} />
          <Text style={styles.sectionTitle}>التصنيف والنوع الفني</Text>
        </View>
        <Text style={styles.sectionSubtext}>متعدد الاختيارات</Text>
      </View>
      <View style={styles.pillsWrap}>
        {GENRE_OPTIONS.map((g) => {
          const isSelected = localGenres.includes(g.id);
          return (
            <TouchableOpacity
              key={g.id}
              style={[
                styles.filterPill,
                isSelected ? styles.filterPillActive : styles.filterPillInactive,
              ]}
              onPress={() => onToggleGenre(g.id)}
              activeOpacity={0.7}
            >
              {isSelected && (
                <Icon name="check" size={15} color={THEME.colors.primaryContainer} />
              )}
              <Text
                style={[
                  styles.filterPillText,
                  isSelected ? styles.filterPillTextActive : styles.filterPillTextInactive,
                ]}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
