"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ExampleRecommendation {
  id: string;
  problem: string;
  intervention: string;
  category: string;
  ranking?: string;
  confidence: { label: string; score: number };
  evidence: { tier: string; comparables: number; validated: number; sources: string[] };
  effort: string;
  impact: { headline: string; range: string; basis: string };
  roi: { range: string; payback: string };
  partner: string;
  learning: string;
  alternatives: { name: string; verdict: string; reason: string }[];
}

const TIER_STYLE: Record<string, string> = {
  Gold: "bg-accent text-accent-ink",
  Silver: "bg-line text-ink",
  Bronze: "bg-line text-muted",
};

const VERDICT_STYLE: Record<string, string> = {
  Rejected: "bg-ink text-paper",
  "Viable alternative": "bg-ok text-white",
  Deferred: "bg-warn text-white",
};

function DetailLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-faint">{children}</p>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "whitespace-nowrap border-b-2 px-3 py-2.5 text-[12.5px] font-medium transition-colors",
        active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}

const TABS = ["Evidence", "Confidence", "Implementation", "Learning"];

export function RecommendationDetail({ example }: { example: ExampleRecommendation }) {
  const [tab, setTab] = useState("Evidence");
  const e = example;

  return (
    <div className="overflow-hidden border border-line bg-surface">
      {/* header: problem + at-a-glance facts */}
      <div className="border-b border-line bg-paper/60 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-eyebrow text-faint">
            {e.category} intervention
          </span>
          <span className="border border-line bg-paper px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-faint">
            Illustrative
          </span>
        </div>
        <h3 className="mt-1.5 text-[18px] font-semibold tracking-tight text-ink">{e.problem}</h3>
        <p className="mt-0.5 text-[14px] text-muted">{e.intervention}</p>

        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-4 sm:grid-cols-3 lg:grid-cols-4">
          <MetaItem label="Confidence" value={`${e.confidence.label} · ${Math.round(e.confidence.score * 100)}%`} />
          <MetaItem label="Evidence strength" value={`${e.evidence.tier} · ${e.evidence.comparables} comparable`} />
          <MetaItem label="Implementation effort" value={e.effort} />
          <MetaItem label="Expected impact" value={e.impact.range} />
          <MetaItem label="Implementation partner" value={e.partner} />
          <MetaItem label="Learning schedule" value={e.learning} />
          <MetaItem label="Expected ROI" value={`${e.roi.range} · payback ${e.roi.payback}`} />
        </dl>
      </div>

      {/* tabs */}
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line px-2">
        {TABS.map((t) => (
          <Tab key={t} active={tab === t} onClick={() => setTab(t)}>
            {t}
          </Tab>
        ))}
      </div>

      <div className="p-5 sm:p-6">
        <div key={tab} className="animate-fade-in">
          {tab === "Evidence" && <EvidencePanel e={e} />}
          {tab === "Confidence" && <ConfidencePanel e={e} />}
          {tab === "Implementation" && <ImplementationPanel e={e} />}
          {tab === "Learning" && <LearningPlan learning={e.learning} />}
        </div>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-faint">{label}</dt>
      <dd className="mt-0.5 text-[12.5px] font-medium text-ink">{value}</dd>
    </div>
  );
}

