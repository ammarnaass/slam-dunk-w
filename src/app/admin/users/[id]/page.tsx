"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { 
    Loader2, Save, ArrowRight, Shield, Star, Calendar, 
    Crown, CheckCircle2, AlertCircle, Eye, EyeOff, User as UserIcon,
    Sparkles, Clock, Check, RefreshCw, XCircle
} from "lucide-react";
import Link from "next/link";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [rawUser, setRawUser] = useState<any>(null);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        role: "USER" as "USER" | "ADMIN",
        password: "",
        subscription: {
            type: "PREMIUM" as "FREE" | "PREMIUM",
            planType: "monthly",
            status: "EXPIRED" as "ACTIVE" | "EXPIRED",
            isActive: false,
            endDate: "",
        }
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/admin/users/${id}`);
                if (!res.ok) {
                    throw new Error("لم يتم العثور على المستخدم");
                }
                const data = await res.json();
                setRawUser(data);

                const isVip = Boolean(data.subscription?.isActive);
                const endDateStr = data.subscription?.endDate 
                    ? new Date(data.subscription.endDate).toISOString().split('T')[0] 
                    : "";

                setFormData({
                    username: data.name || data.username || "",
                    email: data.email || "",
                    role: (data.role || "USER").toUpperCase() as "USER" | "ADMIN",
                    password: "",
                    subscription: {
                        type: isVip ? "PREMIUM" : "FREE",
                        planType: data.subscription?.planType || "monthly",
                        status: isVip ? "ACTIVE" : "EXPIRED",
                        isActive: isVip,
                        endDate: endDateStr,
                    }
                });
            } catch (error: any) {
                setMsg({ type: "error", text: error.message || "فشل تحميل بيانات المستخدم" });
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg(null);

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    role: formData.role,
                    password: formData.password || undefined,
                    subscription: {
                        type: formData.subscription.type,
                        planType: formData.subscription.planType,
                        status: formData.subscription.status,
                        isActive: formData.subscription.status === "ACTIVE",
                        endDate: formData.subscription.endDate || null,
                    }
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "فشل حفظ التعديلات");
            }

            setMsg({ type: "success", text: "تم تحديث بيانات المستخدم وصلاحياته بنجاح!" });
            setFormData(prev => ({ ...prev, password: "" }));
            setRawUser((prev: any) => ({ ...prev, ...data }));
            router.refresh();
        } catch (error: any) {
            setMsg({ type: "error", text: error.message || "حدث خطأ أثناء الحفظ" });
        } finally {
            setSaving(false);
        }
    };

    // Calculate remaining days
    const calculateRemainingDays = (dateStr: string) => {
        if (!dateStr) return null;
        const end = new Date(dateStr);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    // Preset Subscription Extenders
    const handleSubscriptionExtend = (days: number, planName: string = "monthly") => {
        const baseDate = formData.subscription.endDate && new Date(formData.subscription.endDate) > new Date()
            ? new Date(formData.subscription.endDate)
            : new Date();

        baseDate.setDate(baseDate.getDate() + days);
        const formattedDate = baseDate.toISOString().split('T')[0];

        setFormData(prev => ({
            ...prev,
            subscription: {
                ...prev.subscription,
                type: "PREMIUM",
                planType: planName,
                status: "ACTIVE",
                isActive: true,
                endDate: formattedDate
            }
        }));
    };

    const cancelSubscription = () => {
        setFormData(prev => ({
            ...prev,
            subscription: {
                ...prev.subscription,
                type: "FREE",
                planType: "free",
                status: "EXPIRED",
                isActive: false,
                endDate: ""
            }
        }));
    };

    const remainingDays = formData.subscription.status === "ACTIVE" 
        ? calculateRemainingDays(formData.subscription.endDate) 
        : null;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 rounded-full border-4 border-rose-600/20 border-t-rose-600 animate-spin" />
                <p className="text-sm text-slate-400 font-bold">جاري تحميل ملف العضو...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/users"
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                        title="العودة لقائمة المستخدمين"
                    >
                        <ArrowRight size={18} />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                            تعديل وترقية حساب العضو
                        </h1>
                        <p className="text-xs text-slate-400">
                            إدارة الصلاحيات والاشتراكات والبيانات الشخصية
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
                        ID: {id.slice(0, 8)}...
                    </span>
                </div>
            </div>

            {/* Notification Alert */}
            {msg && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 border shadow-xl animate-in slide-in-from-top-2 duration-300 ${
                    msg.type === "success" 
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30" 
                        : "bg-rose-950/80 text-rose-300 border-rose-500/30"
                }`}>
                    {msg.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                    <span className="text-sm font-bold">{msg.text}</span>
                </div>
            )}

            {/* User Profile Summary Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 border border-white/[0.08] shadow-2xl">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <div className="relative">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black uppercase shrink-0 border-2 shadow-xl ${
                            formData.subscription.status === "ACTIVE"
                                ? "bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 border-amber-300/60 shadow-amber-500/20"
                                : formData.role === "ADMIN"
                                    ? "bg-gradient-to-tr from-rose-600 to-rose-400 text-white border-rose-300/40 shadow-rose-600/20"
                                    : "bg-slate-800 text-slate-300 border-white/10"
                        }`}>
                            {rawUser?.avatar ? (
                                <img 
                                    src={rawUser.avatar} 
                                    alt={formData.username} 
                                    className="w-full h-full object-cover rounded-2xl" 
                                />
                            ) : (
                                (formData.username || "U")[0]
                            )}
                        </div>
                        {formData.subscription.status === "ACTIVE" && (
                            <span className="absolute -top-2 -right-2 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-slate-950 shadow-md">
                                <Crown size={15} />
                            </span>
                        )}
                    </div>

                    <div className="text-center sm:text-right flex-1">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                            <h2 className="text-xl sm:text-2xl font-black text-white">
                                {formData.username || "عضو"}
                            </h2>
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                                formData.role === "ADMIN"
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                    : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                            }`}>
                                {formData.role === "ADMIN" ? "مدير نظام" : "مستخدم عادي"}
                            </span>
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                                formData.subscription.status === "ACTIVE"
                                    ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                    : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}>
                                {formData.subscription.status === "ACTIVE" ? "VIP نشط" : "عضوية مجانية"}
                            </span>
                        </div>

                        <p className="text-xs text-slate-400 font-mono mb-3">
                            {formData.email}
                        </p>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500">
                            <span>تاريخ الانضمام: {rawUser?.createdAt ? new Date(rawUser.createdAt).toLocaleDateString("ar-EG") : "—"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Left Column: Basic Info & Role */}
                    <div className="space-y-6">
                        {/* 1. Basic Info */}
                        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                            <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                                <UserIcon size={18} className="text-blue-400" /> المعلومات الأساسية
                            </h2>

                            <div>
                                <label className="block text-slate-300 text-xs font-bold mb-2">اسم المستخدم / العرض</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-medium"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-xs font-bold mb-2">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-mono"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-xs font-bold mb-2">
                                    تغيير كلمة المرور <span className="text-slate-500 font-normal">(اتركه فارغاً للإبقاء عليها)</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-4 pl-11 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-mono"
                                        placeholder="••••••••"
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 2. Role & Permissions Management */}
                        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                            <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                                <Shield size={18} className="text-rose-400" /> إدارة الصلاحيات (Role)
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Regular User Option */}
                                <div 
                                    onClick={() => setFormData({ ...formData, role: "USER" })}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                        formData.role === "USER"
                                            ? "bg-blue-950/30 border-blue-500 text-white shadow-lg shadow-blue-950/40"
                                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-xs sm:text-sm text-white">مستخدم عادي (USER)</span>
                                        {formData.role === "USER" && <CheckCircle2 size={16} className="text-blue-400" />}
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">
                                        تصفح مكتبة الأنمي، مشاهدة الحلقات، إنشاء قوائم المتابعة والتعليق.
                                    </p>
                                </div>

                                {/* Admin Option */}
                                <div 
                                    onClick={() => setFormData({ ...formData, role: "ADMIN" })}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                        formData.role === "ADMIN"
                                            ? "bg-rose-950/30 border-rose-500 text-white shadow-lg shadow-rose-950/40"
                                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-xs sm:text-sm text-white">مدير نظام (ADMIN)</span>
                                        {formData.role === "ADMIN" && <CheckCircle2 size={16} className="text-rose-400" />}
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">
                                        صلاحيات كاملة للوحة التحكم: إدارة المحتوى، المشتركين، الخطط والإعدادات.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Premium VIP Subscription Management */}
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 shadow-xl space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h2 className="text-base font-black text-white flex items-center gap-2">
                                <Crown size={18} className="text-amber-400" /> ترقية وإدارة اشتراك VIP
                            </h2>
                            <span className="text-xs font-bold text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                                وصول بدون إعلانات
                            </span>
                        </div>

                        {/* Subscription Status Pill */}
                        <div className={`p-4 rounded-xl border transition-all ${
                            formData.subscription.status === "ACTIVE"
                                ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                                : "bg-slate-950/60 border-slate-800 text-slate-400"
                        }`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-300">الحالة الراهنة:</span>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                                        formData.subscription.status === "ACTIVE"
                                            ? "bg-amber-400 text-slate-950"
                                            : "bg-slate-800 text-slate-400"
                                    }`}>
                                        {formData.subscription.status === "ACTIVE" ? "VIP نشط ومفعل" : "غير مفعل / منتهي"}
                                    </span>
                                </div>
                            </div>

                            {formData.subscription.status === "ACTIVE" && formData.subscription.endDate && (
                                <div className="flex items-center justify-between text-xs pt-2 border-t border-amber-500/20">
                                    <span className="text-slate-400">ينتهي بتاريخ:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-white font-bold">{formData.subscription.endDate}</span>
                                        {remainingDays !== null && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                                متبقي {remainingDays} يوم
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Presets Extension Buttons */}
                        <div className="space-y-2.5">
                            <label className="block text-slate-300 text-xs font-bold">
                                ترقية سريعة / تمديد الاشتراك:
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleSubscriptionExtend(30, "monthly")}
                                    className="p-2.5 bg-slate-950 hover:bg-amber-500/10 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1"
                                >
                                    <span>+ 30 يوم</span>
                                    <span className="text-[10px] text-slate-500">شهر كامل</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleSubscriptionExtend(90, "quarterly")}
                                    className="p-2.5 bg-slate-950 hover:bg-amber-500/10 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1"
                                >
                                    <span>+ 90 يوم</span>
                                    <span className="text-[10px] text-slate-500">3 أشهر</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleSubscriptionExtend(365, "yearly")}
                                    className="p-2.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-black transition-all text-center flex flex-col items-center gap-1 shadow-sm"
                                >
                                    <span>+ 1 سنة (365 يوم)</span>
                                    <span className="text-[10px] text-amber-400/80">سنوي ذهبي</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleSubscriptionExtend(3650, "lifetime")}
                                    className="p-2.5 bg-slate-950 hover:bg-amber-500/10 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 col-span-2 sm:col-span-1"
                                >
                                    <span>مدى الحياة</span>
                                    <span className="text-[10px] text-slate-500">10 سنوات</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={cancelSubscription}
                                    className="p-2.5 bg-rose-950/20 hover:bg-rose-900/30 text-rose-300 border border-rose-900/40 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 col-span-2"
                                >
                                    <XCircle size={14} />
                                    <span>إلغاء اشتراك VIP وتعطيله</span>
                                </button>
                            </div>
                        </div>

                        {/* Manual Date Picker */}
                        <div className="border-t border-slate-800 pt-4 space-y-2">
                            <label className="block text-slate-300 text-xs font-bold">
                                تحديد أو تعديل تاريخ انتهاء الاشتراك يدوياً:
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={17} />
                                <input
                                    type="date"
                                    value={formData.subscription.endDate}
                                    onChange={(e) => {
                                        const newDate = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            subscription: {
                                                ...prev.subscription,
                                                endDate: newDate,
                                                status: newDate ? "ACTIVE" : "EXPIRED",
                                                isActive: !!newDate
                                            }
                                        }));
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Save Button */}
                <div className="pt-4 border-t border-white/[0.08]">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-gradient-to-r from-amber-500 via-rose-600 to-rose-700 hover:from-amber-400 hover:via-rose-500 hover:to-rose-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-rose-900/25 transition-all hover:scale-[1.008] disabled:opacity-50 text-sm sm:text-base cursor-pointer"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>جاري حفظ التغييرات...</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>حفظ وتحديث حساب العضو والاشتراك</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
