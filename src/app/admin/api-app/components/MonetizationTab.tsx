"use client";

import React from "react";
import { DollarSign, Sparkles } from "lucide-react";

interface MonetizationTabProps {
    admob: {
        isEnabled?: boolean;
        appId?: string;
        bannerId?: string;
        interstitialId?: string;
        rewardedId?: string;
    };
    interstitialInterval?: number;
    onAdmobChange: (field: string, value: any) => void;
    onApiAppChange: (field: string, value: any) => void;
}

export function MonetizationTab({
    admob,
    interstitialInterval = 2,
    onAdmobChange,
    onApiAppChange
}: MonetizationTabProps) {
    const fillTestIds = () => {
        onAdmobChange("appId", "ca-app-pub-3940256099942544~3347511713");
        onAdmobChange("bannerId", "ca-app-pub-3940256099942544/6300978111");
        onAdmobChange("interstitialId", "ca-app-pub-3940256099942544/1033173712");
        onAdmobChange("rewardedId", "ca-app-pub-3940256099942544/5224354917");
    };

    return (
        <div className="space-y-6">
            {/* AdMob Toggle Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <div className={`p-3 rounded-2xl ${admob.isEnabled ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-slate-800 text-slate-400"}`}>
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-white">
                                تفعيل شبكة إعلانات Google AdMob
                            </h2>
                            <p className="text-xs text-slate-400 mt-1 max-w-xl">
                                عرض الإعلانات البانر والإعلانات البينية ومكافآت الفيديو داخل تطبيق الأندرويد.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onAdmobChange("isEnabled", !admob.isEnabled)}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                            admob.isEnabled ? "bg-blue-600" : "bg-slate-800"
                        }`}
                    >
                        <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                                admob.isEnabled ? "-translate-x-9" : "-translate-x-1"
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Ad Units Configuration */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles size={16} className="text-blue-400" />
                        <span>معرفات الوحدات الإعلانية (Ad Units)</span>
                    </h3>

                    <button
                        type="button"
                        onClick={fillTestIds}
                        className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline cursor-pointer"
                    >
                        ملء بمعرفات جوجل التجريبية (Test IDs)
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            معرف تطبيق AdMob (App ID)
                        </label>
                        <input
                            type="text"
                            value={admob.appId || ""}
                            onChange={(e) => onAdmobChange("appId", e.target.value)}
                            placeholder="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                إعلان البانر (Banner Unit ID)
                            </label>
                            <input
                                type="text"
                                value={admob.bannerId || ""}
                                onChange={(e) => onAdmobChange("bannerId", e.target.value)}
                                placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                الإعلان البيني (Interstitial Unit ID)
                            </label>
                            <input
                                type="text"
                                value={admob.interstitialId || ""}
                                onChange={(e) => onAdmobChange("interstitialId", e.target.value)}
                                placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/wwwwwwwwww"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                إعلان المكافأة (Rewarded Video Unit ID)
                            </label>
                            <input
                                type="text"
                                value={admob.rewardedId || ""}
                                onChange={(e) => onAdmobChange("rewardedId", e.target.value)}
                                placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/vvvvvvvvvv"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                الفاصل الزمني للإعلان البيني (بعدد الحلقات)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={interstitialInterval}
                                onChange={(e) => onApiAppChange("interstitialInterval", Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                            />
                            <span className="text-[10px] text-slate-500 mt-1 block">
                                مثال: القيمة 2 تعني ظهور إعلان بيني كل حلقتين يفتحهما المستخدم.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
