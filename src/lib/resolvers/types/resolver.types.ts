/**
 * Core Type Definitions for the Multi-Host Stream Resolver Engine
 * ANIME DAZE & Anime Slayer Grade Architecture
 */

export type ServerProvider =
  | "hls"
  | "mega"
  | "dropbox"
  | "4shared"
  | "gdrive"
  | "mediafire"
  | "vidmoly"
  | "okru"
  | "streamtape"
  | "mp4upload"
  | "custom";

export type ServerType = "hls" | "mp4" | "embed" | "mega" | "dash";

export type ServerCategory = "streaming" | "download" | "both";

export type ServerMatrixClassification = "direct" | "embed" | "download";

export interface ResolvedServerInfo {
  provider: ServerProvider;
  type: ServerType;
  defaultName: string;
  directUrl: string;
  embedUrl: string;
  downloadUrl?: string;
  category: ServerCategory;
  matrixCategory: ServerMatrixClassification;
  quality: string;
  supportedQualities: string[];
  isDirectPlayable: boolean;
}

export interface ServerHealthResult {
  isWorking: boolean;
  latencyMs: number;
  statusCode?: number;
  securityNotice?: string;
}

export interface SecurityCheckResult {
  isSafe: boolean;
  reason?: string;
}
