// Crimson Cinema RTL Design System Tokens (100% matched to stitch_anime_daze_android_app)
// Reference: DESIGN.md & Material3 Crimson Cinema RTL

export const THEME = {
  colors: {
    // Surface & Canvas Hierarchy
    surface: '#0F131C',
    surfaceDim: '#0F131C',
    surfaceBright: '#353942',
    surfaceContainerLowest: '#0A0E16', // OLED Pure Black
    surfaceContainerLow: '#181C24',
    surfaceContainer: '#1C2028',
    surfaceContainerHigh: '#262A33',
    surfaceHigh: '#262A33',
    surfaceLight: '#262A33',
    surfaceContainerHighest: '#31353E',
    surfaceHighest: '#31353E',
    surfaceVariant: '#31353E',
    surfaceGlass: 'rgba(15, 19, 28, 0.85)',
    surfaceCard: '#181C24',
    card: '#1C2028',
    dockBg: 'rgba(11, 15, 23, 0.92)',
    background: '#0F131C',
    backgroundOled: '#0A0E16',

    // Text & Content Hierarchy (On-* Tokens)
    onSurface: '#DFE2EE',
    onSurfaceVariant: '#E6BDB8',
    onBackground: '#DFE2EE',
    inverseSurface: '#DFE2EE',
    inverseOnSurface: '#2C3039',
    text: '#DFE2EE',
    textSecondary: '#E6BDB8',
    textMuted: '#9CA3AF',
    textDim: '#64748B',
    textDark: '#1E293B',

    // Primary Identity - Shohoku High-Tension Crimson Red
    primary: '#FFB4AB',
    onPrimary: '#690005',
    primaryContainer: '#DC2626',
    onPrimaryContainer: '#FFF6F5',
    primaryLight: '#EF4444',
    primaryDark: '#991B1B',
    primaryFixed: '#FFDAD6',
    primaryFixedDim: '#FFB4AB',
    onPrimaryFixed: '#410002',
    onPrimaryFixedVariant: '#93000B',
    inversePrimary: '#BF0715',
    surfaceTint: '#FFB4AB',

    // Secondary Identity - VIP Warm Amber Gold
    secondary: '#FFB95F',
    onSecondary: '#472A00',
    secondaryContainer: '#EE9800',
    onSecondaryContainer: '#5B3800',
    secondaryFixed: '#FFDDB8',
    secondaryFixedDim: '#FFB95F',
    onSecondaryFixed: '#2A1700',
    onSecondaryFixedVariant: '#653E00',
    amber: '#EE9800',
    amberLight: '#FFB95F',
    amberDark: '#D97706',
    gold: '#EE9800',

    // Tertiary - Warm Red Accent
    tertiary: '#FFB3AD',
    onTertiary: '#68000A',
    tertiaryContainer: '#D63135',
    onTertiaryContainer: '#FFF6F5',
    tertiaryFixed: '#FFDAD7',
    tertiaryFixedDim: '#FFB3AD',
    onTertiaryFixed: '#410004',
    onTertiaryFixedVariant: '#930013',

    // Error & Diagnostics
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',

    // Status & Utility Accents
    emerald: '#10B981',
    emeraldGlow: 'rgba(16, 185, 129, 0.25)',
    sky: '#0EA5E9',
    skyGlow: 'rgba(14, 165, 233, 0.25)',

    // Outline & Hairlines
    outline: '#AC8884',
    outlineVariant: '#5C403C',
    border: 'rgba(255, 255, 255, 0.08)',
    borderMedium: 'rgba(255, 255, 255, 0.14)',
    borderLight: 'rgba(255, 255, 255, 0.05)',
    cardBorder: 'rgba(255, 255, 255, 0.07)',
    cardBorderHover: 'rgba(220, 38, 38, 0.45)',
    borderHighlight: 'rgba(255, 255, 255, 0.22)',

    // Absolute Colors & Scrims
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(11, 15, 23, 0.88)',
    scrim: 'rgba(0, 0, 0, 0.78)',
    scrimHeavy: 'rgba(11, 15, 23, 0.95)',
    primaryGlow: 'rgba(220, 38, 38, 0.35)',
    primaryGlowStrong: 'rgba(220, 38, 38, 0.60)',
    amberGlow: 'rgba(238, 152, 0, 0.35)',
  },

  typography: {
    displayHero: {
      fontSize: 36,
      fontWeight: '800' as const,
      lineHeight: 46,
    },
    displayHeroMobile: {
      fontSize: 28,
      fontWeight: '800' as const,
      lineHeight: 38,
    },
    headlineLg: {
      fontSize: 26,
      fontWeight: '700' as const,
      lineHeight: 36,
    },
    headlineMd: {
      fontSize: 20,
      fontWeight: '700' as const,
      lineHeight: 28,
    },
    headlineSm: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 26,
    },
    titleMd: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    bodyLg: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 26,
    },
    bodyMd: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    bodySm: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 18,
    },
    labelLg: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 20,
    },
    labelMd: {
      fontSize: 12,
      fontWeight: '600' as const,
      lineHeight: 16,
    },
    labelSm: {
      fontSize: 10,
      fontWeight: '700' as const,
      lineHeight: 14,
      letterSpacing: 0.5,
    },
  },

  spacing: {
    gutter: 16,
    margin: 20,
    spaceXs: 4,
    spaceSm: 8,
    spaceMd: 16,
    spaceLg: 24,
    spaceXl: 36,
    // Aliases
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 36,
  },

  radius: {
    sm: 4,
    DEFAULT: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
    // Aliases
    xs: 4,
    xxl: 24,
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.55,
      shadowRadius: 12,
      elevation: 6,
    },
    header: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 10,
    },
    glowCrimson: {
      shadowColor: '#DC2626',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 24,
      elevation: 8,
    },
    glowAmber: {
      shadowColor: '#EE9800',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 14,
      elevation: 7,
    },
  },
};
