"use client";

import React from "react";
import { Orbit, LayoutGrid, Sparkles } from "lucide-react";

interface PlanetsViewModeToggleProps {
    viewMode: "3d" | "2d";
    onChangeViewMode: (mode: "3d" | "2d") => void;
}

export function PlanetsViewModeToggle({
    viewMode,
    onChangeViewMode
}: PlanetsViewModeToggleProps) {
    return (
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6 p-2 sm:p-2.5 rounded-2xl bg-[#14141b]/80 border border-white/10 backdrop-blur-md">
            {/* Title / Description */}
            <div className="flex items-center gap-2.5 px-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                    <Sparkles size={16} />
                </div>
                <div>
                    <h3 className="font-cairo font-black text-xs sm:text-sm text-white">
                        طريقة استعراض الكواكب
                    </h3>
                    <p className="font-tajawal text-[11px] text-[#ac8884] hidden sm:block">
                        بدّل بحرية بين المدار الفضائي ثلاثي الأبعاد والشبكة الكلاسيكية
                    </p>
                </div>
            </div>

            {/* Switcher Buttons */}
            <div className="flex items-center p-1 rounded-xl bg-[#0b0b0f] border border-white/10">
                <button
                    type="button"
                    onClick={() => onChangeViewMode("3d")}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-cairo font-bold text-xs transition-all cursor-pointer ${
                        viewMode === "3d"
                            ? "bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-950/40"
                            : "text-[#ac8884] hover:text-white"
                    }`}
                >
                    <Orbit size={15} className={viewMode === "3d" ? "animate-spin text-amber-300" : ""} />
                    <span>مدار سبيستون 3D</span>
                </button>

                <button
                    type="button"
                    onClick={() => onChangeViewMode("2d")}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-cairo font-bold text-xs transition-all cursor-pointer ${
                        viewMode === "2d"
                            ? "bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-950/40"
                            : "text-[#ac8884] hover:text-white"
                    }`}
                >
                    <LayoutGrid size={15} />
                    <span>العرض العادي 2D</span>
                </button>
            </div>
        </div>
    );
}
