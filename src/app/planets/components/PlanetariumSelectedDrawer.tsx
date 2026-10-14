"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { AdminPlanetItem } from "@/lib/planets-presets";

interface PlanetariumSelectedDrawerProps {
    selectedPlanet: AdminPlanetItem | null;
    onClose: () => void;
    onResetCamera: () => void;
}

export function PlanetariumSelectedDrawer({
    selectedPlanet,
    onClose,
    onResetCamera,
}: PlanetariumSelectedDrawerProps) {
    if (!selectedPlanet) return null;

    return (
        <div className="absolute bottom-16 sm:bottom-20 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-30 p-5 rounded-3xl bg-[#111116]/95 backdrop-blur-xl border border-white/15 text-white shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                        style={{ 
                            backgroundColor: `${selectedPlanet.color}25`,
                            border: `1px solid ${selectedPlanet.color}50`
                        }}
                    >
                        <span>{selectedPlanet.badge}</span>
                    </div>
                    <div>
                        <h3 className="font-cairo font-black text-lg text-white leading-tight">
                            {selectedPlanet.name}
                        </h3>
                        <span className="text-xs font-tajawal text-amber-400 font-bold">
                            {selectedPlanet.slogan}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="text-[#94a3b8] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                    title="إغلاق والعودة للمدار الكلي"
                >
                    ✕
                </button>
            </div>

            {selectedPlanet.anthemSnippet && (
                <div className="mt-3.5 p-3 rounded-xl bg-white/[0.04] border border-white/5 text-amber-200 text-xs font-tajawal italic flex items-start gap-2">
                    <span className="text-amber-400 text-base">❝</span>
                    <span>{selectedPlanet.anthemSnippet}</span>
                </div>
            )}

            {selectedPlanet.flagshipWorks && selectedPlanet.flagshipWorks.length > 0 && (
                <div className="mt-3.5">
                    <span className="text-[11px] font-cairo font-bold text-[#ac8884] block mb-1.5">
                        أبرز روائع الكوكب الخالدة:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {selectedPlanet.flagshipWorks.map(w => (
                            <span 
                                key={w} 
                                className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-tajawal text-white/90"
                            >
                                {w}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <a 
                    href="#planet-animes-section" 
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-cairo font-bold text-center hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                >
                    <span>استعراض الأعمال بالأسفل</span>
                    <ChevronDown size={14} />
                </a>

                <button
                    type="button"
                    onClick={onResetCamera}
                    className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-cairo text-[#ac8884] hover:text-white border border-white/10 transition-all cursor-pointer"
                >
                    الكل
                </button>
            </div>
        </div>
    );
}
