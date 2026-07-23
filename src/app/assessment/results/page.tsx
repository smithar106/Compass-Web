"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { sampleOpportunityMap } from "@/data/mock-results";
import { site } from "@/content/site";
import { EvidenceDisplay } from "@/components/evidence/evidence-display";
import { ImplementationPlanView } from "@/components/blueprint/implementation-plan";
import type { Opportunity, ImplementationBlueprint } from "@/types";

const pathLabel: Record<string, string> = {
  AI: "AI",
  "Deterministic Software": "Software",
  "Process Redesign": "Process",
  "Human Work": "Human",
  Hybrid: "Hybrid",
  "No Action": "Not ready",
};

const pathBadge: Record<string, string> = {
  AI: "border-purple-200 text-purple-700 bg-purple-50",
  "Deterministic Software": "border-blue-200 text-blue-700 bg-blue-50",
  "Process Redesign": "border-amber-200 text-amber-700 bg-amber-50",
  "Human Work": "border-gray-200 text-gray-700 bg-gray-50",
  Hybrid: "border-green-200 text-green-700 bg-green-50",
  "No Action": "border-stone-200 text-stone-500 bg-stone-50",
};

const confidenceColor: Record<string, string> = {
  High: "text-green-700",
  Medium: "text-amber-700",
  Low: "text-red-700",
};

const confidenceBadge: Record<string, string> = {
  High: "bg-green-50 text-green-700 border-green-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-red-50 text-red-700 border-red-200",
};

function buildMockBlueprint(opp: Opportunity): ImplementationBlueprint {
  return {
    problem: opp.businessProblem,
    rootCause: opp.rootCause,
    recommendedIntervention: opp.intervention,
    alternativesConsidered: opp.whyAlternativesRejected,
    whyThisPathWon: opp.intervention.rejectionRationale,
    currentWorkflow: opp.workflow
      ? opp.workflow.split(". ")
      : opp.description.split(". "),
    futureWorkflow: [
      `${opp.intervention.title} handles ${
        opp.intervention.type === "AI"
          ? "80-90%"
          : opp.intervention.type === "Deterministic Software"
            ? "60-70%"
            : "50-70%"
      } of routine work`,
      `Human team focuses on ${
        opp.intervention.humanOversight.includes("Human-in-the-loop")
          ? "decisions and exceptions"
          : "strategic work"
      }`,
      `Estimated ${opp.intervention.timeToValue} to first measurable outcome`,
    ],
    requiredSystems: [
      opp.department === "Sales"
        ? "CRM"
        : opp.department === "Customer Success"
          ? "Product analytics"
          : "Current toolchain",
    ],
    requiredApis: ["REST API integration", "Webhook event handlers"],
    requiredData: ["Historical process data", "Current workflow documentation"],
    humanRoles: [`${opp.department} team members`],
    ownership: opp.requiredOwner || `${opp.department} leadership`,
    securityAndPrivacy: [
      "Data access controls needed",
      "Review sensitive data handling",
    ],
    rolloutPlan: [
      "Phase 1: Setup and integration",
      "Phase 2: Pilot with subset",
      "Phase 3: Full rollout",
      "Phase 4: Monitor and optimize",
    ],
    validationPlan: [
      "Run pilot with 20% of cases",
      "Compare metrics to baseline",
      "Adjust thresholds before full rollout",
    ],
    successMetrics: [
      opp.intervention.expectedImpact,
      ...(opp.successDescription ? [opp.successDescription] : []),
    ],
    risksAndAssumptions: opp.assumptions.map(
      (a) => `${a.assumption} (${a.confidence})`,
    ),
    expectedImpact: opp.intervention.expectedImpact,
    technicalEscalationLevel:
      opp.intervention.implementationEffort === "Medium-High" ||
      opp.intervention.implementationEffort === "High"
        ? "Needs engineering team"
        : "Department-level implementation",
    sections: [],
  };
}

