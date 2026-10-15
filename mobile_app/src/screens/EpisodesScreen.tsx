import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Episode } from '../types';
import { EpisodeCard } from '../components/EpisodeCard';
import { EpisodeListSkeleton } from '../components/common/Skeleton';
import { useAppStore } from '../store/useAppStore';
import {
  episodesStyles as styles,
  useEpisodesFilter,
  EpisodesSearchBar,
  EpisodesRangePills,
  EpisodesEmptyState,
} from '../components/episodes';

interface EpisodesScreenProps {
  episodes: Episode[];
  loading: boolean;
  onSelectEpisode: (episode: Episode) => void;
  onBack?: () => void;
}

export const EpisodesScreen: React.FC<EpisodesScreenProps> = ({
  episodes,
  loading,
  onSelectEpisode,
  onBack,
}) => {
  const { continueWatching } = useAppStore();
  const {
    searchQuery,
    setSearchQuery,
    selectedRange,
    setSelectedRange,
    isReverseOrder,
    setIsReverseOrder,
    ranges,
    filteredEpisodes,
  } = useEpisodesFilter(episodes);

  return (
    <View style={styles.container}>
      {/* Top Search & Filter Bar */}
      <EpisodesSearchBar
        onBack={onBack}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isReverseOrder={isReverseOrder}
        onToggleReverse={() => setIsReverseOrder((prev) => !prev)}
      />

      {/* Range filter pills */}
      <EpisodesRangePills
        ranges={ranges}
        selectedRange={selectedRange}
        onSelectRange={setSelectedRange}
      />

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
          renderItem={({ item }) => {
            const progressItem = continueWatching.find(
              (cw) => cw.episodeId === item.id || cw.episode?.id === item.id
            );
            const progress = progressItem
              ? progressItem.percentage > 0
                ? progressItem.percentage / 100
                : undefined
              : undefined;

            return (
              <EpisodeCard
                episode={item}
                onPress={onSelectEpisode}
                progress={progress}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={<EpisodesEmptyState />}
        />
      )}
    </View>
  );
};
