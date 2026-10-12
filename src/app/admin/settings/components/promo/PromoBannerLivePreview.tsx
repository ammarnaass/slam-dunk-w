"use client";

import React, { useState } from "react";
import { Eye, ShieldAlert } from "lucide-react";
import { PromoBannerConfig } from "@/server/types/settings.types";

interface PromoBannerLivePreviewProps {
    data: PromoBannerConfig;
}

export function PromoBannerLivePreview({ data }: PromoBannerLivePreviewProps) {
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

    return (
        <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="p-5 rounded-3xl bg-[#181820]/95 border border-white/[0.08] shadow-2xl backdrop-blur-2xl">
                
                {/* Simulator Device Switcher */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
                    <div className="flex items-center gap-2">
                        <Eye size={16} className="text-[#ffb95f]" />
                        <span className="font-cairo font-bold text-xs text-white">المعاينة الحية الفورية</span>
                    </div>
                    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#131317] border border-white/5">
                        <button
                            type="button"
                            onClick={() => setPreviewDevice("desktop")}
                            className={`px-3 py-1 rounded-md text-[10px] font-cairo font-bold transition-all cursor-pointer ${
                                previewDevice === "desktop" ? "bg-[#dc2626] text-white" : "text-[#94a3b8]"
                            }`}
                        >
                            حاسوب
                        </button>
                        <button
                            type="button"
                            onClick={() => setPreviewDevice("mobile")}
                            className={`px-3 py-1 rounded-md text-[10px] font-cairo font-bold transition-all cursor-pointer ${
                                previewDevice === "mobile" ? "bg-[#dc2626] text-white" : "text-[#94a3b8]"
                            }`}
                        >
                            هاتف
                        </button>
                    </div>
                </div>

                {/* Simulated Live Canvas */}
                <div className={`relative rounded-2xl bg-[#111115] border border-white/[0.08] overflow-hidden shadow-inner transition-all ${
                    previewDevice === "mobile" ? "max-w-[340px] mx-auto p-4" : "p-5"
                }`}>
                    {/* Ambient Glows */}
                    <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-[#dc2626]/20 blur-2xl pointer-events-none" />
                    <div className="absolute -left-12 -top-12 w-44 h-44 rounded-full bg-[#ffb95f]/15 blur-2xl pointer-events-none" />

                    {!data.isEnabled ? (
                        <div className="py-14 text-center space-y-2">
                            <ShieldAlert size={32} className="mx-auto text-amber-500 opacity-60" />
                            <p className="font-cairo font-bold text-xs text-amber-400">البانر معطل حالياً</p>
                            <p className="text-[11px] text-[#94a3b8]">لن يظهر هذا القسم للزوار في الصفحة الرئيسية</p>
                        </div>
                    ) : (
                        <div className="relative z-10 space-y-4 text-right" dir="rtl">
                            
                            {/* Top Badge & App Icon */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#dc2626] text-white font-cairo font-bold text-[10px] shadow-[0_0_12px_rgba(220,38,38,0.5)]">
                                    <span className="material-symbols-outlined text-[13px]">{data.badgeIcon || "install_mobile"}</span>
                                    <span>{data.badgeText}</span>
                                </div>
                                {data.appIconUrl && (
                                    <div className="w-6 h-6 rounded-md overflow-hidden bg-white/10 shrink-0 border border-white/20">
                                        <img src={data.appIconUrl} alt="App" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <h4 className="font-cairo font-black text-sm text-white leading-snug">
                                {data.title}
                            </h4>

                            {/* Description */}
                            <p className="font-tajawal text-[11px] text-[#94a3b8] leading-relaxed line-clamp-3">
                                {data.description}
                            </p>

                            {/* Feature Pills */}
                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                                {(data.features || []).map((feat, i) => (
                                    <div key={i} className="p-1.5 rounded-xl bg-white/[0.04] border border-white/5 flex items-center gap-1.5">
                                        <span className={`material-symbols-outlined text-xs ${i % 2 === 0 ? "text-[#dc2626]" : "text-[#ffb95f]"}`}>
                                            {feat.icon}
                                        </span>
                                        <span className="font-tajawal text-[10px] text-white truncate">{feat.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex items-center gap-2 pt-1 flex-wrap">
                                <div className="px-3 py-1.5 rounded-xl bg-[#dc2626] text-white font-cairo font-bold text-[11px] shadow-md flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">{data.primaryButtonIcon || "diamond"}</span>
                                    <span>{data.primaryButtonText}</span>
                                </div>
                                <div className="px-3 py-1.5 rounded-xl bg-white/[0.06] text-white font-cairo text-[11px]">
                                    {data.secondaryButtonText}
                                </div>
                            </div>

                            {/* Poster Graphic Simulation */}
                            <div className="pt-2 flex justify-center">
                                <div className="relative w-44 aspect-[3/4] rounded-2xl overflow-hidden bg-[#181820] border border-white/15 shadow-2xl">
                                    <img
                                        src={data.imageUrl || "/hero-bg.jpg"}
                                        alt={data.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    {data.imageCaption && (
                                        <div className="absolute bottom-2.5 inset-x-2.5 p-2 rounded-xl bg-[#131317]/90 backdrop-blur-md text-center border border-white/5">
                                            <span className="font-cairo text-[10px] font-bold text-[#ffb95f] leading-tight block">
                                                {data.imageCaption}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* Status Tip */}
                <div className="pt-3 flex items-center justify-between text-[11px] text-[#94a3b8] font-tajawal">
                    <span>التغييرات تنعكس فورياً بالمحاكي</span>
                    <span className="text-[#ffb95f]">اضغط "حفظ التغييرات" لتطبيقها للزوار</span>
                </div>
            </div>
        </div>
    );
}