function buildBulletReasons(opp: Opportunity): string[] {
  const reasons: string[] = [];
  const impact = opp.businessImpact?.estimatedImpact;
  if (impact) reasons.push(`Estimated ${impact}`);

  const shortImpact = opp.intervention.expectedImpact?.split(",")[0]?.trim();
  if (shortImpact && !reasons.some((r) => r.includes(shortImpact)))
    reasons.push(shortImpact);

  reasons.push(`Implementation timeline: ${opp.intervention.timeToValue}`);

  if (
    opp.confidence === "High" ||
    opp.intervention.confidence === "High"
  )
    reasons.push("High confidence — strong evidence supports this path");

  const rationaleLines = opp.intervention.rejectionRationale
    .split(". ")
    .filter(Boolean);
  const bestLine = rationaleLines.find(
    (l) =>
      l.toLowerCase().includes("balance") ||
      l.toLowerCase().includes("best") ||
      l.toLowerCase().includes("sufficient") ||
      l.toLowerCase().includes("transparent"),
  );
  if (bestLine) reasons.push(bestLine);

  return reasons.slice(0, 5);
}

function getAnnualImpact(opp: Opportunity): string {
  if (opp.businessImpact?.estimatedImpact) {
    const v = opp.businessImpact.estimatedImpact;
    if (v.includes("$")) return v;
    return v;
  }
  const fromIntervention = opp.intervention.expectedImpact;
  const dollarMatch = fromIntervention.match(/\$[\dKMB.–-]+/);
  return dollarMatch ? dollarMatch[0] : "See details";
}

