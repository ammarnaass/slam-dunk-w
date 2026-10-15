import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FullSiteSettings } from "@/server/types/settings.types";
import { DEFAULT_HOME_SCREEN_CONFIG } from "@/lib/home-presets";
import { INITIAL_SETTINGS, ValidTab } from "../constants/initial-settings";

const VALID_TABS: ValidTab[] = ["logo", "identity", "system", "home", "slider", "promo", "footer", "app"];

export function useAdminSettingsManager() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabParam = searchParams.get("tab") as ValidTab | null;

    const [settings, setSettings] = useState<FullSiteSettings>(INITIAL_SETTINGS);
    const [originalSettings, setOriginalSettings] = useState<FullSiteSettings>(INITIAL_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<ValidTab>(
        tabParam && VALID_TABS.includes(tabParam) ? tabParam : "home"
    );
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Sync activeTab when query param changes
    useEffect(() => {
        if (tabParam && VALID_TABS.includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const handleTabChange = useCallback((tab: ValidTab) => {
        setActiveTab(tab);
        router.replace(`/admin/settings?tab=${tab}`, { scroll: false });
    }, [router]);

    // Check if there are unsaved changes
    const isDirty = JSON.stringify(settings) !== JSON.stringify(originalSettings);

    const fetchSettings = useCallback(async () => {
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
                    } : INITIAL_SETTINGS.apiApp,
                    homeConfig: data.homeConfig ? {
                        sections: Array.isArray(data.homeConfig.sections) && data.homeConfig.sections.length > 0
                            ? data.homeConfig.sections
                            : (INITIAL_SETTINGS.homeConfig?.sections || []),
                        slider: {
                            ...(INITIAL_SETTINGS.homeConfig?.slider || DEFAULT_HOME_SCREEN_CONFIG.slider),
                            ...(data.homeConfig.slider || {})
                        }
                    } : INITIAL_SETTINGS.homeConfig
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
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

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

    const handleResetChanges = () => {
        setSettings(originalSettings);
    };

    return {
        settings,
        setSettings,
        loading,
        saving,
        activeTab,
        handleTabChange,
        toast,
        isDirty,
        handleSave,
        handleResetToDefaultBrand,
        handleResetChanges,
        fetchSettings
    };
}
