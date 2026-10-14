import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { AUDIO_OPTIONS } from '../../constants/filter-options';
import { filterStyles as styles } from './filter.styles';

interface AudioFilterSectionProps {
  activeFilterAudio: string;
  onChangeFilterAudio: (val: string) => void;
}

export const AudioFilterSection: React.FC<AudioFilterSectionProps> = ({
  activeFilterAudio,
  onChangeFilterAudio,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon name="record_voice_over" size={18} color={THEME.colors.secondary} />
          <Text style={styles.sectionTitle}>نوع الصوت والدبلجة</Text>
        </View>
        <View style={styles.badgeAmber}>
          <Text style={styles.badgeAmberText}>أرشيف نادر</Text>
        </View>
      </View>
      <View style={styles.pillsWrap}>
        {AUDIO_OPTIONS.map((item) => {
          const isActive = activeFilterAudio === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.filterPill,
                isActive ? styles.filterPillActive : styles.filterPillInactive,
              ]}
              onPress={() => onChangeFilterAudio(item.id)}
              activeOpacity={0.7}
            >
              {isActive && (
                <Icon name="check_circle" size={16} color={THEME.colors.primaryContainer} />
              )}
              <Text
                style={[
                  styles.filterPillText,
                  isActive ? styles.filterPillTextActive : styles.filterPillTextInactive,
                ]}
              >
                {item.label}
              </Text>
              {item.tag && (
                <View style={styles.pillTag}>
                  <Text style={styles.pillTagText}>{item.tag}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
