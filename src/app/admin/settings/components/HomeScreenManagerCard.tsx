"use client";

import { useState } from "react";
import { HomeScreenConfig, HomeSectionItem, HomeSectionId, DEFAULT_HOME_SECTIONS } from "@/lib/home-presets";
import { HomeSectionRow, HomeScreenHeader, HomeScreenWireframeFooter } from "./home-screen";

interface HomeScreenManagerCardProps {
    config: HomeScreenConfig;
    onChange: (updated: HomeScreenConfig) => void;
    onResetToDefault: () => void;
}

export default function HomeScreenManagerCard({
    config,
    onChange,
    onResetToDefault
}: HomeScreenManagerCardProps) {
    const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);

    const sections = [...(config?.sections || DEFAULT_HOME_SECTIONS)].sort((a, b) => a.order - b.order);

    const handleToggleEnabled = (id: HomeSectionId) => {
        const updated = sections.map(s => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s);
        onChange({
            ...config,
            sections: updated
        });
    };

    const handleMove = (index: number, direction: "up" | "down") => {
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === sections.length - 1) return;

        const targetIndex = direction === "up" ? index - 1 : index + 1;
        const newSections = [...sections];
        
        // Swap items
        const temp = newSections[index];
        newSections[index] = newSections[targetIndex];
        newSections[targetIndex] = temp;

        // Re-assign 1-based order
        const reordered = newSections.map((s, idx) => ({
            ...s,
            order: idx + 1
        }));

        onChange({
            ...config,
            sections: reordered
        });
    };

    const handleUpdateSection = (id: HomeSectionId, fields: Partial<HomeSectionItem>) => {
        const updated = sections.map(s => s.id === id ? { ...s, ...fields } : s);
        onChange({
            ...config,
            sections: updated
        });
    };

    const enabledSections = sections.filter(s => s.isEnabled);

    return (
        <div className="space-y-6">
            <div className="bg-[#131317] border border-white/[0.08] rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* Header Info */}
                <HomeScreenHeader
                    enabledCount={enabledSections.length}
                    totalCount={sections.length}
                    onResetToDefault={onResetToDefault}
                />

                {/* Section Cards List */}
                <div className="mt-6 space-y-3 relative z-10">
                    {sections.map((section, index) => (
                        <HomeSectionRow
                            key={section.id}
                            section={section}
                            index={index}
                            isFirst={index === 0}
                            isLast={index === sections.length - 1}
                            isExpanded={expandedSectionId === section.id}
                            onMove={handleMove}
                            onToggleEnabled={handleToggleEnabled}
                            onToggleExpand={(id) => setExpandedSectionId(expandedSectionId === id ? null : id)}
                            onUpdateSection={handleUpdateSection}
                        />
                    ))}
                </div>

                {/* Wireframe Mini Visualizer Footer */}
                <HomeScreenWireframeFooter enabledSections={enabledSections} />
            </div>
        </div>
    );
}
