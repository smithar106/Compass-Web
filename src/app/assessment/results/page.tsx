"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { mockResults } from "@/data/mock-results";
import { site } from "@/content/site";
import { InterventionComparison } from "@/components/intervention/intervention-comparison";
import { EvidenceDisplay } from "@/components/evidence/evidence-display";
import { ImplementationBlueprintView } from "@/components/blueprint/implementation-blueprint";
import type { Opportunity, ImplementationBlueprint, InterventionType } from "@/types";

function buildMockBlueprint(opp: Opportunity): ImplementationBlueprint {
  return {
    problem: opp.businessProblem,
    rootCause: opp.rootCause,
    recommendedIntervention: opp.intervention,
    alternativesConsidered: opp.whyAlternativesRejected,
    whyThisPathWon: opp.intervention.rejectionRationale,
    currentWorkflow: opp.description.split(". "),
    futureWorkflow: [
      `${opp.intervention.title} handles ${opp.intervention.type === "AI" ? "80-90%" : opp.intervention.type === "Deterministic Software" ? "60-70%" : "50-70%"} of routine work`,
      `Human team focuses on ${opp.intervention.humanOversight.includes("Human-in-the-loop") ? "decisions and exceptions" : "strategic work"}`,
      `Estimated ${opp.intervention.timeToValue} to first measurable outcome`
    ],
    requiredSystems: [opp.department === "Sales" ? "CRM" : opp.department === "Customer Success" ? "Product analytics" : "Current toolchain"],
    requiredApis: ["REST API integration", "Webhook event handlers"],
    requiredData: ["Historical process data", "Current workflow documentation"],
    humanRoles: [`${opp.department} team members`],
    securityAndPrivacy: ["Data access controls needed", "Review sensitive data handling"],
    rolloutPlan: ["Phase 1: Setup and integration", "Phase 2: Pilot with subset", "Phase 3: Full rollout", "Phase 4: Monitor and optimize"],
    successMetrics: [opp.intervention.expectedImpact],
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

  const map = isExample ? mockResults : null;
  const opportunities = map?.rankings || [];

  const selectedOpp = useMemo(() => {
    if (!selectedRank) return null;
    return opportunities.find((o) => o.rank === selectedRank) || null;
  }, [selectedRank, opportunities]);

  const handleSelectIntervention = (type: InterventionType) => {
    if (!selectedOpp) return;
    const updated = { ...selectedOpp, intervention: { ...selectedOpp.intervention, type } };
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
        {/* Header */}
        <div className="mb-8">
          {isExample && (
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-xs font-medium text-amber-800">
              Example Opportunity Map
            </div>
          )}
          <h1 className="text-heading font-bold text-ink">{site.results.headline}</h1>
          <p className="mt-2 text-body text-stone">{site.results.subtitle}</p>
        </div>

        {/* Executive Summary */}
        <div className="bg-forest text-white rounded-lg p-6 mb-8">
          <p className="text-sm text-leaf font-medium mb-1">{map.executiveSummary.headline}</p>
          <p className="text-sm leading-relaxed text-cream/90">{map.executiveSummary.finding}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-cream/80">
            <span>Recommended focus: {map.executiveSummary.recommendedFocus}</span>
            <span>Quick wins: {map.executiveSummary.quickWins}</span>
          </div>
        </div>

        {/* View Tabs */}
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
            Implementation Blueprint
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Opportunity List */}
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
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                    opp.intervention.type === "AI" ? "border-purple-200 text-purple-700 bg-purple-50" :
                    opp.intervention.type === "Deterministic Software" ? "border-blue-200 text-blue-700 bg-blue-50" :
                    opp.intervention.type === "Process Redesign" ? "border-amber-200 text-amber-700 bg-amber-50" :
                    opp.intervention.type === "Human Work" ? "border-gray-200 text-gray-700 bg-gray-50" :
                    opp.intervention.type === "Hybrid" ? "border-green-200 text-green-700 bg-green-50" :
                    "border-stone-200 text-stone-500 bg-stone-50"
                  }`}>
                    {opp.intervention.type}
                  </span>
                  <span className="text-[10px] text-stone">{opp.intervention.timeToValue}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {view === "map" && selectedOpp && (
              <div className="bg-white border border-border rounded-lg p-6 space-y-6">
                <div>
                  <h2 className="text-subhead font-semibold text-ink">{selectedOpp.name}</h2>
                  <p className="text-xs text-stone mt-1">{selectedOpp.department} \u2022 Rank #{selectedOpp.rank}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-stone block mb-1">Business problem</span>
                    <span className="text-ink">{selectedOpp.businessProblem}</span>
                  </div>
                  <div>
                    <span className="text-xs text-stone block mb-1">Root cause</span>
                    <span className="text-ink">{selectedOpp.rootCause}</span>
                  </div>
                  <div>
                    <span className="text-xs text-stone block mb-1">Current impact</span>
                    <span className="text-ink">{selectedOpp.currentImpact}</span>
                  </div>
                  <div>
                    <span className="text-xs text-stone block mb-1">Recommended intervention</span>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded border font-medium ${
                      selectedOpp.intervention.type === "AI" ? "border-purple-200 text-purple-700 bg-purple-50" :
                      selectedOpp.intervention.type === "Deterministic Software" ? "border-blue-200 text-blue-700 bg-blue-50" :
                      selectedOpp.intervention.type === "Process Redesign" ? "border-amber-200 text-amber-700 bg-amber-50" :
                      selectedOpp.intervention.type === "Human Work" ? "border-gray-200 text-gray-700 bg-gray-50" :
                      selectedOpp.intervention.type === "Hybrid" ? "border-green-200 text-green-700 bg-green-50" :
                      "border-stone-200 text-stone-500 bg-stone-50"
                    }`}>
                      {selectedOpp.intervention.type}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex flex-wrap gap-6 text-xs">
                    <div>
                      <span className="text-stone block">Expected impact</span>
                      <span className="text-ink font-medium">{selectedOpp.intervention.expectedImpact}</span>
                    </div>
                    <div>
                      <span className="text-stone block">Time to value</span>
                      <span className="text-ink font-medium">{selectedOpp.intervention.timeToValue}</span>
                    </div>
                    <div>
                      <span className="text-stone block">Effort</span>
                      <span className="text-ink font-medium">{selectedOpp.intervention.implementationEffort}</span>
                    </div>
                    <div>
                      <span className="text-stone block">Confidence</span>
                      <span className="text-ink font-medium">{selectedOpp.intervention.confidence}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <EvidenceDisplay
                    evidence={selectedOpp.evidence}
                    assumptions={selectedOpp.assumptions}
                    whyChose={selectedOpp.intervention.rejectionRationale}
                    whyRejected={selectedOpp.whyAlternativesRejected}
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
                  {selectedOpp.name} \u2022 {selectedOpp.department}
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
                  {selectedOpp.name} \u2022 {selectedOpp.department}
                </p>
                <ImplementationBlueprintView
                  blueprint={buildMockBlueprint(selectedOpp)}
                />
              </div>
            )}

            {view === "blueprint" && !selectedOpp && (
              <div className="bg-white border border-border rounded-lg p-12 text-center">
                <p className="text-sm text-stone">Select an opportunity to view its Implementation Blueprint</p>
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