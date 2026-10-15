import Link from "next/link";
import { Star, CheckCircle, Edit, Trash2, Loader2 } from "lucide-react";
import { Plan } from "@/types";

interface PlanAdminCardProps {
    plan: Plan;
    currency: string;
    isToggling: boolean;
    isDeleting: boolean;
    onToggleActive: (plan: Plan) => void;
    onTogglePopular: (plan: Plan) => void;
    onDelete: (id: string, name: string) => void;
}

export function PlanAdminCard({
    plan,
    currency,
    isToggling,
    isDeleting,
    onToggleActive,
    onTogglePopular,
    onDelete,
}: PlanAdminCardProps) {
    return (
        <div 
            className={`rounded-2xl p-6 relative flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
                plan.isActive 
                    ? 'bg-gradient-to-b from-slate-900/95 to-slate-950 border border-amber-500/30 shadow-2xl shadow-amber-950/20 hover:border-amber-500/50 hover:-translate-y-1' 
                    : 'bg-slate-950/80 border border-slate-800/60 opacity-70 hover:opacity-90'
            }`}
        >
            {/* Popular Banner */}
            {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center gap-1.5">
                    <Star size={12} className="fill-slate-950" />
                    <span>الأكثر طلباً</span>
                </div>
            )}

            <div>
                {/* Top Controls */}
                <div className="flex justify-between items-start mb-4 pt-1">
                    <div>
                        <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-amber-400 transition-colors">
                            {plan.name}
                        </h3>
                        <div className="text-xs text-slate-400 mt-1 font-mono flex items-center gap-1">
                            <span>المدة:</span>
                            <strong className="text-slate-200">{plan.duration} يوم</strong>
                        </div>
                    </div>

                    {/* Price Badge */}
                    <div className="bg-slate-950/90 border border-slate-800 px-3.5 py-1.5 rounded-xl text-left">
                        <span className="text-lg font-black text-amber-400">
                            {plan.price}
                        </span>
                        <span className="text-xs text-slate-400 mr-1 font-bold">
                            {currency}
                        </span>
                    </div>
                </div>

                {/* Description */}
                {plan.description && (
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-white/[0.04]">
                        {plan.description}
                    </p>
                )}

                {/* Features List */}
                <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        المميزات المضمنة:
                    </span>
                    <ul className="space-y-2">
                        {(plan.features || []).slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="text-slate-300 text-xs flex items-start gap-2 leading-relaxed">
                                <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>{feature}</span>
                            </li>
                        ))}
                        {(plan.features || []).length > 4 && (
                            <li className="text-slate-500 text-[11px] italic pr-5">
                                + {(plan.features || []).length - 4} مميزات إضافية...
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
                {/* Toggles row */}
                <div className="flex items-center justify-between text-xs">
                    {/* Active Toggle */}
                    <button
                        onClick={() => onToggleActive(plan)}
                        disabled={isToggling}
                        className="min-h-[40px] flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <span className={`w-2 h-2 rounded-full ${plan.isActive ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        <span>{plan.isActive ? 'معروضة للجمهور' : 'معطلة مخفية'}</span>
                    </button>

                    {/* Popular Toggle */}
                    <button
                        onClick={() => onTogglePopular(plan)}
                        disabled={isToggling}
                        className={`min-h-[40px] text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            plan.isPopular 
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                                : 'text-slate-500 border-slate-800 hover:text-slate-300'
                        }`}
                    >
                        {plan.isPopular ? '★ الأكثر طلباً' : 'تعيين كأكثر طلباً'}
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Link
                        href={`/admin/plans/${plan.id}`}
                        className="flex-1 min-h-[44px] bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-center transition-all flex items-center justify-center gap-2 text-xs font-bold border border-slate-700/60 active:scale-95"
                    >
                        <Edit size={14} />
                        <span>تعديل الخطة</span>
                    </Link>

                    <button
                        onClick={() => onDelete(plan.id, plan.name)}
                        disabled={isDeleting}
                        className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 transition-colors border border-rose-900/30 disabled:opacity-50 active:scale-95 cursor-pointer"
                        title="حذف الخطة"
                    >
                        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
