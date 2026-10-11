---
name: Crimson Cinema RTL
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#e6bdb8'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#ac8884'
  outline-variant: '#5c403c'
  surface-tint: '#ffb4ab'
  primary: '#ffb4ab'
  on-primary: '#690005'
  primary-container: '#dc2626'
  on-primary-container: '#fff6f5'
  inverse-primary: '#bf0715'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#ffb3ad'
  on-tertiary: '#68000a'
  tertiary-container: '#d63135'
  on-tertiary-container: '#fff6f5'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000b'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  display-hero:
    fontFamily: IBM Plex Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 46px
  display-hero-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 38px
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system delivers an intense, immersive cinematic experience tailored for anime streaming and otaku fandom on modern Android platforms, operating strictly with a native right-to-left (RTL) posture. Rooted in the high-octane energy of classic sports anime aesthetics paired with the polished restraint of premium streaming suites, the UI commands presence through stark contrasts, incandescent crimson highlights, and deep nocturnal void tones.

### Aesthetic Persona & Tone
- **Atmospheric & Immersive:** Dark canvas dominance that lets high-saturation anime artwork and video stills lead visual weight.
- **Dynamic Passion:** Punchy, decisive vermilion and crimson accents engineered to mirror shōnen adrenaline, tension, and victory moments.
- **Prestige Curation:** Subtle ambient crimson-to-amber lighting, restrained frosted overlays, and disciplined stroke dividers that avoid visual noise.

