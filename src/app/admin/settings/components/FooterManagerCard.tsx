"use client";

import { useState } from "react";
import { LayoutTemplate, RotateCcw } from "lucide-react";
import { FooterConfig, FooterLinkItem, FooterSocialItem } from "@/server/types/settings.types";
import { DEFAULT_FOOTER_CONFIG } from "@/lib/footer-presets";
import { FooterLiveSimulator } from "./footer/FooterLiveSimulator";
import { FooterBrandSection } from "./footer/FooterBrandSection";
import { FooterColumnsSection } from "./footer/FooterColumnsSection";
import { FooterAppCardSection } from "./footer/FooterAppCardSection";

interface FooterManagerCardProps {
    footer?: FooterConfig;
    onChange: (updated: FooterConfig) => void;
    siteName?: string;
    logoUrl?: string;
}

export default function FooterManagerCard({ 
    footer, 
    onChange,
    siteName = "أنمي دايز",
    logoUrl = "/logo.png"
}: FooterManagerCardProps) {
    const data: FooterConfig = footer || DEFAULT_FOOTER_CONFIG;
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

    const updateField = <K extends keyof FooterConfig>(field: K, value: FooterConfig[K]) => {
        onChange({
            ...data,
            [field]: value
        });
    };

    // Social Links Helpers
    const updateSocial = (id: string, field: keyof FooterSocialItem, value: any) => {
        const next = (data.socialLinks || []).map((s) => 
            s.id === id ? { ...s, [field]: value } : s
        );
        updateField("socialLinks", next);
    };

    // Explore Links Helpers
    const updateExploreLink = (id: string, field: keyof FooterLinkItem, value: any) => {
        const next = (data.exploreLinks || []).map((item) => 
            item.id === id ? { ...item, [field]: value } : item
        );
        updateField("exploreLinks", next);
    };

    const addExploreLink = () => {
        const newItem: FooterLinkItem = {
            id: `exp-${Date.now()}`,
            label: "رابط جديد",
            href: "/animes",
            isVip: false
        };
        updateField("exploreLinks", [...(data.exploreLinks || []), newItem]);
    };

    const removeExploreLink = (id: string) => {
        updateField("exploreLinks", (data.exploreLinks || []).filter(item => item.id !== id));
    };

    // Help Links Helpers
    const updateHelpLink = (id: string, field: keyof FooterLinkItem, value: any) => {
        const next = (data.helpLinks || []).map((item) => 
            item.id === id ? { ...item, [field]: value } : item
        );
        updateField("helpLinks", next);
    };

    const addHelpLink = () => {
        const newItem: FooterLinkItem = {
            id: `hlp-${Date.now()}`,
            label: "رابط مساعدة جديد",
            href: "/terms"
        };
        updateField("helpLinks", [...(data.helpLinks || []), newItem]);
    };

    const removeHelpLink = (id: string) => {
        updateField("helpLinks", (data.helpLinks || []).filter(item => item.id !== id));
    };

    const handleResetDefaults = () => {
        if (!confirm("هل أنت متأكد من استعادة كافة نصوص وروابط الشريط السفلي الافتراضية؟")) return;
        onChange(DEFAULT_FOOTER_CONFIG);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="p-6 rounded-3xl bg-[#181820]/80 border border-white/[0.08] backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#dc2626] to-[#ffb95f] p-0.5 shadow-lg shadow-red-950/50 shrink-0">
                        <div className="w-full h-full bg-[#131317] rounded-[14px] flex items-center justify-center text-[#ffb4ab]">
                            <LayoutTemplate size={24} />
                        </div>
                    </div>
                    <div>
                        <h2 className="font-cairo font-black text-lg sm:text-xl text-white">
                            إدارة الشريط السفلي (Footer)
                        </h2>
                        <p className="font-tajawal text-xs text-[#94a3b8] mt-0.5">
                            التحكم الكامل في نصوص وأعمدة وروابط الشريط السفلي، شبكات التواصل، وبطاقة التطبيق
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all cursor-pointer self-end sm:self-auto"
                    title="استرجاع نصوص وروابط الفوتر الافتراضية"
                >
                    <RotateCcw size={14} className="text-[#ffb95f]" />
                    <span>استعادة الافتراضي</span>
                </button>
            </div>

            {/* Main Form & Simulator Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Controls (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                    <FooterBrandSection
                        data={data}
                        updateField={updateField}
                        updateSocial={updateSocial}
                    />

                    <FooterColumnsSection
                        data={data}
                        updateField={updateField}
                        updateExploreLink={updateExploreLink}
                        addExploreLink={addExploreLink}
                        removeExploreLink={removeExploreLink}
                        updateHelpLink={updateHelpLink}
                        addHelpLink={addHelpLink}
                        removeHelpLink={removeHelpLink}
                    />

                    <FooterAppCardSection
                        data={data}
                        updateField={updateField}
                    />
                </div>

                {/* Live Simulator Preview (5 Cols Sticky) */}
                <div className="lg:col-span-5 sticky top-24 space-y-4">
                    <FooterLiveSimulator
                        data={data}
                        siteName={siteName}
                        previewDevice={previewDevice}
                        setPreviewDevice={setPreviewDevice}
                    />
                </div>
            </div>
        </div>
    );
}
