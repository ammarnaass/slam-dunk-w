"use client";

import React from "react";
import { Sparkles, ExternalLink } from "lucide-react";
import { HomeSectionItem } from "@/lib/home-presets";

interface HomeScreenWireframeFooterProps {
    enabledSections: HomeSectionItem[];
}

export function HomeScreenWireframeFooter({ enabledSections }: HomeScreenWireframeFooterProps) {
    return (
        <div className="mt-8 p-5 rounded-2xl bg-black/40 border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-right">
                <span className="font-cairo font-bold text-xs text-white flex items-center gap-2">
                    <Sparkles size={14} className="text-[#ffb95f]" />
                    التسلسل الفعلي للأقسام في الصفحة الرئيسية حالياً:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {enabledSections.map((s, idx) => (
                        <span
                            key={s.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-tajawal text-[#e4e1e7]"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span>{idx + 1}. {s.nameAr}</span>
                        </span>
                    ))}
                </div>
            </div>

            <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white font-cairo font-bold text-xs shadow-lg shadow-red-950/40 hover:brightness-110 transition-all shrink-0"
            >
                <span>معاينة الواجهة الحية</span>
                <ExternalLink size={14} />
            </a>
        </div>
    );
}
