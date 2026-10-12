"use client";

import React from "react";
import { Globe, Check, Copy, Zap, RefreshCw, Terminal, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

interface EndpointsDocTabProps {
    apiApp: {
        apiUrl?: string;
        apiKey?: string;
    };
    onChange: (field: string, value: any) => void;
    onCopy: (text: string, fieldId: string) => void;
    copiedField: string | null;
    testingApi: boolean;
    apiTestResult: {
        status: number;
        latency: number;
        success: boolean;
        data?: any;
        error?: string;
    } | null;
    onRunLiveTest: () => void;
}

export function EndpointsDocTab({
    apiApp,
    onChange,
    onCopy,
    copiedField,
    testingApi,
    apiTestResult,
    onRunLiveTest
}: EndpointsDocTabProps) {
    return (
        <div className="space-y-6">
            {/* Connection Strings */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe size={16} className="text-red-500" />
                    <span>روابط الربط البرمجي ومفاتيح الأمان</span>
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            الرابط الأساسي لـ API التطبيق (Base URL)
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={apiApp.apiUrl || "https://slam-dunk-w.vercel.app/api/mobile/v1"}
                                onChange={(e) => onChange("apiUrl", e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-purple-400 focus:outline-none focus:border-red-500"
                            />
                            <button
                                type="button"
                                onClick={() => onCopy(apiApp.apiUrl || "https://slam-dunk-w.vercel.app/api/mobile/v1", "baseUrl")}
                                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                                title="نسخ الرابط"
                            >
                                {copiedField === "baseUrl" ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            مفتاح الأمان السري للتطبيق (App API Key)
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={apiApp.apiKey || "slam_live_app_key_2026"}
                                onChange={(e) => onChange("apiKey", e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-amber-400 focus:outline-none focus:border-red-500"
                            />
                            <button
                                type="button"
                                onClick={() => onCopy(apiApp.apiKey || "slam_live_app_key_2026", "apiKey")}
                                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                                title="نسخ المفتاح"
                            >
                                {copiedField === "apiKey" ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Endpoints Table & Tester */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Zap size={16} className="text-amber-400" />
                            <span>فاحص الاتصال المباشر (Live API Tester)</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            اختبار مباشر لنقطة النهاية `/api/mobile/v1/config` وقياس زمن الاستجابة.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onRunLiveTest}
                        disabled={testingApi}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 cursor-pointer disabled:opacity-50"
                    >
                        {testingApi ? <RefreshCw size={14} className="animate-spin text-amber-400" /> : <Terminal size={14} className="text-amber-400" />}
                        <span>فحص اتصال الـ API الآن</span>
                    </button>
                </div>

                {/* Test Result Viewport */}
                {apiTestResult && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ${
                                    apiTestResult.success ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                }`}>
                                    {apiTestResult.success ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                                    HTTP {apiTestResult.status} {apiTestResult.success ? "OK" : "ERROR"}
                                </span>
                                <span className="text-xs font-mono text-slate-400">
                                    سرعة الاستجابة: <strong className="text-white">{apiTestResult.latency} ms</strong>
                                </span>
                            </div>

                            <span className="text-[11px] text-slate-500">
                                /api/mobile/v1/config
                            </span>
                        </div>

                        <div className="max-h-60 overflow-y-auto rounded-lg bg-black/60 p-3 text-[11px] font-mono text-emerald-300 border border-white/5 scrollbar-thin">
                            <pre className="whitespace-pre-wrap">
                                {JSON.stringify(apiTestResult.data || apiTestResult, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}

                {/* Endpoints Directory */}
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                        <thead>
                            <tr className="text-slate-400 border-b border-slate-800 pb-2">
                                <th className="py-2.5 pr-2 font-semibold">المسار</th>
                                <th className="py-2.5 font-semibold">النوع</th>
                                <th className="py-2.5 font-semibold">الوصف</th>
                                <th className="py-2.5 pl-2 text-left font-semibold">معاينة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                            <tr className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3 pr-2 text-white">/api/mobile/v1/config</td>
                                <td className="py-3 text-emerald-400 font-bold">GET</td>
                                <td className="py-3 text-slate-400 font-sans">فحص الصيانة والتحديثات والإعلانات</td>
                                <td className="py-3 pl-2 text-left">
                                    <a href="/api/mobile/v1/config" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">
                                        <span>فتح</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3 pr-2 text-white">/api/mobile/v1/home</td>
                                <td className="py-3 text-emerald-400 font-bold">GET</td>
                                <td className="py-3 text-slate-400 font-sans">السلايدر وأحدث الحلقات والرائج</td>
                                <td className="py-3 pl-2 text-left">
                                    <a href="/api/mobile/v1/home" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">
                                        <span>فتح</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3 pr-2 text-white">/api/mobile/v1/animes</td>
                                <td className="py-3 text-emerald-400 font-bold">GET</td>
                                <td className="py-3 text-slate-400 font-sans">دليل الأنميات والمسلسلات والأفلام</td>
                                <td className="py-3 pl-2 text-left">
                                    <a href="/api/mobile/v1/animes" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">
                                        <span>فتح</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3 pr-2 text-white">/api/mobile/v1/characters</td>
                                <td className="py-3 text-emerald-400 font-bold">GET</td>
                                <td className="py-3 text-slate-400 font-sans">قائمة لاعبي وشخصيات سلام دانك</td>
                                <td className="py-3 pl-2 text-left">
                                    <a href="/api/mobile/v1/characters" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">
                                        <span>فتح</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
