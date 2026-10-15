"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { AdminPlanetItem } from "@/lib/planets-presets";
import { playCosmicChime } from "./planet-textures";
import { createStarfield, createSolarCore, setupOrbitPlanets } from "./three-orbit-helpers";

interface UseThreeOrbitEngineProps {
    mountRef: React.RefObject<HTMLDivElement | null>;
    activePlanets: AdminPlanetItem[];
    selectedPlanetId: string;
    selectedPlanet: AdminPlanetItem | null;
    autoRotate: boolean;
    soundEnabled: boolean;
    onSelectPlanet: (id: string) => void;
    setHoveredPlanet: (planet: AdminPlanetItem | null) => void;
    setTooltipPos: (pos: { x: number; y: number } | null) => void;
    hoveredPlanetId?: string | null;
}

export function useThreeOrbitEngine({
    mountRef,
    activePlanets,
    selectedPlanetId,
    selectedPlanet,
    autoRotate,
    soundEnabled,
    onSelectPlanet,
    setHoveredPlanet,
    setTooltipPos,
    hoveredPlanetId
}: UseThreeOrbitEngineProps) {
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const planetMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
    const ringMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
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
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // 4. Starfield Background
        const starField = createStarfield(1400);
        scene.add(starField);

        // 5. Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
        scene.add(ambientLight);

        // 6. Central Celestial Sun / Spacetoon Core
        const { coreMesh, coronaMesh, centerPointLight } = createSolarCore();
        scene.add(centerPointLight);
        scene.add(coreMesh);
        scene.add(coronaMesh);

        // 7. Generate Planets along Elliptical Orbits
        setupOrbitPlanets(scene, activePlanets, planetMeshesRef.current, ringMeshesRef.current);

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
        const clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            clock.getDelta();

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
                const targetScale = isSelected ? 1.35 : hoveredPlanetId === id ? 1.2 : 1.0;
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
    }, [activePlanets, autoRotate, soundEnabled, selectedPlanetId, onSelectPlanet, hoveredPlanetId, mountRef, selectedPlanet, setHoveredPlanet, setTooltipPos]);

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

    return {
        handleResetCamera,
        handleZoom
    };
}
