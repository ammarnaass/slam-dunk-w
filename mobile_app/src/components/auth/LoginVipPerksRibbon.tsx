import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';

export const LoginVipPerksRibbon: React.FC = () => {
  return (
    <View style={styles.vipRibbonCard}>
      <View style={styles.vipRibbonGrid}>
        <View style={styles.vipRibbonCol}>
          <View style={[styles.vipIconCircle, { backgroundColor: 'rgba(220, 38, 38, 0.15)' }]}>
            <Icon name="cloud_sync" size={18} color={THEME.colors.primary} />
          </View>
          <Text style={styles.vipColTitle}>مزامنة فورية</Text>
          <Text style={styles.vipColSub}>لكافة الأجهزة</Text>
        </View>

        <View style={styles.vipRibbonCol}>
          <View style={[styles.vipIconCircle, { backgroundColor: 'rgba(238, 152, 0, 0.15)' }]}>
            <Icon name="workspace_premium" size={18} color={THEME.colors.secondary} filled />
          </View>
          <Text style={[styles.vipColTitle, { color: THEME.colors.secondary }]}>VIP 4K</Text>
          <Text style={styles.vipColSub}>بدون إعلانات</Text>
        </View>

        <View style={styles.vipRibbonCol}>
          <View style={[styles.vipIconCircle, { backgroundColor: 'rgba(220, 38, 38, 0.15)' }]}>
            <Icon name="offline_pin" size={18} color={THEME.colors.primary} />
          </View>
          <Text style={styles.vipColTitle}>مشاهدة بلا نت</Text>
          <Text style={styles.vipColSub}>تنزيل بجودات</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  vipRibbonCard: {
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderRadius: 14,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  vipRibbonGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  vipRibbonCol: {
    flex: 1,
    backgroundColor: 'rgba(28, 32, 40, 0.7)',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  vipIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  vipColTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.onSurface,
  },
  vipColSub: {
    fontSize: 9,
    color: THEME.colors.textMuted,
    marginTop: 1,
  },
});
