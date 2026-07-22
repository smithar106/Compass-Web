"use client";

import type { BusinessCase } from "@/types/pipeline";

interface BusinessCaseProps {
  businessCase: BusinessCase;
}

export function BusinessCaseView({ businessCase }: BusinessCaseProps) {
  const bc = businessCase;

  return (
    <div>
      <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-3">
        Estimated Business Case
      </h4>
      {bc.isEstimated && (
        <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
          These are software-generated estimates based on organizational reasoning. Not consulting.
          Clearly distinguished from measured outcomes.
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="border border-border rounded p-3 bg-white">
          <p className="text-xs text-stone">Current Cost</p>
          <p className="text-sm font-semibold text-ink mt-1">{bc.currentCost}</p>
        </div>
        <div className="border border-border rounded p-3 bg-white">
          <p className="text-xs text-stone">Estimated Savings</p>
          <p className="text-sm font-semibold text-forest mt-1">{bc.estimatedSavings}</p>
        </div>
        <div className="border border-border rounded p-3 bg-white">
          <p className="text-xs text-stone">Time Savings</p>
          <p className="text-sm font-semibold text-ink mt-1">{bc.expectedTimeSavings}</p>
        </div>
        <div className="border border-border rounded p-3 bg-white">
          <p className="text-xs text-stone">Time to Value</p>
          <p className="text-sm font-semibold text-ink mt-1">{bc.expectedTimeToValue}</p>
        </div>
        <div className="border border-border rounded p-3 bg-white">
          <p className="text-xs text-stone">Risk</p>
          <p className="text-sm font-semibold text-ink mt-1">{bc.risk}</p>
        </div>
        <div className="border border-border rounded p-3 bg-white">
          <p className="text-xs text-stone">Confidence</p>
          <p className="text-sm font-semibold text-ink mt-1">{(bc.confidence * 100).toFixed(0)}%</p>
        </div>
      </div>
      {bc.dependencies.length > 0 && (
        <div className="mt-2">
          <span className="text-xs text-stone">Dependencies: </span>
          <span className="text-xs text-ink">{bc.dependencies.join(", ")}</span>
        </div>
      )}
    </div>
  );
}
