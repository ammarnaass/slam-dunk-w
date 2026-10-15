"use client";

import { Crown, Calendar, XCircle } from "lucide-react";
import { EditUserFormData } from "../hooks/useEditUser";

interface EditUserSubscriptionCardProps {
    formData: EditUserFormData;
    setFormData: React.Dispatch<React.SetStateAction<EditUserFormData>>;
    handleSubscriptionExtend: (days: number, planName?: string) => void;
    cancelSubscription: () => void;
    remainingDays: number | null;
}

export function EditUserSubscriptionCard({
    formData,
    setFormData,
    handleSubscriptionExtend,
    cancelSubscription,
    remainingDays,
}: EditUserSubscriptionCardProps) {
    const isVip = formData.subscription.status === "ACTIVE";

    return (
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
                isVip
                    ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                    : "bg-slate-950/60 border-slate-800 text-slate-400"
            }`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300">الحالة الراهنة:</span>
                    <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                            isVip
                                ? "bg-amber-400 text-slate-950"
                                : "bg-slate-800 text-slate-400"
                        }`}>
                            {isVip ? "VIP نشط ومفعل" : "غير مفعل / منتهي"}
                        </span>
                    </div>
                </div>

                {isVip && formData.subscription.endDate && (
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
                        className="p-2.5 bg-slate-950 hover:bg-amber-500/10 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
                    >
                        <span>+ 30 يوم</span>
                        <span className="text-[10px] text-slate-500">شهر كامل</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSubscriptionExtend(90, "quarterly")}
                        className="p-2.5 bg-slate-950 hover:bg-amber-500/10 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
                    >
                        <span>+ 90 يوم</span>
                        <span className="text-[10px] text-slate-500">3 أشهر</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSubscriptionExtend(365, "yearly")}
                        className="p-2.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-black transition-all text-center flex flex-col items-center gap-1 shadow-sm cursor-pointer"
                    >
                        <span>+ 1 سنة (365 يوم)</span>
                        <span className="text-[10px] text-amber-400/80">سنوي ذهبي</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSubscriptionExtend(3650, "lifetime")}
                        className="p-2.5 bg-slate-950 hover:bg-amber-500/10 text-slate-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 col-span-2 sm:col-span-1 cursor-pointer"
                    >
                        <span>مدى الحياة</span>
                        <span className="text-[10px] text-slate-500">10 سنوات</span>
                    </button>

                    <button
                        type="button"
                        onClick={cancelSubscription}
                        className="p-2.5 bg-rose-950/20 hover:bg-rose-900/30 text-rose-300 border border-rose-900/40 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 col-span-2 cursor-pointer"
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
    );
}
