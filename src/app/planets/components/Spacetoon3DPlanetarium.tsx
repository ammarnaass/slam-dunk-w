"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { AdminPlanetItem } from "@/lib/planets-presets";
import { createPlanetTexture, createRingTexture, playCosmicChime } from "./planet-textures";
import { 
    RotateCcw, 
    Volume2, 
    VolumeX, 
    Play, 
    Pause, 
    ZoomIn, 
    ZoomOut, 
    Compass, 
    Sparkles, 
    ChevronDown,
    ExternalLink
} from "lucide-react";

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
        return activePlanets.find(p => p.id === selectedPlanetId || p.name === selectedPlanetId || p.arabicGenre === selectedPlanetId);
    }, [selectedPlanetId, activePlanets]);

    // Three.js runtime references
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const planetMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
    const ringMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
    const targetCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 36, 68));
    const isDraggingRef = useRef(false);
    const prevMousePosRef = useRef({ x: 0, y: 0 });
    const orbitAngleRef = useRef(0);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight || 560;

        // 1. Scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // 2. Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 36, 68);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // 3. Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // 4. Starfield Background (1500 particles)
        const starsGeo = new THREE.BufferGeometry();
        const starsCount = 1400;
        const starPositions = new Float32Array(starsCount * 3);
        const starColors = new Float32Array(starsCount * 3);

        for (let i = 0; i < starsCount * 3; i += 3) {
            starPositions[i] = (Math.random() - 0.5) * 450;
            starPositions[i + 1] = (Math.random() - 0.5) * 450;
            starPositions[i + 2] = (Math.random() - 0.5) * 450;

            const isGold = Math.random() > 0.8;
            starColors[i] = isGold ? 1.0 : 0.9 + Math.random() * 0.1;
            starColors[i + 1] = isGold ? 0.85 : 0.9 + Math.random() * 0.1;
            starColors[i + 2] = isGold ? 0.4 : 1.0;
        }

        starsGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
        starsGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
        const starsMat = new THREE.PointsMaterial({
            size: 1.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.85
        });
        const starField = new THREE.Points(starsGeo, starsMat);
        scene.add(starField);

        // 5. Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
        scene.add(ambientLight);

        const centerPointLight = new THREE.PointLight(0xffecd2, 2.5, 300);
        centerPointLight.position.set(0, 5, 0);
        scene.add(centerPointLight);

        // 6. Central Celestial Sun / Spacetoon Core
        const coreGeo = new THREE.SphereGeometry(3.2, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0xffa500,
            transparent: true,
            opacity: 0.85
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        scene.add(coreMesh);

        // Core Atmosphere Corona Glow
        const coronaGeo = new THREE.SphereGeometry(4.2, 32, 32);
        const coronaMat = new THREE.MeshBasicMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.25,
            side: THREE.BackSide
        });
        const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
        scene.add(coronaMesh);

        // 7. Generate Planets along Elliptical Orbits
        planetMeshesRef.current.clear();
        ringMeshesRef.current.clear();

        const count = activePlanets.length;
        const baseRadiusX = 14;
        const radiusStepX = 3.6;
        const baseRadiusZ = 10;
        const radiusStepZ = 2.6;

        activePlanets.forEach((planet, index) => {
            const rx = baseRadiusX + index * radiusStepX;
            const rz = baseRadiusZ + index * radiusStepZ;
            const initialAngle = (index / count) * Math.PI * 2;

            // Orbit line
            const orbitCurve = new THREE.EllipseCurve(0, 0, rx, rz, 0, 2 * Math.PI, false, 0);
            const points = orbitCurve.getPoints(80);
            const orbitGeo = new THREE.BufferGeometry().setFromPoints(
                points.map(p => new THREE.Vector3(p.x, 0, p.y))
            );
            const orbitMat = new THREE.LineBasicMaterial({
                color: new THREE.Color(planet.color || "#ffffff"),
                transparent: true,
                opacity: 0.18
            });
            const orbitLine = new THREE.Line(orbitGeo, orbitMat);
            scene.add(orbitLine);

            // Planet Sphere
            const texture = createPlanetTexture(
                planet.threeDConfig?.textureStyle || planet.id,
                planet.color || "#ea580c",
                planet.glowColor || "rgba(234, 88, 12, 0.4)"
            );

            const scale = planet.threeDConfig?.scale || 1.0;
            const pRadius = 1.6 * scale;
            const planetGeo = new THREE.SphereGeometry(pRadius, 32, 32);
            const planetMat = new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 0.45,
                metalness: 0.15
            });

            const planetMesh = new THREE.Mesh(planetGeo, planetMat);
            planetMesh.userData = {
                id: planet.id,
                planet,
                rx,
                rz,
                angle: initialAngle,
                speed: (0.003 / (index * 0.15 + 1)) * (planet.threeDConfig?.rotationSpeed || 1.0)
            };

            const px = Math.cos(initialAngle) * rx;
            const pz = Math.sin(initialAngle) * rz;
            planetMesh.position.set(px, 0, pz);
            scene.add(planetMesh);
            planetMeshesRef.current.set(planet.id, planetMesh);

            // Planetary Rings (if enabled)
            if (planet.threeDConfig?.hasRings) {
                const ringInner = pRadius * 1.35;
                const ringOuter = pRadius * 2.3;
                const ringGeo = new THREE.RingGeometry(ringInner, ringOuter, 32);
                const ringTexture = createRingTexture(planet.threeDConfig.ringColor || planet.color);
                const ringMat = new THREE.MeshBasicMaterial({
                    map: ringTexture,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.75
                });
                const ringMesh = new THREE.Mesh(ringGeo, ringMat);
                ringMesh.rotation.x = Math.PI / 2 + ((planet.threeDConfig.ringTilt || 25) * Math.PI) / 180;
                ringMesh.position.copy(planetMesh.position);
                scene.add(ringMesh);
                ringMeshesRef.current.set(planet.id, ringMesh);
            }
        });

        // 8. Raycaster for Hover & Click Interactivity
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

            if (isDraggingRef.current) {
                const deltaX = e.clientX - prevMousePosRef.current.x;
                const deltaY = e.clientY - prevMousePosRef.current.y;
                orbitAngleRef.current += deltaX * 0.008;
                camera.position.y = Math.max(10, Math.min(60, camera.position.y - deltaY * 0.08));
                prevMousePosRef.current = { x: e.clientX, y: e.clientY };
                return;
            }

            raycaster.setFromCamera(mouse, camera);
            const meshes = Array.from(planetMeshesRef.current.values());
            const intersects = raycaster.intersectObjects(meshes);

            if (intersects.length > 0) {
                const hit = intersects[0].object as THREE.Mesh;
                const p = hit.userData.planet as AdminPlanetItem;
                setHoveredPlanet(p);
                setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                container.style.cursor = "pointer";
            } else {
                setHoveredPlanet(null);
                setTooltipPos(null);
                container.style.cursor = "default";
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            isDraggingRef.current = true;
            prevMousePosRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
        };

        const handleClick = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const meshes = Array.from(planetMeshesRef.current.values());
            const intersects = raycaster.intersectObjects(meshes);

            if (intersects.length > 0) {
                const hit = intersects[0].object as THREE.Mesh;
                const p = hit.userData.planet as AdminPlanetItem;
                onSelectPlanet(p.id);
                if (soundEnabled) {
                    playCosmicChime(440 + Math.random() * 200);
                }
            }
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        container.addEventListener("click", handleClick);

        // 9. Animation Loop
        let animationFrameId: number;
        let clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const delta = clock.getDelta();

            // Rotate starfield slowly
            starField.rotation.y += 0.0003;
            coreMesh.rotation.y += 0.005;

            // Animate Planet Orbits & Self-Rotations
            planetMeshesRef.current.forEach((mesh, id) => {
                const data = mesh.userData;
                if (autoRotate) {
                    data.angle += data.speed;
                }

                const px = Math.cos(data.angle) * data.rx;
                const pz = Math.sin(data.angle) * data.rz;
                mesh.position.set(px, 0, pz);
                mesh.rotation.y += 0.015;

                // Sync Rings Position
                const ring = ringMeshesRef.current.get(id);
                if (ring) {
                    ring.position.set(px, 0, pz);
                }

                // Scale pulse if hovered or selected
                const isSelected = selectedPlanetId === id;
                const targetScale = isSelected ? 1.35 : hoveredPlanet?.id === id ? 1.2 : 1.0;
                mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
            });

            // Camera Motion (Focus or Orbit)
            if (selectedPlanet && planetMeshesRef.current.has(selectedPlanet.id)) {
                const targetMesh = planetMeshesRef.current.get(selectedPlanet.id)!;
                const targetCamX = targetMesh.position.x + 8;
                const targetCamY = targetMesh.position.y + 7;
                const targetCamZ = targetMesh.position.z + 14;
                camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.05);
                camera.lookAt(targetMesh.position);
            } else {
                // Orbit around solar center
                const camRadius = 72;
                const camX = Math.sin(orbitAngleRef.current) * camRadius;
                const camZ = Math.cos(orbitAngleRef.current) * camRadius;
                camera.position.x = THREE.MathUtils.lerp(camera.position.x, camX, 0.05);
                camera.position.z = THREE.MathUtils.lerp(camera.position.z, camZ, 0.05);
                camera.lookAt(0, 0, 0);
            }

            renderer.render(scene, camera);
        };

        animate();

        // 10. Resize handler
        const handleResize = () => {
            if (!container || !renderer || !camera) return;
            const w = container.clientWidth;
            const h = container.clientHeight || 560;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            container.removeEventListener("click", handleClick);
            window.removeEventListener("resize", handleResize);

            if (renderer.domElement && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [activePlanets, autoRotate, soundEnabled, selectedPlanetId, onSelectPlanet]);

    const handleResetCamera = () => {
        onSelectPlanet("all");
        orbitAngleRef.current = 0;
        if (cameraRef.current) {
            cameraRef.current.position.set(0, 36, 68);
            cameraRef.current.lookAt(0, 0, 0);
        }
    };

    const handleZoom = (direction: "in" | "out") => {
        if (!cameraRef.current) return;
        const factor = direction === "in" ? 0.85 : 1.15;
        cameraRef.current.position.multiplyScalar(factor);
    };

    return (
        <div className="relative w-full rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-b from-[#07070b] via-[#0d0d15] to-[#07070b] shadow-2xl shadow-amber-950/20 mb-10 select-none">
            {/* Top HUD Controls Bar */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                {/* Brand / Mode badge */}
                <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-xl">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <span className="font-cairo font-black text-xs sm:text-sm text-amber-300">مدار كواكب سبيستون 3D</span>
                    <span className="text-[11px] font-mono text-[#ac8884] hidden sm:inline">| {activePlanets.length} كواكب نشطة</span>
                </div>

                {/* HUD Interactive Action Buttons */}
                <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
                    <button
                        type="button"
                        onClick={() => setAutoRotate(!autoRotate)}
                        className={`p-2.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                            autoRotate 
                                ? "bg-amber-500/20 border-amber-500/40 text-amber-300" 
                                : "bg-black/60 border-white/10 text-[#ac8884] hover:text-white"
                        }`}
                        title={autoRotate ? "إيقاف الدوران المداري" : "تشغيل الدوران المداري"}
                    >
                        {autoRotate ? <Pause size={15} /> : <Play size={15} />}
                    </button>

                    <button
                        type="button"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`p-2.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                            soundEnabled 
                                ? "bg-amber-500/20 border-amber-500/40 text-amber-300" 
                                : "bg-black/60 border-white/10 text-[#ac8884] hover:text-white"
                        }`}
                        title={soundEnabled ? "كتم الأصوات الكونية" : "تفعيل الأصوات الكونية"}
                    >
                        {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                    </button>

                    <button
                        type="button"
                        onClick={() => handleZoom("in")}
                        className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-[#ac8884] hover:text-white backdrop-blur-md transition-all cursor-pointer"
                        title="تقريب (Zoom In)"
                    >
                        <ZoomIn size={15} />
                    </button>

                    <button
                        type="button"
                        onClick={() => handleZoom("out")}
                        className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-[#ac8884] hover:text-white backdrop-blur-md transition-all cursor-pointer"
                        title="تبعيد (Zoom Out)"
                    >
                        <ZoomOut size={15} />
                    </button>

                    <button
                        type="button"
                        onClick={handleResetCamera}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-[#ac8884] hover:text-white backdrop-blur-md transition-all cursor-pointer text-xs font-cairo font-bold"
                        title="إعادة ضبط زاوية الرؤية"
                    >
                        <RotateCcw size={14} className="text-amber-400" />
                        <span className="hidden sm:inline">إعادة ضبط</span>
                    </button>
                </div>
            </div>

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
            {selectedPlanet && (
                <div className="absolute bottom-16 sm:bottom-20 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-30 p-5 rounded-3xl bg-[#111116]/95 backdrop-blur-xl border border-white/15 text-white shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                                style={{ 
                                    backgroundColor: `${selectedPlanet.color}25`,
                                    border: `1px solid ${selectedPlanet.color}50`
                                }}
                            >
                                <span>{selectedPlanet.badge}</span>
                            </div>
                            <div>
                                <h3 className="font-cairo font-black text-lg text-white leading-tight">
                                    {selectedPlanet.name}
                                </h3>
                                <span className="text-xs font-tajawal text-amber-400 font-bold">
                                    {selectedPlanet.slogan}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => onSelectPlanet("all")}
                            className="text-[#94a3b8] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                            title="إغلاق والعودة للمدار الكلي"
                        >
                            ✕
                        </button>
                    </div>

                    {selectedPlanet.anthemSnippet && (
                        <div className="mt-3.5 p-3 rounded-xl bg-white/[0.04] border border-white/5 text-amber-200 text-xs font-tajawal italic flex items-start gap-2">
                            <span className="text-amber-400 text-base">❝</span>
                            <span>{selectedPlanet.anthemSnippet}</span>
                        </div>
                    )}

                    {selectedPlanet.flagshipWorks && selectedPlanet.flagshipWorks.length > 0 && (
                        <div className="mt-3.5">
                            <span className="text-[11px] font-cairo font-bold text-[#ac8884] block mb-1.5">
                                أبرز روائع الكوكب الخالدة:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {selectedPlanet.flagshipWorks.map(w => (
                                    <span 
                                        key={w} 
                                        className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-tajawal text-white/90"
                                    >
                                        {w}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <a 
                            href="#planet-animes-section" 
                            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-cairo font-bold text-center hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                        >
                            <span>استعراض الأعمال بالأسفل</span>
                            <ChevronDown size={14} />
                        </a>

                        <button
                            type="button"
                            onClick={handleResetCamera}
                            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-cairo text-[#ac8884] hover:text-white border border-white/10 transition-all cursor-pointer"
                        >
                            الكل
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Quick Orbit Carousel Selector */}
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
        </div>
    );
}
