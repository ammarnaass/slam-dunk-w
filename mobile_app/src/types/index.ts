export interface Server {
  id: string;
  name: string;
  url: string;
  quality?: string;
}

export interface Episode {
  id: string;
  animeId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  episode_number?: number;
  episodeNumber?: number;
  season_number?: number;
  seasonNumber?: number;
  mega_link?: string;
  animeTitle?: string;
  animeCover?: string;
  servers?: Server[];
}

export interface Anime {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  bannerImage?: string;
  type?: string;
  status?: string;
  releaseYear?: number;
  totalEpisodes?: number;
  genres?: string[];
  rating?: number;
  isFeatured?: boolean;
}

export interface Character {
  id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  image?: string;
  role?: string;
  team?: string;
  position?: string;
  number?: string;
}

export interface AppSettings {
  siteName: string;
  logoUrl?: string;
  maintenanceMode?: boolean;
  apiApp?: {
    latestVersion?: string;
    updateUrl?: string;
  };
}

export interface HomeApiResponse {
  slider: Anime[];
  latest: Episode[];
  ongoing?: Anime[];
  sections?: { title: string; items: any[] }[];
  settings?: AppSettings;
}
