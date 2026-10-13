"use client";

import React from "react";
import Image from "next/image";
import {
  Swords,
  Compass,
  Smile,
  Diamond,
  Flame,
  Eye,
  Bot,
  Clapperboard,
  Sparkles,
} from "lucide-react";
import { STITCH_PLANETS, StitchPlanetItem } from "./planets-stitch-data";
import { Anime } from "@/types";

interface PlanetsMatrixGridProps {
  selectedPlanetId: string;
  onSelectPlanet: (id: string) => void;
  animes?: Anime[];
}

const PLANET_KEYWORD_MAP: Record<string, { arabic: string; genres: string[] }> = {
  action: { arabic: "أكشن", genres: ["action", "أكشن", "shounen", "شونين", "قتال"] },
  adventure: { arabic: "مغامرات", genres: ["adventure", "مغامرات", "خيال"] },
  comedy: { arabic: "كوميديا", genres: ["comedy", "كوميديا", "مرح"] },
  emerald: { arabic: "زمردة", genres: ["drama", "دراما", "romance", "رومانسي", "شوجو"] },
  sports: { arabic: "رياضة", genres: ["sports", "رياضة", "كرة", "سلة"] },
  mystery: { arabic: "غموض", genres: ["mystery", "غموض", "تحقيق", "بوليسي"] },
  scifi: { arabic: "علوم", genres: ["sci-fi", "خيال علمي", "ميكا", "mecha"] },
  classics: { arabic: "تاريخ", genres: ["classics", "تاريخي", "historical", "سبيستون"] },
};

const ICON_MAP: Record<string, React.ElementType> = {
  Swords,
  Compass,
  Smile,
  Diamond,
  Flame,
  Eye,
  Bot,
  Clapperboard,
};

export function PlanetsMatrixGrid({
  selectedPlanetId,
  onSelectPlanet,
  animes = [],
}: PlanetsMatrixGridProps) {
  return (
    <div className="w-full pb-8">
      {/* Matrix Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="font-cairo text-2xl font-black text-[#e4e1e7] flex items-center gap-2">
            <span className="text-[#dc2626]">🪐</span>
            <span>مصفوفة الكواكب الكبرى</span>
          </h2>
          <p className="font-tajawal text-xs sm:text-sm text-[#ac8884] mt-0.5">
            اختر مدارك لتصفح المكتبة حسب طاقة ونمط الأعمال
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectPlanet("all")}
            className={`px-4 py-2 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedPlanetId === "all"
                ? "bg-[#dc2626] text-white shadow-lg shadow-[#dc2626]/30 scale-105"
                : "bg-[#1f1f23] text-[#ac8884] hover:text-white border border-white/10"
            }`}
          >
            <span>🌌</span>
            <span>جميع الكواكب</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-tajawal text-[#ac8884]">
            <span className="w-2 h-2 rounded-full bg-[#dc2626] inline-block animate-ping" />
            <span>انقر للتبديل الفوري بين الأجرام</span>
          </div>
        </div>
      </div>

      {/* 8 Planet Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {STITCH_PLANETS.map((planet) => {
          const isSelected =
            selectedPlanetId === planet.id ||
            (selectedPlanetId === "أكشن" && planet.id === "action") ||
            (selectedPlanetId === "مغامرات" && planet.id === "adventure") ||
            (selectedPlanetId === "كوميديا" && planet.id === "comedy") ||
            (selectedPlanetId === "زمردة" && planet.id === "emerald") ||
            (selectedPlanetId === "رياضة" && planet.id === "sports") ||
            (selectedPlanetId === "غموض" && planet.id === "mystery") ||
            (selectedPlanetId === "علوم" && planet.id === "scifi") ||
            (selectedPlanetId === "تاريخ" && planet.id === "classics");

          const planetMeta = PLANET_KEYWORD_MAP[planet.id];
          const matchingAnimes = animes.filter((a) => {
            const p = (a as any).planet;
            if (p === planet.id || p === planetMeta?.arabic) return true;
            return a.genres && a.genres.some((g) => {
              const gl = g.toLowerCase();
              return planetMeta?.genres.some((target) => gl.includes(target) || target.includes(gl));
            });
          });

          const worksCountDisplay =
            matchingAnimes.length > 0
              ? `${matchingAnimes.length} ${matchingAnimes.length === 1 ? "عمل متوفر" : "أعمال متوفرة"}`
              : "قريباً";

          const previewCovers = matchingAnimes
            .map((a) => a.coverImage)
            .filter(Boolean)
            .slice(0, 3);

          const IconComponent = ICON_MAP[planet.iconName] || Sparkles;

          return (
            <button
              key={planet.id}
              type="button"
              onClick={() => onSelectPlanet(planet.id)}
              className={`group relative text-right p-5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1.5 focus:outline-none overflow-hidden cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-[#1f1f23] text-[#e4e1e7] shadow-2xl ring-2 ring-[#dc2626] scale-[1.02]"
                  : "bg-[#1b1b1f] text-[#e4e1e7] hover:bg-[#1f1f23] border border-white/[0.06] hover:border-white/20 shadow-md"
              }`}
            >
              {/* Radial Glow Aura */}
              <div
                className="absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-opacity duration-300"
                style={{
                  backgroundColor: planet.colorTheme.glow,
                  opacity: isSelected ? 0.35 : 0.12,
                }}
              />

              {/* Active Marker Indicator */}
              {isSelected && (
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#dc2626] text-white px-2 py-0.5 rounded-full font-cairo font-bold text-[10px] shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>المدار الحالي</span>
                </div>
              )}

              <div>
                {/* Header: Icon + Title */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: planet.colorTheme.glow,
                    }}
                  >
                    <IconComponent
                      size={24}
                      className={planet.colorTheme.accent}
                    />
                  </div>

                  <div>
                    <h3 className="font-cairo text-base font-extrabold text-[#e4e1e7] group-hover:text-white transition-colors">
                      {planet.name}
                    </h3>
                    <span
                      className={`font-tajawal text-xs font-bold ${planet.colorTheme.accent}`}
                    >
                      {planet.subtitle}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="font-tajawal text-xs text-[#ac8884] mb-4 line-clamp-2 leading-relaxed">
                  {planet.description}
                </p>
              </div>

              {/* Bottom: Works Counter & Mini Poster Stack */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                <span className="font-tajawal text-[11px] font-bold text-[#e4e1e7] bg-[#2a292e] px-2.5 py-1 rounded-lg">
                  {worksCountDisplay}
                </span>

                {/* Mini Avatars */}
                <div className="flex items-center -space-x-2 -space-x-reverse">
                  {previewCovers.length > 0 ? (
                    previewCovers.map((url, idx) => (
                      <div
                        key={idx}
                        className="w-7 h-7 rounded-full bg-[#353439] ring-2 ring-[#1b1b1f] overflow-hidden shadow-sm relative"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt="Poster"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#2a292e] ring-2 ring-[#1b1b1f] flex items-center justify-center text-xs">
                      {planet.badge}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
