import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { THEME } from '../../constants/theme';
import { Episode } from '../../types';
import { EpisodeCard } from '../EpisodeCard';
import { Icon } from '../Icon';

export const EPISODE_RANGES = [
  { label: '1 - 25', start: 1, end: 25 },
  { label: '26 - 50', start: 26, end: 50 },
  { label: '51 - 75', start: 51, end: 75 },
  { label: '76 - 101', start: 76, end: 101 },
];

interface EpisodesTabProps {
  episodes: Episode[];
  onSelectEpisode: (ep: Episode) => void;
}

export const EpisodesTab: React.FC<EpisodesTabProps> = ({
  episodes,
  onSelectEpisode,
}) => {
  const [activeRange, setActiveRange] = useState(0);
  const [sortAscending, setSortAscending] = useState(true);

  const range = EPISODE_RANGES[activeRange] || EPISODE_RANGES[0];
  const filteredEpisodes = episodes
    .filter((ep) => {
      const num = ep.episode_number || ep.episodeNumber || 0;
      return num >= range.start && num <= range.end;
    })
    .sort((a, b) => {
      const aNum = a.episode_number || a.episodeNumber || 0;
      const bNum = b.episode_number || b.episodeNumber || 0;
      return sortAscending ? aNum - bNum : bNum - aNum;
    });

  const displayList = filteredEpisodes.length > 0 ? filteredEpisodes : episodes;

  return (
    <View style={styles.episodesTabContent}>
      {/* Episodes Range Selector & Sorter */}
      <View style={styles.rangeSelectorRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rangesScroll}>
          {EPISODE_RANGES.map((r, idx) => {
            const isSelected = activeRange === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.rangeBtn,
                  isSelected ? styles.rangeBtnActive : styles.rangeBtnInactive,
                ]}
                onPress={() => setActiveRange(idx)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.rangeText,
                    isSelected && styles.rangeTextActive,
                  ]}
                >
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={styles.sortToggleBtn}
          onPress={() => setSortAscending(!sortAscending)}
          activeOpacity={0.7}
          accessibilityLabel="عكس الترتيب"
        >
          <Icon name="swap_vert" size={20} color={THEME.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* Episode Cards List */}
      <View style={styles.episodeCardsList}>
        {displayList.map((ep, idx) => (
          <EpisodeCard
            key={ep.id || idx}
            episode={ep}
            onPress={onSelectEpisode}
            isPlaying={idx === 0}
            progress={idx === 0 ? 0.75 : undefined}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  episodesTabContent: {
    paddingHorizontal: THEME.spacing.margin,
    marginTop: 14,
    gap: 12,
  },
  rangeSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  rangesScroll: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  rangeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rangeBtnActive: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  rangeBtnInactive: {
    backgroundColor: THEME.colors.surfaceContainer,
  },
  rangeText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurfaceVariant,
  },
  rangeTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '800',
  },
  sortToggleBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: THEME.colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeCardsList: {
    gap: 10,
    marginTop: 6,
  },
});
