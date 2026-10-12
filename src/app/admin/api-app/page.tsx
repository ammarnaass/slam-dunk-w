"use client";

import { useState, useEffect } from "react";
import { 
    AlertTriangle, 
    RefreshCw, 
    Save, 
    Check, 
    DollarSign, 
    PlayCircle, 
    Terminal
} from "lucide-react";
import { MaintenanceTab } from "./components/MaintenanceTab";
import { VersioningTab } from "./components/VersioningTab";
import { MonetizationTab } from "./components/MonetizationTab";
import { PlayerConfigTab } from "./components/PlayerConfigTab";
import { EndpointsDocTab } from "./components/EndpointsDocTab";

type TabType = "maintenance" | "versioning" | "monetization" | "player" | "endpoints";

export default function ApiAppPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("maintenance");
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Live API Tester states
    const [testingApi, setTestingApi] = useState(false);
    const [apiTestResult, setApiTestResult] = useState<{
        status: number;
        latency: number;
        success: boolean;
        data?: any;
        error?: string;
    } | null>(null);

    const [settings, setSettings] = useState({
        siteName: "سلام دانك",
        admob: {
            isEnabled: false,
            appId: "ca-app-pub-3940256099942544~3347511713",
            bannerId: "ca-app-pub-3940256099942544/6300978111",
            interstitialId: "ca-app-pub-3940256099942544/1033173712",
            rewardedId: "ca-app-pub-3940256099942544/5224354917",
        },
        apiApp: {
            isMaintenance: false,
            maintenanceTitle: "صيانة دورية مجدولة",
            maintenanceMessage: "التطبيق في وضع الصيانة حالياً لتحسين الخوادم وتجربة البث. سنعود قريباً!",
            maintenanceEndTime: "",
            devBypassKey: "SLAM_DEV_2026",
            latestVersion: "1.2.0",
            latestBuild: 12,
            minSupportedVersion: "1.0.0",
            minSupportedBuild: 10,
            forceUpdate: false,
            updateUrl: "https://play.google.com/store/apps/details?id=com.slamdunk.app",
            directApkUrl: "https://slam-dunk-w.vercel.app/downloads/slamdunk-latest.apk",
            releaseNotes: [
                "إضافة دعم سيرفرات المشاهدة بدقة FHD 1080p",
                "تسريع تحميل وتشغيل الحلقات بنسبة 40%",
                "تحسين واجهة المستخدم ودعم الاستئناف التلقائي"
            ],
            apiUrl: "https://slam-dunk-w.vercel.app/api/mobile/v1",
            apiKey: "slam_live_app_key_2026",
            defaultQuality: "720p",
            defaultServer: "Mega",
            allowDownloads: true,
            interstitialInterval: 2
        },
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings");
            if (res.ok) {
                const data = await res.json();
                setSettings(prev => ({
                    ...prev,
                    ...data,
                    admob: { ...prev.admob, ...(data.admob || {}) },
                    apiApp: { ...prev.apiApp, ...(data.apiApp || {}) }
                }));
            }
        } catch (err) {
            console.error("Failed to fetch settings", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApiAppChange = (field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            apiApp: {
                ...prev.apiApp,
                [field]: value
            }
        }));
    };

    const handleAdmobChange = (field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            admob: {
                ...prev.admob,
                [field]: value
            }
        }));
    };

    const handleAddReleaseNote = (note: string) => {
        setSettings(prev => ({
            ...prev,
            apiApp: {
                ...prev.apiApp,
                releaseNotes: [...(prev.apiApp.releaseNotes || []), note]
            }
        }));
    };

    const handleRemoveReleaseNote = (index: number) => {
        setSettings(prev => ({
            ...prev,
            apiApp: {
                ...prev.apiApp,
                releaseNotes: (prev.apiApp.releaseNotes || []).filter((_, i) => i !== index)
            }
        }));
    };

    const handleCopy = (text: string, fieldId: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleSubmit = async () => {
        setSaving(true);
        setSaveSuccess(false);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                alert("حدث خطأ أثناء حفظ الإعدادات");
            }
        } catch (err) {
            console.error(err);
            alert("فشل الاتصال بالخادم لحفظ الإعدادات");
        } finally {
            setSaving(false);
        }
    };

    const runLiveApiTest = async () => {
        setTestingApi(true);
        setApiTestResult(null);
        const startTime = performance.now();
        try {
            const res = await fetch("/api/mobile/v1/config");
            const endTime = performance.now();
            const latency = Math.round(endTime - startTime);
            const data = await res.json();
            setApiTestResult({
                status: res.status,
                latency,
                success: res.ok,
                data
            });
        } catch (err: any) {
            const endTime = performance.now();
            setApiTestResult({
                status: 500,
                latency: Math.round(endTime - startTime),
                success: false,
                error: err.message || "Failed to fetch /api/mobile/v1/config"
            });
        } finally {
            setTestingApi(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
                <p className="text-xs text-slate-400 font-medium">جاري تحميل إعدادات التطبيق...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Header Area */}
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
                    <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold ${
                        settings.apiApp.isMaintenance 
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    }`}>
                        <span className={`w-2 h-2 rounded-full ${settings.apiApp.isMaintenance ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
                        <span>{settings.apiApp.isMaintenance ? "التطبيق في وضع الصيانة" : "التطبيق نشط ويعمل"}</span>
                    </div>

                    <button
                        onClick={handleSubmit}
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

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
                <button
                    onClick={() => setActiveTab("maintenance")}
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
                    onClick={() => setActiveTab("versioning")}
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
                    onClick={() => setActiveTab("monetization")}
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
                    onClick={() => setActiveTab("player")}
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
                    onClick={() => setActiveTab("endpoints")}
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

            {/* TAB CONTENTS */}
            {activeTab === "maintenance" && (
                <MaintenanceTab 
                    apiApp={settings.apiApp} 
                    onChange={handleApiAppChange}
                    onCopy={handleCopy}
                    copiedField={copiedField}
                />
            )}

            {activeTab === "versioning" && (
                <VersioningTab 
                    apiApp={settings.apiApp}
                    onChange={handleApiAppChange}
                    onAddReleaseNote={handleAddReleaseNote}
                    onRemoveReleaseNote={handleRemoveReleaseNote}
                />
            )}

            {activeTab === "monetization" && (
                <MonetizationTab 
                    admob={settings.admob}
                    interstitialInterval={settings.apiApp.interstitialInterval}
                    onAdmobChange={handleAdmobChange}
                    onApiAppChange={handleApiAppChange}
                />
            )}

            {activeTab === "player" && (
                <PlayerConfigTab 
                    apiApp={settings.apiApp}
                    onChange={handleApiAppChange}
                />
            )}

            {activeTab === "endpoints" && (
                <EndpointsDocTab 
                    apiApp={settings.apiApp}
                    onChange={handleApiAppChange}
                    onCopy={handleCopy}
                    copiedField={copiedField}
                    testingApi={testingApi}
                    apiTestResult={apiTestResult}
                    onRunLiveTest={runLiveApiTest}
                />
            )}
        </div>
    );
}
