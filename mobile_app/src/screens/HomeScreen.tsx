import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { HomeApiResponse, Episode, Anime } from '../types';
import { EpisodeCard } from '../components/EpisodeCard';
import { AnimeCard } from '../components/AnimeCard';
import { THEME } from '../constants/theme';

interface HomeScreenProps {
  data: HomeApiResponse | null;
  loading: boolean;
  onRefresh: () => void;
  onEpisodePress: (episode: Episode) => void;
  onAnimePress: (anime: Anime) => void;
  onViewAllEpisodes: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  data,
  loading,
  onRefresh,
  onEpisodePress,
  onAnimePress,
  onViewAllEpisodes,
}) => {
  const [sliderIndex, setSliderIndex] = useState(0);

  if (loading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
      </View>
    );
  }

  const featuredAnime = data?.slider?.[sliderIndex] || {
    id: 'slam-dunk',
    title: 'Slam Dunk - سلام دانك',
    description: 'تابع مغامرات هاناميتشي ساكوراجي وفريق شوهوكو الأسطوري نحو بطولة المدارس الوطنية لكرة السلة!',
    coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTxpjOV_-f3YQQLUb_T_57HXpyZ4NIlMatMg&s',
    bannerImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTxpjOV_-f3YQQLUb_T_57HXpyZ4NIlMatMg&s',
    type: 'TV Series',
    totalEpisodes: 101,
  };

  const latestEpisodes = data?.latest || [];
  const animesList = data?.slider || [];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor={THEME.colors.primary}
          colors={[THEME.colors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Image
          source={{ uri: featuredAnime.coverImage }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>⭐ مميز</Text>
            </View>
            <View style={styles.episodesBadge}>
              <Text style={styles.episodesBadgeText}>🏀 101 حلقة كاملة</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{featuredAnime.title}</Text>
          <Text style={styles.heroDesc} numberOfLines={2}>
            {featuredAnime.description}
          </Text>
          <TouchableOpacity
            style={styles.watchNowButton}
            onPress={onViewAllEpisodes}
            activeOpacity={0.8}
          >
            <Text style={styles.watchNowText}>▶ ابدأ المشاهدة الآن</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Latest Episodes Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity onPress={onViewAllEpisodes}>
            <Text style={styles.viewAllText}>عرض الكل ←</Text>
          </TouchableOpacity>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>أحدث الحلقات</Text>
            <View style={styles.redPill} />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {latestEpisodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              onPress={onEpisodePress}
              horizontal
            />
          ))}
        </ScrollView>
      </View>

      {/* Featured Animes Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View />
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>الأنميات المتوفرة</Text>
            <View style={styles.redPill} />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {animesList.map((anime) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              onPress={onAnimePress}
            />
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.xl,
  },
  loadingText: {
    color: THEME.colors.textMuted,
    marginTop: THEME.spacing.md,
    fontSize: 14,
  },
  heroBanner: {
    width: '100%',
    height: 280,
    position: 'relative',
    backgroundColor: THEME.colors.surface,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    justifyContent: 'flex-end',
    padding: THEME.spacing.lg,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
  },
  tagBadge: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
  },
  tagText: {
    color: THEME.colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  episodesBadge: {
    backgroundColor: 'rgba(249, 115, 22, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
  },
  episodesBadgeText: {
    color: THEME.colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.colors.white,
    textAlign: 'right',
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    textAlign: 'right',
    lineHeight: 18,
    marginBottom: THEME.spacing.md,
  },
  watchNowButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: THEME.radius.full,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchNowText: {
    color: THEME.colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  section: {
    marginTop: THEME.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  redPill: {
    width: 3,
    height: 18,
    backgroundColor: THEME.colors.primary,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.colors.white,
  },
  viewAllText: {
    color: THEME.colors.primaryLight,
    fontSize: 12,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: THEME.spacing.lg,
  },
});
