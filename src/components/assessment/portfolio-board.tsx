"use client";

import { useState } from "react";
import type { EnrichedOpportunity } from "@/types/pipeline";
import { cn } from "@/lib/utils";

interface PortfolioBoardProps {
  opportunities: EnrichedOpportunity[];
}

const tierColumns = [
  { tier: 1, label: "Tier 1: Immediate", description: "Build now. High feasibility, strong business leverage, clear path to value.", color: "border-forest", headerBg: "bg-forest" },
  { tier: 2, label: "Tier 2: Next Quarter", description: "Validate next. Promising but requires deeper investigation before commitment.", color: "border-blue-500", headerBg: "bg-blue-600" },
  { tier: 3, label: "Tier 3: Strategic", description: "Defer. Worth exploring as organizational maturity grows.", color: "border-amber-500", headerBg: "bg-amber-600" },
  { tier: 4, label: "Tier 4: Monitor", description: "Do not pursue at this time. Revisit as conditions change.", color: "border-gray-400", headerBg: "bg-gray-400" },
];

const statusColors: Record<string, string> = {
  not_started: "bg-gray-100 text-gray-700",
  evaluating: "bg-blue-100 text-blue-700",
  implementing: "bg-amber-100 text-amber-700",
  completed: "bg-forest text-white",
  measured: "bg-purple-100 text-purple-700",
};

export function PortfolioBoard({ opportunities }: PortfolioBoardProps) {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const filtered = selectedTier ? opportunities.filter((o) => o.tier === selectedTier) : opportunities;
  const tierCounts = tierColumns.map((tc) => ({
    ...tc,
    count: opportunities.filter((o) => o.tier === tc.tier).length,
  }));

  return (
    <div>
      {/* Tier filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedTier(null)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
            selectedTier === null ? "bg-ink text-cream border-ink" : "bg-white text-stone border-border hover:border-ink"
          )}
        >
          All ({opportunities.length})
        </button>
        {tierCounts.map((tc) => (
          <button
            key={tc.tier}
            onClick={() => setSelectedTier(tc.tier)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              selectedTier === tc.tier ? "bg-ink text-cream border-ink" : "bg-white text-stone border-border hover:border-ink"
            )}
          >
            {tc.label} ({tc.count})
          </button>
        ))}
      </div>

      {/* Portfolio grid */}
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-[900px]">
          {tierColumns.map((tc) => {
            const tierOpps = opportunities.filter((o) => o.tier === tc.tier);
            if (selectedTier && selectedTier !== tc.tier) return null;

            return (
              <div key={tc.tier} className={cn("flex-1 border-t-4 rounded-lg bg-cream/30", tc.color)}>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-ink">{tc.label}</h3>
                  <p className="text-xs text-stone mt-1">{tc.description}</p>
                  <p className="text-xs font-medium text-ink mt-2">{tierOpps.length} opportunity{tierOpps.length !== 1 ? "ies" : "y"}</p>
                </div>
                <div className="px-4 pb-4 space-y-3">
                  {tierOpps.map((opp) => (
                    <div key={opp.candidate.id} className="bg-white border border-border rounded-lg p-3 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-stone font-medium uppercase tracking-wider">{opp.candidate.department}</p>
                          <h4 className="text-sm font-semibold text-ink mt-0.5">{opp.candidate.title}</h4>
                        </div>
                        <span className={cn(
                          "flex-shrink-0 text-xs px-1.5 py-0.5 rounded",
                          statusColors[opp.status || "not_started"]
                        )}>
                          {(opp.status || "not_started").replace(/_/g, " ")}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {opp.estimatedBusinessImpact && (
                          <span className="text-xs text-stone">
                            Impact: <span className="font-medium text-ink">{opp.estimatedBusinessImpact}</span>
                          </span>
                        )}
                        {opp.expectedTimeToValue && (
                          <span className="text-xs text-stone">
                            TTV: <span className="font-medium text-ink">{opp.expectedTimeToValue}</span>
                          </span>
                        )}
                        {opp.confidence && (
                          <span className="text-xs text-stone">
                            Confidence: <span className="font-medium text-ink">{opp.confidence.level} ({(opp.confidence.score * 100).toFixed(0)}%)</span>
                          </span>
                        )}
                      </div>

                      {opp.estimatedSavings && (
                        <p className="mt-2 text-xs text-forest font-medium">{opp.estimatedSavings}</p>
                      )}

                      {opp.candidate.dependencies.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <p className="text-xs text-stone">Depends on: {opp.candidate.dependencies.join(", ")}</p>
                        </div>
                      )}

                      {opp.businessOwner && (
                        <p className="mt-1 text-xs text-stone">Owner: {opp.businessOwner}</p>
                      )}
                    </div>
                  ))}
                  {tierOpps.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-xs text-stone">No opportunities in this tier.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
