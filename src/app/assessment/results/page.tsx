"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { sampleOpportunityMap } from "@/data/mock-results";
import { site } from "@/content/site";
import { InterventionComparison } from "@/components/intervention/intervention-comparison";
import { EvidenceDisplay } from "@/components/evidence/evidence-display";
import { ImplementationPlanView } from "@/components/blueprint/implementation-plan";
import type { Opportunity, ImplementationBlueprint, InterventionType } from "@/types";

const pathLabel: Record<string, string> = {
  "AI": "AI",
  "Deterministic Software": "Software",
  "Process Redesign": "Process",
  "Human Work": "Human",
  "Hybrid": "Hybrid",
  "No Action": "Not ready",
};

const pathBadge: Record<string, string> = {
  "AI": "border-purple-200 text-purple-700 bg-purple-50",
  "Deterministic Software": "border-blue-200 text-blue-700 bg-blue-50",
  "Process Redesign": "border-amber-200 text-amber-700 bg-amber-50",
  "Human Work": "border-gray-200 text-gray-700 bg-gray-50",
  "Hybrid": "border-green-200 text-green-700 bg-green-50",
  "No Action": "border-stone-200 text-stone-500 bg-stone-50",
};

function countByType(items: { type: string }[]): string[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) || 0) + 1);
  }
  return [...counts.entries()].map(([t, n]) => `${n}x ${pathLabel[t] || t}`);
}

