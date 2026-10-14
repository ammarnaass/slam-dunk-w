"use client";

import React from "react";
import Link from "next/link";
import { Film, Sparkles, RotateCcw } from "lucide-react";
import { HeroSliderSettings } from "@/lib/home-presets";

interface SliderHeaderSectionProps {
    current: HeroSliderSettings;
    onResetToDefault: () => void;
}

export default function SliderHeaderSection({
    current,
    onResetToDefault
}: SliderHeaderSectionProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06] relative z-10">
            <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#dc2626]/20 border border-[#dc2626]/40 flex items-center justify-center text-[#ffb4ab] shrink-0">
                    <Film size={24} />
                </div>
                <div>
                    <h2 className="font-cairo font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                        <span>إعدادات وتخصيص السلايدر السينمائي</span>
                        <span className={`px-2.5 py-0.5 rounded-full font-cairo text-[11px] font-bold ${
                            current.isEnabled 
                                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                                : "bg-red-500/15 border border-red-500/30 text-red-400"
                        }`}>
                            {current.isEnabled ? "السلايدر نشط" : "السلايدر معطل"}
                        </span>
                    </h2>
                    <p className="font-tajawal text-xs sm:text-sm text-[#94a3b8] mt-0.5">
                        تحكم في سرعة تبديل الشرائح، العتامة وتدرج الإضاءة، الشارات المعروضة، والحد الأقصى للأعمال المختارة.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
                <button
                    type="button"
                    onClick={onResetToDefault}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all cursor-pointer"
                    title="استعادة إعدادات السلايدر الافتراضية"
                >
                    <RotateCcw size={14} className="text-[#ffb95f]" />
                    <span>استعادة الافتراضي</span>
                </button>

                <Link
                    href="/admin/slider"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:brightness-110 text-xs font-cairo font-bold text-white shadow-lg shadow-red-950/40 transition-all"
                >
                    <Sparkles size={14} />
                    <span>اختيار أعمال السلايدر</span>
                </Link>
            </div>
        </div>
    );
}
