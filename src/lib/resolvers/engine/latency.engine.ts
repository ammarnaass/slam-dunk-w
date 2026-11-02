/**
 * Server Latency & Health Diagnostic Engine
 * Anti-SSRF and internal infrastructure probing protected
 */

import { isSafeUrlForPing } from "../security/ssrf.guard";
import { ServerHealthResult } from "../types/resolver.types";

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
    const isWorking =
      response.status < 400 ||
      response.status === 403 ||
      (response.status >= 300 && response.status < 400);

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
