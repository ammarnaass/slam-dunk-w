"use client";

import { useEffect, useState, useMemo } from "react";
import { Plan } from "@/types";
import { 
    Loader2, Plus, Edit, Trash2, CheckCircle, XCircle, 
    Crown, Sparkles, Star, Tag, ToggleLeft, ToggleRight, 
    Check, AlertCircle, Eye, ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export default function PlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState("ج.م");
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const showToast = (type: "success" | "error", text: string) => {
        setToast({ type, text });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchData = async () => {
        try {
            // Fetch Settings
            fetch("/api/settings").then(res => res.json()).then(data => {
                if (data.currency) setCurrency(data.currency);
            }).catch(console.error);

            // Fetch Plans
            const res = await fetch("/api/admin/plans");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            if (Array.isArray(data)) {
                setPlans(data);
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
            showToast("error", "فشل تحميل خطط الاشتراكات");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Toggle Plan Active State
    const handleToggleActive = async (plan: Plan) => {
        const newStatus = !plan.isActive;
        setTogglingId(plan.id);

        try {
            const res = await fetch(`/api/admin/plans/${plan.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: newStatus }),
            });

            if (!res.ok) throw new Error("فشل تبديل حالة الخطة");

            setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, isActive: newStatus } : p));
            showToast("success", newStatus ? `تم تفعيل خطة "${plan.name}" بنجاح` : `تم تعطيل خطة "${plan.name}"`);
        } catch (error: any) {
            console.error("Toggle error:", error);
            showToast("error", error.message || "حدث خطأ أثناء التبديل");
        } finally {
            setTogglingId(null);
        }
    };

    // Toggle Popular
    const handleTogglePopular = async (plan: Plan) => {
        const newPopular = !plan.isPopular;
        setTogglingId(plan.id);

        try {
            const res = await fetch(`/api/admin/plans/${plan.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPopular: newPopular }),
            });

            if (!res.ok) throw new Error("فشل تعيين شارة الأكثر طلباً");

            setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, isPopular: newPopular } : p));
            showToast("success", newPopular ? `تم وسم الخطة كـ "الأكثر طلباً"` : `تم إزالة وسم الأكثر طلباً`);
        } catch (error: any) {
            console.error("Popular toggle error:", error);
            showToast("error", "فشل تعيين الوسم");
        } finally {
            setTogglingId(null);
        }
    };

    // Delete Plan
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`هل أنت متأكد تماماً من حذف خطة "${name}"؟ لن يتمكن الزوار من الاشتراك بها.`)) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/plans/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setPlans(prev => prev.filter(p => p.id !== id));
                showToast("success", "تم حذف الخطة بنجاح");
            } else {
                showToast("error", "فشل حذف الخطة");
            }
        } catch (error) {
            console.error("Error deleting plan:", error);
            showToast("error", "حدث خطأ أثناء محاولة الحذف");
        } finally {
            setDeletingId(null);
        }
    };

    // Calculate Summary Stats
    const stats = useMemo(() => {
        const total = plans.length;
        const active = plans.filter(p => p.isActive).length;
        const popular = plans.find(p => p.isPopular)?.name || "غير محدد";
        return { total, active, popular };
    }, [plans]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                <p className="text-sm text-slate-400 font-bold">جاري تحميل خطط الاشتراكات...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Toast Message */}
            {toast && (
                <div className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all animate-in slide-in-from-bottom-5 duration-300 ${
                    toast.type === "success" 
                        ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-950/50" 
                        : "bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-950/50"
                }`}>
                    {toast.type === "success" ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm font-bold">{toast.text}</span>
                </div>
            )}

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/[0.08]">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-2 h-7 bg-gradient-to-b from-amber-500 to-rose-600 rounded-full shadow-lg shadow-amber-500/30" />
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                            إدارة خطط الاشتراكات المميزة
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                        تحكم شامل في باقات VIP والأسعار والمميزات المعروضة للجمهور في الموقع وتطبيق الهاتف.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/pricing"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition-all shadow-sm"
                    >
                        <Eye size={15} />
                        <span>معاينة صفحة الأسعار</span>
                        <ArrowUpRight size={13} />
                    </Link>

                    <Link
                        href="/admin/plans/new"
                        className="bg-gradient-to-r from-amber-500 via-rose-600 to-rose-700 hover:from-amber-400 hover:via-rose-500 hover:to-rose-600 text-white px-5 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-xl shadow-rose-900/30 hover:scale-[1.02] text-xs sm:text-sm"
                    >
                        <Plus size={18} />
                        <span>إنشاء خطة جديدة</span>
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 shadow-xl">
                    <span className="text-xs font-bold text-slate-400 block mb-1">إجمالي الخطط المعرفة</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-white">{stats.total}</span>
                        <span className="text-xs text-slate-500 font-semibold">باقة</span>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 shadow-xl">
                    <span className="text-xs font-bold text-emerald-400 block mb-1">الخطط المعروضة للجمهور</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-emerald-300">{stats.active}</span>
                        <span className="text-xs text-slate-500 font-semibold">مفعلة وتستقبل المشتركين</span>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 shadow-xl">
                    <span className="text-xs font-bold text-amber-400 block mb-1">الخطة الأكثر طلباً</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg sm:text-xl font-black text-amber-300 truncate">{stats.popular}</span>
                    </div>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    const isToggling = togglingId === plan.id;
                    const isDeleting = deletingId === plan.id;

                    return (
                        <div 
                            key={plan.id} 
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
                                        onClick={() => handleToggleActive(plan)}
                                        disabled={isToggling}
                                        className="min-h-[40px] flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        <span className={`w-2 h-2 rounded-full ${plan.isActive ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                                        <span>{plan.isActive ? 'معروضة للجمهور' : 'معطلة مخفية'}</span>
                                    </button>

                                    {/* Popular Toggle */}
                                    <button
                                        onClick={() => handleTogglePopular(plan)}
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
                                        onClick={() => handleDelete(plan.id, plan.name)}
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
                })}
            </div>

            {plans.length === 0 && (
                <div className="p-16 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-4">
                    <Crown size={36} className="mx-auto text-amber-400 mb-2" />
                    <h3 className="text-lg font-bold text-white">لا توجد خطط اشتراك مسجلة</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        قم بإضافة أول خطة اشتراك ليتمكن الزوار من الترقية إلى VIP عبر الموقع وتطبيق الهاتف.
                    </p>
                    <Link
                        href="/admin/plans/new"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20"
                    >
                        <Plus size={16} />
                        <span>إنشاء أول خطة الآن</span>
                    </Link>
                </div>
            )}
        </div>
    );
}
