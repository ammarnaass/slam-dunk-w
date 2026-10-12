import React, { useState } from 'react';
import {
  ScrollView,
  RefreshControl,
  Share,
} from 'react-native';
import { THEME } from '../constants/theme';
import { HomeApiResponse, Episode, Anime, Character } from '../types';
import { styles } from '../components/home/home.styles';
import { DEFAULT_HERO_SLIDES, QUOTES } from '../constants/home-data';
import { HomeTrustRibbon } from '../components/home/HomeTrustRibbon';
import { HomeHeroSection } from '../components/home/HomeHeroSection';
import { HomeContinueWatching } from '../components/home/HomeContinueWatching';
import { HomeShohokuRoster } from '../components/home/HomeShohokuRoster';
import { HomeConanSpotlight } from '../components/home/HomeConanSpotlight';
import { HomeGoldenNostalgia } from '../components/home/HomeGoldenNostalgia';
import { HomeFanQuote } from '../components/home/HomeFanQuote';

interface HomeScreenProps {
  data: HomeApiResponse | null;
  loading: boolean;
  onRefresh: () => void;
  onEpisodePress: (ep: Episode) => void;
  onAnimePress: (anime: Anime) => void;
  onViewAllEpisodes?: () => void;
  onViewAllAnimes?: () => void;
  characters?: Character[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  data,
  loading,
  onRefresh,
  onEpisodePress,
  onAnimePress,
  onViewAllEpisodes,
  onViewAllAnimes,
  characters,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const heroSliderList =
    data?.slider && data.slider.length > 0
      ? data.slider
      : DEFAULT_HERO_SLIDES;

  const currentHero = heroSliderList[activeSlide] || heroSliderList[0];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `شاهد ${currentHero.title} بجودة فائقة على ANIME DAZE! https://slam-dunk-w.vercel.app`,
      });
    } catch (_) {}
  };

  const handleNextQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % QUOTES.length);
  };

  const handlePlayHero = () => {
    if (data?.latest && data.latest.length > 0) {
      onEpisodePress(data.latest[0]);
    } else {
      onEpisodePress({
        id: 'ep-1',
        animeId: currentHero.id,
        title: 'عبقري كرة السلة يظهر!',
        episode_number: 1,
        duration: '24:10',
      });
    }
  };

  const handleResumeEpisode = () => {
    if (data?.latest && data.latest.length > 0) {
      onEpisodePress(data.latest[0]);
    } else {
      onEpisodePress({
        id: 'ep-47',
        animeId: 'slam-dunk',
        title: 'التحدي الأخير ضد الساحة',
        episode_number: 47,
        duration: '23:45',
      });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={THEME.colors.primaryContainer}
          colors={[THEME.colors.primaryContainer]}
        />
      }
    >
      {/* 1. Feature Trust Ribbon */}
      <HomeTrustRibbon />

      {/* 2. Hero Section: Slam Dunk Showcase Slider */}
      <HomeHeroSection
        hero={currentHero}
        isBookmarked={isBookmarked}
        onPlayPress={handlePlayHero}
        onToggleBookmark={() => setIsBookmarked(!isBookmarked)}
        onShare={handleShare}
      />

      {/* 3. Continue Watching Section (متابعة المشاهدة) */}
      <HomeContinueWatching
        onEpisodePress={handleResumeEpisode}
        onViewAllEpisodes={onViewAllEpisodes}
      />

      {/* 4. Shohoku Heroes Roster (أبطال الصقور) */}
      <HomeShohokuRoster
        characters={characters}
        onCharacterPress={() => onAnimePress(currentHero)}
      />

      {/* 5. Detective Conan Spotlight (عالم المحقق كونان) */}
      <HomeConanSpotlight
        onAnimePress={onAnimePress}
        onViewAllAnimes={onViewAllAnimes}
      />

      {/* 6. Golden Nostalgia (كلاسيكيات الزمن الجميل) */}
      <HomeGoldenNostalgia
        onAnimePress={onAnimePress}
        onViewAllAnimes={onViewAllAnimes}
      />

      {/* 7. Interactive Inspiring Fan Quote Toast */}
      <HomeFanQuote
        quote={QUOTES[quoteIdx]}
        onRefreshQuote={handleNextQuote}
      />
    </ScrollView>
  );
};
