import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { animeDetailStyles as styles } from './anime-detail.styles';

export type DetailTab = 'episodes' | 'story' | 'characters' | 'comments';

interface AnimeDetailTabsBarProps {
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  commentsCount?: string;
}

export const AnimeDetailTabsBar: React.FC<AnimeDetailTabsBarProps> = ({
  activeTab,
  onTabChange,
  commentsCount = '1.4K',
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsRow}
    >
      <TouchableOpacity
        style={[styles.tabPill, activeTab === 'episodes' && styles.tabPillActive]}
        onPress={() => onTabChange('episodes')}
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
        onPress={() => onTabChange('story')}
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
        onPress={() => onTabChange('characters')}
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
        onPress={() => onTabChange('comments')}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.tabPillText,
            activeTab === 'comments' && styles.tabPillTextActive,
          ]}
        >
          التعليقات ({commentsCount})
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
