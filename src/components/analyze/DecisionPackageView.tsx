import { cn } from "@/lib/utils";
import {
  groundingState,
  defensibilityChecks,
  buildConfidenceFactors,
  type DecisionRec,
} from "@/lib/decision-package";

export function DecisionPackageView({
  recs,
  meta,
  summary,
  status,
}: {
  recs: DecisionRec[];
  meta: any;
  summary: any;
  status?: string;
}) {
  const top = recs[0];
  if (!top) return null;

  if (status === "insufficient_evidence" || top.confidence?.label === "insufficient") {
    return <InsufficientEvidence rec={top} />;
  }

  const g = groundingState(top, meta);
  const dd = defensibilityChecks(top, summary);
  const factors = buildConfidenceFactors(top, recs, meta);
  const comparables = top.comparable_implementations || [];
  const withSource = comparables.filter((c) => c.source_url).length;

  return (
    <div className="space-y-4">
      {/* grounding banner */}
      <div className={cn("flex items-start gap-3 rounded-2xl border px-5 py-4", g.tone)}>
        <span aria-hidden="true" className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", g.dot)} />
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.06em]">{g.label}</p>
          <p className="mt-1 text-[12.5px] leading-[1.6] text-[#101826]/80">{g.note}</p>
        </div>
      </div>

      {/* recommended decision */}
      <section className="rounded-2xl border border-[#dfe5ec] bg-white p-6 shadow-sm">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280]">Recommended decision</p>
        <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.02em] text-[#101826]">{top.title || "Evidence-supported intervention"}</h2>
        {top.description && <p className="mt-1 text-[12.5px] leading-[1.6] text-[#4f6280]">{top.description}</p>}
        <div className="mt-4 rounded-xl border border-[#e6eaef] bg-[#f6f8fa] p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280]">Why this is the strongest path</p>
          <p className="mt-1 text-[12px] leading-[1.6] text-[#4f6280]">{top.rationale || "Ranked by comparable evidence and workflow fit."}</p>
          {top.alternatives_considered && top.alternatives_considered.length > 0 && (
            <p className="mt-2 text-[11px] text-[#4f6280]">
              Compared against {top.alternatives_considered.length} alternative{" "}
              {top.alternatives_considered.length > 1 ? "paths" : "path"}.
            </p>
          )}
        </div>
      </section>

      {/* defensibility */}
      <section className="rounded-2xl border border-[#e6eaef] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-[#e6eaef] bg-[#f6f8fa] px-4 py-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280]">Decision Defensibility</p>
          <span className={cn("font-mono text-[16px] font-bold", dd.score >= 6 ? "text-[#1E7B4C]" : dd.score >= 4 ? "text-[#B45309]" : "text-[#C4382C]")}>
            {dd.score} <span className="text-[12px] text-[#4f6280]">/ {dd.total}</span>
          </span>
        </div>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-2 p-4 sm:grid-cols-2">
          {dd.checks.map((c) => (
            <li key={c.key} className="flex items-start gap-2.5">
              <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white", c.ok ? "bg-[#1E7B4C]" : "bg-[#B45309]")} aria-hidden="true">
                {c.ok ? "✓" : "⚠"}
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-[#101826]">{c.label}</p>
                <p className="text-[11px] leading-[1.45] text-[#4f6280]">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* recommendation quality */}
      <section className="rounded-2xl border border-[#e6eaef] bg-white p-4 shadow-sm">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280]">Recommendation Quality</p>
        <p className="mt-1 text-[11px] text-[#4f6280]">
          Explainable factors instead of a single percentage — a single number would imply more precision than the current model supports.
        </p>
        <div className="mt-3">
          {factors.map((f) => (
            <div key={f.label} className="border-b border-[#ebeff4] py-2 last:border-b-0">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12px] font-semibold text-[#101826]">{f.label}</span>
                <span className={cn("text-[12px] font-extrabold", f.tone === "ok" ? "text-[#1E7B4C]" : f.tone === "warn" ? "text-[#B45309]" : "text-[#4f6280]")}>{f.value}</span>
              </div>
              <p className="mt-0.5 text-[11px] leading-[1.5] text-[#4f6280]">{f.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* evidence behind */}
      <section className="overflow-hidden rounded-2xl border border-[#e6eaef] bg-white shadow-sm">
        <div className="border-b border-[#e6eaef] bg-[#f6f8fa] px-4 py-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280]">Evidence behind this decision</p>
        </div>
        <div className="p-4">
          {comparables.length === 0 ? (
            <p className="text-[12px] italic text-[#4f6280]">No comparable implementations were attached to this recommendation by the engine.</p>
          ) : (
            <ul className="divide-y divide-[#ebeff4]">
              {comparables.slice(0, 5).map((c) => (
                <li key={c.record_id || c.organization} className="py-3 first:pt-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[12.5px] font-bold text-[#101826]">{c.organization || "Verified implementation"}</span>
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-[#4f6280]">
                      <span className={cn("rounded px-1.5 py-0.5", c.evidence_tier === "gold" ? "bg-[#fff6d8] text-[#7a5b00]" : c.evidence_tier === "silver" ? "bg-[#f0f3f6] text-[#3f4a5a]" : "bg-[#fff0e6] text-[#7a3b06]")}>
                        {c.evidence_tier || "unknown"}
                      </span>
                      <span>sim {c.similarity_score || 0}%</span>
                    </span>
                  </div>
                  {c.intervention && <p className="mt-0.5 text-[11.5px] text-[#4f6280]">{c.intervention}</p>}
                  <p className="mt-1 text-[11.5px] leading-[1.5] text-[#101826]/85">{c.outcome_summary || c.observed_outcome || "Outcome not quantified"}</p>
                  {c.supporting_passage && (
                    <p className="mt-1 text-[11px] italic leading-[1.5] text-[#4f6280]">&ldquo;{c.supporting_passage.slice(0, 220)}&rdquo;</p>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 border-t border-[#ebeff4] pt-3 text-[11px] leading-[1.5] text-[#4f6280]">
            Provenance: {withSource} of {comparables.length} records carry a resolvable source link. Records are fully traceable only once their source can be opened; passages above are extracted evidence and should be treated as partially traceable until then.
          </p>
        </div>
      </section>

      {/* assumptions + gaps + risks */}
      <AssumptionsGaps rec={top} />

      {/* next validation step */}
      {top.next_validation_step && (
        <section className="rounded-2xl border border-[#dfe5ec] bg-white p-6 shadow-sm">
          <h3 className="text-[16px] font-extrabold tracking-[-0.01em] text-[#101826]">Next validation step</h3>
          <p className="mt-1 text-[11px] text-[#4f6280]">Recommended by the engine to close the confidence gap before committing to implementation.</p>
          <div className="mt-3 rounded-xl border border-[#e6eaef] bg-[#f6f8fa] p-4">
            <p className="text-[13px] font-extrabold text-[#101826]">{top.next_validation_step.action}</p>
            <p className="mt-1 text-[11.5px] leading-[1.5] text-[#4f6280]">{top.next_validation_step.purpose}</p>
            <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-[11.5px] sm:grid-cols-2">
              <div><span className="font-bold text-[#4f6280]">Owner: </span><span className="text-[#101826]">{top.next_validation_step.owner}</span></div>
              <div><span className="font-bold text-[#4f6280]">Duration: </span><span className="text-[#101826]">{top.next_validation_step.duration}</span></div>
              <div className="sm:col-span-2"><span className="font-bold text-[#4f6280]">Success criteria: </span><span className="text-[#101826]">{top.next_validation_step.success_criteria}</span></div>
              {top.next_validation_step.decision_enabled && (
                <div className="sm:col-span-2"><span className="font-bold text-[#4f6280]">Enables: </span><span className="text-[#101826]">{top.next_validation_step.decision_enabled}</span></div>
              )}
            </div>
            {top.next_validation_step.required_inputs && top.next_validation_step.required_inputs.length > 0 && (
              <p className="mt-3 text-[11px] text-[#4f6280]">Required inputs: {top.next_validation_step.required_inputs.join(" · ")}</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function AssumptionsGaps({ rec }: { rec: DecisionRec }) {
  const assumptions = rec.assumptions_detail || [];
  const gaps = rec.information_gaps || [];
  const risks = rec.risks || [];
  if (!assumptions.length && !gaps.length && !risks.length) return null;
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {assumptions.length > 0 && (
        <div className="rounded-2xl border border-[#e6eaef] bg-white p-4 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280]">Assumptions that could change this decision</p>
          <ul className="mt-2 space-y-2.5">
            {assumptions.slice(0, 4).map((a) => (
              <li key={a.title} className="text-[11.5px]">
                <p className="font-bold text-[#101826]">{a.title}</p>
                <p className="mt-0.5 leading-[1.5] text-[#4f6280]">{a.explanation}</p>
                {a.resolution_action && <p className="mt-0.5 text-[#1E7B4C]">Resolution: {a.resolution_action}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {gaps.length > 0 && (
        <div className="rounded-2xl border border-[#e6eaef] bg-white p-4 shadow-sm">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280]">What is missing</p>
          <ul className="mt-2 space-y-2.5">
            {gaps.slice(0, 4).map((g) => (
              <li key={g.title} className="text-[11.5px]">
                <p className="font-bold text-[#101826]">{g.title}</p>
                <p className="mt-0.5 leading-[1.5] text-[#4f6280]">{g.explanation}</p>
                {g.effect_on_confidence && <p className="mt-0.5 text-[#B45309]">Effect on confidence: {g.effect_on_confidence}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {risks.length > 0 && (
        <div className="rounded-2xl border border-[#e6eaef] bg-white p-4 shadow-sm md:col-span-2">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#4f6280]">Risks identified from evidence</p>
          <ul className="mt-2 space-y-2.5">
            {risks.slice(0, 4).map((r, i) => (
              <li key={i} className="text-[11.5px]">
                <p className="font-bold text-[#101826]">{r.title}</p>
                <p className="mt-0.5 leading-[1.5] text-[#4f6280]">{r.explanation}</p>
                {r.mitigation && <p className="mt-0.5 text-[#1E7B4C]">Mitigation: {r.mitigation}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function InsufficientEvidence({ rec }: { rec: DecisionRec }) {
  return (
    <div className="rounded-2xl border border-[#B45309] bg-[#FBF0E0] p-6">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#7a3b06]">Insufficient evidence — judgment deferred</p>
      <p className="mt-2 text-[13.5px] leading-[1.6] text-[#101826]/85">
        Compass found evidence for the general intervention category but not enough highly comparable
        implementations to make a defensible recommendation. The next validation step below shows what
        would change that.
      </p>
      {rec.next_validation_step && (
        <div className="mt-4 rounded-xl border border-[#B45309]/30 bg-white p-4">
          <p className="text-[13px] font-extrabold text-[#101826]">{rec.next_validation_step.action}</p>
          <p className="mt-1 text-[11.5px] leading-[1.5] text-[#4f6280]">{rec.next_validation_step.purpose}</p>
          <p className="mt-2 text-[11.5px]"><span className="font-bold text-[#4f6280]">Success criteria: </span><span className="text-[#101826]">{rec.next_validation_step.success_criteria}</span></p>
        </div>
      )}
    </div>
  );
}
