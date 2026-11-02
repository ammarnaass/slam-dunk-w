import { StateCreator } from 'zustand';
import { TabType } from '../../components/BottomTabs';
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
} from '../../types';

export interface NavigationSlice {
  // Navigation & Screen State
  currentTab: TabType;
  loading: boolean;
  selectedEpisode: Episode | null;
  selectedAnime: Anime | null;
  watchModalVisible: boolean;
  devBypassCode: string;
  isBypassed: boolean;

  // Setters
  setCurrentTab: (tab: TabType) => void;
  setLoading: (loading: boolean) => void;
  setSelectedEpisode: (episode: Episode | null) => void;
  setSelectedAnime: (anime: Anime | null) => void;
  setWatchModalVisible: (visible: boolean) => void;
  setDevBypassCode: (code: string) => void;
  setIsBypassed: (bypassed: boolean) => void;

  // Actions
  handleEpisodePress: (episode: Episode) => void;
  handleNextEpisode: () => void;
  handleAnimePress: (anime: Anime) => Promise<void>;
  handleHeaderSearch: () => void;
  handleTabChange: (tab: TabType) => void;
}

export interface ContentSlice {
  // Domain Data
  appConfig: AppConfig | null;
  homeData: HomeApiResponse | null;
  animes: Anime[];
  episodes: Episode[];
  characters: Character[];
  plans: Plan[];

  // Setters
  setAppConfig: (config: AppConfig | null) => void;
  setHomeData: (data: HomeApiResponse | null) => void;
  setAnimes: (animes: Anime[]) => void;
  setEpisodes: (episodes: Episode[]) => void;
  setCharacters: (characters: Character[]) => void;
  setPlans: (plans: Plan[]) => void;

  // Actions
  loadData: () => Promise<void>;
}

export interface UserSlice {
  // User & Sync State
  currentUser: UserProfile | null;
  continueWatching: ContinueWatchingItem[];
  favorites: (FavoriteItem | any)[];

  // Setters
  setCurrentUser: (user: UserProfile | null) => void;
  setContinueWatching: (items: any[]) => void;
  setFavorites: (favorites: any[]) => void;

  // Actions
  refreshUserData: () => Promise<void>;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  syncProgress: (episodeId: string, positionSeconds: number, durationSeconds: number) => Promise<void>;
  toggleFavorite: (type: 'anime' | 'episode', id: string) => Promise<boolean>;
}

export type AppState = NavigationSlice & ContentSlice & UserSlice;

export type AppSliceCreator<T> = StateCreator<AppState, [], [], T>;
