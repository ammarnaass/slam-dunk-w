"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { AdminPlanetItem } from "@/lib/planets-presets";
import { createPlanetTexture, createRingTexture } from "@/app/planets/components/planet-textures";
import { X, Sparkles, Orbit } from "lucide-react";

interface Planet3DPreviewModalProps {
    planet: AdminPlanetItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function Planet3DPreviewModal({
    planet,
    isOpen,
    onClose,
}: Planet3DPreviewModalProps) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen || !planet) return;
        const container = mountRef.current;
        if (!container) return;

        const width = container.clientWidth || 400;
        const height = container.clientHeight || 360;

        // Scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 4, 12);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 2.0, 50);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Planet Sphere
        const texture = createPlanetTexture(
            planet.threeDConfig?.textureStyle || planet.id,
            planet.color || "#ea580c",
            planet.glowColor || "rgba(234, 88, 12, 0.4)"
        );

        const radius = 2.4 * (planet.threeDConfig?.scale || 1.0);
        const geo = new THREE.SphereGeometry(radius, 48, 48);
        const mat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.4,
            metalness: 0.1
        });
        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);

        // Planetary Ring if enabled
        let ringMesh: THREE.Mesh | null = null;
        if (planet.threeDConfig?.hasRings) {
            const ringGeo = new THREE.RingGeometry(radius * 1.35, radius * 2.3, 48);
            const ringTex = createRingTexture(planet.threeDConfig.ringColor || planet.color);
            const ringMat = new THREE.MeshBasicMaterial({
                map: ringTex,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            });
            ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.rotation.x = Math.PI / 2 + ((planet.threeDConfig.ringTilt || 25) * Math.PI) / 180;
            scene.add(ringMesh);
        }

        // Animation Loop
        let frameId: number;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            mesh.rotation.y += 0.012 * (planet.threeDConfig?.rotationSpeed || 1.0);
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            if (renderer.domElement && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [isOpen, planet]);

    if (!isOpen || !planet) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200" dir="rtl">
            <div className="w-full max-w-lg rounded-3xl bg-[#131317] border border-amber-500/30 shadow-2xl p-6 relative overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md"
                            style={{ 
                                backgroundColor: `${planet.color}25`,
                                border: `1px solid ${planet.color}50`
                            }}
                        >
                            <span>{planet.badge}</span>
                        </div>
                        <div>
                            <h3 className="font-cairo font-black text-lg text-white">
                                معاينة {planet.name} ثلاثية الأبعاد
                            </h3>
                            <span className="font-tajawal text-xs text-amber-400">
                                محاكاة فيزيائية في الفضاء الكوني
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl text-[#94a3b8] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* 3D Canvas Mount */}
                <div 
                    ref={mountRef} 
                    className="w-full h-72 rounded-2xl bg-gradient-to-b from-[#07070b] via-[#0d0d15] to-[#07070b] my-4 border border-white/5 flex items-center justify-center relative overflow-hidden"
                >
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] font-mono text-amber-300">
                        <Orbit size={12} className="animate-spin" />
                        <span>Realtime 3D WebGL</span>
                    </div>
                </div>

                {/* 3D Specs Summary */}
                <div className="grid grid-cols-2 gap-3 text-xs font-tajawal bg-[#1b1b22] p-3.5 rounded-2xl border border-white/5">
                    <div>
                        <span className="text-[#94a3b8] block">الحلقات المدارية:</span>
                        <span className="font-cairo font-bold text-white">
                            {planet.threeDConfig?.hasRings ? "✅ مفعّلة" : "❌ غير مفعلة"}
                        </span>
                    </div>
                    <div>
                        <span className="text-[#94a3b8] block">سرعة الدوران:</span>
                        <span className="font-cairo font-bold text-white">
                            {planet.threeDConfig?.rotationSpeed || 1.0}x
                        </span>
                    </div>
                    <div>
                        <span className="text-[#94a3b8] block">لون التوهج:</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span 
                                className="w-3.5 h-3.5 rounded-full inline-block border border-white/20"
                                style={{ backgroundColor: planet.threeDConfig?.atmosphereGlow || planet.color }}
                            />
                            <span className="font-mono text-[11px] text-white">
                                {planet.threeDConfig?.atmosphereGlow || planet.color}
                            </span>
                        </div>
                    </div>
                    <div>
                        <span className="text-[#94a3b8] block">الشعار الكوني:</span>
                        <span className="font-cairo font-bold text-amber-300 truncate block">
                            {planet.slogan}
                        </span>
                    </div>
                </div>

                {/* Close Button */}
                <div className="mt-5 text-left">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-cairo font-bold transition-all cursor-pointer"
                    >
                        إغلاق المعاينة
                    </button>
                </div>
            </div>
        </div>
    );
}
