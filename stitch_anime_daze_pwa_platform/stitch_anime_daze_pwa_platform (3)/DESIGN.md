---
name: Obsidian Crimson Cinematic
colors:
  surface: '#131317'
  surface-dim: '#131317'
  surface-bright: '#39393d'
  surface-container-lowest: '#0e0e12'
  surface-container-low: '#1b1b1f'
  surface-container: '#1f1f23'
  surface-container-high: '#2a292e'
  surface-container-highest: '#353439'
  on-surface: '#e4e1e7'
  on-surface-variant: '#e6bdb8'
  inverse-surface: '#e4e1e7'
  inverse-on-surface: '#303034'
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
  tertiary: '#b9c8de'
  on-tertiary: '#233143'
  tertiary-container: '#647387'
  on-tertiary-container: '#f6f8ff'
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
  tertiary-fixed: '#d4e4fa'
  tertiary-fixed-dim: '#b9c8de'
  on-tertiary-fixed: '#0d1c2d'
  on-tertiary-fixed-variant: '#39485a'
  background: '#131317'
  on-background: '#e4e1e7'
  surface-variant: '#353439'
typography:
  headline-hero:
    fontFamily: Cairo
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
  headline-hero-mobile:
    fontFamily: Cairo
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
  headline-lg:
    fontFamily: Cairo
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Cairo
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Cairo
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
  headline-sm:
    fontFamily: Cairo
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Tajawal
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Tajawal
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Tajawal
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Tajawal
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
  label-sm:
    fontFamily: Tajawal
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2rem
  margin: 1rem
  margin-md: 2rem
  margin-lg: 3.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system crafts an immersive, late-night cinematic theater for anime streaming, engineered specifically for contemporary Arabic and bilingual audiences. It merges the nostalgic energy of golden-era Middle Eastern anime broadcasts with ultra-modern, high-performance streaming ergonomics.

The aesthetic fuses **Cinematic Minimalism** with **Controlled Radiant Glows**:
- **Immersive Theater Atmosphere:** The UI retreats into pitch-dark obsidian space to make Japanese animation cels, vibrant character artwork, and high-definition video feeds pop with uncompromising clarity.
- **Dynamic Energy:** Crimson accents evoke adrenaline, shonen passion, and theatrical drama, counterbalanced by warm amber gold reserved exclusively for prestige badges, star ratings, and VIP indicators.
- **Native RTL-First Heritage:** Engineered from the foundation for seamless bidirectional fluidity, supporting rich Arabic typography alongside Latin titling without typographic breakage or visual misalignment.

## Colors

The palette is tuned strictly for high-contrast viewing under dim lighting conditions:

- **Canvas Background (`#0b0b0f`):** Deep obsidian abyss acting as an absolute dark canvas to maximize OLED contrast and eliminate eye strain during prolonged viewing sessions.
- **Card Base (`#15151c`):** The primary container level for episodic cards, carousel items, and media drawers, separated subtly from the abyss.
- **Elevated Surfaces (`#1f1f29`):** Interactive menus, hover state overlays, modal sheets, and fixed navigation bars.
- **Primary Accent (`#dc2626`):** Pure crimson red for active playhead bars, primary calls to action ("Watch Now", "Subscribe"), live broadcast tags, and critical interactive focus rings.
- **Secondary Accent (`#f59e0b`):** Warm golden amber dedicated solely to community ratings, episode scores, quality indicators (4K / Remastered), and Spacetoon-inspired nostalgia markers.
- **Text Hierarchy:** Crisp brilliant white (`#f8fafc`) for primary titles and active navigation labels; muted slate gray (`#94a3b8`) for episode metadata, studio releases, dubbing director credits, and secondary subtitles.

## Typography

The typographic system utilizes **Cairo** for dramatic, structural headlines and **Tajawal** for fluid, exceptionally readable body text and compact metadata. Both typefaces provide world-class native Arabic glyph sets paired harmoniously with Latin counterparts:

- **Cairo:** Its architectural geometry delivers maximum cinematic impact for anime franchise titles, seasonal releases, and section banners. Generous open counters preserve legibility on dark backdrops even at condensed sizes.
- **Tajawal:** Used for synopsis paragraphs, episode listings, character bios, and timestamps. Tajawal's streamlined modern naskh roots prevent vertical collision in Arabic diacritics and ensure effortless reading across small mobile screens.
- **Bilingual & RTL Logic:** Typography automatically establishes `dir="rtl"` as the root standard. Line heights are calibrated with an extra 10–15% breathing room over standard Latin ratios to avoid Arabic vowel and diacritic clipping.

## Layout & Spacing

The layout is built around high-density media streaming rails and edge-to-edge cinematic billboards:

