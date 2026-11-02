/**
 * Security Constants for SSRF and Protocol Disarming Protection
 */

export const MAX_URL_LENGTH = 2048;

export const ALLOWED_PORTS = [80, 443, 8080, 8443];

export const FORBIDDEN_LOOPBACKS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "::",
  "0:0:0:0:0:0:0:1",
  "0:0:0:0:0:0:0:0",
]);

export const FORBIDDEN_DOMAIN_SUFFIXES = [
  ".localhost",
  ".local",
  ".internal",
  ".lan",
  ".home",
  ".corp",
  ".intranet",
  ".test",
  ".invalid",
  ".nip.io",
  ".sslip.io",
  ".xip.io",
];

export const CLOUD_METADATA_HOSTS = [
  "169.254.169.254",
  "metadata.google.internal",
  "instance-data",
  "100.100.100.200",
];

export const IPV6_FORBIDDEN_PREFIXES = [
  "fe80:",
  "fe8",
  "fe9",
  "fea",
  "feb",
  "fc",
  "fd",
  "::ffff:",
];
