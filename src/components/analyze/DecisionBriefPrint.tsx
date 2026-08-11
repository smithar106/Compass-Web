"use client";

import { useCallback } from "react";
import type { DecisionRec } from "@/lib/decision-package";
import { ExecutiveDecisionBrief } from "./ExecutiveDecisionBrief";
import { DecisionMemo } from "./DecisionMemo";

interface DecisionBriefPrintProps {
  decisionModel?: any;
  recs?: DecisionRec[];
  meta?: any;
  summary?: any;
  status?: string;
  onClose: () => void;
}

/**
 * Print-preview modal. When decisionModel is available (new brief), renders
 * the ExecutiveDecisionBrief; otherwise falls back to the legacy DecisionMemo.
 */
export function DecisionBriefPrint({
  decisionModel,
  recs = [],
  meta,
  summary,
  status,
  onClose,
}: DecisionBriefPrintProps) {
  const handleDownload = useCallback(() => {
    const source = document.getElementById("compass-brief-print");
    if (!source) return;
    const clone = source.cloneNode(true) as HTMLElement;
    clone.id = "compass-brief-print-clone";
    clone.style.position = "static";
    clone.style.width = "100%";
    clone.style.maxWidth = "none";
    clone.style.margin = "0";
    clone.style.boxShadow = "none";
    clone.style.borderRadius = "0";
    const holder = document.createElement("div");
    holder.id = "compass-brief-print-holder";
    document.body.appendChild(holder);
    holder.appendChild(clone);
    const cleanup = () => {
      document.body.classList.remove("printing-brief");
      holder.remove();
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    document.body.classList.add("printing-brief");
    window.print();
    setTimeout(() => {
      if (document.body.contains(holder)) cleanup();
    }, 2000);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#0B1220]/80 p-4 sm:p-8"
      data-testid="print-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="mx-auto max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between rounded-lg border border-line bg-white px-5 py-3">
          <p className="text-[12px] font-semibold text-ink">Print preview &middot; Prepared by Compass</p>
          <button
            type="button"
            onClick={handleDownload}
            data-testid="print-download-pdf"
            className="rounded-lg bg-ink px-5 py-2.5 text-[13px] font-semibold text-paper transition-colors hover:bg-ink2"
          >
            Download PDF
          </button>
        </div>
        <div
          id="compass-brief-print"
          data-testid="brief-print"
          className="overflow-hidden bg-white shadow-[0_25px_50px_rgba(0,0,0,0.35)]"
        >
          {decisionModel?.recommended_intervention ? (
            <ExecutiveDecisionBrief decisionModel={decisionModel} />
          ) : (
            <DecisionMemo recs={recs} meta={meta} summary={summary} status={status} />
          )}
        </div>
      </div>
    </div>
  );
}