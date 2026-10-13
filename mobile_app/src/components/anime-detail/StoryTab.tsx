import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';
import { Anime } from '../../types';

interface StoryTabProps {
  anime: Anime;
}

export const StoryTab: React.FC<StoryTabProps> = ({ anime }) => {
  return (
    <View style={styles.storyTabContent}>
      <View style={styles.storyCard}>
        <Text style={styles.storyHeading}>قصة العمل</Text>
        <Text style={styles.storyParagraph}>
          {anime.description ||
            'انضم لمسيرة حسان وفريق الصقور في صراع حماسي مشتعل لتحقيق حلم البطولة الوطنية. النسخة المرممة بأعلى نقاوة صوتية مع الدبلجة الأصلية من استوديوهات الزهرة.'}
        </Text>
      </View>

      <View style={styles.specsCard}>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>الاستوديو الأصلي</Text>
          <Text style={styles.specValue}>{anime.studio || 'Toei Animation'}</Text>
        </View>
        <View style={styles.specDivider} />
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>استوديو الدبلجة</Text>
          <Text style={styles.specValue}>مركز الزهرة • سبيستون</Text>
        </View>
        <View style={styles.specDivider} />
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>التصنيف العمري</Text>
          <Text style={styles.specValue}>{anime.ageRating || 'مناسب لجميع الفئات (+13)'}</Text>
        </View>
        <View style={styles.specDivider} />
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>عدد الحلقات</Text>
          <Text style={styles.specValue}>{anime.totalEpisodes || 101} حلقة كاملة</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  storyTabContent: {
    paddingHorizontal: THEME.spacing.margin,
    marginTop: 14,
    gap: 14,
  },
  storyCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 16,
    borderRadius: THEME.radius.lg,
    gap: 8,
  },
  storyHeading: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  storyParagraph: {
    ...THEME.typography.bodyMd,
    color: THEME.colors.onSurfaceVariant,
    lineHeight: 24,
    textAlign: 'right',
  },
  specsCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 16,
    borderRadius: THEME.radius.lg,
    gap: 10,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  specLabel: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
  },
  specValue: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  specDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});
