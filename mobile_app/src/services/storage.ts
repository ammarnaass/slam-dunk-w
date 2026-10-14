import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: '@slam_auth_token',
  USER_PROFILE: '@slam_user_profile',
  WATCH_HISTORY: '@slam_watch_history',
  FAVORITES: '@slam_favorites',
  APP_SETTINGS: '@slam_settings',
} as const;

export const StorageService = {
  /**
   * Save authentication token to persistent storage
   */
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (e) {
      console.error('Failed to save auth token to persistent storage:', e);
    }
  },

  /**
   * Retrieve authentication token from persistent storage
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (e) {
      console.error('Failed to get auth token from storage:', e);
      return null;
    }
  },

  /**
   * Clear authentication token from persistent storage
   */
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (e) {
      console.error('Failed to remove auth token from storage:', e);
    }
  },

  /**
   * Save arbitrary JSON serializable item
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save ${key} to storage:`, e);
    }
  },

  /**
   * Retrieve and deserialize stored item
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const val = await AsyncStorage.getItem(key);
      return val ? (JSON.parse(val) as T) : null;
    } catch (e) {
      console.error(`Failed to get ${key} from storage:`, e);
      return null;
    }
  },

  /**
   * Remove item from persistent storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`Failed to remove ${key} from storage:`, e);
    }
  },

  /**
   * Clear all app storage
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Failed to clear persistent storage:', e);
    }
  },
};
