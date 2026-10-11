import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  RefreshControl,
  Share,
} from 'react-native';
import { THEME } from '../constants/theme';
import { HomeApiResponse, Episode, Anime, Character } from '../types';
import { CharacterCard } from '../components/CharacterCard';
import { Icon } from '../components/Icon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

const SHOHOKU_HEROES: Character[] = [
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

const QUOTES = [
  { quote: 'الاستسلام يعني نهاية المباراة فوراً!', author: 'المدرب غسان • سلام دانك' },
  { quote: 'الحقيقة دائماً واحدة لا غير!', author: 'سينشي كودو • المحقق كونان' },
  { quote: 'مهما كانت الصعاب، لن أدع أحداً يقف بيني وبين حلمي!', author: 'حسان • سلام دانك' },
  { quote: 'النجاح يتطلب عرق الجبين والتدريب المتواصل.', author: 'فادي • سلام دانك' },
];

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
  const sliderRef = useRef<FlatList>(null);

  const heroSliderList = data?.slider && data.slider.length > 0
    ? data.slider
    : [
        {
          id: 'slam-dunk',
          title: 'سلام دانك',
          description:
            'انضم لمسيرة حسان وفريق الصقور في صراع حماسي مشتعل لتحقيق حلم البطولة الوطنية. النسخة المرممة بأعلى نقاوة صوتية مع الدبلجة الأصلية.',
          coverImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuADoYmiTDLVPdOHKHLHfTVj9BY7Iw0sy7y3OWFGA1ORHt4ASRSznKBV0bHA-Rlyn_pITdEJzccIA1hdFTzQRtEhMa-g_ftNQUPVsB6tG85oBpPFjTll019-jvkaqcPELw4K_kq6LQ-oH3GoXBowd9GsNOwrqyagRH42bnjzxLP_p1L39z7xE7MSr-WPLBB3f0PUShVjiGlaaUIYTMF1uig6JdAJ28dsSQ2QmWAAcLGzIvJIXaSIkHW5',
          bannerImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuADoYmiTDLVPdOHKHLHfTVj9BY7Iw0sy7y3OWFGA1ORHt4ASRSznKBV0bHA-Rlyn_pITdEJzccIA1hdFTzQRtEhMa-g_ftNQUPVsB6tG85oBpPFjTll019-jvkaqcPELw4K_kq6LQ-oH3GoXBowd9GsNOwrqyagRH42bnjzxLP_p1L39z7xE7MSr-WPLBB3f0PUShVjiGlaaUIYTMF1uig6JdAJ28dsSQ2QmWAAcLGzIvJIXaSIkHW5',
          rating: 9.4,
          totalEpisodes: 101,
          releaseYear: 1993,
        },
      ];

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
      <View style={styles.trustRibbon}>
        <View style={styles.trustItem}>
          <Icon name="bolt" size={15} color={THEME.colors.primaryContainer} filled />
          <Text style={styles.trustText}>سيرفرات فائقة السرعة</Text>
        </View>
        <View style={styles.trustDot} />
        <View style={styles.trustItem}>
          <Icon name="verified" size={15} color={THEME.colors.secondary} filled />
          <Text style={styles.trustText}>بدون إعلانات منبثقة</Text>
        </View>
        <View style={styles.trustDot} />
        <View style={styles.trustItem}>
          <Icon name="cloud_sync" size={15} color={THEME.colors.primaryContainer} filled />
          <Text style={styles.trustText}>تزامن فوري للمشاهدة</Text>
        </View>
      </View>

      {/* 2. Hero Section: Slam Dunk Showcase Slider */}
      <View style={styles.heroSection}>
        {/* Ambient Glow Orbs */}
        <View style={styles.glowBlobRight} />
        <View style={styles.glowBlobLeft} />

        {/* Hero Poster */}
        <View style={styles.heroImageContainer}>
          <Image
            source={{
              uri: currentHero.bannerImage || currentHero.coverImage,
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* Gradient Scrims */}
          <View style={styles.heroOverlayBottom} />
          <View style={styles.heroOverlaySide} />

          {/* Top Badges */}
          <View style={styles.heroTopBadges}>
            <View style={styles.trendingBadge}>
              <Icon name="local_fire_department" size={13} color="#FFF" />
              <Text style={styles.trendingText}>الأكثر مشاهدة هذا الأسبوع</Text>
            </View>

            <View style={styles.topRightStats}>
              <View style={styles.statFhd}>
                <Text style={styles.statFhdText}>1080p FHD</Text>
              </View>
              <View style={styles.statRating}>
                <Icon name="star" size={13} color={THEME.colors.secondary} filled />
                <Text style={styles.statRatingText}>
                  {currentHero.rating ? currentHero.rating.toFixed(1) : '9.4'}
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Title & Synopsis */}
          <View style={styles.heroTextContainer}>
            <View style={styles.tagsRow}>
              <View style={styles.tagPill}>
                <Text style={styles.tagPillText}>رياضي • كلاسيكي • حماسي</Text>
              </View>
              <Text style={styles.episodesMeta}>
                {currentHero.totalEpisodes || 101} حلقة كاملة مدبلجة ومترجمة
              </Text>
            </View>

            <View style={styles.titleRow}>
              <Text style={styles.heroTitle}>{currentHero.title}</Text>
              <Text style={styles.heroSubTitle}>SLAM DUNK</Text>
            </View>

            <Text style={styles.heroDescription} numberOfLines={2}>
              {currentHero.description}
            </Text>
          </View>
        </View>

        {/* Hero Actions CTA */}
        <View style={styles.heroActionsRow}>
          <TouchableOpacity
            style={styles.heroPlayBtn}
            onPress={() => {
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
            }}
            activeOpacity={0.9}
          >
            <Icon name="play_arrow" size={24} color={THEME.colors.onPrimaryContainer} filled />
            <Text style={styles.heroPlayText}>ابدأ المشاهدة - حلقة 1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.iconActionBtn,
              isBookmarked && styles.iconActionBtnActive,
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

          <TouchableOpacity
            style={styles.iconActionBtn}
            onPress={handleShare}
            activeOpacity={0.8}
            accessibilityLabel="مشاركة"
          >
            <Icon name="share" size={22} color={THEME.colors.onSurface} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Continue Watching Section (متابعة المشاهدة) */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.titleBarRed} />
            <Text style={styles.sectionTitle}>متابعة المشاهدة</Text>
          </View>
          <TouchableOpacity
            style={styles.sectionLink}
            onPress={onViewAllEpisodes}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionLinkText}>السجل</Text>
            <Icon name="chevronLeft" size={16} color={THEME.colors.primaryContainer} />
          </TouchableOpacity>
        </View>

        {/* Ongoing Episode Card */}
        <TouchableOpacity
          style={styles.ongoingCard}
          onPress={() => {
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
          }}
          activeOpacity={0.85}
        >
          <View style={styles.ongoingTopRow}>
            {/* Thumbnail */}
            <View style={styles.ongoingThumbnailFrame}>
              <Image
                source={{
                  uri:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCbsbhKvWQAP4PHI6Ylp8Da8j_R93vsekHjOKk1ES39YgK8OJgkfTPYmwWAuYqM6phUYo96Y1CG-phQqbXIGBy0sRgIDfqEeK9hGczBgbeIf9-IgyoYUvlCriHnPx0a3_hG4OpM9h6Qb4NlCYs0bjZOErmJjF6Ha2Haw9gIJmt2B9lOyC3pIFxA33d3oBaP8gchTcf12lM1sEr-z3zA89sapSlK6ZbIaL7hkcz4yfCti3bxxs9Z4piG',
                }}
                style={styles.ongoingThumbnail}
                resizeMode="cover"
              />
              <View style={styles.ongoingPlayCircle}>
                <Icon name="play_arrow" size={18} color={THEME.colors.white} filled />
              </View>
              <View style={styles.ongoingEpTag}>
                <Text style={styles.ongoingEpText}>حلقة 47</Text>
              </View>
            </View>

            {/* Meta */}
            <View style={styles.ongoingMeta}>
              <View>
                <Text style={styles.ongoingAnimeName} numberOfLines={1}>
                  سلام دانك • الموسم الأول
                </Text>
                <Text style={styles.ongoingEpTitle} numberOfLines={1}>
                  التحدي الأخير ضد الساحة
                </Text>
              </View>

              <View style={styles.ongoingBottomRow}>
                <View style={styles.ongoingTimeRow}>
                  <Icon name="schedule" size={14} color={THEME.colors.onSurfaceVariant} />
                  <Text style={styles.ongoingTimeText}>متبقي 08:24 دقيقة</Text>
                </View>

                <View style={styles.resumePill}>
                  <Text style={styles.resumeText}>استئناف</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarGlow, { width: '65%' }]} />
            </View>
            <Text style={styles.progressPercent}>65%</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 4. Shohoku Heroes Roster (أبطال الصقور) */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.titleBarAmber} />
            <Text style={styles.sectionTitle}>أبطال الصقور (Shohoku)</Text>
          </View>
          <View style={styles.badgeGoldPill}>
            <Text style={styles.badgeGoldText}>الخماسي الذهبي</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollList}
        >
          {(characters && characters.length > 0 ? characters : SHOHOKU_HEROES).map(
            (char) => (
              <CharacterCard
                key={char.id}
                character={char}
                onPress={() => onAnimePress(currentHero)}
              />
            )
          )}
        </ScrollView>
      </View>

      {/* 5. Detective Conan Spotlight (عالم المحقق كونان) */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.titleBarRed} />
            <View>
              <Text style={styles.sectionTitle}>عالم المحقق كونان</Text>
              <Text style={styles.sectionSubtitle}>
                أحدث القضايا والأفلام الحصرية المدبلجة
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.sectionLink}
            onPress={onViewAllAnimes}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionLinkText}>عرض الكل</Text>
            <Icon name="chevronLeft" size={16} color={THEME.colors.primaryContainer} />
          </TouchableOpacity>
        </View>

        <View style={styles.grid2Col}>
          {/* Conan Card 1: Movie */}
          <TouchableOpacity
            style={styles.conanCard}
            onPress={() =>
              onAnimePress({
                id: 'conan-movie-27',
                title: 'المحقق كونان: نجم المليون دولار',
                description: 'كونان وكيد في مواجهة هوكايدو',
                coverImage:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuDLG82TQKB8CcEJ-ax9yoNpH1vrdpUoKVmrf7pM6HyoO0AmqYvr8aKEtLLohQv6E9rLqcsmFjx6I3UMZ6PcLNKa5ozr9NXrNLTy8MdqafUjFgVR2Yf5KiR9MsL-wCD3cEg-6c9EH0n1Qc0ryyRTCjKk7rQt-_XTFXWrCxyFvKV1w3dwFVFjUEagLcZcpWkewGP_bCTcz5qD4lOr-8L_fz1OoHuo-egnf4I75lMgiEKCOdFnvPjGJiB1',
                rating: 9.1,
              })
            }
            activeOpacity={0.88}
          >
            <View style={styles.conanImageFrame}>
              <Image
                source={{
                  uri:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuDLG82TQKB8CcEJ-ax9yoNpH1vrdpUoKVmrf7pM6HyoO0AmqYvr8aKEtLLohQv6E9rLqcsmFjx6I3UMZ6PcLNKa5ozr9NXrNLTy8MdqafUjFgVR2Yf5KiR9MsL-wCD3cEg-6c9EH0n1Qc0ryyRTCjKk7rQt-_XTFXWrCxyFvKV1w3dwFVFjUEagLcZcpWkewGP_bCTcz5qD4lOr-8L_fz1OoHuo-egnf4I75lMgiEKCOdFnvPjGJiB1',
                }}
                style={styles.conanImage}
                resizeMode="cover"
              />
              <View style={styles.conanPillRed}>
                <Text style={styles.conanPillRedText}>فيلم حصري 27</Text>
              </View>
              <View style={styles.conanRating}>
                <Icon name="star" size={12} color={THEME.colors.secondary} filled />
                <Text style={styles.conanRatingText}>9.1</Text>
              </View>
            </View>

            <View style={styles.conanDetails}>
              <Text style={styles.conanTitle} numberOfLines={1}>
                نجم المليون دولار
              </Text>
              <Text style={styles.conanDesc} numberOfLines={1}>
                كونان وكيد في مواجهة هوكايدو
              </Text>
              <View style={styles.conanMetaRow}>
                <Text style={styles.conanMetaRed}>مدبلج + مترجم</Text>
                <Text style={styles.conanMetaMuted}>110 دقيقة</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Conan Card 2: Episode Arc */}
          <TouchableOpacity
            style={styles.conanCard}
            onPress={() =>
              onAnimePress({
                id: 'conan-arc',
                title: 'المحقق كونان: المنظمة السوداء',
                description: 'سلسلة كشف الحقيقة الكبرى',
                coverImage:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuC15B-CNbesnx2byAr1Vy_CLVp0X3jJjReKbQbMmgFv2NdhTYfAolD0i9MiBqwFKgK-7ewa-ZGxI7yYFuwZKsCFl27QJ8DCDNMy9rupG3UrERt8yIhSr5EHxMrMGogXwUPWdK6LPjQFFaXXnyD-P-5owY5zSeAu9yaqWYehLApoEinUeLWp9BwPgVsEE2dPTTHWoMn7bS_a1TwmMNqKGZ6ZE3f1UjwFY-lkO52IA8AVuwvUGSNefkVf',
                rating: 8.9,
              })
            }
            activeOpacity={0.88}
          >
            <View style={styles.conanImageFrame}>
              <Image
                source={{
                  uri:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuC15B-CNbesnx2byAr1Vy_CLVp0X3jJjReKbQbMmgFv2NdhTYfAolD0i9MiBqwFKgK-7ewa-ZGxI7yYFuwZKsCFl27QJ8DCDNMy9rupG3UrERt8yIhSr5EHxMrMGogXwUPWdK6LPjQFFaXXnyD-P-5owY5zSeAu9yaqWYehLApoEinUeLWp9BwPgVsEE2dPTTHWoMn7bS_a1TwmMNqKGZ6ZE3f1UjwFY-lkO52IA8AVuwvUGSNefkVf',
                }}
                style={styles.conanImage}
                resizeMode="cover"
              />
              <View style={styles.conanPillDark}>
                <Text style={styles.conanPillDarkText}>حلقة جديدة</Text>
              </View>
              <View style={styles.conanRating}>
                <Icon name="star" size={12} color={THEME.colors.secondary} filled />
                <Text style={styles.conanRatingText}>8.9</Text>
              </View>
            </View>

            <View style={styles.conanDetails}>
              <Text style={styles.conanTitle} numberOfLines={1}>
                أسرار المنظمة السوداء
              </Text>
              <Text style={styles.conanDesc} numberOfLines={1}>
                سلسلة كشف الحقيقة الكبرى
              </Text>
              <View style={styles.conanMetaRow}>
                <Text style={styles.conanMetaRed}>الحلقة 1120</Text>
                <Text style={styles.conanMetaMuted}>FHD</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 6. Golden Nostalgia (كلاسيكيات الزمن الجميل) */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.titleBarGold} />
            <View>
              <Text style={styles.sectionTitle}>كلاسيكيات الزمن الجميل</Text>
              <Text style={styles.sectionSubtitle}>
                نوستالجيا الدبلجة العربية وشوجو وجامبو
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.sectionLink}
            onPress={onViewAllAnimes}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionLinkText}>استكشاف</Text>
            <Icon name="chevronLeft" size={16} color={THEME.colors.primaryContainer} />
          </TouchableOpacity>
        </View>

        <View style={styles.grid3Col}>
          {/* Classic 1: Captain Tsubasa */}
          <TouchableOpacity
            style={styles.classicCard}
            onPress={() =>
              onAnimePress({
                id: 'captain-majed',
                title: 'الكابتن ماجد',
                description: 'الجزء الثاني كاملاً - ذكريات الطفولة',
                coverImage:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuB4T-9NG-yontq-_VgAf5yK8OQDJbVL7UWemnuz0UwTHpkK1eP41SpaooqRctEH4FM8mHVmLmhfoFrcTQqEH2OIOr14_puL271SReQfYAYXybEj3D7jSL8R5YyJ2_oHBpENqRcQK9uo00MbRZZ-Oe45iiuxCh2MjbemCKJHTvB_vKZkudajItvh3knEl014r54VAVy5rxk2ieSQuinvMj6x4AKC73MpxroLA6yxfKU0JEd5vsFhdJ1s',
                totalEpisodes: 128,
              })
            }
            activeOpacity={0.85}
          >
            <View style={styles.classicImageFrame}>
              <Image
                source={{
                  uri:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuB4T-9NG-yontq-_VgAf5yK8OQDJbVL7UWemnuz0UwTHpkK1eP41SpaooqRctEH4FM8mHVmLmhfoFrcTQqEH2OIOr14_puL271SReQfYAYXybEj3D7jSL8R5YyJ2_oHBpENqRcQK9uo00MbRZZ-Oe45iiuxCh2MjbemCKJHTvB_vKZkudajItvh3knEl014r54VAVy5rxk2ieSQuinvMj6x4AKC73MpxroLA6yxfKU0JEd5vsFhdJ1s',
                }}
                style={styles.classicImage}
                resizeMode="cover"
              />
              <View style={styles.classicEpTag}>
                <Text style={styles.classicEpText}>128 حلقة</Text>
              </View>
            </View>
            <View style={styles.classicDetails}>
              <Text style={styles.classicTitle} numberOfLines={1}>
                الكابتن ماجد
              </Text>
              <Text style={styles.classicSubtitle} numberOfLines={1}>
                الجزء الثاني كاملاً
              </Text>
            </View>
          </TouchableOpacity>

          {/* Classic 2: Adnan & Lina */}
          <TouchableOpacity
            style={styles.classicCard}
            onPress={() =>
              onAnimePress({
                id: 'adnan-lina',
                title: 'عدنان ولينا',
                description: 'نسخة مُرممة 4K',
                coverImage:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuC3x1PhWJSc2Ga3PyVDud7Jw8d9qa_2bVJS2MBlje2Y776rmI958znPzzVCMWY6S10GjmC5LWRPLaJA1e9RHhTQan1tReyxU2moqPsChrCWQcc_V6rlfG2IR9ErH3vLr_P_r3hESHVmtLMMhWpsEgJjgOEG4y6TShK9JJr3hX-6Ou3ejBbnMfKEKJeOUwvq5IiNejlyADEv0R0ycDsa3yE_BJ47kY6j1_NR2RcO8wrjg1tERtZNlZQn',
                totalEpisodes: 26,
              })
            }
            activeOpacity={0.85}
          >
            <View style={styles.classicImageFrame}>
              <Image
                source={{
                  uri:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuC3x1PhWJSc2Ga3PyVDud7Jw8d9qa_2bVJS2MBlje2Y776rmI958znPzzVCMWY6S10GjmC5LWRPLaJA1e9RHhTQan1tReyxU2moqPsChrCWQcc_V6rlfG2IR9ErH3vLr_P_r3hESHVmtLMMhWpsEgJjgOEG4y6TShK9JJr3hX-6Ou3ejBbnMfKEKJeOUwvq5IiNejlyADEv0R0ycDsa3yE_BJ47kY6j1_NR2RcO8wrjg1tERtZNlZQn',
                }}
                style={styles.classicImage}
                resizeMode="cover"
              />
              <View style={styles.classicEpTag}>
                <Text style={styles.classicEpText}>26 حلقة</Text>
              </View>
            </View>
            <View style={styles.classicDetails}>
              <Text style={styles.classicTitle} numberOfLines={1}>
                عدنان ولينا
              </Text>
              <Text style={styles.classicSubtitle} numberOfLines={1}>
                نسخة مُرممة 4K
              </Text>
            </View>
          </TouchableOpacity>

          {/* Classic 3: Hunter x Hunter 1999 */}
          <TouchableOpacity
            style={styles.classicCard}
            onPress={() =>
              onAnimePress({
                id: 'hunter-1999',
                title: 'القناص 1999',
                description: 'الدبلجة الأصلية سبيستون',
                coverImage:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBThQeOlyY4c2TpQ04X5xjIVNt0Uo0Gz75f7mOOWvfIFNgiwbwBGmZ9vNjhxRvv5mm_QkbUmnsue9zux3hFGTQQDzMVcWho6GwnDU5RAgORuGF0QbPQH7OXL534zNFpZdV6LtyOavUpSUQmg-U7i5FMihk_vLXw4fiI3ppw_8ljUBz8abKJxwPQv4b9f3JCe3PGKCmQHUfWhz_x3n2M5V-ktHUFTMbXEzu5C0aS3U0UnN_HTGenUCSF',
                totalEpisodes: 62,
              })
            }
            activeOpacity={0.85}
          >
            <View style={styles.classicImageFrame}>
              <Image
                source={{
                  uri:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBThQeOlyY4c2TpQ04X5xjIVNt0Uo0Gz75f7mOOWvfIFNgiwbwBGmZ9vNjhxRvv5mm_QkbUmnsue9zux3hFGTQQDzMVcWho6GwnDU5RAgORuGF0QbPQH7OXL534zNFpZdV6LtyOavUpSUQmg-U7i5FMihk_vLXw4fiI3ppw_8ljUBz8abKJxwPQv4b9f3JCe3PGKCmQHUfWhz_x3n2M5V-ktHUFTMbXEzu5C0aS3U0UnN_HTGenUCSF',
                }}
                style={styles.classicImage}
                resizeMode="cover"
              />
              <View style={styles.classicEpTag}>
                <Text style={styles.classicEpText}>62 حلقة</Text>
              </View>
            </View>
            <View style={styles.classicDetails}>
              <Text style={styles.classicTitle} numberOfLines={1}>
                القناص 1999
              </Text>
              <Text style={styles.classicSubtitle} numberOfLines={1}>
                الدبلجة الأصلية
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 7. Interactive Inspiring Fan Quote Toast */}
      <View style={styles.quoteCard}>
        <View style={styles.quoteContent}>
          <View style={styles.quoteIconCircle}>
            <Icon name="format_quote" size={22} color={THEME.colors.primaryContainer} />
          </View>
          <View style={styles.quoteTextContainer}>
            <Text style={styles.quoteBody}>"{QUOTES[quoteIdx].quote}"</Text>
            <Text style={styles.quoteAuthor}>{QUOTES[quoteIdx].author}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.quoteRefreshBtn}
          onPress={handleNextQuote}
          activeOpacity={0.7}
          accessibilityLabel="مقولة أخرى"
        >
          <Icon name="cached" size={18} color={THEME.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  trustRibbon: {
    width: '100%',
    backgroundColor: THEME.colors.surfaceContainerLowest,
    paddingVertical: 8,
    paddingHorizontal: THEME.spacing.margin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  trustDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.outlineVariant,
  },
  heroSection: {
    position: 'relative',
    backgroundColor: THEME.colors.surfaceContainerLow,
    paddingBottom: THEME.spacing.spaceLg,
    overflow: 'hidden',
  },
  glowBlobRight: {
    position: 'absolute',
    top: -48,
    right: -48,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(220, 38, 38, 0.16)',
  },
  glowBlobLeft: {
    position: 'absolute',
    top: 180,
    left: -48,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(238, 152, 0, 0.12)',
  },
  heroImageContainer: {
    position: 'relative',
    width: '100%',
    height: 370,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: 'rgba(15, 19, 28, 0.92)',
  },
  heroOverlaySide: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 19, 28, 0.4)',
  },
  heroTopBadges: {
    position: 'absolute',
    top: 16,
    left: THEME.spacing.margin,
    right: THEME.spacing.margin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: THEME.colors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 4,
  },
  trendingText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onPrimaryContainer,
  },
  topRightStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statFhd: {
    backgroundColor: 'rgba(38, 42, 51, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statFhdText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurface,
  },
  statRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(238, 152, 0, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statRatingText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },
  heroTextContainer: {
    position: 'absolute',
    bottom: 12,
    left: THEME.spacing.margin,
    right: THEME.spacing.margin,
    gap: 6,
    zIndex: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagPill: {
    backgroundColor: 'rgba(220, 38, 38, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  tagPillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primary,
  },
  episodesMeta: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  heroTitle: {
    ...THEME.typography.displayHeroMobile,
    color: THEME.colors.onSurface,
  },
  heroSubTitle: {
    ...THEME.typography.headlineMd,
    color: THEME.colors.primaryContainer,
  },
  heroDescription: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    lineHeight: 20,
  },
  heroActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.margin,
    paddingTop: 12,
    gap: 12,
  },
  heroPlayBtn: {
    flex: 1,
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primaryContainer,
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
  heroPlayText: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  iconActionBtn: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActionBtnActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
  },
  sectionContainer: {
    marginTop: 28,
    paddingHorizontal: THEME.spacing.margin,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleBarRed: {
    width: 5,
    height: 18,
    borderRadius: 2.5,
    backgroundColor: THEME.colors.primaryContainer,
  },
  titleBarAmber: {
    width: 5,
    height: 18,
    borderRadius: 2.5,
    backgroundColor: THEME.colors.secondary,
  },
  titleBarGold: {
    width: 5,
    height: 18,
    borderRadius: 2.5,
    backgroundColor: THEME.colors.secondaryContainer,
  },
  sectionTitle: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
  },
  sectionSubtitle: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  sectionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sectionLinkText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.primaryContainer,
  },
  badgeGoldPill: {
    backgroundColor: 'rgba(238, 152, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
  },
  badgeGoldText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
  },
  ongoingCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.lg,
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  ongoingTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ongoingThumbnailFrame: {
    position: 'relative',
    width: 128,
    height: 80,
    borderRadius: THEME.radius.DEFAULT,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surfaceContainerHigh,
  },
  ongoingThumbnail: {
    width: '100%',
    height: '100%',
  },
  ongoingPlayCircle: {
    ...StyleSheet.absoluteFill as object,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ongoingEpTag: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  ongoingEpText: {
    ...THEME.typography.labelSm,
    fontSize: 9,
    color: THEME.colors.onSurface,
  },
  ongoingMeta: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  ongoingAnimeName: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryContainer,
  },
  ongoingEpTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
    marginTop: 2,
  },
  ongoingBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ongoingTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ongoingTimeText: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
  },
  resumePill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.sm,
  },
  resumeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryContainer,
    fontWeight: '700',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  progressBarGlow: {
    height: '100%',
    backgroundColor: THEME.colors.primaryContainer,
    borderRadius: 3,
  },
  progressPercent: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.onSurfaceVariant,
  },
  horizontalScrollList: {
    gap: 12,
    paddingVertical: 4,
  },
  grid2Col: {
    flexDirection: 'row',
    gap: 12,
  },
  conanCard: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  conanImageFrame: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: THEME.colors.surfaceContainerHigh,
  },
  conanImage: {
    width: '100%',
    height: '100%',
  },
  conanPillRed: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: THEME.colors.primaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  conanPillRedText: {
    ...THEME.typography.labelSm,
    fontSize: 9,
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  conanPillDark: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: THEME.colors.surfaceBright,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  conanPillDarkText: {
    ...THEME.typography.labelSm,
    fontSize: 9,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  conanRating: {
    position: 'absolute',
    bottom: 4,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(10, 14, 22, 0.82)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  conanRatingText: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },
  conanDetails: {
    padding: 10,
    gap: 3,
  },
  conanTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  conanDesc: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
  },
  conanMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 4,
    backgroundColor: THEME.colors.surfaceContainerLow,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  conanMetaRed: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.primaryContainer,
    fontWeight: '700',
  },
  conanMetaMuted: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.onSurfaceVariant,
  },
  grid3Col: {
    flexDirection: 'row',
    gap: 10,
  },
  classicCard: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  classicImageFrame: {
    position: 'relative',
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: THEME.colors.surfaceContainerHigh,
  },
  classicImage: {
    width: '100%',
    height: '100%',
  },
  classicEpTag: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  classicEpText: {
    ...THEME.typography.labelSm,
    fontSize: 9,
    color: THEME.colors.onSurface,
  },
  classicDetails: {
    padding: 8,
    gap: 2,
  },
  classicTitle: {
    ...THEME.typography.labelLg,
    fontSize: 13,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  classicSubtitle: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.onSurfaceVariant,
  },
  quoteCard: {
    marginTop: 24,
    marginHorizontal: THEME.spacing.margin,
    padding: 14,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 5,
  },
  quoteContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quoteIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteTextContainer: {
    flex: 1,
  },
  quoteBody: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
    lineHeight: 18,
  },
  quoteAuthor: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryContainer,
    marginTop: 3,
  },
  quoteRefreshBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: THEME.colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
