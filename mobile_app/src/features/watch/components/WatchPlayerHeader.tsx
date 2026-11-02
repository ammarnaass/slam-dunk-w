import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { THEME } from '../../../constants/theme';
import { Icon } from '../../../components/Icon';
import { WatchPlayerHeaderProps } from '../types/watch.types';
import { modalStyles } from '../styles/modal.styles';

export const WatchPlayerHeader: React.FC<WatchPlayerHeaderProps> = ({
  onClose,
  onShare,
  isBookmarked,
  onToggleBookmark,
}) => {
  return (
    <View style={modalStyles.header}>
      <View style={modalStyles.headerLeading}>
        <TouchableOpacity
          style={modalStyles.headerIconBtn}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Icon name="arrow_back" size={24} color={THEME.colors.onSurface} />
        </TouchableOpacity>

        <View style={modalStyles.headerProfileRow}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD34F7gR37oU9900oK-0UqV2G3oF9Kk6Zz8r1d5kM4e5W7qJ9m2pQ',
            }}
            style={modalStyles.headerAvatar}
          />
          <Text style={modalStyles.headerTitle}>مشغل سلام دانك</Text>
        </View>
      </View>

      <View style={modalStyles.headerTrailing}>
        <TouchableOpacity
          style={modalStyles.headerIconBtn}
          onPress={onToggleBookmark}
          activeOpacity={0.7}
        >
          <Icon
            name={isBookmarked ? 'bookmark' : 'bookmark_border'}
            size={22}
            color={
              isBookmarked
                ? THEME.colors.primaryContainer
                : THEME.colors.onSurfaceVariant
            }
            filled={isBookmarked}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={modalStyles.headerIconBtn}
          onPress={onShare}
          activeOpacity={0.7}
        >
          <Icon name="share" size={22} color={THEME.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