function buildMockBlueprint(opp: Opportunity): ImplementationBlueprint {
  return {
    problem: opp.businessProblem,
    rootCause: opp.rootCause,
    recommendedIntervention: opp.intervention,
    alternativesConsidered: opp.whyAlternativesRejected,
    whyThisPathWon: opp.intervention.rejectionRationale,
    currentWorkflow: opp.workflow ? opp.workflow.split(". ") : opp.description.split(". "),
    futureWorkflow: [
      `${opp.intervention.title} handles ${opp.intervention.type === "AI" ? "80-90%" : opp.intervention.type === "Deterministic Software" ? "60-70%" : "50-70%"} of routine work`,
      `Human team focuses on ${opp.intervention.humanOversight.includes("Human-in-the-loop") ? "decisions and exceptions" : "strategic work"}`,
      `Estimated ${opp.intervention.timeToValue} to first measurable outcome`,
    ],
    requiredSystems: [opp.department === "Sales" ? "CRM" : opp.department === "Customer Success" ? "Product analytics" : "Current toolchain"],
    requiredApis: ["REST API integration", "Webhook event handlers"],
    requiredData: ["Historical process data", "Current workflow documentation"],
    humanRoles: [`${opp.department} team members`],
    ownership: opp.requiredOwner || `${opp.department} leadership`,
    securityAndPrivacy: ["Data access controls needed", "Review sensitive data handling"],
    rolloutPlan: ["Phase 1: Setup and integration", "Phase 2: Pilot with subset", "Phase 3: Full rollout", "Phase 4: Monitor and optimize"],
    validationPlan: ["Run pilot with 20% of cases", "Compare metrics to baseline", "Adjust thresholds before full rollout"],
    successMetrics: [opp.intervention.expectedImpact, ...(opp.successDescription ? [opp.successDescription] : [])],
    risksAndAssumptions: opp.assumptions.map((a) => `${a.assumption} (${a.confidence})`),
    expectedImpact: opp.intervention.expectedImpact,
    technicalEscalationLevel: opp.intervention.implementationEffort === "Medium-High" || opp.intervention.implementationEffort === "High" ? "Needs engineering team" : "Department-level implementation",
    sections: [],
  };
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const isExample = searchParams.get("example") === "true";
  const [selectedRank, setSelectedRank] = useState<number | null>(null);
  const [view, setView] = useState<"map" | "compare" | "blueprint">("map");
  const [expandedOpp, setExpandedOpp] = useState<number | null>(null);

  const map = isExample ? sampleOpportunityMap : null;
  const opportunities = map?.rankings || [];

  const selectedOpp = useMemo(() => {
    if (!selectedRank) return null;
    return opportunities.find((o) => o.rank === selectedRank) || null;
  }, [selectedRank, opportunities]);

  const handleSelectIntervention = (type: InterventionType) => {
    if (!selectedOpp) return;
  };

  if (!map) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-heading font-bold text-ink">{site.results.headline}</h1>
          <p className="mt-4 text-body text-stone">{site.results.noResults}</p>
          {!isExample && (
            <a
              href="/assessment/results?example=true"
              className="mt-6 inline-flex items-center px-6 py-2.5 border border-forest text-forest text-sm font-medium rounded-lg hover:bg-mist transition-colors"
            >
              View example Opportunity Map
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          {isExample && (
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-xs font-medium text-amber-800">
              Example Opportunity Map
            </div>
          )}
          <h1 className="text-heading font-bold text-ink">{site.results.headline}</h1>
          <p className="mt-2 text-body text-stone">{site.results.subtitle}</p>
        </div>

        <div className="bg-forest text-white rounded-lg p-6 mb-8">
          <p className="text-sm text-leaf font-medium mb-1">{map.executiveSummary.headline}</p>
          <p className="text-sm leading-relaxed text-cream/90">{map.executiveSummary.finding}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-cream/80">
            <span>Recommended focus: {map.executiveSummary.recommendedFocus}</span>
            <span>Quick wins: {map.executiveSummary.quickWins}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-border pb-3">
          <button
            onClick={() => setView("map")}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              view === "map" ? "bg-forest text-white" : "text-stone hover:text-ink hover:bg-mist"
            }`}
          >
            Opportunity Map
          </button>
          <button
            onClick={() => setView("compare")}
            disabled={!selectedOpp}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              view === "compare" ? "bg-forest text-white" : "text-stone hover:text-ink hover:bg-mist"
            } ${!selectedOpp ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            Compare paths
          </button>
          <button
            onClick={() => setView("blueprint")}
            disabled={!selectedOpp}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              view === "blueprint" ? "bg-forest text-white" : "text-stone hover:text-ink hover:bg-mist"
            } ${!selectedOpp ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            Implementation Plan
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-xs font-semibold text-stone uppercase tracking-wider mb-3">
              {opportunities.length} opportunities ranked
            </h2>
            {opportunities.map((opp) => (
              <button
                key={opp.rank}
                onClick={() => {
                  setSelectedRank(opp.rank);
                  setExpandedOpp(expandedOpp === opp.rank ? null : opp.rank);
                }}
                className={`w-full text-left border rounded-lg p-4 transition-colors ${
                  selectedRank === opp.rank
                    ? "border-forest bg-mist/30 ring-1 ring-forest"
                    : "border-border hover:border-forest/30 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-forest">#{opp.rank}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    opp.confidence === "High" ? "bg-green-100 text-green-700" :
                    opp.confidence === "Medium" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {opp.confidence}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-ink">{opp.name}</h3>
                <p className="text-xs text-stone mt-1">{opp.department}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${pathBadge[opp.intervention.type] || ""}`}>
                    {pathLabel[opp.intervention.type] || opp.intervention.type}
                  </span>
                  <span className="text-[10px] text-stone">{opp.intervention.timeToValue}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {view === "map" && selectedOpp && (
              <div className="bg-white border border-border rounded-lg p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-subhead font-semibold text-ink">{selectedOpp.name}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${pathBadge[selectedOpp.intervention.type] || ""}`}>
                      {pathLabel[selectedOpp.intervention.type] || selectedOpp.intervention.type}
                    </span>
                  </div>
                  <p className="text-xs text-stone mt-1">{selectedOpp.department} &bull; Rank #{selectedOpp.rank}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <div className="col-span-2">
                    <span className="text-xs text-stone block mb-1 font-medium">Business problem</span>
                    <span className="text-ink">{selectedOpp.businessProblem}</span>
                  </div>
                  <div>
                    <span className="text-xs text-stone block mb-1 font-medium">Department</span>
                    <span className="text-ink">{selectedOpp.department}</span>
                  </div>
                  <div>
                    <span className="text-xs text-stone block mb-1 font-medium">Required owner</span>
                    <span className="text-ink">{selectedOpp.requiredOwner || `${selectedOpp.department} team`}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-stone block mb-1 font-medium">Current workflow</span>
                    <span className="text-ink">{selectedOpp.workflow || selectedOpp.description}</span>
                  </div>
                  <div>
                    <span className="text-xs text-stone block mb-1 font-medium">Root cause</span>
                    <span className="text-ink">{selectedOpp.rootCause}</span>
                  </div>
                  <div>
                    <span className="text-xs text-stone block mb-1 font-medium">Current impact</span>
                    <span className="text-ink">{selectedOpp.currentImpact}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex flex-wrap gap-5 text-xs">
                    <div>
                      <span className="text-stone block mb-0.5">Recommended intervention</span>
                      <span className="text-ink font-medium">{selectedOpp.intervention.title}</span>
                    </div>
                    <div>
                      <span className="text-stone block mb-0.5">Confidence</span>
                      <span className={`font-medium ${
                        selectedOpp.intervention.confidence === "High" || selectedOpp.intervention.confidence === "Confirmed" ? "text-green-700" :
                        selectedOpp.intervention.confidence === "Medium" ? "text-amber-700" : "text-red-700"
                      }`}>{selectedOpp.intervention.confidence}</span>
                    </div>
                    <div>
                      <span className="text-stone block mb-0.5">Expected impact</span>
                      <span className="text-ink font-medium">{selectedOpp.intervention.expectedImpact}</span>
                    </div>
                    <div>
                      <span className="text-stone block mb-0.5">Effort</span>
                      <span className="text-ink font-medium">{selectedOpp.intervention.implementationEffort}</span>
                    </div>
                    <div>
                      <span className="text-stone block mb-0.5">Time to value</span>
                      <span className="text-ink font-medium">{selectedOpp.intervention.timeToValue}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-stone block mb-2 font-medium">Evidence summary</span>
                    <ul className="space-y-1">
                      {selectedOpp.evidence.map((e, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-forest mt-1.5 flex-shrink-0" />
                          <span className="text-stone">{e.detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-stone block mb-2 font-medium">Assumption summary</span>
                    <ul className="space-y-1">
                      {selectedOpp.assumptions.map((a, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                          <span className="text-stone">{a.assumption}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <EvidenceDisplay
                    evidence={selectedOpp.evidence}
                    assumptions={selectedOpp.assumptions}
                    whyChose={selectedOpp.intervention.rejectionRationale}
                    whyRejected={selectedOpp.whyAlternativesRejected}
                    alternativesConsidered={selectedOpp.intervention.comparedPaths
                      .filter((p) => p.intervention !== selectedOpp.intervention.type && p.intervention !== "No Action")
                      .map((p) => `${pathLabel[p.intervention] || p.intervention}: ${p.title}`)
                      .join(", ")}
                    whatCouldChange={selectedOpp.tradeoff}
                    howSuccessMeasured={selectedOpp.successDescription || selectedOpp.intervention.expectedImpact}
                    whenTechnicalHelpRequired={selectedOpp.technicalHelpRequired || (
                      selectedOpp.intervention.implementationEffort === "Medium-High" || selectedOpp.intervention.implementationEffort === "High"
                        ? "Engineering team involvement recommended"
                        : "Can be handled at department level"
                    )}
                  />
                </div>

                <div className="border-t border-border pt-4 flex gap-3">
                  <button
                    onClick={() => setView("compare")}
                    className="text-sm px-4 py-2 bg-forest text-white rounded-lg hover:bg-leaf transition-colors"
                  >
                    {site.results.comparePaths}
                  </button>
                  <button
                    onClick={() => setView("blueprint")}
                    className="text-sm px-4 py-2 border border-forest text-forest rounded-lg hover:bg-mist transition-colors"
                  >
                    {site.results.buildBlueprint}
                  </button>
                </div>
              </div>
            )}

            {view === "map" && !selectedOpp && (
              <div className="bg-white border border-border rounded-lg p-12 text-center">
                <p className="text-sm text-stone">Select an opportunity to view details</p>
              </div>
            )}

            {view === "compare" && selectedOpp && (
              <div className="bg-white border border-border rounded-lg p-6">
                <h2 className="text-subhead font-semibold text-ink mb-2">Compare intervention paths</h2>
                <p className="text-xs text-stone mb-4">
                  {selectedOpp.name} &bull; {selectedOpp.department}
                </p>
                <InterventionComparison
                  paths={selectedOpp.intervention.comparedPaths}
                  selected={selectedOpp.intervention.type}
                  onSelect={(type) => handleSelectIntervention(type)}
                />
              </div>
            )}

            {view === "compare" && !selectedOpp && (
              <div className="bg-white border border-border rounded-lg p-12 text-center">
                <p className="text-sm text-stone">Select an opportunity to compare intervention paths</p>
              </div>
            )}

            {view === "blueprint" && selectedOpp && (
              <div>
                <p className="text-xs text-stone mb-4">
                  {selectedOpp.name} &bull; {selectedOpp.department}
                </p>
                <ImplementationPlanView
                  blueprint={buildMockBlueprint(selectedOpp)}
                />
              </div>
            )}

            {view === "blueprint" && !selectedOpp && (
              <div className="bg-white border border-border rounded-lg p-12 text-center">
                <p className="text-sm text-stone">Select an opportunity to view its Implementation Plan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[50vh]">
        <div className="text-stone text-sm">Loading...</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
