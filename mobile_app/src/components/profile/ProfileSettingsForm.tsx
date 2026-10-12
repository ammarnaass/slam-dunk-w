import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './profile.styles';

interface ProfileSettingsFormProps {
  streamQuality: string;
  autoPlayNext: boolean;
  onToggleAutoPlayNext: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  customApiUrl: string;
  onCustomApiUrlChange: (url: string) => void;
  onSaveApiUrl: () => void;
}

export const ProfileSettingsForm: React.FC<ProfileSettingsFormProps> = ({
  streamQuality,
  autoPlayNext,
  onToggleAutoPlayNext,
  notificationsEnabled,
  onToggleNotifications,
  customApiUrl,
  onCustomApiUrlChange,
  onSaveApiUrl,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderTitleRow}>
        <View style={styles.titleDotAmber} />
        <Text style={styles.sectionHeading}>إعدادات التطبيق وبث الفيديو</Text>
      </View>

      <View style={styles.formCard}>
        {/* Stream Quality */}
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>جودة البث الافتراضية</Text>
            <Text style={styles.settingDesc}>1080p FHD (أعلى جودة لسيرفرات VIP)</Text>
          </View>
          <View style={styles.qualityPill}>
            <Text style={styles.qualityPillText}>{streamQuality}</Text>
          </View>
        </View>

        <View style={styles.formDivider} />

        {/* Auto Next */}
        <TouchableOpacity
          style={styles.settingRow}
          onPress={onToggleAutoPlayNext}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingTitle}>تشغيل الحلقة التالية تلقائياً</Text>
            <Text style={styles.settingDesc}>الانتقال الفوري دون مقاطعة الحماس</Text>
          </View>
          <View
            style={[
              styles.switchTrack,
              autoPlayNext && styles.switchTrackActive,
            ]}
          >
            <View
              style={[
                styles.switchThumb,
                autoPlayNext && styles.switchThumbActive,
              ]}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.formDivider} />

        {/* Notifications */}
        <TouchableOpacity
          style={styles.settingRow}
          onPress={onToggleNotifications}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.settingTitle}>تنبيهات الحلقات الجديدة</Text>
            <Text style={styles.settingDesc}>إشعار فوري عند صدور حلقة أو فيلم</Text>
          </View>
          <View
            style={[
              styles.switchTrack,
              notificationsEnabled && styles.switchTrackActive,
            ]}
          >
            <View
              style={[
                styles.switchThumb,
                notificationsEnabled && styles.switchThumbActive,
              ]}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.formDivider} />

        {/* Custom API Base URL for Mobile Dev */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>عنوان خادم البث وAPI (للمطورين)</Text>
          <View style={styles.apiInputRow}>
            <TextInput
              style={[styles.textInput, styles.apiInput]}
              value={customApiUrl}
              onChangeText={onCustomApiUrlChange}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.apiSaveBtn}
              onPress={onSaveApiUrl}
              activeOpacity={0.8}
            >
              <Text style={styles.apiSaveBtnText}>حفظ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
