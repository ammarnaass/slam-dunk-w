/**
 * Direct Media Stream Resolver
 * Covers: HLS (.m3u8), DASH (.mpd), Direct MP4, and Generic Embed Fallback
 */

import {
  ResolvedServerInfo,
  ServerCategory,
  ServerMatrixClassification,
  ServerProvider,
  ServerType,
} from "../types/resolver.types";

export function resolveDirectMediaServer(
  provider: "hls" | "custom",
  rawUrl: string,
  quality: string
): Omit<ResolvedServerInfo, "supportedQualities"> {
  const directUrl = rawUrl;
  let embedUrl = directUrl;
  let downloadUrl: string | undefined = undefined;
  let type: ServerType = "hls";
  let defaultName = `سيرفر البث المباشر (${quality})`;
  let category: ServerCategory = "streaming";
  let matrixCategory: ServerMatrixClassification = "direct";
  let isDirectPlayable = true;

  if (provider === "hls") {
    defaultName = `سيرفر المنصة المباشر (HLS ${quality})`;
    type = "hls";
    category = "streaming";
    matrixCategory = "direct";
    isDirectPlayable = true;
    embedUrl = directUrl;
  } else {
    const lower = directUrl.toLowerCase();
    if (lower.includes(".m3u8")) {
      type = "hls";
      category = "streaming";
      matrixCategory = "direct";
      defaultName = `سيرفر HLS فائق السرعة (${quality})`;
      isDirectPlayable = true;
    } else if (lower.includes(".mpd")) {
      type = "dash";
      category = "streaming";
      matrixCategory = "direct";
      defaultName = `سيرفر DASH التكيفي (${quality})`;
      isDirectPlayable = true;
    } else if (lower.includes(".mp4")) {
      type = "mp4";
      category = "both";
      matrixCategory = "direct";
      defaultName = `سيرفر MP4 المباشر (${quality})`;
      isDirectPlayable = true;
      downloadUrl = directUrl;
    } else {
      type = "embed";
      category = "streaming";
      matrixCategory = "embed";
      defaultName = `سيرفر البث الاحتياطي (${quality})`;
      isDirectPlayable = false;
    }
    embedUrl = directUrl;
  }

  return {
    provider: provider as ServerProvider,
    type,
    defaultName,
    directUrl,
    embedUrl,
    downloadUrl,
    category,
    matrixCategory,
    quality,
    isDirectPlayable,
  };
}
