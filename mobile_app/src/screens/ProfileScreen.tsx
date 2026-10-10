import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { THEME } from '../constants/theme';
import { API_BASE_URL, setApiBaseUrl } from '../services/api';

interface ProfileScreenProps {
  onServerUrlChange?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onServerUrlChange }) => {
  const [customUrl, setCustomUrl] = useState(API_BASE_URL);

  const handleSaveUrl = () => {
    if (!customUrl.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال رابط صالح');
      return;
    }
    setApiBaseUrl(customUrl.trim());
    Alert.alert('تم التحديث', 'تم تغيير عنوان الخادم بنجاح');
    if (onServerUrlChange) onServerUrlChange();
  };

  const setPreset = (url: string) => {
    setCustomUrl(url);
    setApiBaseUrl(url);
    Alert.alert('تم التبديل', `تم التبديل إلى: ${url}`);
    if (onServerUrlChange) onServerUrlChange();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>🏀</Text>
        </View>
        <Text style={styles.userName}>عضو سلام دانك</Text>
        <Text style={styles.userEmail}>مشجع فريق شوهوكو</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⭐ عضوية مميزة (VIP)</Text>
        </View>
      </View>

      {/* App Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>101</Text>
          <Text style={styles.statLabel}>حلقات متوفرة</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>100%</Text>
          <Text style={styles.statLabel}>جودة أصلية</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>v1.0</Text>
          <Text style={styles.statLabel}>إصدار التطبيق</Text>
        </View>
      </View>

      {/* Server & API Settings */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>⚙️ إعدادات الاتصال بالخادم</Text>
        <Text style={styles.sectionDesc}>
          يمكنك تغيير عنوان الـ API للربط مع الخادم المحلي أو السحابي:
        </Text>

        <TextInput
          style={styles.input}
          value={customUrl}
          onChangeText={setCustomUrl}
          placeholder="http://10.0.2.2:3000/api/mobile/v1"
          placeholderTextColor={THEME.colors.textDim}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveUrl} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>حفظ العنوان الحالي</Text>
        </TouchableOpacity>

        {/* Quick Presets */}
        <View style={styles.presetsRow}>
          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => setPreset('https://slam-dunk-w.vercel.app/api/mobile/v1')}
          >
            <Text style={styles.presetText}>🌐 السحابي (Vercel)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => setPreset('http://10.0.2.2:3000/api/mobile/v1')}
          >
            <Text style={styles.presetText}>📱 محاكي أندرويد</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => setPreset('http://localhost:3000/api/mobile/v1')}
          >
            <Text style={styles.presetText}>💻 محلي (Localhost)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>ℹ️ عن التطبيق</Text>
        <Text style={styles.aboutText}>
          تطبيق "سلام دانك" الرسمي لمشاهدة جميع حلقات أنمي كرة السلة الخالد بدقة فائقة وبدون إعلانات مزعجة. مبني بتقنية React Native 0.87 و Metro Bundler.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.lg,
  },
  userCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: THEME.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: THEME.colors.primary,
    marginBottom: THEME.spacing.sm,
  },
  avatarText: {
    fontSize: 32,
  },
  userName: {
    color: THEME.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderWidth: 1,
    borderColor: THEME.colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
    marginTop: THEME.spacing.md,
  },
  badgeText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
    marginTop: THEME.spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  statValue: {
    color: THEME.colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: THEME.colors.textDim,
    fontSize: 10,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  sectionTitle: {
    color: THEME.colors.white,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  sectionDesc: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
    lineHeight: 16,
  },
  input: {
    height: 44,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    color: THEME.colors.white,
    paddingHorizontal: THEME.spacing.md,
    marginTop: THEME.spacing.md,
    fontSize: 12,
  },
  saveBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    marginTop: THEME.spacing.md,
  },
  saveBtnText: {
    color: THEME.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
    marginTop: THEME.spacing.md,
  },
  presetBtn: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  presetText: {
    color: THEME.colors.textMuted,
    fontSize: 11,
  },
  aboutText: {
    color: THEME.colors.textDim,
    fontSize: 12,
    lineHeight: 20,
    marginTop: THEME.spacing.sm,
    textAlign: 'right',
  },
});
