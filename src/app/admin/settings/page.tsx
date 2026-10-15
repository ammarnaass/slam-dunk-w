"use client";

import { Suspense } from "react";
import LogoManagerCard from "./components/LogoManagerCard";
import IdentitySettingsCard from "./components/IdentitySettingsCard";
import SystemStatusCard from "./components/SystemStatusCard";
import PromoBannerCard from "./components/PromoBannerCard";
import FooterManagerCard from "./components/FooterManagerCard";
import ApiAppCard from "./components/ApiAppCard";
import HomeScreenManagerCard from "./components/HomeScreenManagerCard";
import SliderManagerCard from "./components/SliderManagerCard";
import SettingsHeader from "./components/SettingsHeader";
import SettingsTabsNav from "./components/SettingsTabsNav";
import SettingsStickySaveBar from "./components/SettingsStickySaveBar";
import SettingsToast from "./components/SettingsToast";
import SettingsLoader from "./components/SettingsLoader";
import { useAdminSettingsManager } from "./hooks/useAdminSettingsManager";
import { DEFAULT_HOME_SCREEN_CONFIG } from "@/lib/home-presets";

function SettingsContent() {
    const {
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
    } = useAdminSettingsManager();

    if (loading) {
        return <SettingsLoader />;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-24" dir="rtl">
            <SettingsToast toast={toast} />

            <SettingsHeader
                siteName={settings.siteName}
                onResetDefault={handleResetToDefaultBrand}
            />

            <SettingsTabsNav
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            {/* Tab: Home Screen Sections Customization */}
            {activeTab === "home" && (
                <HomeScreenManagerCard
                    config={settings.homeConfig || DEFAULT_HOME_SCREEN_CONFIG}
                    onChange={(updatedHome) => setSettings(prev => ({ ...prev, homeConfig: updatedHome }))}
                    onResetToDefault={() => setSettings(prev => ({ ...prev, homeConfig: DEFAULT_HOME_SCREEN_CONFIG }))}
                />
            )}

            {/* Tab: Hero Slider Settings */}
            {activeTab === "slider" && (
                <SliderManagerCard
                    slider={settings.homeConfig?.slider || DEFAULT_HOME_SCREEN_CONFIG.slider}
                    onChange={(updatedSlider) => setSettings(prev => ({
                        ...prev,
                        homeConfig: {
                            ...(prev.homeConfig || DEFAULT_HOME_SCREEN_CONFIG),
                            slider: updatedSlider
                        }
                    }))}
                    onResetToDefault={() => setSettings(prev => ({
                        ...prev,
                        homeConfig: {
                            ...(prev.homeConfig || DEFAULT_HOME_SCREEN_CONFIG),
                            slider: DEFAULT_HOME_SCREEN_CONFIG.slider
                        }
                    }))}
                />
            )}

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

            <SettingsStickySaveBar
                isDirty={isDirty}
                saving={saving}
                onResetChanges={handleResetChanges}
                onSave={handleSave}
            />
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={<SettingsLoader />}>
            <SettingsContent />
        </Suspense>
    );
}
