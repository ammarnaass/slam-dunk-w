"use client";

import React from "react";
import { Tag } from "lucide-react";
import { TROPES_PRESETS } from "./planets-stitch-data";

interface PlanetsTropesCloudProps {
  activeTropeQuery: string;
  onSelectTrope: (query: string) => void;
  animes?: import("@/types").Anime[];
}

export function PlanetsTropesCloud({
  activeTropeQuery,
  onSelectTrope,
  animes = [],
}: PlanetsTropesCloudProps) {
  // Compute real match count from actual site animes
  const tropeCounts = React.useMemo(() => {
    const map: Record<string, number> = {};
    if (!animes || animes.length === 0) return map;

    for (const trope of TROPES_PRESETS) {
      const q = trope.query.toLowerCase();
      const count = animes.filter((a) => {
        const inTitle = a.title?.toLowerCase().includes(q);
        const inDesc = a.description?.toLowerCase().includes(q);
        const inGenres = a.genres && a.genres.some((g) => g.toLowerCase().includes(q));
        return inTitle || inDesc || inGenres;
      }).length;
      map[trope.id] = count;
    }
    return map;
  }, [animes]);

  return (
    <div className="w-full pb-16">
      <div className="rounded-3xl bg-[#1b1b1f] border border-white/[0.08] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#dc2626]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-[#ffb4ab] font-cairo font-bold text-xs mb-1">
              <Tag size={14} className="text-[#dc2626]" />
              <span>التصنيفات الميكرو والأنماط السردية</span>
            </div>
            <h3 className="font-cairo text-xl sm:text-2xl font-black text-[#e4e1e7]">
              تصفح بالوسوم الدقيقة والحبكات (Tropes)
            </h3>
            <p className="font-tajawal text-xs sm:text-sm text-[#ac8884] mt-0.5">
              هل تبحث عن فكرة معينة بالتحديد؟ انقر على أي وسم لفلترة المكتبة فوراً
            </p>
          </div>

          <span className="font-cairo text-xs font-bold text-[#e4e1e7] bg-[#2a292e] px-4 py-1.5 rounded-full shrink-0 border border-white/5">
            {TROPES_PRESETS.length} تصنيف ميكرو وحبكة
          </span>
        </div>

        {/* Interactive Tag Pills Cloud */}
        <div className="flex flex-wrap items-center gap-2.5">
          {TROPES_PRESETS.map((trope) => {
            const isSelected = activeTropeQuery === trope.query;
            const realCount = tropeCounts[trope.id] ?? 0;

            return (
              <button
                key={trope.id}
                type="button"
                onClick={() => onSelectTrope(isSelected ? "" : trope.query)}
                className={`px-4 py-2 rounded-xl font-tajawal text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-[#dc2626] text-white shadow-lg shadow-[#dc2626]/30 scale-105"
                    : "bg-[#2a292e] text-[#e4e1e7] hover:bg-[#353439] hover:text-white border border-white/5"
                }`}
              >
                <span>{trope.label}</span>
                {realCount > 0 && (
                  <span
                    className={`text-[10px] ${
                      isSelected ? "text-white/80" : "text-[#ac8884]"
                    }`}
                  >
                    ({realCount})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
