"use client";

import { useState, useEffect } from "react";
import { Plan } from "@/types";
import { useRouter } from "next/navigation";
import { 
    Loader2, Save, FileText, CheckCircle, Plus, Trash2, 
    Crown, Star, Sparkles, Check, Eye, HelpCircle, Layers
} from "lucide-react";

interface PlanFormProps {
    initialData?: Plan;
    isEdit?: boolean;
}

const FEATURE_PRESETS = [
    "مشاهدة بدقة 1080p FHD و 4K بدون إعلانات",
    "سيرفرات فائقة السرعة مخصصة للأعضاء",
    "تحميل الحلقات للمشاهدة بدون إنترنت",
    "أولوية الوصول إلى أحدث الحلقات قبل الجميع",
    "شارة تميز VIP متوهجة في الملف الشخصي",
    "مشاهدة متزامنة على أجهزة متعددة",
    "إلغاء الاشتراك في أي وقت بسهولة"
];

export default function PlanForm({ initialData, isEdit = false }: PlanFormProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [formData, setFormData] = useState<Partial<Plan>>({
        id: initialData?.id || (isEdit ? undefined : `plan-${Date.now()}`),
        name: initialData?.name || "",
        price: initialData?.price !== undefined ? initialData.price : 4.99,
        duration: initialData?.duration || "30",
        description: initialData?.description || "",
        features: initialData?.features && initialData.features.length > 0 
            ? initialData.features 
            : [
                "مشاهدة بدقة 1080p FHD و 4K بدون إعلانات",
                "سيرفرات فائقة السرعة مخصصة للأعضاء",
                "تحميل الحلقات للمشاهدة بدون إنترنت"
            ],
        isPopular: initialData?.isPopular || false,
        isActive: initialData?.isActive ?? true,
    });

    const [currency, setCurrency] = useState("ج.م");

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.currency) setCurrency(data.currency);
            })
            .catch(err => console.error(err));
    }, []);

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const addFeature = (text: string = "") => {
        setFormData({ ...formData, features: [...(formData.features || []), text] });
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures.splice(index, 1);
        setFormData({ ...formData, features: newFeatures });
    };

    const handleAddPreset = (preset: string) => {
        if (formData.features?.includes(preset)) return;
        setFormData(prev => ({
            ...prev,
            features: [...(prev.features || []).filter(Boolean), preset]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg(null);

        const url = isEdit ? `/api/admin/plans/${initialData?.id}` : "/api/admin/plans";
        const method = isEdit ? "PUT" : "POST";

        try {
            const cleanFeatures = (formData.features || []).map(f => f.trim()).filter(Boolean);
            const payload = {
                ...formData,
                price: Number(formData.price),
                features: cleanFeatures
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "فشلت عملية حفظ الخطة");
            }

            setMsg({ type: "success", text: isEdit ? "تم تحديث الخطة بنجاح!" : "تم إنشاء الخطة وإتاحتها بنجاح!" });
            
            setTimeout(() => {
                router.push("/admin/plans");
                router.refresh();
            }, 800);
        } catch (error: any) {
            setMsg({ type: "error", text: error.message || "حدث خطأ أثناء الحفظ" });
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500 pb-16">
            {msg && (
                <div className={`p-4 rounded-2xl text-center font-bold text-sm shadow-xl border animate-in slide-in-from-top-2 duration-300 ${
                    msg.type === 'success' 
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' 
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                }`}>
                    {msg.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Right Area: Form Fields (7 cols) */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Card 1: Main Plan Details */}
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5">
                        <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                            <FileText size={18} className="text-amber-400" /> معلومات الخطة الأساسية
                        </h2>

                        <div>
                            <label className="block text-slate-300 text-xs font-bold mb-2">اسم الخطة / الباقة</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="مثال: الاشتراك الشهري VIP أو باقة الأوتاكو الذهبية"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-bold"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-xs font-bold mb-2">
                                وصف مختصر تسويقي <span className="text-slate-500 font-normal">(يظهر في بطاقة الاشتراك)</span>
                            </label>
                            <textarea
                                value={formData.description || ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="مثال: تجربة مشاهدة سينمائية بدون إعلانات مع سيرفرات فائقة السرعة لمدة شهر"
                                rows={2}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all resize-none"
                            />
                        </div>

                        {/* Price & Duration */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-300 text-xs font-bold mb-2">
                                    السعر المقدر ({currency})
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-mono font-bold"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-xs font-bold mb-2">المدة (بالأيام)</label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-mono"
                                        placeholder="30"
                                        required
                                    />
                                    {/* Presets */}
                                    <div className="flex gap-1.5 overflow-x-auto text-[10px] font-bold">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, duration: "30" })}
                                            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
                                        >
                                            30 يوم
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, duration: "90" })}
                                            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
                                        >
                                            90 يوم
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, duration: "365" })}
                                            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300"
                                        >
                                            365 يوم
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Flags */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.isPopular}
                                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
                                />
                                <div>
                                    <span className="text-xs font-bold text-white block">وسم "الأكثر طلباً"</span>
                                    <span className="text-[10px] text-slate-500">يعرض شارة ذهبية متوهجة على الخطة</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                                />
                                <div>
                                    <span className="text-xs font-bold text-white block">خطة نشطة ومتاحة</span>
                                    <span className="text-[10px] text-slate-500">تظهر في صفحة الأسعار وتطبيق الهاتف</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Card 2: Features Manager */}
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h2 className="text-base font-black text-white flex items-center gap-2">
                                <CheckCircle size={18} className="text-emerald-400" /> مميزات الباقة
                            </h2>
                            <span className="text-[11px] font-bold text-slate-500">
                                {formData.features?.length || 0} مميزات
                            </span>
                        </div>

                        {/* Quick Presets */}
                        <div className="space-y-2">
                            <span className="text-[11px] font-bold text-slate-400 block">
                                أضف مميزات سريعة بنقرة واحدة:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {FEATURE_PRESETS.map((preset, idx) => {
                                    const isIncluded = formData.features?.includes(preset);
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleAddPreset(preset)}
                                            disabled={isIncluded}
                                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                                                isIncluded
                                                    ? 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed'
                                                    : 'bg-slate-950/80 text-slate-300 hover:text-white border-slate-800 hover:border-amber-500/40 hover:bg-slate-900'
                                            }`}
                                        >
                                            {isIncluded ? <Check size={11} className="text-emerald-500" /> : <Plus size={11} />}
                                            <span>{preset}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Feature Inputs */}
                        <div className="space-y-2.5 pt-2">
                            {formData.features?.map((feature, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <span className="text-xs text-slate-500 font-mono w-5 text-center">
                                        {index + 1}
                                    </span>
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-all"
                                        placeholder={`ميزة رقم ${index + 1}`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(index)}
                                        className="p-2.5 rounded-xl bg-slate-950 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-900/40 transition-colors"
                                        title="حذف الميزة"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => addFeature("")}
                                className="w-full py-3 border border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-950/50 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                            >
                                <Plus size={15} />
                                <span>إضافة ميزة مخصصة أخرى</span>
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-gradient-to-r from-amber-500 via-rose-600 to-rose-700 hover:from-amber-400 hover:via-rose-500 hover:to-rose-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-rose-900/30 transition-all hover:scale-[1.008] disabled:opacity-50 text-sm sm:text-base cursor-pointer"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>جاري حفظ الخطة وتحديث المنصة...</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>{isEdit ? "حفظ التعديلات على الخطة" : "نشر الخطة وإتاحتها للجمهور"}</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Left Area: Live Interactive Card Preview (5 cols) */}
                <div className="lg:col-span-5 sticky top-24 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                            <Eye size={15} className="text-amber-400" /> معاينة حية لشكل الخطة على الموقع
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            مظهر المشترك
                        </span>
                    </div>

                    {/* Preview Card */}
                    <div className={`rounded-3xl p-7 relative transition-all duration-300 backdrop-blur-2xl border ${
                        formData.isActive 
                            ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/40 shadow-2xl shadow-amber-950/30' 
                            : 'bg-slate-950/90 border-slate-800 opacity-60'
                    }`}>
                        {/* Popular Badge */}
                        {formData.isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center gap-1.5">
                                <Star size={12} className="fill-slate-950" />
                                <span>الأكثر طلباً</span>
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 rounded-full bg-slate-800/80 text-amber-400 font-bold text-[11px] border border-amber-500/20">
                                باقة VIP مميزة
                            </span>
                            <Crown size={22} className="text-amber-400" />
                        </div>

                        <h3 className="text-2xl font-black text-white mb-2">
                            {formData.name || "اسم باقة الاشتراك"}
                        </h3>

                        <p className="text-xs text-slate-400 min-h-[36px] leading-relaxed mb-5">
                            {formData.description || "استمتع بمشاهدة بدون إعلانات وجودة فائقة مع تجربة أوتاكو لا مثيل لها."}
                        </p>

                        {/* Price Tag */}
                        <div className="flex items-baseline gap-1.5 pb-5 border-b border-slate-800">
                            <span className="text-4xl font-black text-white font-mono">
                                {formData.price || 0}
                            </span>
                            <span className="text-sm font-bold text-slate-400">
                                {currency} / {formData.duration || "30"} يوم
                            </span>
                        </div>

                        {/* Features Preview */}
                        <div className="space-y-3 py-5">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                المميزات المتضمنة:
                            </span>
                            <ul className="space-y-2.5">
                                {(formData.features || []).filter(Boolean).map((feat, idx) => (
                                    <li key={idx} className="text-slate-200 text-xs flex items-start gap-2.5">
                                        <CheckCircle size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                                        <span className="leading-relaxed">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Preview Subscribe Button */}
                        <div className="pt-2">
                            <div className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-center text-xs tracking-wide shadow-lg shadow-amber-500/20 pointer-events-none opacity-90">
                                اشترك الآن واستمتع بمزايا VIP
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </form>
    );
}
