/**
 * Server Matrix Categorization Engine
 * Classifies an array of servers into Anime Slayer standard categories:
 * - watchServers (streaming & both)
 * - downloadServers (download & both)
 * - directServers (direct stream links)
 * - backupServers (embeds & fallback)
 */

export function categorizeServers<
  T extends { category?: string; provider?: string; type?: string; priority?: number }
>(servers: T[]) {
  const watchServers = servers
    .filter((s) => s.category === "streaming" || s.category === "both" || !s.category)
    .sort((a, b) => (a.priority || 1) - (b.priority || 1));

  const downloadServers = servers
    .filter((s) => s.category === "download" || s.category === "both")
    .sort((a, b) => (a.priority || 1) - (b.priority || 1));

  const directServers = watchServers.filter((s) => {
    const p = s.provider || "";
    return (
      ["hls", "dropbox", "mega", "gdrive", "4shared", "custom"].includes(p) &&
      s.type !== "embed"
    );
  });

  const backupServers = watchServers.filter((s) => {
    const p = s.provider || "";
    return (
      ["vidmoly", "okru", "streamtape", "mp4upload"].includes(p) ||
      s.type === "embed"
    );
  });

  return {
    watchServers,
    downloadServers,
    directServers,
    backupServers,
  };
}
