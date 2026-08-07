"use client";

import { useState } from "react";
import type { DecisionRec } from "@/lib/decision-package";
import { DecisionMemo } from "./DecisionMemo";
import { DecisionBriefPrint } from "./DecisionBriefPrint";

export function DecisionPackageView({
  recs,
  meta,
  summary,
  status,
  recommendationId,
  onImplement,
}: {
  recs: DecisionRec[];
  meta: any;
  summary: any;
  status?: string;
  recommendationId?: string;
  onImplement?: () => void;
  onSave?: () => void;
}) {
  const [printing, setPrinting] = useState(false);
  const top = recs[0];

  if (!top) return null;
  if (status === "insufficient_evidence" || top.confidence?.label === "insufficient") {
    return <InsufficientEvidence rec={top} />;
  }

  return (
    <div>
      <DecisionMemo recs={recs} meta={meta} summary={summary} status={status} />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          data-testid="download-pdf"
          onClick={() => setPrinting(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3 text-[14px] font-semibold text-paper transition-colors hover:bg-ink2"
        >
          Download Brief as PDF
        </button>
        <button
          type="button"
          data-testid="view-implementation-plan"
          onClick={() => onImplement?.()}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink/25 bg-white px-6 py-3 text-[14px] font-semibold text-ink transition-colors hover:border-ink"
        >
          View Implementation Plan
        </button>
      </div>

      {printing && (
        <DecisionBriefPrint recs={recs} meta={meta} summary={summary} status={status} onClose={() => setPrinting(false)} />
      )}
    </div>
  );
}

function InsufficientEvidence({ rec }: { rec: DecisionRec }) {
  return (
    <div className="rounded-xl border border-[#B45309] bg-[#FBF0E0] p-6">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#7a3b06]">Insufficient evidence — judgment deferred</p>
      <p className="mt-2 text-[13.5px] leading-[1.6] text-[#101826]/85">Too few comparable cases were available to make a confident recommendation. Additional data has been requested.</p>
      {rec.next_validation_step && (
        <div className="mt-4 rounded-lg border border-[#B45309]/30 bg-white p-4">
          <p className="text-[13px] font-extrabold text-[#101826]">{rec.next_validation_step.action}</p>
          <p className="mt-1 text-[11.5px] leading-[1.5] text-[#4f6280]">{rec.next_validation_step.purpose}</p>
        </div>
      )}
    </div>
  );
}
