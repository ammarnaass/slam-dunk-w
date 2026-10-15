import React from 'react';
import {
  View,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Anime, Episode } from '../types';
import { AnimeCard } from '../components/AnimeCard';
import { AnimeDetailView } from '../components/AnimeDetailView';
import { THEME } from '../constants/theme';
import { AnimeSearchHeader, TRENDING_TAGS } from '../components/animes-catalog/AnimeSearchHeader';
import { AnimeFiltersBar, GENRES } from '../components/animes-catalog/AnimeFiltersBar';
import { AnimeFilterModal } from '../components/animes-catalog/AnimeFilterModal';
import { AnimeGridSkeleton } from '../components/common/Skeleton';
import {
  styles,
  AnimeCatalogResultsBar,
  AnimeCatalogEmptyState,
  useAnimeCatalogFilter,
} from '../components/animes-catalog';

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
  const {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    isGridView,
    setIsGridView,
    filterModalVisible,
    setFilterModalVisible,
    activeFilterAudio,
    setActiveFilterAudio,
    activeFilterStatus,
    setActiveFilterStatus,
    filteredAnimes,
    toggleFilterAudio,
    toggleFilterStatus,
  } = useAnimeCatalogFilter(animes);

  if (loading && animes.length === 0) {
    return <AnimeGridSkeleton />;
  }

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

  const screenWidth = Dimensions.get('window').width;
  const numColumns = isGridView ? 2 : 1;
  const itemGap = 12;
  const containerPadding = THEME.spacing.margin;
  const cardWidth = isGridView
    ? (screenWidth - containerPadding * 2 - itemGap) / 2
    : screenWidth - containerPadding * 2;

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
        onToggleFilterAudio={toggleFilterAudio}
        activeFilterStatus={activeFilterStatus}
        onToggleFilterStatus={toggleFilterStatus}
      />

      {/* 3. Results Counter & View Mode Toggle */}
      <AnimeCatalogResultsBar
        count={filteredAnimes.length}
        isGridView={isGridView}
        onSetGridView={setIsGridView}
      />

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
          ListEmptyComponent={<AnimeCatalogEmptyState />}
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
