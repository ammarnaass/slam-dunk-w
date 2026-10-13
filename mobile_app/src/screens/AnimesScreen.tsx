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

const DEFAULT_CATALOG: Anime[] = [
  {
    id: 'slam-dunk',
    title: 'سلام دانك',
    description:
      'انضم لمسيرة حسان وفريق الصقور في صراع حماسي مشتعل لتحقيق حلم البطولة الوطنية. النسخة المرممة بأعلى نقاوة صوتية مع الدبلجة الأصلية.',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCVLvRPiU86JuxLcseZZifT6ZzbBFXLyumbOJsPsIqxMZ6F3p3dl4wgHEM5RdFiaS97d_N8xHhbK5im6XjPP7IFHNb-AS846wI5pm75EDho_45WO9XGDcgdgnD3XMAqXiitKxlo5FlZCQtETqlCFlIzLgXTeIVM5za_1ugG1IUn6r5h600DuzUklaZJvnkupxuD0gp6KDa9PBKrYzQkG5EZKlurgt79n9u23DyVYfgPjGTyPT89k7Rv',
    rating: 9.4,
    totalEpisodes: 101,
    releaseYear: 1993,
    status: 'completed',
    type: 'vip',
    genres: ['رياضي', 'كلاسيكي', 'سبيستون'],
    studio: 'مدبلج + مترجم',
  },
  {
    id: 'detective-conan',
    title: 'المحقق كونان',
    description:
      'سينشي كودو يتحول إلى كونان إيدوجاوا ويحل أعقد ألغاز الجريمة لملاحقة المنظمة السوداء.',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFZePy18zXlyvf-zAvSXGoKcybY45ItTYs8cbq0s47cObB1bfayCp7Rz610PV-B983leQAfWvmC5lCu5F8LZ8ZIVwj6Ojl3osKyhYbmGjrkDI67cTa5sLZHYQrBgGmPTbgfuw5vTahhIlvuYOTMgXRTQLEED6ce8P4SBEW4R_DI0glnTn7ujMRunxpaeEsq5xgLcVFk2lZ5XRGNDZXp6dBocZa1vkgbDrRGBsHQophqvIL0foe7cHn',
    rating: 8.9,
    totalEpisodes: 1120,
    releaseYear: 1996,
    status: 'ongoing',
    type: 'FHD',
    genres: ['غموض', 'تحقيق', 'جريمة'],
    studio: 'حلقات أسبوعية',
  },
  {
    id: 'hunter-1999',
    title: 'القناص 1999',
    description:
      'رحلة غون فريكس وأصدقائه في اختبار الصيادين، النسخة الكلاسيكية النوستالجية الأصلية.',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDh25kYJzinkRX6E8tGKIhNBDyaUwj90lMgVlIqomNbJ7S7gYgC_PV8JzlaWBO7OjIrxiT_YN7H0S8cSyjFVTvf7bVyCrCCzONK2YH-60zMaH2ppVKQFwuspzjNEBXnUm7-yOHlSaNWMk_grTi5Nl7cn27hSZDt2QZ_8VOWY331dJgMTAoJqO6RJ6bHVmG3DFFm70RGlpqacQb3j8fadcu_uY_kbF_AUC8Hnvc1PEZS3cQMDzcdSii_',
    rating: 9.3,
    totalEpisodes: 62,
    releaseYear: 1999,
    status: 'completed',
    type: '1080p',
    genres: ['مغامرات', 'شونين', 'إثارة'],
    studio: 'الدبلجة الأصلية',
  },
  {
    id: 'captain-majed',
    title: 'الكابتن ماجد',
    description: 'أسطورة كرة القدم التي ألهمت أجيالاً في العالم العربي.',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB4T-9NG-yontq-_VgAf5yK8OQDJbVL7UWemnuz0UwTHpkK1eP41SpaooqRctEH4FM8mHVmLmhfoFrcTQqEH2OIOr14_puL271SReQfYAYXybEj3D7jSL8R5YyJ2_oHBpENqRcQK9uo00MbRZZ-Oe45iiuxCh2MjbemCKJHTvB_vKZkudajItvh3knEl014r54VAVy5rxk2ieSQuinvMj6x4AKC73MpxroLA6yxfKU0JEd5vsFhdJ1s',
    rating: 8.8,
    totalEpisodes: 128,
    releaseYear: 1983,
    status: 'completed',
    genres: ['رياضي', 'كرة قدم', 'نوستالجيا'],
    studio: 'الجزء الثاني',
  },
  {
    id: 'adnan-lina',
    title: 'عدنان ولينا',
    description: 'مغامرات الصبي عدنان في الجزيرة المفقودة وبرج الأمل بعد الحرب العالمية.',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3x1PhWJSc2Ga3PyVDud7Jw8d9qa_2bVJS2MBlje2Y776rmI958znPzzVCMWY6S10GjmC5LWRPLaJA1e9RHhTQan1tReyxU2moqPsChrCWQcc_V6rlfG2IR9ErH3vLr_P_r3hESHVmtLMMhWpsEgJjgOEG4y6TShK9JJr3hX-6Ou3ejBbnMfKEKJeOUwvq5IiNejlyADEv0R0ycDsa3yE_BJ47kY6j1_NR2RcO8wrjg1tERtZNlZQn',
    rating: 9.5,
    totalEpisodes: 26,
    releaseYear: 1978,
    status: 'completed',
    genres: ['خيال علمي', 'مغامرات', 'كلاسيك'],
    studio: 'نسخة مرممة 4K',
  },
  {
    id: 'one-piece-red',
    title: 'ون بيس: فيلم ريد',
    description: 'لوفي وطاقم قبعة القش في مواجهة المغنية أوتا في حفل إليجيا الأسطوري.',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCnJZX76mQ9xsostJI3zRCwHNPcttWFA2MG5mxQ6pQqG7AgEzm27_GYqAzhCJDJZhrZ7mTY-_Z-FXhMolqmZwUz6sZGWSp3WyX3wOBSTvONHQxiYS1BBB-aOdCzj1rLxVZdNpH3pbCzfu04mcKo6T33WrBp8JY-W4h7TFnkC2UGa6b60KSgjok0Jt7IOO6WQcQyjqULKwnDFYjfTirP2i9XPo6TKorfc5nYZ0ndbnPRhLxhfYoTsd4I',
    rating: 8.6,
    totalEpisodes: 1,
    releaseYear: 2022,
    status: 'completed',
    type: 'vip',
    genres: ['أفلام', 'شونين', 'موسيقى'],
    studio: 'فيلم حصري FHD',
  },
];

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

  const screenWidth = Dimensions.get('window').width;
  const numColumns = isGridView ? 2 : 1;
  const itemGap = 12;
  const containerPadding = THEME.spacing.margin;
  const cardWidth = isGridView
    ? (screenWidth - containerPadding * 2 - itemGap) / 2
    : screenWidth - containerPadding * 2;

  // Master catalog list
  const catalogList = animes.length > 0 ? animes : DEFAULT_CATALOG;

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
