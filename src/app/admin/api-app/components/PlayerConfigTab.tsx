"use client";

import React from "react";
import { PlayCircle } from "lucide-react";

interface PlayerConfigTabProps {
    apiApp: {
        defaultServer?: string;
        defaultQuality?: string;
        allowDownloads?: boolean;
    };
    onChange: (field: string, value: any) => void;
}

export function PlayerConfigTab({
    apiApp,
    onChange
}: PlayerConfigTabProps) {
    return (
        <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <PlayCircle size={16} className="text-purple-400" />
                    <span>إعدادات مشغل الفيديو وسيرفرات الهاتف</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            السيرفر الافتراضي في التطبيق
                        </label>
                        <select
                            value={apiApp.defaultServer || "Mega"}
                            onChange={(e) => onChange("defaultServer", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                        >
                            <option value="Mega">سيرفر Mega (الأسرع)</option>
                            <option value="Drive">سيرفر Google Drive</option>
                            <option value="Vidmoly">سيرفر Vidmoly</option>
                            <option value="FastServer">سيرفر FastServer المباشر</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            الجودة الافتراضية للبث
                        </label>
                        <select
                            value={apiApp.defaultQuality || "720p"}
                            onChange={(e) => onChange("defaultQuality", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                        >
                            <option value="1080p">FHD 1080p (أعلى دقة)</option>
                            <option value="720p">HD 720p (موصى بها)</option>
                            <option value="480p">SD 480p (توفير البيانات)</option>
                            <option value="auto">تلقائي حسب سرعة الإنترنت</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            التحميل الداخلي على الهاتف
                        </label>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-xs text-slate-300">السماح بتنزيل الحلقات</span>
                            <button
                                type="button"
                                onClick={() => onChange("allowDownloads", !apiApp.allowDownloads)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                    apiApp.allowDownloads ? "bg-purple-600" : "bg-slate-800"
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        apiApp.allowDownloads ? "-translate-x-6" : "-translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
