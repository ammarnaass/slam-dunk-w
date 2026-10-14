import {
  HomeApiResponse,
  Episode,
  Anime,
  Character,
} from '../../types';
import { API_BASE_URL, getHeaders } from './client';

export const normalizeEpisode = (ep: any): Episode => {
  const num = ep?.episodeNumber ?? ep?.episode_number ?? 1;
  const sNum = ep?.seasonNumber ?? ep?.season_number ?? 1;
  return {
    ...ep,
    episodeNumber: Number(num),
    episode_number: Number(num),
    seasonNumber: Number(sNum),
    season_number: Number(sNum),
  };
};

// 1. Home Screen Feed
export async function fetchHomeData(): Promise<HomeApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/home`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && json.data) {
      if (Array.isArray(json.data.latest)) {
        json.data.latest = json.data.latest.map(normalizeEpisode);
      }
      return json.data;
    }
    throw new Error(json.error || 'Failed to fetch home data');
  } catch (error: any) {
    console.warn('Home API Error, trying cloud fallback:', error.message);
    try {
      const fallbackRes = await fetch('https://slam-dunk-w.vercel.app/api/mobile/v1/home');
      const fallbackJson = await fallbackRes.json();
      if (fallbackJson.success && fallbackJson.data) {
        if (Array.isArray(fallbackJson.data.latest)) {
          fallbackJson.data.latest = fallbackJson.data.latest.map(normalizeEpisode);
        }
        return fallbackJson.data;
      }
    } catch (_) {}
    throw error;
  }
}

// 2. Characters Roster
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

// 3. Episodes Catalog
export async function fetchEpisodes(animeId: string = 'slam-dunk'): Promise<Episode[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/animes/${animeId}/episodes`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data.map(normalizeEpisode);
    }
    return [];
  } catch (error) {
    console.warn('Fetch episodes local error, trying fallback:', error);
    try {
      const fallbackRes = await fetch(`https://slam-dunk-w.vercel.app/api/mobile/v1/animes/${animeId}/episodes`);
      const fallbackJson = await fallbackRes.json();
      if (fallbackJson.success && Array.isArray(fallbackJson.data)) {
        return fallbackJson.data.map(normalizeEpisode);
      }
    } catch (_) {}
    return [];
  }
}

// 4. Episode Details & Streaming Servers
export async function fetchEpisodeDetails(episodeId: string): Promise<Episode | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/episodes/${episodeId}`, { headers: getHeaders() });
    const json = await res.json();
    if (json.success && json.data) {
      return normalizeEpisode(json.data);
    }
    return null;
  } catch (error) {
    console.warn('Fetch episode details error:', error);
    return null;
  }
}

// 5. Anime Details
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

// 6. Animes Catalog Filter
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
