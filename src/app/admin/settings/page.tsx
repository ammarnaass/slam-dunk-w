"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    Settings, 
    Sparkles, 
    Save, 
    RotateCcw, 
    CheckCircle2, 
    AlertCircle, 
    ExternalLink, 
    SlidersHorizontal, 
    Palette, 
    Layers, 
    Film,
    Loader2,
    Columns,
    Smartphone
} from "lucide-react";
import LogoManagerCard from "./components/LogoManagerCard";
import IdentitySettingsCard from "./components/IdentitySettingsCard";
import SystemStatusCard from "./components/SystemStatusCard";
import PromoBannerCard from "./components/PromoBannerCard";
import FooterManagerCard from "./components/FooterManagerCard";
import ApiAppCard from "./components/ApiAppCard";
import { FullSiteSettings } from "@/server/types/settings.types";
import { DEFAULT_PROMO_BANNER } from "@/lib/promo-presets";
import { DEFAULT_FOOTER_CONFIG } from "@/lib/footer-presets";
import { DEFAULT_API_APP_CONFIG } from "@/lib/app-presets";

const INITIAL_SETTINGS: FullSiteSettings = {
    siteName: "أنمي دايز",
    siteNameEn: "ANIME DAZE",
    siteDescription: "منصتك الأولى لمشاهدة وتحميل أفضل مسلسلات وأفلام الأنمي المترجمة والمدبلجة بدقة عالية وبدون إعلانات مزعجة.",
    logoUrl: "https://lh3.googleusercontent.com/aida/AEtjO1UiSLhyw_pFl8EO-8FgL4HrDL2d9Oh8xf35S6mPsvN6CLAeTTpeY_Y4zm4rjsRuYww9UNqCIq98rij14h5osYHduHU73DQq5klCpJEZFM7q4WFwh529QyN14MBCOgwBQCafVH2D7Zqj8RtA7YeHEf53boMtjjIUflj41hkrmwwiWjLsz5RNzpHujzyYnwEwKNuokWsaRntGYjD842E14qpqp84ozsbd8Inmm-2ENPd6K5e0xdj7TSIckg",
    faviconUrl: "/favicon.ico",
    brandColor: "#dc2626",
    accentColor: "#ffb95f",
    currency: "ج.م",
    maintenanceMode: false,
    maintenanceMessage: "",
    socialLinks: {
        facebook: "",
        twitter: "",
        instagram: "",
        youtube: "",
        telegram: "",
        discord: "",
    },
    admob: {
        isEnabled: false,
        appId: "",
        bannerId: "",
        interstitialId: "",
        rewardedId: "",
    },
    promoBanner: DEFAULT_PROMO_BANNER,
    footer: DEFAULT_FOOTER_CONFIG,
    apiApp: DEFAULT_API_APP_CONFIG
};

