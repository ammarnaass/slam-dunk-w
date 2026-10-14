import { create } from 'zustand';
import { Alert } from 'react-native';
import { TabType } from '../components/BottomTabs';
import { HomeApiResponse, Episode, Anime, Character, AppConfig, Plan } from '../types';
import {
  fetchHomeData,
  fetchEpisodes,
  fetchCharacters,
  fetchAppConfig,
  fetchAnimes,
  fetchPlans,
  initAuthToken,
} from '../services/api';

interface AppState {
  // Navigation & Screen State
  currentTab: TabType;
  loading: boolean;

  // Domain Data
  appConfig: AppConfig | null;
  homeData: HomeApiResponse | null;
  animes: Anime[];
  episodes: Episode[];
  characters: Character[];
  plans: Plan[];

  // Modal / Selection State
  selectedEpisode: Episode | null;
  selectedAnime: Anime | null;
  watchModalVisible: boolean;

  // Maintenance & Dev Bypass
  devBypassCode: string;
  isBypassed: boolean;

  // Setters
  setCurrentTab: (tab: TabType) => void;
  setLoading: (loading: boolean) => void;
  setAppConfig: (config: AppConfig | null) => void;
  setHomeData: (data: HomeApiResponse | null) => void;
  setAnimes: (animes: Anime[]) => void;
  setEpisodes: (episodes: Episode[]) => void;
  setCharacters: (characters: Character[]) => void;
  setPlans: (plans: Plan[]) => void;
  setSelectedEpisode: (episode: Episode | null) => void;
  setSelectedAnime: (anime: Anime | null) => void;
  setWatchModalVisible: (visible: boolean) => void;
  setDevBypassCode: (code: string) => void;
  setIsBypassed: (bypassed: boolean) => void;

  // Business Actions
  loadData: () => Promise<void>;
  handleEpisodePress: (episode: Episode) => void;
  handleNextEpisode: () => void;
  handleAnimePress: (anime: Anime) => Promise<void>;
  handleHeaderSearch: () => void;
  handleTabChange: (tab: TabType) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentTab: 'home',
  loading: true,

  appConfig: null,
  homeData: null,
  animes: [],
  episodes: [],
  characters: [],
  plans: [],

  selectedEpisode: null,
  selectedAnime: null,
  watchModalVisible: false,

  devBypassCode: '',
  isBypassed: false,

  setCurrentTab: (tab) => set({ currentTab: tab }),
  setLoading: (loading) => set({ loading }),
  setAppConfig: (appConfig) => set({ appConfig }),
  setHomeData: (homeData) => set({ homeData }),
  setAnimes: (animes) => set({ animes }),
  setEpisodes: (episodes) => set({ episodes }),
  setCharacters: (characters) => set({ characters }),
  setPlans: (plans) => set({ plans }),
  setSelectedEpisode: (selectedEpisode) => set({ selectedEpisode }),
  setSelectedAnime: (selectedAnime) => set({ selectedAnime }),
  setWatchModalVisible: (watchModalVisible) => set({ watchModalVisible }),
  setDevBypassCode: (devBypassCode) => set({ devBypassCode }),
  setIsBypassed: (isBypassed) => set({ isBypassed }),

  loadData: async () => {
    set({ loading: true });
    try {
      if (typeof initAuthToken === 'function') {
        await initAuthToken().catch(() => null);
      }

      const [config, hData, eps, chars, anims, fetchedPlans] = await Promise.all([
        fetchAppConfig().catch(() => null),
        fetchHomeData().catch(() => null),
        fetchEpisodes('slam-dunk').catch(() => []),
        fetchCharacters().catch(() => []),
        fetchAnimes().catch(() => []),
        fetchPlans().catch(() => []),
      ]);

      set((state) => {
        const nextState: Partial<AppState> = {};

        if (config) nextState.appConfig = config;
        if (hData) nextState.homeData = hData;
        if (chars && chars.length > 0) nextState.characters = chars;
        if (fetchedPlans && fetchedPlans.length > 0) nextState.plans = fetchedPlans;

        if (anims && anims.length > 0) {
          nextState.animes = anims;
        } else if (hData?.slider && hData.slider.length > 0) {
          nextState.animes = hData.slider;
        }

        if (eps && eps.length > 0) {
          nextState.episodes = eps;
        } else if (hData && hData.latest) {
          nextState.episodes = hData.latest;
        }

        return nextState;
      });
    } catch (error) {
      console.error('App init error:', error);
    } finally {
      set({ loading: false });
    }
  },

  handleEpisodePress: (ep: Episode) => {
    set({
      selectedEpisode: ep,
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

  handleAnimePress: async (anime: Anime) => {
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

  handleTabChange: (tab: TabType) => {
    set((state) => ({
      currentTab: tab,
      selectedAnime: tab === 'animes' ? null : state.selectedAnime,
    }));
  },
}));
