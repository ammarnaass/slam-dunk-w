import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Anime, Episode } from '../types';
import { AnimeCard } from '../components/AnimeCard';
import { AnimeDetailView } from '../components/AnimeDetailView';
import { Icon } from '../components/Icon';
import { THEME } from '../constants/theme';
import { AnimeSearchHeader, TRENDING_TAGS } from '../components/animes-catalog/AnimeSearchHeader';
import { AnimeFiltersBar, GENRES } from '../components/animes-catalog/AnimeFiltersBar';
import { AnimeFilterModal } from '../components/animes-catalog/AnimeFilterModal';
import { AnimeGridSkeleton } from '../components/common/Skeleton';

export { TRENDING_TAGS } from '../components/animes-catalog/AnimeSearchHeader';
export { GENRES } from '../components/animes-catalog/AnimeFiltersBar';

interface AnimesScreenProps {
  animes: Anime[];
  episodes?: Episode[];
  loading: boolean;
  onRefresh?: () => void;
  onSelectAnime: (anime: Anime) => void;
  selectedAnime: Anime | null;
  onBackToCatalog: () => void;
  onSelectEpisode: (episode: Episode) => void;
}

export const AnimesScreen: React.FC<AnimesScreenProps> = ({
  animes,
  episodes = [],
  loading,
  onRefresh,
  onSelectAnime,
  selectedAnime,
  onBackToCatalog,
  onSelectEpisode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isGridView, setIsGridView] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilterAudio, setActiveFilterAudio] = useState<'all' | 'dub' | 'sub'>('all');
  const [activeFilterStatus, setActiveFilterStatus] = useState<'all' | 'completed' | 'ongoing'>('all');

  if (loading && animes.length === 0) {
    return <AnimeGridSkeleton />;
  }

  const screenWidth = Dimensions.get('window').width;
  const numColumns = isGridView ? 2 : 1;
  const itemGap = 12;
  const containerPadding = THEME.spacing.margin;
  const cardWidth = isGridView
    ? (screenWidth - containerPadding * 2 - itemGap) / 2
    : screenWidth - containerPadding * 2;

  // Master catalog list from real API
  const catalogList = animes;

  // Filtered animes
  const filteredAnimes = useMemo(() => {
    return catalogList.filter((a) => {
      // Query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = a.title.toLowerCase().includes(q);
        const matchesDesc = a.description?.toLowerCase().includes(q);
        const matchesGenres = a.genres?.some((g) => g.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesGenres) return false;
      }

      // Genre filter
      if (selectedGenre !== 'all') {
        const gLabel = GENRES.find((g) => g.key === selectedGenre)?.label;
        if (gLabel && !a.genres?.some((g) => g.includes(gLabel.split(' ')[0]))) {
          return false;
        }
      }

      // Audio filter
      if (activeFilterAudio === 'dub') {
        if (!a.studio?.includes('مدبلج') && !a.title.includes('دانك')) return false;
      } else if (activeFilterAudio === 'sub') {
        if (!a.studio?.includes('مترجم')) return false;
      }

      // Status filter
      if (activeFilterStatus === 'completed' && a.status === 'ongoing') return false;
      if (activeFilterStatus === 'ongoing' && a.status === 'completed') return false;

      return true;
    });
  }, [catalogList, searchQuery, selectedGenre, activeFilterAudio, activeFilterStatus]);

  // If an anime is selected, render the dedicated Detail View
  if (selectedAnime) {
    return (
      <AnimeDetailView
        anime={selectedAnime}
        episodes={episodes}
        onBack={onBackToCatalog}
        onSelectEpisode={onSelectEpisode}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. Search & Filter Header Anchor */}
      <AnimeSearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        onOpenFilterModal={() => setFilterModalVisible(true)}
        onSelectTag={setSearchQuery}
      />

      {/* 2. Horizontal Pill Filters Section */}
      <AnimeFiltersBar
        selectedGenre={selectedGenre}
        onSelectGenre={setSelectedGenre}
        activeFilterAudio={activeFilterAudio}
        onToggleFilterAudio={() =>
          setActiveFilterAudio((prev) =>
            prev === 'all' ? 'dub' : prev === 'dub' ? 'sub' : 'all'
          )
        }
        activeFilterStatus={activeFilterStatus}
        onToggleFilterStatus={() =>
          setActiveFilterStatus((prev) =>
            prev === 'all' ? 'completed' : prev === 'completed' ? 'ongoing' : 'all'
          )
        }
      />

      {/* 3. Results Counter & View Mode Toggle */}
      <View style={styles.resultsBar}>
        <View style={styles.resultsCounterRow}>
          <Text style={styles.resultsTitle}>نتائج الدليل الشامل</Text>
          <View style={styles.counterPill}>
            <Text style={styles.counterText}>
              {filteredAnimes.length} عمل أنمي
            </Text>
          </View>
        </View>

        <View style={styles.viewModeToggle}>
          <TouchableOpacity
            style={[styles.viewModeBtn, isGridView && styles.viewModeBtnActive]}
            onPress={() => setIsGridView(true)}
            accessibilityLabel="عرض شبكة"
          >
            <Icon
              name="grid_view"
              size={18}
              color={isGridView ? THEME.colors.onSurface : THEME.colors.onSurfaceVariant}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeBtn, !isGridView && styles.viewModeBtnActive]}
            onPress={() => setIsGridView(false)}
            accessibilityLabel="عرض قائمة"
          >
            <Icon
              name="view_agenda"
              size={18}
              color={!isGridView ? THEME.colors.onSurface : THEME.colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. Anime Cards Grid Display */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primaryContainer} />
        </View>
      ) : (
        <FlatList
          key={isGridView ? 'grid-2' : 'list-1'}
          data={filteredAnimes}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={isGridView ? styles.gridRow : undefined}
          contentContainerStyle={styles.flatListContent}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={loading}
                onRefresh={onRefresh}
                tintColor={THEME.colors.primaryContainer}
              />
            ) : undefined
          }
          renderItem={({ item }) => (
            <AnimeCard
              anime={item}
              onPress={onSelectAnime}
              cardWidth={cardWidth}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="search" size={48} color={THEME.colors.outlineVariant} />
              <Text style={styles.emptyTitle}>لم يتم العثور على نتائج</Text>
              <Text style={styles.emptySubtitle}>
                جرب البحث بكلمة مختلفة أو اختر تصنيفاً آخر من القائمة
              </Text>
            </View>
          }
        />
      )}

      {/* Advanced Filter Modal */}
      <AnimeFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        activeFilterAudio={activeFilterAudio}
        onChangeFilterAudio={setActiveFilterAudio}
        activeFilterStatus={activeFilterStatus}
        onChangeFilterStatus={setActiveFilterStatus}
        totalFilteredCount={filteredAnimes.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.margin,
    paddingVertical: 12,
  },
  resultsCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultsTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  counterPill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.xs,
  },
  counterText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryContainer,
    fontWeight: '700',
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  viewModeBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewModeBtnActive: {
    backgroundColor: THEME.colors.surfaceContainerHighest,
  },
  flatListContent: {
    paddingHorizontal: THEME.spacing.margin,
    paddingBottom: 24,
    gap: 12,
  },
  gridRow: {
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  emptySubtitle: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 240,
  },
});
