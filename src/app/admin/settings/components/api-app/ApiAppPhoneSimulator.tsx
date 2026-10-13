"use client";

import React from "react";
import { Radio, Download, AlertTriangle, PlayCircle } from "lucide-react";
import { ApiAppConfig } from "@/server/types/settings.types";

interface ApiAppPhoneSimulatorProps {
    data: ApiAppConfig;
    simScreen: "feed" | "maintenance" | "update";
    onScreenChange: (screen: "feed" | "maintenance" | "update") => void;
}

export function ApiAppPhoneSimulator({
    data,
    simScreen,
    onScreenChange,
}: ApiAppPhoneSimulatorProps) {
    return (
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Radio size={16} className="text-[#dc2626] animate-pulse" />
                    <h3 className="font-cairo font-bold text-white text-xs">محاكي هاتف أندرويد الحي</h3>
                </div>

                {/* Simulator Screen Switcher */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-[#181820] border border-white/5">
                    <button
                        type="button"
                        onClick={() => onScreenChange("feed")}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-cairo font-bold transition-all cursor-pointer ${
                            simScreen === "feed" ? "bg-[#dc2626] text-white" : "text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        التطبيق
                    </button>
                    <button
                        type="button"
                        onClick={() => onScreenChange("maintenance")}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-cairo font-bold transition-all cursor-pointer ${
                            simScreen === "maintenance" ? "bg-[#ffb95f] text-black" : "text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        الصيانة
                    </button>
                    <button
                        type="button"
                        onClick={() => onScreenChange("update")}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-cairo font-bold transition-all cursor-pointer ${
                            simScreen === "update" ? "bg-red-600 text-white" : "text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        التحديث
                    </button>
                </div>
            </div>

            {/* Smartphone Mockup Frame */}
            <div className="w-full max-w-[340px] mx-auto bg-[#0a0a0f] rounded-[48px] p-3.5 border-4 border-[#2a2a35] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden">
                
                {/* Notch / Punch-hole Camera */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border border-white/10 z-30 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a2e]" />
                </div>

                {/* Android Screen Inner Container */}
                <div className="w-full h-[580px] bg-[#0F131C] rounded-[36px] overflow-hidden flex flex-col relative select-none">
                    
                    {/* Android Status Bar */}
                    <div className="pt-2 px-5 pb-1 flex items-center justify-between text-[10px] font-mono text-[#94a3b8] z-20">
                        <span>12:45</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[9px]">5G</span>
                            <div className="w-4 h-2 rounded-sm border border-[#94a3b8] p-0.5 flex items-center">
                                <div className="w-full h-full bg-emerald-400 rounded-2xs" />
                            </div>
                        </div>
                    </div>

                    {/* SCREEN 1: Active App Feed */}
                    {simScreen === "feed" && (
                        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
                            {/* App Header */}
                            <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-[#dc2626] flex items-center justify-center text-white font-black text-xs font-cairo">
                                        AD
                                    </div>
                                    <div>
                                        <span className="font-cairo font-black text-xs text-white block leading-tight">ANIME DAZE</span>
                                        <span className="font-tajawal text-[9px] text-[#ffb95f]">سبيستون & كلاسيك</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-full bg-[#ffb95f]/20 border border-[#ffb95f]/40 text-[#ffb95f] text-[9px] font-cairo font-bold">
                                        VIP
                                    </span>
                                </div>
                            </div>

                            {/* Hero Banner in Simulator */}
                            <div className="p-3">
                                <div className="h-32 rounded-2xl bg-gradient-to-t from-black via-black/40 to-transparent relative overflow-hidden border border-white/10 flex flex-col justify-end p-3">
                                    <img
                                        src="/hero-bg.jpg"
                                        alt="Banner"
                                        className="absolute inset-0 w-full h-full object-cover -z-10"
                                    />
                                    <span className="px-2 py-0.5 rounded-md bg-[#dc2626] text-white text-[8px] font-cairo font-bold self-start mb-1">
                                        الأكثر مشاهدة 4K
                                    </span>
                                    <h4 className="font-cairo font-black text-xs text-white leading-tight">سلام دانك: الصقور ضد الساموراي</h4>
                                    <span className="font-tajawal text-[9px] text-[#e4e1e7]">101 حلقة مدبلجة سبيستون كاملة</span>
                                </div>
                            </div>

                            {/* Simulator Quick Perks Row */}
                            <div className="px-3 py-1 flex items-center justify-between text-[8px] font-cairo text-[#94a3b8]">
                                <span className="flex items-center gap-1">⚡ سيرفر {data.defaultServer}</span>
                                <span className="flex items-center gap-1">📺 جودة {data.defaultQuality}</span>
                                <span className="flex items-center gap-1">📥 {data.allowDownloads ? "تحميل متاح" : "تحميل معطل"}</span>
                            </div>

                            {/* Episodes Sample Grid */}
                            <div className="p-3 space-y-2 flex-1">
                                <span className="font-cairo font-bold text-[10px] text-white block">أحدث الحلقات المضافة</span>
                                <div className="space-y-1.5">
                                    {[101, 100, 99].map((epNum) => (
                                        <div key={epNum} className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-7 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-white">
                                                    <PlayCircle size={14} className="text-[#dc2626]" />
                                                </div>
                                                <div>
                                                    <span className="font-cairo font-bold text-[10px] text-white block">سلام دانك - حلقة {epNum}</span>
                                                    <span className="font-tajawal text-[8px] text-[#94a3b8]">23:30 دقيقة • FHD</span>
                                                </div>
                                            </div>
                                            <span className="text-[9px] font-mono text-[#ffb95f]">VIP</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Nav Bar in Mockup */}
                            <div className="p-2.5 bg-[#0A0E16] border-t border-white/5 flex items-center justify-around text-[9px] font-cairo text-[#94a3b8]">
                                <span className="text-[#dc2626] font-bold">الرئيسية</span>
                                <span>الأنمي</span>
                                <span>الحلقات</span>
                                <span>التنزيلات</span>
                                <span>حسابي</span>
                            </div>
                        </div>
                    )}

                    {/* SCREEN 2: Maintenance Overlay in Simulator */}
                    {simScreen === "maintenance" && (
                        <div className="flex-1 p-5 flex flex-col items-center justify-center text-center bg-[#0F131C] space-y-3.5">
                            <div className="w-14 h-14 rounded-2xl bg-[#ffb95f]/15 border border-[#ffb95f]/30 flex items-center justify-center text-[#ffb95f] shadow-lg shadow-amber-950/40">
                                <AlertTriangle size={28} />
                            </div>
                            <h4 className="font-cairo font-black text-sm text-white">
                                {data.maintenanceTitle || "صيانة دورية مجدولة"}
                            </h4>
                            <p className="font-tajawal text-[10px] text-[#94a3b8] leading-relaxed max-w-[220px]">
                                {data.maintenanceMessage || "نقوم حالياً بتحسين وتحديث سيرفرات المشاهدة..."}
                            </p>
                            {data.maintenanceEndTime && (
                                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-cairo text-[#ffb95f]">
                                    الموعد المتوقع: {data.maintenanceEndTime}
                                </div>
                            )}
                            <div className="w-full pt-4 border-t border-white/5 space-y-1.5">
                                <span className="text-[9px] font-cairo text-[#64748b] block">تخطي لفريق التطوير:</span>
                                <div className="flex items-center gap-1 justify-center">
                                    <span className="px-2 py-1 rounded-lg bg-black border border-white/10 font-mono text-[9px] text-[#ffb95f]">
                                        {data.devBypassKey}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SCREEN 3: Update Modal in Simulator */}
                    {simScreen === "update" && (
                        <div className="flex-1 p-5 flex flex-col justify-center bg-black/85 backdrop-blur-sm">
                            <div className="p-4 rounded-3xl bg-[#181C24] border border-white/10 shadow-2xl space-y-3 text-right">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-0.5 rounded-full bg-[#dc2626]/20 border border-[#dc2626]/40 text-[#ffb4ab] text-[9px] font-cairo font-bold">
                                        {data.forceUpdate ? "تحديث إجباري" : "تحديث متوفر"}
                                    </span>
                                    <Download size={16} className="text-[#dc2626]" />
                                </div>
                                <div>
                                    <h4 className="font-cairo font-black text-xs text-white">إصدار جديد متاح v{data.latestVersion}</h4>
                                    <span className="font-mono text-[9px] text-[#94a3b8]">بناء رقم {data.latestBuild}</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                    <span className="text-[9px] font-cairo font-bold text-[#ffb95f] block">أبرز المزايا:</span>
                                    {(Array.isArray(data.releaseNotes) ? data.releaseNotes.slice(0, 3) : []).map((note, i) => (
                                        <span key={i} className="text-[8px] font-tajawal text-[#e4e1e7] block truncate">
                                            • {note}
                                        </span>
                                    ))}
                                </div>
                                <div className="space-y-1.5 pt-1">
                                    <div className="w-full py-2 rounded-xl bg-[#dc2626] text-white text-center font-cairo font-bold text-[10px] shadow-lg shadow-red-950/40">
                                        تحديث الآن عبر Google Play
                                    </div>
                                    <div className="w-full py-1.5 rounded-xl bg-white/[0.04] text-[#94a3b8] text-center font-cairo font-bold text-[9px] border border-white/5">
                                        تحميل APK مباشر
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Android Home Bar Indicator */}
                <div className="w-24 h-1 rounded-full bg-white/20 mx-auto mt-2" />
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] font-tajawal text-[#94a3b8] text-center">
                ينعكس المحاكي فورياً مع التعديلات ويوضح تجربة المستخدم على هواتف أندرويد
            </div>
        </div>
    );
}
