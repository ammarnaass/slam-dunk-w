"use client";

import React from "react";
import { PlayCircle } from "lucide-react";
import { ApiAppConfig } from "@/server/types/settings.types";
import { 
    AVAILABLE_STREAMING_QUALITIES, 
    AVAILABLE_DEFAULT_SERVERS 
} from "@/lib/app-presets";

interface ApiAppStreamingSectionProps {
    data: ApiAppConfig;
    updateField: <K extends keyof ApiAppConfig>(field: K, value: ApiAppConfig[K]) => void;
}

export function ApiAppStreamingSection({
    data,
    updateField,
}: ApiAppStreamingSectionProps) {
    return (
        <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <PlayCircle size={18} className="text-[#dc2626]" />
                <h3 className="font-cairo font-bold text-white text-sm">إعدادات البث والمشغل الافتراضية للتطبيق</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">الجودة الافتراضية الأولية</label>
                    <select
                        value={data.defaultQuality}
                        onChange={(e) => updateField("defaultQuality", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626] cursor-pointer"
                    >
                        {AVAILABLE_STREAMING_QUALITIES.map((q) => (
                            <option key={q.value} value={q.value} className="bg-[#131317] text-white">
                                {q.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">السيرفر الافتراضي الأولي</label>
                    <select
                        value={data.defaultServer}
                        onChange={(e) => updateField("defaultServer", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626] cursor-pointer"
                    >
                        {AVAILABLE_DEFAULT_SERVERS.map((s) => (
                            <option key={s.value} value={s.value} className="bg-[#131317] text-white">
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                        <span className="font-cairo font-bold text-xs text-white block">التحميل أوفلاين للمشاهدة</span>
                        <span className="font-tajawal text-[10px] text-[#94a3b8]">تفعيل زر حفظ الحلقات على الجهاز</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.allowDownloads}
                            onChange={(e) => updateField("allowDownloads", e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                    </label>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                    <div>
                        <span className="font-cairo font-bold text-xs text-white block">تردد الإعلانات البينية</span>
                        <span className="font-tajawal text-[10px] text-[#94a3b8]">عدد الحلقات بين كل إعلان بيني</span>
                    </div>
                    <input
                        type="number"
                        min={1}
                        max={10}
                        value={data.interstitialInterval}
                        onChange={(e) => updateField("interstitialInterval", parseInt(e.target.value, 10) || 2)}
                        className="w-14 px-2 py-1 rounded-lg bg-[#131317] border border-white/[0.1] text-xs font-mono font-bold text-center text-white focus:outline-none focus:border-[#dc2626]"
                    />
                </div>
            </div>
        </div>
    );
}
