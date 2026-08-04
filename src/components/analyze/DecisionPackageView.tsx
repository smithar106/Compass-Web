"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  groundingState,
  defensibilityChecks,
  type DecisionRec,
} from "@/lib/decision-package";
import { DecisionBriefPrint } from "./DecisionBriefPrint";
import {
  BRIEF_COLORS,
  BRIEF_TONE_STYLES,
  type BriefTone,
} from "@/lib/brief-colors";
import {
  buildExecutiveSummary,
  buildWhyCards,
  buildImpactKpis,
  buildConfidenceExplanation,
  buildRiskItems,
  buildUnknownItems,
  buildAssumptionItems,
  defensibilitySummary,
} from "@/lib/brief-text";

export function DecisionPackageView({
  recs,
  meta,
  summary,
  status,
  recommendationId,
  onImplement,
  onSave,
}: {
  recs: DecisionRec[];
  meta: any;
  summary: any;
  status?: string;
  recommendationId?: string;
  onImplement?: () => void;
  onSave?: () => void;
}) {
  const [implementing, setImplementing] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [library, setLibrary] = useState<number | null>(null);
  const top = recs[0];

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/metadata", { cache: "no-store" });
        if (res.ok) {
          const m = await res.json();
          const n = Number(m.published_records);
          if (Number.isFinite(n) && n > 0 && alive) setLibrary(n);
        }
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, []);

  const g = useMemo(() => groundingState(top, meta), [top, meta]);
  const dd = useMemo(() => defensibilityChecks(top, summary), [top, summary]);

  if (!top) return null;

  if (status === "insufficient_evidence" || top.confidence?.label === "insufficient") {
    return <InsufficientEvidence rec={top} />;
  }

  const badge =
    g.key === "live"
      ? { text: "Recommended", cls: "bg-[#E5F3EA] text-[#14532d]", dot: "bg-[#1E7B4C]" }
      : g.key === "partial"
        ? { text: "Needs validation", cls: "bg-[#FBF0E0] text-[#7a3b06]", dot: "bg-[#B45309]" }
        : { text: "Insufficient evidence", cls: "bg-[#FAE9E7] text-[#7a1f1a]", dot: "bg-[#C4382C]" };

  if (implementing) {
    return <ImplementationView top={top} recommendationId={recommendationId} onBack={() => setImplementing(false)} />;
  }

  const saveDecision = () => {
    if (onSave) {
      onSave();
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem("compass-saved-decisions") || "[]");
      saved.push({ title: top.title, savedAt: new Date().toISOString() });
      localStorage.setItem("compass-saved-decisions", JSON.stringify(saved.slice(-20)));
      alert("Decision saved to this browser.");
    } catch {}
  };

  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const whyCards = buildWhyCards(top, summary);
  const impactKpis = buildImpactKpis(top);
  const confidenceFactors = buildConfidenceExplanation(top);
  const risks = buildRiskItems(top);
  const unknowns = buildUnknownItems(top);
  const assumptions = buildAssumptionItems(top);
  const defSummary = defensibilitySummary(dd.checks);

  return (
    <div className="space-y-6">
      {/* ===== MASTHEAD ===== */}
      <section className="overflow-hidden rounded-xl border border-[#a8d6bd] bg-white shadow-panel">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1f9d57] via-[#0e9db0] via-[#6a5acd] to-[#d9932a]" aria-hidden="true" />
        <div className="border-b border-[#a8d6bd]/60 bg-[#e9f6ee] px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <span />
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#14663a]">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
                <path d="M10.6 5.4 9.5 9.5 5.4 10.6 6.5 6.5z" fill="currentColor" />
              </svg>
              Prepared by Compass
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="font-serif text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#101826] sm:text-[30px]">
                Executive Decision Brief
              </h2>
              <p className="mt-2 font-serif text-[19px] italic leading-snug text-[#3c5645]">
                {top.title || "Evidence-supported intervention"}
              </p>
            </div>
            <span className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold", badge.cls)}>
              <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", badge.dot)} />
              {badge.text}
            </span>
          </div>

          <p className="mt-4 max-w-3xl text-[13.5px] leading-[1.65] text-[#4f6280]">
            {buildExecutiveSummary(top, meta, library)}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#e6eaef] bg-[#e6eaef] sm:grid-cols-4">
            <MetaCell label="Prepared for" value="Executive Leadership" />
            <MetaCell label="Decision" value={decisionScope(top)} />
            <MetaCell label="Status" value={badge.text} highlight />
            <MetaCell label="Date" value={today} />
          </dl>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled
              aria-disabled="true"
              title="Feature coming soon"
              className="inline-flex cursor-not-allowed items-center justify-center gap-2 bg-line px-6 py-3 text-[14px] font-semibold text-faint"
            >
              Implement This Plan
              <span className="text-[10px] font-bold uppercase tracking-wide text-faint">(Feature Coming Soon)</span>
            </button>
            <button
              type="button"
              onClick={() => setPrinting(true)}
              className="inline-flex items-center justify-center gap-2 border border-[#dfe5ec] bg-surface px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-ink/40"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 5V2h8v3M4 11H2.5A1.5 1.5 0 0 1 1 9.5v-3A1.5 1.5 0 0 1 2.5 5h11A1.5 1.5 0 0 1 15 6.5v3A1.5 1.5 0 0 1 13.5 11H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="4" y="10" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              Download PDF
            </button>
            <button
              type="button"
              onClick={saveDecision}
              className="inline-flex items-center justify-center gap-2 border border-[#dfe5ec] bg-surface px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-ink/40"
            >
              Save Decision
            </button>
          </div>
        </div>
      </section>

      {/* ===== 1. WHY THIS IS THE BEST DECISION ===== */}
      <BriefPanel number="1" title="Why this is the best decision" tone="green">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {whyCards.map((card) => (
            <div key={card.title} className="rounded-lg border border-[#a8d6bd] bg-white/50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#14663a]">{card.title}</p>
              <ul className="mt-2 space-y-1.5">
                {card.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[12.5px] leading-[1.5] text-[#3c5645]">
                    <span aria-hidden="true" className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1f9d57]" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </BriefPanel>

      {/* ===== 2. EXPECTED BUSINESS IMPACT ===== */}
      <BriefPanel number="2" title="Expected business impact" tone="teal">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {impactKpis.map((k) => (
            <div key={k.label} className="rounded-lg border border-[#a9dce2] bg-[#e5f6f8] p-3.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#0a6a78]">{k.label}</p>
              <p className="mt-1 truncate text-[20px] font-extrabold tracking-tight text-[#0a3a42]">
                {k.value}
              </p>
              <p className="truncate text-[10.5px] text-[#0a6a78]/80">{k.caption}</p>
            </div>
          ))}
        </div>

        <SubHeader tone="teal">Why this confidence level</SubHeader>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {confidenceFactors.map((f) => (
            <li key={f.label} className="flex items-start gap-2.5 text-[12.5px]">
              <span className={cn("mt-[6px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white", f.present ? "bg-[#1f9d57]" : "bg-[#B45309]")} aria-hidden="true">
                {f.present ? "✓" : "⚠"}
              </span>
              <span className={cn("leading-[1.5]", f.present ? "text-[#0a3a42]" : "text-[#B45309]")}>
                {f.label}
              </span>
            </li>
          ))}
        </ul>
      </BriefPanel>

      {/* ===== 3. WHAT COULD GO WRONG ===== */}
      <BriefPanel number="3" title="What could go wrong" tone="amber">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div>
            <SubHeader tone="amber">Risks</SubHeader>
            {risks.length > 0 ? (
              <ul className="space-y-2.5">
                {risks.slice(0, 3).map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[12.5px]">
                    <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B45309]" />
                    <p className="leading-[1.5] text-[#5c5240]">
                      <span className="font-semibold text-[#8f5c11]">{r.title}.</span>{" "}
                      {r.mitigation ? `Mitigation: ${r.mitigation}` : r.explanation}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px] italic text-[#8f5c11]">No implementation risks identified.</p>
            )}
          </div>
          <div>
            <SubHeader tone="amber">Unknowns</SubHeader>
            {unknowns.length > 0 ? (
              <ul className="space-y-2.5">
                {unknowns.map((u) => (
                  <li key={u.title} className="flex items-start gap-2.5 text-[12.5px]">
                    <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#d9932a]" />
                    <p className="leading-[1.5] text-[#5c5240]">
                      <span className="font-semibold text-[#8f5c11]">{u.title}.</span> {u.why}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px] italic text-[#8f5c11]">No unknowns to flag.</p>
            )}
          </div>
          <div>
            <SubHeader tone="amber">Assumptions</SubHeader>
            {assumptions.length > 0 ? (
              <ul className="space-y-2.5">
                {assumptions.map((a) => (
                  <li key={a.title} className="flex items-start gap-2.5 text-[12.5px]">
                    <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#d9932a]" />
                    <p className="leading-[1.5] text-[#5c5240]">
                      <span className="font-semibold text-[#8f5c11]">{a.title}.</span> {a.explanation}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px] italic text-[#8f5c11]">No material assumptions identified.</p>
            )}
          </div>
        </div>
      </BriefPanel>

      {/* ===== 4. HOW WE EXECUTE ===== */}
      <BriefPanel number="4" title="How we execute" tone="teal">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <SubHeader tone="teal">Implementation path</SubHeader>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {["Internal team", "Selected partner"].map((opt, i) => (
                <div
                  key={opt}
                  className={cn(
                    "border px-3 py-2 text-[12.5px] font-medium",
                    i === 0 ? "border-[#0e9db0] bg-[#0e9db0] text-white" : "border-[#a9dce2] bg-white/60 text-[#0a3a42]"
                  )}
                >
                  {opt}
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11.5px] leading-[1.5] text-[#0a6a78]/80">
              Compass does not implement. Your team or a selected partner executes the plan while
              Compass preserves the rationale, requirements, and validation criteria.
            </p>
          </div>
          <div>
            <SubHeader tone="teal">Validation before scaling</SubHeader>
            {top.next_validation_step ? (
              <div className="rounded-lg border border-[#a9dce2] bg-white/60 p-3.5">
                <p className="text-[13px] font-bold text-[#0a3a42]">{top.next_validation_step.action}</p>
                <p className="mt-1 text-[12px] leading-[1.5] text-[#0a6a78]/80">{top.next_validation_step.success_criteria || top.next_validation_step.purpose}</p>
              </div>
            ) : (
              <p className="text-[12px] italic text-[#0a6a78]/70">No validation step defined.</p>
            )}
            <SubHeader tone="teal">Comparable implementations in our evidence base</SubHeader>
            {top.comparable_implementations && top.comparable_implementations.length > 0 ? (
              <ul className="mt-1.5 space-y-1.5">
                {top.comparable_implementations.slice(0, 3).map((c) => (
                  <li key={c.record_id || c.organization} className="rounded border border-[#a9dce2] bg-white/50 px-3 py-2">
                    <p className="text-[12.5px] font-bold text-[#0a3a42]">{c.organization || "Verified implementation"}</p>
                    <p className="text-[11px] leading-[1.4] text-[#0a6a78]/85">{(c.outcome_summary || c.observed_outcome || "Outcome not quantified").replace(/;/g, " · ")}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px] italic text-[#0a6a78]/70">No comparable implementations attached.</p>
            )}
          </div>
        </div>
      </BriefPanel>

      {/* ===== 5. OTHER APPROACHES EVALUATED + WHY WE CAN DEFEND THIS ===== */}
      <BriefPanel number="5" title="Other approaches evaluated" tone="violet">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            {top.alternatives_considered && top.alternatives_considered.length > 0 ? (
              <ul className="space-y-2.5">
                {top.alternatives_considered.slice(0, 3).map((a) => (
                  <li key={a.family} className="rounded border border-[#c5bef0] bg-white/50 p-3">
                    <p className="text-[13px] font-semibold text-[#2c2a45]">{a.family}</p>
                    <p className="mt-1 text-[11.5px] leading-[1.5] text-[#463a9e]/80">{a.reason}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px] italic text-[#463a9e]/70">No alternatives were surfaced.</p>
            )}
          </div>
          <div>
            <SubHeader tone="violet">Why we can defend this decision</SubHeader>
            <ul className="space-y-2">
              {defSummary.map((f) => (
                <li key={f.label} className="flex items-start gap-2.5 text-[12.5px]">
                  <span className={cn("mt-[6px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white", f.ok ? "bg-[#1f9d57]" : "bg-[#B45309]")} aria-hidden="true">
                    {f.ok ? "✓" : "⚠"}
                  </span>
                  <span className={cn("leading-[1.5]", f.ok ? "text-[#463a9e]" : "text-[#B45309]")}>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </BriefPanel>

      {/* ===== GROUNDING NOTE ===== */}
      <div className="rounded-lg border border-dashed border-line bg-paper px-4 py-3">
        <p className="text-[11px] leading-[1.55] text-muted">
          <span className="font-semibold text-ink">Grounding note.</span> {g.note}
        </p>
      </div>

      {printing && (
        <DecisionBriefPrint
          recs={recs}
          meta={meta}
          summary={summary}
          status={status}
          library={library}
          onClose={() => setPrinting(false)}
        />
      )}
    </div>
  );
}

function BriefPanel({ number, title, tone, children }: { number: string; title: string; tone: BriefTone; children: React.ReactNode }) {
  const c = BRIEF_COLORS[tone];
  const t = BRIEF_TONE_STYLES[tone];
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-[14px] font-bold text-white", t.chip)}
        >
          {number}
        </span>
        <h3 className={cn("font-serif text-[24px] font-semibold tracking-[-0.01em]", t.label)}>{title}</h3>
        <span aria-hidden="true" className="h-px flex-1" style={{ backgroundColor: c.accent + "40" }} />
      </div>
      <div className={cn("space-y-4 rounded-xl border p-5 shadow-sm sm:p-6", t.card)}>{children}</div>
    </section>
  );
}

function SubHeader({ tone, children }: { tone: BriefTone; children: React.ReactNode }) {
  const c = BRIEF_COLORS[tone];
  return (
    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: c.ink }}>
      <span aria-hidden="true" className="h-1 w-3 rounded-full" style={{ backgroundColor: c.accent }} />
      {children}
    </p>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#4f6280]">{children}</p>;
}

function MetaCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("bg-white px-4 py-3", highlight && "bg-[#E5F3EA]")}>
      <dt className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#4f6280]">{label}</dt>
      <dd className={cn("mt-0.5 text-[13.5px] font-semibold text-[#101826]", highlight && "text-[#14532d]")}>{value}</dd>
    </div>
  );
}

function decisionScope(top: DecisionRec): string {
  return top.category ? top.category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Operational intervention";
}

function ImplementationView({ top, recommendationId, onBack }: { top: DecisionRec; recommendationId?: string; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted transition-colors hover:text-ink">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M14 8H3M7 3 2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Back to decision
      </button>

      <section className="overflow-hidden rounded-xl border border-[#dfe5ec] bg-white shadow-panel">
        <div className="border-b border-[#e6eaef] bg-[#f6f8fa] px-6 py-2.5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4f6280]">Implement This Plan</p>
        </div>
        <div className="p-6">
          <SectionLabel>Recommended implementation path</SectionLabel>
          <p className="mt-2 text-[14px] font-semibold text-[#101826]">{top.title}</p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {["Internal team", "Implementation partner", "Custom systems integrator"].map((opt, i) => (
              <button
                key={opt}
                type="button"
                className={cn(
                  "rounded-lg border p-4 text-left transition-colors",
                  i === 0 ? "border-ink bg-ink text-paper" : "border-[#e6eaef] bg-surface text-ink hover:border-ink/40"
                )}
              >
                <p className="text-[13px] font-semibold">{opt}</p>
                <p className={cn("mt-1 text-[11px]", i === 0 ? "text-paper/70" : "text-[#4f6280]")}>
                  {i === 0 ? "Recommended when capability exists in-house." : i === 1 ? "Illustrative — named partner matching pending." : "For larger or cross-system scopes."}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="inline-flex items-center justify-center gap-2 bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2">
              Get started
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-2 border border-[#dfe5ec] bg-surface px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-ink/40">
              Compare partners
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-2 border border-[#dfe5ec] bg-surface px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-ink/40">
              Implement internally
            </button>
          </div>

          {recommendationId && (
            <p className="mt-4 text-[11.5px] text-[#4f6280]">
              A printable brief is available:{" "}
              <a href={`/api/recommendations/pdf?rec_id=${encodeURIComponent(recommendationId)}`} target="_blank" rel="noreferrer" className="font-semibold text-accent-deep underline underline-offset-2">
                Download PDF
              </a>
            </p>
          )}
        </div>
      </section>

      <div className="rounded-xl border border-[#dfe5ec] bg-white p-5 shadow-sm">
        <SectionLabel>Required changes</SectionLabel>
        <ul className="mt-2 space-y-1.5">
          {(top.specific_intervention?.required_changes || ["Define baseline metrics", "Configure the intervention", "Run a pilot against the validation gate"]).map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-[12px] text-[#4f6280]">
              <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-accent-deep" />{c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function InsufficientEvidence({ rec }: { rec: DecisionRec }) {
  return (
    <div className="rounded-xl border border-[#B45309] bg-[#FBF0E0] p-6">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#7a3b06]">Insufficient evidence — judgment deferred</p>
      <p className="mt-2 text-[13.5px] leading-[1.6] text-[#101826]/85">
        Compass found evidence for the general intervention category but not enough highly comparable
        implementations to make a defensible decision. The next validation step below shows what would change that.
      </p>
      {rec.next_validation_step && (
        <div className="mt-4 rounded-lg border border-[#B45309]/30 bg-white p-4">
          <p className="text-[13px] font-extrabold text-[#101826]">{rec.next_validation_step.action}</p>
          <p className="mt-1 text-[11.5px] leading-[1.5] text-[#4f6280]">{rec.next_validation_step.purpose}</p>
          <p className="mt-2 text-[11.5px]"><span className="font-bold text-[#4f6280]">Success criteria: </span><span className="text-[#101826]">{rec.next_validation_step.success_criteria}</span></p>
        </div>
      )}
    </div>
  );
}
