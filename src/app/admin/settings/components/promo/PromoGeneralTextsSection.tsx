"use client";

import React, { useRef, useState } from "react";
import { Sparkles, Smartphone, Upload } from "lucide-react";
import { PromoBannerConfig } from "@/server/types/settings.types";

export const AVAILABLE_BADGE_ICONS = [
    { label: "تثبيت هاتف", icon: "install_mobile" },
    { label: "بدون تقطيع", icon: "speed" },
    { label: "سرعة برق", icon: "bolt" },
    { label: "اشتراك VIP", icon: "diamond" },
    { label: "جودة فائقة", icon: "high_quality" },
    { label: "سينمائي", icon: "movie" }
];

interface PromoGeneralTextsSectionProps {
    data: PromoBannerConfig;
    updateField: <K extends keyof PromoBannerConfig>(field: K, value: PromoBannerConfig[K]) => void;
}

export function PromoGeneralTextsSection({ data, updateField }: PromoGeneralTextsSectionProps) {
    const [isUploadingIcon, setIsUploadingIcon] = useState(false);
    const iconFileInputRef = useRef<HTMLInputElement>(null);

    const handleAppIconFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("حجم أيقونة التطبيق كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت.");
            return;
        }

        setIsUploadingIcon(true);
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            updateField("appIconUrl", result);
            setIsUploadingIcon(false);
        };
        reader.onerror = () => {
            alert("حدث خطأ أثناء قراءة ملف الأيقونة.");
            setIsUploadingIcon(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <Sparkles size={18} className="text-[#ffb95f]" />
                <h3 className="font-cairo font-bold text-white text-sm">نصوص البث السريع "بدون تقطيع" والعنوان</h3>
            </div>

            {/* Fast Streaming Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                        نص الشارة العلوية (بدون تقطيع)
                    </label>
                    <input
                        type="text"
                        value={data.badgeText}
                        onChange={(e) => updateField("badgeText", e.target.value)}
                        placeholder="تجربة بث سينمائية بدون تقطيع"
                        className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626]"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">رمز الأيقونة</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={data.badgeIcon}
                            onChange={(e) => updateField("badgeIcon", e.target.value)}
                            placeholder="install_mobile"
                            className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                        />
                        <div className="w-9 h-9 rounded-xl bg-[#dc2626]/20 border border-[#dc2626]/40 flex items-center justify-center text-[#ffb4ab] shrink-0">
                            <span className="material-symbols-outlined text-[18px]">{data.badgeIcon || "install_mobile"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Badge Icons Suggestion */}
            <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-[#94a3b8] font-cairo">أيقونات شائعة:</span>
                {AVAILABLE_BADGE_ICONS.map((b) => (
                    <button
                        key={b.icon}
                        type="button"
                        onClick={() => updateField("badgeIcon", b.icon)}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                            data.badgeIcon === b.icon 
                                ? "bg-[#dc2626]/30 border-[#dc2626] text-white" 
                                : "bg-white/[0.03] border-white/5 text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        <span className="material-symbols-outlined text-[12px]">{b.icon}</span>
                        <span>{b.label}</span>
                    </button>
                ))}
            </div>

            {/* App Icon (Optional / Custom Upload) */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-cairo font-bold text-white flex items-center gap-2">
                        <Smartphone size={15} className="text-[#ffb95f]" />
                        <span>أيقونة التطبيق المخصصة (App Icon)</span>
                    </label>
                    <span className="text-[10px] text-[#94a3b8]">تظهر داخل محاكي الهاتف والبانر</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#131317] border border-white/[0.1] overflow-hidden flex items-center justify-center shrink-0">
                        {data.appIconUrl ? (
                            <img src={data.appIconUrl} alt="App Icon" className="w-full h-full object-cover" />
                        ) : (
                            <Smartphone size={20} className="text-gray-500" />
                        )}
                    </div>
                    <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                            <input
                                ref={iconFileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAppIconFileUpload}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => iconFileInputRef.current?.click()}
                                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-cairo font-bold text-white border border-white/[0.08] transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                <Upload size={13} />
                                <span>{isUploadingIcon ? "جاري الرفع..." : "رفع أيقونة جديدة"}</span>
                            </button>
                            {data.appIconUrl && (
                                <button
                                    type="button"
                                    onClick={() => updateField("appIconUrl", "/icon-192x192.png")}
                                    className="text-[11px] text-[#ffb4ab] hover:underline cursor-pointer"
                                >
                                    استعادة الأصلية
                                </button>
                            )}
                        </div>
                        <input
                            type="text"
                            value={data.appIconUrl || ""}
                            onChange={(e) => updateField("appIconUrl", e.target.value)}
                            placeholder="/icon-192x192.png أو رابط خارجي"
                            className="w-full px-3 py-1.5 rounded-xl bg-[#131317] border border-white/[0.08] text-[11px] font-mono text-white focus:outline-none focus:border-[#dc2626]"
                        />
                    </div>
                </div>
            </div>

            {/* Title Input */}
            <div>
                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                    العنوان الرئيسي للبانر (H2)
                </label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="ثبّت تطبيق ANIME DAZE كـ PWA خفيف على هاتفك وشاشتك الذكية"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-sm font-cairo font-black text-white focus:outline-none focus:border-[#dc2626]"
                />
            </div>

            {/* Description Textarea */}
            <div>
                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                    نص الشرح والوصف التسويقي
                </label>
                <textarea
                    value={data.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={3}
                    placeholder="استمتع بمشاهدة بدون إعلانات نهائياً، سرعة تشغيل فورية، تنبيهات عند صدور الحلقات..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-tajawal text-white leading-relaxed focus:outline-none focus:border-[#dc2626]"
                />
            </div>
        </div>
    );
}
