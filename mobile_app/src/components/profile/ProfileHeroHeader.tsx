import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { THEME } from '../../constants/theme';
import { UserProfile } from '../../types';
import { Icon } from '../Icon';
import { styles } from './profile.styles';

interface ProfileHeroHeaderProps {
  profile: UserProfile | null;
  displayName: string;
  handle: string;
  onEditAvatar?: () => void;
}

export const ProfileHeroHeader: React.FC<ProfileHeroHeaderProps> = ({
  profile,
  displayName,
  handle,
  onEditAvatar,
}) => {
  const handleAvatarPress = () => {
    if (onEditAvatar) {
      onEditAvatar();
    } else {
      Alert.alert('تغيير الصورة', 'اختر صورة من معرض هاتفك لتحديث مظهرك الرمزي');
    }
  };

  return (
    <View style={styles.profileHeroSection}>
      <View style={styles.glowBlob1} />
      <View style={styles.glowBlob2} />

      <View style={styles.profileHeroCard}>
        {/* Avatar with Ring & Badges */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarGradientRing}>
            <Image
              source={{
                uri:
                  profile?.avatar ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuCCZjmzlo6X0pIwIou5pcHvqx3nA-ilqfqhpaodDPEAVOEJjOXXV5afRjE_9TQLXLgj1YHbHeYSpCVWw_SkX1jK88zV5nhGfXIMty0lDE1BVxyPDYbaGYxUny6PF-UvELXyVLoUVF2HoTOJ0trxX5EI6wJs9fqShJ81HeS968bjlZnmb6eW30nJN9C9lJ3yPVVVx5Y5BDDRTWHJ87-4LUrsDbR2eG1tzV0CqKDcHomt7MLQX-49pR6k',
              }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>

          {/* VIP Crown Tag */}
          <View style={styles.vipCrownTag}>
            <Icon name="workspace_premium" size={13} color={THEME.colors.onSecondary} />
            <Text style={styles.vipCrownText}>VIP S2</Text>
          </View>

          {/* Camera Edit Button */}
          <TouchableOpacity
            style={styles.cameraBtn}
            onPress={handleAvatarPress}
            accessibilityLabel="تغيير الصورة الرمزية"
          >
            <Icon name="photo_camera" size={16} color={THEME.colors.white} />
          </TouchableOpacity>
        </View>

        {/* Names and Status */}
        <View style={styles.nameSection}>
          <View style={styles.nameRow}>
            <Text style={styles.displayNameText}>{displayName}</Text>
            <View style={styles.handleBadge}>
              <Text style={styles.handleText}>@{handle}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Icon name="calendar_month" size={14} color={THEME.colors.primary} />
              <Text style={styles.metaText}>عضو منذ مارس 2022</Text>
            </View>
            <Text style={styles.metaDot}>•</Text>
            <View style={styles.metaItem}>
              <Icon name="stars" size={14} color={THEME.colors.secondary} />
              <Text style={styles.metaTextGold}>مشترك VIP سنوي ✨</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Bento Banner */}
        <View style={styles.statsBanner}>
          <View style={styles.statBox}>
            <Text style={styles.statNumberPrimary}>482</Text>
            <Text style={styles.statLabel}>حلقة مكتملة</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumberSecondary}>36</Text>
            <Text style={styles.statLabel}>أنمي مفضل</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumberWhite}>1,420</Text>
            <Text style={styles.statLabel}>ساعة مشاهدة</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
