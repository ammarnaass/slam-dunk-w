/**
 * Strict Security Guard: Validates that a URL is safe to fetch or ping from the server.
 * Prevents Server-Side Request Forgery (SSRF), DNS Rebinding, loopback probes, and protocol smuggling.
 */

import { SecurityCheckResult } from "../types/resolver.types";
import {
  MAX_URL_LENGTH,
  ALLOWED_PORTS,
  FORBIDDEN_LOOPBACKS,
  FORBIDDEN_DOMAIN_SUFFIXES,
  CLOUD_METADATA_HOSTS,
  IPV6_FORBIDDEN_PREFIXES,
} from "./ssrf.constants";

export function isSafeUrlForPing(urlString: string): SecurityCheckResult {
  if (!urlString || typeof urlString !== "string") {
    return { isSafe: false, reason: "URL is empty or not a string" };
  }

  // Reject URLs exceeding realistic maximum length (ReDoS & Buffer exhaust)
  if (urlString.length > MAX_URL_LENGTH) {
    return { isSafe: false, reason: `URL length exceeds safety threshold (${MAX_URL_LENGTH} chars)` };
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
  if (FORBIDDEN_LOOPBACKS.has(cleanHost)) {
    return { isSafe: false, reason: "Forbidden loopback or internal hostname" };
  }

  // Block internal domain suffixes and wildcard dynamic DNS
  for (const suffix of FORBIDDEN_DOMAIN_SUFFIXES) {
    if (cleanHost.endsWith(suffix)) {
      return { isSafe: false, reason: "Forbidden internal or wildcard DNS domain" };
    }
  }

  // Block Cloud metadata domains and IP addresses (AWS, GCP, Azure, DigitalOcean, etc.)
  for (const metadataHost of CLOUD_METADATA_HOSTS) {
    if (cleanHost === metadataHost) {
      return { isSafe: false, reason: "Forbidden cloud metadata endpoint" };
    }
  }
  if (cleanHost.includes("metadata.google")) {
    return { isSafe: false, reason: "Forbidden cloud metadata endpoint" };
  }

  // Block IPv6 link-local (fe80::/10), unique local / private (fc00::/7), and IPv4-mapped (::ffff:)
  for (const prefix of IPV6_FORBIDDEN_PREFIXES) {
    if (cleanHost.startsWith(prefix)) {
      return { isSafe: false, reason: "Forbidden IPv6 link-local, private, or mapped address" };
    }
  }

  // Check IPv4 private and link-local ranges
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
    if (!ALLOWED_PORTS.includes(port)) {
      return { isSafe: false, reason: `Port ${port} is restricted to prevent port scanning` };
    }
  }

  return { isSafe: true };
}
