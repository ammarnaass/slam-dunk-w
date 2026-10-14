import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { THEME } from '../constants/theme';
import { Icon } from '../components/Icon';

interface OfflineScreenProps {
  onRetry?: () => void;
  onGoToDownloads?: () => void;
  onBack?: () => void;
}

export const OfflineScreen: React.FC<OfflineScreenProps> = ({
  onRetry,
  onGoToDownloads,
  onBack,
}) => {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Icon name="arrow_forward" size={22} color={THEME.colors.onSurface} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>وضع عدم الاتصال</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Offline Alert Banner */}
        <View style={styles.offlineBanner}>
          <View style={styles.bannerLeft}>
            <View style={styles.pulseDot} />
            <Text style={styles.bannerTitle}>وضع عدم الاتصال نشط</Text>
          </View>
          <View style={styles.localBadge}>
            <Icon name="wifiOff" size={14} color={THEME.colors.secondary} />
            <Text style={styles.localBadgeText}>محلي</Text>
          </View>
        </View>

        {/* Central Radar Visual */}
        <View style={styles.radarCard}>
          <View style={styles.ambientGlow} />

          <View style={styles.radarOuterCircle}>
            <View style={styles.radarMiddleCircle}>
              <View style={styles.radarCenterCircle}>
                <Icon name="wifiOff" size={32} color="#FFF" />
              </View>
            </View>
          </View>

          <Text style={styles.radarTitle}>لا يوجد اتصال بالإنترنت!</Text>
          <Text style={styles.radarSub}>
            يبدو أنك لست متصلاً بالشبكة حالياً. يمكنك متابعة مشاهدة حلقاتك المحملة مسبقاً بدقة عالية ودون انقطاع.
          </Text>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.downloadsActionBtn}
            onPress={onGoToDownloads}
            activeOpacity={0.85}
          >
            <Icon name="download" size={20} color="#FFF" />
            <Text style={styles.downloadsActionText}>استعراض الحلقات المنزلة (12 حلقة)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.retryActionBtn}
            onPress={onRetry}
            activeOpacity={0.75}
          >
            <Icon name="cached" size={18} color={THEME.colors.onSurface} />
            <Text style={styles.retryActionText}>إعادة محاولة الاتصال</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(15, 19, 28, 0.96)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.onSurface,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  offlineBanner: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.primaryContainer,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.onSurface,
  },
  localBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(238, 152, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  localBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.secondary,
  },
  radarCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    position: 'relative',
    overflow: 'hidden',
  },
  ambientGlow: {
    position: 'absolute',
    top: 60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
  },
  radarOuterCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  radarMiddleCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarCenterCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 6,
  },
  radarTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.colors.onSurface,
    marginBottom: 8,
    textAlign: 'center',
  },
  radarSub: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  downloadsActionBtn: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    backgroundColor: THEME.colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 4,
  },
  downloadsActionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  retryActionBtn: {
    width: '100%',
    height: 46,
    borderRadius: 14,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retryActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.onSurface,
  },
});
