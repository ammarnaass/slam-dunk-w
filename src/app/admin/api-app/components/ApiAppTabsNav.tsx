"use client";

import { AlertTriangle, RefreshCw, DollarSign, PlayCircle, Terminal } from "lucide-react";
import { TabType } from "../hooks/useApiAppSettings";

interface ApiAppTabsNavProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function ApiAppTabsNav({ activeTab, onTabChange }: ApiAppTabsNavProps) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
            <button
                onClick={() => onTabChange("maintenance")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === "maintenance"
                        ? "bg-slate-900 text-amber-400 border-amber-500"
                        : "text-slate-400 hover:text-white border-transparent"
                }`}
            >
                <AlertTriangle size={16} />
                <span>حالة التطبيق والصيانة</span>
            </button>

            <button
                onClick={() => onTabChange("versioning")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === "versioning"
                        ? "bg-slate-900 text-emerald-400 border-emerald-500"
                        : "text-slate-400 hover:text-white border-transparent"
                }`}
            >
                <RefreshCw size={16} />
                <span>الإصدارات والتحديث الإجباري</span>
            </button>

            <button
                onClick={() => onTabChange("monetization")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === "monetization"
                        ? "bg-slate-900 text-blue-400 border-blue-500"
                        : "text-slate-400 hover:text-white border-transparent"
                }`}
            >
                <DollarSign size={16} />
                <span>إعلانات AdMob والربحية</span>
            </button>

            <button
                onClick={() => onTabChange("player")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === "player"
                        ? "bg-slate-900 text-purple-400 border-purple-500"
                        : "text-slate-400 hover:text-white border-transparent"
                }`}
            >
                <PlayCircle size={16} />
                <span>مشغل الفيديو وسيرفرات البث</span>
            </button>

            <button
                onClick={() => onTabChange("endpoints")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === "endpoints"
                        ? "bg-slate-900 text-red-400 border-red-500"
                        : "text-slate-400 hover:text-white border-transparent"
                }`}
            >
                <Terminal size={16} />
                <span>أمان الـ API وفاحص الاتصال</span>
            </button>
        </div>
    );
}