function DetailPanel({
  opp,
  onClose,
  onViewBlueprint,
}: {
  opp: Opportunity;
  onClose: () => void;
  onViewBlueprint: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-ink/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white border-l border-border shadow-xl overflow-y-auto animate-fadeIn">
        <div className="sticky top-0 z-10 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink">{opp.name}</h2>
            <p className="text-xs text-stone">
              Rank #{opp.rank} &middot; {opp.department}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-mist text-stone hover:text-ink transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <section>
            <h3 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">
              Why this option ranked #{opp.rank}
            </h3>
            <p className="text-sm text-ink leading-relaxed">
              {opp.intervention.rejectionRationale ||
                `This intervention scored highest across impact, feasibility, and risk criteria for the ${opp.department} department.`}
            </p>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">
              Expected impact
            </h3>
            <div className="bg-mist rounded-lg p-4 space-y-2">
              <p className="text-sm text-ink font-medium">
                {opp.intervention.expectedImpact}
              </p>
              {opp.businessImpact?.estimatedImpact && (
                <p className="text-sm text-forest font-semibold">
                  {opp.businessImpact.estimatedImpact}
                </p>
              )}
              {opp.successDescription && (
                <p className="text-xs text-stone">
                  {opp.successDescription}
                </p>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">
              Evidence
            </h3>
            <EvidenceDisplay
              evidence={opp.evidence}
              assumptions={[]}
              whyChose=""
              whyRejected=""
            />
          </section>

          <section>
            <h3 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">
              Key assumptions
            </h3>
            <div className="space-y-2">
              {opp.assumptions.map((a, i) => (
                <div
                  key={i}
                  className="border border-amber-200 bg-amber-50/30 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-ink font-medium">
                      {a.assumption}
                    </p>
                    <span
                      className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                        confidenceBadge[a.confidence] ||
                        "bg-stone-50 text-stone-500 border-stone-200"
                      }`}
                    >
                      {a.confidence}
                    </span>
                  </div>
                  <p className="text-xs text-stone mt-0.5">
                    <span className="font-medium">Impact if wrong: </span>
                    {a.impact}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">
              Required conditions
            </h3>
            <div className="bg-mist/50 rounded-lg p-4">
              {opp.technicalHelpRequired && (
                <p className="text-sm text-stone mb-2">
                  {opp.technicalHelpRequired}
                </p>
              )}
              {opp.requiredOwner && (
                <p className="text-xs text-stone">
                  <span className="font-medium">Owner: </span>
                  {opp.requiredOwner}
                </p>
              )}
              {opp.dependencies && opp.dependencies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {opp.dependencies.map((d, i) => (
                    <span
                      key={i}
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        d.status === "Available"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {d.dependency} ({d.status})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">
              Main risks
            </h3>
            {opp.risks && opp.risks.length > 0 ? (
              <div className="space-y-2">
                {opp.risks.map((r, i) => (
                  <div
                    key={i}
                    className="border border-red-100 bg-red-50/30 rounded-lg p-3"
                  >
                    <p className="text-xs text-ink font-medium">{r.risk}</p>
                    <div className="flex gap-3 mt-1 text-[10px] text-stone">
                      <span>Likelihood: {r.likelihood}</span>
                      <span>Impact: {r.impact}</span>
                    </div>
                    {r.mitigation && (
                      <p className="text-xs text-stone mt-1">
                        <span className="font-medium">Mitigation: </span>
                        {r.mitigation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone italic">
                No significant risks identified at this stage.
              </p>
            )}
          </section>

          <section>
            <h3 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">
              Why it beat alternatives
            </h3>
            <div className="bg-forest/5 border border-forest/10 rounded-lg p-4">
              <p className="text-sm text-stone leading-relaxed">
                {opp.whyAlternativesRejected ||
                  opp.intervention.rejectionRationale ||
                  "This path was chosen as the best fit for this specific business problem and workflow."}
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">
              Implementation outline
            </h3>
            <div className="bg-mist/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-stone">
                <span className="font-medium text-ink">Timeline:</span>
                {opp.intervention.timeToValue}
              </div>
              <div className="flex items-center gap-2 text-xs text-stone">
                <span className="font-medium text-ink">Effort:</span>
                {opp.intervention.implementationEffort}
              </div>
              <div className="flex items-center gap-2 text-xs text-stone">
                <span className="font-medium text-ink">Oversight:</span>
                {opp.intervention.humanOversight}
              </div>
              <button
                onClick={onViewBlueprint}
                className="mt-3 w-full text-sm px-4 py-2 bg-forest text-white rounded-lg hover:bg-leaf transition-colors"
              >
                View full implementation plan
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  opp,
  isCompassChoice,
  onViewDetails,
  onSelectBlueprint,
}: {
  opp: Opportunity;
  isCompassChoice: boolean;
  onViewDetails: () => void;
  onSelectBlueprint: () => void;
}) {
  const reasons = useMemo(() => buildBulletReasons(opp), [opp]);
  const impact = useMemo(() => getAnnualImpact(opp), [opp]);

  return (
    <div
      className={`flex flex-col h-full rounded-xl border transition-all duration-200 bg-white ${
        isCompassChoice
          ? "border-forest ring-2 ring-forest/20 shadow-lg scale-[1.02] lg:scale-105"
          : "border-border hover:border-forest/40 shadow-sm hover:shadow-md"
      }`}
    >
      {isCompassChoice && (
        <div className="flex items-center gap-1.5 px-5 pt-4 pb-0">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-forest text-cream text-[10px] font-semibold uppercase tracking-wider">
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Compass&apos; Choice
          </span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-forest">
            Rank #{opp.rank}
          </span>
          {!isCompassChoice && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded border font-medium ${
                pathBadge[opp.intervention.type] || ""
              }`}
            >
              {pathLabel[opp.intervention.type] || opp.intervention.type}
            </span>
          )}
        </div>

        {isCompassChoice && (
          <div className="mb-2">
            <span
              className={`text-xs px-1.5 py-0.5 rounded border font-medium ${
                pathBadge[opp.intervention.type] || ""
              }`}
            >
              {pathLabel[opp.intervention.type] || opp.intervention.type}
            </span>
          </div>
        )}

        <h3 className="text-base font-semibold text-ink mb-1">
          {opp.intervention.title}
        </h3>

        <p className="text-xs text-stone leading-relaxed mb-4">
          {opp.intervention.description}
        </p>

        <div className="border-t border-border pt-3 mb-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
          <div>
            <span className="text-stone/70 block">Annual impact</span>
            <span className="text-ink font-semibold text-sm">{impact}</span>
          </div>
          <div>
            <span className="text-stone/70 block">Timeline</span>
            <span className="text-ink font-medium">
              {opp.intervention.timeToValue}
            </span>
          </div>
          <div>
            <span className="text-stone/70 block">Complexity</span>
            <span className="text-ink font-medium">
              {opp.intervention.implementationEffort === "Low-Medium" ||
              opp.intervention.implementationEffort === "Low"
                ? "Low"
                : opp.intervention.implementationEffort === "Medium-High" ||
                    opp.intervention.implementationEffort === "High"
                  ? "High"
                  : "Moderate"}
            </span>
          </div>
          <div>
            <span className="text-stone/70 block">Confidence</span>
            <span
              className={`font-medium ${
                confidenceColor[opp.confidence] ||
                confidenceColor[opp.intervention.confidence] ||
                "text-stone"
              }`}
            >
              {opp.confidence || opp.intervention.confidence}
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-3 mb-4">
          <span className="text-[10px] font-semibold text-stone uppercase tracking-wider block mb-1.5">
            Why this option
          </span>
          <ul className="space-y-1">
            {reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs">
                <span className="w-1 h-1 rounded-full bg-forest mt-1.5 flex-shrink-0" />
                <span className="text-stone">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto space-y-2">
          <button
            onClick={onViewDetails}
            className={`w-full text-sm px-4 py-2 rounded-lg border transition-colors ${
              isCompassChoice
                ? "bg-forest text-white border-forest hover:bg-leaf"
                : "border-forest text-forest hover:bg-mist"
            }`}
          >
            View details
          </button>
        </div>
      </div>

      {isCompassChoice && (
        <div className="px-5 pb-4">
          <button
            onClick={onSelectBlueprint}
            className="w-full text-sm px-4 py-2 border border-forest/30 text-forest rounded-lg hover:bg-mist transition-colors"
          >
            View implementation plan
          </button>
        </div>
      )}
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const isExample = searchParams.get("example") === "true";
  const [detailOppRank, setDetailOppRank] = useState<number | null>(null);
  const [view, setView] = useState<"cards" | "blueprint">("cards");

  const map = isExample ? sampleOpportunityMap : null;
  const allOpportunities = map?.rankings || [];

  const rankedOpps = useMemo(
    () =>
      allOpportunities
        .filter((o) => o.rank >= 1 && o.rank <= 3)
        .sort((a, b) => b.rank - a.rank),
    [allOpportunities],
  );

  const compassChoice = useMemo(
    () => allOpportunities.find((o) => o.rank === 1) || null,
    [allOpportunities],
  );

  const detailOpp = useMemo(
    () =>
      detailOppRank
        ? allOpportunities.find((o) => o.rank === detailOppRank) || null
        : null,
    [detailOppRank, allOpportunities],
  );

  if (!map) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-heading font-bold text-ink">
            {site.results.headline}
          </h1>
          <p className="mt-4 text-body text-stone">
            {site.results.noResults}
          </p>
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

  if (view === "blueprint" && compassChoice) {
    return (
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => setView("cards")}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-forest hover:text-leaf font-medium transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to recommendations
          </button>
          <h1 className="text-heading font-bold text-ink mb-1">
            Implementation Plan
          </h1>
          <p className="text-sm text-stone mb-6">
            {compassChoice.name} &middot; {compassChoice.department}
          </p>
          <ImplementationPlanView
            blueprint={buildMockBlueprint(compassChoice)}
          />
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
          <h1 className="text-heading font-bold text-ink">
            {site.results.headline}
          </h1>
          <p className="mt-2 text-body text-stone">
            {site.results.subtitle}
          </p>
        </div>

        <div className="bg-forest text-white rounded-xl p-6 mb-10">
          <p className="text-sm text-leaf font-medium mb-1">
            {map.executiveSummary.headline}
          </p>
          <p className="text-sm leading-relaxed text-cream/90">
            {map.executiveSummary.finding}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-cream/80">
            <span>
              Recommended focus: {map.executiveSummary.recommendedFocus}
            </span>
            <span>Quick wins: {map.executiveSummary.quickWins}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {rankedOpps.map((opp) => {
            const isFirst = opp.rank === 1;
            return (
              <div
                key={opp.rank}
                className={
                  isFirst
                    ? "md:order-3 md:col-span-1"
                    : opp.rank === 2
                      ? "md:order-2 md:col-span-1"
                      : "md:order-1 md:col-span-1"
                }
              >
                <ResultCard
                  opp={opp}
                  isCompassChoice={isFirst}
                  onViewDetails={() => setDetailOppRank(opp.rank)}
                  onSelectBlueprint={() => {
                    if (isFirst) setView("blueprint");
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setView("blueprint")}
            className="px-8 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors shadow-sm"
          >
            Accept and proceed to implementation plan
          </button>
          <a
            href="/assessment"
            className="px-8 py-3 border border-border text-stone text-sm font-medium rounded-lg hover:border-forest/40 hover:text-ink transition-colors"
          >
            Revisit your submission
          </a>
        </div>
      </div>

      {detailOpp && (
        <DetailPanel
          opp={detailOpp}
          onClose={() => setDetailOppRank(null)}
          onViewBlueprint={() => {
            setDetailOppRank(null);
            setView("blueprint");
          }}
        />
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[50vh]">
          <div className="text-stone text-sm">Loading...</div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
