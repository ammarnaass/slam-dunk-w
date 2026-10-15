import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { THEME } from '../constants/theme';
import { Icon } from './Icon';
import { styles } from './header.styles';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  onSearchPress?: () => void;
  showSearch?: boolean;
  onVipPress?: () => void;
  onNotificationPress?: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
  showBookmark?: boolean;
  onBookmarkPress?: () => void;
  showShare?: boolean;
  onSharePress?: () => void;
  userAvatar?: string | null;
  isVip?: boolean;
}

const DEFAULT_AVATAR =
  'https://lh3.googleusercontent.com/aida/AEtjO1UqLVIEiU9HTEZwLj5XT18efMovYDsIt0odDPiQwRI-2kSKsB6LtCjmqPZKVvQ6hWVGxw8P1ll2jKa324hpg-MPBcPpyYNDTVuLhePTwl4fG2RHdUiiXdafOKHAnwXRb4iJN1-buVYoIF1ZMuRQlVpPuQnavyAGOiyfIp8UUtgnVtn3PcxcptuY9g7r3f6BgRGNIUCHpLP8UHcWOlrIU31Ad_Zalj5GaLbZgRWAI593ZFgg1EYzM0vqAko';

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onSearchPress,
  showSearch = true,
  onVipPress,
  onNotificationPress,
  showBack = false,
  onBackPress,
  showBookmark = false,
  onBookmarkPress,
  showShare = false,
  onSharePress,
  userAvatar,
  isVip = true,
}) => {
  const isHome = title === 'ANIME DAZE';

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {/* Leading section (In RTL: right-hand side) */}
        <View style={styles.leadingSection}>
          {showBack ? (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onBackPress}
              activeOpacity={0.7}
              accessibilityLabel="رجوع"
            >
              <Icon name="arrow_forward" size={24} color={THEME.colors.onSurface} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={onVipPress}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: userAvatar || DEFAULT_AVATAR }}
                style={styles.miniAvatar}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}

          {/* Titles */}
          <View style={styles.titleContainer}>
            {isHome ? (
              <>
                <View style={styles.brandRow}>
                  <Text style={styles.brandTitle}>ANIME DAZE</Text>
                  <View style={styles.brandDot} />
                </View>
                <Text style={styles.subTitle}>{subtitle || 'Home'}</Text>
              </>
            ) : (
              <>
                <Text style={styles.pageTitle} numberOfLines={1}>
                  {title}
                </Text>
                {subtitle ? (
                  <Text style={styles.subTitle} numberOfLines={1}>
                    {subtitle}
                  </Text>
                ) : null}
              </>
            )}
          </View>
        </View>

        {/* Trailing actions (In RTL: left-hand side) */}
        <View style={styles.trailingSection}>
          {showShare && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onSharePress}
              activeOpacity={0.7}
              accessibilityLabel="مشاركة"
            >
              <Icon name="share" size={22} color={THEME.colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}

          {showBookmark && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onBookmarkPress}
              activeOpacity={0.7}
              accessibilityLabel="حفظ"
            >
              <Icon name="bookmark_border" size={22} color={THEME.colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}

          {showSearch && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onSearchPress}
              activeOpacity={0.7}
              accessibilityLabel="بحث"
            >
              <Icon name="search" size={22} color={THEME.colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}

          {onNotificationPress && !showBack && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onNotificationPress}
              activeOpacity={0.7}
              accessibilityLabel="الإشعارات"
            >
              <Icon name="notifications" size={22} color={THEME.colors.onSurfaceVariant} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          )}

          {/* VIP Crest Button if on Home or general view without back */}
          {!showBack && onVipPress && (
            <TouchableOpacity
              style={styles.vipContainer}
              onPress={onVipPress}
              activeOpacity={0.8}
            >
              <View style={styles.vipRing}>
                <Icon name="person" size={20} color={THEME.colors.secondary} />
              </View>
              {isVip && (
                <View style={styles.vipTag}>
                  <Text style={styles.vipTagText}>VIP</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
