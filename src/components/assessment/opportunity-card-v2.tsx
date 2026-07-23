"use client";

import { useState } from "react";
import type { EnrichedOpportunity, EvidenceRecord, BusinessCase } from "@/types/pipeline";
import { cn } from "@/lib/utils";
import { EvidenceTrace } from "@/components/assessment/evidence-trace";
import { BusinessCaseView } from "@/components/assessment/business-case";
import { ImplementationOptions } from "@/components/assessment/implementation-options";

interface OpportunityCardV2Props {
  opportunity: EnrichedOpportunity;
  evidence?: EvidenceRecord[];
  rank: number;
}

const tierConfig: Record<number, { label: string; color: string; badge: string }> = {
  1: { label: "Tier 1", color: "bg-forest text-white", badge: "Build Now" },
  2: { label: "Tier 2", color: "bg-blue-600 text-white", badge: "Validate Next" },
  3: { label: "Tier 3", color: "bg-amber-600 text-white", badge: "Defer" },
  4: { label: "Tier 4", color: "bg-gray-400 text-white", badge: "Do Not Pursue" },
};

const confidenceColors: Record<string, string> = {
  Confirmed: "bg-forest text-white",
  High: "bg-forest text-white",
  Medium: "bg-amber-500 text-white",
  Low: "bg-gray-400 text-white",
};

const impactColors: Record<string, string> = {
  High: "bg-green-100 text-green-800",
  Medium: "bg-amber-100 text-amber-800",
  Low: "bg-gray-100 text-gray-800",
};

const complexityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-amber-100 text-amber-800",
  High: "bg-red-100 text-red-800",
  "Very High": "bg-red-200 text-red-900",
};

