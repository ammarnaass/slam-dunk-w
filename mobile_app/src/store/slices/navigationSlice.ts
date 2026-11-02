import { Alert } from 'react-native';
import { fetchEpisodes } from '../../services/api';
import { AppSliceCreator, NavigationSlice } from '../types/store.types';

export const createNavigationSlice: AppSliceCreator<NavigationSlice> = (set, get) => ({
  currentTab: 'home',
  loading: true,
  selectedEpisode: null,
  selectedAnime: null,
  watchModalVisible: false,
  devBypassCode: '',
  isBypassed: false,

  setCurrentTab: (tab) => set({ currentTab: tab }),
  setLoading: (loading) => set({ loading }),
  setSelectedEpisode: (selectedEpisode) => set({ selectedEpisode }),
  setSelectedAnime: (selectedAnime) => set({ selectedAnime }),
  setWatchModalVisible: (watchModalVisible) => set({ watchModalVisible }),
  setDevBypassCode: (devBypassCode) => set({ devBypassCode }),
  setIsBypassed: (isBypassed) => set({ isBypassed }),

  handleEpisodePress: (episode) => {
    set({
      selectedEpisode: episode,
      watchModalVisible: true,
    });
  },

  handleNextEpisode: () => {
    const { selectedEpisode, episodes } = get();
    if (!selectedEpisode || episodes.length === 0) return;
    const currentIdx = episodes.findIndex((e) => e.id === selectedEpisode.id);
    if (currentIdx !== -1 && currentIdx < episodes.length - 1) {
      set({ selectedEpisode: episodes[currentIdx + 1] });
    } else {
      Alert.alert('نهاية السلسلة', 'لقد وصلت لآخر حلقة متوفرة في هذا القسم!');
    }
  },

  handleAnimePress: async (anime) => {
    set({
      selectedAnime: anime,
      currentTab: 'animes',
    });
    try {
      const eps = await fetchEpisodes(anime.id);
      if (eps && eps.length > 0) {
        set({ episodes: eps });
      }
    } catch (_) {}
  },

  handleHeaderSearch: () => {
    set({
      selectedAnime: null,
      currentTab: 'animes',
    });
  },

  handleTabChange: (tab) => {
    set((state) => ({
      currentTab: tab,
      selectedAnime: tab === 'animes' ? null : state.selectedAnime,
    }));
  },
});
