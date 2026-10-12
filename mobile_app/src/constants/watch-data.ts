export interface CommentItem {
  id: string;
  userName: string;
  avatar: string;
  isVip: boolean;
  timeAgo: string;
  content: string;
  likes: number;
  isLiked?: boolean;
}

export const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    userName: 'طارق الأسطورة',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDwBLTC5yGIznP0iTZmVobozF5AZhsKyizalhORe4cSb2K9AG6_Xi1ABa5HbAYBvew7oOUIcf_pK9yKLgCTOUI6po_Z22DmdqNCBaHayW-ZfE1QQvrM3bwKaupIK9zTpE-7N7X2ER-Ynm-lUQ_TPqZZkhCde_h30-zdne6MWW01MULxumM8U-xGBXQ5sx2JoGUQjf2J7GjEitt9oxk38kLCjLfzupvSyNuUtIcbNGdbyinvpgSi33Df',
    isVip: true,
    timeAgo: 'منذ 15 دقيقة • سيرفر الصقر',
    content:
      'أداء حسان في هذه اللحظة بالذات يثبت أنه ليس مجرد مبتدئ! صوت مؤدي الدبلجة في الصرخة الأخيرة أعاد ذكريات الطفولة بقوة لا توصف 🔥🏀',
    likes: 42,
  },
  {
    id: 'c2',
    userName: 'ريم الفهد',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA2OsPY2ToyKhKhG8D7ZbaPaYG4D2T7Dv0eEXKU3A0Ex693Ig-zjdxb2-kAf90bXglPiQlYDdhMXDvxjjKfgX10ul-iA3cSikJLgAgolwUszccm1ogl6-3MTkYANxItcjCS9NyTi31FmLKohMg3PhkypD_iLmkAqt0JXaq2biKgLszhuySi5lposOauX3idEdWwQieSxF94qbpkarNk2rQM6Q_BboqvG0Sk9nXxNPmJ6mX9PRQxFDxv',
    isVip: false,
    timeAgo: 'منذ 42 دقيقة',
    content:
      'تمريرة فادي الأخيرة لا يمكن أن تصدق، التكتيك في الشوط الثاني يثبت عبقرية المدرب غسان وسعد تحت السلة!',
    likes: 18,
  },
];

export const SERVERS = [
  { id: 's1', name: 'الصقر السريع 1', desc: 'الأسرع للـ 4K' },
  { id: 's2', name: 'الفهد المباشر 2', desc: 'سلس ومستقر' },
  { id: 's3', name: 'سيرفر بديل 3', desc: 'طوارئ احتياطي' },
];
