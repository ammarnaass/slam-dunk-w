import {
  loginUser as apiLoginUser,
  fetchContinueWatching,
  fetchFavorites,
  fetchUserProfile,
  setAuthToken,
  syncWatchProgress,
  toggleFavorite as apiToggleFavorite,
} from '../../services/api';
import { AppSliceCreator, UserSlice } from '../types/store.types';

export const createUserSlice: AppSliceCreator<UserSlice> = (set, get) => ({
  currentUser: null,
  continueWatching: [],
  favorites: [],

  setCurrentUser: (currentUser) => set({ currentUser }),
  setContinueWatching: (continueWatching) => set({ continueWatching }),
  setFavorites: (favorites) => set({ favorites }),

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
});
