import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { QUALITY_OPTIONS } from '../../constants/filter-options';
import { filterStyles as styles } from './filter.styles';

interface QualityFilterSectionProps {
  localQuality: string;
  onQualitySelect: (q: string) => void;
}

export const QualityFilterSection: React.FC<QualityFilterSectionProps> = ({
  localQuality,
  onQualitySelect,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon name="hd" size={18} color={THEME.colors.primaryContainer} />
          <Text style={styles.sectionTitle}>جودة البث والعرض</Text>
        </View>
        <Text style={styles.qualitySubtext}>بث فائق الدقة</Text>
      </View>
      <View style={styles.qualityGrid}>
        {QUALITY_OPTIONS.map((q) => {
          const isSelected = localQuality === q.id;
          return (
            <TouchableOpacity
              key={q.id}
              style={[
                styles.qualityCard,
                isSelected ? styles.qualityCardActive : styles.qualityCardInactive,
              ]}
              onPress={() => onQualitySelect(q.id)}
              activeOpacity={0.7}
            >
              <View style={styles.qualityCardInfo}>
                <View style={styles.qualityTitleRow}>
                  <Text style={styles.qualityCardTitle}>{q.label}</Text>
                  {q.isVip && (
                    <View style={styles.vipPill}>
                      <Text style={styles.vipPillText}>VIP</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.qualityCardSub}>{q.sub}</Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  isSelected && styles.radioCircleActive,
                ]}
              >
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
