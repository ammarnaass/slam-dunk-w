"use client";

import React, { useState } from "react";
import { RefreshCw, Smartphone, Trash2, Plus } from "lucide-react";

interface VersioningTabProps {
    apiApp: {
        latestVersion?: string;
        latestBuild?: number;
        minSupportedVersion?: string;
        minSupportedBuild?: number;
        forceUpdate?: boolean;
        updateUrl?: string;
        directApkUrl?: string;
        releaseNotes?: string[];
    };
    onChange: (field: string, value: any) => void;
    onAddReleaseNote: (note: string) => void;
    onRemoveReleaseNote: (index: number) => void;
}

export function VersioningTab({
    apiApp,
    onChange,
    onAddReleaseNote,
    onRemoveReleaseNote
}: VersioningTabProps) {
    const [newReleaseNote, setNewReleaseNote] = useState("");

    const handleAdd = () => {
        if (!newReleaseNote.trim()) return;
        onAddReleaseNote(newReleaseNote.trim());
        setNewReleaseNote("");
    };

    return (
        <div className="space-y-6">
            {/* Force Update Toggle Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <div className={`p-3 rounded-2xl ${apiApp.forceUpdate ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-slate-800 text-slate-400"}`}>
                            <RefreshCw size={24} />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-white">
                                تفعيل التحديث الإجباري (Force Update)
                            </h2>
                            <p className="text-xs text-slate-400 mt-1 max-w-xl">
                                إلزام جميع مستخدمي الإصدارات الأقدم من أحدث إصدار بتحديث التطبيق فوراً قبل السماح لهم باستخدامه، مع ظهور زر التحميل المباشر.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => onChange("forceUpdate", !apiApp.forceUpdate)}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                            apiApp.forceUpdate ? "bg-red-600" : "bg-slate-800"
                        }`}
                    >
                        <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                                apiApp.forceUpdate ? "-translate-x-9" : "-translate-x-1"
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Version Control Matrix */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Smartphone size={16} className="text-emerald-400" />
                    <span>مصفوفة إصدارات التطبيق (App Versions)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            أحدث إصدار (Latest Version)
                        </label>
                        <input
                            type="text"
                            value={apiApp.latestVersion || ""}
                            onChange={(e) => onChange("latestVersion", e.target.value)}
                            placeholder="1.2.0"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            رقم الـ Build الأحدث
                        </label>
                        <input
                            type="number"
                            value={apiApp.latestBuild || 12}
                            onChange={(e) => onChange("latestBuild", Number(e.target.value))}
                            placeholder="12"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            أقل إصدار مدعوم (Min Version)
                        </label>
                        <input
                            type="text"
                            value={apiApp.minSupportedVersion || ""}
                            onChange={(e) => onChange("minSupportedVersion", e.target.value)}
                            placeholder="1.0.0"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            أقل Build مدعوم
                        </label>
                        <input
                            type="number"
                            value={apiApp.minSupportedBuild || 10}
                            onChange={(e) => onChange("minSupportedBuild", Number(e.target.value))}
                            placeholder="10"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* Download Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            رابط متجر Google Play
                        </label>
                        <input
                            type="text"
                            value={apiApp.updateUrl || ""}
                            onChange={(e) => onChange("updateUrl", e.target.value)}
                            placeholder="https://play.google.com/store/apps/details?id=com.slamdunk.app"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            رابط التحميل المباشر لملف الـ APK
                        </label>
                        <input
                            type="text"
                            value={apiApp.directApkUrl || ""}
                            onChange={(e) => onChange("directApkUrl", e.target.value)}
                            placeholder="https://slam-dunk-w.vercel.app/downloads/slamdunk-v1.2.0.apk"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* Release Notes List */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                    <label className="block text-xs font-semibold text-slate-300">
                        سجل التغييرات ومميزات التحديث الجديد (Release Notes)
                    </label>

                    <div className="space-y-2">
                        {Array.isArray(apiApp.releaseNotes) && apiApp.releaseNotes.map((note: string, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                                <div className="flex items-center gap-2 text-slate-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span>{note}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onRemoveReleaseNote(idx)}
                                    className="text-slate-500 hover:text-rose-400 p-1"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newReleaseNote}
                            onChange={(e) => setNewReleaseNote(e.target.value)}
                            placeholder="أضف ميزة جديدة (مثال: دعم المشاهدة بدقة 1080p)..."
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                            <Plus size={15} />
                            <span>إضافة</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
