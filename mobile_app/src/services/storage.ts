import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: '@slam_auth_token',
  USER_PROFILE: '@slam_user_profile',
  WATCH_HISTORY: '@slam_watch_history',
  FAVORITES: '@slam_favorites',
  APP_SETTINGS: '@slam_settings',
} as const;

const memoryFallback = new Map<string, string>();

export const StorageService = {
  /**
   * Save authentication token to persistent storage
   */
  async setToken(token: string): Promise<void> {
    try {
      if (AsyncStorage?.setItem) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      }
      memoryFallback.set(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (_) {
      memoryFallback.set(STORAGE_KEYS.AUTH_TOKEN, token);
    }
  },

  /**
   * Retrieve authentication token from persistent storage
   */
  async getToken(): Promise<string | null> {
    try {
      if (AsyncStorage?.getItem) {
        const val = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (val) return val;
      }
      return memoryFallback.get(STORAGE_KEYS.AUTH_TOKEN) || null;
    } catch (_) {
      return memoryFallback.get(STORAGE_KEYS.AUTH_TOKEN) || null;
    }
  },

  /**
   * Clear authentication token from persistent storage
   */
  async removeToken(): Promise<void> {
    try {
      if (AsyncStorage?.removeItem) {
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      }
      memoryFallback.delete(STORAGE_KEYS.AUTH_TOKEN);
    } catch (_) {
      memoryFallback.delete(STORAGE_KEYS.AUTH_TOKEN);
    }
  },

  /**
   * Save arbitrary JSON serializable item
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const str = JSON.stringify(value);
      if (AsyncStorage?.setItem) {
        await AsyncStorage.setItem(key, str);
      }
      memoryFallback.set(key, str);
    } catch (_) {
      memoryFallback.set(key, JSON.stringify(value));
    }
  },

  /**
   * Retrieve and deserialize stored item
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      let val: string | null = null;
      if (AsyncStorage?.getItem) {
        val = await AsyncStorage.getItem(key);
      }
      if (!val) {
        val = memoryFallback.get(key) || null;
      }
      return val ? (JSON.parse(val) as T) : null;
    } catch (_) {
      const mem = memoryFallback.get(key);
      return mem ? (JSON.parse(mem) as T) : null;
    }
  },

  /**
   * Remove item from persistent storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      if (AsyncStorage?.removeItem) {
        await AsyncStorage.removeItem(key);
      }
      memoryFallback.delete(key);
    } catch (_) {
      memoryFallback.delete(key);
    }
  },

  /**
   * Clear all app storage
   */
  async clearAll(): Promise<void> {
    try {
      if (AsyncStorage?.clear) {
        await AsyncStorage.clear();
      }
      memoryFallback.clear();
    } catch (_) {
      memoryFallback.clear();
    }
  },
};

