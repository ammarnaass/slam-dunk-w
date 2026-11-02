export function parseDurationToSeconds(duration?: string): number {
  if (!duration) return 1440;
  const cleaned = duration.replace(/[^0-9:]/g, '');
  const parts = cleaned.split(':').map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 1 && !isNaN(parts[0])) {
    return parts[0] * 60;
  }
  return 1440;
}

export function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getEmbedUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  if (trimmed.includes('mega.nz/file/')) {
    const match = trimmed.match(/mega\.nz\/file\/([^#]+)#(.+)/);
    if (match) return `https://mega.nz/embed/${match[1]}!${match[2]}`;
  }
  if (trimmed.includes('mega.nz/embed/')) {
    return trimmed;
  }
  if (trimmed.includes('4shared.com')) {
    const match = trimmed.match(/4shared\.com\/(?:video|file|rar|zip|mp3)\/([^/]+)/);
    if (match) return `https://www.4shared.com/web/embed/file/${match[1]}`;
  }
  if (trimmed.includes('drive.google.com')) {
    return trimmed.replace('/view', '/preview');
  }
  return trimmed;
}
