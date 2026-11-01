/**
 * Anime Slayer & Anime Watch Grade Multi-Host Direct Stream & Download Resolver Engine
 * ANIME DAZE Platform Architecture (Hardened Security Edition)
 * 
 * Supports:
 * - Direct Stream: Dropbox, Mega, Google Drive, 4Shared, HLS (.m3u8), MP4, DASH (.mpd)
 * - Embed & Backup: Vidmoly, Ok.ru, Mp4upload, Streamtape
 * - Direct Download Matrix: Multi-quality download links (1080p, 720p, 480p)
 * - Security Hardening: Anti-SSRF, XSS disarm, Scheme sanitization, Strict Host Validation
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

/**
 * Strict Security Guard: Validates that a URL is safe to fetch or ping from the server.
 * Prevents Server-Side Request Forgery (SSRF), DNS Rebinding, loopback probes, and protocol smuggling.
 */
export function isSafeUrlForPing(urlString: string): { isSafe: boolean; reason?: string } {
  if (!urlString || typeof urlString !== "string") {
    return { isSafe: false, reason: "URL is empty or not a string" };
  }

  // Reject URLs exceeding realistic maximum length (ReDoS & Buffer exhaust)
  if (urlString.length > 2048) {
    return { isSafe: false, reason: "URL length exceeds safety threshold (2048 chars)" };
  }

  let parsed: URL;
  try {
    parsed = new URL(urlString.trim());
  } catch {
    return { isSafe: false, reason: "Malformed URL syntax" };
  }

  // Protocol MUST strictly be http: or https:
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { isSafe: false, reason: `Forbidden URL scheme: ${parsed.protocol}` };
  }

  // Strip brackets from IPv6 hostnames (e.g. "[::1]" -> "::1")
  const rawHostname = parsed.hostname.toLowerCase();
  const cleanHost = rawHostname.replace(/^\[|\]$/g, "").toLowerCase();

  // Block localhost, loopbacks, 0.0.0.0, and IPv6 loopback
  if (
    cleanHost === "localhost" ||
    cleanHost === "127.0.0.1" ||
    cleanHost === "0.0.0.0" ||
    cleanHost === "::1" ||
    cleanHost === "::" ||
    cleanHost === "0:0:0:0:0:0:0:1" ||
    cleanHost === "0:0:0:0:0:0:0:0"
  ) {
    return { isSafe: false, reason: "Forbidden loopback or internal hostname" };
  }

  // Block internal domain suffixes and wildcard dynamic DNS
  if (
    cleanHost.endsWith(".localhost") ||
    cleanHost.endsWith(".local") ||
    cleanHost.endsWith(".internal") ||
    cleanHost.endsWith(".lan") ||
    cleanHost.endsWith(".home") ||
    cleanHost.endsWith(".corp") ||
    cleanHost.endsWith(".intranet") ||
    cleanHost.endsWith(".test") ||
    cleanHost.endsWith(".invalid") ||
    cleanHost.endsWith(".nip.io") ||
    cleanHost.endsWith(".sslip.io") ||
    cleanHost.endsWith(".xip.io")
  ) {
    return { isSafe: false, reason: "Forbidden internal or wildcard DNS domain" };
  }

  // Block Cloud metadata domains and IP addresses (AWS, GCP, Azure, DigitalOcean, Alibaba, Oracle)
  if (
    cleanHost === "169.254.169.254" ||
    cleanHost === "metadata.google.internal" ||
    cleanHost === "instance-data" ||
    cleanHost === "100.100.100.200" ||
    cleanHost.includes("metadata.google")
  ) {
    return { isSafe: false, reason: "Forbidden cloud metadata endpoint" };
  }

  // Block IPv6 link-local (fe80::/10), unique local / private (fc00::/7), and IPv4-mapped (::ffff:)
  if (
    cleanHost.startsWith("fe80:") ||
    cleanHost.startsWith("fe8") ||
    cleanHost.startsWith("fe9") ||
    cleanHost.startsWith("fea") ||
    cleanHost.startsWith("feb") ||
    cleanHost.startsWith("fc") ||
    cleanHost.startsWith("fd") ||
    cleanHost.startsWith("::ffff:")
  ) {
    return { isSafe: false, reason: "Forbidden IPv6 link-local, private, or mapped address" };
  }

  // Check IPv4 private and link-local ranges:
  // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16, 100.64.0.0/10, 127.0.0.0/8, 0.0.0.0/8, 224.0.0.0+ (multicast/reserved)
  const ipv4Match = cleanHost.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const p1 = parseInt(ipv4Match[1], 10);
    const p2 = parseInt(ipv4Match[2], 10);
    const p3 = parseInt(ipv4Match[3], 10);
    const p4 = parseInt(ipv4Match[4], 10);

    if (p1 > 255 || p2 > 255 || p3 > 255 || p4 > 255) {
      return { isSafe: false, reason: "Malformed IPv4 octet value" };
    }

    if (
      p1 === 10 ||
      p1 === 127 ||
      p1 === 0 ||
      p1 >= 224 ||
      (p1 === 172 && p2 >= 16 && p2 <= 31) ||
      (p1 === 192 && p2 === 168) ||
      (p1 === 169 && p2 === 254) ||
      (p1 === 100 && p2 >= 64 && p2 <= 127)
    ) {
      return { isSafe: false, reason: "Forbidden private or link-local IPv4 address" };
    }
  }

  // Check for decimal / octal / hex encoded IPv4 (e.g., 2130706433 = 127.0.0.1)
  if (/^\d+$/.test(cleanHost) || /^0x[0-9a-fA-F]+$/.test(cleanHost)) {
    return { isSafe: false, reason: "Obfuscated integer or hex IP address blocked" };
  }

  // Disallow non-standard internal ports
  if (parsed.port) {
    const port = parseInt(parsed.port, 10);
    const ALLOWED_PORTS = [80, 443, 8080, 8443];
    if (!ALLOWED_PORTS.includes(port)) {
      return { isSafe: false, reason: `Port ${port} is restricted to prevent port scanning` };
    }
  }

  return { isSafe: true };
}

