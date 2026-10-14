"use client";

import React from "react";
import { AdminPlanetItem } from "@/lib/planets-presets";

interface PlanetariumOrbitPillsProps {
    activePlanets: AdminPlanetItem[];
    selectedPlanetId: string;
    onSelectPlanet: (id: string) => void;
    soundEnabled: boolean;
    playCosmicChime: (freq: number) => void;
}

export function PlanetariumOrbitPills({
    activePlanets,
    selectedPlanetId,
    onSelectPlanet,
    soundEnabled,
    playCosmicChime,
}: PlanetariumOrbitPillsProps) {
    return (
        <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-center gap-2 overflow-x-auto py-1 px-2 no-scrollbar pointer-events-auto">
            <button
                type="button"
                onClick={() => onSelectPlanet("all")}
                className={`px-3 py-1.5 rounded-xl font-cairo text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${
                    selectedPlanetId === "all"
                        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30 scale-105"
                        : "bg-black/60 text-[#ac8884] hover:text-white border border-white/10"
                }`}
            >
                <span>🌌</span>
                <span>جميع الكواكب</span>
            </button>

            {activePlanets.map(planet => {
                const isSelected = selectedPlanetId === planet.id;
                return (
                    <button
                        key={planet.id}
                        type="button"
                        onClick={() => {
                            onSelectPlanet(planet.id);
                            if (soundEnabled) playCosmicChime(500);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-cairo text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${
                            isSelected
                                ? "bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-950/40 scale-105 border border-amber-400/40"
                                : "bg-black/60 text-[#ac8884] hover:text-white border border-white/10"
                        }`}
                    >
                        <span>{planet.badge}</span>
                        <span>{planet.name}</span>
                    </button>
                );
            })}
        </div>
    );
}
