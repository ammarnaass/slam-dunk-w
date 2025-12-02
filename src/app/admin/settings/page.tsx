"use client";

import { useState, useEffect } from "react";
import { Save, Settings } from "lucide-react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        siteName: "",
        siteDescription: "",
        logoUrl: "",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings");
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
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
                alert("تم حفظ الإعدادات بنجاح");
                // Force reload to update layout/navbar
                window.location.reload();
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

    if (loading) return <div className="text-white text-center p-8">جاري التحميل...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-slate-800 p-3 rounded-lg">
                    <Settings className="text-red-500" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">إعدادات الموقع</h1>
                    <p className="text-slate-400 mt-1">تحكم في هوية الموقع والشعار</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">اسم الموقع</label>
                    <input
                        type="text"
                        name="siteName"
                        value={settings.siteName}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                        placeholder="سلام دانك"
                    />
                    <p className="text-xs text-slate-500 mt-1">يظهر في شريط العنوان وشريط التنقل.</p>
                </div>

                <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">وصف الموقع</label>
                    <textarea
                        name="siteDescription"
                        value={settings.siteDescription}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                        placeholder="شاهد جميع حلقات أنمي سلام دانك..."
                    />
                    <p className="text-xs text-slate-500 mt-1">يظهر في محركات البحث (SEO).</p>
                </div>

                <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">رابط الشعار (Logo URL)</label>
                    <input
                        type="text"
                        name="logoUrl"
                        value={settings.logoUrl}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                        placeholder="/logo.png"
                    />
                    <p className="text-xs text-slate-500 mt-1">رابط الصورة التي ستظهر كشعار للموقع.</p>

                    {settings.logoUrl && (
                        <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-lg inline-block">
                            <p className="text-xs text-slate-500 mb-2">معاينة الشعار:</p>
                            <img src={settings.logoUrl} alt="Logo Preview" className="h-12 object-contain" />
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t border-slate-800">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <Save size={20} />
                        {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
                    </button>
                </div>
            </form>
        </div>
    );
}
