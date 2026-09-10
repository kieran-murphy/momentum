import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper)",
        surface: "var(--color-surface)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        line: "var(--color-line)",
        work: {
          DEFAULT: "var(--color-work)",
          soft: "var(--color-work-soft)",
        },
        life: {
          DEFAULT: "var(--color-life)",
          soft: "var(--color-life-soft)",
        },
        gold: "var(--color-gold)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      keyframes: {
        "pop-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "strike-fade": {
          "0%": { opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateY(-2px)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fill-width": {
          "0%": { transform: "scaleX(0)", transformOrigin: "left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "left" },
        },
        "card-entrance": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "grid-fade": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.25s ease-out",
        "strike-fade": "strike-fade 0.6s ease-out forwards",
        "slide-up": "slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-out": "fade-out 0.25s ease-in forwards",
        "slide-down": "slide-down 0.25s ease-out",
        "fill-width": "fill-width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "card-entrance": "card-entrance 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "grid-fade": "grid-fade 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
