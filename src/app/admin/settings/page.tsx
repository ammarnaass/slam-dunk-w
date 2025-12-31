"use client";

import { useState, useEffect } from "react";
import { Save, Settings, Facebook, Twitter, Instagram, Youtube, Send, Film, Image as ImageIcon, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Anime } from "@/types";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [settings, setSettings] = useState({
        siteName: "",
        siteDescription: "",
        logoUrl: "",
        faviconUrl: "",
        currency: "ج.م",
        socialLinks: {
            facebook: "",
            twitter: "",
            instagram: "",
            youtube: "",
            telegram: "",
        },
        admob: {
            isEnabled: false,
            appId: "",
            bannerId: "",
            interstitialId: "",
        },
    });

    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingFavicon, setUploadingFavicon] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const [settingsRes, animesRes] = await Promise.all([
                fetch("/api/settings"),
                fetch("/api/admin/animes")
            ]);

            if (settingsRes.ok) {
                const data = await settingsRes.json();
                setSettings(data);
            }

            if (animesRes.ok) {
                const data = await animesRes.json();
                setAnimes(data);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Limit file size (e.g., 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert("حجم الملف كبير جداً. يرجى اختيار صورة أقل من 2 ميجابايت.");
            return;
        }

        if (type === 'logo') setUploadingLogo(true);
        else setUploadingFavicon(true);

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64String = reader.result as string;

                // Update local state for preview
                setSettings(prev => ({
                    ...prev,
                    [type === 'logo' ? 'logoUrl' : 'faviconUrl']: base64String
                }));

                if (type === 'logo') setUploadingLogo(false);
                else setUploadingFavicon(false);
            };
            reader.onerror = (error) => {
                console.error("FileReader error", error);
                alert("حدث خطأ أثناء قراءة الملف");
                if (type === 'logo') setUploadingLogo(false);
                else setUploadingFavicon(false);
            };
        } catch (error) {
            console.error("Upload process error", error);
            alert("حدث خطأ غير متوقع");
            if (type === 'logo') setUploadingLogo(false);
            else setUploadingFavicon(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings((prev) => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };


    const handleAdMobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings((prev) => ({
            ...prev,
            admob: {
                ...prev.admob,
                [name]: value
            }
        }));
    };

    const handleAdMobToggle = () => {
        setSettings((prev) => ({
            ...prev,
            admob: {
                ...prev.admob,
                isEnabled: !prev.admob.isEnabled
            }
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
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="logoUrl"
                            value={settings.logoUrl}
                            onChange={handleChange}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                            placeholder="/logo.png"
                        />
                        <div className="relative">
                            <input
                                type="file"
                                id="logo-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'logo')}
                            />
                            <label
                                htmlFor="logo-upload"
                                className="h-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-lg cursor-pointer transition-colors border border-slate-700"
                            >
                                {uploadingLogo ? <Loader2 className="animate-spin w-5 h-5" /> : <ImageIcon size={20} />}
                            </label>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">يمكنك إدخال رابط مباشر أو رفع صورة من جهازك.</p>

                    {settings.logoUrl && (
                        <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-lg inline-block">
                            <p className="text-xs text-slate-500 mb-2">معاينة الشعار:</p>
                            <img src={settings.logoUrl} alt="Logo Preview" className="h-12 object-contain" />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">رابط الأيقونة (Favicon URL)</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="faviconUrl"
                            value={settings.faviconUrl}
                            onChange={handleChange}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                            placeholder="/favicon.ico"
                        />
                        <div className="relative">
                            <input
                                type="file"
                                id="favicon-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'favicon')}
                            />
                            <label
                                htmlFor="favicon-upload"
                                className="h-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-lg cursor-pointer transition-colors border border-slate-700"
                            >
                                {uploadingFavicon ? <Loader2 className="animate-spin w-5 h-5" /> : <ImageIcon size={20} />}
                            </label>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">تظهر هذه الأيقونة في لسان المتصفح.</p>

                    {settings.faviconUrl && (
                        <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-lg inline-block">
                            <p className="text-xs text-slate-500 mb-2">معاينة الأيقونة:</p>
                            <img src={settings.faviconUrl} alt="Favicon Preview" className="w-8 h-8 object-contain" />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">العملة (Currency)</label>
                    <input
                        type="text"
                        name="currency"
                        value={settings.currency}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                        placeholder="ج.م"
                    />
                    <p className="text-xs text-slate-500 mt-1">العملة المستخدمة في عرض الخطط والدفع (مثال: ج.م، USD، SAR).</p>
                </div>

                <div className="pt-6 border-t border-slate-800">
                    <h3 className="text-xl font-bold text-white mb-4">وسائل التواصل الاجتماعي</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2">
                            <Facebook className="text-blue-500" size={20} />
                            <input
                                type="text"
                                name="facebook"
                                value={settings.socialLinks?.facebook}
                                onChange={handleSocialChange}
                                className="flex-1 bg-transparent border-none outline-none text-white text-sm"
                                placeholder="رابط فيسبوك"
                            />
                        </div>
                        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2">
                            <Twitter className="text-sky-400" size={20} />
                            <input
                                type="text"
                                name="twitter"
                                value={settings.socialLinks?.twitter}
                                onChange={handleSocialChange}
                                className="flex-1 bg-transparent border-none outline-none text-white text-sm"
                                placeholder="رابط تويتر"
                            />
                        </div>
                        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2">
                            <Instagram className="text-pink-500" size={20} />
                            <input
                                type="text"
                                name="instagram"
                                value={settings.socialLinks?.instagram}
                                onChange={handleSocialChange}
                                className="flex-1 bg-transparent border-none outline-none text-white text-sm"
                                placeholder="رابط إنستجرام"
                            />
                        </div>
                        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2">
                            <Youtube className="text-red-500" size={20} />
                            <input
                                type="text"
                                name="youtube"
                                value={settings.socialLinks?.youtube}
                                onChange={handleSocialChange}
                                className="flex-1 bg-transparent border-none outline-none text-white text-sm"
                                placeholder="رابط يوتيوب"
                            />
                        </div>
                        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 md:col-span-2">
                            <Send className="text-sky-500" size={20} />
                            <input
                                type="text"
                                name="telegram"
                                value={settings.socialLinks?.telegram}
                                onChange={handleSocialChange}
                                className="flex-1 bg-transparent border-none outline-none text-white text-sm"
                                placeholder="رابط تليجرام"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Film className="text-red-500" size={24} /> إدارة السلايدر الرئيسي
                    </h3>
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1">
                            <p className="text-white font-bold">تحكم في الأعمال المميزة</p>
                            <p className="text-slate-400 text-sm">تم نقل إعدادات السلايدر إلى قسم منفصل لتوفير تحكم أدق ومعاينة أسرع.</p>
                        </div>
                        <Link
                            href="/admin/slider"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-red-900/20 whitespace-nowrap"
                        >
                            انتقل إلى إدارة السلايدر
                        </Link>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white">إعلانات AdMob (تطبيق الأندرويد)</h3>
                            <p className="text-sm text-slate-400 mt-1">تحكم في ظهور الإعلانات داخل تطبيق الأندرويد.</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleAdMobToggle}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.admob?.isEnabled ? 'bg-green-600' : 'bg-slate-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.admob?.isEnabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    <div className={`space-y-4 transition-all duration-300 ${settings.admob?.isEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-400 text-xs font-medium mb-1.5 underline decoration-slate-800">App ID</label>
                                <input
                                    type="text"
                                    name="appId"
                                    value={settings.admob?.appId}
                                    onChange={handleAdMobChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx~xxxxxxxxxx"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs font-medium mb-1.5 underline decoration-slate-800">Banner Unit ID</label>
                                <input
                                    type="text"
                                    name="bannerId"
                                    value={settings.admob?.bannerId}
                                    onChange={handleAdMobChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-slate-400 text-xs font-medium mb-1.5 underline decoration-slate-800">Interstitial Unit ID</label>
                                <input
                                    type="text"
                                    name="interstitialId"
                                    value={settings.admob?.interstitialId}
                                    onChange={handleAdMobChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                                />
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 bg-slate-900/50 p-2 rounded border border-slate-800">
                            تنبيه: تأكد من استخدام معرفات صحيحة لتجنب توقف التطبيق أو تقييد الأرباح.
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-red-900/10 active:scale-[0.98]"
                    >
                        {saving ? (
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={20} />
                                حفظ جميع التغييرات
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
