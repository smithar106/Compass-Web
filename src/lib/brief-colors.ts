// Semantic color system for the Executive Decision Brief.
// Mirrors the Glean executive-memo palette: each result/information card
// carries a functional color (green = recommendation, red = problem/risk,
// amber = caution/roadmap, teal = measurement/evidence, violet = choices).

export const BRIEF_COLORS = {
  green: {
    accent: "#1f9d57",
    bg: "#e9f6ee",
    ink: "#14663a",
  },
  blue: {
    accent: "#2563eb",
    bg: "#eff6ff",
    ink: "#1e40af",
  },
  red: {
    accent: "#c14a3c",
    bg: "#faeae7",
    ink: "#8f2f24",
  },
  amber: {
    accent: "#d9932a",
    bg: "#fbf1de",
    ink: "#8f5c11",
  },
  teal: {
    accent: "#0e9db0",
    bg: "#e5f6f8",
    ink: "#0a6a78",
  },
  violet: {
    accent: "#6a5acd",
    bg: "#eeecfb",
    ink: "#463a9e",
  },
  neutral: {
    accent: "#d3ccc0",
    bg: "#f5f4f1",
    ink: "#6c685f",
  },
} as const;

export type BriefTone = keyof typeof BRIEF_COLORS;

export const BRIEF_TONE_STYLES: Record<
  BriefTone,
  { chip: string; card: string; topBorder: string; label: string }
> = {
  green: {
    chip: "bg-[#1f9d57]",
    card: "bg-[#e9f6ee] border-[#a8d6bd]",
    topBorder: "border-t-[#1f9d57]",
    label: "text-[#14663a]",
  },
  blue: {
    chip: "bg-[#2563eb]",
    card: "bg-[#eff6ff] border-[#bdd0f5]",
    topBorder: "border-t-[#2563eb]",
    label: "text-[#1e40af]",
  },
  red: {
    chip: "bg-[#c14a3c]",
    card: "bg-[#faeae7] border-[#e5b7b0]",
    topBorder: "border-t-[#c14a3c]",
    label: "text-[#8f2f24]",
  },
  amber: {
    chip: "bg-[#d9932a]",
    card: "bg-[#fbf1de] border-[#e8cf9c]",
    topBorder: "border-t-[#d9932a]",
    label: "text-[#8f5c11]",
  },
  teal: {
    chip: "bg-[#0e9db0]",
    card: "bg-[#e5f6f8] border-[#a9dce2]",
    topBorder: "border-t-[#0e9db0]",
    label: "text-[#0a6a78]",
  },
  violet: {
    chip: "bg-[#6a5acd]",
    card: "bg-[#eeecfb] border-[#c5bef0]",
    topBorder: "border-t-[#6a5acd]",
    label: "text-[#463a9e]",
  },
  neutral: {
    chip: "bg-[#6c685f]",
    card: "bg-[#f5f4f1] border-[#e6e2db]",
    topBorder: "border-t-[#d3ccc0]",
    label: "text-[#6c685f]",
  },
};

// Section → tone mapping so the browser brief and PDF stay in sync.
export const BRIEF_SECTION_TONES: Record<string, BriefTone> = {
  problem: "red",
  impact: "teal",
  why: "green",
  defensibility: "violet",
  risks: "amber",
  roadmap: "amber",
  alternatives: "violet",
  evidence: "teal",
  measurement: "teal",
  decision: "green",
};
