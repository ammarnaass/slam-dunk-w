import React from "react";
import { Eye, Star, Crown, CheckCircle } from "lucide-react";
import { Plan } from "@/types";

interface PlanLiveCardPreviewProps {
    formData: Partial<Plan>;
    currency: string;
}

export const PlanLiveCardPreview: React.FC<PlanLiveCardPreviewProps> = ({
    formData,
    currency,
}) => {
    return (
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
            <div
                className={`rounded-3xl p-7 relative transition-all duration-300 backdrop-blur-2xl border ${
                    formData.isActive
                        ? "bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/40 shadow-2xl shadow-amber-950/30"
                        : "bg-slate-950/90 border-slate-800 opacity-60"
                }`}
            >
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
    );
};
