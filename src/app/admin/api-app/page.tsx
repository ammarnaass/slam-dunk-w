"use client";

import { useState, useEffect } from "react";
import { 
    Smartphone, 
    AlertTriangle, 
    RefreshCw, 
    Globe, 
    Save, 
    Check, 
    Copy, 
    Terminal, 
    DollarSign, 
    PlayCircle, 
    Shield, 
    Sparkles, 
    ExternalLink, 
    CheckCircle2, 
    XCircle,
    Plus,
    Trash2,
    Lock,
    Key,
    Zap,
    Download,
    Eye
} from "lucide-react";

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

    const [newReleaseNote, setNewReleaseNote] = useState("");

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
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text: string, fieldId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2000);
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

    const handleAddReleaseNote = () => {
        if (!newReleaseNote.trim()) return;
        const currentNotes = Array.isArray(settings.apiApp.releaseNotes) ? settings.apiApp.releaseNotes : [];
        handleApiAppChange("releaseNotes", [...currentNotes, newReleaseNote.trim()]);
        setNewReleaseNote("");
    };

    const handleRemoveReleaseNote = (index: number) => {
        const currentNotes = Array.isArray(settings.apiApp.releaseNotes) ? settings.apiApp.releaseNotes : [];
        handleApiAppChange("releaseNotes", currentNotes.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setSaving(true);
        setSaveSuccess(false);

        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3500);
            } else {
                alert("حدث خطأ أثناء حفظ الإعدادات، يرجى إعادة المحاولة.");
            }
        } catch (error) {
            console.error("Error saving settings", error);
            alert("فشل الاتصال بالخادم.");
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
                success: res.ok && data?.success,
                data: data?.data
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
                        onClick={() => handleSubmit()}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105 disabled:opacity-60"
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 ${
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 ${
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 ${
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 ${
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 ${
                        activeTab === "endpoints"
                            ? "bg-slate-900 text-red-400 border-red-500"
                            : "text-slate-400 hover:text-white border-transparent"
                    }`}
                >
                    <Terminal size={16} />
                    <span>أمان الـ API وفاحص الاتصال</span>
                </button>
            </div>

            {/* TAB 1: Maintenance Mode */}
            {activeTab === "maintenance" && (
                <div className="space-y-6">
                    {/* Big Switch Card */}
                    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                                <div className={`p-3 rounded-2xl ${settings.apiApp.isMaintenance ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-slate-800 text-slate-400"}`}>
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
                                onClick={() => handleApiAppChange("isMaintenance", !settings.apiApp.isMaintenance)}
                                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                                    settings.apiApp.isMaintenance ? "bg-amber-600" : "bg-slate-800"
                                }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                                        settings.apiApp.isMaintenance ? "-translate-x-9" : "-translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        {settings.apiApp.isMaintenance && (
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
                                    value={settings.apiApp.maintenanceTitle || ""}
                                    onChange={(e) => handleApiAppChange("maintenanceTitle", e.target.value)}
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
                                    value={settings.apiApp.maintenanceEndTime || ""}
                                    onChange={(e) => handleApiAppChange("maintenanceEndTime", e.target.value)}
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
                                value={settings.apiApp.maintenanceMessage || ""}
                                onChange={(e) => handleApiAppChange("maintenanceMessage", e.target.value)}
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
                                        value={settings.apiApp.devBypassKey || ""}
                                        onChange={(e) => handleApiAppChange("devBypassKey", e.target.value)}
                                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(settings.apiApp.devBypassKey || "SLAM_DEV_2026", "devKey")}
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
            )}

            {/* TAB 2: Versioning & Force Update */}
            {activeTab === "versioning" && (
                <div className="space-y-6">
                    {/* Force Update Toggle Card */}
                    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                                <div className={`p-3 rounded-2xl ${settings.apiApp.forceUpdate ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-slate-800 text-slate-400"}`}>
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
                                onClick={() => handleApiAppChange("forceUpdate", !settings.apiApp.forceUpdate)}
                                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                                    settings.apiApp.forceUpdate ? "bg-red-600" : "bg-slate-800"
                                }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                                        settings.apiApp.forceUpdate ? "-translate-x-9" : "-translate-x-1"
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
                                    value={settings.apiApp.latestVersion || ""}
                                    onChange={(e) => handleApiAppChange("latestVersion", e.target.value)}
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
                                    value={settings.apiApp.latestBuild || 12}
                                    onChange={(e) => handleApiAppChange("latestBuild", Number(e.target.value))}
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
                                    value={settings.apiApp.minSupportedVersion || ""}
                                    onChange={(e) => handleApiAppChange("minSupportedVersion", e.target.value)}
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
                                    value={settings.apiApp.minSupportedBuild || 10}
                                    onChange={(e) => handleApiAppChange("minSupportedBuild", Number(e.target.value))}
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
                                    value={settings.apiApp.updateUrl || ""}
                                    onChange={(e) => handleApiAppChange("updateUrl", e.target.value)}
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
                                    value={settings.apiApp.directApkUrl || ""}
                                    onChange={(e) => handleApiAppChange("directApkUrl", e.target.value)}
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
                                {Array.isArray(settings.apiApp.releaseNotes) && settings.apiApp.releaseNotes.map((note: string, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                                        <div className="flex items-center gap-2 text-slate-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            <span>{note}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveReleaseNote(idx)}
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
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddReleaseNote(); } }}
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddReleaseNote}
                                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
                                >
                                    <Plus size={15} />
                                    <span>إضافة</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: Google AdMob */}
            {activeTab === "monetization" && (
                <div className="space-y-6">
                    {/* AdMob Toggle Card */}
                    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                                <div className={`p-3 rounded-2xl ${settings.admob.isEnabled ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-slate-800 text-slate-400"}`}>
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
                                onClick={() => handleAdmobChange("isEnabled", !settings.admob.isEnabled)}
                                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                                    settings.admob.isEnabled ? "bg-blue-600" : "bg-slate-800"
                                }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                                        settings.admob.isEnabled ? "-translate-x-9" : "-translate-x-1"
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
                                onClick={() => {
                                    handleAdmobChange("appId", "ca-app-pub-3940256099942544~3347511713");
                                    handleAdmobChange("bannerId", "ca-app-pub-3940256099942544/6300978111");
                                    handleAdmobChange("interstitialId", "ca-app-pub-3940256099942544/1033173712");
                                    handleAdmobChange("rewardedId", "ca-app-pub-3940256099942544/5224354917");
                                }}
                                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline"
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
                                    value={settings.admob.appId || ""}
                                    onChange={(e) => handleAdmobChange("appId", e.target.value)}
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
                                        value={settings.admob.bannerId || ""}
                                        onChange={(e) => handleAdmobChange("bannerId", e.target.value)}
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
                                        value={settings.admob.interstitialId || ""}
                                        onChange={(e) => handleAdmobChange("interstitialId", e.target.value)}
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
                                        value={settings.admob.rewardedId || ""}
                                        onChange={(e) => handleAdmobChange("rewardedId", e.target.value)}
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
                                        value={settings.apiApp.interstitialInterval || 2}
                                        onChange={(e) => handleApiAppChange("interstitialInterval", Number(e.target.value))}
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
            )}

            {/* TAB 4: Video Player & Streaming */}
            {activeTab === "player" && (
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
                                    value={settings.apiApp.defaultServer || "Mega"}
                                    onChange={(e) => handleApiAppChange("defaultServer", e.target.value)}
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
                                    value={settings.apiApp.defaultQuality || "720p"}
                                    onChange={(e) => handleApiAppChange("defaultQuality", e.target.value)}
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
                                        onClick={() => handleApiAppChange("allowDownloads", !settings.apiApp.allowDownloads)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            settings.apiApp.allowDownloads ? "bg-purple-600" : "bg-slate-800"
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                settings.apiApp.allowDownloads ? "-translate-x-6" : "-translate-x-1"
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 5: Endpoints & Live API Tester */}
            {activeTab === "endpoints" && (
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
                                        value={settings.apiApp.apiUrl || "https://slam-dunk-w.vercel.app/api/mobile/v1"}
                                        onChange={(e) => handleApiAppChange("apiUrl", e.target.value)}
                                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-purple-400 focus:outline-none focus:border-red-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(settings.apiApp.apiUrl || "https://slam-dunk-w.vercel.app/api/mobile/v1", "baseUrl")}
                                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
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
                                        value={settings.apiApp.apiKey || "slam_live_app_key_2026"}
                                        onChange={(e) => handleApiAppChange("apiKey", e.target.value)}
                                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-amber-400 focus:outline-none focus:border-red-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(settings.apiApp.apiKey || "slam_live_app_key_2026", "apiKey")}
                                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
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
                                onClick={runLiveApiTest}
                                disabled={testingApi}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700"
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
                                            HTTP {apiTestResult.status} OK
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
                                            <a href="/api/mobile/v1/config" target="_blank" className="text-blue-400 hover:underline inline-flex items-center gap-1">
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
                                            <a href="/api/mobile/v1/home" target="_blank" className="text-blue-400 hover:underline inline-flex items-center gap-1">
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
                                            <a href="/api/mobile/v1/animes" target="_blank" className="text-blue-400 hover:underline inline-flex items-center gap-1">
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
                                            <a href="/api/mobile/v1/characters" target="_blank" className="text-blue-400 hover:underline inline-flex items-center gap-1">
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
            )}
        </div>
    );
}
