import { Platform } from 'react-native';
import { HomeApiResponse, Episode, Anime, Character, UserProfile, WatchHistoryItem, Plan } from '../types';

// Default host based on platform
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
export let API_BASE_URL = `${DEFAULT_HOST}/api/mobile/v1`;

let authToken: string | null = null;

export const setApiBaseUrl = (url: string) => {
  API_BASE_URL = url;
};

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

const getHeaders = (extraHeaders: Record<string, string> = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-app-version': '1.0.0',
    ...extraHeaders,
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

// 1. Remote App Configuration
export async function fetchAppConfig(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/config`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (error: any) {
    console.warn('Config fetch local error, trying cloud fallback:', error.message);
    try {
      const res = await fetch('https://slam-dunk-w.vercel.app/api/mobile/v1/config');
      const json = await res.json();
      if (json.success && json.data) return json.data;
    } catch (_) {}
  }
  return null;
}

// 2. Home Screen Feed
export async function fetchHomeData(): Promise<HomeApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/home`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    throw new Error(json.error || 'Failed to fetch home data');
  } catch (error: any) {
    console.warn('Home API Error, trying cloud fallback:', error.message);
    try {
      const fallbackRes = await fetch('https://slam-dunk-w.vercel.app/api/mobile/v1/home');
      const fallbackJson = await fallbackRes.json();
      if (fallbackJson.success && fallbackJson.data) {
        return fallbackJson.data;
      }
    } catch (_) {}
    throw error;
  }
}

// 3. Characters Roster
export async function fetchCharacters(): Promise<Character[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/characters`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (error) {
    console.warn('Fetch characters local failed, trying cloud fallback:', error);
    try {
      const fallbackRes = await fetch('https://slam-dunk-w.vercel.app/api/mobile/v1/characters');
      const fallbackJson = await fallbackRes.json();
      if (fallbackJson.success && Array.isArray(fallbackJson.data)) {
        return fallbackJson.data;
      }
    } catch (_) {}
  }
  return [];
}

// 4. Episodes Catalog
export async function fetchEpisodes(animeId: string = 'slam-dunk'): Promise<Episode[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/animes/${animeId}/episodes`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
    return [];
  } catch (error) {
    console.warn('Fetch episodes local error, trying fallback:', error);
    try {
      const fallbackRes = await fetch(`https://slam-dunk-w.vercel.app/api/mobile/v1/animes/${animeId}/episodes`);
      const fallbackJson = await fallbackRes.json();
      if (fallbackJson.success && Array.isArray(fallbackJson.data)) {
        return fallbackJson.data;
      }
    } catch (_) {}
    return [];
  }
}

// 5. Episode Details & Streaming Servers
export async function fetchEpisodeDetails(episodeId: string): Promise<Episode | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/episodes/${episodeId}`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (error) {
    console.warn('Fetch episode details error:', error);
    return null;
  }
}

// 6. Anime Details
export async function fetchAnimeDetails(animeId: string): Promise<Anime | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/animes/${animeId}`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (error) {
    console.warn('Fetch anime details error:', error);
    return null;
  }
}

// 7. Live Content Search
export async function searchContent(query: string): Promise<{ animes: Anime[]; episodes: Episode[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return { animes: [], episodes: [] };
  } catch (error) {
    console.warn('Search error:', error);
    return { animes: [], episodes: [] };
  }
}

// 8. User Login
export async function loginUser(email: string, password: string): Promise<{ user: UserProfile | null; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (json.success && json.data) {
      setAuthToken(json.data.token);
      return { user: json.data };
    }
    return { user: null, error: json.error || 'فشل تسجيل الدخول' };
  } catch (error: any) {
    return { user: null, error: error.message || 'خطأ في الاتصال بالخادم' };
  }
}

// 9. User Profile (Me)
export async function fetchUserProfile(): Promise<UserProfile | null> {
  try {
    if (!authToken) return null;
    const res = await fetch(`${API_BASE_URL}/auth/me`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (error) {
    console.warn('Fetch user profile error:', error);
    return null;
  }
}

// 10. Watch History Management
export async function recordWatchHistory(animeId: string, episodeId: string, progress: number): Promise<boolean> {
  try {
    if (!authToken) return false;
    const res = await fetch(`${API_BASE_URL}/history`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ animeId, episodeId, progress }),
    });
    const json = await res.json();
    return !!json.success;
  } catch (error) {
    console.warn('Record history error:', error);
    return false;
  }
}

export async function fetchWatchHistory(): Promise<WatchHistoryItem[]> {
  try {
    if (!authToken) return [];
    const res = await fetch(`${API_BASE_URL}/history`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
    return [];
  } catch (error) {
    console.warn('Fetch watch history error:', error);
    return [];
  }
}

// 11. Animes Catalog
export async function fetchAnimes(type?: string, status?: string): Promise<Anime[]> {
  try {
    let url = `${API_BASE_URL}/animes`;
    const params: string[] = [];
    if (type && type !== 'all') params.push(`type=${encodeURIComponent(type)}`);
    if (status && status !== 'all') params.push(`status=${encodeURIComponent(status)}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
    return [];
  } catch (error) {
    console.warn('Fetch animes local error, trying fallback:', error);
    try {
      const fallbackRes = await fetch('https://slam-dunk-w.vercel.app/api/mobile/v1/animes');
      const fallbackJson = await fallbackRes.json();
      if (fallbackJson.success && Array.isArray(fallbackJson.data)) {
        return fallbackJson.data;
      }
    } catch (_) {}
    return [];
  }
}

// 12. Subscription Plans Catalog (باقات وخطط الاشتراك)
export async function fetchPlans(): Promise<Plan[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/plans`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
  } catch (error) {
    console.warn('Fetch plans local error, trying fallback:', error);
    try {
      const fallbackRes = await fetch('https://slam-dunk-w.vercel.app/api/mobile/v1/plans');
      const fallbackJson = await fallbackRes.json();
      if (fallbackJson.success && Array.isArray(fallbackJson.data)) {
        return fallbackJson.data;
      }
    } catch (_) {}
  }
  return [
    {
      id: 'plan-monthly-vip',
      name: 'الاشتراك الشهري',
      price: 3.99,
      duration: '30',
      description: 'إلغاء التجديد في أي وقت',
      features: ['مشاهدة بدقة 1080p FHD بدون إعلانات', 'سيرفرات فائقة السرعة'],
      isActive: true,
      isPopular: false,
    },
    {
      id: 'plan-yearly-vip',
      name: 'الاشتراك السنوي',
      price: 29.99,
      duration: '365',
      description: 'وفر 37% مقارنة بالشهري',
      features: ['أعلى توفير سنوي', '4K HDR لكافة الحلقات', 'شارة VIP متوهجة'],
      isActive: true,
      isPopular: true,
    },
  ];
}

// 13. Create Subscription Plan (إنشاء الخطة عبر API)
export async function createPlan(planData: {
  name: string;
  price: number;
  duration?: string;
  description?: string;
  features?: string[];
  isActive?: boolean;
}): Promise<{ plan: Plan | null; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/plans`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(planData),
    });
    const json = await res.json();
    if (json.success && json.data) {
      return { plan: json.data };
    }
    return { plan: null, error: json.error || 'فشل إنشاء الخطة' };
  } catch (error: any) {
    console.error('Create plan API error:', error);
    return { plan: null, error: error.message || 'خطأ في الاتصال بالخادم أثناء إنشاء الخطة' };
  }
}
