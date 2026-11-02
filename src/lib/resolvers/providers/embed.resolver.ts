/**
 * Embed & Streaming Hosting Providers Resolver
 * Covers: Vidmoly, Ok.ru, Streamtape, Mp4upload
 */

import {
  ResolvedServerInfo,
  ServerProvider,
  ServerType,
} from "../types/resolver.types";

export type EmbedProvider = "vidmoly" | "okru" | "streamtape" | "mp4upload";

export function resolveEmbedServer(
  provider: EmbedProvider,
  rawUrl: string,
  quality: string
): Omit<ResolvedServerInfo, "supportedQualities"> {
  let directUrl = rawUrl;
  let embedUrl = rawUrl;
  const type: ServerType = "embed";
  let defaultName = `سيرفر العرض (${quality})`;

  switch (provider) {
    case "vidmoly": {
      defaultName = `سيرفر فيدمولي (${quality})`;
      if (directUrl.includes("/w/")) {
        embedUrl = directUrl.replace("/w/", "/embed-");
      } else if (!directUrl.includes("/embed-") && directUrl.match(/vidmoly\.[a-z]+\/([a-zA-Z0-9]+)/)) {
        const idMatch = directUrl.match(/vidmoly\.[a-z]+\/([a-zA-Z0-9]+)/);
        if (idMatch && idMatch[1]) {
          embedUrl = `https://vidmoly.me/embed-${idMatch[1]}.html`;
        }
      }
      directUrl = embedUrl;
      break;
    }

    case "okru": {
      defaultName = `سيرفر أوكي رو السحابي (${quality})`;
      const match = directUrl.match(/video\/([0-9]+)/);
      if (match && match[1]) {
        embedUrl = `https://ok.ru/videoembed/${match[1]}`;
        directUrl = embedUrl;
      }
      break;
    }

    case "streamtape": {
      defaultName = `سيرفر ستريم تيب (${quality})`;
      if (directUrl.includes("/v/")) {
        embedUrl = directUrl.replace("/v/", "/e/");
      }
      directUrl = embedUrl;
      break;
    }

    case "mp4upload": {
      defaultName = `سيرفر إم بي فور أبلود (${quality})`;
      const match = directUrl.match(/([a-zA-Z0-9]+)\.html/);
      if (match && match[1]) {
        embedUrl = `https://www.mp4upload.com/embed-${match[1]}.html`;
        directUrl = embedUrl;
      }
      break;
    }
  }

  return {
    provider: provider as ServerProvider,
    type,
    defaultName,
    directUrl,
    embedUrl,
    downloadUrl: undefined,
    category: "streaming",
    matrixCategory: "embed",
    quality,
    isDirectPlayable: false,
  };
}