### Design Movement Synthesis
The style fuses **Cinematic Dark Minimalism** with **Controlled Glow Glassmorphism**:
- Ultra-deep, desaturated obsidian layers (#080C13 through #1E2638) form the baseline structure.
- Semi-translucent cards (12% to 18% surface opacity) blur backdrop scenes with an 8px–16px Gaussian dispersion.
- Luminous crimson edge highlights (1px inset borders with low alpha) evoke high-contrast neon courts and tournament spotlights.

## Colors

The palette leverages a dark hierarchy built specifically to elevate colored illustrations and provide zero-strain viewing in dark rooms, while directing attention via fiery functional markers.

### Palette Architecture
- **Primary Surface Base (`#0B0F17`):** The master canvas tone. Cold, cinematic pitch black with blue undertones that makes poster art pop.
- **Secondary Surface Containers (`#111827`, `#1F2937`):** Step-up surfaces for drawers, app bars, bottom sheets, and elevated card structures.
- **Primary (`#DC2626` & `#EF4444`):** High-tension crimson red. Used strictly for prime actions (Watch Now, Episode Play, Active Tab indicators, Recording status, and Progress fill bars).
- **Secondary (`#F59E0B`):** Warm amber gold. Exclusively reserved for VIP badging, high scores, bookmark active states, and user tier accolades.
- **Text & Glyph Layers:**
  - **High-Emphasis Primary:** `#F9FAFB` (98% white) for headlines and critical episode titles.
  - **Medium-Emphasis Secondary:** `#9CA3AF` (60% gray-blue) for metadata, release seasons, studios, and audio specs.
  - **Muted / Inactive:** `#4B5563` for disabled states, trailing iconography, and subtle partition lines.

## Typography

The typographic hierarchy is powered by **IBM Plex Sans** (leveraging its robust, engineered Arabic companion set). The letterforms offer industrial discipline, sharp termination, and pristine legibility across small viewport densities.

### Typography Guidelines for RTL
- **Line Heights:** Arabic glyph ascenders and descenders require 1.35x to 1.5x leading to eliminate diacritic overlapping in dense lists and synopsis paragraphs.
- **Weight Pairing:**
  - Hero displays and category headers employ **Bold (700)** and **ExtraBold (800)** to echo theatrical shōnen boldness.
  - Metadata, ratings, and running times use **SemiBold (600)** for micro-punchiness without blur.
  - Synopses and episode reviews utilize **Regular (400)** with increased tracking for long-form comfort.
- **Directional Alignment:** All text elements align natively to the right (`text-align: right`) by default, with numerical scores (e.g., `8.9/10`) and duration markers formatted consistently using unified RTL layout conventions.

## Elevation & Depth

Depth is established through dark luminous gradation, edge refraction, and diffuse crimson focal blooms instead of generic gray drop shadows.

### Elevation Hierarchy
- **Level 0 (Background Canvas):** Solid `#0B0F17`.
- **Level 1 (Cards, Feed Tiles, Inactive Chips):** Solid `#111827` or translucent `rgba(17, 24, 39, 0.75)` with a 12px backdrop blur. Borders: `1px solid rgba(255, 255, 255, 0.06)`.
- **Level 2 (Active Cards, Modals, Bottom Sheets):** `#1F2937` surface. Ambient drop shadow: `0 12px 32px rgba(0, 0, 0, 0.65)`.
- **Level 3 (Hero Focus, Play Triggers & VIP Highlights):**
  - **Crimson Energy Glow:** For active primary media elements: `0 8px 24px -4px rgba(220, 38, 38, 0.45)`.
  - **VIP Amber Glow:** For premium and top-rank indicators: `0 4px 16px -2px rgba(245, 158, 11, 0.40)`.
- **Border Treatment:** High-tech hairline strokes (`1px`) running top-to-bottom gradients from `rgba(239, 68, 68, 0.35)` to transparent on high-focus cards.

## Shapes

The interface embraces a unified, sleek curvature (`rounded-2xl` baseline) that softens dark, aggressive contrasts without looking toy-like or childish.

### Radius Matrix
- **Cards & Media Postcards:** `1rem` (16px) radius, preventing harsh clipping of poster art while retaining modern device cohesion.
- **Buttons, Bottom Sheets & Popups:** `1rem` (16px) for bottom sheet top corners; `0.75rem` (12px) to `1rem` (16px) for action buttons.
- **Pills, Badges & Chips:** Completely pill-shaped (`9999px`) for quick categorization, episode numbers, status tags (e.g., "مستمر", "مكتمل"), and VIP stamps.

## Components

### Buttons
- **Primary (Watch Now / Action):** Solid crimson background (`#DC2626`), high-contrast white text (`#FFFFFF`), bold typography, height 48px, rounded 16px. Active tap triggers scale compression (0.97x) and increases red glow (`rgba(239, 68, 68, 0.6)`).
- **Secondary / Ghost:** Semi-transparent base `rgba(31, 41, 55, 0.6)` with a `1px` subtle outline (`rgba(255, 255, 255, 0.1)`). Icon placed to the right of text for Arabic reading orientation.
- **VIP Special Action:** Gold gradient fill (`linear-gradient(135deg, #F59E0B, #D97706)`) with deep charcoal text (`#0B0F17`) and high-weight font.

### Cards (Anime Poster & Episode Tiles)
- **Vertical Poster Card:** 2:3 aspect ratio, 16px border-radius, top-to-bottom dark gradient overlay from middle to bottom to ensure white titles are legible. Bottom-right: Episode badge. Bottom-left: Star rating with amber icon.
- **Horizontal Episode Card:** 16:9 thumbnail on the right, episode metadata and Arabic synopsis on the left. Integrated micro-progress bar at the base of the thumbnail using `#DC2626` over `#374151`.

### Chips & Filter Pills
- **Inactive:** `#1F2937` with `rgba(255, 255, 255, 0.1)` border; text `#9CA3AF`.
- **Selected:** Border and glow in `#DC2626` with red background fill at 20% opacity (`rgba(220, 38, 38, 0.2)`); text `#F9FAFB`.

### Badges & Metadata Tags
- **VIP / Premium:** Background `rgba(245, 158, 11, 0.15)`, text `#F59E0B`, border `1px solid rgba(245, 158, 11, 0.4)`.
- **Age Rating / Resolution (4K, FHD):** Background `rgba(17, 24, 39, 0.8)`, text `#9CA3AF`, border `1px solid rgba(255, 255, 255, 0.08)`.

### Inputs & Search Bars
- Background `#111827`, inset border `1px solid #1F2937`. Search glyph anchored to the right edge; mic / voice search icon anchored to the left edge. Focus state transitions border to `#DC2626` with subtle red ambient diffusion.

### Bottom Navigation Bar
- Frosted black surface `rgba(11, 15, 23, 0.88)` with backdrop-filter blur (20px).
- Active item uses glowing crimson icon with top or bottom micro-accent dash; inactive items use muted steel grey (`#6B7280`).