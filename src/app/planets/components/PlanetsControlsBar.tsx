"use client";

import React from "react";
import { Search, SlidersHorizontal, Orbit } from "lucide-react";

interface PlanetsControlsBarProps {
  activePlanetName: string;
  worksCount: number;
  activeFilterChip: string;
  onSelectFilterChip: (chip: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  sortBy: "popular" | "rating" | "latest" | "episodes";
  onSortByChange: (sort: "popular" | "rating" | "latest" | "episodes") => void;
}

const FILTER_CHIPS = [
  { id: "all", label: "الكل" },
  { id: "popular", label: "الأكثر مشاهدة" },
  { id: "top_rated", label: "تقييم +8.5" },
  { id: "dubbed", label: "دبلجة عربية" },
  { id: "completed", label: "مكتمل" },
];

export function PlanetsControlsBar({
  activePlanetName,
  worksCount,
  activeFilterChip,
  onSelectFilterChip,
  searchQuery,
  onSearchQueryChange,
  sortBy,
  onSortByChange,
}: PlanetsControlsBarProps) {
  return (
    <div className="w-full pb-8">
      <div className="rounded-2xl bg-[#1f1f23] border border-white/[0.08] p-4 sm:p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Active Orbit Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#dc2626]/20 border border-[#dc2626]/30 flex items-center justify-center text-[#ffb4ab] shrink-0">
            <Orbit size={24} className="animate-spin-slow text-[#dc2626]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cairo text-base sm:text-lg font-black text-[#e4e1e7]">
                أنت الآن في مدار: {activePlanetName}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#dc2626] text-white font-cairo font-bold text-[10px]">
                نشط
              </span>
            </div>
            <p className="font-tajawal text-xs text-[#ac8884] mt-0.5">
              عرض {worksCount} عملاً متجدداً باستمرار • تم التحديث اليوم
            </p>
          </div>
        </div>

        {/* Controls: Search + Filter Chips + Sort */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ac8884] pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="ابحث في هذا الكوكب..."
              className="w-full bg-[#1b1b1f] border border-white/10 rounded-xl pr-9 pl-4 py-2 text-xs font-tajawal text-[#e4e1e7] placeholder:text-[#ac8884]/60 focus:outline-none focus:ring-1 focus:ring-[#dc2626]"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {FILTER_CHIPS.map((chip) => {
              const isSelected = activeFilterChip === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => onSelectFilterChip(chip.id)}
                  className={`px-3 py-1.5 rounded-lg font-cairo font-bold text-xs transition-colors shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-[#dc2626] text-white shadow-md"
                      : "bg-[#2a292e] text-[#ac8884] hover:text-white"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          {/* Sort Menu */}
          <div className="flex items-center gap-2 bg-[#2a292e] px-3 py-1.5 rounded-lg border border-white/[0.05]">
            <SlidersHorizontal size={14} className="text-[#ac8884]" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as any)}
              className="bg-transparent text-xs font-tajawal font-bold text-[#e4e1e7] border-0 outline-none cursor-pointer"
            >
              <option value="popular" className="bg-[#1f1f23] text-white">
                الأكثر شعبية
              </option>
              <option value="latest" className="bg-[#1f1f23] text-white">
                الأحدث إضافة
              </option>
              <option value="rating" className="bg-[#1f1f23] text-white">
                الأعلى تقييماً
              </option>
              <option value="episodes" className="bg-[#1f1f23] text-white">
                عدد الحلقات
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
