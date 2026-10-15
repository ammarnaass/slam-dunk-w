"use client";

import { Smartphone, Activity } from "lucide-react";
import { FooterConfig } from "@/server/types/settings.types";

interface FooterAppCardSectionProps {
    data: FooterConfig;
    updateField: <K extends keyof FooterConfig>(field: K, value: FooterConfig[K]) => void;
}

export function FooterAppCardSection({
    data,
    updateField,
}: FooterAppCardSectionProps) {
    return (
        <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                    <Smartphone size={18} className="text-[#dc2626]" />
                    <h3 className="font-cairo font-bold text-white text-sm">بطاقة تطبيق PWA في الشريط السفلي</h3>
                </div>
                <label className="flex items-center gap-2 text-xs font-cairo font-bold text-white cursor-pointer">
                    <input
                        type="checkbox"
                        checked={data.isAppCardEnabled}
                        onChange={(e) => updateField("isAppCardEnabled", e.target.checked)}
                        className="rounded bg-[#1f1f23] text-red-600 focus:ring-0"
                    />
                    <span>إظهار بطاقة التطبيق</span>
                </label>
            </div>

            {data.isAppCardEnabled && (
                <div className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">عنوان البطاقة</label>
                            <input
                                type="text"
                                value={data.appCardTitle}
                                onChange={(e) => updateField("appCardTitle", e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626]"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">نص زر التثبيت</label>
                            <input
                                type="text"
                                value={data.appCardButtonText}
                                onChange={(e) => updateField("appCardButtonText", e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">الوصف المختصر</label>
                        <textarea
                            rows={2}
                            value={data.appCardDescription}
                            onChange={(e) => updateField("appCardDescription", e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-tajawal text-white leading-relaxed focus:outline-none focus:border-[#dc2626] resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                            <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">رابط Google Play</label>
                            <input
                                type="text"
                                value={data.googlePlayUrl || ""}
                                onChange={(e) => updateField("googlePlayUrl", e.target.value)}
                                placeholder="https://play.google.com/store/apps/details?id=..."
                                className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">رابط App Store</label>
                            <input
                                type="text"
                                value={data.appStoreUrl || ""}
                                onChange={(e) => updateField("appStoreUrl", e.target.value)}
                                placeholder="https://apps.apple.com/app/..."
                                className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">رابط ملف APK المباشر</label>
                            <input
                                type="text"
                                value={data.directApkUrl || ""}
                                onChange={(e) => updateField("directApkUrl", e.target.value)}
                                placeholder="https://.../animedaze.apk"
                                className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">رابط خارجي إضافي</label>
                            <input
                                type="text"
                                value={data.externalUrl || ""}
                                onChange={(e) => updateField("externalUrl", e.target.value)}
                                placeholder="https://github.com/.../releases"
                                className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Copyright & Status */}
            <div className="pt-4 border-t border-white/[0.06] space-y-3">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-emerald-400" />
                    <span className="font-cairo font-bold text-xs text-white">شريط الحقوق وحالة الخوادم</span>
                </div>

                <div>
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">نص حقوق الملكية والنشر</label>
                    <input
                        type="text"
                        value={data.copyrightText}
                        onChange={(e) => updateField("copyrightText", e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-tajawal text-white focus:outline-none focus:border-[#dc2626]"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">نص حالة الخوادم المباشرة</label>
                        <input
                            type="text"
                            value={data.serverStatusText}
                            onChange={(e) => updateField("serverStatusText", e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-tajawal text-white focus:outline-none focus:border-[#dc2626]"
                        />
                    </div>
                    <label className="flex items-center gap-1.5 text-xs font-cairo font-bold text-emerald-400 mt-5 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.isStatusIndicatorActive}
                            onChange={(e) => updateField("isStatusIndicatorActive", e.target.checked)}
                            className="rounded bg-[#1f1f23] text-emerald-600 focus:ring-0"
                        />
                        <span>نقطة خضراء نابضة</span>
                    </label>
                </div>
            </div>
        </div>
    );
}
