import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { settingsStyles as styles } from './settings.styles';

export type StreamingQuality = 'auto' | '1080p' | '4k' | '720p';

interface SettingsQualityGridProps {
  selectedQuality: StreamingQuality;
  onSelectQuality: (q: StreamingQuality) => void;
}

export const SettingsQualityGrid: React.FC<SettingsQualityGridProps> = ({
  selectedQuality,
  onSelectQuality,
}) => {
  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionPillIndicator} />
        <Text style={styles.sectionTitle}>جودة التشغيل الافتراضية للبث</Text>
      </View>

      <View style={styles.qualityGrid}>
        {/* Auto */}
        <TouchableOpacity
          style={[
            styles.qualityCard,
            selectedQuality === 'auto' && styles.qualityCardSelected,
          ]}
          onPress={() => onSelectQuality('auto')}
          activeOpacity={0.8}
        >
          {selectedQuality === 'auto' && (
            <View style={styles.checkCircleCorner}>
              <Icon name="check_circle" size={18} color={THEME.colors.primaryContainer} filled />
            </View>
          )}
          <View style={styles.qualityCardTitleRow}>
            <Icon name="sparkles" size={16} color={THEME.colors.primaryContainer} />
            <Text style={styles.qualityCardTitle}>تلقائي ذكي</Text>
          </View>
          <Text style={styles.qualityCardSub}>تكيّف لحظي حسب سرعة الشبكة والبيانات</Text>
        </TouchableOpacity>

        {/* 1080p */}
        <TouchableOpacity
          style={[
            styles.qualityCard,
            selectedQuality === '1080p' && styles.qualityCardSelected,
          ]}
          onPress={() => onSelectQuality('1080p')}
          activeOpacity={0.8}
        >
          {selectedQuality === '1080p' && (
            <View style={styles.checkCircleCorner}>
              <Icon name="check_circle" size={18} color={THEME.colors.primaryContainer} filled />
            </View>
          )}
          <View style={styles.qualityCardTitleRow}>
            <Icon name="hd" size={16} color={THEME.colors.textMuted} />
            <Text style={styles.qualityCardTitle}>1080p FHD</Text>
          </View>
          <Text style={styles.qualityCardSub}>وضوح ناصع مستقر (افتراضي عبر Wi-Fi)</Text>
        </TouchableOpacity>

        {/* 4K */}
        <TouchableOpacity
          style={[
            styles.qualityCard,
            selectedQuality === '4k' && styles.qualityCardSelected,
          ]}
          onPress={() => onSelectQuality('4k')}
          activeOpacity={0.8}
        >
          {selectedQuality === '4k' && (
            <View style={styles.checkCircleCorner}>
              <Icon name="check_circle" size={18} color={THEME.colors.primaryContainer} filled />
            </View>
          )}
          <View style={styles.qualityCardTitleRow}>
            <Text style={styles.qualityCardTitle}>4K UHD</Text>
            <View style={styles.vipTinyBadge}>
              <Text style={styles.vipTinyBadgeText}>VIP</Text>
            </View>
          </View>
          <Text style={styles.qualityCardSub}>دعم HDR10 و 60 إطاراً سينمائياً فائقة</Text>
        </TouchableOpacity>

        {/* 720p */}
        <TouchableOpacity
          style={[
            styles.qualityCard,
            selectedQuality === '720p' && styles.qualityCardSelected,
          ]}
          onPress={() => onSelectQuality('720p')}
          activeOpacity={0.8}
        >
          {selectedQuality === '720p' && (
            <View style={styles.checkCircleCorner}>
              <Icon name="check_circle" size={18} color={THEME.colors.primaryContainer} filled />
            </View>
          )}
          <View style={styles.qualityCardTitleRow}>
            <Icon name="signal_cellular_alt_2_bar" size={16} color={THEME.colors.textMuted} />
            <Text style={styles.qualityCardTitle}>720p توفير</Text>
          </View>
          <Text style={styles.qualityCardSub}>اقتصادي لباقات شبكات 4G/5G المحدودة</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
