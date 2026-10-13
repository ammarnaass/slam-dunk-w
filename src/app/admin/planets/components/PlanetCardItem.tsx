"use client";

import React from "react";
import Link from "next/link";
import { 
    Tv, 
    ArrowUp, 
    ArrowDown, 
    Edit3, 
    ExternalLink, 
    Trash2 
} from "lucide-react";
import { AdminPlanetItem } from "@/lib/planets-presets";

interface PlanetCardItemProps {
    planet: AdminPlanetItem & { worksCount?: number };
    index: number;
    totalPlanets: number;
    onToggleEnabled: (planetId: string) => void;
    onMoveOrder: (index: number, direction: "up" | "down") => void;
    onEdit: (planet: AdminPlanetItem) => void;
    onOpenAnimes: (planet: AdminPlanetItem) => void;
    onDelete: (planet: AdminPlanetItem) => void;
}

export function PlanetCardItem({
    planet,
    index,
    totalPlanets,
    onToggleEnabled,
    onMoveOrder,
    onEdit,
    onOpenAnimes,
    onDelete,
}: PlanetCardItemProps) {
    return (
        <div
            className={`rounded-3xl bg-[#131317] border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group shadow-xl ${
                planet.isEnabled 
                    ? "border-white/[0.08] hover:border-white/20" 
                    : "border-red-950/40 opacity-60 bg-[#0e0e12]"
            }`}
            dir="rtl"
        >
            {/* Ambient Glow */}
            <div 
                className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none transition-opacity opacity-40 group-hover:opacity-75"
                style={{ backgroundColor: planet.color || "#dc2626" }}
            />

            {/* Card Header */}
            <div className="p-6 relative z-10 space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                        {/* Large Emoji Badge */}
                        <div 
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl transition-transform group-hover:scale-105 shrink-0"
                            style={{ 
                                backgroundColor: `${planet.color}22`,
                                border: `1px solid ${planet.color}44`
                            }}
                        >
                            <span>{planet.badge || "🪐"}</span>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-cairo font-black text-lg text-white group-hover:text-amber-400 transition-colors">
                                    {planet.name}
                                </h3>
                                {planet.isCustom && (
                                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-cairo text-[10px] font-bold">
                                        مخصص
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] font-mono text-[#94a3b8]">/{planet.id}</span>
                                <span className="text-white/20">•</span>
                                <span className="text-[11px] font-cairo text-amber-400 font-bold">{planet.genreKey}</span>
                            </div>
                        </div>
                    </div>

                    {/* Enable / Disable Toggle Switch */}
                    <button
                        type="button"
                        onClick={() => onToggleEnabled(planet.id)}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                            planet.isEnabled ? "bg-emerald-500" : "bg-white/10"
                        }`}
                        title={planet.isEnabled ? "تعطيل الكوكب" : "تفعيل الكوكب"}
                    >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            planet.isEnabled ? "-translate-x-5" : "translate-x-0"
                        }`} />
                    </button>
                </div>

                {/* Slogan */}
                {planet.slogan && (
                    <p className="font-cairo font-bold text-xs text-[#ffb95f] leading-snug">
                        ✨ &quot;{planet.slogan}&quot;
                    </p>
                )}

                {/* Description */}
                <p className="font-tajawal text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">
                    {planet.description}
                </p>

                {/* Flagship Works Chips */}
                {planet.flagshipWorks && planet.flagshipWorks.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-cairo font-bold text-[#94a3b8]/70 block">
                            الأعمال البارزة في الكوكب:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                            {planet.flagshipWorks.map((work, wIdx) => (
                                <span 
                                    key={wIdx} 
                                    className="px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06] font-tajawal text-[11px] text-white/80"
                                >
                                    {work}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Card Footer Actions Strip */}
            <div className="p-4 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between gap-2 relative z-10">
                {/* Works Count & View Button */}
                <button
                    type="button"
                    onClick={() => onOpenAnimes(planet)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#ffb4ab] border border-white/5 transition-all cursor-pointer"
                    title="عرض الأنميات المصنفة في هذا الكوكب"
                >
                    <Tv size={14} />
                    <span>{planet.worksCount || 0} عملاً</span>
                </button>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5">
                    {/* Order Up */}
                    <button
                        type="button"
                        onClick={() => onMoveOrder(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] disabled:opacity-20 text-[#94a3b8] hover:text-white transition-all cursor-pointer"
                        title="تقديم الترتيب"
                    >
                        <ArrowUp size={14} />
                    </button>

                    {/* Order Down */}
                    <button
                        type="button"
                        onClick={() => onMoveOrder(index, "down")}
                        disabled={index === totalPlanets - 1}
                        className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] disabled:opacity-20 text-[#94a3b8] hover:text-white transition-all cursor-pointer"
                        title="تأخير الترتيب"
                    >
                        <ArrowDown size={14} />
                    </button>

                    {/* Edit Modal Button */}
                    <button
                        type="button"
                        onClick={() => onEdit(planet)}
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-amber-500/20 text-[#94a3b8] hover:text-amber-400 border border-white/5 transition-all cursor-pointer"
                        title="تعديل بيانات الكوكب"
                    >
                        <Edit3 size={14} />
                    </button>

                    {/* Preview on website */}
                    <Link
                        href={`/planets?planet=${encodeURIComponent(planet.id)}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-blue-500/20 text-[#94a3b8] hover:text-blue-400 border border-white/5 transition-all"
                        title="معاينة الكوكب في الموقع العام"
                    >
                        <ExternalLink size={14} />
                    </Link>

                    {/* Delete if custom */}
                    {planet.isCustom && (
                        <button
                            type="button"
                            onClick={() => onDelete(planet)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                            title="حذف هذا الكوكب"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
