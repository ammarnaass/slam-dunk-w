import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { RangeKey, RangeOption } from './useEpisodesFilter';
import { episodesStyles as styles } from './episodes.styles';

interface EpisodesRangePillsProps {
  ranges: RangeOption[];
  selectedRange: RangeKey;
  onSelectRange: (range: RangeKey) => void;
}

export const EpisodesRangePills: React.FC<EpisodesRangePillsProps> = ({
  ranges,
  selectedRange,
  onSelectRange,
}) => {
  return (
    <View style={styles.filterPillsRow}>
      <FlatList
        horizontal
        inverted
        data={ranges}
        keyExtractor={(r) => r.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterPillsList}
        renderItem={({ item: r }) => {
          const isSelected = selectedRange === r.key;
          return (
            <TouchableOpacity
              style={[styles.rangePill, isSelected && styles.rangePillActive]}
              onPress={() => onSelectRange(r.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.rangePillText,
                  isSelected && styles.rangePillTextActive,
                ]}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
