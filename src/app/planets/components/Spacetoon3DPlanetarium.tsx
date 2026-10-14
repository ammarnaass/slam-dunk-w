"use client";

import React, { useRef, useState, useMemo } from "react";
import { AdminPlanetItem } from "@/lib/planets-presets";
import { playCosmicChime } from "./planet-textures";
import { PlanetariumControlsBar } from "./PlanetariumControlsBar";
import { PlanetariumSelectedDrawer } from "./PlanetariumSelectedDrawer";
import { PlanetariumOrbitPills } from "./PlanetariumOrbitPills";
import { useThreeOrbitEngine } from "./useThreeOrbitEngine";

interface Spacetoon3DPlanetariumProps {
    planets: AdminPlanetItem[];
    selectedPlanetId: string;
    onSelectPlanet: (id: string) => void;
    autoRotateDefault?: boolean;
    soundDefault?: boolean;
}

export function Spacetoon3DPlanetarium({
    planets,
    selectedPlanetId,
    onSelectPlanet,
    autoRotateDefault = true,
    soundDefault = true,
}: Spacetoon3DPlanetariumProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const [autoRotate, setAutoRotate] = useState(autoRotateDefault);
    const [soundEnabled, setSoundEnabled] = useState(soundDefault);
    const [hoveredPlanet, setHoveredPlanet] = useState<AdminPlanetItem | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

    // Filter enabled planets only
    const activePlanets = useMemo(() => {
        return planets.filter(p => p.isEnabled).sort((a, b) => a.order - b.order);
    }, [planets]);

    // Active selected planet object
    const selectedPlanet = useMemo(() => {
        if (!selectedPlanetId || selectedPlanetId === "all") return null;
        return activePlanets.find(p => p.id === selectedPlanetId || p.name === selectedPlanetId || p.arabicGenre === selectedPlanetId) || null;
    }, [selectedPlanetId, activePlanets]);

    const { handleResetCamera, handleZoom } = useThreeOrbitEngine({
        mountRef,
        activePlanets,
        selectedPlanetId,
        selectedPlanet,
        autoRotate,
        soundEnabled,
        onSelectPlanet,
        setHoveredPlanet,
        setTooltipPos,
        hoveredPlanetId: hoveredPlanet?.id
    });

    return (
        <div className="relative w-full rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-b from-[#07070b] via-[#0d0d15] to-[#07070b] shadow-2xl shadow-amber-950/20 mb-10 select-none">
            {/* Top HUD Controls Overlay */}
            <PlanetariumControlsBar
                planetsCount={activePlanets.length}
                autoRotate={autoRotate}
                onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
                onZoomIn={() => handleZoom("in")}
                onZoomOut={() => handleZoom("out")}
                onResetCamera={handleResetCamera}
            />

            {/* Three.js Canvas Container */}
            <div 
                ref={mountRef} 
                className="w-full h-[520px] sm:h-[600px] cursor-grab active:cursor-grabbing" 
            />

            {/* Floating Tooltip during Hover */}
            {hoveredPlanet && tooltipPos && !selectedPlanet && (
                <div 
                    className="absolute z-30 pointer-events-none px-3.5 py-2 rounded-xl bg-[#131317]/90 backdrop-blur-md border border-white/15 text-white shadow-2xl flex items-center gap-2 transform -translate-x-1/2 -translate-y-full transition-all"
                    style={{ left: tooltipPos.x, top: tooltipPos.y - 12 }}
                >
                    <span className="text-lg">{hoveredPlanet.badge}</span>
                    <div>
                        <h4 className="font-cairo font-black text-xs text-white leading-tight">{hoveredPlanet.name}</h4>
                        <span className="text-[10px] text-amber-400 font-tajawal">{hoveredPlanet.slogan}</span>
                    </div>
                </div>
            )}

            {/* Selected Planet Cosmic Drawer Overlay */}
            <PlanetariumSelectedDrawer
                selectedPlanet={selectedPlanet || null}
                onClose={() => onSelectPlanet("all")}
                onResetCamera={handleResetCamera}
            />

            {/* Bottom Quick Orbit Carousel Selector */}
            <PlanetariumOrbitPills
                activePlanets={activePlanets}
                selectedPlanetId={selectedPlanetId}
                onSelectPlanet={onSelectPlanet}
                soundEnabled={soundEnabled}
                playCosmicChime={playCosmicChime}
            />
        </div>
    );
}
