"use client";

import React from "react";
import { AlertTriangle, Copy, Check } from "lucide-react";
import { ApiAppConfig } from "@/server/types/settings.types";

interface ApiAppMaintenanceSectionProps {
    data: ApiAppConfig;
    updateField: <K extends keyof ApiAppConfig>(field: K, value: ApiAppConfig[K]) => void;
    copiedKey: string | null;
    handleCopy: (text: string, keyName: string) => void;
}

export function ApiAppMaintenanceSection({
    data,
    updateField,
    copiedKey,
    handleCopy,
}: ApiAppMaintenanceSectionProps) {
    return (
        <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-[#ffb95f]" />
                    <h3 className="font-cairo font-bold text-white text-sm">وضع الصيانة وتخطي المطورين</h3>
                </div>
                
                {/* Toggle Maintenance Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={data.isMaintenance}
                        onChange={(e) => updateField("isMaintenance", e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ffb95f]" />
                </label>
            </div>

            {data.isMaintenance && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3 text-xs font-cairo text-amber-300">
                    <AlertTriangle size={18} className="shrink-0" />
                    <span>تنبيه: سيتم حظر المشاهدة وعرض شاشة الصيانة لجميع مستخدمي تطبيق الأندرويد باستثناء من يدخل كود التخطي!</span>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                        عنوان نافذة الصيانة بالتطبيق
                    </label>
                    <input
                        type="text"
                        value={data.maintenanceTitle}
                        onChange={(e) => updateField("maintenanceTitle", e.target.value)}
                        placeholder="صيانة دورية مجدولة"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#ffb95f]"
                    />
                </div>

                <div>
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                        رسالة الصيانة الموجهة للمستخدمين
                    </label>
                    <textarea
                        value={data.maintenanceMessage}
                        onChange={(e) => updateField("maintenanceMessage", e.target.value)}
                        rows={2}
                        placeholder="نقوم حالياً بتحسين وتحديث سيرفرات المشاهدة..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-tajawal text-white focus:outline-none focus:border-[#ffb95f] resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                            موعد الانتهاء المتوقع (اختياري)
                        </label>
                        <input
                            type="text"
                            value={data.maintenanceEndTime || ""}
                            onChange={(e) => updateField("maintenanceEndTime", e.target.value)}
                            placeholder="مثال: اليوم 11:30 مساءً"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-tajawal text-white focus:outline-none focus:border-[#ffb95f]"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-tajawal text-[#94a3b8]">كود تخطي الصيانة للمطورين</label>
                            <button
                                type="button"
                                onClick={() => handleCopy(data.devBypassKey, "bypass")}
                                className="text-[10px] text-[#ffb95f] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                {copiedKey === "bypass" ? <Check size={11} /> : <Copy size={11} />}
                                <span>{copiedKey === "bypass" ? "تم النسخ" : "نسخ"}</span>
                            </button>
                        </div>
                        <input
                            type="text"
                            value={data.devBypassKey}
                            onChange={(e) => updateField("devBypassKey", e.target.value)}
                            placeholder="SLAM_DEV_2026"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono font-bold text-[#ffb95f] focus:outline-none focus:border-[#ffb95f]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
