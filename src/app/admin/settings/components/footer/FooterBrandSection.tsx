"use client";

import { Compass, Share2 } from "lucide-react";
import { FooterConfig, FooterSocialItem } from "@/server/types/settings.types";

interface FooterBrandSectionProps {
    data: FooterConfig;
    updateField: <K extends keyof FooterConfig>(field: K, value: FooterConfig[K]) => void;
    updateSocial: (id: string, field: keyof FooterSocialItem, value: any) => void;
}

export function FooterBrandSection({
    data,
    updateField,
    updateSocial,
}: FooterBrandSectionProps) {
    return (
        <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <Compass size={18} className="text-[#dc2626]" />
                <h3 className="font-cairo font-bold text-white text-sm">هوية الشريط السفلي والنص الوصفي</h3>
            </div>

            <div>
                <label className="block font-cairo font-bold text-xs text-[#e4e1e7] mb-1.5">
                    العنوان الفرعي أسفل الشعار
                </label>
                <input
                    type="text"
                    value={data.subtitle}
                    onChange={(e) => updateField("subtitle", e.target.value)}
                    placeholder="مثال: سبيس تون & أنمي كلاسيك"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-tajawal text-white focus:outline-none focus:border-[#dc2626] transition-colors"
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-cairo font-bold text-xs text-[#e4e1e7]">
                        النص التعريفي في الشريط السفلي
                    </label>
                    <span className="text-[10px] text-[#94a3b8] font-mono">
                        {data.description.length} حرفاً
                    </span>
                </div>
                <textarea
                    rows={3}
                    value={data.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="منصة البث السينمائية الأولى لعشاق الأنمي..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-tajawal text-white leading-relaxed focus:outline-none focus:border-[#dc2626] transition-colors resize-none"
                />
            </div>

            {/* Social Links Manager */}
            <div className="pt-3 border-t border-white/[0.05] space-y-3">
                <div className="flex items-center gap-2">
                    <Share2 size={16} className="text-[#ffb95f]" />
                    <span className="font-cairo font-bold text-xs text-white">روابط التواصل والبودكاست</span>
                </div>
                <div className="space-y-2">
                    {(data.socialLinks || []).map((social) => (
                        <div key={social.id} className="p-3 rounded-2xl bg-[#131317] border border-white/5 flex items-center gap-3">
                            <div className="flex items-center gap-2 w-28 shrink-0">
                                <input
                                    type="checkbox"
                                    id={`soc-en-${social.id}`}
                                    checked={social.isEnabled}
                                    onChange={(e) => updateSocial(social.id, "isEnabled", e.target.checked)}
                                    className="rounded bg-[#1f1f23] border-white/10 text-red-600 focus:ring-0 cursor-pointer"
                                />
                                <label htmlFor={`soc-en-${social.id}`} className="font-cairo font-bold text-xs text-[#e4e1e7] flex items-center gap-1 cursor-pointer">
                                    <span className="material-symbols-outlined text-sm text-[#ffb95f]">{social.icon}</span>
                                    <span className="truncate">{social.name}</span>
                                </label>
                            </div>
                            <input
                                type="text"
                                value={social.url}
                                onChange={(e) => updateSocial(social.id, "url", e.target.value)}
                                placeholder="https://..."
                                disabled={!social.isEnabled}
                                className="flex-1 px-3 py-1.5 rounded-xl bg-[#1a1a22] border border-white/5 text-xs font-mono text-white disabled:opacity-30 focus:outline-none focus:border-[#dc2626]"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
