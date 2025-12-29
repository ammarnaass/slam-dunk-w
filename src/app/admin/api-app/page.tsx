"use client";

import { useState, useEffect } from "react";
import { Save, Smartphone, AlertTriangle, RefreshCw, Globe, MessageSquare } from "lucide-react";

export default function ApiAppPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        apiApp: {
            isMaintenance: false,
            maintenanceMessage: "التطبيق في وضع الصيانة حالياً. سنعود قريباً!",
            latestVersion: "1.0.0",
            updateUrl: "",
            apiUrl: "",
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
                setSettings(data);
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleMaintenance = () => {
        setSettings((prev) => ({
            ...prev,
            apiApp: {
                ...prev.apiApp,
                isMaintenance: !prev.apiApp.isMaintenance,
            },
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings((prev) => ({
            ...prev,
            apiApp: {
                ...prev.apiApp,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                alert("تم حفظ إعدادات التطبيق بنجاح");
            } else {
                alert("حدث خطأ أثناء الحفظ");
            }
        } catch (error) {
            console.error("Error saving settings", error);
            alert("حدث خطأ أثناء الحفظ");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white text-center p-8 font-cairo">جاري التحميل...</div>;

    return (
        <div className="max-w-4xl mx-auto font-cairo" dir="rtl">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-slate-800 p-3 rounded-lg">
                    <Smartphone className="text-blue-500" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">إعدادات التطبيق (API App)</h1>
                    <p className="text-slate-400 mt-1">التحكم في إعدادات تطبيق الأندرويد والربط البرمجي</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Maintenance Mode */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="text-yellow-500" size={24} />
                            <div>
                                <h2 className="text-lg font-bold text-white">وضع الصيانة</h2>
                                <p className="text-xs text-slate-500">منع وصول المستخدمين في حال وجود تحديثات</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleToggleMaintenance}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.apiApp.isMaintenance ? "bg-red-600" : "bg-slate-700"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.apiApp.isMaintenance ? "-translate-x-6" : "-translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    {settings.apiApp.isMaintenance && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-2">رسالة الصيانة</label>
                                <textarea
                                    name="maintenanceMessage"
                                    value={settings.apiApp.maintenanceMessage}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-600 transition-colors"
                                    placeholder="التطبيق قيد الإصلاح حالياً..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* App Version & Updates */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <RefreshCw className="text-green-500" size={20} />
                        الإصدار والتحديثات
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">رقم أحدث إصدار</label>
                            <input
                                type="text"
                                name="latestVersion"
                                value={settings.apiApp.latestVersion}
                                onChange={handleInputChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-600 transition-colors"
                                placeholder="1.0.2"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">رابط التحديث (Direct link or Store)</label>
                            <input
                                type="text"
                                name="updateUrl"
                                value={settings.apiApp.updateUrl}
                                onChange={handleInputChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-600 transition-colors"
                                placeholder="https://example.com/app.apk"
                            />
                        </div>
                    </div>
                </div>

                {/* API Connection */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Globe className="text-purple-500" size={20} />
                        عنوان الـ API
                    </h2>
                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">رابط الـ API الأساسي (للإطلاع فقط)</label>
                        <input
                            type="text"
                            name="apiUrl"
                            value={settings.apiApp.apiUrl}
                            onChange={handleInputChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-600 transition-colors"
                            placeholder="https://your-domain.vercel.app/api/mobile/v1"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            هذا هو الرابط الذي يستخدمه التطبيق لجلب البيانات. تأكد من صحته لضمان عمل التطبيق.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
                    >
                        {saving ? (
                            <>
                                <RefreshCw className="animate-spin" size={20} />
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                حفظ الإعدادات
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
