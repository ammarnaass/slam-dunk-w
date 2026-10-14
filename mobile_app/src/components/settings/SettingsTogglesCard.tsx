import React from 'react';
import { View, Text, Switch } from 'react-native';
import { THEME } from '../../constants/theme';
import { settingsStyles as styles } from './settings.styles';

interface SettingsTogglesCardProps {
  dataSaver: boolean;
  onToggleDataSaver: (val: boolean) => void;
  autoPlayNext: boolean;
  onToggleAutoPlayNext: (val: boolean) => void;
  notifications: boolean;
  onToggleNotifications: (val: boolean) => void;
}

export const SettingsTogglesCard: React.FC<SettingsTogglesCardProps> = ({
  dataSaver,
  onToggleDataSaver,
  autoPlayNext,
  onToggleAutoPlayNext,
  notifications,
  onToggleNotifications,
}) => {
  return (
    <View style={styles.togglesCard}>
      {/* Data Saver */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleTexts}>
          <Text style={styles.toggleTitle}>خفض الجودة عند استخدام بيانات الهاتف</Text>
          <Text style={styles.toggleSub}>التبديل إلى 720p تلقائياً لحفظ رصيد الباقة</Text>
        </View>
        <Switch
          value={dataSaver}
          onValueChange={onToggleDataSaver}
          trackColor={{ false: THEME.colors.surfaceContainerHighest, true: THEME.colors.primaryContainer }}
          thumbColor="#FFF"
        />
      </View>

      <View style={styles.toggleDivider} />

      {/* Auto Play Next */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleTexts}>
          <Text style={styles.toggleTitle}>التشغيل التلقائي للحلقة التالية</Text>
          <Text style={styles.toggleSub}>بدء تشغيل الحلقة التالية فور انتهاء الحالية</Text>
        </View>
        <Switch
          value={autoPlayNext}
          onValueChange={onToggleAutoPlayNext}
          trackColor={{ false: THEME.colors.surfaceContainerHighest, true: THEME.colors.primaryContainer }}
          thumbColor="#FFF"
        />
      </View>

      <View style={styles.toggleDivider} />

      {/* Notifications */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleTexts}>
          <Text style={styles.toggleTitle}>إشعارات صدور الحلقات</Text>
          <Text style={styles.toggleSub}>تنبيه فوري عند توفر حلقات جديدة مدبلجة</Text>
        </View>
        <Switch
          value={notifications}
          onValueChange={onToggleNotifications}
          trackColor={{ false: THEME.colors.surfaceContainerHighest, true: THEME.colors.primaryContainer }}
          thumbColor="#FFF"
        />
      </View>
    </View>
  );
};
