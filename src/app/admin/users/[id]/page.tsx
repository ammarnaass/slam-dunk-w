"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowRight, Shield, Star, Calendar } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        role: "USER" as "USER" | "ADMIN",
        password: "",
        subscription: {
            type: "FREE" as "FREE" | "PREMIUM",
            status: "EXPIRED" as "ACTIVE" | "EXPIRED",
            endDate: "",
        }
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/admin/users/${id}`);
                if (!res.ok) {
                    throw new Error("User not found");
                }
                const data = await res.json();

                setFormData({
                    username: data.name || data.username || "",
                    email: data.email,
                    role: data.role,
                    password: "",
                    subscription: {
                        type: data.subscription?.planType?.toUpperCase() || "FREE",
                        status: data.subscription?.isActive ? "ACTIVE" : "EXPIRED",
                        endDate: data.subscription?.endDate ? new Date(data.subscription.endDate).toISOString().split('T')[0] : "",
                    }
                });
            } catch (error) {
                setMsg({ type: "error", text: "فشل تحميل بيانات المستخدم" });
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg({ type: "", text: "" });

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "فشل التحديث");
            }

            setMsg({ type: "success", text: "تم تحديث المستخدم بنجاح" });
            setFormData(prev => ({ ...prev, password: "" })); // Clear password
            router.refresh();
        } catch (error: any) {
            setMsg({ type: "error", text: error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleSubscriptionChange = (days: number) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        setFormData({
            ...formData,
            subscription: {
                type: "PREMIUM",
                status: "ACTIVE",
                endDate: date.toISOString().split('T')[0] // YYYY-MM-DD
            }
        });
    };

    const cancelSubscription = () => {
        setFormData({
            ...formData,
            subscription: {
                ...formData.subscription,
                status: "EXPIRED",
            }
        });
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/users"
                    className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors text-white"
                >
                    <ArrowRight size={20} />
                </Link>
                <h1 className="text-3xl font-bold text-white">تعديل المستخدم</h1>
            </div>

            {msg.text && (
                <div className={`mb-6 p-4 rounded-lg text-center ${msg.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Basic Info */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-blue-500" /> المعلومات الأساسية
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">اسم المستخدم</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">الصلاحية (Role)</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as "ADMIN" | "USER" })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                            >
                                <option value="USER">مستخدم (USER)</option>
                                <option value="ADMIN">مدير (ADMIN)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">تغيير كلمة المرور (اختياري)</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                                placeholder="اتركه فارغاً إذا لم ترد التغيير"
                                minLength={6}
                            />
                        </div>
                    </div>
                </div>

                {/* Subscription Info */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Star size={20} className="text-yellow-500" /> إدارة الاشتراك
                    </h2>

                    <div className="space-y-4">
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-400">الحالة الحالية:</span>
                                <span className={`font-bold px-2 py-1 rounded text-sm ${formData.subscription.status === 'ACTIVE' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                    {formData.subscription.status === 'ACTIVE' ? 'نشط (Active)' : 'منتهي (Expired)'}
                                </span>
                            </div>
                            {formData.subscription.endDate && (
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">تاريخ الانتهاء:</span>
                                    <span className="text-white font-mono">{formData.subscription.endDate}</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleSubscriptionChange(30)}
                                className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg text-sm transition-colors border border-slate-700"
                            >
                                + 30 يوم
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSubscriptionChange(365)}
                                className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg text-sm transition-colors border border-slate-700"
                            >
                                + 1 سنة
                            </button>
                            <button
                                type="button"
                                onClick={cancelSubscription}
                                className="bg-red-900/30 hover:bg-red-900/50 text-red-200 p-2 rounded-lg text-sm transition-colors border border-red-900/50 col-span-2"
                            >
                                إلغاء الاشتراك
                            </button>
                        </div>

                        <div className="border-t border-slate-800 pt-4 mt-4">
                            <label className="block text-slate-400 mb-2 text-sm">تعديل يدوي لتاريخ الانتهاء</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="date"
                                    value={formData.subscription.endDate}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        subscription: { ...formData.subscription, endDate: e.target.value }
                                    })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-3 py-3 text-white focus:outline-none focus:border-red-600 appearance-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all hover:scale-[1.01]"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> حفظ التغييرات</>}
                    </button>
                </div>

            </form>
        </div>
    );
}