export default function SettingsPage() {
    const [settings, setSettings] = useState<FullSiteSettings>(INITIAL_SETTINGS);
    const [originalSettings, setOriginalSettings] = useState<FullSiteSettings>(INITIAL_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"logo" | "identity" | "system" | "promo" | "footer" | "app">("logo");
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Check if there are unsaved changes
    const isDirty = JSON.stringify(settings) !== JSON.stringify(originalSettings);

    useEffect(() => {
        fetchSettings();
    }, []);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            // Try admin endpoint first
            let res = await fetch("/api/admin/settings");
            if (!res.ok) {
                // Fallback to public endpoint
                res = await fetch("/api/settings");
            }

            if (res.ok) {
                const json = await res.json();
                const data = json.data || json;
                const merged: FullSiteSettings = {
                    ...INITIAL_SETTINGS,
                    ...data,
                    socialLinks: {
                        ...INITIAL_SETTINGS.socialLinks,
                        ...(data.socialLinks || {})
                    },
                    admob: {
                        ...INITIAL_SETTINGS.admob,
                        ...(data.admob || {})
                    },
                    promoBanner: data.promoBanner ? {
                        ...INITIAL_SETTINGS.promoBanner,
                        ...data.promoBanner
                    } : INITIAL_SETTINGS.promoBanner,
                    footer: data.footer ? {
                        ...INITIAL_SETTINGS.footer,
                        ...data.footer,
                        socialLinks: Array.isArray(data.footer.socialLinks)
                            ? data.footer.socialLinks
                            : INITIAL_SETTINGS.footer?.socialLinks,
                        exploreLinks: Array.isArray(data.footer.exploreLinks)
                            ? data.footer.exploreLinks
                            : INITIAL_SETTINGS.footer?.exploreLinks,
                        helpLinks: Array.isArray(data.footer.helpLinks)
                            ? data.footer.helpLinks
                            : INITIAL_SETTINGS.footer?.helpLinks,
                    } : INITIAL_SETTINGS.footer,
                    apiApp: data.apiApp ? {
                        ...INITIAL_SETTINGS.apiApp,
                        ...data.apiApp,
                        releaseNotes: Array.isArray(data.apiApp.releaseNotes)
                            ? data.apiApp.releaseNotes
                            : (INITIAL_SETTINGS.apiApp?.releaseNotes || [])
                    } : INITIAL_SETTINGS.apiApp
                };
                setSettings(merged);
                setOriginalSettings(merged);
            }
        } catch (error) {
            console.error("Failed to load settings:", error);
            setToast({ type: "error", message: "تعذر تحميل إعدادات الموقع، جاري استخدام الإعدادات الافتراضية." });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (!res.ok) {
                // Fallback to public endpoint
                const fallbackRes = await fetch("/api/settings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(settings),
                });
                if (!fallbackRes.ok) throw new Error("Save failed");
            }

            setOriginalSettings(settings);
            setToast({ type: "success", message: "تم حفظ إعدادات وهوية الموقع وتحديث الواجهة بنجاح!" });
        } catch (error) {
            console.error("Error saving settings:", error);
            setToast({ type: "error", message: "حدث خطأ أثناء حفظ الإعدادات، يرجى المحاولة ثانية." });
        } finally {
            setSaving(false);
        }
    };

    const handleResetToDefaultBrand = () => {
        if (!confirm("هل أنت متأكد من استعادة شعار وهوية 'أنمي دايز' الرسمية الافتراضية؟")) return;

        setSettings(prev => ({
            ...prev,
            siteName: "أنمي دايز",
            siteNameEn: "ANIME DAZE",
            logoUrl: INITIAL_SETTINGS.logoUrl,
            brandColor: "#dc2626",
            accentColor: "#ffb95f"
        }));

        setToast({ type: "success", message: "تمت استعادة هوية أنمي دايز بنجاح! اضغط 'حفظ التغييرات' لاعتمادها." });
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#dc2626]/20 border border-[#dc2626]/40 flex items-center justify-center text-[#ffb4ab] animate-pulse">
                    <Loader2 className="animate-spin" size={24} />
                </div>
                <div>
                    <h3 className="font-cairo font-bold text-white text-base">جاري تحميل إعدادات المنصة</h3>
                    <p className="font-tajawal text-xs text-[#94a3b8] mt-1">يتم جلب بيانات الهوية والشعار وربط النظام...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-24" dir="rtl">
            {/* Toast Alert Notification */}
            {toast && (
                <div className={`fixed top-6 left-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
                    toast.type === "success" 
                        ? "bg-[#112211]/90 border-emerald-500/30 text-emerald-300 shadow-emerald-950/40" 
                        : "bg-[#221111]/90 border-red-500/30 text-red-300 shadow-red-950/40"
                }`}>
                    {toast.type === "success" ? <CheckCircle2 size={20} className="text-emerald-400" /> : <AlertCircle size={20} className="text-red-400" />}
                    <span className="font-tajawal text-xs font-bold">{toast.message}</span>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#dc2626] to-[#991b1b] p-0.5 shadow-xl shadow-red-950/40 shrink-0">
                        <div className="w-full h-full bg-[#131317] rounded-[14px] flex items-center justify-center text-[#ffb4ab]">
                            <Settings size={28} />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="font-cairo font-black text-2xl sm:text-3xl text-white">إعدادات وهوية الموقع</h1>
                            <span className="px-3 py-0.5 rounded-full bg-[#ffb95f]/15 border border-[#ffb95f]/30 text-[#ffb95f] font-cairo text-[11px] font-bold">
                                بنية الخدمات المستقلة
                            </span>
                        </div>
                        <p className="font-tajawal text-xs sm:text-sm text-[#94a3b8] mt-1">
                            التحكم الكامل في هوية وشعار منصة <span className="text-white font-bold">{settings.siteName}</span>، الألوان المعتمدة، والمحاكاة الحية
                        </p>
                    </div>
                </div>

                {/* Quick Header Actions */}
                <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                        type="button"
                        onClick={handleResetToDefaultBrand}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all cursor-pointer"
                        title="استرجاع شعار واسم أنمي دايز المعتمد"
                    >
                        <RotateCcw size={14} className="text-[#ffb95f]" />
                        <span>استعادة الشعار الرسمي</span>
                    </button>

                    <Link
                        href="/admin/slider"
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all"
                    >
                        <Film size={14} className="text-red-400" />
                        <span>إدارة السلايدر</span>
                    </Link>

                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all"
                    >
                        <ExternalLink size={14} className="text-[#94a3b8]" />
                        <span>عرض الموقع</span>
                    </Link>
                </div>
            </div>

            {/* Modular Tab Navigation */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#131317] border border-white/[0.08] max-w-fit">
                <button
                    type="button"
                    onClick={() => setActiveTab("logo")}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer ${
                        activeTab === "logo"
                            ? "bg-[#dc2626] text-white shadow-lg shadow-red-950/40"
                            : "text-[#94a3b8] hover:text-white hover:bg-white/[0.04]"
                    }`}
                >
                    <Layers size={16} />
                    <span>الشعار والمحاكاة المرئية</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("identity")}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer ${
                        activeTab === "identity"
                            ? "bg-[#dc2626] text-white shadow-lg shadow-red-950/40"
                            : "text-[#94a3b8] hover:text-white hover:bg-white/[0.04]"
                    }`}
                >
                    <Palette size={16} />
                    <span>الهوية والتسمية والألوان</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("system")}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer ${
                        activeTab === "system"
                            ? "bg-[#dc2626] text-white shadow-lg shadow-red-950/40"
                            : "text-[#94a3b8] hover:text-white hover:bg-white/[0.04]"
                    }`}
                >
                    <SlidersHorizontal size={16} />
                    <span>النظام، الصيانة، والإعلانات</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("promo")}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer ${
                        activeTab === "promo"
                            ? "bg-[#dc2626] text-white shadow-lg shadow-red-950/40"
                            : "text-[#94a3b8] hover:text-white hover:bg-white/[0.04]"
                    }`}
                >
                    <Sparkles size={16} />
                    <span>بانر الترويج وتطبيق PWA</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("footer")}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer ${
                        activeTab === "footer"
                            ? "bg-[#dc2626] text-white shadow-lg shadow-red-950/40"
                            : "text-[#94a3b8] hover:text-white hover:bg-white/[0.04]"
                    }`}
                >
                    <Columns size={16} />
                    <span>الشريط السفلي (Footer)</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("app")}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer ${
                        activeTab === "app"
                            ? "bg-[#dc2626] text-white shadow-lg shadow-red-950/40"
                            : "text-[#94a3b8] hover:text-white hover:bg-white/[0.04]"
                    }`}
                >
                    <Smartphone size={16} />
                    <span>تطبيق الأندرويد و API</span>
                </button>
            </div>

            {/* Tab 1: Logo & Visual Simulation */}
            {activeTab === "logo" && (
                <LogoManagerCard
                    logoUrl={settings.logoUrl}
                    faviconUrl={settings.faviconUrl || "/favicon.ico"}
                    siteName={settings.siteName}
                    onChangeLogo={(newLogo) => setSettings(prev => ({ ...prev, logoUrl: newLogo }))}
                    onChangeFavicon={(newFavicon) => setSettings(prev => ({ ...prev, faviconUrl: newFavicon }))}
                    onResetDefault={handleResetToDefaultBrand}
                />
            )}

            {/* Tab 2: Identity & Branding */}
            {activeTab === "identity" && (
                <IdentitySettingsCard
                    siteName={settings.siteName}
                    siteNameEn={settings.siteNameEn || "ANIME DAZE"}
                    siteDescription={settings.siteDescription}
                    brandColor={settings.brandColor || "#dc2626"}
                    accentColor={settings.accentColor || "#ffb95f"}
                    onChangeField={(field, value) => setSettings(prev => ({ ...prev, [field]: value }))}
                />
            )}

            {/* Tab 3: System, Maintenance & Ads */}
            {activeTab === "system" && (
                <SystemStatusCard
                    maintenanceMode={!!settings.maintenanceMode}
                    maintenanceMessage={settings.maintenanceMessage || ""}
                    currency={settings.currency || "ج.م"}
                    socialLinks={settings.socialLinks || {}}
                    admob={settings.admob || { isEnabled: false }}
                    onChangeField={(field, value) => setSettings(prev => ({ ...prev, [field]: value }))}
                    onChangeSocial={(platform, value) => setSettings(prev => ({
                        ...prev,
                        socialLinks: {
                            ...prev.socialLinks,
                            [platform]: value
                        }
                    }))}
                    onChangeAdmob={(field, value) => setSettings(prev => ({
                        ...prev,
                        admob: {
                            ...prev.admob,
                            isEnabled: prev.admob?.isEnabled || false,
                            [field]: value
                        }
                    }))}
                />
            )}

            {/* Tab 4: Promo & PWA Banner */}
            {activeTab === "promo" && (
                <PromoBannerCard
                    promo={settings.promoBanner}
                    onChange={(updatedPromo) => setSettings(prev => ({ ...prev, promoBanner: updatedPromo }))}
                />
            )}

            {/* Tab 5: Footer Management */}
            {activeTab === "footer" && (
                <FooterManagerCard
                    footer={settings.footer}
                    siteName={settings.siteName}
                    logoUrl={settings.logoUrl}
                    onChange={(updatedFooter) => setSettings(prev => ({ ...prev, footer: updatedFooter }))}
                />
            )}

            {/* Tab 6: Android App & API Integration */}
            {activeTab === "app" && (
                <ApiAppCard
                    apiApp={settings.apiApp}
                    onChange={(updatedApp) => setSettings(prev => ({ ...prev, apiApp: updatedApp }))}
                />
            )}

            {/* Floating / Sticky Save Bar */}
            <div className="fixed bottom-6 inset-x-0 z-40 max-w-4xl mx-auto px-4">
                <div className="bg-[#131317]/95 backdrop-blur-xl border border-white/[0.12] rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isDirty ? "bg-amber-400 animate-ping" : "bg-emerald-500"}`} />
                        <span className="font-cairo text-xs font-bold text-white hidden sm:inline">
                            {isDirty ? "توجد تغييرات غير محفوظة حالياً" : "جميع الإعدادات متزامنة ومحفوظة"}
                        </span>
                        <span className="font-tajawal text-[11px] text-[#94a3b8] hidden md:inline">
                            {isDirty ? "اضغط على زر الحفظ لتحديث الشعار والهوية فوراً" : "تحديث فوري لكل عناصر المنصة"}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {isDirty && (
                            <button
                                type="button"
                                onClick={() => setSettings(originalSettings)}
                                className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#94a3b8] hover:text-white transition-all cursor-pointer"
                            >
                                إلغاء التعديلات
                            </button>
                        )}

                        <button
                            type="button"
                            disabled={saving || !isDirty}
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] disabled:opacity-40 disabled:cursor-not-allowed text-white font-cairo font-bold text-xs shadow-lg shadow-red-950/50 transition-all cursor-pointer active:scale-95"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    <span>جاري الحفظ...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    <span>حفظ التغييرات</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
