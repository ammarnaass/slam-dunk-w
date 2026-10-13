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
import { Icon } from './Icon';
import { EpisodesTab } from './anime-detail/EpisodesTab';
import { CharactersTab } from './anime-detail/CharactersTab';
import { StoryTab } from './anime-detail/StoryTab';
import { CommentsTab } from './anime-detail/CommentsTab';

export { DEFAULT_CHARACTERS } from './anime-detail/CharactersTab';
export { EPISODE_RANGES } from './anime-detail/EpisodesTab';

type DetailTab = 'episodes' | 'story' | 'characters' | 'comments';

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
    ...(StyleSheet.absoluteFill as object),
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 19, 28, 0.35)',
  },
  backBtn: {
    position: 'absolute',
    top: 40,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 19, 28, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  heroContent: {
    position: 'relative',
    zIndex: 10,
    paddingHorizontal: THEME.spacing.margin,
    paddingBottom: 16,
    gap: 10,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.xs,
  },
  scoreBadgeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSecondaryContainer,
    fontWeight: '800',
  },
  infoPill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.xs,
  },
  infoPillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  tagIconic: {
    backgroundColor: 'rgba(220, 38, 38, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.4)',
  },
  tagIconicText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryContainer,
    fontWeight: '700',
  },
  titleSection: {
    gap: 2,
  },
  displayTitle: {
    ...THEME.typography.headlineLg,
    color: THEME.colors.onSurface,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'right',
  },
  displaySubtitle: {
    ...THEME.typography.titleSm,
    color: THEME.colors.onSurfaceVariant,
    fontSize: 12,
    textAlign: 'right',
  },
  genreChipsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  genreChip: {
    backgroundColor: THEME.colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.xs,
  },
  genreChipText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    fontSize: 11,
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
});
