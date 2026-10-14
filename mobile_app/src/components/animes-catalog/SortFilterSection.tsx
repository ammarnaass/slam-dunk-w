import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { SORT_OPTIONS } from '../../constants/filter-options';
import { filterStyles as styles } from './filter.styles';

interface SortFilterSectionProps {
  localSort: string;
  onSortSelect: (sort: string) => void;
}

export const SortFilterSection: React.FC<SortFilterSectionProps> = ({
  localSort,
  onSortSelect,
}) => {
  return (
    <View style={[styles.sectionContainer, { paddingBottom: 20 }]}>
      <View style={styles.sectionTitleRow}>
        <Icon name="sort" size={18} color={THEME.colors.onSurfaceVariant} />
        <Text style={styles.sectionTitle}>ترتيب وعرض النتائج حسب</Text>
      </View>
      <View style={styles.sortGrid}>
        {SORT_OPTIONS.map((sort) => {
          const isSelected = localSort === sort.id;
          return (
            <TouchableOpacity
              key={sort.id}
              style={[
                styles.sortCard,
                isSelected ? styles.sortCardActive : styles.sortCardInactive,
              ]}
              onPress={() => onSortSelect(sort.id)}
              activeOpacity={0.7}
            >
              <Icon
                name={sort.icon}
                size={17}
                color={isSelected ? THEME.colors.primaryContainer : THEME.colors.secondary}
              />
              <Text
                style={[
                  styles.sortCardText,
                  isSelected ? styles.sortCardTextActive : styles.sortCardTextInactive,
                ]}
                numberOfLines={1}
              >
                {sort.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
