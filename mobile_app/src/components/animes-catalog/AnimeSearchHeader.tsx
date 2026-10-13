import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';

export const TRENDING_TAGS = [
  '#سلام_دانك',
  '#المحقق_كونان',
  '#سبيستون_كلاسيك',
  '#أفلام_ون_بيس',
  '#قتال_شونين',
];

interface AnimeSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  onOpenFilterModal: () => void;
  onSelectTag: (tag: string) => void;
}

export const AnimeSearchHeader: React.FC<AnimeSearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onOpenFilterModal,
  onSelectTag,
}) => {
  return (
    <View style={styles.searchHeader}>
      {/* Instant Search Bar */}
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={22} color={THEME.colors.primaryContainer} />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن أنمي، شخصية، أو استوديو..."
          placeholderTextColor="rgba(223, 226, 238, 0.5)"
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={onClearSearch}
            accessibilityLabel="مسح البحث"
          >
            <Icon name="close" size={16} color={THEME.colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.filterToggleBtn}
          onPress={onOpenFilterModal}
          activeOpacity={0.8}
          accessibilityLabel="خيارات التصفية المتقدمة"
        >
          <Icon name="tune" size={18} color={THEME.colors.secondary} />
        </TouchableOpacity>
      </View>

      {/* Trending Tags Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.trendingScroll}
      >
        <View style={styles.trendingHeader}>
          <Icon name="local_fire_department" size={16} color={THEME.colors.primaryContainer} />
          <Text style={styles.trendingHeaderText}>الرائج:</Text>
        </View>
        {TRENDING_TAGS.map((tag, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.trendTag}
            onPress={() => onSelectTag(tag.replace('#', ''))}
            activeOpacity={0.8}
          >
            <Text style={styles.trendTagText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchHeader: {
    paddingHorizontal: THEME.spacing.margin,
    paddingTop: THEME.spacing.spaceSm,
    paddingBottom: THEME.spacing.spaceXs,
    gap: THEME.spacing.spaceSm,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderRadius: THEME.radius.full,
    paddingHorizontal: 16,
    height: 48,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    color: THEME.colors.onSurface,
    ...THEME.typography.bodyMd,
    textAlign: 'right',
  },
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterToggleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: THEME.colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendingHeaderText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primary,
  },
  trendTag: {
    backgroundColor: THEME.colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
  },
  trendTagText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurfaceVariant,
  },
});
