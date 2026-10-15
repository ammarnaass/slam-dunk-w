"use client";

import { PromoBannerConfig } from "@/server/types/settings.types";
import { DEFAULT_PROMO_BANNER } from "@/lib/promo-presets";
import {
    PromoHeaderSection,
    PromoGeneralTextsSection,
    PromoFeaturesSection,
    PromoActionButtonsSection,
    PromoPosterSection,
    PromoBannerLivePreview,
    AVAILABLE_FEATURE_ICONS,
} from "./promo";

interface PromoBannerCardProps {
    promo?: PromoBannerConfig;
    onChange: (updated: PromoBannerConfig) => void;
}

export default function PromoBannerCard({ promo, onChange }: PromoBannerCardProps) {
    const data: PromoBannerConfig = promo || DEFAULT_PROMO_BANNER;

    const updateField = <K extends keyof PromoBannerConfig>(field: K, value: PromoBannerConfig[K]) => {
        onChange({
            ...data,
            [field]: value
        });
    };

    const handleResetDefaults = () => {
        if (confirm("هل أنت متأكد من استعادة كافة نصوص وإعدادات البانر الافتراضية؟")) {
            onChange(DEFAULT_PROMO_BANNER);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Control Card */}
            <PromoHeaderSection
                data={data}
                onToggleEnabled={() => updateField("isEnabled", !data.isEnabled)}
                onResetDefaults={handleResetDefaults}
            />

            {/* Split Grid: Editor Side (7 Cols) + Live Simulator (5 Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Editor Settings (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Card 1: Texts & Fast Streaming Badge */}
                    <PromoGeneralTextsSection
                        data={data}
                        updateField={updateField}
                    />

                    {/* Card 2: App Features / Perks */}
                    <PromoFeaturesSection
                        data={data}
                        updateField={updateField}
                        availableFeatureIcons={AVAILABLE_FEATURE_ICONS}
                    />

                    {/* Card 3: Call-To-Action Buttons & VIP Discounts */}
                    <PromoActionButtonsSection
                        data={data}
                        updateField={updateField}
                    />

                    {/* Card 4: Promotional Poster Image */}
                    <PromoPosterSection
                        data={data}
                        updateField={updateField}
                    />
                </div>

                {/* Live Simulator Preview Component */}
                <PromoBannerLivePreview data={data} />
            </div>
        </div>
    );
}
