import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
} from 'react-native';
import { THEME } from '../constants/theme';
import { Anime, Episode, Character } from '../types';
import { EpisodeCard } from './EpisodeCard';
import { CharacterCard } from './CharacterCard';
import { Icon } from './Icon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DetailTab = 'episodes' | 'story' | 'characters' | 'comments';

const EPISODE_RANGES = [
  { label: '1 - 25', start: 1, end: 25 },
  { label: '26 - 50', start: 26, end: 50 },
  { label: '51 - 75', start: 51, end: 75 },
  { label: '76 - 101', start: 76, end: 101 },
];

const DEFAULT_CHARACTERS: Character[] = [
  {
    id: 'sakuragi',
    name: 'حسان',
    name_ar: 'حسان',
    number: '10',
    position: 'لاعب ارتكاز (PF)',
    role: 'الملتقط البارع',
    description: 'الملتقط البارع',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBay2pNFvEP6okJNNuEvpHzuEVvNakcGDCWWDAmOvdJZeul6pC3BodMEu14ne2FnDGa8wvKjVIwn8a-xBviRbDCTDIikOPsiNQV3xMoHPvi3khhH8tUs7L1kXpXfsHEKhyqOA-EpQhzNTHooB7zCwa5AXMZoasYDuaB62BZUUPyQjlHygseJsWCuqGNxj5DAmcU5117TQEAXXx19g3yLq-mdUUmDuCAKFi3AJcRogWhiW5RTRWuuvee',
  },
  {
    id: 'rukawa',
    name: 'فادي',
    name_ar: 'فادي',
    number: '11',
    position: 'جناح (SF)',
    role: 'الهداف الأول',
    description: 'الهداف الأول',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBY9Oe4UW-RkjU3Aa1WpIqZ2KHzFPVTRjOM8l0Jw1ZpBbKo-ey_0UNBpITLi2BwPSA511RuCabriVm7fSM_UTJaEPBflekSUUnzliYAQbyWo_qF3qArq3g9KjIPQhS0HKZ0SShpFG7IsfI5SOD5S5xtO8Z38WWSmy4vUba3kal-SCkbh409d_Rz8BegmAQLI5J65IwzSbEevZowgHA3LFcbMBOicIHverACdS2EwKF-8grIdBmgr-qP',
  },
  {
    id: 'akagi',
    name: 'سعد',
    name_ar: 'سعد',
    number: '4',
    position: 'وسط (C)',
    role: 'قائد الفريق',
    description: 'قائد الفريق',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA7sHPlqoJzhro2mLsetVPnN2mlUNGPJHYBrGFuAGKxX7xEJzSF4gntCZ2TWcZ6l9RGFFMhgkKU50sS6uuX2GbRiJ80a8bJE6FLV5oD7d5o9kBJvzJ8DZZYvnRHiZrJta7Xz1hIrywUeAAoDwMfMcc3mxl0FVCFoNbCtrL8xugj9ORnQDa-9Mjav9FLzSrPMv1RfDlVh3HV4joBq8AMebBAHcr7CRf7-R4CUXvLDtgb9NQs3G_XlQxV',
  },
  {
    id: 'miyagi',
    name: 'بدر',
    name_ar: 'بدر',
    number: '7',
    position: 'صانع ألعاب (PG)',
    role: 'البرق السريع',
    description: 'البرق السريع',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCqSFt_4ghEuGAvubvgi9yK1jxXuChE7KsKGa_m4tayq-sZkRwoOOYoffdrVnHubf8LNhZ1rYAUBuothXqqSo6sTwSFy5yo5xWrhBea6g7bBQqjPTHQKfGDKfPtuPrbtxxiCosSPq3PSerB4Rqkwb9GZDl3m5SR4RUnQ6700uvh2QUWhYSlFFUxQvKPn34qZis4qlRFWhC65YMLSBWox_CG3ILF02Y9jt21eMDlrJ7yB99WtG5WturR',
  },
  {
    id: 'mitsui',
    name: 'جواد',
    name_ar: 'جواد',
    number: '14',
    position: 'مدافع مسدد (SG)',
    role: 'قناص الثلاثيات',
    description: 'قناص الثلاثيات',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2L0QzTucO0k5-IEPwNIsk-xSXUXEL1fOvHfj_CPhdJqUUNj-ZifftMoTuKmm4yLCl3llzgmmem6ya3MJRr9Rva6pjpIQoPhwvOjMVJhOa0obXUMer8SarhS09lTUpTrNblMCyj2GZ3Ig43HDZK0XH6ieonmSIA0PwqpJ_qba4kjravri9Z8CEHO63JeQhYgnkyAcpqJQ9O3X4P-D4-PH_pf7f3XqifVRjDmShObANWs1amR-pzMSr',
  },
];

