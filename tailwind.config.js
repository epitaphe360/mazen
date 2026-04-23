/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
  content: ["./client/index.html", "./client/src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Sovereign Navy — primary
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
        // Legacy aliases (do not break existing pages)
        brand: {
          50: "#f0f4fb", 100: "#dde6f4", 200: "#b6c8e6", 300: "#85a3d3",
          400: "#5079bb", 500: "#2f599f", 600: "#1f4084", 700: "#173068",
          800: "#102449", 900: "#0a1832", 950: "#040b1d",
        },
        govblue: {
          DEFAULT: "#173068",
          light: "#2f599f",
          dark: "#0a1832",
        },
        govgold: {
          DEFAULT: "#bd8632",
          light: "#dcbc6c",
          dark: "#7a5024",
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
        display: ['"Inter Display"', '"Inter Variable"', "Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 7vw + 1rem, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.04em", fontWeight: "800" }],
        "display-lg": ["clamp(2.5rem, 5vw + 1rem, 5rem)", { lineHeight: "1", letterSpacing: "-0.035em", fontWeight: "800" }],
        "display-md": ["clamp(2rem, 3.5vw + 0.5rem, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
      },
      letterSpacing: {
        tightest: "-0.04em",
        widest: "0.22em",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "elev-sm": "0 1px 2px rgba(10, 24, 50, 0.04), 0 1px 3px rgba(10, 24, 50, 0.06)",
        "elev-md": "0 4px 6px -1px rgba(10, 24, 50, 0.08), 0 2px 4px -2px rgba(10, 24, 50, 0.06)",
        "elev-lg": "0 10px 25px -5px rgba(10, 24, 50, 0.10), 0 8px 10px -6px rgba(10, 24, 50, 0.08)",
        "elev-xl": "0 20px 40px -10px rgba(10, 24, 50, 0.18), 0 12px 18px -8px rgba(10, 24, 50, 0.10)",
        glow: "0 0 0 1px rgba(189, 134, 50, 0.30), 0 8px 32px rgba(189, 134, 50, 0.18)",
        ring: "0 0 0 4px rgba(47, 89, 159, 0.18)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "shimmer": "shimmer 2s infinite linear",
        "aurora": "aurora 18s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        aurora: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(220, 188, 108, 0.45)" },
          "50%": { boxShadow: "0 0 0 16px rgba(220, 188, 108, 0)" },
        },
      },
      backgroundImage: {
        "mesh-sovereign":
          "radial-gradient(at 20% 20%, rgba(23,48,104,0.30) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(189,134,50,0.18) 0px, transparent 50%), radial-gradient(at 0% 80%, rgba(47,89,159,0.30) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(220,188,108,0.18) 0px, transparent 50%)",
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [typography],
};
