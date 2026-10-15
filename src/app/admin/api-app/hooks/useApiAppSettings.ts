"use client";

import { useState, useEffect } from "react";

export type TabType = "maintenance" | "versioning" | "monetization" | "player" | "endpoints";

export function useApiAppSettings() {
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

    return {
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
    };
}
