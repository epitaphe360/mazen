/**
 * Sovereign Design System — Tokens
 * Centralised palette, spacing, motion. Single source of truth.
 */

export const colors = {
  // Sovereign Navy — primary brand
  navy: {
    50: "#f0f4fb",
    100: "#dde6f4",
    200: "#b6c8e6",
    300: "#85a3d3",
    400: "#5079bb",
    500: "#2f599f",
    600: "#1f4084",
    700: "#173068",
    800: "#102449",
    900: "#0a1832",
    950: "#040b1d",
  },
  // Imperial Gold — accent
  gold: {
    50: "#fbf8ee",
    100: "#f5edd0",
    200: "#ead8a1",
    300: "#dcbc6c",
    400: "#cda046",
    500: "#bd8632",
    600: "#9c6928",
    700: "#7a5024",
    800: "#5b3c1f",
    900: "#3d2814",
    950: "#21150a",
  },
  // Signal — semantic, brand-aligned
  signal: {
    success: "#16a34a",
    warning: "#d97706",
    danger: "#dc2626",
    info: "#0284c7",
  },
  // Surface neutrals
  ink: {
    primary: "#0a1832",
    secondary: "#384a6b",
    tertiary: "#7a8aa6",
    inverse: "#ffffff",
  },
} as const;

export const elevation = {
  flat: "none",
  sm: "0 1px 2px rgba(10, 24, 50, 0.04), 0 1px 3px rgba(10, 24, 50, 0.06)",
  md: "0 4px 6px -1px rgba(10, 24, 50, 0.08), 0 2px 4px -2px rgba(10, 24, 50, 0.06)",
  lg: "0 10px 25px -5px rgba(10, 24, 50, 0.10), 0 8px 10px -6px rgba(10, 24, 50, 0.08)",
  xl: "0 20px 40px -10px rgba(10, 24, 50, 0.18), 0 12px 18px -8px rgba(10, 24, 50, 0.10)",
  glow: "0 0 0 1px rgba(189, 134, 50, 0.30), 0 8px 32px rgba(189, 134, 50, 0.18)",
  ring: "0 0 0 4px rgba(47, 89, 159, 0.18)",
} as const;

export const radii = {
  none: "0",
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
  "2xl": "28px",
  full: "9999px",
} as const;

export const motion = {
  // Easings
  ease: {
    out: [0.16, 1, 0.3, 1] as const, // expo-out
    inOut: [0.83, 0, 0.17, 1] as const, // sine-inOut
    spring: [0.34, 1.56, 0.64, 1] as const, // back-out
  },
  // Durations (ms)
  duration: {
    instant: 100,
    fast: 200,
    base: 320,
    slow: 520,
    cinematic: 900,
  },
} as const;

export const typography = {
  // Modular scale 1.25 (major third)
  size: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    display: 800,
  },
  tracking: {
    tightest: "-0.04em",
    tight: "-0.02em",
    normal: "0",
    wide: "0.04em",
    wider: "0.12em",
    widest: "0.22em",
  },
} as const;
