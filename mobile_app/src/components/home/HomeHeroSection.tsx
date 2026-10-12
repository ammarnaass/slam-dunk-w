import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './home.styles';

export interface HeroItem {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  bannerImage?: string;
  rating?: number;
  totalEpisodes?: number;
  releaseYear?: number;
}

interface HomeHeroSectionProps {
  hero: HeroItem;
  isBookmarked: boolean;
  onPlayPress: () => void;
  onToggleBookmark: () => void;
  onShare: () => void;
}

export const HomeHeroSection: React.FC<HomeHeroSectionProps> = ({
  hero,
  isBookmarked,
  onPlayPress,
  onToggleBookmark,
  onShare,
}) => {
  return (
    <View style={styles.heroSection}>
      {/* Ambient Glow Orbs */}
      <View style={styles.glowBlobRight} />
      <View style={styles.glowBlobLeft} />

      {/* Hero Poster */}
      <View style={styles.heroImageContainer}>
        <Image
          source={{
            uri: hero.bannerImage || hero.coverImage,
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
                {hero.rating ? hero.rating.toFixed(1) : '9.4'}
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
              {hero.totalEpisodes || 101} حلقة كاملة مدبلجة ومترجمة
            </Text>
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.heroTitle}>{hero.title}</Text>
            <Text style={styles.heroSubTitle}>SLAM DUNK</Text>
          </View>

          <Text style={styles.heroDescription} numberOfLines={2}>
            {hero.description}
          </Text>
        </View>
      </View>

      {/* Hero Actions CTA */}
      <View style={styles.heroActionsRow}>
        <TouchableOpacity
          style={styles.heroPlayBtn}
          onPress={onPlayPress}
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
          onPress={onToggleBookmark}
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
          onPress={onShare}
          activeOpacity={0.8}
          accessibilityLabel="مشاركة"
        >
          <Icon name="share" size={22} color={THEME.colors.onSurface} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
