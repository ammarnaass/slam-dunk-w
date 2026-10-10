import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Episode } from '../types';
import { EpisodeCard } from '../components/EpisodeCard';
import { THEME } from '../constants/theme';

interface EpisodesScreenProps {
  episodes: Episode[];
  loading: boolean;
  onSelectEpisode: (episode: Episode) => void;
}

export const EpisodesScreen: React.FC<EpisodesScreenProps> = ({
  episodes,
  loading,
  onSelectEpisode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRange, setSelectedRange] = useState<'all' | '1-25' | '26-50' | '51-75' | '76-101'>('all');

  const ranges: { key: 'all' | '1-25' | '26-50' | '51-75' | '76-101'; label: string }[] = [
    { key: 'all', label: 'الكل (101)' },
    { key: '1-25', label: '1 - 25' },
    { key: '26-50', label: '26 - 50' },
    { key: '51-75', label: '51 - 75' },
    { key: '76-101', label: '76 - 101' },
  ];

  const filteredEpisodes = useMemo(() => {
    return episodes.filter((ep) => {
      const epNum = ep.episode_number || ep.episodeNumber || (ep.title.match(/\d+/) ? parseInt(ep.title.match(/\d+/)![0], 10) : 0);

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchTitle = ep.title.toLowerCase().includes(query);
        const matchNum = epNum.toString() === query || `الحلقة ${epNum}`.includes(query);
        if (!matchTitle && !matchNum) return false;
      }

      // Range filter
      if (selectedRange === '1-25') return epNum >= 1 && epNum <= 25;
      if (selectedRange === '26-50') return epNum >= 26 && epNum <= 50;
      if (selectedRange === '51-75') return epNum >= 51 && epNum <= 75;
      if (selectedRange === '76-101') return epNum >= 76 && epNum <= 101;

      return true;
    });
  }, [episodes, searchQuery, selectedRange]);

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث برقم الحلقة أو العنوان..."
          placeholderTextColor={THEME.colors.textDim}
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign="right"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Range filter pills */}
      <View style={styles.filterRow}>
        {ranges.map((r) => {
          const isSelected = selectedRange === r.key;
          return (
            <TouchableOpacity
              key={r.key}
              style={[styles.pill, isSelected && styles.activePill]}
              onPress={() => setSelectedRange(r.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, isSelected && styles.activePillText]}>
                {r.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Episodes List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loadingText}>جاري تحميل الحلقات...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEpisodes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EpisodeCard
              episode={item}
              onPress={onSelectEpisode}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🏀</Text>
              <Text style={styles.emptyText}>لم يتم العثور على أي حلقات تطابق البحث</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  searchContainer: {
    marginHorizontal: THEME.spacing.lg,
    marginTop: THEME.spacing.md,
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: THEME.colors.white,
    fontSize: 14,
  },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    color: THEME.colors.textMuted,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row-reverse',
    paddingHorizontal: THEME.spacing.lg,
    marginVertical: THEME.spacing.md,
    gap: THEME.spacing.xs,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  activePill: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primaryLight,
  },
  pillText: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  activePillText: {
    color: THEME.colors.white,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: THEME.colors.textMuted,
    marginTop: THEME.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: THEME.spacing.sm,
  },
  emptyText: {
    color: THEME.colors.textMuted,
    fontSize: 13,
  },
});
