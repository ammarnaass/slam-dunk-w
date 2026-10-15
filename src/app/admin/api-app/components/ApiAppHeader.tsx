"use client";

import { RefreshCw, Save, Check } from "lucide-react";

interface ApiAppHeaderProps {
    isMaintenance: boolean;
    saving: boolean;
    saveSuccess: boolean;
    onSubmit: () => void;
}

export function ApiAppHeader({
    isMaintenance,
    saving,
    saveSuccess,
    onSubmit,
}: ApiAppHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-1.5 h-6 bg-purple-600 rounded-full" />
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                        إعدادات تطبيق الأندرويد والربط البرمجي (API App)
                    </h1>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                    التحكم اللحظي في إتاحة التطبيق، التحديثات الإجبارية، شبكة إعلانات AdMob، ومسارات الربط البرمجي.
                </p>
            </div>

            <div className="flex items-center gap-3">
                {/* Status Pill */}
                <div
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold ${
                        isMaintenance
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    }`}
                >
                    <span
                        className={`w-2 h-2 rounded-full ${
                            isMaintenance ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                        }`}
                    />
                    <span>
                        {isMaintenance ? "التطبيق في وضع الصيانة" : "التطبيق نشط ويعمل"}
                    </span>
                </div>

                <button
                    onClick={onSubmit}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105 disabled:opacity-60 cursor-pointer"
                >
                    {saving ? (
                        <>
                            <RefreshCw size={15} className="animate-spin" />
                            <span>جاري الحفظ...</span>
                        </>
                    ) : saveSuccess ? (
                        <>
                            <Check size={15} className="text-emerald-300" />
                            <span>تم الحفظ بنجاح!</span>
                        </>
                    ) : (
                        <>
                            <Save size={15} />
                            <span>حفظ التعديلات</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
