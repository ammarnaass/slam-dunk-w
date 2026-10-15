"use client";

import { Eye } from "lucide-react";
import { FooterConfig } from "@/server/types/settings.types";

interface FooterLiveSimulatorProps {
    data: FooterConfig;
    siteName: string;
    previewDevice: "desktop" | "mobile";
    setPreviewDevice: (device: "desktop" | "mobile") => void;
}

export function FooterLiveSimulator({
    data,
    siteName,
    previewDevice,
    setPreviewDevice,
}: FooterLiveSimulatorProps) {
    return (
        <div className="p-4 rounded-3xl bg-[#181820]/95 border border-white/[0.08] shadow-2xl backdrop-blur-2xl">
            {/* Simulator Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
                <div className="flex items-center gap-2">
                    <Eye size={16} className="text-[#ffb95f]" />
                    <span className="font-cairo font-bold text-xs text-white">المعاينة الحية للشريط السفلي</span>
                </div>
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#131317] border border-white/5">
                    <button
                        type="button"
                        onClick={() => setPreviewDevice("desktop")}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-cairo font-bold transition-all ${
                            previewDevice === "desktop" ? "bg-[#dc2626] text-white" : "text-[#94a3b8]"
                        }`}
                    >
                        حاسوب
                    </button>
                    <button
                        type="button"
                        onClick={() => setPreviewDevice("mobile")}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-cairo font-bold transition-all ${
                            previewDevice === "mobile" ? "bg-[#dc2626] text-white" : "text-[#94a3b8]"
                        }`}
                    >
                        هاتف
                    </button>
                </div>
            </div>

            {/* Simulated Canvas */}
            <div className="rounded-2xl bg-[#0c0c10] border border-white/[0.08] p-4 text-right space-y-5 overflow-hidden text-xs shadow-inner" dir="rtl">
                {/* Brand Header */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-red-600/30 flex items-center justify-center text-red-500 font-bold text-[10px]">
                            AD
                        </div>
                        <div>
                            <span className="font-cairo font-black text-xs text-white block leading-tight">{siteName}</span>
                            <span className="text-[9px] font-tajawal text-[#ffb95f] font-bold block">{data.subtitle}</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-[#94a3b8] leading-relaxed line-clamp-2">
                        {data.description}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                        {(data.socialLinks || []).filter(s => s.isEnabled).map((soc) => (
                            <span key={soc.id} className="p-1 rounded-md bg-white/[0.05] text-[#ffb95f] material-symbols-outlined text-xs">
                                {soc.icon}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Two Columns Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.05]">
                    <div>
                        <span className="font-cairo font-bold text-[11px] text-white block mb-1.5">{data.exploreTitle}</span>
                        <ul className="space-y-1 text-[10px] text-[#94a3b8]">
                            {(data.exploreLinks || []).slice(0, 4).map(l => (
                                <li key={l.id} className="truncate flex items-center gap-1">
                                    <span>• {l.label}</span>
                                    {l.isVip && <span className="text-[8px] bg-amber-500/20 text-amber-400 px-1 rounded">VIP</span>}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <span className="font-cairo font-bold text-[11px] text-white block mb-1.5">{data.helpTitle}</span>
                        <ul className="space-y-1 text-[10px] text-[#94a3b8]">
                            {(data.helpLinks || []).slice(0, 4).map(l => (
                                <li key={l.id} className="truncate">• {l.label}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* PWA Card Simulation */}
                {data.isAppCardEnabled && (
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                        <span className="font-cairo font-bold text-[10px] text-[#ffb95f] block">{data.appCardTitle}</span>
                        <p className="text-[9px] text-[#94a3b8] line-clamp-2 leading-tight">{data.appCardDescription}</p>
                        <div className="w-full py-1 rounded-lg bg-[#dc2626] text-white text-[10px] font-cairo font-bold text-center flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[11px]">{data.appCardButtonIcon}</span>
                            <span>{data.appCardButtonText}</span>
                        </div>
                    </div>
                )}

                {/* Bottom Strip Simulation */}
                <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between gap-2 text-[9px] text-[#94a3b8]">
                    <span className="truncate">© {new Date().getFullYear()} {siteName}</span>
                    <div className="flex items-center gap-1 shrink-0">
                        {data.isStatusIndicatorActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                        <span className="text-[8px] text-slate-400">{data.serverStatusText}</span>
                    </div>
                </div>
            </div>

            <p className="text-[10px] text-center text-[#94a3b8] font-tajawal mt-3">
                💡 تذكر الضغط على زر <strong className="text-white">&quot;حفظ التغييرات&quot;</strong> في أسفل الصفحة بعد الانتهاء.
            </p>
        </div>
    );
}
