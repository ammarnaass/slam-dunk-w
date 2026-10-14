import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { STATUS_OPTIONS } from '../../constants/filter-options';
import { filterStyles as styles } from './filter.styles';

interface StatusFilterSectionProps {
  activeFilterStatus: string;
  onChangeFilterStatus: (val: string) => void;
}

export const StatusFilterSection: React.FC<StatusFilterSectionProps> = ({
  activeFilterStatus,
  onChangeFilterStatus,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionTitleRow}>
        <Icon name="verified" size={18} color={THEME.colors.secondaryFixedDim} />
        <Text style={styles.sectionTitle}>حالة العمل</Text>
      </View>
      <View style={styles.segmentedTrack}>
        {STATUS_OPTIONS.map((s) => {
          const isSelected = activeFilterStatus === s.id;
          return (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.segmentTab,
                isSelected ? styles.segmentTabActive : styles.segmentTabInactive,
              ]}
              onPress={() => onChangeFilterStatus(s.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentTabText,
                  isSelected ? styles.segmentTabTextActive : styles.segmentTabTextInactive,
                ]}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
