/**
 * Velocity Fit Design Tokens
 * Programmatic programmatic export for canvas, charts, dynamic styles, and tests.
 */
export const DESIGN_TOKENS = {
  colors: {
    surfaceDark: "#121316",
    surfaceElevated: "#1a1d23",
    surfaceLight: "#fbfbfa",
    surfaceWarm: "#f4f1ea",
    surfaceSubtle: "#eae6dc",
    accentGold: "#c5a059",
    accentGoldLight: "#dfbf7d",
    accentGoldHover: "#b38e47",
    accentGoldMuted: "#8e7238",
    textPrimaryDark: "#111317",
    textSecondaryDark: "#4b5260",
    textPrimaryLight: "#f9fafb",
    textSecondaryLight: "#a3a8b5",
    success: "#2d7a4f",
    error: "#c53b3b",
  },
  typography: {
    fontSans: "Inter, sans-serif",
    fontHeading: "Plus Jakarta Sans, sans-serif",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;
