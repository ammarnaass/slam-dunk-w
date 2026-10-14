"use client";

import React from "react";
import Link from "next/link";
import { Compass, CheckCircle2, Tv, Layers } from "lucide-react";

interface PlanetsStatsCardsProps {
    totalPlanets: number;
    activePlanets: number;
    totalClassifiedWorks: number;
}

export const PlanetsStatsCards: React.FC<PlanetsStatsCardsProps> = ({
    totalPlanets,
    activePlanets,
    totalClassifiedWorks,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#131317] border border-white/[0.08] flex items-center justify-between">
                <div>
                    <span className="font-tajawal text-xs text-[#94a3b8] font-bold">إجمالي الكواكب المتاحة</span>
                    <h3 className="font-cairo font-black text-2xl text-white mt-1">{totalPlanets} كواكب</h3>
                    <span className="text-[11px] text-amber-400/80 font-mono mt-0.5 block">10 كواكب نوستالجيا سبيستون</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Compass size={24} />
                </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#131317] border border-white/[0.08] flex items-center justify-between">
                <div>
                    <span className="font-tajawal text-xs text-[#94a3b8] font-bold">الكواكب المفعلة حالياً</span>
                    <h3 className="font-cairo font-black text-2xl text-emerald-400 mt-1">{activePlanets} كوكب</h3>
                    <span className="text-[11px] text-emerald-500/80 font-mono mt-0.5 block">ظاهرة للمشاهدين على الموقع</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={24} />
                </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#131317] border border-white/[0.08] flex items-center justify-between">
                <div>
                    <span className="font-tajawal text-xs text-[#94a3b8] font-bold">إجمالي الأعمال المصنفة</span>
                    <h3 className="font-cairo font-black text-2xl text-white mt-1">{totalClassifiedWorks} عمل</h3>
                    <span className="text-[11px] text-[#ffb4ab] font-mono mt-0.5 block">مرتبطة بتصنيفات الكواكب</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#ffb4ab]">
                    <Tv size={24} />
                </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#131317] border border-white/[0.08] flex items-center justify-between">
                <div>
                    <span className="font-tajawal text-xs text-[#94a3b8] font-bold">الرابط المباشر في الرئيسية</span>
                    <h3 className="font-cairo font-black text-base text-white mt-1">قسم كواكب الأنمي</h3>
                    <Link href="/admin/settings?tab=home" className="text-[11px] text-red-400 hover:underline font-cairo font-bold mt-0.5 block">
                        تخصيص ترتيب القسم ↗
                    </Link>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Layers size={24} />
                </div>
            </div>
        </div>
    );
};
