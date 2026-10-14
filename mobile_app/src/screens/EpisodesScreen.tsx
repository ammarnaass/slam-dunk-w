import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Episode } from '../types';
import { EpisodeCard } from '../components/EpisodeCard';
import { EpisodeListSkeleton } from '../components/common/Skeleton';
import { Icon } from '../components/Icon';
import { THEME } from '../constants/theme';

interface EpisodesScreenProps {
  episodes: Episode[];
  loading: boolean;
  onSelectEpisode: (episode: Episode) => void;
  onBack?: () => void;
}

type RangeKey = 'all' | '1-25' | '26-50' | '51-75' | '76-101';

export const EpisodesScreen: React.FC<EpisodesScreenProps> = ({
  episodes,
  loading,
  onSelectEpisode,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRange, setSelectedRange] = useState<RangeKey>('all');
  const [isReverseOrder, setIsReverseOrder] = useState(false);

  const ranges: { key: RangeKey; label: string }[] = [
    { key: 'all', label: `الكل (${episodes.length || 101})` },
    { key: '1-25', label: '1 - 25' },
    { key: '26-50', label: '26 - 50' },
    { key: '51-75', label: '51 - 75' },
    { key: '76-101', label: '76 - 101' },
  ];

  const filteredEpisodes = useMemo(() => {
    let list = (episodes || []).filter((ep) => {
      if (!ep) return false;
      const title = ep.title || '';
      const matchedNum = title.match(/\d+/);
      const epNum =
        ep.episode_number ||
        ep.episodeNumber ||
        (matchedNum ? parseInt(matchedNum[0], 10) : 0);

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchTitle = title.toLowerCase().includes(query);
        const matchNum =
          epNum.toString() === query || `الحلقة ${epNum}`.includes(query);
        if (!matchTitle && !matchNum) return false;
      }

      // Range filter
      if (selectedRange === '1-25') return epNum >= 1 && epNum <= 25;
      if (selectedRange === '26-50') return epNum >= 26 && epNum <= 50;
      if (selectedRange === '51-75') return epNum >= 51 && epNum <= 75;
      if (selectedRange === '76-101') return epNum >= 76 && epNum <= 101;

      return true;
    });

    if (isReverseOrder) {
      list = [...list].reverse();
    }

    return list;
  }, [episodes, searchQuery, selectedRange, isReverseOrder]);

  return (
    <View style={styles.container}>
      {/* Top Bar / Search Row */}
      <View style={styles.searchBarRow}>
        {onBack && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack}
            activeOpacity={0.8}
            accessibilityLabel="رجوع"
          >
            <Icon name="arrow_forward" size={20} color={THEME.colors.onSurface} />
          </TouchableOpacity>
        )}

        <View style={styles.searchInputContainer}>
          <Icon name="search" size={18} color={THEME.colors.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث برقم الحلقة أو العنوان..."
            placeholderTextColor={THEME.colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearSearchBtn}
            >
              <Icon name="close" size={14} color={THEME.colors.onSurfaceVariant} />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.sortBtn,
            isReverseOrder && styles.sortBtnActive,
          ]}
          onPress={() => setIsReverseOrder((prev) => !prev)}
          activeOpacity={0.8}
          accessibilityLabel="عكس الترتيب"
        >
          <Icon
            name="swap_vert"
            size={18}
            color={
              isReverseOrder
                ? THEME.colors.primaryContainer
                : THEME.colors.onSurfaceVariant
            }
          />
        </TouchableOpacity>
      </View>

      {/* Range filter pills */}
      <View style={styles.filterPillsRow}>
        <FlatList
          horizontal
          inverted
          data={ranges}
          keyExtractor={(r) => r.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsList}
          renderItem={({ item: r }) => {
            const isSelected = selectedRange === r.key;
            return (
              <TouchableOpacity
                style={[styles.rangePill, isSelected && styles.rangePillActive]}
                onPress={() => setSelectedRange(r.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.rangePillText,
                    isSelected && styles.rangePillTextActive,
                  ]}
                >
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Episodes Header Info */}
      <View style={styles.headerInfoRow}>
        <Text style={styles.episodesCountText}>
          {filteredEpisodes.length} حلقة متوفرة
        </Text>
        <Text style={styles.dubbingNoticeText}>
          دبلجة مركز الزهرة الأصلية • 1080p FHD
        </Text>
      </View>

      {/* Episodes List */}
      {loading ? (
        <EpisodeListSkeleton />
      ) : (
        <FlatList
          data={filteredEpisodes}
          keyExtractor={(item, index) =>
            item?.id ? String(item.id) : `ep-${index}`
          }
          renderItem={({ item }) => (
            <EpisodeCard
              episode={item}
              onPress={onSelectEpisode}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon
                name="sports_basketball"
                size={48}
                color={THEME.colors.onSurfaceVariant}
              />
              <Text style={styles.emptyTitle}>لم يتم العثور على أي حلقات</Text>
              <Text style={styles.emptyDesc}>
                تأكد من رقم الحلقة أو نص البحث وجرب نطاقاً آخر من الحلقات.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  searchBarRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: THEME.spacing.spaceSm,
    paddingHorizontal: THEME.spacing.margin,
    paddingTop: THEME.spacing.spaceSm,
    paddingBottom: THEME.spacing.spaceXs,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputContainer: {
    flex: 1,
    height: 44,
    borderRadius: THEME.radius.xl,
    backgroundColor: THEME.colors.surfaceContainerLow,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: THEME.colors.onSurface,
    ...THEME.typography.bodyMd,
  },
  clearSearchBtn: {
    padding: 6,
  },
  sortBtn: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius.xl,
    backgroundColor: THEME.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  sortBtnActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderColor: THEME.colors.primaryContainer,
  },

  /* FILTER PILLS */
  filterPillsRow: {
    marginVertical: THEME.spacing.spaceSm,
  },
  filterPillsList: {
    paddingHorizontal: THEME.spacing.margin,
    gap: 8,
  },
  rangePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  rangePillActive: {
    backgroundColor: THEME.colors.primaryContainer,
    borderColor: THEME.colors.primaryContainer,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  rangePillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  rangePillTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },

  /* HEADER INFO */
  headerInfoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.margin,
    marginBottom: THEME.spacing.spaceSm,
  },
  episodesCountText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  dubbingNoticeText: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.primary,
  },

  /* LIST CONTENT */
  listContent: {
    paddingHorizontal: THEME.spacing.margin,
    paddingBottom: 40,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
  },
  emptyDesc: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
