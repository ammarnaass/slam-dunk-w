export interface StitchPlanetItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  worksCount: string;
  iconName: string;
  badge: string;
  colorTheme: {
    accent: string;
    bgBadge: string;
    glow: string;
    borderActive: string;
  };
  previewAvatars: string[];
}

export const STITCH_PLANETS: StitchPlanetItem[] = [
  {
    id: "action",
    name: "كوكب الأكشن",
    subtitle: "شونين • معارك • قتال ملحمي",
    description: "حرارة السيوف ونار النينجا وصراعات العمالقة، بطولات لا تعرف الاستسلام.",
    worksCount: "🔥 485 عملاً",
    iconName: "Swords",
    badge: "⚔️",
    colorTheme: {
      accent: "text-[#ffb4ab]",
      bgBadge: "bg-[#dc2626]/20 text-[#ffb4ab]",
      glow: "rgba(220, 38, 38, 0.35)",
      borderActive: "border-[#dc2626]",
    },
    previewAvatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAW1Ti45qxNHUHGSdtrUpARLfpsOKAsdYua_OszEMb9qOTtqXuj7V1aWnBL9zrkWnE0dVzUjFYf2-SE6htnc04CY4G38e0ybLUOYviyWXd2zuW3T-vHCWFpQ7pfDvMAcjE3mSRhj9CCGcClyHdmK1g1mF9_tPAyr5yOSmKrY09zWqqC5scKqQiAyETQyxSB_qHddlGid84UMwApkt0QbRGKYp9UMI2-Zidzi_J_HDG56t7zg4j70WkA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDfe4c9QTrDEesSXdf-gi3XdRg3Iyg0DiJYsv0CbkhbsW8Mngt5huXV6tmsSEGyZS78QymxVR5_W7MIXmvQryU_WVyptPKKElq5ppzvJbG_YgnsFUAOLQX9v1XwWAMdFgXK0pyTCMDPi_Qiu2V5MBIKKtLYxPIOE-9-fmYBpzPlvYXwMWn61V9E2mNxaMgIKLs_ts9cBo91RPptFP4dN7XLdNmrIeLRSCQ9BJ6ChGnzTPg9tfD-AStb",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYMb4LIbUNBiEEEdQAK8gOsC8WCvAS6_O8PRxefuG2G8SUbeMHhEJoQTRgiWO6q8c-KYNnHso1DeSNhh-6lnajcivSD2LivSYNaZ8LM7_2adoZS9OW317gGakW7y3Fp1eoqPtUAoQX62Xojj2cEdTAyXF6bUfnTcAdPUzqO3R4EkmWoYXeYpxWzMRDJ4uYkPWtkNvQrsW8rYVY8e_GoEqhoeC6LdS_ToX5t6dEv0zeGdN3cZf-TeiG",
    ],
  },
  {
    id: "adventure",
    name: "كوكب المغامرات",
    subtitle: "أساطير • بحار • جزر مجهولة",
    description: "الإبحار نحو أقاصي الجزر الخيالية وكنوز القراصنة وعوالم الفانتازيا الشاسعة.",
    worksCount: "🧭 392 عملاً",
    iconName: "Compass",
    badge: "🚀",
    colorTheme: {
      accent: "text-blue-400",
      bgBadge: "bg-blue-500/20 text-blue-300",
      glow: "rgba(59, 130, 246, 0.35)",
      borderActive: "border-blue-500",
    },
    previewAvatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAY4OGxgVyVfZ7N4TcK2YlMNXw3OT9lZFwpnrDaVaZ2v6zfJcrYNPuR40aZDZFo_xAU3cs2Ns2B1BBop_n1xEqPT9l7l8ycy9AEhbelkcQm57kg63WlqKsTEpG8LliPSVyYDeCPFvD1J33N8WlF715mSXaH_GFDb2U0xfpsREFghenGnKpHuVHmTbCR57gX4ZKlRnutR68S_ybpnEyov3FFvNfMWxk6wfuQTrMw4KoGUqMI8Arzx1y_",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1KJlebNThQr8eBtItu9K_B5yTvWPWvBP7jkQFigB1pyO0_4JaUPmIZKiI4S9JSQQ4bAtQf1UTce-CQFsZv3e8EBUYlwBa2_2W6bULflOsGzR5am2_phORQqX5HUawmj_8srMewk9cavNXzUJ7R8f9mJpB4QLY_cqKGUx3Cxs_Thakb7-5B-W2WSPKG9ErSiF_yEObJE-98YOD66BhqIfhsqkn9K0fOHK2wMklx73fZu_0kIOCsR2m",
    ],
  },
  {
    id: "comedy",
    name: "كوكب الكوميديا",
    subtitle: "ضحك • شريحة من الحياة • هبال",
    description: "مواقف يومية طريفة وشخصيات غريبة الأطوار لجرعات لا تتوقف من الضحك والبهجة.",
    worksCount: "😂 280 عملاً",
    iconName: "Smile",
    badge: "😄",
    colorTheme: {
      accent: "text-[#ffb95f]",
      bgBadge: "bg-[#ee9800]/20 text-[#ffb95f]",
      glow: "rgba(238, 152, 0, 0.35)",
      borderActive: "border-[#ee9800]",
    },
    previewAvatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXZpmV6Fjtw9xLAg0w2oQTUxg5E_XlfNcRJU49Ahen7CVzjwh3FhdOfXCcKgFB6-LTCouoTgChOBtL6FBq-Ur5JakLu5_tkZBC-BC3O9oGmFEut7wCw0wAr7fwZelGjszJE2CZWpu3vJHl4QOwQnpxX1OWEjw80Tgbn6bYSU8Inlxwr2wODvLIAtOPKJeqH0XqvbIeyPPgKCT1IKUswsIcwSr0c_4ch2fTBsvjQRNCWJf_o_Ssxlf4",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDRxzo0WnUo5uo8WVDTtuUCdVuN5bNwZOEtTa5_Xgvg_qqyffF-bxi7_kUweOAOGQ9FuxQciN4U-UW3QPTqThHRKTgZ0cOZDr9oJYx5wpS9MFoj4ilNlvCB9M5ARYV3cKA_sbYjBsw10ykpM15mamst1_y50QdB0zI4owFMnkn5E3CHICnWHB38CGNhingqL9mJKAHvDlDh0tJ2rs-rPXbZvkjj2BSMK7vdLBwtao_74VcESEj-XA7z",
    ],
  },
  {
    id: "emerald",
    name: "كوكب الزمرد",
    subtitle: "شوجو • دراما راقية • صداقة نقية",
    description: "كوكب الفتيات والروايات الرقيقة، بطولات نسائية ملهمة ومشاعر الصداقة الأخوية.",
    worksCount: "✨ 315 عملاً",
    iconName: "Diamond",
    badge: "💎",
    colorTheme: {
      accent: "text-emerald-400",
      bgBadge: "bg-emerald-500/20 text-emerald-300",
      glow: "rgba(16, 185, 129, 0.35)",
      borderActive: "border-emerald-500",
    },
    previewAvatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYpok49oITFvVrIngeJoySmL-F5IK5cqiQ0Nc_2ZPOeJ1Duht1q3LUmC_YJz7RKcglJ7sdoSvFrElkCp4kJ0rurtN7KsBZ2EfzP1coWo0KFziTSV-kqjYLoX_4Mb29oj78uUoSKzgiHdrQL0E-JtXMy-SdJ_qzQNk6i3rc7ZMJi6B-khMNbwj8ThcHwXgKSQhixVACF66KSPj5Uk1uuV3PToCeXXpqpYiL3JhjZ_3Mt1EAc1QLRdZT",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBaKBcMVZyv85-T2Bw6ZislVAKGR_3fpdLVmdyow4VtotWfwAxa1-Bkd-auhi0Wwd2BqcjTRz4QzTGFiIiO0WxiFP245qH1dRMkM-cRYoqFnHq19kDJR1HvLwSTIZoZiJdQsBybPXQE2Ij9hWz5vMtfpOMIcNhukW2fbF73MWBUB1A2UNwzki2R5b7bcDyy_zP14qYx7H68LOyaPUi7agMakFSJfm27fn2V0veEPVortLizFiOq7BZd",
    ],
  },
  {
    id: "sports",
    name: "كوكب الرياضة",
    subtitle: "عزيمة • بطولات • كرة وسرعة",
    description: "صافرة البداية، دموع الخسارة ولذة الانتصار المستحق في ملاعب كرة القدم والسلة.",
    worksCount: "⚽ 194 عملاً",
    iconName: "Flame",
    badge: "🏀",
    colorTheme: {
      accent: "text-amber-500",
      bgBadge: "bg-amber-600/20 text-amber-300",
      glow: "rgba(245, 158, 11, 0.35)",
      borderActive: "border-amber-500",
    },
    previewAvatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWQzkwojb8LS6kdBm0fg2P6Nqd4hWbIUP5WyUchUsk4UQJjoecU8v4Up6opymJzQDUTCcRevvvoJtjGUcbWYzbOYLZDy-L_-y8nU50X_Ab5kvZ7-LoX-CQ-Zeib77h10JhEuNQHjsOhdkP-9pbPfe5Swdu2haahf9r2RQix7S-dP9PjPdtaSGgMYH6OFPknaAjhtZ7kgbP1ucEL1x1ysLqoDZ3xOcSDmHM4uaja3Yji_v62U2kqkri",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAPlnlOyrvoXUpfSwcs6yIdHwHeMpI6dxL5AwxWIP1X_C6uLJmKEMXp3_j7oNvdrFTQ1Mrlq01yNOHf8zEd11rNfvLYvcwigISnkYc96MaS7nPQR9IDSHVue2uGlJetihokeMnA6GmSmrTzx1Sta56ve_SzQ05aDheFk9_wcBAaD3geoyYqt-juPtCUIq7XcV2gUTkbbErxWWSbDODb-IlPFgFT7BRAVC9I5hAQxFWrA_xgM2H_RFsK",
    ],
  },
  {
    id: "mystery",
    name: "كوكب الغموض",
    subtitle: "تحقيق • ذكاء • ألغاز بوليسية",
    description: "جرائم معقدة، شفرات غامضة، وحرب عقول شرسة لا يكشف الحقيقة فيها إلا العباقرة.",
    worksCount: "🔍 248 عملاً",
    iconName: "Eye",
    badge: "🕵️",
    colorTheme: {
      accent: "text-purple-400",
      bgBadge: "bg-purple-500/20 text-purple-300",
      glow: "rgba(168, 85, 247, 0.35)",
      borderActive: "border-purple-500",
    },
    previewAvatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDOarnphGOjsJAp3QLN-cskQjiA45uoiegign-jqin3BopAhVGLjXMRMSYdKPVAvoFo044qo9clwFx4t3nJq-1KtlMe6FFp5TmPcA-_2tN3-Bh5tWwv7i1dbmmfMhI-0gxSWWSP9V2cnrYIrJJAmj47HhOMrmDIWu_0LNGkjQ7XS0G23FpBB4hIEAdbZr7OSzPR76Ix3sONn3G6wh6U2N-DsdDew3xOxEdmoYMnV6g6CyKyTV_G0mJC",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA5vi4VpkRVLReeCdbMw5rMOJ3sIaD_GeLNvzmheiIVGHFaFYtw0MnAPp99CiRBe1TpfthelzJErWjvTQOGsZ3VJp3MrFlYFEY0Z_pGAskT0CRjYR4JbxdSeciB8_BUZCZjNZYX0YJ3kvJD6sqasOhtgw5LyK7dCOWsNoZZZt7yZj9FKfs2ClChqQkRA8BIyrY4B_2v1GaiBVM_2a0vjznwF6cx0DKLizRDIHPEf1gMSmVXbw3SlSxQ",
    ],
  },
  {
    id: "scifi",
    name: "كوكب الخيال العلمي",
    subtitle: "سايبربانك • روبوتات عملاقة • فضاء",
    description: "مستقبل النيون البعيد، آليات الميكا الحربية وسباق السفر عبر النجوم المظلمة.",
    worksCount: "🤖 220 عملاً",
    iconName: "Bot",
    badge: "🔬",
    colorTheme: {
      accent: "text-cyan-400",
      bgBadge: "bg-cyan-500/20 text-cyan-300",
      glow: "rgba(6, 182, 212, 0.35)",
      borderActive: "border-cyan-500",
    },
    previewAvatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_jrAfGdMU2zAslmTpGsx_FDMhRqy2z0DtfIGsuPMktvpaMvqLnmngRgxkd-pD8SFQvQL601aiRRZiDAO1jLgis1jvrg-qRjgCEY-n-vOQGXih7ZJCYY3VcDiFpVJ4hydJ3Cq4P-zJQj0PNt8BzDYXGAoopizw3qG9YDWFxH7fwiZn_WHwvjeTGor9Biflg6qZoENGDUmN6imBJIniA294b2o2TjuoNxLXOKomoUlmsUIAXKlV6l7u",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBtxQtkIOmikx9ik9KxVt77Apv92_DtK0K1U6C2fBXCty2fisNaJPCuSRZ7VOuLIXFj_SuVNDv8e-vcaFx2-mjXb57y5JT6GRTLGxUNW04TUR5bCHEQVeCInS6MsfWsLMGiohX_hxbofZJsEe3SFrFte0V-7_1CEzyopr7vnX-va_BKUJQb5j2uLRqSQc-vLVc_qkFgaEhYFRB7WjOSdThEQQpa5DzIi2krHC2npix82tn65sqXghDk",
    ],
  },
  {
    id: "classics",
    name: "أرشيف الزهرة الذهبي",
    subtitle: "دبلجة عربية خالدة • نوستالجيا",
    description: "درر الزمن الجميل المدبلجة بأصوات نخبة فناني مركز الزهرة، بتقنية 4K المرممة.",
    worksCount: "📼 520 عملاً مرمماً",
    iconName: "Clapperboard",
    badge: "🎬",
    colorTheme: {
      accent: "text-amber-400",
      bgBadge: "bg-amber-400/20 text-amber-300",
      glow: "rgba(251, 191, 36, 0.35)",
      borderActive: "border-amber-400",
    },
    previewAvatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBg_DeTNTRtc3vseCFMv_rFr2Wdq2EAbYdL_MgCSZxy-sGpa5KLkGe9_8AUp7TrQkKPY8--m1LGn3KDmM2mpGeqWjOTi3xymDDJ_jhLI9vg9Z2SNueXmr1BElxFyTAm3JGy2Yo_tLrvLCjg1-sSPqg7DdWvuHw5LuP25Hq_dW4hel3iIzM0-rqxIrJ_XOsY6kci83bER_KCVbPAuSY0ox8v9fNDte3d-9S2w0a0zQjFsNsXQ0jo3S-L",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOz7cCTTQCCpvz6XW7bCewBpW_4_rcd5_YkNJJ9p9UKRJLHdfIfI36SOQHogFTdadXZZwlJnCABWjRwd9J1z84fWUvaXpnmaVW7bJVLeF3jPeLhcLkul7A0GRsBv10FeU-x0IpDniUiEksFp3eLCaP0MvGZkAVfG4lx9HbOgZOZd2lkWXndY9rZNMK1Le9Bj4htfcnRCwN42zlx-qRXF4ocvW-J7F10iCPmio1WMsflojAForJAX2O",
    ],
  },
];

export const TROPES_PRESETS = [
  { id: "isekai", label: "🌀 إيسيكاي (عالم موازي)", count: 184, query: "إيسيكاي" },
  { id: "samurai", label: "⚔️ فنون قتالية وساموراي", count: 210, query: "ساموراي" },
  { id: "spacetoon", label: "🎙️ دبلجة سبيستون الفصحى", count: 320, query: "دبلجة" },
  { id: "time_travel", label: "⏳ سفر عبر الزمن وتراجع", count: 76, query: "زمن" },
  { id: "mind_games", label: "🧠 ألعاب ذهنية وعباقرة", count: 95, query: "ذكاء" },
  { id: "apocalypse", label: "☣️ نهاية العالم وبقاء", count: 112, query: "بقاء" },
  { id: "superpowers", label: "✨ قوى خارقة ومدارس سحر", count: 240, query: "سحر" },
  { id: "sports_fire", label: "🏀 بطولات ورياضة حماسية", count: 194, query: "سلة" },
  { id: "mecha", label: "🤖 ميكا وروبوتات عملاقة", count: 88, query: "ميكا" },
  { id: "detective", label: "🕵️ تحقيقات وجرائم بوليسية", count: 165, query: "كونان" },
];