- **Grid Architecture:** Desktop displays leverage a responsive 12-column fluid grid system with `2rem` gutters and `3.5rem` outer canvas padding. Tablet interfaces adapt to an 8-column layout with `1.5rem` gutters. Mobile phones deploy a 4-column layout utilizing tight horizontal scroll rails with `1rem` margins for edge-peeking card previews.
- **RTL Fluidity:** Grid column flows, thumbnail horizontal rails, and sidebars reverse direction naturally. Left-to-right visual momentum flips to right-to-left: the primary media poster or logo anchors on the right, while action controls and metadata flow to the left.
- **Rhythm & Safe Areas:** PWA shells incorporate explicit safe-area-inset insets along the bottom bar (`space-xl` bottom clearance) to prevent obstruction with device home indicators.

## Elevation & Depth

Visual hierarchy does not rely on harsh structural drop shadows; instead, it utilizes stacked dark surface tiers and subtle chromatic luminescence:

- **Level 0 (Canvas):** Pure `#0b0b0f`. Used for main view background and inactive screen real estate.
- **Level 1 (Card Deck):** `#15151c` with a hairline semi-transparent border (`rgba(255, 255, 255, 0.05)`). Outlines define boundaries without creating visual noise.
- **Level 2 (Active Panels / Navigation Sheets):** `#1f1f29` accompanied by a gentle ambient dark blur (`0 12px 32px -8px rgba(0, 0, 0, 0.7)`).
- **Crimson Backlight (Hover & Focus States):** When a media poster or primary play action receives focus or hover, it emits a subtle directional crimson bloom (`0 8px 24px -4px rgba(220, 38, 38, 0.35)`). This mirrors modern high-end console and TV app interfaces.
- **Video Overlays:** Bilateral linear gradients transition from `rgba(11, 11, 15, 0.95)` at banner bottoms to complete transparency at the center, ensuring white text remains readable over unpredictable anime key art.

## Shapes

The design system enforces a sleek, curved geometry calibrated at **12px (`0.75rem`)**:

- **Anime Posters & Media Cards:** Set strictly to `12px` border radius (`rounded-lg` token behavior in this theme) to create smooth, polished edges that modernize horizontal carousels.
- **Hero Billboard Containers:** Use `16px` curvature on desktop, transitioning to flush edge-to-edge on mobile viewports.
- **Interactive Badges & Chips:** Completely pill-shaped (`9999px`) to visually contrast against rectangular 16:9 and 2:3 anime artwork.
- **Dialogs & Bottom Sheets:** Employ `16px` on top corners for mobile bottom sheets to yield a tactile, app-native feel.

## Components

### Buttons & Play Triggers
- **Primary Action ("شاهد الآن" / "Watch Now"):** Solid `#dc2626` background, crisp white text, bold font weight, `10px` radius. On hover/focus, activates a crimson radiance glow. Includes an optical play icon aligned according to text direction (flipped in RTL).
- **Secondary Action ("أضف إلى قائمتي" / "Add to List"):** Elevated surface `#1f1f29` with a subtle white boundary (`rgba(255, 255, 255, 0.1)`) and slate text `#94a3b8`.
- **Icon Actions:** Circular or `10px` rounded squares with `#15151c` base for audio track switching, subtitle selector, and episode skip controls.

### Badges & Chips
- **Rating Badges:** Pill-shaped, semi-translucent dark background (`rgba(245, 158, 11, 0.15)`), solid `#f59e0b` text and star icon, sized with `label-sm` typography.
- **Dubbing / Resolution Tags (e.g., "مدبلج", "4K"):** Pill-shaped with subtle surface tone `#1f1f29`, `rgba(255, 255, 255, 0.2)` hairline border, crisp white text.
- **Genre Filter Chips:** Unselected state sits at `#15151c` with `#94a3b8` text; active state transitions to `#dc2626` with full white text.

### Media Cards & Episode Items
- **Poster Cards (Vertical 2:3):** `#15151c` background, `12px` rounded corners, overflow hidden. Top corner displays rating badge; bottom displays title overlay with ambient gradient.
- **Horizontal Episode Cards (16:9):** Displays thumbnail with a red progress bar affixed to the bottom border (`2px` height, `#dc2626`). Episode title and duration set in RTL alignment below the preview.
- **Hover/Active Transformation:** Scale transforms to `1.03` with a crimson elevation glow and play glyph overlay on desktop; instant state tap response on PWA touch interfaces.

### Input Fields & Search
- **Search Bar:** Deep `#15151c` field with a subtle `#1f1f29` border. Placeholder text in `#94a3b8`. On focus, shifts border to `#dc2626` with a delicate crimson ring. Search icon rests on the right in RTL mode, with clear button anchored on the left.

### Video Player Controls (Specialized)
- **Scrubber / Timeline:** Background rail in `rgba(255, 255, 255, 0.2)`, buffered progress in `rgba(255, 255, 255, 0.4)`, and active playback head in brilliant `#dc2626` featuring a circular thumb that expands smoothly on drag.
- **Skip Intro / Outro Pill:** Floating frosted glass pill (`background: rgba(31, 31, 41, 0.85); backdrop-filter: blur(12px)`) positioned above timeline controls with white text and crimson hover accent.