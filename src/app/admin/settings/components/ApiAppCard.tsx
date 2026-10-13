"use client";

import { useState } from "react";
import { 
    Smartphone, 
    Activity, 
    RotateCcw, 
    CheckCircle2, 
    AlertTriangle 
} from "lucide-react";
import { ApiAppConfig } from "@/server/types/settings.types";
import { DEFAULT_API_APP_CONFIG } from "@/lib/app-presets";

// Modularized ApiApp Sections
import { ApiAppMaintenanceSection } from "./api-app/ApiAppMaintenanceSection";
import { ApiAppVersionSection } from "./api-app/ApiAppVersionSection";
import { ApiAppReleaseNotesSection } from "./api-app/ApiAppReleaseNotesSection";
import { ApiAppStreamingSection } from "./api-app/ApiAppStreamingSection";
import { ApiAppEndpointSection } from "./api-app/ApiAppEndpointSection";
import { ApiAppPhoneSimulator } from "./api-app/ApiAppPhoneSimulator";

interface ApiAppCardProps {
    apiApp?: ApiAppConfig;
    onChange: (updated: ApiAppConfig) => void;
}

export default function ApiAppCard({ apiApp, onChange }: ApiAppCardProps) {
    const data: ApiAppConfig = apiApp || DEFAULT_API_APP_CONFIG;
    const [simScreen, setSimScreen] = useState<"feed" | "maintenance" | "update">("feed");
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [healthStatus, setHealthStatus] = useState<{ loading: boolean; text: string; success?: boolean } | null>(null);

    const updateField = <K extends keyof ApiAppConfig>(field: K, value: ApiAppConfig[K]) => {
        onChange({
            ...data,
            [field]: value
        });
    };

    const handleCopy = (text: string, keyName: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(keyName);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    // Release Notes Handlers
    const addReleaseNote = () => {
        const current = Array.isArray(data.releaseNotes) ? data.releaseNotes : [];
        updateField("releaseNotes", [...current, "ميزة وتحسين جديد في الأداء"]);
    };

    const updateReleaseNote = (index: number, val: string) => {
        const current = [...(Array.isArray(data.releaseNotes) ? data.releaseNotes : [])];
        current[index] = val;
        updateField("releaseNotes", current);
    };

    const removeReleaseNote = (index: number) => {
        const current = [...(Array.isArray(data.releaseNotes) ? data.releaseNotes : [])];
        updateField("releaseNotes", current.filter((_, i) => i !== index));
    };

    // Reset Defaults
    const handleResetDefaults = () => {
        if (!confirm("هل أنت متأكد من استعادة كافة الإعدادات الافتراضية لتطبيق الأندرويد؟")) return;
        onChange(DEFAULT_API_APP_CONFIG);
    };

    // Test API Health
    const handleTestHealth = async () => {
        setHealthStatus({ loading: true, text: "جاري فحص اتصال الـ API..." });
        const start = performance.now();
        try {
            const res = await fetch("/api/mobile/v1/health");
            const duration = Math.round(performance.now() - start);
            if (res.ok) {
                const json = await res.json();
                setHealthStatus({
                    loading: false,
                    success: true,
                    text: `الخادم نشط ويعمل بكفاءة (${duration}ms) - الإصدار ${json.version || data.latestVersion}`
                });
            } else {
                setHealthStatus({
                    loading: false,
                    success: false,
                    text: `رد الخادم برمز خطأ ${res.status}`
                });
            }
        } catch (e: any) {
            setHealthStatus({
                loading: false,
                success: false,
                text: "تعذر الاتصال بنقطة نهاية الـ API"
            });
        }
        setTimeout(() => setHealthStatus(null), 6000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300" dir="rtl">
            {/* Top Header Card */}
            <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#dc2626] to-[#ffb95f] p-0.5 shadow-lg shadow-red-950/50 shrink-0">
                        <div className="w-full h-full bg-[#131317] rounded-[14px] flex items-center justify-center text-[#ffb4ab]">
                            <Smartphone size={24} />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="font-cairo font-black text-lg sm:text-xl text-white">
                                إعدادات تطبيق الأندرويد والربط البرمجي (API App)
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold font-cairo flex items-center gap-1.5 transition-all ${
                                !data.isMaintenance 
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                            }`}>
                                <span className={`w-2 h-2 rounded-full ${!data.isMaintenance ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                                {!data.isMaintenance ? "الخادم نشط والتطبيق متاح" : "التطبيق في وضع الصيانة"}
                            </span>
                        </div>
                        <p className="font-tajawal text-xs text-[#94a3b8] mt-0.5">
                            التحكم الكامل في إصدارات التطبيق، التحديث الإجباري، ملفات APK، وضع الصيانة، إعدادات البث، وفحص الربط البرمجي
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                        type="button"
                        onClick={handleTestHealth}
                        disabled={healthStatus?.loading}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#e4e1e7] text-xs font-cairo font-bold transition-all border border-white/5 cursor-pointer"
                        title="اختبار جاهزية واستجابة API التطبيق"
                    >
                        <Activity size={14} className={healthStatus?.loading ? "animate-spin text-[#ffb95f]" : "text-emerald-400"} />
                        <span>{healthStatus?.loading ? "جاري الفحص..." : "فحص اتصال الـ API"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleResetDefaults}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#94a3b8] hover:text-white text-xs font-cairo font-bold transition-all border border-white/5 cursor-pointer"
                        title="استعادة الإعدادات الافتراضية"
                    >
                        <RotateCcw size={14} />
                        <span className="hidden sm:inline">افتراضي</span>
                    </button>
                </div>
            </div>

            {/* Health Status Toast Banner */}
            {healthStatus && (
                <div className={`p-4 rounded-2xl border text-xs font-cairo font-bold flex items-center justify-between transition-all animate-in fade-in ${
                    healthStatus.success 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-red-500/10 border-red-500/30 text-red-300"
                }`}>
                    <div className="flex items-center gap-2">
                        {healthStatus.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                        <span>{healthStatus.text}</span>
                    </div>
                </div>
            )}

            {/* Main Content Grid: Settings on Right, Live Cinema Simulator on Left */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Right Form Sections (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Card 1: Maintenance Mode & Developer Bypass */}
                    <ApiAppMaintenanceSection
                        data={data}
                        updateField={updateField}
                        copiedKey={copiedKey}
                        handleCopy={handleCopy}
                    />

                    {/* Card 2: Version Control, APK & Force Update */}
                    <ApiAppVersionSection
                        data={data}
                        updateField={updateField}
                        copiedKey={copiedKey}
                        handleCopy={handleCopy}
                    />

                    {/* Card 3: Interactive Release Notes Editor */}
                    <ApiAppReleaseNotesSection
                        releaseNotes={data.releaseNotes || []}
                        onAdd={addReleaseNote}
                        onUpdate={updateReleaseNote}
                        onRemove={removeReleaseNote}
                    />

                    {/* Card 4: Streaming & Video Playback Defaults */}
                    <ApiAppStreamingSection
                        data={data}
                        updateField={updateField}
                    />

                    {/* Card 5: API Endpoint & Security Keys */}
                    <ApiAppEndpointSection
                        data={data}
                        updateField={updateField}
                        copiedKey={copiedKey}
                        handleCopy={handleCopy}
                    />
                </div>

                {/* Left Pane: Android Cinema Simulator (5 cols) */}
                <ApiAppPhoneSimulator
                    data={data}
                    simScreen={simScreen}
                    onScreenChange={setSimScreen}
                />

            </div>
        </div>
    );
}
