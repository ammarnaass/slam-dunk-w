import { Character } from '../types';

export const SHOHOKU_HEROES: Character[] = [
  {
    id: 'sakuragi',
    name: 'حسان',
    name_ar: 'حسان',
    number: '10',
    position: 'لاعب ارتكاز (PF)',
    role: 'الملتقط البارع',
    description: 'الملتقط البارع',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBay2pNFvEP6okJNNuEvpHzuEVvNakcGDCWWDAmOvdJZeul6pC3BodMEu14ne2FnDGa8wvKjVIwn8a-xBviRbDCTDIikOPsiNQV3xMoHPvi3khhH8tUs7L1kXpXfsHEKhyqOA-EpQhzNTHooB7zCwa5AXMZoasYDuaB62BZUUPyQjlHygseJsWCuqGNxj5DAmcU5117TQEAXXx19g3yLq-mdUUmDuCAKFi3AJcRogWhiW5RTRWuuvee',
  },
  {
    id: 'rukawa',
    name: 'فادي',
    name_ar: 'فادي',
    number: '11',
    position: 'جناح (SF)',
    role: 'الهداف الأول',
    description: 'الهداف الأول',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBY9Oe4UW-RkjU3Aa1WpIqZ2KHzFPVTRjOM8l0Jw1ZpBbKo-ey_0UNBpITLi2BwPSA511RuCabriVm7fSM_UTJaEPBflekSUUnzliYAQbyWo_qF3qArq3g9KjIPQhS0HKZ0SShpFG7IsfI5SOD5S5xtO8Z38WWSmy4vUba3kal-SCkbh409d_Rz8BegmAQLI5J65IwzSbEevZowgHA3LFcbMBOicIHverACdS2EwKF-8grIdBmgr-qP',
  },
  {
    id: 'akagi',
    name: 'سعد',
    name_ar: 'سعد',
    number: '4',
    position: 'وسط (C)',
    role: 'قائد الفريق',
    description: 'قائد الفريق',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA7sHPlqoJzhro2mLsetVPnN2mlUNGPJHYBrGFuAGKxX7xEJzSF4gntCZ2TWcZ6l9RGFFMhgkKU50sS6uuX2GbRiJ80a8bJE6FLV5oD7d5o9kBJvzJ8DZZYvnRHiZrJta7Xz1hIrywUeAAoDwMfMcc3mxl0FVCFoNbCtrL8xugj9ORnQDa-9Mjav9FLzSrPMv1RfDlVh3HV4joBq8AMebBAHcr7CRf7-R4CUXvLDtgb9NQs3G_XlQxV',
  },
  {
    id: 'miyagi',
    name: 'بدر',
    name_ar: 'بدر',
    number: '7',
    position: 'صانع ألعاب (PG)',
    role: 'البرق السريع',
    description: 'البرق السريع',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCqSFt_4ghEuGAvubvgi9yK1jxXuChE7KsKGa_m4tayq-sZkRwoOOYoffdrVnHubf8LNhZ1rYAUBuothXqqSo6sTwSFy5yo5xWrhBea6g7bBQqjPTHQKfGDKfPtuPrbtxxiCosSPq3PSerB4Rqkwb9GZDl3m5SR4RUnQ6700uvh2QUWhYSlFFUxQvKPn34qZis4qlRFWhC65YMLSBWox_CG3ILF02Y9jt21eMDlrJ7yB99WtG5WturR',
  },
  {
    id: 'mitsui',
    name: 'جواد',
    name_ar: 'جواد',
    number: '14',
    position: 'مدافع مسدد (SG)',
    role: 'قناص الثلاثيات',
    description: 'قناص الثلاثيات',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2L0QzTucO0k5-IEPwNIsk-xSXUXEL1fOvHfj_CPhdJqUUNj-ZifftMoTuKmm4yLCl3llzgmmem6ya3MJRr9Rva6pjpIQoPhwvOjMVJhOa0obXUMer8SarhS09lTUpTrNblMCyj2GZ3Ig43HDZK0XH6ieonmSIA0PwqpJ_qba4kjravri9Z8CEHO63JeQhYgnkyAcpqJQ9O3X4P-D4-PH_pf7f3XqifVRjDmShObANWs1amR-pzMSr',
  },
];

export const QUOTES = [
  { quote: 'الاستسلام يعني نهاية المباراة فوراً!', author: 'المدرب غسان • سلام دانك' },
  { quote: 'الحقيقة دائماً واحدة لا غير!', author: 'سينشي كودو • المحقق كونان' },
  { quote: 'مهما كانت الصعاب، لن أدع أحداً يقف بيني وبين حلمي!', author: 'حسان • سلام دانك' },
  { quote: 'النجاح يتطلب عرق الجبين والتدريب المتواصل.', author: 'فادي • سلام دانك' },
];

export const DEFAULT_HERO_SLIDES = [
  {
    id: 'slam-dunk',
    title: 'سلام دانك',
    description:
      'انضم لمسيرة حسان وفريق الصقور في صراع حماسي مشتعل لتحقيق حلم البطولة الوطنية. النسخة المرممة بأعلى نقاوة صوتية مع الدبلجة الأصلية.',
    coverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuADoYmiTDLVPdOHKHLHfTVj9BY7Iw0sy7y3OWFGA1ORHt4ASRSznKBV0bHA-Rlyn_pITdEJzccIA1hdFTzQRtEhMa-g_ftNQUPVsB6tG85oBpPFjTll019-jvkaqcPELw4K_kq6LQ-oH3GoXBowd9GsNOwrqyagRH42bnjzxLP_p1L39z7xE7MSr-WPLBB3f0PUShVjiGlaaUIYTMF1uig6JdAJ28dsSQ2QmWAAcLGzIvJIXaSIkHW5',
    bannerImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuADoYmiTDLVPdOHKHLHfTVj9BY7Iw0sy7y3OWFGA1ORHt4ASRSznKBV0bHA-Rlyn_pITdEJzccIA1hdFTzQRtEhMa-g_ftNQUPVsB6tG85oBpPFjTll019-jvkaqcPELw4K_kq6LQ-oH3GoXBowd9GsNOwrqyagRH42bnjzxLP_p1L39z7xE7MSr-WPLBB3f0PUShVjiGlaaUIYTMF1uig6JdAJ28dsSQ2QmWAAcLGzIvJIXaSIkHW5',
    rating: 9.4,
    totalEpisodes: 101,
    releaseYear: 1993,
  },
];
