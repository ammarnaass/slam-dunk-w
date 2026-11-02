/**
 * Anime Slayer & Anime Watch Grade Multi-Host Multi-Server Resolver Engine
 * Modular Architecture Edition (ANIME DAZE Ecosystem)
 * 
 * Supports:
 * - Direct Stream: Dropbox, Mega, Google Drive, 4Shared, HLS (.m3u8), MP4, DASH (.mpd)
 * - Embed & Backup: Vidmoly, Ok.ru, Mp4upload, Streamtape
 * - Direct Download Matrix: Multi-quality download links (1080p, 720p, 480p)
 * - Security Hardening: Anti-SSRF, XSS disarm, Scheme sanitization, Strict Host Validation
 */

// Types
export * from "./types/resolver.types";

// Security Guards
export { isSafeUrlForPing } from "./security/ssrf.guard";

// Provider Detection
export { detectProvider } from "./detection/provider.detect";

// Resolution Engine
export { resolveStreamUrl } from "./engine/resolve.engine";

// Latency & Health
export { testServerLatency } from "./engine/latency.engine";

// Matrix Categorization
export { categorizeServers } from "./engine/categorize.engine";
