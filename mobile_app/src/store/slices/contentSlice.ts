import {
  fetchAppConfig,
  fetchHomeData,
  fetchEpisodes,
  fetchCharacters,
  fetchAnimes,
  fetchPlans,
  initAuthToken,
  fetchUserProfile,
  fetchContinueWatching,
  fetchFavorites,
} from '../../services/api';
import { AppSliceCreator, AppState, ContentSlice } from '../types/store.types';

export const createContentSlice: AppSliceCreator<ContentSlice> = (set) => ({
  appConfig: null,
  homeData: null,
  animes: [],
  episodes: [],
  characters: [],
  plans: [],

  setAppConfig: (appConfig) => set({ appConfig }),
  setHomeData: (homeData) => set({ homeData }),
  setAnimes: (animes) => set({ animes }),
  setEpisodes: (episodes) => set({ episodes }),
  setCharacters: (characters) => set({ characters }),
  setPlans: (plans) => set({ plans }),

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
});
