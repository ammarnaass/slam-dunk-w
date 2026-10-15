"use client";

import { use } from "react";
import { Loader2, Save } from "lucide-react";
import { useEditUser } from "./hooks/useEditUser";
import { EditUserHeader } from "./components/EditUserHeader";
import { EditUserAlert } from "./components/EditUserAlert";
import { EditUserSummaryCard } from "./components/EditUserSummaryCard";
import { EditUserAccountCard } from "./components/EditUserAccountCard";
import { EditUserSubscriptionCard } from "./components/EditUserSubscriptionCard";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const {
        loading,
        saving,
        showPassword,
        setShowPassword,
        msg,
        rawUser,
        formData,
        setFormData,
        handleSubmit,
        handleSubscriptionExtend,
        cancelSubscription,
        remainingDays,
    } = useEditUser(id);

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
            <EditUserHeader id={id} />

            <EditUserAlert msg={msg} />

            <EditUserSummaryCard formData={formData} rawUser={rawUser} />

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <EditUserAccountCard
                        formData={formData}
                        setFormData={setFormData}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />

                    <EditUserSubscriptionCard
                        formData={formData}
                        setFormData={setFormData}
                        handleSubscriptionExtend={handleSubscriptionExtend}
                        cancelSubscription={cancelSubscription}
                        remainingDays={remainingDays}
                    />
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
