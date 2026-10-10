import { Platform } from 'react-native';
import { HomeApiResponse, Episode, Anime, Character } from '../types';

// Default to local server based on platform
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
export let API_BASE_URL = `${DEFAULT_HOST}/api/mobile/v1`;

export const setApiBaseUrl = (url: string) => {
  API_BASE_URL = url;
};

export async function fetchHomeData(): Promise<HomeApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/home`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    throw new Error(json.error || 'Failed to fetch home data');
  } catch (error: any) {
    console.warn('API Error, trying production fallback:', error.message);
    // Fallback to production Vercel deployment if local is unreachable
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

export async function fetchEpisodes(animeId: string = 'slam-dunk'): Promise<Episode[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/animes/${animeId}/episodes`);
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return [];
  } catch (error) {
    console.error('Fetch episodes error:', error);
    return [];
  }
}

export async function fetchEpisodeDetails(episodeId: string): Promise<Episode | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/episodes/${episodeId}`);
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (error) {
    console.error('Fetch episode details error:', error);
    return null;
  }
}

export async function searchContent(query: string): Promise<{ animes: Anime[]; episodes: Episode[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return { animes: [], episodes: [] };
  } catch (error) {
    console.error('Search error:', error);
    return { animes: [], episodes: [] };
  }
}
