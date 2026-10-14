import { IconName } from '../components/Icon';

export interface GenreOption {
  id: string;
  label: string;
}

export interface AudioOption {
  id: string;
  label: string;
  tag?: string;
}

export interface QualityOption {
  id: string;
  label: string;
  sub: string;
  isVip: boolean;
}

export interface EraOption {
  id: string;
  label: string;
}

export interface SortOption {
  id: string;
  label: string;
  icon: IconName;
}

export interface StatusOption {
  id: string;
  label: string;
}

export const GENRE_OPTIONS: GenreOption[] = [
  { id: 'sports', label: 'رياضي وحماسي 🏀' },
  { id: 'mystery', label: 'غموض وتحقيق 🔍' },
  { id: 'shonen', label: 'شونين وقتال ⚔️' },
  { id: 'adventure', label: 'مغامرات ورحلات 🧭' },
  { id: 'comedy', label: 'كوميديا وطرائف 😂' },
  { id: 'scifi', label: 'خيال علمي وميكا 🚀' },
  { id: 'drama', label: 'دراما وإنساني 🎭' },
  { id: 'classics', label: 'كلاسيكيات الجيل الذهبي 📼' },
];

export const AUDIO_OPTIONS: AudioOption[] = [
  { id: 'dub_spacetoon', label: 'دبلجة مركز الزهرة / سبيستون', tag: 'كلاسيك' },
  { id: 'all', label: 'الكل' },
  { id: 'dub_original', label: 'دبلجة أصلية دون حذف' },
  { id: 'sub', label: 'مترجم عربي (الصوت الياباني)' },
  { id: 'surround', label: 'صوت محيطي 5.1' },
];

export const QUALITY_OPTIONS: QualityOption[] = [
  { id: '1080p', label: '1080p FHD', sub: 'عالية الدقة القياسية', isVip: false },
  { id: '4k', label: '4K UHD', sub: 'فائقة النقاء', isVip: true },
  { id: 'hd_remaster', label: 'HD Remaster', sub: 'معالجة 60 إطاراً', isVip: false },
  { id: 'sd_classic', label: 'SD TV كلاسيك', sub: 'شاشات 4:3 العتيقة', isVip: false },
];

export const ERA_OPTIONS: EraOption[] = [
  { id: 'all', label: 'الكل' },
  { id: 'golden', label: 'الجيل الذهبي (1990 - 1999) 🔥' },
  { id: 'eighties', label: 'الثمانينات كلاسيك' },
  { id: 'modern', label: '2000 - 2015' },
];

export const SORT_OPTIONS: SortOption[] = [
  { id: 'top_rated', label: 'الأعلى تقييماً (9.0+)', icon: 'hotel_class' },
  { id: 'popular', label: 'الأكثر مشاهدة وشعبية', icon: 'local_fire_department' },
  { id: 'recent', label: 'المضاف حديثاً', icon: 'schedule' },
  { id: 'alpha', label: 'أبجدياً (أ - ي)', icon: 'sort' },
];

export const STATUS_OPTIONS: StatusOption[] = [
  { id: 'all', label: 'الكل' },
  { id: 'completed', label: 'مكتمل (كل الحلقات)' },
  { id: 'ongoing', label: 'مستمر حالياً' },
];
