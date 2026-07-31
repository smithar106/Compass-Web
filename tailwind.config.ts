import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Existing brand tokens (preserved for product/assessment surfaces)
        cream: "#FAFAF8",
        ink: "#0E1722",
        forest: "#2D6A4F",
        leaf: "#40916C",
        mist: "#E8F0EC",
        stone: "#5A6373",
        border: "#E5E7EB",
        brand: {
          green: "#19a43a",
          "green-dark": "#11802c",
          "green-light": "#e8f8eb",
          blue: "#156ff5",
          "blue-light": "#eaf2ff",
          purple: "#762ee8",
          "purple-light": "#f0e8ff",
          orange: "#f26b00",
          "orange-light": "#fff0e4",
        },
        gold: { DEFAULT: "#bb7a00", light: "#fff6d8" },
        silver: { DEFAULT: "#64748b", light: "#f0f3f6" },
        bronze: { DEFAULT: "#a84b12", light: "#fff0e6" },
        risk: { DEFAULT: "#ef2b2d", light: "#fff8f8" },
        lime: {
          50: '#F7FEE7', 100: '#ECFCCB', 200: '#D9F99D',
          300: '#BEF264', 400: '#A3E635', 500: '#84CC16',
          600: '#65A30D', 700: '#4D7C0F', 800: '#3F6212', 900: '#365314',
        },
        // New marketing design system
        paper: "#F5F3EE",
        surface: "#FFFFFF",
        ink2: "#1D2634",
        muted: "#5A6373",
        faint: "#616B7A",
        line: "#E3E0D7",
        lineDark: "#2B3342",
        accent: "#C7F246",
        "accent-deep": "#4C650C",
        "accent-soft": "#EFF8CC",
        "accent-ink": "#162000",
        "paper-dark": "#0D1219",
        "ok": "#1E7B4C",
        "ok-soft": "#E5F3EA",
        warn: "#B45309",
        "warn-soft": "#FBF0E0",
        "risk-soft": "#FAE9E7",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
      },
      fontSize: {
        display: ["clamp(2.5rem, 5vw, 4.25rem)", { lineHeight: "1.04", letterSpacing: "-0.035em" }],
        hero: ["clamp(2.25rem, 4.2vw, 3.5rem)", { lineHeight: "1.06", letterSpacing: "-0.03em" }],
        title: ["clamp(1.9rem, 3.2vw, 2.75rem)", { lineHeight: "1.12", letterSpacing: "-0.025em" }],
        section: ["clamp(1.6rem, 2.6vw, 2.25rem)", { lineHeight: "1.18", letterSpacing: "-0.02em" }],
        heading: ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        subhead: ["1.5rem", { lineHeight: "1.3" }],
        lead: ["1.125rem", { lineHeight: "1.6" }],
        body: ["1rem", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        micro: ["0.75rem", { lineHeight: "1.45" }],
      },
      spacing: {
        section: "6.5rem",
        "section-sm": "4.5rem",
      },
      borderRadius: {
        sm2: "3px",
      },
      boxShadow: {
        panel: "0 1px 2px rgba(14,23,34,0.05), 0 8px 24px -12px rgba(14,23,34,0.12)",
        "panel-lg": "0 2px 4px rgba(14,23,34,0.05), 0 24px 48px -24px rgba(14,23,34,0.18)",
        "card-sm": "0 1px 1px rgba(14,23,34,0.04)",
      },
      letterSpacing: {
        eyebrow: "0.14em",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "grow-x": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        "rise-bar": {
          from: { transform: "scaleY(0)" },
          to: { transform: "scaleY(1)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        "draw-line": {
          from: { strokeDashoffset: "1" },
          to: { strokeDashoffset: "0" },
        },
        "tick": {
          from: { transform: "translateY(6px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.5s ease-out both",
        "grow-x": "grow-x 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "rise-bar": "rise-bar 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "tick": "tick 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
