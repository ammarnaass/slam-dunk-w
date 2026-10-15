import { useState, useMemo } from 'react';
import { Episode } from '../../types';

export type RangeKey = 'all' | '1-25' | '26-50' | '51-75' | '76-101';

export interface RangeOption {
  key: RangeKey;
  label: string;
}

export function useEpisodesFilter(episodes: Episode[] = []) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRange, setSelectedRange] = useState<RangeKey>('all');
  const [isReverseOrder, setIsReverseOrder] = useState(false);

  const ranges: RangeOption[] = useMemo(
    () => [
      { key: 'all', label: `الكل (${episodes.length || 101})` },
      { key: '1-25', label: '1 - 25' },
      { key: '26-50', label: '26 - 50' },
      { key: '51-75', label: '51 - 75' },
      { key: '76-101', label: '76 - 101' },
    ],
    [episodes.length]
  );

  const filteredEpisodes = useMemo(() => {
    let list = (episodes || []).filter((ep) => {
      if (!ep) return false;
      const title = ep.title || '';
      const matchedNum = title.match(/\d+/);
      const epNum =
        ep.episode_number ||
        ep.episodeNumber ||
        (matchedNum ? parseInt(matchedNum[0], 10) : 0);

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchTitle = title.toLowerCase().includes(query);
        const matchNum =
          epNum.toString() === query || `الحلقة ${epNum}`.includes(query);
        if (!matchTitle && !matchNum) return false;
      }

      // Range filter
      if (selectedRange === '1-25') return epNum >= 1 && epNum <= 25;
      if (selectedRange === '26-50') return epNum >= 26 && epNum <= 50;
      if (selectedRange === '51-75') return epNum >= 51 && epNum <= 75;
      if (selectedRange === '76-101') return epNum >= 76 && epNum <= 101;

      return true;
    });

    if (isReverseOrder) {
      list = [...list].reverse();
    }

    return list;
  }, [episodes, searchQuery, selectedRange, isReverseOrder]);

  return {
    searchQuery,
    setSearchQuery,
    selectedRange,
    setSelectedRange,
    isReverseOrder,
    setIsReverseOrder,
    ranges,
    filteredEpisodes,
  };
}
