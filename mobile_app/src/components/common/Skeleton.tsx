import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, DimensionValue, ViewStyle } from 'react-native';
import { THEME } from '../../constants/theme';

interface SkeletonBoxProps {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width,
  height,
  borderRadius = THEME.radius.md,
  style,
}) => {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.75,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.skeletonBox,
        {
          width,
          height,
          borderRadius,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};

export const HomeScreenSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Hero Banner Skeleton */}
      <View style={styles.heroSkeleton}>
        <SkeletonBox width="100%" height={320} borderRadius={0} />
        <View style={styles.heroInfoOverlay}>
          <SkeletonBox width={120} height={24} borderRadius={12} style={{ marginBottom: 12 }} />
          <SkeletonBox width={220} height={32} borderRadius={8} style={{ marginBottom: 8 }} />
          <SkeletonBox width={160} height={16} borderRadius={6} style={{ marginBottom: 20 }} />
          <View style={{ flexDirection: 'row-reverse', gap: 12 }}>
            <SkeletonBox width={140} height={44} borderRadius={12} />
            <SkeletonBox width={44} height={44} borderRadius={12} />
          </View>
        </View>
      </View>

      {/* Ticker Skeleton */}
      <View style={styles.sectionPadding}>
        <SkeletonBox width="100%" height={36} borderRadius={10} style={{ marginVertical: 12 }} />
      </View>

      {/* Continue Watching Section Skeleton */}
      <View style={styles.sectionPadding}>
        <SkeletonBox width={140} height={20} borderRadius={6} style={{ marginBottom: 12 }} />
        <SkeletonBox width="100%" height={90} borderRadius={14} style={{ marginBottom: 20 }} />
      </View>

      {/* Latest Episodes Horizontal Row Skeleton */}
      <View style={styles.sectionPadding}>
        <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 12 }}>
          <SkeletonBox width={130} height={20} borderRadius={6} />
          <SkeletonBox width={60} height={18} borderRadius={6} />
        </View>
        <View style={{ flexDirection: 'row-reverse', gap: 12 }}>
          <SkeletonBox width={150} height={110} borderRadius={12} />
          <SkeletonBox width={150} height={110} borderRadius={12} />
          <SkeletonBox width={150} height={110} borderRadius={12} />
        </View>
      </View>
    </View>
  );
};

export const AnimeGridSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Search Header Skeleton */}
      <View style={[styles.sectionPadding, { paddingTop: 16 }]}>
        <SkeletonBox width="100%" height={46} borderRadius={14} style={{ marginBottom: 14 }} />
        {/* Genre Filter Pills */}
        <View style={{ flexDirection: 'row-reverse', gap: 8, marginBottom: 16 }}>
          <SkeletonBox width={70} height={32} borderRadius={16} />
          <SkeletonBox width={85} height={32} borderRadius={16} />
          <SkeletonBox width={75} height={32} borderRadius={16} />
          <SkeletonBox width={90} height={32} borderRadius={16} />
        </View>
      </View>

      {/* Grid Cards Skeleton */}
      <View style={styles.gridContainer}>
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <View key={key} style={styles.gridItem}>
            <SkeletonBox width="100%" height={210} borderRadius={14} style={{ marginBottom: 8 }} />
            <SkeletonBox width="85%" height={16} borderRadius={6} style={{ marginBottom: 4 }} />
            <SkeletonBox width="50%" height={12} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  );
};

export const EpisodeListSkeleton: React.FC = () => {
  return (
    <View style={[styles.container, styles.sectionPadding, { paddingTop: 16 }]}>
      <SkeletonBox width={160} height={24} borderRadius={6} style={{ marginBottom: 16 }} />
      {[1, 2, 3, 4, 5].map((key) => (
        <View key={key} style={styles.episodeRow}>
          <SkeletonBox width={100} height={70} borderRadius={10} />
          <View style={styles.episodeInfo}>
            <SkeletonBox width="80%" height={18} borderRadius={6} style={{ marginBottom: 8 }} />
            <SkeletonBox width="45%" height={14} borderRadius={4} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  skeletonBox: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
  },
  heroSkeleton: {
    position: 'relative',
    width: '100%',
    height: 320,
    backgroundColor: THEME.colors.surfaceContainerLowest,
  },
  heroInfoOverlay: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    left: 20,
  },
  sectionPadding: {
    paddingHorizontal: THEME.spacing.margin,
  },
  gridContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    paddingHorizontal: THEME.spacing.margin,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 18,
  },
  episodeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  episodeInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
