"use client";

import { RefreshCw } from "lucide-react";
import { useApiAppSettings } from "./hooks/useApiAppSettings";
import { ApiAppHeader } from "./components/ApiAppHeader";
import { ApiAppTabsNav } from "./components/ApiAppTabsNav";
import { MaintenanceTab } from "./components/MaintenanceTab";
import { VersioningTab } from "./components/VersioningTab";
import { MonetizationTab } from "./components/MonetizationTab";
import { PlayerConfigTab } from "./components/PlayerConfigTab";
import { EndpointsDocTab } from "./components/EndpointsDocTab";

export default function ApiAppPage() {
    const {
        loading,
        saving,
        saveSuccess,
        activeTab,
        setActiveTab,
        copiedField,
        testingApi,
        apiTestResult,
        settings,
        handleApiAppChange,
        handleAdmobChange,
        handleAddReleaseNote,
        handleRemoveReleaseNote,
        handleCopy,
        handleSubmit,
        runLiveApiTest,
    } = useApiAppSettings();

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
            <ApiAppHeader
                isMaintenance={settings.apiApp.isMaintenance}
                saving={saving}
                saveSuccess={saveSuccess}
                onSubmit={handleSubmit}
            />

            {/* Navigation Tabs */}
            <ApiAppTabsNav activeTab={activeTab} onTabChange={setActiveTab} />

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
