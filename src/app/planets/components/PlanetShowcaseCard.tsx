"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { SpacetoonPlanetOption } from "@/lib/anime-presets";

interface PlanetShowcaseCardProps {
    planet: SpacetoonPlanetOption;
    isSelected: boolean;
    onSelect: (planetId: string) => void;
}

export function PlanetShowcaseCard({
    planet,
    isSelected,
    onSelect
}: PlanetShowcaseCardProps) {
    return (
        <div
            onClick={() => onSelect(planet.id)}
            className={`rounded-[30px] p-6 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                isSelected
                    ? "bg-[#181c28] border-2 border-white/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] scale-[1.02]"
                    : "bg-[#12151f]/90 hover:bg-[#181c28] border border-white/[0.08] hover:border-white/20 shadow-xl hover:-translate-y-1"
            }`}
        >
            {/* Orbital Background Aura */}
            <div 
                className="absolute -top-16 -left-16 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                style={{ background: planet.glowColor || "#dc2626" }}
            />

            <div>
                {/* Top Row: Planet Emoji Badge + Slogan */}
                <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                        {planet.badge}
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[11px] font-cairo font-black border ${planet.bgClass}`}>
                        {planet.name}
                    </span>
                </div>

                {/* Title & Slogan */}
                <h3 className="font-cairo font-black text-lg text-white group-hover:text-[#ffb95f] transition-colors">
                    {planet.name}
                </h3>
                <p className="font-tajawal text-xs text-[#ffb4ab] font-bold mt-0.5">
                    {planet.slogan || "عالم التصنيف والتشويق"}
                </p>

                {/* Description */}
                <p className="font-tajawal text-xs text-[#94a3b8] mt-2.5 leading-relaxed line-clamp-3">
                    {planet.description}
                </p>

                {/* Flagship Works Pills */}
                {planet.flagshipWorks && (
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                        {planet.flagshipWorks.slice(0, 3).map((work, idx) => (
                            <span 
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-tajawal text-[#e4e1e7] border border-white/5"
                            >
                                {work}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Action */}
            <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="font-cairo text-xs font-bold text-[#94a3b8] group-hover:text-white transition-colors flex items-center gap-1">
                    {isSelected ? "الكوكب النشط حالياً" : "الهبوط على الكوكب"}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all ${
                    isSelected ? "bg-[#dc2626]" : "bg-white/[0.06] group-hover:bg-[#dc2626]"
                }`}>
                    <ChevronLeft size={16} />
                </div>
            </div>
        </div>
    );
}
