"use client";

import React from "react";
import { Search } from "lucide-react";

interface PlanetsFilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filterStatus: "all" | "active" | "inactive";
    onFilterStatusChange: (status: "all" | "active" | "inactive") => void;
    totalCount: number;
    activeCount: number;
}

export const PlanetsFilterBar: React.FC<PlanetsFilterBarProps> = ({
    searchQuery,
    onSearchChange,
    filterStatus,
    onFilterStatusChange,
    totalCount,
    activeCount,
}) => {
    return (
        <div className="p-4 rounded-2xl bg-[#131317] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="ابحث عن كوكب بالاسم، التصنيف، الشعار..."
                    className="w-full bg-[#1b1b22] border border-white/5 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-[#94a3b8]/60 focus:outline-none focus:border-red-500 font-tajawal"
                />
            </div>

            <div className="flex items-center gap-2">
                <span className="text-xs text-[#94a3b8] font-cairo font-bold">الحالة:</span>
                <button
                    type="button"
                    onClick={() => onFilterStatusChange("all")}
                    className={`px-3 py-1.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer ${
                        filterStatus === "all" ? "bg-red-600 text-white" : "bg-white/[0.04] text-[#94a3b8] hover:text-white"
                    }`}
                >
                    الكل ({totalCount})
                </button>
                <button
                    type="button"
                    onClick={() => onFilterStatusChange("active")}
                    className={`px-3 py-1.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer ${
                        filterStatus === "active" ? "bg-emerald-600 text-white" : "bg-white/[0.04] text-[#94a3b8] hover:text-white"
                    }`}
                >
                    النشطة ({activeCount})
                </button>
                <button
                    type="button"
                    onClick={() => onFilterStatusChange("inactive")}
                    className={`px-3 py-1.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer ${
                        filterStatus === "inactive" ? "bg-red-950 text-red-300" : "bg-white/[0.04] text-[#94a3b8] hover:text-white"
                    }`}
                >
                    المعطلة ({totalCount - activeCount})
                </button>
            </div>
        </div>
    );
};
