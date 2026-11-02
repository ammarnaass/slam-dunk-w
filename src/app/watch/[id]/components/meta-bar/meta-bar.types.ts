import { Episode } from "@/types";

export interface ServerItem {
  id?: string;
  name: string;
  url: string;
  directUrl?: string | null;
  embedUrl?: string | null;
  downloadUrl?: string | null;
  quality?: string | null;
  provider?: string;
  category?: string;
  matrixCategory?: "direct" | "embed" | "download";
  type?: string;
  ping?: string;
  isWorking?: boolean;
}

export type EpisodeWithAnime = Episode & {
  anime?: { id?: string; title: string };
};

export interface EpisodeNavInfo {
  id: string;
  episodeNumber: number | string;
}

export interface WatchEpisodeMetaBarProps {
  episode: EpisodeWithAnime;
  prevEpisode: EpisodeNavInfo | null;
  nextEpisode: EpisodeNavInfo | null;
  servers: ServerItem[];
  activeServerIndex: number;
  onSelectServer: (idx: number) => void;
  activeQuality: string;
  onSelectQuality: (q: string) => void;
  onShowToast: (message: string, icon?: string) => void;
}
