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
import { HomeApiResponse, Episode, Anime, Character } from '../types';
import { EpisodeCard } from '../components/EpisodeCard';
import { AnimeCard } from '../components/AnimeCard';
import { CharacterCard } from '../components/CharacterCard';
import { THEME } from '../constants/theme';

interface HomeScreenProps {
  data: HomeApiResponse | null;
  loading: boolean;
  onRefresh: () => void;
  onEpisodePress: (episode: Episode) => void;
  onAnimePress: (anime: Anime) => void;
  onViewAllEpisodes: () => void;
  characters?: Character[];
}

const DEFAULT_PLAYERS: Character[] = [
  {
    id: 'sakuragi',
    name: 'ساكوراجي',
    name_ar: 'هاناميتشي ساكوراجي',
    number: '10',
    position: 'مهاجم قوي (PF)',
    team: 'شوهوكو',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLg6JNKL3cZxeOj-F7SW7gLj9x7iPVm4yGTw&s',
  },
  {
    id: 'rukawa',
    name: 'روكاوا',
    name_ar: 'كايدي روكاوا',
    number: '11',
    position: 'مهاجم صغير (SF)',
    team: 'شوهوكو',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLg6JNKL3cZxeOj-F7SW7gLj9x7iPVm4yGTw&s',
  },
  {
    id: 'akagi',
    name: 'أكاجي',
    name_ar: 'تاكينوري أكاجي',
    number: '4',
    position: 'لاعب وسط (C)',
    team: 'شوهوكو',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLg6JNKL3cZxeOj-F7SW7gLj9x7iPVm4yGTw&s',
  },
  {
    id: 'mitsui',
    name: 'ميتسوي',
    name_ar: 'هيساشي ميتسوي',
    number: '14',
    position: 'مدافع مسدد (SG)',
    team: 'شوهوكو',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLg6JNKL3cZxeOj-F7SW7gLj9x7iPVm4yGTw&s',
  },
  {
    id: 'miyagi',
    name: 'مياجي',
    name_ar: 'ريوتا مياجي',
    number: '7',
    position: 'صانع ألعاب (PG)',
    team: 'شوهوكو',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLg6JNKL3cZxeOj-F7SW7gLj9x7iPVm4yGTw&s',
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  data,
  loading,
  onRefresh,
  onEpisodePress,
  onAnimePress,
  onViewAllEpisodes,
  characters = DEFAULT_PLAYERS,
}) => {
  const [sliderIndex, setSliderIndex] = useState(0);

  if (loading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={styles.loadingText}>جاري تحميل منصة سلام دانك...</Text>
      </View>
    );
  }

  const sliderList = data?.slider && data.slider.length > 0 ? data.slider : [
    {
      id: 'slam-dunk',
      title: 'Slam Dunk - سلام دانك',
      description: 'تابع رحلة هاناميتشي ساكوراجي وفريق شوهوكو نحو بطولة المدارس الوطنية لكرة السلة بأعلى دقة عرض!',
      coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTxpjOV_-f3YQQLUb_T_57HXpyZ4NIlMatMg&s',
      bannerImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTxpjOV_-f3YQQLUb_T_57HXpyZ4NIlMatMg&s',
      type: 'TV Series',
      totalEpisodes: 101,
      status: 'Completed',
    }
  ];

  const featuredAnime = sliderList[sliderIndex % sliderList.length];
  const latestEpisodes = data?.latest || [];
  const animesList = sliderList;

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
      {/* Cinematic Hero Banner */}
      <View style={styles.heroBanner}>
        <Image
          source={{ uri: featuredAnime.coverImage || featuredAnime.bannerImage }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          {/* Hero Top Badges */}
          <View style={styles.heroBadgeRow}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>⭐ عمل مميز</Text>
            </View>
            <View style={styles.qualityBadge}>
              <Text style={styles.qualityBadgeText}>FHD 1080p</Text>
            </View>
          </View>

          {/* Hero Content */}
          <Text style={styles.heroTitle}>{featuredAnime.title}</Text>
          <Text style={styles.heroDesc} numberOfLines={2}>
            {featuredAnime.description}
          </Text>

          {/* Action Row */}
          <View style={styles.heroActionsRow}>
            <TouchableOpacity
              style={styles.watchNowButton}
              onPress={onViewAllEpisodes}
              activeOpacity={0.85}
            >
              <Text style={styles.watchNowText}>▶ ابدأ المشاهدة الآن</Text>
            </TouchableOpacity>

            {sliderList.length > 1 && (
              <TouchableOpacity
                style={styles.nextSlideButton}
                onPress={() => setSliderIndex((prev) => (prev + 1) % sliderList.length)}
                activeOpacity={0.7}
              >
                <Text style={styles.nextSlideText}>التالي ◀</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* SECTION 1: Latest Episodes */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity onPress={onViewAllEpisodes} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>عرض الكل ◀</Text>
          </TouchableOpacity>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>أحدث الحلقات المضافة</Text>
            <View style={styles.sectionIndicator} />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListPadding}
        >
          {latestEpisodes.map((ep) => (
            <EpisodeCard
              key={ep.id}
              episode={ep}
              onPress={onEpisodePress}
              horizontal
            />
          ))}
        </ScrollView>
      </View>

      {/* SECTION 2: Animes & Movies Catalog */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity onPress={onViewAllEpisodes} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>المزيد ◀</Text>
          </TouchableOpacity>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>دليل الأنميات والمسلسلات</Text>
            <View style={styles.sectionIndicator} />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListPadding}
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

      {/* SECTION 3: Shohoku Team Players */}
      <View style={[styles.sectionContainer, styles.lastSection]}>
        <View style={styles.sectionHeader}>
          <View />
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>نجوم وشخصيات صقور شوهوكو</Text>
            <View style={styles.sectionIndicator} />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListPadding}
        >
          {characters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
            />
          ))}
        </ScrollView>
      </View>
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
    fontSize: 13,
    fontWeight: '700',
    marginTop: THEME.spacing.md,
  },
  heroBanner: {
    width: '100%',
    height: 380,
    position: 'relative',
    backgroundColor: THEME.colors.surface,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(3, 7, 18, 0.65)',
    justifyContent: 'flex-end',
    padding: THEME.spacing.lg,
    paddingBottom: THEME.spacing.xl,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
  },
  tagBadge: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    color: THEME.colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  qualityBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  qualityBadgeText: {
    color: THEME.colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.colors.white,
    textAlign: 'right',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroDesc: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    textAlign: 'right',
    lineHeight: 18,
    marginBottom: THEME.spacing.md,
  },
  heroActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  watchNowButton: {
    flex: 1,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  watchNowText: {
    color: THEME.colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  nextSlideButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  nextSlideText: {
    color: THEME.colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionContainer: {
    marginTop: THEME.spacing.xl,
  },
  lastSection: {
    marginBottom: 40,
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
    gap: 8,
  },
  sectionIndicator: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: THEME.colors.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.white,
    textAlign: 'right',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.primaryLight,
  },
  horizontalListPadding: {
    paddingHorizontal: THEME.spacing.lg,
  },
});
