import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';

export const RegisterHeroSection: React.FC = () => {
  return (
    <View>
      {/* 1. Community Headline & Welcome Card */}
      <View style={styles.heroSection}>
        <View style={styles.badgePill}>
          <Icon name="local_fire_department" size={16} color={THEME.colors.secondary} filled />
          <Text style={styles.badgeText}>انضم لمجتمع الأوتاكو الأكبر عربياً</Text>
        </View>

        <Text style={styles.heroTitle}>
          إنشاء حساب جديد في <Text style={styles.brandHighlight}>ANIME DAZE</Text>
        </Text>

        <Text style={styles.heroSubtitle}>
          سجّل الآن لتخصيص قائمتك المفضلة، تفعيل التنزيلات دون إنترنت، ومزامنة مشاهداتك عبر جميع أجهزتك السحابية.
        </Text>
      </View>

      {/* 2. Three-pillar Feature Badges */}
      <View style={styles.featureGrid}>
        <View style={styles.featureCard}>
          <View style={[styles.featureIconBox, { backgroundColor: 'rgba(220, 38, 38, 0.15)' }]}>
            <Icon name="bookmark" size={20} color={THEME.colors.primaryContainer} filled />
          </View>
          <Text style={styles.featureCardTitle}>حفظ التقدم والمفضلة</Text>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.featureIconBox, { backgroundColor: 'rgba(238, 152, 0, 0.15)' }]}>
            <Icon name="cloud_download" size={20} color={THEME.colors.secondary} />
          </View>
          <Text style={styles.featureCardTitle}>تنزيل بجودات متعددة</Text>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.featureIconBox, { backgroundColor: 'rgba(220, 38, 38, 0.15)' }]}>
            <Icon name="notifications_active" size={20} color={THEME.colors.primaryContainer} />
          </View>
          <Text style={styles.featureCardTitle}>تنبيهات فورية ومخصصة</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.secondary,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: THEME.colors.onSurface,
    lineHeight: 36,
    textAlign: 'right',
  },
  brandHighlight: {
    color: THEME.colors.primaryContainer,
  },
  heroSubtitle: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    lineHeight: 22,
    marginTop: 6,
    textAlign: 'right',
  },
  featureGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  featureCard: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  featureIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  featureCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.onSurface,
    textAlign: 'center',
    lineHeight: 16,
  },
});
