import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './watch.styles';

interface WatchPlayerHeaderProps {
  onClose: () => void;
  onShare: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const WatchPlayerHeader: React.FC<WatchPlayerHeaderProps> = ({
  onClose,
  onShare,
  isBookmarked,
  onToggleBookmark,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeading}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={onClose}
          accessibilityLabel="إغلاق"
        >
          <Icon name="arrow_forward" size={24} color={THEME.colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerProfileRow}>
          <Image
            source={{
              uri:
                'https://lh3.googleusercontent.com/aida/AEtjO1UqLVIEiU9HTEZwLj5XT18efMovYDsIt0odDPiQwRI-2kSKsB6LtCjmqPZKVvQ6hWVGxw8P1ll2jKa324hpg-MPBcPpyYNDTVuLhePTwl4fG2RHdUiiXdafOKHAnwXRb4iJN1-buVYoIF1ZMuRQlVpPuQnavyAGOiyfIp8UUtgnVtn3PcxcptuY9g7r3f6BgRGNIUCHpLP8UHcWOlrIU31Ad_Zalj5GaLbZgRWAI593ZFgg1EYzM0vqAko',
            }}
            style={styles.headerAvatar}
          />
          <Text style={styles.headerTitle} numberOfLines={1}>
            مشغل الفيديو السينمائي
          </Text>
        </View>
      </View>

      <View style={styles.headerTrailing}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={onShare}
          accessibilityLabel="مشاركة"
        >
          <Icon name="share" size={22} color={THEME.colors.onSurfaceVariant} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={onToggleBookmark}
          accessibilityLabel="حفظ"
        >
          <Icon
            name={isBookmarked ? 'bookmark' : 'bookmark_border'}
            size={22}
            color={
              isBookmarked
                ? THEME.colors.primaryContainer
                : THEME.colors.onSurfaceVariant
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
