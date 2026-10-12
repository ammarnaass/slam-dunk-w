import { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { DownloadedEpisodeItem, INITIAL_DOWNLOADS } from '../constants/downloads-data';

export type SortMode = 'size' | 'recent' | 'anime';

export interface SeriesGroup {
  series: string;
  seriesId: string;
  year: string;
  icon: 'sports_basketball' | 'search_insights' | 'swords' | 'video_library';
  episodes: DownloadedEpisodeItem[];
}

export function useDownloadManager() {
  const [downloads, setDownloads] = useState<DownloadedEpisodeItem[]>(INITIAL_DOWNLOADS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortMode, setSortMode] = useState<SortMode>('size');
  const [cacheCleaned, setCacheCleaned] = useState(false);
  const [cleaningCache, setCleaningCache] = useState(false);

  const totalAppUsedMB = useMemo(() => {
    return downloads.reduce((acc, curr) => acc + curr.sizeMB, 0);
  }, [downloads]);

  const totalSelectedMB = useMemo(() => {
    return downloads
      .filter((d) => selectedIds.has(d.id))
      .reduce((acc, curr) => acc + curr.sizeMB, 0);
  }, [downloads, selectedIds]);

  const seriesGroups = useMemo<SeriesGroup[]>(() => {
    const map = new Map<string, SeriesGroup>();

    downloads.forEach((item) => {
      if (!map.has(item.seriesId)) {
        let icon: 'sports_basketball' | 'search_insights' | 'swords' | 'video_library' = 'video_library';
        let year = '2000';
        if (item.seriesId === 'slam-dunk') {
          icon = 'sports_basketball';
          year = '1993';
        } else if (item.seriesId === 'conan') {
          icon = 'search_insights';
          year = '1996';
        } else if (item.seriesId === 'hunter-x-hunter') {
          icon = 'swords';
          year = '1999';
        }
        map.set(item.seriesId, {
          series: item.series,
          seriesId: item.seriesId,
          year,
          icon,
          episodes: [],
        });
      }
      map.get(item.seriesId)!.episodes.push(item);
    });

    const groups = Array.from(map.values());
    groups.forEach((g) => {
      if (sortMode === 'size') {
        g.episodes.sort((a, b) => b.sizeMB - a.sizeMB);
      } else if (sortMode === 'recent') {
        g.episodes.sort((a, b) => b.timestamp - a.timestamp);
      } else {
        g.episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);
      }
    });

    return groups;
  }, [downloads, sortMode]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === downloads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(downloads.map((d) => d.id)));
    }
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert('حذف الحلقة', 'هل ترغب في حذف هذه الحلقة لتحرير مساحة الذاكرة؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: () => {
          setDownloads((prev) => prev.filter((item) => item.id !== id));
          setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        },
      },
    ]);
  };

  const handleDeleteSeries = (seriesId: string, seriesName: string) => {
    Alert.alert('حذف السلسلة', `هل تريد حذف كافة حلقات ${seriesName} المحملة؟`, [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف الكل',
        style: 'destructive',
        onPress: () => {
          setDownloads((prev) => prev.filter((item) => item.seriesId !== seriesId));
        },
      },
    ]);
  };

  const handleDeleteSelected = () => {
    const count = selectedIds.size;
    if (count === 0) return;
    Alert.alert('حذف المحدد', `هل ترغب في حذف ${count} حلقات محددة؟`, [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف المحدد',
        style: 'destructive',
        onPress: () => {
          setDownloads((prev) => prev.filter((item) => !selectedIds.has(item.id)));
          setSelectedIds(new Set());
        },
      },
    ]);
  };

  const handleCleanCache = () => {
    setCleaningCache(true);
    setTimeout(() => {
      setCleaningCache(false);
      setCacheCleaned(true);
      Alert.alert('تم التنظيف', 'تم تحرير 340 MB من الذاكرة المؤقتة بنجاح!');
    }, 800);
  };

  return {
    downloads,
    selectedIds,
    setSelectedIds,
    sortMode,
    setSortMode,
    cacheCleaned,
    cleaningCache,
    totalAppUsedMB,
    totalSelectedMB,
    seriesGroups,
    toggleSelect,
    handleSelectAll,
    handleDeleteItem,
    handleDeleteSeries,
    handleDeleteSelected,
    handleCleanCache,
  };
}