function EvidencePanel({ e }: { e: ExampleRecommendation }) {
  return (
    <div>
      <div className="grid grid-cols-3 divide-x divide-line border-b border-line pb-4">
        <Stat value={String(e.evidence.comparables)} label="comparable implementations" />
        <Stat value={String(e.evidence.validated)} label="independently validated outcomes" />
        <Stat value={e.evidence.tier} label="evidence tier" />
      </div>
      <div className="mt-4">
        <DetailLabel>Source types behind this recommendation</DetailLabel>
        <div className="mt-2 flex flex-wrap gap-2">
          {e.evidence.sources.map((s) => (
            <span key={s} className="border border-line bg-paper px-2.5 py-1.5 text-[11.5px] font-medium text-ink">
              {s}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
          Every material claim in this recommendation traces back to a cited source. When the
          evidence is insufficient, Compass defers judgment instead of inventing an answer.
        </p>
      </div>
    </div>
  );
}

function ConfidencePanel({ e }: { e: ExampleRecommendation }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <DetailLabel>Recommendation confidence</DetailLabel>
        <ConfidenceBadge label={e.confidence.label} score={e.confidence.score} />
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-accent-deep"
          style={{ width: `${Math.round(e.confidence.score * 100)}%`, transition: "width 0.9s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-faint">
        <span>score</span>
        <span>{e.confidence.score.toFixed(2)}</span>
      </div>

      <div className="mt-5 space-y-4">
        <ConfidenceDriver label="Evidence fit" value={Math.max(0.2, e.confidence.score - 0.05)} note="How closely comparable implementations match your operating context." />
        <ConfidenceDriver label="Organizational readiness" value={Math.max(0.2, e.confidence.score - 0.12)} note="Data, process stability, and owner availability." />
        <ConfidenceDriver label="Execution risk" value={Math.max(0.15, 1 - e.confidence.score + 0.08)} note="Controllable risk after the recommendation is matched to a path." />
      </div>

      <div className="mt-6 border-t border-line pt-5">
        <DetailLabel>Alternatives and why they lost</DetailLabel>
        <ul className="mt-3 divide-y divide-line/70">
          {e.alternatives.map((alt) => (
            <li key={alt.name} className="flex items-start gap-3 py-3 first:pt-0">
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  alt.verdict === "Rejected" ? "bg-ink text-paper" : "bg-ok text-white"
                )}
                aria-hidden="true"
              >
                {alt.verdict === "Rejected" ? "×" : "✓"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-x-3">
                  <span className="text-[13.5px] font-medium text-ink">{alt.name}</span>
                  <span className={cn("px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide", VERDICT_STYLE[alt.verdict] ?? "bg-line text-muted")}>
                    {alt.verdict}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">{alt.reason}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[12px] leading-relaxed text-muted">
          The same inputs and scoring version produce the same ranking. Alternatives are shown, not hidden.
        </p>
      </div>
    </div>
  );
}

function ImplementationPanel({ e }: { e: ExampleRecommendation }) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {["Internal team", "Selected partner"].map((opt, i) => (
          <div
            key={opt}
            className={cn(
              "border px-3 py-2 text-[12.5px] font-medium",
              i === 0 ? "border-ink bg-ink text-paper" : "border-line bg-paper text-muted"
            )}
          >
            {opt}
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
        Recommended execution path: <span className="font-semibold text-ink">{e.partner}</span>. A
        partner becomes relevant only after you select the intervention&mdash;and partners cannot pay to
        influence the recommendation.
      </p>

      <div className="mt-5 border-t border-line pt-5">
        <DetailLabel>Blueprint</DetailLabel>
        <BlueprintPhases effort={e.effort} partner={e.partner} />
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-3 first:pl-0">
      <p className="font-mono text-[20px] font-bold tracking-tight text-ink">{value}</p>
      <p className="mt-0.5 text-[10px] leading-tight text-muted">{label}</p>
    </div>
  );
}

function ConfidenceBadge({ label, score }: { label: string; score: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">{label}</span>
      <span className="font-mono text-[11px] text-faint">{Math.round(score * 100)}%</span>
    </span>
  );
}

function ConfidenceDriver({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <DetailLabel>{label}</DetailLabel>
        <span className="font-mono text-[10px] text-faint">{Math.round(value * 100)}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-ink/70" style={{ width: `${Math.round(value * 100)}%` }} />
      </div>
      <p className="mt-1 text-[11.5px] leading-snug text-muted">{note}</p>
    </div>
  );
}

function BlueprintPhases({ effort, partner }: { effort: string; partner: string }) {
  const weeks = effort === "Low" ? 3 : effort === "Low-Medium" ? 4 : effort === "Medium" ? 6 : 10;
  const phases = [
    { p: "P1", name: "Baseline and metrics setup", dur: "2 wks", owner: "Ops lead", metric: "Baseline locked" },
    { p: "P2", name: "Build, configure, and integrate", dur: `${weeks} wks`, owner: partner, metric: "Build complete" },
    { p: "P3", name: "Pilot and validation gate", dur: "3 wks", owner: "Ops + Compass", metric: "Gate: agreed metric met" },
    { p: "P4", name: "Scale and handover", dur: "ongoing", owner: "Operations", metric: "Adoption > 80%" },
  ];
  return (
    <div>
      <ul className="divide-y divide-line/70">
        {phases.map((p) => (
          <li key={p.p} className="flex items-center gap-3 py-3 first:pt-0">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[9px] font-bold text-muted">
              {p.p}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-[13px] font-medium text-ink">{p.name}</span>
                <span className="font-mono text-[10px] text-faint">{p.dur}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted">
                <span className="truncate">{p.owner}</span>
                <span aria-hidden="true" className="text-faint">·</span>
                <span>{p.metric}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[12px] leading-relaxed text-muted">
        Compass does not implement. Your team or the selected partner executes the plan while Compass
        preserves the rationale, requirements, and validation criteria.
      </p>
    </div>
  );
}

function LearningPlan({ learning }: { learning: string }) {
  const reviews = [
    { m: "3 mo", what: "Compare early results with the projection; check adoption." },
    { m: "6 mo", what: "Validate which assumptions held and which did not." },
    { m: "12 mo", what: "Review outcomes, capture lessons, and feed the next recommendation." },
  ];
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 border border-line bg-paper p-4">
        <DetailLabel>Review cadence</DetailLabel>
        <span className="text-[12.5px] font-medium text-ink">{learning}</span>
      </div>
      <ol className="relative mt-4 pl-6">
        <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-line" />
        {reviews.map((r) => (
          <li key={r.m} className="relative pb-5 last:pb-0">
            <span aria-hidden="true" className="absolute -left-6 top-1 h-[15px] w-[15px] rounded-full border-2 border-paper bg-ink" />
            <p className="font-mono text-[11px] font-bold text-ink">{r.m}</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{r.what}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 border-t border-line pt-4 text-[12px] leading-relaxed text-muted">
        Verified results flow back into the evidence base&mdash;so the next recommendation for your
        organization is measurably better than the last.
      </p>
    </div>
  );
}
