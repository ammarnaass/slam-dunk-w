import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './downloads.styles';

interface DownloadSettingsCardProps {
  autoDeleteWatched: boolean;
  onToggleAutoDelete: (val: boolean) => void;
  wifiOnly: boolean;
  onToggleWifiOnly: (val: boolean) => void;
  downloadQuality: 'FHD' | 'HD' | 'SAVER';
  onChangeQuality: (q: 'FHD' | 'HD' | 'SAVER') => void;
}

export const DownloadSettingsCard: React.FC<DownloadSettingsCardProps> = ({
  autoDeleteWatched,
  onToggleAutoDelete,
  wifiOnly,
  onToggleWifiOnly,
  downloadQuality,
  onChangeQuality,
}) => {
  return (
    <View style={styles.settingsSection}>
      <View style={styles.settingsHeader}>
        <View style={styles.settingsIconWrap}>
          <Icon name="tune" size={20} color={THEME.colors.secondaryContainer} />
        </View>
        <View style={styles.settingsTitles}>
          <Text style={styles.settingsTitle}>إعدادات التنزيل والذاكرة الذكية</Text>
          <Text style={styles.settingsSubtitle}>تحكم آلي بالذاكرة دون تدخل يدوي</Text>
        </View>
      </View>

      <View style={styles.settingsList}>
        {/* Setting 1: Auto Delete */}
        <View style={styles.settingItem}>
          <View style={styles.settingLabels}>
            <Text style={styles.settingLabelMain}>حذف تلقائي بعد المشاهدة</Text>
            <Text style={styles.settingLabelDesc}>
              إزالة الحلقة تلقائياً بعد 24 ساعة من إكمالها
            </Text>
          </View>
          <Switch
            value={autoDeleteWatched}
            onValueChange={onToggleAutoDelete}
            trackColor={{
              false: THEME.colors.surfaceVariant,
              true: THEME.colors.primaryContainer,
            }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Setting 2: Wi-Fi Only */}
        <View style={styles.settingItem}>
          <View style={styles.settingLabels}>
            <Text style={styles.settingLabelMain}>التنزيل عبر Wi-Fi فقط</Text>
            <Text style={styles.settingLabelDesc}>
              الحفاظ على باقة بيانات الهاتف من الاستهلاك
            </Text>
          </View>
          <Switch
            value={wifiOnly}
            onValueChange={onToggleWifiOnly}
            trackColor={{
              false: THEME.colors.surfaceVariant,
              true: THEME.colors.primaryContainer,
            }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Setting 3: Default Download Quality */}
        <View style={styles.settingItem}>
          <View style={styles.settingLabels}>
            <Text style={styles.settingLabelMain}>جودة التنزيل الافتراضية</Text>
            <Text style={styles.settingLabelDesc}>تحديد جودة الفيديو المفضلة مسبقاً</Text>
          </View>
          <View style={styles.qualitySegmentGroup}>
            <TouchableOpacity
              style={[
                styles.qualitySegmentBtn,
                downloadQuality === 'FHD' && styles.qualitySegmentBtnActive,
              ]}
              onPress={() => onChangeQuality('FHD')}
            >
              <Text
                style={[
                  styles.qualitySegmentText,
                  downloadQuality === 'FHD' && styles.qualitySegmentTextActive,
                ]}
              >
                FHD
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.qualitySegmentBtn,
                downloadQuality === 'HD' && styles.qualitySegmentBtnActive,
              ]}
              onPress={() => onChangeQuality('HD')}
            >
              <Text
                style={[
                  styles.qualitySegmentText,
                  downloadQuality === 'HD' && styles.qualitySegmentTextActive,
                ]}
              >
                HD
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.qualitySegmentBtn,
                downloadQuality === 'SAVER' && styles.qualitySegmentBtnActive,
              ]}
              onPress={() => onChangeQuality('SAVER')}
            >
              <Text
                style={[
                  styles.qualitySegmentText,
                  downloadQuality === 'SAVER' && styles.qualitySegmentTextActive,
                ]}
              >
                توفير
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
