"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  groundingState,
  defensibilityChecks,
  type DecisionRec,
} from "@/lib/decision-package";

interface DecisionBriefPrintProps {
  recs: DecisionRec[];
  meta: any;
  summary: any;
  status?: string;
  library?: number | null;
  onClose: () => void;
}

export function DecisionBriefPrint({ recs, meta, summary, status, library, onClose }: DecisionBriefPrintProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const top = recs[0];

  const handleDownload = useCallback(async () => {
    const el = contentRef.current;
    if (!el) return;
    setExporting(true);
    try {
      const jsPDF = (await import("jspdf")).default;
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 1060,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "in", format: "letter" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 0.5;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const usableHeight = pageHeight - margin * 2;
      let remaining = imgHeight;
      const scaleY = imgHeight / canvas.height;
      pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
      remaining -= usableHeight;
      while (remaining > 0) {
        const offsetPx = (imgHeight - remaining) / scaleY;
        pdf.addPage();
        const clippedImage = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff", windowWidth: 1060, y: offsetPx, height: canvas.height - offsetPx });
        const clipData = clippedImage.toDataURL("image/png");
        const clipHeight = (clippedImage.height * imgWidth) / clippedImage.width;
        pdf.addImage(clipData, "PNG", margin, margin, imgWidth, clipHeight);
        remaining -= usableHeight;
      }
      const filename = `Compass-Executive-Decision-Brief-${(top.title || "decision").slice(0, 40).replace(/\s+/g, "-")}.pdf`;
      pdf.save(filename);
    } finally {
      setExporting(false);
    }
  }, [top.title]);

  if (!top) return null;

  const g = groundingState(top, meta);
  const dd = defensibilityChecks(top, summary);
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const badge =
    g.key === "live"
      ? { text: "Defensible", dot: "bg-[#1E7B4C]", cls: "bg-[#E5F3EA] text-[#14532d]" }
      : g.key === "partial"
        ? { text: "Preliminary", dot: "bg-[#B45309]", cls: "bg-[#FBF0E0] text-[#7a3b06]" }
        : { text: "More evidence required", dot: "bg-[#C4382C]", cls: "bg-[#FAE9E7] text-[#7a1f1a]" };

  const total = top.evidence_summary?.total_comparables || 0;
  const orgs = meta?.evidence_count?.unique_organizations || 0;
  const libraryLabel = library ? `${library.toLocaleString("en-US")} verified implementations` : "a growing library of verified implementations";

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#101826]/70 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Executive Decision Brief preview"
      onClick={onClose}
    >
      <div className="mx-auto max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#dfe5ec] bg-white px-5 py-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4f6280]">Executive Decision Brief</p>
            <p className="text-[12px] font-semibold text-[#101826]">Print preview &middot; Prepared by Compass</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper transition-colors hover:bg-ink2 disabled:opacity-60"
            >
              {exporting ? "Exporting…" : "Download PDF"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#dfe5ec] bg-surface px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink/40"
            >
              Close
            </button>
          </div>
        </div>

        {/* ===== print document ===== */}
        <div
          ref={contentRef}
          className="bg-white px-8 py-10 shadow-[0_25px_50px_rgba(0,0,0,0.25)] sm:px-12"
          style={{ width: 1060, maxWidth: "100%", color: "#1c1a17", fontFamily: "ui-sans-serif, system-ui, -apple-system, Helvetica, Arial, sans-serif", lineHeight: 1.55 }}
        >
          <div className="h-1.5 w-full rounded bg-gradient-to-r from-[#1E7B4C] via-[#156ff5] via-[#762ee8] to-[#bb7a00]" aria-hidden="true" />

          {/* masthead */}
          <div className="mt-8 flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#1E7B4C] pb-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6c685f]">Executive Decision Brief</p>
              <h1 className="mt-2 font-serif text-[30px] font-semibold leading-tight tracking-[-0.02em] text-[#1c1a17]">
                {top.title || "Evidence-supported intervention"}
              </h1>
              <p className="mt-1 text-[12px] text-[#6c685f]">Prepared by Compass &middot; {today}</p>
            </div>
            <span className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold", badge.cls)}>
              <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", badge.dot)} />
              {badge.text}
            </span>
          </div>

          {/* recommendation first */}
          <div className="mt-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1E7B4C]">Recommended decision</p>
            <p className="mt-2 font-serif text-[22px] font-medium leading-snug text-[#1c1a17]">
              Approve <b className="font-semibold underline decoration-[#e9f6ee] decoration-4">{top.title || "this intervention"}</b> as the recommended path.
            </p>
            <p className="mt-3 text-[14px] leading-[1.6] text-[#6c685f]">
              {total > 0
                ? `Compass recommends this based on ${total} comparable implementation${total > 1 ? "s" : ""} matched from ${libraryLabel}${orgs ? `, across ${orgs} organizations` : ""}.`
                : "Compass recommends this as the highest-confidence option on the evidence criteria applied."}
            </p>
          </div>

          {/* decision metadata */}
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded border border-[#e6e2db] bg-[#e6e2db] sm:grid-cols-4">
            <PrintMeta label="Prepared for" value="Executive Leadership" />
            <PrintMeta label="Decision" value={top.category ? top.category.replace(/_/g, " ") : "Operational intervention"} />
            <PrintMeta label="Status" value={badge.text} highlight />
            <PrintMeta label="Date" value={today} />
          </div>

          {/* the problem */}
          <Section title="The problem">
            <div className="rounded border-l-4 border-[#C14A3C] bg-[#FAEAE7] p-4">
              <p className="text-[13.5px] font-semibold leading-[1.55] text-[#8f2f24]">
                {summary?.problem_statement || top.rationale || "An operational workflow is underperforming on cost, time, or quality."}
              </p>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-3">
              {buildPainPoints(top, summary).map((p) => (
                <div key={p.label} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-[#C14A3C]" />
                  <p className="text-[12px] leading-[1.5] text-[#1c1a17]/85">
                    <b className="text-[#8f2f24]">{p.label}:</b> {p.text}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* KPI cards */}
          <Section title="Impact">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Kpi label="Confidence" value={top.confidence?.label || "—"} sub={top.confidence?.score != null ? `${Math.round(top.confidence.score * 100)}%` : ""} />
              <Kpi label="Evidence" value={String(total)} sub={`${orgs} organizations`} />
              <Kpi label="Timeline" value={timelineText(top)} sub="estimate" />
              <Kpi label="Readiness" value={(top.information_gaps || []).length ? "Needs baseline" : "Ready"} sub={(top.information_gaps || []).length ? `${(top.information_gaps || []).length} gap(s) to close` : "context complete"} />
            </div>
          </Section>

          {/* why now */}
          <Section title="Why this, why now">
            <p className="text-[13.5px] leading-[1.6] text-[#1c1a17]/85">
              {top.rationale || "This intervention ranks highest on problem fit, evidence strength, implementation depth, and outcome evidence."}
            </p>
            {(top.why_ranked_first?.supporting_reasons || top.why_it_ranked_here || []).slice(0, 3).length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {(top.why_ranked_first?.supporting_reasons || top.why_it_ranked_here || []).slice(0, 3).map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-[#1c1a17]/85">
                    <span className="mt-0.5 text-[#1E7B4C]">&#10003;</span>
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {/* decision defensibility */}
          <Section title="Can we defend it?">
            <p className="text-[12px] text-[#6c685f]">
              {dd.score} of {dd.total} questions answered from evidence.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
              {dd.checks.map((c) => (
                <div key={c.key} className="flex items-start gap-2">
                  <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white", c.ok ? "bg-[#1E7B4C]" : "bg-[#B45309]")} aria-hidden="true">
                    {c.ok ? "✓" : "⚠"}
                  </span>
                  <p className="text-[12px] font-medium text-[#1c1a17]">{c.label}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* risks & assumptions */}
          <Section title="Risks & assumptions">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8f2f24]">Risks</p>
                {(top.risks || []).slice(0, 3).length > 0 ? (
                  <ul className="space-y-1.5">
                    {(top.risks || []).slice(0, 3).map((r, i) => (
                      <li key={i} className="text-[12px] leading-[1.5] text-[#1c1a17]/85">
                        <b>{r.title}.</b> {r.mitigation ? <span className="text-[#14663a]">Mitigation: {r.mitigation}</span> : r.explanation}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[12px] italic text-[#6c685f]">No risks surfaced.</p>
                )}
              </div>
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0a6a78]">Assumptions</p>
                {(top.assumptions_detail || []).slice(0, 3).length > 0 ? (
                  <ul className="space-y-1.5">
                    {(top.assumptions_detail || []).slice(0, 3).map((a, i) => (
                      <li key={i} className="text-[12px] leading-[1.5] text-[#1c1a17]/85">
                        <b>{a.title}.</b> {a.explanation}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[12px] italic text-[#6c685f]">No assumptions recorded.</p>
                )}
              </div>
            </div>
          </Section>

          {/* implementation roadmap */}
          <Section title="How we get there">
            {top.next_validation_step ? (
              <div className="rounded border border-[#e6e2db] bg-[#f5f4f1] p-4">
                <p className="text-[13px] font-bold text-[#1c1a17]">{top.next_validation_step.action}</p>
                <p className="mt-1 text-[12px] leading-[1.5] text-[#6c685f]">{top.next_validation_step.success_criteria || top.next_validation_step.purpose}</p>
              </div>
            ) : (
              <p className="text-[12px] italic text-[#6c685f]">No validation step defined.</p>
            )}
            <p className="mt-2 text-[11.5px] text-[#6c685f]">
              Compass does not implement. Your team or a selected partner executes the plan; partners cannot influence the recommendation.
            </p>
          </Section>

          {/* alternatives */}
          <Section title="The alternatives">
            {(top.alternatives_considered || []).slice(0, 3).length > 0 ? (
              <ul className="space-y-2">
                {(top.alternatives_considered || []).slice(0, 3).map((a) => (
                  <li key={a.family} className="flex items-start gap-2 text-[12.5px]">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1c1a17] text-[9px] font-bold text-white" aria-hidden="true">×</span>
                    <p className="leading-[1.5] text-[#1c1a17]/85"><b>{a.family}.</b> {a.reason}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px] italic text-[#6c685f]">No alternatives surfaced.</p>
            )}
          </Section>

          {/* evidence */}
          <Section title="Evidence behind this">
            {(top.comparable_implementations || []).slice(0, 3).length > 0 ? (
              <ul className="divide-y divide-[#e6e2db]">
                {(top.comparable_implementations || []).slice(0, 3).map((c) => (
                  <li key={c.record_id || c.organization} className="py-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[13px] font-bold text-[#1c1a17]">{c.organization || "Verified implementation"}</span>
                      <span className="rounded bg-[#f0f3f6] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#3f4a5a]">
                        {c.evidence_tier || "unknown"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[12px] text-[#6c685f]">{c.outcome_summary || c.observed_outcome || "Not quantified"}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px] italic text-[#6c685f]">No comparable implementations attached.</p>
            )}
            <p className="mt-3 text-[11px] text-[#6c685f]">
              Compared against {libraryLabel}. Every material claim traces to a source; Compass defers when evidence is insufficient.
            </p>
          </Section>

          {/* final decision */}
          <div className="mt-8 rounded border border-[#1E7B4C]/40 bg-[#f2faf5] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#14532d]">The decision</p>
            <p className="mt-1.5 font-serif text-[20px] font-semibold leading-snug text-[#1c1a17]">
              Approve {top.title || "this intervention"} as the recommended path, with the validation step above as the gate.
            </p>
            <p className="mt-2 text-[12.5px] leading-[1.6] text-[#6c685f]">
              Authorize implementation, define the baseline, and report against the success criteria. Compass tracks the outcome and feeds it into future decisions.
            </p>
          </div>

          <p className="mt-6 border-t border-[#e6e2db] pt-3 text-[10.5px] leading-[1.5] text-[#9c968a]">
            Grounding note: {g.note} Figures and ranges shown are derived from retrieved implementation evidence and are not outcome guarantees.
          </p>
        </div>
      </div>
    </div>
  );
}

function PrintMeta({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("bg-white px-4 py-3", highlight && "bg-[#E5F3EA]")}>
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#6c685f]">{label}</p>
      <p className={cn("mt-0.5 text-[13px] font-semibold text-[#1c1a17]", highlight && "text-[#14532d]")}>{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="font-serif text-[18px] font-semibold tracking-[-0.01em] text-[#1c1a17]">{title}</h2>
        <span aria-hidden="true" className="h-px flex-1 bg-[#e6e2db]" />
      </div>
      {children}
    </section>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded border border-[#e6e2db] p-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#6c685f]">{label}</p>
      <p className="mt-0.5 truncate text-[18px] font-extrabold tracking-tight text-[#1c1a17]">{value}</p>
      {sub && <p className="truncate text-[10px] text-[#6c685f]">{sub}</p>}
    </div>
  );
}

function timelineText(top: DecisionRec): string {
  const tl = top.impact?.implementation_timeline;
  const lo = tl?.min_weeks, hi = tl?.max_weeks;
  if (!lo && !hi) return "TBD";
  const weeks = hi || lo || 0;
  if (weeks > 8) {
    const mo = Math.max(1, Math.round(weeks / 4.33));
    return lo && hi ? `${Math.max(1, Math.round(lo / 4.33))}–${Math.round(hi / 4.33)} mo` : `~${mo} mo`;
  }
  return lo && hi ? `${lo}–${hi} wk` : `${lo || hi} wk`;
}

function buildPainPoints(top: DecisionRec, summary: any): { label: string; text: string }[] {
  const points: { label: string; text: string }[] = [];
  const ranges = (top.outcome_ranges || []).filter((r) => r.directly_comparable);
  const riskCount = (top.risks || []).length;
  const gapCount = (top.information_gaps || []).length;

  if (ranges.length > 0) {
    const r = ranges[0];
    const value = r.median != null ? r.median : r.low != null && r.high != null ? `${r.low}–${r.high}` : "";
    points.push({
      label: "Gap today",
      text: `Comparable implementations moved ${r.metric_label || "the metric"} by ${value}${r.unit === "%" ? "%" : ""} — the current process is behind that.`,
    });
  }
  if (gapCount > 0) {
    points.push({
      label: "Missing data",
      text: `${gapCount} material information gap${gapCount > 1 ? "s" : ""} (${top.information_gaps![0].title}) still needs a baseline to close.`,
    });
  }
  if (riskCount > 0) {
    points.push({
      label: "What could go wrong",
      text: `${riskCount} evidence-backed risk${riskCount > 1 ? "s" : ""} to manage — the top one: ${top.risks![0].title}.`,
    });
  }
  if (points.length === 0) {
    points.push({
      label: "The decision",
      text: "This intervention ranks highest on problem fit, evidence strength, and outcome evidence.",
    });
  }
  return points.slice(0, 3);
}