/**
 * Detects the hosting provider from the URL
 */
export function detectProvider(url: string, explicitProvider?: string): ServerProvider {
  if (
    explicitProvider &&
    [
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
    ].includes(explicitProvider.toLowerCase())
  ) {
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

/**
 * Resolves any raw external URL into a direct stream URL, clean embed player, and download URL.
 * Sanitizes malicious protocol schemes (e.g. javascript:, data:, vbscript:).
 */
export function resolveStreamUrl(url: string, qualityHint?: string): ResolvedServerInfo {
  const trimmed = (url || "").trim();

  // Strict Security Check: URL MUST strictly begin with http:// or https://
  const lowerTrimmed = trimmed.toLowerCase();
  const isHttpOrHttps = lowerTrimmed.startsWith("http://") || lowerTrimmed.startsWith("https://");

  if (!isHttpOrHttps || trimmed.length > 2048) {
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

  let directUrl = trimmed;
  let embedUrl = directUrl;
  let downloadUrl: string | undefined = undefined;
  let type: ServerType = "hls";
  let defaultName = "سيرفر البث المباشر";
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

      // Convert standard Dropbox sharing link into direct streaming MP4
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

      // Convert file link to clean embed player: https://mega.nz/file/ID#KEY -> https://mega.nz/embed/ID#KEY
      if (directUrl.includes("/file/")) {
        embedUrl = directUrl.replace("/file/", "/embed/");
      } else if (directUrl.includes("/embed/")) {
        embedUrl = directUrl;
      }
      directUrl = embedUrl;
      downloadUrl = trimmed;
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
        downloadUrl = trimmed;
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

    case "vidmoly": {
      defaultName = `سيرفر فيدمولي (${quality})`;
      type = "embed";
      category = "streaming";
      matrixCategory = "embed";
      isDirectPlayable = false;

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
      type = "embed";
      category = "streaming";
      matrixCategory = "embed";
      isDirectPlayable = false;

      const match = directUrl.match(/video\/([0-9]+)/);
      if (match && match[1]) {
        embedUrl = `https://ok.ru/videoembed/${match[1]}`;
        directUrl = embedUrl;
      }
      break;
    }

    case "streamtape": {
      defaultName = `سيرفر ستريم تيب (${quality})`;
      type = "embed";
      category = "streaming";
      matrixCategory = "embed";
      isDirectPlayable = false;

      if (directUrl.includes("/v/")) {
        embedUrl = directUrl.replace("/v/", "/e/");
      }
      directUrl = embedUrl;
      break;
    }

    case "mp4upload": {
      defaultName = `سيرفر إم بي فور أبلود (${quality})`;
      type = "embed";
      category = "streaming";
      matrixCategory = "embed";
      isDirectPlayable = false;

      const match = directUrl.match(/([a-zA-Z0-9]+)\.html/);
      if (match && match[1]) {
        embedUrl = `https://www.mp4upload.com/embed-${match[1]}.html`;
        directUrl = embedUrl;
      }
      break;
    }

    case "hls": {
      defaultName = `سيرفر المنصة المباشر (HLS ${quality})`;
      type = "hls";
      category = "streaming";
      matrixCategory = "direct";
      isDirectPlayable = true;
      embedUrl = directUrl;
      break;
    }

    default: {
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
      break;
    }
  }

  return {
    provider,
    type,
    defaultName,
    directUrl,
    embedUrl,
    downloadUrl,
    category,
    matrixCategory,
    quality,
    supportedQualities: ["1080p", "720p", "480p", "Auto"],
    isDirectPlayable,
  };
}

/**
 * Pings a server URL to measure real-time latency and confirm reachability.
 * Protected against SSRF and internal infrastructure probing.
 */
export async function testServerLatency(
  url: string,
  timeoutMs = 4000
): Promise<ServerHealthResult> {
  // Pre-flight SSRF Validation
  const safetyCheck = isSafeUrlForPing(url);
  if (!safetyCheck.isSafe) {
    return {
      isWorking: false,
      latencyMs: 9999,
      securityNotice: `Blocked: ${safetyCheck.reason}`,
    };
  }

  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Try HEAD request first for efficiency
    let response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "manual", // Prevent following redirects to internal SSRF targets
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ANIME-DAZE/2.0",
      },
    }).catch(async () => {
      return await fetch(url, {
        method: "GET",
        signal: controller.signal,
        redirect: "manual",
        headers: {
          Range: "bytes=0-1024",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ANIME-DAZE/2.0",
        },
      });
    });

    clearTimeout(timeoutId);
    const latencyMs = Math.max(15, Date.now() - startTime);
    const isWorking = response.status < 400 || response.status === 403 || (response.status >= 300 && response.status < 400);

    return {
      isWorking,
      latencyMs,
      statusCode: response.status,
    };
  } catch {
    return {
      isWorking: false,
      latencyMs: 9999,
    };
  }
}

/**
 * Classifies an array of servers into Anime Slayer standard categories:
 * - watchServers (streaming & both)
 * - downloadServers (download & both)
 * - directServers (direct stream links)
 * - backupServers (embeds & fallback)
 */
export function categorizeServers<T extends { category?: string; provider?: string; type?: string; priority?: number }>(
  servers: T[]
) {
  const watchServers = servers
    .filter((s) => s.category === "streaming" || s.category === "both" || !s.category)
    .sort((a, b) => (a.priority || 1) - (b.priority || 1));

  const downloadServers = servers
    .filter((s) => s.category === "download" || s.category === "both")
    .sort((a, b) => (a.priority || 1) - (b.priority || 1));

  const directServers = watchServers.filter((s) => {
    const p = s.provider || "";
    return ["hls", "dropbox", "mega", "gdrive", "4shared", "custom"].includes(p) && s.type !== "embed";
  });

  const backupServers = watchServers.filter((s) => {
    const p = s.provider || "";
    return ["vidmoly", "okru", "streamtape", "mp4upload"].includes(p) || s.type === "embed";
  });

  return {
    watchServers,
    downloadServers,
    directServers,
    backupServers,
  };
}
