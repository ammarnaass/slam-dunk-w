import { useState, useMemo } from 'react';
import { Anime } from '../../types';
import { GENRES } from './AnimeFiltersBar';

export function useAnimeCatalogFilter(catalogList: Anime[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isGridView, setIsGridView] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilterAudio, setActiveFilterAudio] = useState<'all' | 'dub' | 'sub'>('all');
  const [activeFilterStatus, setActiveFilterStatus] = useState<'all' | 'completed' | 'ongoing'>('all');

  const filteredAnimes = useMemo(() => {
    return catalogList.filter((a) => {
      // Query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = a.title.toLowerCase().includes(q);
        const matchesDesc = a.description?.toLowerCase().includes(q);
        const matchesGenres = a.genres?.some((g) => g.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesGenres) return false;
      }

      // Genre filter
      if (selectedGenre !== 'all') {
        const gLabel = GENRES.find((g) => g.key === selectedGenre)?.label;
        if (gLabel && !a.genres?.some((g) => g.includes(gLabel.split(' ')[0]))) {
          return false;
        }
      }

      // Audio filter
      if (activeFilterAudio === 'dub') {
        if (!a.studio?.includes('مدبلج') && !a.title.includes('دانك')) return false;
      } else if (activeFilterAudio === 'sub') {
        if (!a.studio?.includes('مترجم')) return false;
      }

      // Status filter
      if (activeFilterStatus === 'completed' && a.status === 'ongoing') return false;
      if (activeFilterStatus === 'ongoing' && a.status === 'completed') return false;

      return true;
    });
  }, [catalogList, searchQuery, selectedGenre, activeFilterAudio, activeFilterStatus]);

  const toggleFilterAudio = () => {
    setActiveFilterAudio((prev) =>
      prev === 'all' ? 'dub' : prev === 'dub' ? 'sub' : 'all'
    );
  };

  const toggleFilterStatus = () => {
    setActiveFilterStatus((prev) =>
      prev === 'all' ? 'completed' : prev === 'completed' ? 'ongoing' : 'all'
    );
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    isGridView,
    setIsGridView,
    filterModalVisible,
    setFilterModalVisible,
    activeFilterAudio,
    setActiveFilterAudio,
    activeFilterStatus,
    setActiveFilterStatus,
    filteredAnimes,
    toggleFilterAudio,
    toggleFilterStatus,
  };
}
