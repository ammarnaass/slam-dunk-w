import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './home.styles';

interface HomeContinueWatchingProps {
  onEpisodePress: () => void;
  onViewAllEpisodes?: () => void;
  title?: string;
  animeName?: string;
  episodeNumber?: number;
  remainingTime?: string;
  progressPercent?: number;
  thumbnailUrl?: string;
}

export const HomeContinueWatching: React.FC<HomeContinueWatchingProps> = ({
  onEpisodePress,
  onViewAllEpisodes,
  title = 'التحدي الأخير ضد الساحة',
  animeName = 'سلام دانك • الموسم الأول',
  episodeNumber = 47,
  remainingTime = 'متبقي 08:24 دقيقة',
  progressPercent = 65,
  thumbnailUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbsbhKvWQAP4PHI6Ylp8Da8j_R93vsekHjOKk1ES39YgK8OJgkfTPYmwWAuYqM6phUYo96Y1CG-phQqbXIGBy0sRgIDfqEeK9hGczBgbeIf9-IgyoYUvlCriHnPx0a3_hG4OpM9h6Qb4NlCYs0bjZOErmJjF6Ha2Haw9gIJmt2B9lOyC3pIFxA33d3oBaP8gchTcf12lM1sEr-z3zA89sapSlK6ZbIaL7hkcz4yfCti3bxxs9Z4piG',
}) => {
  return (
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
        onPress={onEpisodePress}
        activeOpacity={0.85}
      >
        <View style={styles.ongoingTopRow}>
          {/* Thumbnail */}
          <View style={styles.ongoingThumbnailFrame}>
            <Image
              source={{ uri: thumbnailUrl }}
              style={styles.ongoingThumbnail}
              resizeMode="cover"
            />
            <View style={styles.ongoingPlayCircle}>
              <Icon name="play_arrow" size={18} color={THEME.colors.white} filled />
            </View>
            <View style={styles.ongoingEpTag}>
              <Text style={styles.ongoingEpText}>حلقة {episodeNumber}</Text>
            </View>
          </View>

          {/* Meta */}
          <View style={styles.ongoingMeta}>
            <View>
              <Text style={styles.ongoingAnimeName} numberOfLines={1}>
                {animeName}
              </Text>
              <Text style={styles.ongoingEpTitle} numberOfLines={1}>
                {title}
              </Text>
            </View>

            <View style={styles.ongoingBottomRow}>
              <View style={styles.ongoingTimeRow}>
                <Icon name="schedule" size={14} color={THEME.colors.onSurfaceVariant} />
                <Text style={styles.ongoingTimeText}>{remainingTime}</Text>
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
            <View style={[styles.progressBarGlow, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressPercent}>{progressPercent}%</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
