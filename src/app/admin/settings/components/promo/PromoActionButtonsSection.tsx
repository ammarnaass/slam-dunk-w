"use client";

import React from "react";
import { Crown } from "lucide-react";
import { PromoBannerConfig } from "@/server/types/settings.types";

interface PromoActionButtonsSectionProps {
    data: PromoBannerConfig;
    updateField: <K extends keyof PromoBannerConfig>(field: K, value: PromoBannerConfig[K]) => void;
}

export function PromoActionButtonsSection({ data, updateField }: PromoActionButtonsSectionProps) {
    return (
        <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <Crown size={18} className="text-[#ffb95f]" />
                <h3 className="font-cairo font-bold text-white text-sm">
                    أزرار الإجراءات (عروض VIP والمكتبة)
                </h3>
            </div>

            {/* Primary Button (VIP) */}
            <div className="p-4 rounded-2xl bg-[#dc2626]/5 border border-[#dc2626]/20 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="font-cairo font-bold text-xs text-[#ffb4ab] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
                        الزر الأساسي (ترقية VIP بخصم)
                    </span>
                    <span className="text-[10px] text-[#94a3b8]">زر بارز بتوهج قرمزي</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">نص الزر</label>
                        <input
                            type="text"
                            value={data.primaryButtonText}
                            onChange={(e) => updateField("primaryButtonText", e.target.value)}
                            placeholder="اشترك الآن - خصم 50% لفترة محدودة"
                            className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626]"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">رابط الزر</label>
                        <input
                            type="text"
                            value={data.primaryButtonLink}
                            onChange={(e) => updateField("primaryButtonLink", e.target.value)}
                            placeholder="/pricing"
                            className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                        />
                    </div>
                </div>
            </div>

            {/* Secondary Button */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                    <span className="font-cairo font-bold text-xs text-[#e4e1e7] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#94a3b8]" />
                        الزر الثانوي (تصفح المجاني)
                    </span>
                    <span className="text-[10px] text-[#94a3b8]">زر هادئ بلون السطح</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">نص الزر</label>
                        <input
                            type="text"
                            value={data.secondaryButtonText}
                            onChange={(e) => updateField("secondaryButtonText", e.target.value)}
                            placeholder="تصفح المكتبة المجانية"
                            className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626]"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">رابط الزر</label>
                        <input
                            type="text"
                            value={data.secondaryButtonLink}
                            onChange={(e) => updateField("secondaryButtonLink", e.target.value)}
                            placeholder="/animes"
                            className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                        />
                    </div>
                </div>
            </div>

            {/* App Download Links Section */}
            <div className="p-4 rounded-2xl bg-[#00C3FF]/5 border border-[#00C3FF]/20 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="font-cairo font-bold text-xs text-[#00C3FF] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#00C3FF] animate-pulse" />
                        روابط تحميل تطبيق الهاتف (Google Play ،App Store ،ملف APK)
                    </span>
                    <span className="text-[10px] text-[#94a3b8]">أزرار التحميل الرسمية</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">رابط متجر Google Play</label>
                        <input
                            type="text"
                            value={data.googlePlayUrl || ""}
                            onChange={(e) => updateField("googlePlayUrl", e.target.value)}
                            placeholder="https://play.google.com/store/apps/details?id=com.animedaze.app"
                            className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#00C3FF]"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">رابط متجر Apple App Store</label>
                        <input
                            type="text"
                            value={data.appStoreUrl || ""}
                            onChange={(e) => updateField("appStoreUrl", e.target.value)}
                            placeholder="https://apps.apple.com/app/animedaze/id123456789"
                            className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-white/50"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">رابط تحميل ملف APK المباشر</label>
                        <input
                            type="text"
                            value={data.directApkUrl || ""}
                            onChange={(e) => updateField("directApkUrl", e.target.value)}
                            placeholder="https://slam-dunk-w.vercel.app/downloads/animedaze-latest.apk"
                            className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#3DDC84]"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">رابط خارجي إضافي (External Link)</label>
                        <input
                            type="text"
                            value={data.externalUrl || ""}
                            onChange={(e) => updateField("externalUrl", e.target.value)}
                            placeholder="https://github.com/ammarnaass/slam-dunk-w/releases"
                            className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#ffb95f]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
