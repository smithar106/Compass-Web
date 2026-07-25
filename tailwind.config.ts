import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAFAF8",
        ink: "#1A1A1A",
        forest: "#2D6A4F",
        leaf: "#40916C",
        mist: "#E8F0EC",
        stone: "#6B7280",
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
        gold: {
          DEFAULT: "#bb7a00",
          light: "#fff6d8",
        },
        silver: {
          DEFAULT: "#64748b",
          light: "#f0f3f6",
        },
        bronze: {
          DEFAULT: "#a84b12",
          light: "#fff0e6",
        },
        risk: {
          DEFAULT: "#ef2b2d",
          light: "#fff8f8",
        },
        lime: {
          50: '#F7FEE7', 100: '#ECFCCB', 200: '#D9F99D',
          300: '#BEF264', 400: '#A3E635', 500: '#84CC16',
          600: '#65A30D', 700: '#4D7C0F', 800: '#3F6212', 900: '#365314',
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        heading: ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        subhead: ["1.5rem", { lineHeight: "1.3" }],
        body: ["1rem", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
      },
      spacing: {
        section: "3.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
