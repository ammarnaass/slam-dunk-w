import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Anime, Episode } from '../types';
import { AnimeCard } from '../components/AnimeCard';
import { AnimeDetailView } from '../components/AnimeDetailView';
import { Icon } from '../components/Icon';
import { THEME } from '../constants/theme';

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

const TRENDING_TAGS = [
  '#سلام_دانك',
  '#المحقق_كونان',
  '#سبيستون_كلاسيك',
  '#أفلام_ون_بيس',
  '#قتال_شونين',
];

const GENRES = [
  { key: 'all', label: 'الكل' },
  { key: 'sports', label: 'رياضي' },
  { key: 'mystery', label: 'غموض وتحقيق' },
  { key: 'adventure', label: 'مغامرات وشونين' },
  { key: 'comedy', label: 'كوميديا' },
  { key: 'scifi', label: 'خيال علمي' },
];

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
      <View style={styles.searchHeader}>
        {/* Instant Search Bar */}
        <View style={styles.searchBarContainer}>
          <Icon name="search" size={22} color={THEME.colors.primaryContainer} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن أنمي، شخصية، أو استوديو..."
            placeholderTextColor="rgba(223, 226, 238, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => setSearchQuery('')}
              accessibilityLabel="مسح البحث"
            >
              <Icon name="close" size={16} color={THEME.colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.filterToggleBtn}
            onPress={() => setFilterModalVisible(true)}
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
              onPress={() => setSearchQuery(tag.replace('#', ''))}
              activeOpacity={0.8}
            >
              <Text style={styles.trendTagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 2. Horizontal Pill Filters Section */}
      <View style={styles.filtersSection}>
        {/* Category Filter Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genresScroll}
        >
          {GENRES.map((genre) => {
            const isSelected = selectedGenre === genre.key;
            return (
              <TouchableOpacity
                key={genre.key}
                style={[
                  styles.genrePill,
                  isSelected && styles.genrePillActive,
                ]}
                onPress={() => setSelectedGenre(genre.key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.genrePillText,
                    isSelected && styles.genrePillTextActive,
                  ]}
                >
                  {genre.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sub-Filters Strip */}
        <View style={styles.subFiltersStrip}>
          <View style={styles.subFiltersLeft}>
            {/* Audio Toggle */}
            <TouchableOpacity
              style={styles.subFilterTag}
              onPress={() =>
                setActiveFilterAudio((prev) =>
                  prev === 'all' ? 'dub' : prev === 'dub' ? 'sub' : 'all'
                )
              }
              activeOpacity={0.8}
            >
              <Icon name="mic" size={13} color={THEME.colors.secondary} />
              <Text style={styles.subFilterTagGold}>
                {activeFilterAudio === 'all'
                  ? 'مدبلج ومترجم'
                  : activeFilterAudio === 'dub'
                  ? 'مدبلج فقط'
                  : 'مترجم فقط'}
              </Text>
            </TouchableOpacity>

            {/* Status Indicator */}
            <TouchableOpacity
              style={styles.subFilterTag}
              onPress={() =>
                setActiveFilterStatus((prev) =>
                  prev === 'all' ? 'completed' : prev === 'completed' ? 'ongoing' : 'all'
                )
              }
              activeOpacity={0.8}
            >
              <View style={styles.statusDot} />
              <Text style={styles.subFilterTagText}>
                {activeFilterStatus === 'all'
                  ? 'مكتمل ومستمر'
                  : activeFilterStatus === 'completed'
                  ? 'مكتمل فقط'
                  : 'مستمر فقط'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sorter */}
          <View style={styles.sortPill}>
            <Icon name="sort" size={14} color={THEME.colors.primaryContainer} />
            <Text style={styles.sortPillText}>الأعلى تقييماً (9.0+)</Text>
          </View>
        </View>
      </View>

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
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Icon name="tune" size={20} color={THEME.colors.secondary} />
                <Text style={styles.modalTitle}>خيارات التصفية المتقدمة</Text>
              </View>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Icon name="close" size={20} color={THEME.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              {/* Audio Filter */}
              <Text style={styles.filterGroupTitle}>المسار الصوتي</Text>
              <View style={styles.filterPillsRow}>
                {[
                  { key: 'all', label: 'الكل' },
                  { key: 'dub', label: 'دبلجة عربية (سبيستون)' },
                  { key: 'sub', label: 'ياباني مترجم' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.modalPill,
                      activeFilterAudio === item.key && styles.modalPillActive,
                    ]}
                    onPress={() => setActiveFilterAudio(item.key as any)}
                  >
                    <Text
                      style={[
                        styles.modalPillText,
                        activeFilterAudio === item.key && styles.modalPillTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Status Filter */}
              <Text style={styles.filterGroupTitle}>حالة العرض</Text>
              <View style={styles.filterPillsRow}>
                {[
                  { key: 'all', label: 'الكل' },
                  { key: 'completed', label: 'مكتمل' },
                  { key: 'ongoing', label: 'مستمر' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.modalPill,
                      activeFilterStatus === item.key && styles.modalPillActive,
                    ]}
                    onPress={() => setActiveFilterStatus(item.key as any)}
                  >
                    <Text
                      style={[
                        styles.modalPillText,
                        activeFilterStatus === item.key && styles.modalPillTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.applyFilterBtn}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.applyFilterText}>
                تطبيق التصفية • {filteredAnimes.length} عمل متاح
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
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
  filtersSection: {
    backgroundColor: 'rgba(10, 14, 22, 0.6)',
    paddingVertical: 8,
    gap: 8,
  },
  genresScroll: {
    paddingHorizontal: THEME.spacing.margin,
    gap: 8,
  },
  genrePill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: THEME.radius.full,
  },
  genrePillActive: {
    backgroundColor: THEME.colors.primaryContainer,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 4,
  },
  genrePillText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurfaceVariant,
  },
  genrePillTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '800',
  },
  subFiltersStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.margin,
  },
  subFiltersLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subFilterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subFilterTagGold: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
  },
  subFilterTagText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurface,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.emerald,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sortPillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurface,
  },
  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.margin,
    paddingVertical: 10,
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
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  counterText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryContainer,
    fontWeight: '700',
  },
  viewModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceContainerLow,
    padding: 2,
    borderRadius: 8,
  },
  viewModeBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  viewModeBtnActive: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
  },
  flatListContent: {
    paddingHorizontal: THEME.spacing.margin,
    paddingBottom: 40,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  emptySubtitle: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderTopLeftRadius: THEME.radius.xl,
    borderTopRightRadius: THEME.radius.xl,
    padding: 20,
    maxHeight: '80%',
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    gap: 14,
    paddingVertical: 8,
  },
  filterGroupTitle: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  filterPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalPill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.radius.DEFAULT,
  },
  modalPillActive: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  modalPillText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurfaceVariant,
  },
  modalPillTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '800',
  },
  applyFilterBtn: {
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 5,
  },
  applyFilterText: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
});
