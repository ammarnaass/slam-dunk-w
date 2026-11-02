/**
 * Provider & Hosting Detection Engine
 */

import { ServerProvider } from "../types/resolver.types";

const KNOWN_PROVIDERS = new Set<string>([
  "hls",
  "mega",
  "dropbox",
  "4shared",
  "gdrive",
  "mediafire",
  "vidmoly",
  "okru",
  "streamtape",
  "mp4upload",
  "custom",
]);

/**
 * Detects the hosting provider from the URL or explicit hint
 */
export function detectProvider(url: string, explicitProvider?: string): ServerProvider {
  if (explicitProvider && KNOWN_PROVIDERS.has(explicitProvider.toLowerCase())) {
    return explicitProvider.toLowerCase() as ServerProvider;
  }

  const lower = (url || "").toLowerCase();
  if (lower.includes("mega.nz") || lower.includes("mega.io")) return "mega";
  if (lower.includes("dropbox.com") || lower.includes("dropboxusercontent.com")) return "dropbox";
  if (lower.includes("4shared.com")) return "4shared";
  if (lower.includes("drive.google.com") || lower.includes("docs.google.com")) return "gdrive";
  if (lower.includes("mediafire.com")) return "mediafire";
  if (lower.includes("ok.ru") || lower.includes("odnoklassniki")) return "okru";
  if (lower.includes("vidmoly")) return "vidmoly";
  if (lower.includes("streamtape")) return "streamtape";
  if (lower.includes("mp4upload")) return "mp4upload";
  if (lower.includes(".m3u8")) return "hls";
  return "custom";
}
