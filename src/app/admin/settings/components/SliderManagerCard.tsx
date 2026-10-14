"use client";

import React from "react";
import { HeroSliderSettings, DEFAULT_HERO_SLIDER_SETTINGS } from "@/lib/home-presets";
import SliderHeaderSection from "./slider/SliderHeaderSection";
import SliderMotionControls from "./slider/SliderMotionControls";
import SliderBadgesControls from "./slider/SliderBadgesControls";

interface SliderManagerCardProps {
    slider: HeroSliderSettings;
    onChange: (updated: HeroSliderSettings) => void;
    onResetToDefault: () => void;
}

export default function SliderManagerCard({
    slider,
    onChange,
    onResetToDefault
}: SliderManagerCardProps) {
    const current = slider || DEFAULT_HERO_SLIDER_SETTINGS;

    const handleUpdate = (fields: Partial<HeroSliderSettings>) => {
        onChange({
            ...current,
            ...fields
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-[#131317] border border-white/[0.08] rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* 1. Header Banner & Actions */}
                <SliderHeaderSection
                    current={current}
                    onResetToDefault={onResetToDefault}
                />

                {/* 2. Form Controls Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {/* General & Motion Controls */}
                    <SliderMotionControls
                        current={current}
                        onUpdate={handleUpdate}
                    />

                    {/* Badges & Visuals Controls */}
                    <SliderBadgesControls
                        current={current}
                        onUpdate={handleUpdate}
                    />
                </div>
            </div>
        </div>
    );
}
