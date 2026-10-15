"use client";

import React from "react";
import { Smartphone, Zap, RotateCcw } from "lucide-react";
import { PromoBannerConfig } from "@/server/types/settings.types";

interface PromoHeaderSectionProps {
    data: PromoBannerConfig;
    onToggleEnabled: () => void;
    onResetDefaults: () => void;
}

export function PromoHeaderSection({
    data,
    onToggleEnabled,
    onResetDefaults
}: PromoHeaderSectionProps) {
    return (
        <div className="p-6 rounded-3xl bg-[#181820]/80 border border-white/[0.08] backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#dc2626] to-[#ffb95f] flex items-center justify-center text-white shadow-lg shadow-red-950/40 shrink-0">
                    <Smartphone size={24} />
                </div>
                <div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="font-cairo font-black text-lg sm:text-xl text-white">
                            بانر تطبيق PWA واشتراك VIP
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold font-cairo flex items-center gap-1.5 transition-all ${
                            data.isEnabled 
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}>
                            <span className={`w-2 h-2 rounded-full ${data.isEnabled ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                            {data.isEnabled ? "مفعّل في الرئيسية" : "معطل حالياً"}
                        </span>
                    </div>
                    <p className="font-tajawal text-xs text-[#94a3b8] mt-0.5">
                        التحكم الكامل في نصوص البث السريع "بدون تقطيع"، مزايا التطبيق، الخصومات وروابط الترقية، ورفع الصور والأيقونات
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
                <button
                    type="button"
                    onClick={onToggleEnabled}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-cairo font-bold transition-all cursor-pointer shadow-md ${
                        data.isEnabled 
                            ? "bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-emerald-950/50" 
                            : "bg-white/[0.08] hover:bg-white/[0.12] text-[#94a3b8]"
                    }`}
                >
                    <Zap size={15} className={data.isEnabled ? "text-white" : "text-gray-400"} />
                    <span>{data.isEnabled ? "تعطيل البانر" : "تفعيل في الرئيسية"}</span>
                </button>

                <button
                    type="button"
                    onClick={onResetDefaults}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all cursor-pointer"
                    title="استرجاع النصوص الافتراضية الرسمية"
                >
                    <RotateCcw size={14} />
                    <span>استعادة الافتراضي</span>
                </button>
            </div>
        </div>
    );
}
