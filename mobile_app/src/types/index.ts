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
  episodeNumber?: number; // Unified primary field (camelCase)
  episode_number?: number; // @deprecated legacy alias, use episodeNumber
  seasonNumber?: number; // Unified primary field (camelCase)
  season_number?: number; // @deprecated legacy alias, use seasonNumber
  mega_link?: string;
  animeTitle?: string;
  animeCover?: string;
  servers?: Server[];
}

export interface AnimeReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 10
  comment: string;
  createdAt: string;
  isVip?: boolean;
}

export interface AnimeRatingMetrics {
  overallScore: number;
  totalVotes: number;
  storyScore: number;
  animationScore: number;
  soundScore: number;
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
  studio?: string;
  ageRating?: string;
  ratingMetrics?: AnimeRatingMetrics;
  reviews?: AnimeReview[];
  isFeatured?: boolean;
  episodes?: Episode[];
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
  animeId?: string;
  voiceActorJa?: string;
  voiceActorAr?: string;
}

export interface AppSettings {
  siteName: string;
  logoUrl?: string;
  maintenanceMode?: boolean;
  apiApp?: {
    latestVersion?: string;
    updateUrl?: string;
    isMaintenance?: boolean;
    maintenanceMessage?: string;
  };
}

export interface HomeApiResponse {
  slider: Anime[];
  latest: Episode[];
  ongoing?: Anime[];
  sections?: { title: string; items: any[] }[];
  settings?: AppSettings;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  isVip?: boolean;
  planType?: string;
  token?: string;
  watchlist?: string[];
}

export interface WatchHistoryItem {
  id?: string;
  userId: string;
  animeId: string;
  episodeId: string;
  progress: number;
  watchedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  description?: string | null;
  features: string[];
  isActive?: boolean;
  isPopular?: boolean;
}

export interface MaintenanceConfig {
  is_active: boolean;
  title?: string;
  message?: string;
  estimated_end_time?: string;
  dev_bypass_key?: string;
}

export interface VersionControlConfig {
  latest_version?: string;
  force_update?: boolean;
  direct_apk_url?: string;
  store_url?: string;
}

export interface AppConfig {
  maintenance?: MaintenanceConfig;
  version_control?: VersionControlConfig;
  features?: Record<string, boolean>;
  api_endpoints?: Record<string, string>;
  [key: string]: any;
}