interface AnimeDetailViewProps {
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
  const [activeRange, setActiveRange] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);

  const range = EPISODE_RANGES[activeRange];
  const filteredEpisodes = episodes
    .filter((ep) => {
      const num = ep.episode_number || ep.episodeNumber || 0;
      return num >= range.start && num <= range.end;
    })
    .sort((a, b) => {
      const aNum = a.episode_number || a.episodeNumber || 0;
      const bNum = b.episode_number || b.episodeNumber || 0;
      return sortAscending ? aNum - bNum : bNum - aNum;
    });

  const displayList = filteredEpisodes.length > 0 ? filteredEpisodes : episodes.slice(0, 25);

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
      {/* 1. Hero Section & Backdrop (4:5 Ratio) */}
      <View style={styles.heroBackdrop}>
        <Image
          source={{
            uri:
              anime.coverImage ||
              anime.bannerImage ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCqOPuKPjV7jTzRqShCn8mXLqAG0MvyZjwmXtElNs0cz9V5UfqEfnp95BX-uMb6JWf8-ptuZKz3Ef5z4OD0iz4goI2IldXNpsm0Cijg45MzSxd67nhFolMoUaOsan1uXA0HjVJ3grKbCYCef5dfbNhD9_ZsA4pKhtg7lYoObJc2V2RinHdgak6gyPk59lqqfog6XSlcoXvDgHg8Ti3awiFIjMUCYyWdrOiOAv_ClnUke0LCEDbJtwEC',
          }}
          style={styles.heroBackdropImage}
          resizeMode="cover"
        />

        {/* Layered Ambient Scrims */}
        <View style={styles.heroGradientBottom} />
        <View style={styles.heroGradientSoft} />

        {/* Back Button if present */}
        {onBack && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack}
            activeOpacity={0.8}
            accessibilityLabel="رجوع"
          >
            <Icon name="arrow_forward" size={24} color={THEME.colors.onSurface} />
          </TouchableOpacity>
        )}

        {/* Hero Floating Badges & Title Block */}
        <View style={styles.heroContent}>
          {/* Badges Row */}
          <View style={styles.badgesRow}>
            <View style={styles.scoreBadge}>
              <Icon name="star" size={14} color={THEME.colors.onSecondaryContainer} filled />
              <Text style={styles.scoreBadgeText}>
                {anime.rating ? `${anime.rating.toFixed(1)}/10` : '9.4/10'}
              </Text>
            </View>

            <View style={styles.infoPill}>
              <Text style={styles.infoPillText}>{anime.releaseYear || '1993'}</Text>
            </View>

            <View style={styles.infoPill}>
              <Text style={styles.infoPillText}>
                مكتمل ({anime.totalEpisodes || 101} حلقة)
              </Text>
            </View>

            <View style={styles.tagIconic}>
              <Text style={styles.tagIconicText}>أيقونة رياضية</Text>
            </View>
          </View>

          {/* Title & Subtitle */}
          <View style={styles.titleSection}>
            <Text style={styles.displayTitle}>{anime.title}</Text>
            <Text style={styles.displaySubtitle}>
              Slam Dunk • スラムダンク
            </Text>
          </View>

          {/* Genre Chips */}
          <View style={styles.genreChipsRow}>
            {(anime.genres && anime.genres.length > 0
              ? anime.genres
              : ['رياضي', 'كوميديا', 'إثارة وتحدي', 'شبابي كلاسيكي']
            ).map((genre, idx) => (
              <View key={idx} style={styles.genreChip}>
                <Text style={styles.genreChipText}>{genre}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 2. Primary Interactive Actions */}
      <View style={styles.actionsSection}>
        <View style={styles.actionsGrid}>
          {/* Main Play CTA (Span 3) */}
          <TouchableOpacity
            style={styles.mainPlayBtn}
            onPress={() => {
              if (episodes.length > 0) {
                handleEpisodeSelect(episodes[0]);
              }
            }}
            activeOpacity={0.9}
          >
            <Icon name="play_arrow" size={24} color={THEME.colors.onPrimaryContainer} filled />
            <Text style={styles.mainPlayText}>مشاهدة الحلقة 1</Text>
          </TouchableOpacity>

          {/* Bookmark Button */}
          <TouchableOpacity
            style={[
              styles.iconBtn,
              isBookmarked && styles.iconBtnActive,
            ]}
            onPress={() => setIsBookmarked(!isBookmarked)}
            activeOpacity={0.8}
            accessibilityLabel="المفضلة"
          >
            <Icon
              name={isBookmarked ? 'bookmark' : 'bookmark_add'}
              size={22}
              color={
                isBookmarked
                  ? THEME.colors.primaryContainer
                  : THEME.colors.onSurface
              }
            />
          </TouchableOpacity>

          {/* Offline Download VIP */}
          <TouchableOpacity
            style={styles.vipDownloadBtn}
            onPress={handleShare}
            activeOpacity={0.8}
            accessibilityLabel="تحميل VIP"
          >
            <Icon name="download_for_offline" size={22} color={THEME.colors.secondary} />
            <View style={styles.vipTinyTag}>
              <Text style={styles.vipTinyTagText}>VIP</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* VIP Privilege Notice */}
        <View style={styles.vipBanner}>
          <View style={styles.vipIconCircle}>
            <Icon name="verified" size={18} color={THEME.colors.secondary} filled />
          </View>
          <View style={styles.vipBannerTextContainer}>
            <Text style={styles.vipBannerTitle}>
              أول حلقتين مجاناً بجودة فائقة لجميع الأبطال!
            </Text>
            <Text style={styles.vipBannerSub}>
              الحلقات اللاحقة متاحة لمشتركي VIP أو الحسابات المسجلة
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Interactive Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
      >
        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'episodes' && styles.tabPillActive]}
          onPress={() => setActiveTab('episodes')}
          activeOpacity={0.8}
        >
          <Icon
            name="video_library"
            size={18}
            color={
              activeTab === 'episodes'
                ? THEME.colors.primaryContainer
                : THEME.colors.onSurfaceVariant
            }
          />
          <Text
            style={[
              styles.tabPillText,
              activeTab === 'episodes' && styles.tabPillTextActive,
            ]}
          >
            الحلقات
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'story' && styles.tabPillActive]}
          onPress={() => setActiveTab('story')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabPillText,
              activeTab === 'story' && styles.tabPillTextActive,
            ]}
          >
            القصة والمعلومات
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'characters' && styles.tabPillActive]}
          onPress={() => setActiveTab('characters')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabPillText,
              activeTab === 'characters' && styles.tabPillTextActive,
            ]}
          >
            الشخصيات
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'comments' && styles.tabPillActive]}
          onPress={() => setActiveTab('comments')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabPillText,
              activeTab === 'comments' && styles.tabPillTextActive,
            ]}
          >
            التعليقات (1.4K)
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* TAB CONTENT */}

      {/* TAB 1: EPISODES */}
      {activeTab === 'episodes' && (
        <View style={styles.episodesTabContent}>
          {/* Episodes Range Selector & Sorter */}
          <View style={styles.rangeSelectorRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rangesScroll}>
              {EPISODE_RANGES.map((r, idx) => {
                const isSelected = activeRange === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.rangeBtn,
                      isSelected ? styles.rangeBtnActive : styles.rangeBtnInactive,
                    ]}
                    onPress={() => setActiveRange(idx)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.rangeText,
                        isSelected && styles.rangeTextActive,
                      ]}
                    >
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.sortToggleBtn}
              onPress={() => setSortAscending(!sortAscending)}
              activeOpacity={0.7}
              accessibilityLabel="عكس الترتيب"
            >
              <Icon name="swap_vert" size={20} color={THEME.colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Episode Cards List */}
          <View style={styles.episodeCardsList}>
            {displayList.map((ep, idx) => (
              <EpisodeCard
                key={ep.id || idx}
                episode={ep}
                onPress={handleEpisodeSelect}
                isPlaying={idx === 0}
                progress={idx === 0 ? 0.75 : undefined}
              />
            ))}
          </View>
        </View>
      )}

      {/* TAB 2: STORY & DETAILS */}
      {activeTab === 'story' && (
        <View style={styles.storyTabContent}>
          <View style={styles.storyCard}>
            <Text style={styles.storyHeading}>قصة العمل</Text>
            <Text style={styles.storyParagraph}>
              {anime.description ||
                'انضم لمسيرة حسان وفريق الصقور في صراع حماسي مشتعل لتحقيق حلم البطولة الوطنية. النسخة المرممة بأعلى نقاوة صوتية مع الدبلجة الأصلية من استوديوهات الزهرة.'}
            </Text>
          </View>

          <View style={styles.specsCard}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>الاستوديو الأصلي</Text>
              <Text style={styles.specValue}>{anime.studio || 'Toei Animation'}</Text>
            </View>
            <View style={styles.specDivider} />
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>استوديو الدبلجة</Text>
              <Text style={styles.specValue}>مركز الزهرة • سبيستون</Text>
            </View>
            <View style={styles.specDivider} />
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>التصنيف العمري</Text>
              <Text style={styles.specValue}>{anime.ageRating || 'مناسب لجميع الفئات (+13)'}</Text>
            </View>
            <View style={styles.specDivider} />
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>عدد الحلقات</Text>
              <Text style={styles.specValue}>{anime.totalEpisodes || 101} حلقة كاملة</Text>
            </View>
          </View>
        </View>
      )}

      {/* TAB 3: CHARACTERS */}
      {activeTab === 'characters' && (
        <View style={styles.charactersTabContent}>
          <View style={styles.charactersGrid}>
            {(characters && characters.length > 0 ? characters : DEFAULT_CHARACTERS).map(
              (char) => (
                <CharacterCard
                  key={char.id}
                  character={char}
                  onPress={() => {}}
                  width={(SCREEN_WIDTH - THEME.spacing.margin * 2 - 16) / 2}
                />
              )
            )}
          </View>
        </View>
      )}

      {/* TAB 4: COMMENTS */}
      {activeTab === 'comments' && (
        <View style={styles.commentsTabContent}>
          {/* Comment 1 */}
          <View style={styles.commentItem}>
            <View style={styles.commentHeader}>
              <View style={styles.commentUserRow}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarText}>ط</Text>
                </View>
                <View>
                  <View style={styles.commentNameRow}>
                    <Text style={styles.commentName}>طارق الأسطورة</Text>
                    <View style={styles.commentVipPill}>
                      <Text style={styles.commentVipText}>عضو VIP</Text>
                    </View>
                  </View>
                  <Text style={styles.commentTime}>منذ 15 دقيقة</Text>
                </View>
              </View>
              <Icon name="star" size={14} color={THEME.colors.secondary} filled />
            </View>
            <Text style={styles.commentBody}>
              العمل المفضل عبر كل العصور! جودة الترميم هنا مذهلة والصوت كأنك تشاهده لأول مرة.
            </Text>
          </View>

          {/* Comment 2 */}
          <View style={styles.commentItem}>
            <View style={styles.commentHeader}>
              <View style={styles.commentUserRow}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarText}>ر</Text>
                </View>
                <View>
                  <Text style={styles.commentName}>ريم الفهد</Text>
                  <Text style={styles.commentTime}>منذ 45 دقيقة</Text>
                </View>
              </View>
              <Icon name="star" size={14} color={THEME.colors.secondary} filled />
            </View>
            <Text style={styles.commentBody}>
              دبلجة سبيستون جزء من الروح، شكراً على توفير السلسلة كاملة بهذه السلاسة!
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  heroBackdrop: {
    position: 'relative',
    width: '100%',
    aspectRatio: 4 / 5,
    maxHeight: 460,
    justifyContent: 'flex-end',
    backgroundColor: THEME.colors.surfaceContainerLowest,
  },
  heroBackdropImage: {
    ...StyleSheet.absoluteFill as object,
    width: '100%',
    height: '100%',
  },
  heroGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(15, 19, 28, 0.95)',
  },
  heroGradientSoft: {
    ...StyleSheet.absoluteFill as object,
    backgroundColor: 'rgba(15, 19, 28, 0.35)',
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 19, 28, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  heroContent: {
    position: 'relative',
    zIndex: 10,
    paddingHorizontal: THEME.spacing.margin,
    paddingBottom: THEME.spacing.spaceMd,
    gap: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
  },
  scoreBadgeText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSecondaryContainer,
    fontWeight: '800',
  },
  infoPill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
  },
  infoPillText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
  },
  tagIconic: {
    backgroundColor: 'rgba(214, 49, 53, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
  },
  tagIconicText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.tertiary,
    fontWeight: '700',
  },
  titleSection: {
    marginTop: 4,
  },
  displayTitle: {
    ...THEME.typography.displayHeroMobile,
    fontSize: 32,
    color: THEME.colors.onSurface,
    fontWeight: '900',
    textAlign: 'right',
  },
  displaySubtitle: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
    textAlign: 'right',
  },
  genreChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  genreChip: {
    backgroundColor: THEME.colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  genreChipText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  actionsSection: {
    paddingHorizontal: THEME.spacing.margin,
    gap: 12,
    marginTop: 6,
  },
  actionsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mainPlayBtn: {
    flex: 3,
    height: 48,
    backgroundColor: THEME.colors.primaryContainer,
    borderRadius: THEME.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 6,
  },
  mainPlayText: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onPrimaryContainer,
    fontSize: 16,
  },
  iconBtn: {
    flex: 1,
    height: 48,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.25)',
  },
  vipDownloadBtn: {
    flex: 1,
    height: 48,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  vipTinyTag: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: THEME.colors.secondaryContainer,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
  },
  vipTinyTagText: {
    color: THEME.colors.onSecondaryContainer,
    fontSize: 8,
    fontWeight: '900',
  },
  vipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: THEME.colors.surfaceContainerLow,
    padding: 12,
    borderRadius: THEME.radius.md,
  },
  vipIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(238, 152, 0, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipBannerTextContainer: {
    flex: 1,
  },
  vipBannerTitle: {
    ...THEME.typography.labelMd,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },
  vipBannerSub: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  tabsRow: {
    paddingHorizontal: THEME.spacing.margin,
    gap: 8,
    marginTop: 18,
    paddingBottom: 4,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surfaceContainerHigh,
  },
  tabPillActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderWidth: 1,
    borderColor: THEME.colors.primaryContainer,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  tabPillText: {
    ...THEME.typography.titleMd,
    fontSize: 14,
    color: THEME.colors.onSurfaceVariant,
  },
  tabPillTextActive: {
    color: THEME.colors.primaryContainer,
    fontWeight: '700',
  },
  episodesTabContent: {
    paddingHorizontal: THEME.spacing.margin,
    marginTop: 14,
    gap: 12,
  },
  rangeSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  rangesScroll: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  rangeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rangeBtnActive: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  rangeBtnInactive: {
    backgroundColor: THEME.colors.surfaceContainer,
  },
  rangeText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurfaceVariant,
  },
  rangeTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '800',
  },
  sortToggleBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: THEME.colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeCardsList: {
    gap: 10,
    marginTop: 6,
  },
  storyTabContent: {
    paddingHorizontal: THEME.spacing.margin,
    marginTop: 14,
    gap: 14,
  },
  storyCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 16,
    borderRadius: THEME.radius.lg,
    gap: 8,
  },
  storyHeading: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  storyParagraph: {
    ...THEME.typography.bodyMd,
    color: THEME.colors.onSurfaceVariant,
    lineHeight: 24,
    textAlign: 'right',
  },
  specsCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 16,
    borderRadius: THEME.radius.lg,
    gap: 10,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  specLabel: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
  },
  specValue: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  specDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  charactersTabContent: {
    paddingHorizontal: THEME.spacing.margin,
    marginTop: 14,
  },
  charactersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  commentsTabContent: {
    paddingHorizontal: THEME.spacing.margin,
    marginTop: 14,
    gap: 10,
  },
  commentItem: {
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 14,
    borderRadius: THEME.radius.lg,
    gap: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentAvatarText: {
    color: THEME.colors.white,
    fontWeight: 'bold',
  },
  commentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commentName: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  commentVipPill: {
    backgroundColor: 'rgba(238, 152, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  commentVipText: {
    color: THEME.colors.secondary,
    fontSize: 9,
    fontWeight: '800',
  },
  commentTime: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.onSurfaceVariant,
  },
  commentBody: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurface,
    lineHeight: 20,
    textAlign: 'right',
  },
});
