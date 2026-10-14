"use client";

import { useState, useRef } from "react";
import { 
    Sparkles, 
    Smartphone, 
    RotateCcw, 
    Zap, 
    Upload
} from "lucide-react";
import { PromoBannerConfig } from "@/server/types/settings.types";
import { DEFAULT_PROMO_BANNER } from "@/lib/promo-presets";
import { PromoBannerLivePreview } from "./promo/PromoBannerLivePreview";
import { PromoFeaturesSection } from "./promo/PromoFeaturesSection";
import { PromoPosterSection } from "./promo/PromoPosterSection";
import { PromoActionButtonsSection } from "./promo/PromoActionButtonsSection";

interface PromoBannerCardProps {
    promo?: PromoBannerConfig;
    onChange: (updated: PromoBannerConfig) => void;
}

const AVAILABLE_FEATURE_ICONS = [
    { label: "منع إعلانات", icon: "block" },
    { label: "سرعة فائقة", icon: "bolt" },
    { label: "تحميل أوفلاين", icon: "download_for_offline" },
    { label: "تنبيهات فورية", icon: "notifications_active" },
    { label: "سيرفرات VIP", icon: "diamond" },
    { label: "جودة 4K", icon: "high_quality" },
    { label: "بدون تقطيع", icon: "speed" },
    { label: "دبلجة وترجمة", icon: "translate" }
];

const AVAILABLE_BADGE_ICONS = [
    { label: "تثبيت هاتف", icon: "install_mobile" },
    { label: "بدون تقطيع", icon: "speed" },
    { label: "سرعة برق", icon: "bolt" },
    { label: "اشتراك VIP", icon: "diamond" },
    { label: "جودة فائقة", icon: "high_quality" },
    { label: "سينمائي", icon: "movie" }
];

export default function PromoBannerCard({ promo, onChange }: PromoBannerCardProps) {
    const data: PromoBannerConfig = promo || DEFAULT_PROMO_BANNER;
    const [isUploadingIcon, setIsUploadingIcon] = useState(false);
    const iconFileInputRef = useRef<HTMLInputElement>(null);

    const updateField = <K extends keyof PromoBannerConfig>(field: K, value: PromoBannerConfig[K]) => {
        onChange({
            ...data,
            [field]: value
        });
    };

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

    const handleResetDefaults = () => {
        if (confirm("هل أنت متأكد من استعادة كافة نصوص وإعدادات البانر الافتراضية؟")) {
            onChange(DEFAULT_PROMO_BANNER);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Control Card */}
            <div className="p-6 rounded-3xl bg-[#181820]/80 border border-white/[0.08] backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#dc2626] to-[#ffb95f] flex items-center justify-center text-white shadow-lg shadow-red-950/40 shrink-0">
                        <Smartphone size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="font-cairo font-black text-lg sm:text-xl text-white">
                                بانر تطبيق PWA واشتراك VIP
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold font-cairo flex items-center gap-1.5 transition-all ${
                                data.isEnabled 
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}>
                                <span className={`w-2 h-2 rounded-full ${data.isEnabled ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                                {data.isEnabled ? "مفعّل في الرئيسية" : "معطل حالياً"}
                            </span>
                        </div>
                        <p className="font-tajawal text-xs text-[#94a3b8] mt-0.5">
                            التحكم الكامل في نصوص البث السريع "بدون تقطيع"، مزايا التطبيق، الخصومات وروابط الترقية، ورفع الصور والأيقونات
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
                    <button
                        type="button"
                        onClick={() => updateField("isEnabled", !data.isEnabled)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-cairo font-bold transition-all cursor-pointer shadow-md ${
                            data.isEnabled 
                                ? "bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-emerald-950/50" 
                                : "bg-white/[0.08] hover:bg-white/[0.12] text-[#94a3b8]"
                        }`}
                    >
                        <Zap size={15} className={data.isEnabled ? "text-white" : "text-gray-400"} />
                        <span>{data.isEnabled ? "تعطيل البانر" : "تفعيل في الرئيسية"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleResetDefaults}
                        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all cursor-pointer"
                        title="استرجاع النصوص الافتراضية الرسمية"
                    >
                        <RotateCcw size={14} />
                        <span>استعادة الافتراضي</span>
                    </button>
                </div>
            </div>

            {/* Split Grid: Editor Side (7 Cols) + Live Simulator (5 Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Editor Settings (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* Card 1: Texts & Fast Streaming Badge */}
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

                    {/* Card 2: App Features / Perks (Extracted Component) */}
                    <PromoFeaturesSection
                        data={data}
                        updateField={updateField}
                        availableFeatureIcons={AVAILABLE_FEATURE_ICONS}
                    />

                    {/* Card 3: Call-To-Action (CTA) Buttons & VIP Discounts (Extracted Component) */}
                    <PromoActionButtonsSection
                        data={data}
                        updateField={updateField}
                    />

                    {/* Card 4: Promotional Poster Image (Extracted Component) */}
                    <PromoPosterSection
                        data={data}
                        updateField={updateField}
                    />

                </div>

                {/* Live Simulator Preview Component */}
                <PromoBannerLivePreview data={data} />

            </div>
        </div>
    );
}
