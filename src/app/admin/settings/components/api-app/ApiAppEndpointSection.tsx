"use client";

import React from "react";
import { KeyRound, Copy, Check } from "lucide-react";
import { ApiAppConfig } from "@/server/types/settings.types";

interface ApiAppEndpointSectionProps {
    data: ApiAppConfig;
    updateField: <K extends keyof ApiAppConfig>(field: K, value: ApiAppConfig[K]) => void;
    copiedKey: string | null;
    handleCopy: (text: string, keyName: string) => void;
}

export function ApiAppEndpointSection({
    data,
    updateField,
    copiedKey,
    handleCopy,
}: ApiAppEndpointSectionProps) {
    return (
        <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                <KeyRound size={18} className="text-[#ffb95f]" />
                <h3 className="font-cairo font-bold text-white text-sm">بيانات مسار الـ API والمصادقة (API Endpoint & Key)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">مسار الـ API الأساسي</label>
                    <input
                        type="text"
                        value={data.apiUrl}
                        onChange={(e) => updateField("apiUrl", e.target.value)}
                        placeholder="https://slam-dunk-w.vercel.app/api/mobile/v1"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#ffb95f]"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-tajawal text-[#94a3b8]">مفتاح المصادقة (App API Key)</label>
                        <button
                            type="button"
                            onClick={() => handleCopy(data.apiKey, "apikey")}
                            className="text-[10px] text-[#ffb95f] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                            {copiedKey === "apikey" ? <Check size={11} /> : <Copy size={11} />}
                            <span>{copiedKey === "apikey" ? "تم النسخ" : "نسخ المفتاح"}</span>
                        </button>
                    </div>
                    <input
                        type="text"
                        value={data.apiKey}
                        onChange={(e) => updateField("apiKey", e.target.value)}
                        placeholder="slam_live_app_key_2026"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono font-bold text-[#ffb95f] focus:outline-none focus:border-[#ffb95f]"
                    />
                </div>
            </div>
        </div>
    );
}
