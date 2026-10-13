"use client";

import { useState } from "react";
import { 
    Smartphone, 
    Sparkles, 
    Activity, 
    RotateCcw, 
    Download, 
    AlertTriangle, 
    ShieldCheck, 
    KeyRound, 
    CheckCircle2, 
    PlayCircle, 
    Film, 
    Layers, 
    Plus, 
    Trash2, 
    Copy, 
    ExternalLink, 
    Radio, 
    Settings, 
    RefreshCw, 
    Clock, 
    Check,
    Zap,
    Crown
} from "lucide-react";
import { ApiAppConfig } from "@/server/types/settings.types";
import { 
    DEFAULT_API_APP_CONFIG, 
    AVAILABLE_STREAMING_QUALITIES, 
    AVAILABLE_DEFAULT_SERVERS 
} from "@/lib/app-presets";

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
                    <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2">
                                <AlertTriangle size={18} className="text-[#ffb95f]" />
                                <h3 className="font-cairo font-bold text-white text-sm">وضع الصيانة وتخطي المطورين</h3>
                            </div>
                            
                            {/* Toggle Maintenance Switch */}
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.isMaintenance}
                                    onChange={(e) => updateField("isMaintenance", e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ffb95f]" />
                            </label>
                        </div>

                        {data.isMaintenance && (
                            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3 text-xs font-cairo text-amber-300">
                                <AlertTriangle size={18} className="shrink-0" />
                                <span>تنبيه: سيتم حظر المشاهدة وعرض شاشة الصيانة لجميع مستخدمي تطبيق الأندرويد باستثناء من يدخل كود التخطي!</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                                    عنوان نافذة الصيانة بالتطبيق
                                </label>
                                <input
                                    type="text"
                                    value={data.maintenanceTitle}
                                    onChange={(e) => updateField("maintenanceTitle", e.target.value)}
                                    placeholder="صيانة دورية مجدولة"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#ffb95f]"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                                    رسالة الصيانة الموجهة للمستخدمين
                                </label>
                                <textarea
                                    value={data.maintenanceMessage}
                                    onChange={(e) => updateField("maintenanceMessage", e.target.value)}
                                    rows={2}
                                    placeholder="نقوم حالياً بتحسين وتحديث سيرفرات المشاهدة..."
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-tajawal text-white focus:outline-none focus:border-[#ffb95f] resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                                        موعد الانتهاء المتوقع (اختياري)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.maintenanceEndTime || ""}
                                        onChange={(e) => updateField("maintenanceEndTime", e.target.value)}
                                        placeholder="مثال: اليوم 11:30 مساءً"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-tajawal text-white focus:outline-none focus:border-[#ffb95f]"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-[11px] font-tajawal text-[#94a3b8]">كود تخطي الصيانة للمطورين</label>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(data.devBypassKey, "bypass")}
                                            className="text-[10px] text-[#ffb95f] hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            {copiedKey === "bypass" ? <Check size={11} /> : <Copy size={11} />}
                                            <span>{copiedKey === "bypass" ? "تم النسخ" : "نسخ"}</span>
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={data.devBypassKey}
                                        onChange={(e) => updateField("devBypassKey", e.target.value)}
                                        placeholder="SLAM_DEV_2026"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono font-bold text-[#ffb95f] focus:outline-none focus:border-[#ffb95f]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Version Control, APK & Force Update */}
                    <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2">
                                <Download size={18} className="text-[#dc2626]" />
                                <h3 className="font-cairo font-bold text-white text-sm">إدارة الإصدارات والتحديث الإجباري والـ APK</h3>
                            </div>
                            
                            {/* Force Update Toggle */}
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-cairo font-bold text-[#94a3b8]">تحديث إجباري:</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.forceUpdate}
                                        onChange={(e) => updateField("forceUpdate", e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#dc2626]" />
                                </label>
                            </div>
                        </div>

                        {/* Version Numbers Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">الإصدار الأخير</label>
                                <input
                                    type="text"
                                    value={data.latestVersion}
                                    onChange={(e) => updateField("latestVersion", e.target.value)}
                                    placeholder="1.2.0"
                                    className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono font-bold text-white focus:outline-none focus:border-[#dc2626]"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">رقم البناء الأخير</label>
                                <input
                                    type="number"
                                    value={data.latestBuild}
                                    onChange={(e) => updateField("latestBuild", parseInt(e.target.value, 10) || 1)}
                                    placeholder="14"
                                    className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono font-bold text-white focus:outline-none focus:border-[#dc2626]"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">أدنى إصدار مدعوم</label>
                                <input
                                    type="text"
                                    value={data.minSupportedVersion}
                                    onChange={(e) => updateField("minSupportedVersion", e.target.value)}
                                    placeholder="1.0.0"
                                    className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono font-bold text-white focus:outline-none focus:border-[#dc2626]"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">أدنى رقم بناء</label>
                                <input
                                    type="number"
                                    value={data.minSupportedBuild}
                                    onChange={(e) => updateField("minSupportedBuild", parseInt(e.target.value, 10) || 1)}
                                    placeholder="10"
                                    className="w-full px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono font-bold text-white focus:outline-none focus:border-[#dc2626]"
                                />
                            </div>
                        </div>

                        {/* URLs */}
                        <div className="space-y-3 pt-2">
                            <div>
                                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                                    رابط متجر Google Play (Store URL)
                                </label>
                                <input
                                    type="text"
                                    value={data.updateUrl}
                                    onChange={(e) => updateField("updateUrl", e.target.value)}
                                    placeholder="https://play.google.com/store/apps/details?id=com.animedaze.app"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-[11px] font-tajawal text-[#94a3b8]">
                                        رابط التحميل المباشر لملف APK (Direct APK URL)
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(data.directApkUrl, "apk")}
                                            className="text-[10px] text-[#ffb4ab] hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            {copiedKey === "apk" ? <Check size={11} /> : <Copy size={11} />}
                                            <span>{copiedKey === "apk" ? "تم النسخ" : "نسخ الرابط"}</span>
                                        </button>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    value={data.directApkUrl}
                                    onChange={(e) => updateField("directApkUrl", e.target.value)}
                                    placeholder="https://slam-dunk-w.vercel.app/downloads/animedaze-latest.apk"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                                    رابط متجر Apple App Store (iOS URL)
                                </label>
                                <input
                                    type="text"
                                    value={data.appStoreUrl || ""}
                                    onChange={(e) => updateField("appStoreUrl", e.target.value)}
                                    placeholder="https://apps.apple.com/app/animedaze/id123456789"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">
                                    رابط خارجي إضافي / مستودع الإصدارات (External / Releases URL)
                                </label>
                                <input
                                    type="text"
                                    value={data.externalUrl || ""}
                                    onChange={(e) => updateField("externalUrl", e.target.value)}
                                    placeholder="https://github.com/ammarnaass/slam-dunk-w/releases"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Interactive Release Notes Editor */}
                    <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                            <div className="flex items-center gap-2">
                                <Sparkles size={18} className="text-[#ffb95f]" />
                                <h3 className="font-cairo font-bold text-white text-sm">سجل التحديثات وملاحظات الإصدار (Release Notes)</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addReleaseNote}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#dc2626]/20 hover:bg-[#dc2626]/30 text-[#ffb4ab] border border-[#dc2626]/30 text-xs font-cairo font-bold transition-all cursor-pointer"
                            >
                                <Plus size={13} />
                                <span>إضافة بند</span>
                            </button>
                        </div>

                        <div className="space-y-2.5">
                            {(Array.isArray(data.releaseNotes) ? data.releaseNotes : []).map((note, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono text-[#94a3b8] shrink-0">
                                        {idx + 1}
                                    </span>
                                    <input
                                        type="text"
                                        value={note}
                                        onChange={(e) => updateReleaseNote(idx, e.target.value)}
                                        placeholder="تفاصيل التحديث والميزة الجديدة..."
                                        className="flex-1 px-3 py-2 rounded-xl bg-[#131317] border border-white/[0.08] text-xs font-tajawal text-white focus:outline-none focus:border-[#dc2626]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeReleaseNote(idx)}
                                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-red-500/20 text-[#94a3b8] hover:text-red-400 border border-white/5 transition-all cursor-pointer shrink-0"
                                        title="حذف البند"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card 4: Streaming & Video Playback Defaults */}
                    <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                            <PlayCircle size={18} className="text-[#dc2626]" />
                            <h3 className="font-cairo font-bold text-white text-sm">إعدادات البث والمشغل الافتراضية للتطبيق</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">الجودة الافتراضية الأولية</label>
                                <select
                                    value={data.defaultQuality}
                                    onChange={(e) => updateField("defaultQuality", e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626] cursor-pointer"
                                >
                                    {AVAILABLE_STREAMING_QUALITIES.map((q) => (
                                        <option key={q.value} value={q.value} className="bg-[#131317] text-white">
                                            {q.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-tajawal text-[#94a3b8] mb-1">السيرفر الافتراضي الأولي</label>
                                <select
                                    value={data.defaultServer}
                                    onChange={(e) => updateField("defaultServer", e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626] cursor-pointer"
                                >
                                    {AVAILABLE_DEFAULT_SERVERS.map((s) => (
                                        <option key={s.value} value={s.value} className="bg-[#131317] text-white">
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                                <div>
                                    <span className="font-cairo font-bold text-xs text-white block">التحميل أوفلاين للمشاهدة</span>
                                    <span className="font-tajawal text-[10px] text-[#94a3b8]">تفعيل زر حفظ الحلقات على الجهاز</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.allowDownloads}
                                        onChange={(e) => updateField("allowDownloads", e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                                </label>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                                <div>
                                    <span className="font-cairo font-bold text-xs text-white block">تردد الإعلانات البينية</span>
                                    <span className="font-tajawal text-[10px] text-[#94a3b8]">عدد الحلقات بين كل إعلان بيني</span>
                                </div>
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={data.interstitialInterval}
                                    onChange={(e) => updateField("interstitialInterval", parseInt(e.target.value, 10) || 2)}
                                    className="w-14 px-2 py-1 rounded-lg bg-[#131317] border border-white/[0.1] text-xs font-mono font-bold text-center text-white focus:outline-none focus:border-[#dc2626]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card 5: API Endpoint & Security Keys */}
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

                </div>

                {/* Left Pane: Android Cinema Simulator (5 cols) */}
                <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <Radio size={16} className="text-[#dc2626] animate-pulse" />
                            <h3 className="font-cairo font-bold text-white text-xs">محاكي هاتف أندرويد الحي</h3>
                        </div>

                        {/* Simulator Screen Switcher */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#181820] border border-white/5">
                            <button
                                type="button"
                                onClick={() => setSimScreen("feed")}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-cairo font-bold transition-all cursor-pointer ${
                                    simScreen === "feed" ? "bg-[#dc2626] text-white" : "text-[#94a3b8] hover:text-white"
                                }`}
                            >
                                التطبيق
                            </button>
                            <button
                                type="button"
                                onClick={() => setSimScreen("maintenance")}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-cairo font-bold transition-all cursor-pointer ${
                                    simScreen === "maintenance" ? "bg-[#ffb95f] text-black" : "text-[#94a3b8] hover:text-white"
                                }`}
                            >
                                الصيانة
                            </button>
                            <button
                                type="button"
                                onClick={() => setSimScreen("update")}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-cairo font-bold transition-all cursor-pointer ${
                                    simScreen === "update" ? "bg-red-600 text-white" : "text-[#94a3b8] hover:text-white"
                                }`}
                            >
                                التحديث
                            </button>
                        </div>
                    </div>

                    {/* Smartphone Mockup Frame */}
                    <div className="w-full max-w-[340px] mx-auto bg-[#0a0a0f] rounded-[48px] p-3.5 border-4 border-[#2a2a35] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden">
                        
                        {/* Notch / Punch-hole Camera */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border border-white/10 z-30 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a2e]" />
                        </div>

                        {/* Android Screen Inner Container */}
                        <div className="w-full h-[580px] bg-[#0F131C] rounded-[36px] overflow-hidden flex flex-col relative select-none">
                            
                            {/* Android Status Bar */}
                            <div className="pt-2 px-5 pb-1 flex items-center justify-between text-[10px] font-mono text-[#94a3b8] z-20">
                                <span>12:45</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[9px]">5G</span>
                                    <div className="w-4 h-2 rounded-sm border border-[#94a3b8] p-0.5 flex items-center">
                                        <div className="w-full h-full bg-emerald-400 rounded-2xs" />
                                    </div>
                                </div>
                            </div>

                            {/* SCREEN 1: Active App Feed */}
                            {simScreen === "feed" && (
                                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
                                    {/* App Header */}
                                    <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-[#dc2626] flex items-center justify-center text-white font-black text-xs font-cairo">
                                                AD
                                            </div>
                                            <div>
                                                <span className="font-cairo font-black text-xs text-white block leading-tight">ANIME DAZE</span>
                                                <span className="font-tajawal text-[9px] text-[#ffb95f]">سبيستون & كلاسيك</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="px-2 py-0.5 rounded-full bg-[#ffb95f]/20 border border-[#ffb95f]/40 text-[#ffb95f] text-[9px] font-cairo font-bold">
                                                VIP
                                            </span>
                                        </div>
                                    </div>

                                    {/* Hero Banner in Simulator */}
                                    <div className="p-3">
                                        <div className="h-32 rounded-2xl bg-gradient-to-t from-black via-black/40 to-transparent relative overflow-hidden border border-white/10 flex flex-col justify-end p-3">
                                            <img
                                                src="/hero-bg.jpg"
                                                alt="Banner"
                                                className="absolute inset-0 w-full h-full object-cover -z-10"
                                            />
                                            <span className="px-2 py-0.5 rounded-md bg-[#dc2626] text-white text-[8px] font-cairo font-bold self-start mb-1">
                                                الأكثر مشاهدة 4K
                                            </span>
                                            <h4 className="font-cairo font-black text-xs text-white leading-tight">سلام دانك: الصقور ضد الساموراي</h4>
                                            <span className="font-tajawal text-[9px] text-[#e4e1e7]">101 حلقة مدبلجة سبيستون كاملة</span>
                                        </div>
                                    </div>

                                    {/* Simulator Quick Perks Row */}
                                    <div className="px-3 py-1 flex items-center justify-between text-[8px] font-cairo text-[#94a3b8]">
                                        <span className="flex items-center gap-1">⚡ سيرفر {data.defaultServer}</span>
                                        <span className="flex items-center gap-1">📺 جودة {data.defaultQuality}</span>
                                        <span className="flex items-center gap-1">📥 {data.allowDownloads ? "تحميل متاح" : "تحميل معطل"}</span>
                                    </div>

                                    {/* Episodes Sample Grid */}
                                    <div className="p-3 space-y-2 flex-1">
                                        <span className="font-cairo font-bold text-[10px] text-white block">أحدث الحلقات المضافة</span>
                                        <div className="space-y-1.5">
                                            {[101, 100, 99].map((epNum) => (
                                                <div key={epNum} className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-10 h-7 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-white">
                                                            <PlayCircle size={14} className="text-[#dc2626]" />
                                                        </div>
                                                        <div>
                                                            <span className="font-cairo font-bold text-[10px] text-white block">سلام دانك - حلقة {epNum}</span>
                                                            <span className="font-tajawal text-[8px] text-[#94a3b8]">23:30 دقيقة • FHD</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-[9px] font-mono text-[#ffb95f]">VIP</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom Nav Bar in Mockup */}
                                    <div className="p-2.5 bg-[#0A0E16] border-t border-white/5 flex items-center justify-around text-[9px] font-cairo text-[#94a3b8]">
                                        <span className="text-[#dc2626] font-bold">الرئيسية</span>
                                        <span>الأنمي</span>
                                        <span>الحلقات</span>
                                        <span>التنزيلات</span>
                                        <span>حسابي</span>
                                    </div>
                                </div>
                            )}

                            {/* SCREEN 2: Maintenance Overlay in Simulator */}
                            {simScreen === "maintenance" && (
                                <div className="flex-1 p-5 flex flex-col items-center justify-center text-center bg-[#0F131C] space-y-3.5">
                                    <div className="w-14 h-14 rounded-2xl bg-[#ffb95f]/15 border border-[#ffb95f]/30 flex items-center justify-center text-[#ffb95f] shadow-lg shadow-amber-950/40">
                                        <AlertTriangle size={28} />
                                    </div>
                                    <h4 className="font-cairo font-black text-sm text-white">
                                        {data.maintenanceTitle || "صيانة دورية مجدولة"}
                                    </h4>
                                    <p className="font-tajawal text-[10px] text-[#94a3b8] leading-relaxed max-w-[220px]">
                                        {data.maintenanceMessage || "نقوم حالياً بتحسين وتحديث سيرفرات المشاهدة..."}
                                    </p>
                                    {data.maintenanceEndTime && (
                                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-cairo text-[#ffb95f]">
                                            الموعد المتوقع: {data.maintenanceEndTime}
                                        </div>
                                    )}
                                    <div className="w-full pt-4 border-t border-white/5 space-y-1.5">
                                        <span className="text-[9px] font-cairo text-[#64748b] block">تخطي لفريق التطوير:</span>
                                        <div className="flex items-center gap-1 justify-center">
                                            <span className="px-2 py-1 rounded-lg bg-black border border-white/10 font-mono text-[9px] text-[#ffb95f]">
                                                {data.devBypassKey}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SCREEN 3: Update Modal in Simulator */}
                            {simScreen === "update" && (
                                <div className="flex-1 p-5 flex flex-col justify-center bg-black/85 backdrop-blur-sm">
                                    <div className="p-4 rounded-3xl bg-[#181C24] border border-white/10 shadow-2xl space-y-3 text-right">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2.5 py-0.5 rounded-full bg-[#dc2626]/20 border border-[#dc2626]/40 text-[#ffb4ab] text-[9px] font-cairo font-bold">
                                                {data.forceUpdate ? "تحديث إجباري" : "تحديث متوفر"}
                                            </span>
                                            <Download size={16} className="text-[#dc2626]" />
                                        </div>
                                        <div>
                                            <h4 className="font-cairo font-black text-xs text-white">إصدار جديد متاح v{data.latestVersion}</h4>
                                            <span className="font-mono text-[9px] text-[#94a3b8]">بناء رقم {data.latestBuild}</span>
                                        </div>
                                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                            <span className="text-[9px] font-cairo font-bold text-[#ffb95f] block">أبرز المزايا:</span>
                                            {(Array.isArray(data.releaseNotes) ? data.releaseNotes.slice(0, 3) : []).map((note, i) => (
                                                <span key={i} className="text-[8px] font-tajawal text-[#e4e1e7] block truncate">
                                                    • {note}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="space-y-1.5 pt-1">
                                            <div className="w-full py-2 rounded-xl bg-[#dc2626] text-white text-center font-cairo font-bold text-[10px] shadow-lg shadow-red-950/40">
                                                تحديث الآن عبر Google Play
                                            </div>
                                            <div className="w-full py-1.5 rounded-xl bg-white/[0.04] text-[#94a3b8] text-center font-cairo font-bold text-[9px] border border-white/5">
                                                تحميل APK مباشر
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Android Home Bar Indicator */}
                        <div className="w-24 h-1 rounded-full bg-white/20 mx-auto mt-2" />
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] font-tajawal text-[#94a3b8] text-center">
                        ينعكس المحاكي فورياً مع التعديلات ويوضح تجربة المستخدم على هواتف أندرويد
                    </div>
                </div>

            </div>
        </div>
    );
}
