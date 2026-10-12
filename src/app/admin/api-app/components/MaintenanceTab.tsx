"use client";

import React from "react";
import { AlertTriangle, Shield, Check, Copy } from "lucide-react";

interface MaintenanceTabProps {
    apiApp: {
        isMaintenance?: boolean;
        maintenanceTitle?: string;
        maintenanceMessage?: string;
        maintenanceEndTime?: string;
        devBypassKey?: string;
    };
    onChange: (field: string, value: any) => void;
    onCopy: (text: string, fieldId: string) => void;
    copiedField: string | null;
}

export function MaintenanceTab({
    apiApp,
    onChange,
    onCopy,
    copiedField
}: MaintenanceTabProps) {
    return (
        <div className="space-y-6">
            {/* Big Switch Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <div className={`p-3 rounded-2xl ${apiApp.isMaintenance ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-slate-800 text-slate-400"}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-white">
                                تفعيل وضع الصيانة للتطبيق (Maintenance Mode)
                            </h2>
                            <p className="text-xs text-slate-400 mt-1 max-w-xl">
                                عند التفعيل، سيتم إيقاف عمل تطبيق الأندرويد فورياً وعرض شاشة الصيانة المخصصة لجميع المستخدمين لمنع حدوث أخطاء أثناء ترقية الخوادم.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onChange("isMaintenance", !apiApp.isMaintenance)}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                            apiApp.isMaintenance ? "bg-amber-600" : "bg-slate-800"
                        }`}
                    >
                        <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                                apiApp.isMaintenance ? "-translate-x-9" : "-translate-x-1"
                            }`}
                        />
                    </button>
                </div>

                {apiApp.isMaintenance && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        <span>تنبيه: التطبيق الآن معطّل للمستخدمين، وتظهر لهم الرسالة المحددة أدناه.</span>
                    </div>
                )}
            </div>

            {/* Maintenance Details */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield size={16} className="text-amber-400" />
                    <span>تخصيص شاشة الصيانة</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">
                            عنوان شاشة الصيانة
                        </label>
                        <input
                            type="text"
                            value={apiApp.maintenanceTitle || ""}
                            onChange={(e) => onChange("maintenanceTitle", e.target.value)}
                            placeholder="صيانة دورية مجدولة"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">
                            الوقت المتوقع للعودة (اختياري)
                        </label>
                        <input
                            type="text"
                            value={apiApp.maintenanceEndTime || ""}
                            onChange={(e) => onChange("maintenanceEndTime", e.target.value)}
                            placeholder="مثال: خلال ساعتين، أو 2026-10-10 18:00"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                        رسالة وتفاصيل الصيانة للمستخدمين
                    </label>
                    <textarea
                        value={apiApp.maintenanceMessage || ""}
                        onChange={(e) => onChange("maintenanceMessage", e.target.value)}
                        rows={3}
                        placeholder="التطبيق قيد الصيانة والترقية حالياً لتقديم تجربة بث أسرع وأفضل. سنعود قريباً جداً!"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                    />
                </div>

                <div className="pt-2 border-t border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <span className="text-xs font-bold text-white block">
                                كود تجاوز الصيانة للمطورين (Dev Bypass Key)
                            </span>
                            <span className="text-[11px] text-slate-500">
                                يسمح للمطورين ومختبري التطبيق بإدخال هذا الكود لتخطي شاشة الصيانة وتجربة التطبيق.
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={apiApp.devBypassKey || ""}
                                onChange={(e) => onChange("devBypassKey", e.target.value)}
                                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500"
                            />
                            <button
                                type="button"
                                onClick={() => onCopy(apiApp.devBypassKey || "SLAM_DEV_2026", "devKey")}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="نسخ الكود"
                            >
                                {copiedField === "devKey" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
