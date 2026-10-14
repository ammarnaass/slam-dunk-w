import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { ERA_OPTIONS } from '../../constants/filter-options';
import { filterStyles as styles } from './filter.styles';

interface EraFilterSectionProps {
  localEra: string;
  onEraSelect: (era: string) => void;
}

export const EraFilterSection: React.FC<EraFilterSectionProps> = ({
  localEra,
  onEraSelect,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon name="calendar_month" size={18} color={THEME.colors.secondary} />
          <Text style={styles.sectionTitle}>سنة الإنتاج والحقبة</Text>
        </View>
        <Text style={styles.eraSubtext}>1990 - 2005</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.eraRow}>
        {ERA_OPTIONS.map((era) => {
          const isSelected = localEra === era.id;
          return (
            <TouchableOpacity
              key={era.id}
              style={[
                styles.eraChip,
                isSelected ? styles.eraChipActive : styles.eraChipInactive,
              ]}
              onPress={() => onEraSelect(era.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.eraChipText,
                  isSelected ? styles.eraChipTextActive : styles.eraChipTextInactive,
                ]}
              >
                {era.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {/* Timeline Indicator Graphic */}
      <View style={styles.timelineBox}>
        <View style={styles.timelineBar}>
          <View style={styles.timelineActiveSegment} />
        </View>
        <View style={styles.timelineLabels}>
          <Text style={styles.timelineLabel}>1980 (الكلاسيكيات)</Text>
          <Text style={[styles.timelineLabel, styles.timelineLabelActive]}>1995 (ذروة الدبلجة)</Text>
          <Text style={styles.timelineLabel}>2024 (الحديث)</Text>
        </View>
      </View>
    </View>
  );
};
