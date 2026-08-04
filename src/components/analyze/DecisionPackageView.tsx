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
  businessSummary,
  executiveKpis,
  businessRationale,
  riskItems,
  unknownItems,
  assumptionItems,
  implementationRoadmap,
  evidenceStories,
  evaluatedOptions,
  decisionNotes,
  defensibilityItems,
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
  const kpis = executiveKpis(top);
  const rationale = businessRationale(top);
  const risks = riskItems(top);
  const unknowns = unknownItems(top);
  const assumptions = assumptionItems(top);
  const roadmap = implementationRoadmap(top);
  const stories = evidenceStories(top);
  const options = evaluatedOptions(top);
  const defItems = defensibilityItems(dd.checks);

  return (
    <div className="space-y-6">
      {/* ===== SECTION 1: EXECUTIVE SUMMARY ===== */}
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
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#101826] sm:text-[30px]">
                Executive Decision Brief
              </h2>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4f6280]">Recommended Decision</p>
              <p className="mt-2 font-serif text-[22px] font-medium leading-snug text-[#14402a]">
                Approve {top.title || "the recommended intervention"}
              </p>
              {summary?.problem_statement && (
                <p className="mt-1 text-[13px] font-medium text-muted">
                  Scope: {summary.problem_statement.replace(/^[A-Za-z][A-Za-z0-9 &-]{0,30}:\s+/, "").trim()}
                </p>
              )}
            </div>
            <span className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold", badge.cls)}>
              <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", badge.dot)} />
              {badge.text}
            </span>
          </div>

          <p className="mt-4 max-w-3xl text-[13.5px] leading-[1.65] text-[#4f6280]">
            {businessSummary(top)}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-lg border border-[#a9dce2] bg-[#e5f6f8] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#0a6a78]">{k.label}</p>
                <p className="mt-1 text-[22px] font-extrabold tracking-tight text-[#0a3a42]">{k.value}</p>
                {k.caption && <p className="truncate text-[11px] text-[#0a6a78]/80">{k.caption}</p>}
              </div>
            ))}
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#e6eaef] bg-[#e6eaef] sm:grid-cols-4">
            <MetaCell label="Prepared for" value="Executive Leadership" />
            <MetaCell label="Decision" value={decisionScope(top)} />
            <MetaCell label="Status" value={badge.text} highlight />
            <MetaCell label="Date" value={today} />
          </dl>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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

      {/* ===== SECTION 2: WHY THIS IS THE RIGHT DECISION ===== */}
      <BriefPanel number="1" title="Why this is the right decision" tone="green">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {rationale.map((card) => (
            <div key={card.title} className="rounded-lg border border-[#a8d6bd] bg-white/50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#14663a]">{card.title}</p>
              <p className="mt-2 text-[13px] leading-[1.55] text-[#3c5645]">{card.body}</p>
            </div>
          ))}
        </div>
      </BriefPanel>

      {/* ===== SECTION 3: RISKS AND UNKNOWNS ===== */}
      <BriefPanel number="2" title="Risks and unknowns" tone="amber">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div>
            <SubHeader tone="amber">Known risks</SubHeader>
            {risks.length > 0 ? (
              <ul className="space-y-2">
                {risks.map((r, i) => (
                  <li key={i} className="rounded border border-[#e8cf9c] bg-white/60 px-3 py-2">
                    <p className="text-[13px] font-semibold text-[#8f5c11]">{r.title}</p>
                    {r.mitigation && <p className="mt-0.5 text-[11.5px] leading-[1.4] text-[#5c5240]">{r.mitigation}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12.5px] italic text-[#8f5c11]">No material risks identified.</p>
            )}
          </div>
          <div>
            <SubHeader tone="amber">Information needed</SubHeader>
            {unknowns.length > 0 ? (
              <ul className="space-y-3">
                {unknowns.map((u) => (
                  <li key={u.title} className="text-[13px] leading-[1.5] text-[#5c5240]">
                    <span className="font-semibold text-[#8f5c11]">{u.title}.</span> {u.why}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12.5px] italic text-[#8f5c11]">All necessary information is available.</p>
            )}
          </div>
          <div>
            <SubHeader tone="amber">Assumptions</SubHeader>
            {assumptions.length > 0 ? (
              <ul className="space-y-3">
                {assumptions.map((a) => (
                  <li key={a.title} className="text-[13px] leading-[1.5] text-[#5c5240]">
                    <span className="font-semibold text-[#8f5c11]">{a.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12.5px] italic text-[#8f5c11]">No material assumptions identified.</p>
            )}
          </div>
        </div>
      </BriefPanel>

      {/* ===== SECTION 4: IMPLEMENTATION ===== */}
      <BriefPanel number="3" title="Implementation" tone="teal">
        <div className="grid grid-cols-1 gap-4">
          {roadmap.map((step, i) => (
            <div key={step.label} className="flex items-start gap-4 rounded-lg border border-[#a9dce2] bg-white/50 p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0e9db0] font-mono text-[12px] font-bold text-[#0a6a78]">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-[#0a3a42]">{step.label}</p>
                <p className="mt-0.5 text-[12.5px] leading-[1.5] text-[#0a6a78]/80">{step.detail}</p>
                <p className="mt-1 text-[11px] font-medium text-[#0a6a78]">Owner: {step.owner}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-[#0a6a78]/80">
          Your team or a selected partner executes the plan. The rationale and success criteria are preserved throughout implementation.
        </p>
      </BriefPanel>

      {/* ===== SECTION 5: EVIDENCE ===== */}
      <BriefPanel number="4" title="Evidence" tone="teal">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stories.map((s) => (
            <div key={s.organization} className="rounded-lg border border-[#a9dce2] bg-white/60 p-4">
              <p className="text-[14px] font-bold text-[#0a3a42]">{s.organization}</p>
              <div className="mt-3 space-y-2 text-[12px] leading-[1.5]">
                <p><span className="font-semibold text-[#0a6a78]">Challenge:</span> <span className="text-[#0a6a78]/85">{s.challenge}</span></p>
                <p><span className="font-semibold text-[#0a6a78]">Solution:</span> <span className="text-[#0a6a78]/85">{s.solution}</span></p>
                <p><span className="font-semibold text-[#0a6a78]">Result:</span> <span className="text-[#0a6a78]/85">{s.result}</span></p>
              </div>
            </div>
          ))}
          {stories.length === 0 && (
            <p className="italic text-[#0a6a78]/70 md:col-span-3">No comparable cases were attached.</p>
          )}
        </div>
      </BriefPanel>

      {/* ===== SECTION 6: OTHER OPTIONS CONSIDERED ===== */}
      <BriefPanel number="5" title="Other options considered" tone="violet">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            {options.length > 0 ? (
              <ul className="space-y-3">
                {options.map((o) => (
                  <li key={o.title} className="rounded-lg border border-[#c5bef0] bg-white/50 p-4">
                    <p className="text-[14px] font-semibold text-[#2c2a45]">{o.title}</p>
                    <p className="mt-1 text-[12.5px] leading-[1.5] text-[#463a9e]/80">{o.tradeoff}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12.5px] italic text-[#463a9e]/70">No alternatives were surfaced.</p>
            )}
          </div>
          <div>
            <SubHeader tone="violet">Why we can defend this recommendation</SubHeader>
            <ul className="space-y-2.5">
              {defItems.map((f) => (
                <li key={f.label} className="flex items-start gap-2.5 text-[13px]">
                  <span className={cn("mt-[5px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white", f.ok ? "bg-[#1f9d57]" : "bg-[#B45309]")} aria-hidden="true">
                    {f.ok ? "✓" : "⚠"}
                  </span>
                  <span className={cn("leading-[1.5]", f.ok ? "text-[#463a9e]" : "text-[#B45309]")}>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </BriefPanel>

      {/* ===== EXECUTIVE APPROVAL ===== */}
      <section className="overflow-hidden rounded-xl border border-[#a8d6bd] bg-[#e9f6ee] p-6 shadow-sm sm:p-8">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#14663a]">
          Executive Approval
        </p>
        <p className="mt-2 text-[14px] leading-[1.6] text-[#3c5645]">
          We recommend approving {top.title || "the recommended intervention"}.
          If approved, the following conditions should be met before full deployment:
        </p>
        <ul className="mt-4 space-y-2.5">
          <li className="flex items-start gap-3 text-[13px] text-[#3c5645]">
            <span aria-hidden="true" className="mt-[3px] text-[#1f9d57]">✓</span>
            Complete a four-week operational baseline measurement.
          </li>
          <li className="flex items-start gap-3 text-[13px] text-[#3c5645]">
            <span aria-hidden="true" className="mt-[3px] text-[#1f9d57]">✓</span>
            {top.next_validation_step?.success_criteria || "Validate results against the agreed baseline before proceeding to full deployment."}
          </li>
          <li className="flex items-start gap-3 text-[13px] text-[#3c5645]">
            <span aria-hidden="true" className="mt-[3px] text-[#1f9d57]">✓</span>
            Review and select an implementation partner or confirm internal team readiness.
          </li>
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Feature coming soon"
            className="inline-flex cursor-not-allowed items-center justify-center gap-2 bg-[#d3ccc0] px-6 py-3 text-[14px] font-semibold text-[#6c685f]"
          >
            Approve Implementation
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#6c685f]">(Feature Coming Soon)</span>
          </button>
          <button
            type="button"
            onClick={() => setPrinting(true)}
            className="inline-flex items-center justify-center gap-2 border border-[#a8d6bd] bg-white/70 px-6 py-3 text-[14px] font-semibold text-[#14663a] transition-colors hover:border-[#1f9d57]"
          >
            Download as PDF
          </button>
        </div>
      </section>

      {/* ===== DECISION NOTES ===== */}
      <div className="rounded-lg border border-line bg-paper/60 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-faint">Decision Notes</p>
        <p className="mt-1 text-[11.5px] leading-[1.55] text-muted">
          {decisionNotes()}
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
        <h3 className={cn("font-serif text-[22px] font-semibold tracking-[-0.01em]", t.label)}>{title}</h3>
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
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#4f6280]">Recommended implementation path</p>
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
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#4f6280]">Required changes</p>
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
        Too few comparable cases were available
        to make a confident recommendation. The next step below shows what would change that.
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