export function OpportunityCardV2({ opportunity, evidence, rank }: OpportunityCardV2Props) {
  const [expanded, setExpanded] = useState(false);
  const opp = opportunity;
  const tc = tierConfig[opp.tier] || tierConfig[4];

  const businessCase: BusinessCase = {
    currentCost: opp.currentCost || "Needs investigation",
    estimatedSavings: opp.estimatedSavings || "Needs investigation",
    expectedTimeSavings: opp.estimatedHoursLost ? `${opp.estimatedHoursLost} hours/week` : "Needs investigation",
    risk: opp.risk || "Unknown",
    confidence: opp.confidence?.score || 0,
    dependencies: opp.dependencies || [],
    expectedTimeToValue: opp.expectedTimeToValue || "Unknown",
    isEstimated: true,
  };

  return (
    <div className="border border-border rounded-lg bg-white overflow-hidden shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left hover:bg-cream/30 transition-colors"
      >
        {/* Compact header row */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-ink text-cream flex items-center justify-center text-sm font-medium">
                {rank}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-stone font-medium uppercase tracking-wider">{opp.candidate.department}</p>
                  {opp.status && opp.status !== "not_started" && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 capitalize">{opp.status.replace(/_/g, " ")}</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-ink mt-0.5">{opp.candidate.title}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", tc.color)}>
                {tc.label}
              </span>
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", confidenceColors[opp.confidence?.level || "Low"])}>
                {opp.confidence?.level || "Unknown"}
              </span>
            </div>
          </div>

          {/* Metric chips */}
          <div className="mt-3 flex flex-wrap gap-2 ml-12">
            {opp.estimatedHoursLost && (
              <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200">
                {opp.estimatedHoursLost} hrs/week lost
              </span>
            )}
            {opp.estimatedBusinessImpact && (
              <span className={cn("text-xs px-2 py-0.5 rounded", impactColors[opp.estimatedBusinessImpact] || "bg-gray-100 text-gray-800")}>
                {opp.estimatedBusinessImpact} Impact
              </span>
            )}
            {opp.expectedTimeToValue && (
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                {opp.expectedTimeToValue} TTV
              </span>
            )}
            {opp.implementationComplexity && (
              <span className={cn("text-xs px-2 py-0.5 rounded", complexityColors[opp.implementationComplexity] || "bg-gray-100 text-gray-800")}>
                {opp.implementationComplexity} Complexity
              </span>
            )}
            <span className={cn("text-xs px-2 py-0.5 rounded", tc.color)}>
              {tc.badge}
            </span>
          </div>

          <p className="mt-2 text-sm text-stone ml-12">{opp.candidate.problemStatement}</p>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border px-5 py-5 space-y-6">
          {/* Current Workflow */}
          {opp.currentWorkflow && (
            <div>
              <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Current Workflow</h4>
              <p className="text-sm text-ink bg-mist/50 rounded p-3">{opp.currentWorkflow}</p>
            </div>
          )}

          {/* Business Problem */}
          <div>
            <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Business Problem</h4>
            <p className="text-sm text-ink">{opp.candidate.problemStatement}</p>
          </div>

          {/* Business Case */}
          <BusinessCaseView businessCase={businessCase} />

          {/* Primary KPI */}
          {opp.primaryKpi && (
            <div>
              <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Primary KPI</h4>
              <p className="text-sm font-medium text-ink">{opp.primaryKpi}</p>
            </div>
          )}

          {/* Recommended System */}
          {opp.recommendedSystemType && (
            <div>
              <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Recommended System Type</h4>
              <p className="text-sm text-ink">{opp.recommendedSystemType}</p>
            </div>
          )}

          {/* Evidence */}
          {evidence && evidence.length > 0 && (
            <EvidenceTrace evidence={evidence} evidenceIds={opp.evidenceIds} />
          )}

          {/* Implementation Plan */}
          {opp.implementationBlueprint && (
            <div>
              <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Implementation Plan</h4>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded font-medium",
                opp.implementationBlueprint === "Available" ? "bg-forest text-white" : "bg-amber-100 text-amber-800"
              )}>
                {opp.implementationBlueprint}
              </span>
            </div>
          )}

          {/* Dependencies */}
          {opp.candidate.dependencies.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Prerequisites</h4>
              <div className="flex flex-wrap gap-2">
                {opp.candidate.dependencies.map((dep, i) => (
                  <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200">
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Risks */}
          {opp.candidate.risks.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Risks</h4>
              <div className="flex flex-wrap gap-2">
                {opp.candidate.risks.map((risk, i) => (
                  <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200">
                    {risk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Four-Pass Scores */}
          <div>
            <h4 className="text-xs font-semibold text-stone uppercase tracking-wider mb-3">Four-Pass Ranking</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ScoreCard label="Feasibility" score={opp.feasibility.score} maxScore={opp.feasibility.maxScore} labelType={opp.feasibility.label} details={opp.feasibility.details} />
              <ScoreCard label="Business Leverage" score={opp.businessLeverage.score} maxScore={opp.businessLeverage.maxScore} labelType={opp.businessLeverage.label} details={opp.businessLeverage.details} />
              <ScoreCard label="Implementation Readiness" score={opp.implementationReadiness.score} maxScore={opp.implementationReadiness.maxScore} labelType={opp.implementationReadiness.label} details={opp.implementationReadiness.details} />
              <ScoreCard label="Strategic Alignment" score={opp.strategicAlignment.score} maxScore={opp.strategicAlignment.maxScore} labelType={opp.strategicAlignment.label} details={opp.strategicAlignment.details} />
            </div>
          </div>

          {/* Implementation Options */}
          <ImplementationOptions />
        </div>
      )}
    </div>
  );
}

function ScoreCard({ label, score, maxScore, labelType, details }: { label: string; score: number; maxScore: number; labelType: string; details: string[] }) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const barColor = labelType === "pass" ? "bg-forest" : labelType === "conditional" ? "bg-amber-500" : "bg-red-400";

  return (
    <div className="border border-border rounded-lg p-3 bg-white">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-stone font-medium">{label}</span>
        <span className={cn(
          "text-xs font-medium",
          labelType === "pass" ? "text-forest" : labelType === "conditional" ? "text-amber-600" : "text-red-600"
        )}>
          {score}/{maxScore}
        </span>
      </div>
      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${pct}%` }} />
      </div>
      {details.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {details.map((d, i) => (
            <li key={i} className="text-xs text-stone">{"\u2022"} {d}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
