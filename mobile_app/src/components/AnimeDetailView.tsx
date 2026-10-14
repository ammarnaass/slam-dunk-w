import React, { useState } from 'react';
import { ScrollView, Share } from 'react-native';
import { Anime, Episode, Character } from '../types';
import { EpisodesTab } from './anime-detail/EpisodesTab';
import { CharactersTab } from './anime-detail/CharactersTab';
import { StoryTab } from './anime-detail/StoryTab';
import { CommentsTab } from './anime-detail/CommentsTab';
import { animeDetailStyles as styles } from './anime-detail/anime-detail.styles';
import { AnimeDetailHero } from './anime-detail/AnimeDetailHero';
import { AnimeDetailActions } from './anime-detail/AnimeDetailActions';
import { AnimeDetailTabsBar, DetailTab } from './anime-detail/AnimeDetailTabsBar';

export { DEFAULT_CHARACTERS } from './anime-detail/CharactersTab';
export { EPISODE_RANGES } from './anime-detail/EpisodesTab';
export type { DetailTab };

export interface AnimeDetailViewProps {
  anime: Anime;
  episodes: Episode[];
  onEpisodePress?: (ep: Episode) => void;
  onSelectEpisode?: (ep: Episode) => void;
  onBack?: () => void;
  characters?: Character[];
  loadingEpisodes?: boolean;
  onRefresh?: () => void;
}

export const AnimeDetailView: React.FC<AnimeDetailViewProps> = ({
  anime,
  episodes,
  onEpisodePress,
  onSelectEpisode,
  onBack,
  characters,
}) => {
  const handleEpisodeSelect = onEpisodePress || onSelectEpisode || (() => {});
  const [activeTab, setActiveTab] = useState<DetailTab>('episodes');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `شاهد ${anime.title} على ANIME DAZE بدقة 1080p والدبلجة الأصلية: https://slam-dunk-w.vercel.app`,
      });
    } catch (_) {}
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Hero Section & Backdrop */}
      <AnimeDetailHero anime={anime} onBack={onBack} />

      {/* 2. Primary Interactive Actions */}
      <AnimeDetailActions
        onPlayPress={() => {
          if (episodes.length > 0) {
            handleEpisodeSelect(episodes[0]);
          }
        }}
        isBookmarked={isBookmarked}
        onToggleBookmark={() => setIsBookmarked(!isBookmarked)}
        onShare={handleShare}
      />

      {/* 3. Interactive Category Tabs Bar */}
      <AnimeDetailTabsBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 4. Tab Content */}
      {activeTab === 'episodes' && (
        <EpisodesTab
          episodes={episodes}
          onSelectEpisode={handleEpisodeSelect}
        />
      )}

      {activeTab === 'story' && (
        <StoryTab anime={anime} />
      )}

      {activeTab === 'characters' && (
        <CharactersTab
          characters={characters}
          onCharacterPress={() => {}}
        />
      )}

      {activeTab === 'comments' && (
        <CommentsTab />
      )}
    </ScrollView>
  );
};
