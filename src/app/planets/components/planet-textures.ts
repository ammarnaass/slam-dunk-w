import * as THREE from "three";

/**
 * Procedural canvas texture generator for Spacetoon 3D Planets.
 * Generates rich, high-resolution textures without external image dependencies.
 */
export function createPlanetTexture(
    type: string,
    primaryColor: string,
    glowColor: string
): THREE.CanvasTexture {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return new THREE.CanvasTexture(canvas);
    }

    // Base background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, size, size);
    bgGrad.addColorStop(0, primaryColor);
    bgGrad.addColorStop(1, shadeColor(primaryColor, -40));
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // Planet-specific procedural detailing
    switch (type) {
        case "sports":
            drawSportsPattern(ctx, size, primaryColor);
            break;
        case "action":
            drawActionPattern(ctx, size);
            break;
        case "adventure":
            drawAdventurePattern(ctx, size);
            break;
        case "comedy":
            drawComedyPattern(ctx, size);
            break;
        case "emerald":
            drawEmeraldPattern(ctx, size);
            break;
        case "mystery":
            drawMysteryPattern(ctx, size);
            break;
        case "scifi":
            drawSciFiPattern(ctx, size);
            break;
        case "classics":
            drawClassicsPattern(ctx, size);
            break;
        case "movies":
            drawMoviesPattern(ctx, size);
            break;
        case "bonbon":
            drawBonbonPattern(ctx, size);
            break;
        default:
            drawGenericCosmicPattern(ctx, size, primaryColor);
            break;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}

/** Helper to darken/lighten hex colors */
function shadeColor(color: string, percent: number): string {
    let num = parseInt(color.replace("#", ""), 16);
    if (isNaN(num)) return color;
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let G = ((num >> 8) & 0x00ff) + amt;
    let B = (num & 0x0000ff) + amt;
    return `#${(
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
        .toString(16)
        .slice(1)}`;
}

function drawSportsPattern(ctx: CanvasRenderingContext2D, size: number, color: string) {
    // Dynamic sports sphere texture with court curved arcs and basketball seams
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 6;
    for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(size / 2, (i * size) / 5, size * 0.4, 0, Math.PI * 2);
        ctx.stroke();
    }
    // High-energy golden bands
    ctx.strokeStyle = "rgba(255, 200, 50, 0.6)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.5);
    ctx.bezierCurveTo(size * 0.3, size * 0.2, size * 0.7, size * 0.8, size, size * 0.5);
    ctx.stroke();
}

function drawActionPattern(ctx: CanvasRenderingContext2D, size: number) {
    // Molten magma tectonic fissures and energy plasma flares
    ctx.fillStyle = "rgba(255, 60, 0, 0.5)";
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = Math.random() * 45 + 15;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    // Lightning plasma cracks
    ctx.strokeStyle = "rgba(255, 230, 100, 0.8)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);
    for (let i = 0; i < 8; i++) {
        ctx.lineTo((i * size) / 7, size * 0.3 + (Math.random() - 0.5) * 80);
    }
    ctx.stroke();
}

function drawAdventurePattern(ctx: CanvasRenderingContext2D, size: number) {
    // Golden parchment continents and latitude cartography lines
    ctx.strokeStyle = "rgba(255, 215, 0, 0.4)";
    ctx.lineWidth = 3;
    for (let y = 50; y < size; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
    }
    // Cloud swirls
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.ellipse(Math.random() * size, Math.random() * size, 60, 25, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawComedyPattern(ctx: CanvasRenderingContext2D, size: number) {
    // Cheerful bubbly swirls and bright emerald waves
    ctx.fillStyle = "rgba(52, 211, 153, 0.4)";
    for (let i = 0; i < 25; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 30 + 10, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawEmeraldPattern(ctx: CanvasRenderingContext2D, size: number) {
    // Crystalline gemstone facets and stardust glints
    ctx.strokeStyle = "rgba(255, 192, 203, 0.5)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 70, 0);
        ctx.lineTo((i * 70) + 120, size);
        ctx.stroke();
    }
    // Sparkle diamond stars
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    for (let i = 0; i < 30; i++) {
        ctx.fillRect(Math.random() * size, Math.random() * size, 4, 4);
    }
}

function drawMysteryPattern(ctx: CanvasRenderingContext2D, size: number) {
    // Enigmatic dark cyan nebulae with mysterious subtle rings
    ctx.fillStyle = "rgba(14, 116, 144, 0.5)";
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 80 + 30, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawSciFiPattern(ctx: CanvasRenderingContext2D, size: number) {
    // Cybernetic circuit grids and glowing data matrices
    ctx.strokeStyle = "rgba(45, 212, 191, 0.6)";
    ctx.lineWidth = 2;
    for (let i = 0; i < size; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
    }
}

function drawClassicsPattern(ctx: CanvasRenderingContext2D, size: number) {
    // Antique bronze celestial rings and sepia marbling
    ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
    ctx.lineWidth = 5;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, i * 45 + 30, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function drawMoviesPattern(ctx: CanvasRenderingContext2D, size: number) {
    // Velvet purple with starry movie reel stripes
    ctx.fillStyle = "rgba(192, 132, 252, 0.4)";
    ctx.fillRect(0, size * 0.4, size, 40);
    ctx.fillRect(0, size * 0.6, size, 40);
}

function drawBonbonPattern(ctx: CanvasRenderingContext2D, size: number) {
    // Rainbow pastel candy bands
    const colors = ["#fda4af", "#f0abfc", "#a7f3d0", "#fde047"];
    colors.forEach((c, idx) => {
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.4;
        ctx.fillRect(0, idx * (size / 4), size, size / 4);
    });
    ctx.globalAlpha = 1.0;
}

function drawGenericCosmicPattern(ctx: CanvasRenderingContext2D, size: number, color: string) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 50 + 10, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * Procedural ring texture with transparent concentric celestial bands
 */
export function createRingTexture(ringColor: string): THREE.CanvasTexture {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");

    if (!ctx) return new THREE.CanvasTexture(canvas);

    const grad = ctx.createLinearGradient(0, 0, size, 0);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(0.2, ringColor);
    grad.addColorStop(0.5, "rgba(255,255,255,0.8)");
    grad.addColorStop(0.8, ringColor);
    grad.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, 1);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

/**
 * Synthesizes a delicate retro cosmic chime using Web Audio API
 */
export function playCosmicChime(frequency: number = 520) {
    try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    } catch (_) {}
}
