"use client";

import { useState, useRef } from "react";
import { 
    Sparkles, 
    Smartphone, 
    Eye, 
    RotateCcw, 
    Crown, 
    Zap, 
    ShieldAlert, 
    Image as ImageIcon,
    Upload,
    Link as LinkIcon,
    Check,
    CheckCircle2,
    Trash2,
    Plus,
    Flame,
    ArrowUpRight
} from "lucide-react";
import { PromoBannerConfig, PromoFeatureItem } from "@/server/types/settings.types";
import { DEFAULT_PROMO_BANNER, PRESET_POSTER_OPTIONS, PresetPosterOption } from "@/lib/promo-presets";
import { PromoBannerLivePreview } from "./promo/PromoBannerLivePreview";

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
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
    const [imageSourceMode, setImageSourceMode] = useState<"upload" | "url">("upload");
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isUploadingIcon, setIsUploadingIcon] = useState(false);
    const imageFileInputRef = useRef<HTMLInputElement>(null);
    const iconFileInputRef = useRef<HTMLInputElement>(null);

    const updateField = <K extends keyof PromoBannerConfig>(field: K, value: PromoBannerConfig[K]) => {
        onChange({
            ...data,
            [field]: value
        });
    };

    const updateFeature = (index: number, key: keyof PromoFeatureItem, value: string) => {
        const nextFeatures = [...(data.features || [])];
        if (nextFeatures[index]) {
            nextFeatures[index] = {
                ...nextFeatures[index],
                [key]: value
            };
            updateField("features", nextFeatures);
        }
    };

    const addFeature = () => {
        const nextId = `feat-${Date.now()}`;
        const newFeat: PromoFeatureItem = {
            id: nextId,
            icon: "star",
            text: "ميزة إضافية"
        };
        updateField("features", [...(data.features || []), newFeat]);
    };

    const removeFeature = (index: number) => {
        const nextFeatures = (data.features || []).filter((_, idx) => idx !== index);
        updateField("features", nextFeatures);
    };

    // Poster Image File Upload Handler
    const handlePosterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) {
            alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 4 ميجابايت.");
            return;
        }

        setIsUploadingImage(true);
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            updateField("imageUrl", result);
            setIsUploadingImage(false);
        };
        reader.onerror = () => {
            alert("حدث خطأ أثناء قراءة ملف الصورة.");
            setIsUploadingImage(false);
        };
        reader.readAsDataURL(file);
    };

    // App Icon File Upload Handler
    const handleAppIconFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("حجم أيقونة التطبيق يجب أن يكون أقل من 2 ميجابايت.");
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

    // Apply Preset Poster Option
    const handleApplyPreset = (preset: PresetPosterOption) => {
        onChange({
            ...data,
            imageUrl: preset.url,
            imageCaption: preset.caption
        });
    };

    const handleResetDefaults = () => {
        if (!confirm("هل أنت متأكد من استعادة النصوص والإعدادات الافتراضية لبانر PWA؟")) return;
        onChange(DEFAULT_PROMO_BANNER);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300" dir="rtl">
            {/* Top Banner Control Header with Master Switch */}
            <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#dc2626] to-[#ffb95f] p-0.5 shadow-lg shadow-red-950/50 shrink-0">
                        <div className="w-full h-full bg-[#131317] rounded-[14px] flex items-center justify-center text-[#ffb4ab]">
                            <Smartphone size={24} />
                        </div>
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
                    {/* Master Enable/Disable Toggle */}
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
                                    <span>أيقونة تطبيق PWA المخصصة</span>
                                </label>
                                {data.appIconUrl && (
                                    <button
                                        type="button"
                                        onClick={() => updateField("appIconUrl", "")}
                                        className="text-[10px] text-red-400 hover:text-red-300 font-tajawal cursor-pointer flex items-center gap-1"
                                    >
                                        <Trash2 size={12} />
                                        <span>إزالة الأيقونة المخصصة</span>
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    ref={iconFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAppIconFileUpload}
                                    className="hidden"
                                />
                                <div className="w-12 h-12 rounded-xl bg-[#131317] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                                    {data.appIconUrl ? (
                                        <img src={data.appIconUrl} alt="App Icon" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-[#94a3b8] text-2xl">install_mobile</span>
                                    )}
                                </div>
                                <div className="flex-1 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => iconFileInputRef.current?.click()}
                                        disabled={isUploadingIcon}
                                        className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-cairo font-bold text-white border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <Upload size={14} />
                                        <span>{isUploadingIcon ? "جاري الرفع..." : "رفع أيقونة من جهازك"}</span>
                                    </button>
                                    <input
                                        type="text"
                                        value={data.appIconUrl || ""}
                                        onChange={(e) => updateField("appIconUrl", e.target.value)}
                                        placeholder="أو ضع رابط الأيقونة (مثال: /icon-192x192.png)"
                                        className="flex-1 px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Title Input */}
                        <div>
                            <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                                العنوان التسويقي الرئيسي
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

                    {/* Card 2: App Features / Perks (Matrix) */}
                    <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2">
                                <Zap size={18} className="text-[#dc2626]" />
                                <h3 className="font-cairo font-bold text-white text-sm">مزايا التطبيق التنافسية (المربعات الأربعة)</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addFeature}
                                className="text-xs font-cairo font-bold text-[#ffb4ab] hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                                <Plus size={14} />
                                <span>إضافة ميزة</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(data.features || []).map((feat, idx) => (
                                <div key={feat.id || idx} className="p-3 rounded-2xl bg-[#131317] border border-white/[0.06] space-y-2 relative group">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-cairo font-bold text-[#94a3b8]">ميزة #{idx + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(idx)}
                                            className="text-red-400 hover:text-red-300 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer p-0.5"
                                            title="حذف الميزة"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="col-span-1">
                                            <input
                                                type="text"
                                                value={feat.icon}
                                                onChange={(e) => updateFeature(idx, "icon", e.target.value)}
                                                placeholder="رمز الأيقونة"
                                                className="w-full px-2.5 py-1.5 rounded-lg bg-[#1a1a22] border border-white/5 text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                                                title="اسم الأيقونة من Material Symbols"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="text"
                                                value={feat.text}
                                                onChange={(e) => updateFeature(idx, "text", e.target.value)}
                                                placeholder="نص الميزة"
                                                className="w-full px-2.5 py-1.5 rounded-lg bg-[#1a1a22] border border-white/5 text-xs font-tajawal text-white focus:outline-none focus:border-[#dc2626]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Icon Presets Hint */}
                        <div className="pt-2 border-t border-white/[0.05]">
                            <span className="text-[10px] font-cairo text-[#94a3b8] block mb-1.5">رموز أيقونات مقترحة للميزات:</span>
                            <div className="flex flex-wrap gap-1.5">
                                {AVAILABLE_FEATURE_ICONS.map((item) => (
                                    <span
                                        key={item.icon}
                                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-[#e4e1e7] border border-white/5"
                                    >
                                        {item.icon} ({item.label})
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Call-To-Action (CTA) Buttons & VIP Discounts */}
                    <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                            <Crown size={18} className="text-[#ffb95f]" />
                            <h3 className="font-cairo font-bold text-white text-sm">أزرار الإجراءات (عروض VIP والمكتبة)</h3>
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
                                        placeholder="ترقية إلى VIP بخصم 40%"
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

                        {/* Secondary Button (Free Library) */}
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

                    {/* Card 4: Promotional Poster Image (Upload & Presets) */}
                    <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2">
                                <ImageIcon size={18} className="text-[#dc2626]" />
                                <h3 className="font-cairo font-bold text-white text-sm">صورة التطبيق الترويجية والشارة</h3>
                            </div>
                            
                            {/* Mode Toggle: Upload vs URL */}
                            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#131317] border border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setImageSourceMode("upload")}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-cairo font-bold transition-all cursor-pointer ${
                                        imageSourceMode === "upload" 
                                            ? "bg-[#dc2626] text-white" 
                                            : "text-[#94a3b8] hover:text-white"
                                    }`}
                                >
                                    <Upload size={12} />
                                    <span>رفع ملف</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageSourceMode("url")}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-cairo font-bold transition-all cursor-pointer ${
                                        imageSourceMode === "url" 
                                            ? "bg-[#dc2626] text-white" 
                                            : "text-[#94a3b8] hover:text-white"
                                    }`}
                                >
                                    <LinkIcon size={12} />
                                    <span>رابط URL</span>
                                </button>
                            </div>
                        </div>

                        {/* File Upload Zone or URL Input */}
                        {imageSourceMode === "upload" ? (
                            <div className="space-y-3">
                                <input
                                    ref={imageFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePosterFileUpload}
                                    className="hidden"
                                />
                                <div 
                                    onClick={() => imageFileInputRef.current?.click()}
                                    className="border-2 border-dashed border-white/10 hover:border-[#dc2626]/50 rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#131317]/50 hover:bg-[#131317] flex flex-col items-center justify-center gap-2.5 group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-[#dc2626]/10 group-hover:bg-[#dc2626]/20 border border-[#dc2626]/30 flex items-center justify-center text-[#ffb4ab] transition-transform group-hover:scale-105">
                                        <Upload size={22} />
                                    </div>
                                    <div>
                                        <p className="font-cairo font-bold text-xs text-white">
                                            {isUploadingImage ? "جاري قراءة ومعالجة الصورة..." : "اضغط لرفع صورة البوستر الترويجية من جهازك"}
                                        </p>
                                        <p className="font-tajawal text-[11px] text-[#94a3b8] mt-0.5">
                                            يدعم صيغ JPG و PNG و WEBP (أقل من 4 ميجابايت)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                                    رابط الصورة (URL)
                                </label>
                                <input
                                    type="text"
                                    value={data.imageUrl}
                                    onChange={(e) => updateField("imageUrl", e.target.value)}
                                    placeholder="/hero-bg.jpg أو رابط خارجي"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                                />
                            </div>
                        )}

                        {/* Image Caption / Bottom Badge */}
                        <div>
                            <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                                الشارة أسفل الصورة الترويجية
                            </label>
                            <input
                                type="text"
                                value={data.imageCaption}
                                onChange={(e) => updateField("imageCaption", e.target.value)}
                                placeholder="تجربة سبيستون الكلاسيكية الحديثة"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626]"
                            />
                        </div>

                        {/* One-Click Presets Section */}
                        <div className="pt-3 border-t border-white/[0.06] space-y-2.5">
                            <span className="text-xs font-cairo font-bold text-white flex items-center gap-1.5">
                                <Flame size={14} className="text-[#ffb95f]" />
                                <span>عينات جاهزة (بنقرة واحدة لتطبيق الصورة والشارة):</span>
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {PRESET_POSTER_OPTIONS.map((preset) => {
                                    const isSelected = data.imageUrl === preset.url;
                                    return (
                                        <button
                                            key={preset.label}
                                            type="button"
                                            onClick={() => handleApplyPreset(preset)}
                                            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                                                isSelected 
                                                    ? "bg-[#dc2626]/20 border-[#dc2626] shadow-lg shadow-red-950/40" 
                                                    : "bg-[#131317] border-white/5 hover:border-white/20 hover:bg-[#1a1a22]"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span className="font-cairo font-bold text-xs text-white">
                                                    {preset.label}
                                                </span>
                                                {isSelected && <Check size={14} className="text-[#ffb4ab]" />}
                                            </div>
                                            <span className="font-tajawal text-[10px] text-[#94a3b8] line-clamp-2">
                                                {preset.caption}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Live Simulator Preview Component */}
                <PromoBannerLivePreview data={data} />

            </div>
        </div>
    );
}
