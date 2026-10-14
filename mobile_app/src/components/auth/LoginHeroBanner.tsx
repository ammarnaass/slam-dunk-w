import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';

export const LoginHeroBanner: React.FC = () => {
  return (
    <View style={styles.heroBannerCard}>
      <Image
        source={{
          uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnJZX76mQ9xsostJI3zRCwHNPcttWFA2MG5mxQ6pQqG7AgEzm27_GYqAzhCJDJZhrZ7mTY-_Z-FXhMolqmZwUz6sZGWSp3WyX3wOBSTvONHQxiYS1BBB-aOdCzj1rLxVZdNpH3pbCzfu04mcKo6T33WrBp8JY-W4h7TFnkC2UGa6b60KSgjok0Jt7IOO6WQcQyjqULKwnDFYjfTirP2i9XPo6TKorfc5nYZ0ndbnPRhLxhfYoTsd4I',
        }}
        style={styles.heroBannerImage}
        resizeMode="cover"
      />
      <View style={styles.heroGradientOverlay} />

      {/* Top Anime Sparkle Badge */}
      <View style={styles.heroSparkleBadge}>
        <Icon name="local_fire_department" size={13} color={THEME.colors.secondary} filled />
        <Text style={styles.heroSparkleText}>موسم الأنمي الجديد</Text>
      </View>

      {/* Welcome Text in Banner */}
      <View style={styles.heroBannerContent}>
        <View style={styles.heroSubRow}>
          <Icon name="play" size={16} color={THEME.colors.primary} filled />
          <Text style={styles.heroGatewayText}>بوابة الأوتـاكو</Text>
        </View>
        <Text style={styles.heroHeading}>أهلاً بك مجدداً في ANIME DAZE</Text>
        <Text style={styles.heroSubHeading} numberOfLines={1}>
          سجّل الدخول لمتابعة مسلسلاتك المفضلة ومزامنة قائمة VIP السحابية
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroBannerCard: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 14,
    marginBottom: 16,
    position: 'relative',
    backgroundColor: THEME.colors.surfaceContainer,
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
  },
  heroGradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 19, 28, 0.72)',
  },
  heroSparkleBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(38, 42, 51, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(238, 152, 0, 0.3)',
  },
  heroSparkleText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.secondary,
  },
  heroBannerContent: {
    position: 'absolute',
    bottom: 12,
    right: 14,
    left: 14,
  },
  heroSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  heroGatewayText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.primary,
    letterSpacing: 1,
  },
  heroHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.colors.onSurface,
    textAlign: 'right',
  },
  heroSubHeading: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
    textAlign: 'right',
  },
});
