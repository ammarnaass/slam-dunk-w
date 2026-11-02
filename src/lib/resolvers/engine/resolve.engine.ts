/**
 * Main Stream Resolution Orchestrator
 */

import { detectProvider } from "../detection/provider.detect";
import { CloudProvider, resolveCloudServer } from "../providers/cloud.resolver";
import { resolveDirectMediaServer } from "../providers/direct.resolver";
import { EmbedProvider, resolveEmbedServer } from "../providers/embed.resolver";
import { MAX_URL_LENGTH } from "../security/ssrf.constants";
import { ResolvedServerInfo } from "../types/resolver.types";

const CLOUD_PROVIDERS = new Set<string>(["dropbox", "mega", "gdrive", "4shared", "mediafire"]);
const EMBED_PROVIDERS = new Set<string>(["vidmoly", "okru", "streamtape", "mp4upload"]);

/**
 * Resolves any raw external URL into a direct stream URL, clean embed player, and download URL.
 * Sanitizes malicious protocol schemes (e.g. javascript:, data:, vbscript:).
 */
export function resolveStreamUrl(url: string, qualityHint?: string): ResolvedServerInfo {
  const trimmed = (url || "").trim();

  // Strict Security Check: URL MUST strictly begin with http:// or https://
  const lowerTrimmed = trimmed.toLowerCase();
  const isHttpOrHttps = lowerTrimmed.startsWith("http://") || lowerTrimmed.startsWith("https://");

  if (!isHttpOrHttps || trimmed.length > MAX_URL_LENGTH) {
    return {
      provider: "custom",
      type: "embed",
      defaultName: "رابط محظور أمنياً",
      directUrl: "",
      embedUrl: "",
      downloadUrl: undefined,
      category: "streaming",
      matrixCategory: "embed",
      quality: qualityHint || "1080p FHD",
      supportedQualities: ["1080p", "720p", "480p", "Auto"],
      isDirectPlayable: false,
    };
  }

  const provider = detectProvider(trimmed);
  const quality = qualityHint || "1080p FHD";

  let baseInfo: Omit<ResolvedServerInfo, "supportedQualities">;

  if (CLOUD_PROVIDERS.has(provider)) {
    baseInfo = resolveCloudServer(provider as CloudProvider, trimmed, quality);
  } else if (EMBED_PROVIDERS.has(provider)) {
    baseInfo = resolveEmbedServer(provider as EmbedProvider, trimmed, quality);
  } else {
    baseInfo = resolveDirectMediaServer(provider as "hls" | "custom", trimmed, quality);
  }

  return {
    ...baseInfo,
    supportedQualities: ["1080p", "720p", "480p", "Auto"],
  };
}
