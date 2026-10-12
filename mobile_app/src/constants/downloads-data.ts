export interface DownloadedEpisodeItem {
  id: string;
  title: string;
  series: string;
  seriesId: string;
  episodeNumber: number;
  thumbnail: string;
  sizeMB: number;
  quality: string;
  qualityTag: 'FHD' | 'HD' | 'SD';
  downloadedAt: string;
  watchedPercentage: number;
  timestamp: number;
}

export const INITIAL_DOWNLOADS: DownloadedEpisodeItem[] = [
  // Group 1: Slam Dunk
  {
    id: 'slam-ep-47',
    title: 'الحلقة 47: العزيمة النارية',
    series: 'سلام دانك (Slam Dunk)',
    seriesId: 'slam-dunk',
    episodeNumber: 47,
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuARaixDwClMBk8VjPmR1Q2rUIzdPzwaLu2UN88LAaneAT68-Dt1lyWDu-0gkKtii62D2siPahcfHX4SFVz3C3ign3Ab0TRwZXQSb7CIPBeuWZDXQrKYufhHb07FXgObV8byTeeQEjhmD0JGOHPuJ6crdhM7akhITM1MepDnWa_wDBnvnNco4IYOGt659sF1WSCFyKDMcDNWPrC9fEF1R_xhCvvamv9DhG2ws40iHFKDLtDpbhs8NwJP',
    sizeMB: 340,
    quality: '1080p',
    qualityTag: 'FHD',
    downloadedAt: 'أمس',
    watchedPercentage: 100,
    timestamp: Date.now() - 86400000,
  },
  {
    id: 'slam-ep-48',
    title: 'الحلقة 48: الصراع تحت السلة',
    series: 'سلام دانك (Slam Dunk)',
    seriesId: 'slam-dunk',
    episodeNumber: 48,
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFCBkEUZo8xV4WIupmc5uNpKqdnyHvRtXxO9kMzYTpVkAux1wiez5BMTP4wHyZzuwwVZOg_wpgku3f7SnzUPb-4AGdqIsO36pWFPLcHgbVL64MitADw-y54oNHCZX-4R68Oz9JjSkUHPj2bxQcK1UB22KBS5LnDGWFtCTle9at7MijbCu1PebjShS7NLnq718Qqm3TY2AhyBuHK0i-Pu5wO9kEtxsnSQlwrIRAINlXkAbGKHpT3o3v',
    sizeMB: 335,
    quality: '1080p',
    qualityTag: 'FHD',
    downloadedAt: 'منذ يومين',
    watchedPercentage: 45,
    timestamp: Date.now() - 172800000,
  },
  {
    id: 'slam-ep-49',
    title: 'الحلقة 49: الرمية الحاسمة',
    series: 'سلام دانك (Slam Dunk)',
    seriesId: 'slam-dunk',
    episodeNumber: 49,
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmq2nceLUBxfoOJqYBIc68pDPpefSLxVY7M152CuX1IFOvAxGj2Rpzxp5F0gSr9Y-BCCe6usdJzndy7g6LaB-KJ-OxcCkIZlzk3STd-PC5P66C7xc8q6jnEjHoVG329FisGcXuAgmQrr3_GIOV33yYYRqCVtaAfyqBqZo5cPhodjoVnHmyLZe0S9_WXU_A9aFSXfY6j_doWh4QTJJsde1fCHFuQxJN7NBNo5kvNQnkZOAusJIra160',
    sizeMB: 220,
    quality: '720p',
    qualityTag: 'HD',
    downloadedAt: 'منذ 4 أيام',
    watchedPercentage: 0,
    timestamp: Date.now() - 345600000,
  },
  // Group 2: Detective Conan
  {
    id: 'conan-ep-1120',
    title: 'الحلقة 1120: أسرار المنظمة السوداء',
    series: 'المحقق كونان (Detective Conan)',
    seriesId: 'conan',
    episodeNumber: 1120,
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWgp8np84cU1pXiGfgFONwPbOudYl8mTLiLB82xpMXlPaKPJE-OGVma0ZRcVdaBQPZvdKb_6Uo2gyoTSfUHPOxkO6gdZMGsXK-EIu7ynMnfDwHUw0-CFJgdyTvg3-nMZf1dGTZh20_O9O7fw-nPNJpQbD3NwHGgwyl67y3yKr2OhcKeQtL5lruF0W1xxWpgohfZJn9Y5p5l-xGTpA47CxeaPX4_OaPUHtC4d43WCUOgEVLS3eCu1QT',
    sizeMB: 295,
    quality: '1080p',
    qualityTag: 'FHD',
    downloadedAt: 'منذ 3 أيام',
    watchedPercentage: 0,
    timestamp: Date.now() - 259200000,
  },
  {
    id: 'conan-ep-1121',
    title: 'الحلقة 1121: خطة جين وفودكا',
    series: 'المحقق كونان (Detective Conan)',
    seriesId: 'conan',
    episodeNumber: 1121,
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBkzQwotwlFWKwYMGEDBKpnA8r6Vyk3UuVFIwUBnjh2owad1EJvijv403ATBgE20KHg_w3-hz3rrHcSxUyjhJ9wGS2QUMdJT-Iry8_tAocWKC4b5N-DK-sTcivyCupsi23R0MWxWhw1o8AwIHBU9tWpOT8M443eD6bRn_1lDa2COXFsTWn2BYtqi8wgs-yG38Nek-r31DTq8rvEdRMIerm5Vq0xQPc2zrLjA9HBiYrdd0h3ymV6ln5Q',
    sizeMB: 195,
    quality: '720p',
    qualityTag: 'HD',
    downloadedAt: 'منذ 5 أيام',
    watchedPercentage: 100,
    timestamp: Date.now() - 432000000,
  },
  // Group 3: Hunter x Hunter 1999
  {
    id: 'hxh-ep-62',
    title: 'الحلقة 62: نهاية جزيرة الطمع',
    series: 'القناص (Hunter x Hunter 1999)',
    seriesId: 'hunter-x-hunter',
    episodeNumber: 62,
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCcbCgbaCJ9Sjdse8Sovo5oYwivK5IwbP3-fNT2SFPG2lkLO0zm8Lg-BPLh15TVyG6OvfXxWmusccsHAVs2ZooJfdBy3n7dX7zQO70Baxlc3k2MM_37ytExM4q9jMncv-DA_lvpb9sOa8hcvBxE7_yuFx_nwPRI2-iADoyaJbkHI5MppnFDy_HF6OG6C5_NCZqpCI9J2zznZAp9g8llwP2Mxd046yXnBEK24Orhl65gcQ9Shn2EQ3Rk',
    sizeMB: 290,
    quality: '1080p',
    qualityTag: 'FHD',
    downloadedAt: 'منذ أسبوع',
    watchedPercentage: 80,
    timestamp: Date.now() - 604800000,
  },
];
