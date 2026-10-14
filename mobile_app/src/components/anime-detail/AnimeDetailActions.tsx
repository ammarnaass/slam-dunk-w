import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { animeDetailStyles as styles } from './anime-detail.styles';

interface AnimeDetailActionsProps {
  onPlayPress: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShare: () => void;
}

export const AnimeDetailActions: React.FC<AnimeDetailActionsProps> = ({
  onPlayPress,
  isBookmarked,
  onToggleBookmark,
  onShare,
}) => {
  return (
    <View style={styles.actionsSection}>
      <View style={styles.actionsGrid}>
        {/* Main Play CTA (Span 3) */}
        <TouchableOpacity
          style={styles.mainPlayBtn}
          onPress={onPlayPress}
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

        {/* Offline Download VIP */}
        <TouchableOpacity
          style={styles.vipDownloadBtn}
          onPress={onShare}
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
  );
};
