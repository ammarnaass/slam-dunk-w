import * as THREE from "three";
import { AdminPlanetItem } from "@/lib/planets-presets";
import { createPlanetTexture, createRingTexture } from "./planet-textures";

/**
 * Generate starry background field with golden accent stars
 */
export function createStarfield(starsCount = 1400): THREE.Points {
    const starsGeo = new THREE.BufferGeometry();
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
        opacity: 0.85,
    });

    return new THREE.Points(starsGeo, starsMat);
}

/**
 * Generate central Spacetoon sun / solar core with atmospheric corona and light
 */
export function createSolarCore(): {
    coreMesh: THREE.Mesh;
    coronaMesh: THREE.Mesh;
    centerPointLight: THREE.PointLight;
} {
    const coreGeo = new THREE.SphereGeometry(3.2, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffa500,
        transparent: true,
        opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);

    const coronaGeo = new THREE.SphereGeometry(4.2, 32, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.25,
        side: THREE.BackSide,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);

    const centerPointLight = new THREE.PointLight(0xffecd2, 2.5, 300);
    centerPointLight.position.set(0, 5, 0);

    return { coreMesh, coronaMesh, centerPointLight };
}

/**
 * Generate planet spheres, elliptical orbits, and planetary rings
 */
export function setupOrbitPlanets(
    scene: THREE.Scene,
    activePlanets: AdminPlanetItem[],
    planetMeshesMap: Map<string, THREE.Mesh>,
    ringMeshesMap: Map<string, THREE.Mesh>
) {
    planetMeshesMap.clear();
    ringMeshesMap.clear();

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
            points.map((p) => new THREE.Vector3(p.x, 0, p.y))
        );
        const orbitMat = new THREE.LineBasicMaterial({
            color: new THREE.Color(planet.color || "#ffffff"),
            transparent: true,
            opacity: 0.18,
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
            metalness: 0.15,
        });

        const planetMesh = new THREE.Mesh(planetGeo, planetMat);
        planetMesh.userData = {
            id: planet.id,
            planet,
            rx,
            rz,
            angle: initialAngle,
            speed: (0.003 / (index * 0.15 + 1)) * (planet.threeDConfig?.rotationSpeed || 1.0),
        };

        const px = Math.cos(initialAngle) * rx;
        const pz = Math.sin(initialAngle) * rz;
        planetMesh.position.set(px, 0, pz);
        scene.add(planetMesh);
        planetMeshesMap.set(planet.id, planetMesh);

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
                opacity: 0.75,
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.rotation.x =
                Math.PI / 2 + ((planet.threeDConfig.ringTilt || 25) * Math.PI) / 180;
            ringMesh.position.copy(planetMesh.position);
            scene.add(ringMesh);
            ringMeshesMap.set(planet.id, ringMesh);
        }
    });
}
