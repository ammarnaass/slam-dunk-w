"use client";

import React from "react";
import { Download, Copy, Check } from "lucide-react";
import { ApiAppConfig } from "@/server/types/settings.types";

interface ApiAppVersionSectionProps {
    data: ApiAppConfig;
    updateField: <K extends keyof ApiAppConfig>(field: K, value: ApiAppConfig[K]) => void;
    copiedKey: string | null;
    handleCopy: (text: string, keyName: string) => void;
}

export function ApiAppVersionSection({
    data,
    updateField,
    copiedKey,
    handleCopy,
}: ApiAppVersionSectionProps) {
    return (
        <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                    <Download size={18} className="text-[#dc2626]" />
                    <h3 className="font-cairo font-bold text-white text-sm">إدارة الإصدارات والتحديث الإجباري والـ APK</h3>
                </div>
                
                {/* Force Update Toggle */}
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-cairo font-bold text-[#94a3b8]">تحديث إجباري:</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.forceUpdate}
                            onChange={(e) => updateField("forceUpdate", e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#dc2626]" />
                    </label>
                </div>
            </div>

            {/* Version Numbers Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">الإصدار الأخير</label>
                    <input
                        type="text"
                        value={data.latestVersion}
                        onChange={(e) => updateField("latestVersion", e.target.value)}
                        placeholder="1.2.0"
                        className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono font-bold text-white focus:outline-none focus:border-[#dc2626]"
                    />
                </div>

                <div>
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">رقم البناء الأخير</label>
                    <input
                        type="number"
                        value={data.latestBuild}
                        onChange={(e) => updateField("latestBuild", parseInt(e.target.value, 10) || 1)}
                        placeholder="14"
                        className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono font-bold text-white focus:outline-none focus:border-[#dc2626]"
                    />
                </div>

                <div>
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">أدنى إصدار مدعوم</label>
                    <input
                        type="text"
                        value={data.minSupportedVersion}
                        onChange={(e) => updateField("minSupportedVersion", e.target.value)}
                        placeholder="1.0.0"
                        className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono font-bold text-white focus:outline-none focus:border-[#dc2626]"
                    />
                </div>

                <div>
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">أدنى رقم بناء</label>
                    <input
                        type="number"
                        value={data.minSupportedBuild}
                        onChange={(e) => updateField("minSupportedBuild", parseInt(e.target.value, 10) || 1)}
                        placeholder="10"
                        className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono font-bold text-white focus:outline-none focus:border-[#dc2626]"
                    />
                </div>
            </div>

            {/* URLs */}
            <div className="space-y-3 pt-2">
                <div>
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                        رابط متجر Google Play (Store URL)
                    </label>
                    <input
                        type="text"
                        value={data.updateUrl}
                        onChange={(e) => updateField("updateUrl", e.target.value)}
                        placeholder="https://play.google.com/store/apps/details?id=com.animedaze.app"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-tajawal text-[#94a3b8]">
                            رابط التحميل المباشر لملف APK (Direct APK URL)
                        </label>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleCopy(data.directApkUrl, "apk")}
                                className="text-[10px] text-[#ffb4ab] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                {copiedKey === "apk" ? <Check size={11} /> : <Copy size={11} />}
                                <span>{copiedKey === "apk" ? "تم النسخ" : "نسخ الرابط"}</span>
                            </button>
                        </div>
                    </div>
                    <input
                        type="text"
                        value={data.directApkUrl}
                        onChange={(e) => updateField("directApkUrl", e.target.value)}
                        placeholder="https://slam-dunk-w.vercel.app/downloads/animedaze-latest.apk"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                    />
                </div>

                <div>
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                        رابط متجر Apple App Store (iOS URL)
                    </label>
                    <input
                        type="text"
                        value={data.appStoreUrl || ""}
                        onChange={(e) => updateField("appStoreUrl", e.target.value)}
                        placeholder="https://apps.apple.com/app/animedaze/id123456789"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                    />
                </div>

                <div>
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                        رابط خارجي إضافي / مستودع الإصدارات (External / Releases URL)
                    </label>
                    <input
                        type="text"
                        value={data.externalUrl || ""}
                        onChange={(e) => updateField("externalUrl", e.target.value)}
                        placeholder="https://github.com/ammarnaass/slam-dunk-w/releases"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                    />
                </div>
            </div>
        </div>
    );
}
