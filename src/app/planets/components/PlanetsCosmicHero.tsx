"use client";

import React from "react";
import Link from "next/link";
import { Home, Globe, Sparkles, Compass, Video, Award } from "lucide-react";

interface PlanetsCosmicHeroProps {
  totalWorks?: number;
}

export function PlanetsCosmicHero({ totalWorks = 0 }: PlanetsCosmicHeroProps) {
  return (
    <div className="w-full pt-4 pb-8">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="مسار التنقل"
        className="flex items-center gap-2 text-xs font-tajawal text-[#ac8884] mb-6"
      >
        <Link
          href="/"
          className="hover:text-[#ffb4ab] transition-colors flex items-center gap-1"
        >
          <Home size={14} />
          <span>الرئيسية</span>
        </Link>
        <span className="text-[#353439] font-bold">/</span>
        <span className="text-[#e4e1e7] font-semibold flex items-center gap-1.5">
          <Globe size={14} className="text-[#dc2626]" />
          <span>كواكب الأنمي والتصنيفات</span>
        </span>
      </nav>

      {/* Hero Cosmic Showcase Banner */}
      <div className="relative rounded-3xl bg-[#1b1b1f]/90 border border-white/[0.08] p-6 sm:p-10 overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Living cosmic SVG starfield backdrop */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient cx="60%" cy="40%" id="cosmic-glow" r="50%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0e0e12" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect fill="url(#cosmic-glow)" height="100%" width="100%" />
          <circle cx="15%" cy="20%" fill="#ffffff" opacity="0.6" r="1.5" />
          <circle cx="28%" cy="75%" fill="#ffb4ab" opacity="0.5" r="1.2" />
          <circle cx="45%" cy="30%" fill="#ffb95f" opacity="0.7" r="2" />
          <circle cx="70%" cy="18%" fill="#ffffff" opacity="0.4" r="1" />
          <circle cx="85%" cy="65%" fill="#ffb4ab" opacity="0.8" r="2.2" />
          <circle cx="92%" cy="35%" fill="#ffffff" opacity="0.5" r="1.5" />
          <circle cx="62%" cy="82%" fill="#ffddb8" opacity="0.4" r="1.2" />
          <path
            d="M -50,160 Q 300,40 800,180 T 1700,90"
            fill="none"
            opacity="0.3"
            stroke="#dc2626"
            strokeDasharray="4,8"
            strokeWidth="0.75"
          />
          <path
            d="M 100,240 Q 550,110 1100,220 T 1920,130"
            fill="none"
            opacity="0.25"
            stroke="#ee9800"
            strokeDasharray="2,6"
            strokeWidth="0.5"
          />
        </svg>

        {/* Ambient Top Glow Blobs */}
        <div className="absolute -top-32 right-1/4 w-[500px] h-[300px] bg-[#dc2626]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-20 left-10 w-[400px] h-[250px] bg-[#ee9800]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex-1 max-w-2xl">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#dc2626]/20 border border-[#dc2626]/30 text-[#ffb4ab] font-cairo font-bold text-xs mb-3 backdrop-blur-md">
              <Sparkles size={14} className="text-[#ffb95f]" />
              <span>الرحلة الكونية في فضاء الأنمي</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-cairo text-3xl sm:text-5xl font-black text-[#e4e1e7] tracking-tight mb-3 leading-tight">
              عوالم وكواكب{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dc2626] via-[#ffb95f] to-[#dc2626]">
                ANIME DAZE
              </span>
            </h1>

            {/* Description */}
            <p className="font-tajawal text-sm sm:text-base text-[#ac8884] mb-6 leading-relaxed">
              اختر كوكبك وانطلق في مدار من الحماس اللانهائي. تم إعادة بناء كواكب
              الذكريات الخالدة لجيل الطيبين، ودمجها مع أحدث مسلسلات شونين
              والسينما اليابانية فائقة النقاء.
            </p>

            {/* Quick Stat Bento Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2.5 bg-[#1f1f23]/90 border border-white/[0.06] px-4 py-2.5 rounded-2xl shadow-lg">
                <Globe size={22} className="text-[#dc2626]" />
                <div>
                  <div className="font-cairo text-sm font-black text-[#e4e1e7] leading-none">
                    8 كواكب
                  </div>
                  <div className="font-tajawal text-[11px] text-[#ac8884] mt-0.5">
                    عوالم موضوعية أصيلة
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-[#1f1f23]/90 border border-white/[0.06] px-4 py-2.5 rounded-2xl shadow-lg">
                <Video size={22} className="text-[#ffb95f]" />
                <div>
                  <div className="font-cairo text-sm font-black text-[#e4e1e7] leading-none">
                    {totalWorks > 0 ? `${totalWorks} عمل` : "مكتبة الأنمي"}
                  </div>
                  <div className="font-tajawal text-[11px] text-[#ac8884] mt-0.5">
                    مسلسلات وأعمال متوفرة
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-[#1f1f23]/90 border border-white/[0.06] px-4 py-2.5 rounded-2xl shadow-lg">
                <Award size={22} className="text-[#b9c8de]" />
                <div>
                  <div className="font-cairo text-sm font-black text-[#e4e1e7] leading-none">
                    4K HDR
                  </div>
                  <div className="font-tajawal text-[11px] text-[#ac8884] mt-0.5">
                    أرشيف مرخّص وبدقة فائقة
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Cosmic Compass Illustration */}
          <div className="shrink-0 hidden lg:flex items-center justify-center relative w-72 h-72">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#dc2626]/20 to-[#ee9800]/10 blur-xl animate-pulse" />
            <svg
              className="w-full h-full relative z-10"
              fill="none"
              viewBox="0 0 240 240"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="120"
                cy="120"
                r="105"
                stroke="#ac8884"
                strokeDasharray="6 6"
                strokeOpacity="0.2"
              />
              <circle
                cx="120"
                cy="120"
                r="75"
                stroke="#dc2626"
                strokeOpacity="0.4"
              />
              <circle
                cx="120"
                cy="120"
                r="45"
                stroke="#ee9800"
                strokeDasharray="4 4"
                strokeOpacity="0.3"
              />
              {/* Orbit Nodes */}
              <circle cx="120" cy="15" fill="#dc2626" r="7" />
              <circle cx="195" cy="120" fill="#ee9800" r="5" />
              <circle cx="65" cy="175" fill="#3b82f6" r="6" />
              <circle cx="120" cy="120" fill="#1f1f23" r="30" />
              <circle
                cx="120"
                cy="120"
                fill="#dc2626"
                fillOpacity="0.25"
                r="22"
              />
              <path d="M112 110L132 120L112 130V110Z" fill="#ffdad6" />
            </svg>
            <div className="absolute bottom-2 text-center w-full">
              <span className="font-tajawal text-xs text-[#e4e1e7] bg-[#1f1f23] border border-white/10 px-3 py-1 rounded-full shadow-sm">
                مجرّة المغامرات الكبرى
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
