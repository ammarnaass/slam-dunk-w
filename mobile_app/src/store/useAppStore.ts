import { create } from 'zustand';
import { Alert } from 'react-native';
import { TabType } from '../components/BottomTabs';
import {
  HomeApiResponse,
  Episode,
  Anime,
  Character,
  AppConfig,
  Plan,
  UserProfile,
  ContinueWatchingItem,
  FavoriteItem,
} from '../types';
import {
  fetchHomeData,
  fetchEpisodes,
  fetchCharacters,
  fetchAppConfig,
  fetchAnimes,
  fetchPlans,
  initAuthToken,
  fetchUserProfile,
  fetchContinueWatching,
  fetchFavorites,
  syncWatchProgress,
  toggleFavorite as apiToggleFavorite,
  loginUser as apiLoginUser,
  setAuthToken,
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

  // User & Cross-Platform Sync State
  currentUser: UserProfile | null;
  continueWatching: ContinueWatchingItem[];
  favorites: (FavoriteItem | any)[];

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
  setCurrentUser: (user: UserProfile | null) => void;
  setContinueWatching: (items: any[]) => void;
  setFavorites: (favorites: any[]) => void;
  setSelectedEpisode: (episode: Episode | null) => void;
  setSelectedAnime: (anime: Anime | null) => void;
  setWatchModalVisible: (visible: boolean) => void;
  setDevBypassCode: (code: string) => void;
  setIsBypassed: (bypassed: boolean) => void;

  // Business Actions
  loadData: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  syncProgress: (episodeId: string, positionSeconds: number, durationSeconds: number) => Promise<void>;
  toggleFavorite: (type: 'anime' | 'episode', id: string) => Promise<boolean>;
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

  currentUser: null,
  continueWatching: [],
  favorites: [],

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
  setCurrentUser: (currentUser) => set({ currentUser }),
  setContinueWatching: (continueWatching) => set({ continueWatching }),
  setFavorites: (favorites) => set({ favorites }),
  setSelectedEpisode: (selectedEpisode) => set({ selectedEpisode }),
  setSelectedAnime: (selectedAnime) => set({ selectedAnime }),
  setWatchModalVisible: (watchModalVisible) => set({ watchModalVisible }),
  setDevBypassCode: (devBypassCode) => set({ devBypassCode }),
  setIsBypassed: (isBypassed) => set({ isBypassed }),

  refreshUserData: async () => {
    try {
      const [user, cw, favs] = await Promise.all([
        fetchUserProfile().catch(() => null),
        fetchContinueWatching().catch(() => []),
        fetchFavorites().catch(() => []),
      ]);
      set({
        currentUser: user,
        continueWatching: cw || [],
        favorites: favs || [],
      });
    } catch (_) {}
  },

  login: async (email: string, pass: string) => {
    try {
      const result = await apiLoginUser(email, pass);
      if (result.user) {
        set({ currentUser: result.user });
        get().refreshUserData();
        return { success: true };
      }
      return { success: false, error: result.error || 'فشل تسجيل الدخول' };
    } catch (err: any) {
      return { success: false, error: err.message || 'خطأ في الاتصال' };
    }
  },

  logout: () => {
    setAuthToken(null);
    set({
      currentUser: null,
      continueWatching: [],
      favorites: [],
    });
  },

  syncProgress: async (episodeId: string, positionSeconds: number, durationSeconds: number) => {
    try {
      await syncWatchProgress(episodeId, positionSeconds, durationSeconds);
      // Silently refresh continue watching list
      const cw = await fetchContinueWatching().catch(() => []);
      if (cw && cw.length > 0) {
        set({ continueWatching: cw });
      }
    } catch (e) {
      console.warn('syncProgress error:', e);
    }
  },

  toggleFavorite: async (type: 'anime' | 'episode', id: string) => {
    const { favorites } = get();
    const isFav = favorites.some((f) => (typeof f === 'string' ? f === id : f.id === id));
    try {
      const success = await apiToggleFavorite(type, id, isFav);
      if (success) {
        if (isFav) {
          set({ favorites: favorites.filter((f) => (typeof f === 'string' ? f !== id : f.id !== id)) });
        } else {
          set({ favorites: [...favorites, { id, type }] });
        }
        return !isFav;
      }
      return isFav;
    } catch (_) {
      return isFav;
    }
  },

  loadData: async () => {
    set({ loading: true });
    try {
      if (typeof initAuthToken === 'function') {
        await initAuthToken().catch(() => null);
      }

      const [config, hData, eps, chars, anims, fetchedPlans, userProfile, cw, favs] = await Promise.all([
        fetchAppConfig().catch(() => null),
        fetchHomeData().catch(() => null),
        fetchEpisodes('slam-dunk').catch(() => []),
        fetchCharacters().catch(() => []),
        fetchAnimes().catch(() => []),
        fetchPlans().catch(() => []),
        fetchUserProfile().catch(() => null),
        fetchContinueWatching().catch(() => []),
        fetchFavorites().catch(() => []),
      ]);

      set((state) => {
        const nextState: Partial<AppState> = {};

        if (config) nextState.appConfig = config;
        if (hData) nextState.homeData = hData;
        if (chars && chars.length > 0) nextState.characters = chars;
        if (fetchedPlans && fetchedPlans.length > 0) nextState.plans = fetchedPlans;
        if (userProfile) nextState.currentUser = userProfile;
        if (cw) nextState.continueWatching = cw;
        if (favs) nextState.favorites = favs;

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
