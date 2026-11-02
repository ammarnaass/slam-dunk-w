/**
 * Cloud Storage & Direct Hosting Providers Resolver
 * Covers: Dropbox, Mega, Google Drive, 4Shared, MediaFire
 */

import {
  ResolvedServerInfo,
  ServerCategory,
  ServerMatrixClassification,
  ServerProvider,
  ServerType,
} from "../types/resolver.types";

export type CloudProvider = "dropbox" | "mega" | "gdrive" | "4shared" | "mediafire";

export function resolveCloudServer(
  provider: CloudProvider,
  rawUrl: string,
  quality: string
): Omit<ResolvedServerInfo, "supportedQualities"> {
  let directUrl = rawUrl;
  let embedUrl = rawUrl;
  let downloadUrl: string | undefined = undefined;
  let type: ServerType = "mp4";
  let defaultName = `سيرفر سحابي (${quality})`;
  let category: ServerCategory = "both";
  let matrixCategory: ServerMatrixClassification = "direct";
  let isDirectPlayable = false;

  switch (provider) {
    case "dropbox": {
      defaultName = `سيرفر دروب بوكس السريع (${quality})`;
      type = "mp4";
      category = "both";
      matrixCategory = "direct";
      isDirectPlayable = true;

      if (directUrl.includes("dropbox.com")) {
        try {
          const parsed = new URL(directUrl);
          parsed.searchParams.delete("dl");
          parsed.searchParams.set("raw", "1");
          directUrl = parsed.toString();
        } catch {
          directUrl = directUrl.replace("?dl=0", "?raw=1").replace("&dl=0", "&raw=1");
          if (!directUrl.includes("raw=1")) {
            directUrl += directUrl.includes("?") ? "&raw=1" : "?raw=1";
          }
        }
        if (directUrl.includes("www.dropbox.com/s/")) {
          directUrl = directUrl.replace("www.dropbox.com/s/", "dl.dropboxusercontent.com/s/");
        }
      }
      embedUrl = directUrl;
      downloadUrl = directUrl.replace("raw=1", "dl=1");
      break;
    }

    case "mega": {
      defaultName = `سيرفر ميجا الخارق (${quality})`;
      type = "mega";
      category = "both";
      matrixCategory = "direct";
      isDirectPlayable = false;

      if (directUrl.includes("/file/")) {
        embedUrl = directUrl.replace("/file/", "/embed/");
      } else if (directUrl.includes("/embed/")) {
        embedUrl = directUrl;
      }
      directUrl = embedUrl;
      downloadUrl = rawUrl;
      break;
    }

    case "gdrive": {
      defaultName = `سيرفر جوجل درايف السحابي (${quality})`;
      category = "both";
      type = "embed";
      matrixCategory = "direct";
      isDirectPlayable = false;

      const match = directUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || directUrl.match(/id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        const fileId = match[1];
        embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        directUrl = embedUrl;
        downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
      break;
    }

    case "4shared": {
      defaultName = `سيرفر فورشيرد المباشر (${quality})`;
      type = "embed";
      category = "both";
      matrixCategory = "direct";
      isDirectPlayable = false;

      const match = directUrl.match(/\/(?:video|file|rar|zip|mp3)\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        embedUrl = `https://www.4shared.com/web/embed/file/${match[1]}`;
        directUrl = embedUrl;
        downloadUrl = rawUrl;
      }
      break;
    }

    case "mediafire": {
      defaultName = `سيرفر ميديا فاير للتحميل السريع (${quality})`;
      type = "mp4";
      category = "download";
      matrixCategory = "download";
      isDirectPlayable = false;
      downloadUrl = directUrl;
      embedUrl = directUrl;
      break;
    }
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
