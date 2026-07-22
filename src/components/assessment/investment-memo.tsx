"use client";

import { useState } from "react";
import type { EnrichedOpportunityMap, EnrichedOpportunity, EvidenceRecord } from "@/types/pipeline";
import { OpportunityCardV2 } from "@/components/assessment/opportunity-card-v2";
import { PortfolioBoard } from "@/components/assessment/portfolio-board";
import { OrgIntelligenceView } from "@/components/assessment/org-intelligence";
import { WhyNotPanel } from "@/components/assessment/why-not-panel";
import { cn } from "@/lib/utils";

interface InvestmentMemoProps {
  map: EnrichedOpportunityMap;
  showPortfolio?: boolean;
  showIntelligence?: boolean;
}

type Tab = "executive-summary" | "portfolio" | "opportunities" | "intelligence";

export function InvestmentMemoView({ map, showPortfolio = true, showIntelligence = true }: InvestmentMemoProps) {
  const [activeTab, setActiveTab] = useState<Tab>("executive-summary");

  const tabs: { id: Tab; label: string }[] = [
    { id: "executive-summary", label: "Executive Summary" },
    { id: "opportunities", label: `Opportunities (${map.opportunities.length})` },
    ...(showPortfolio ? [{ id: "portfolio" as const, label: "AI Portfolio" }] : []),
    ...(showIntelligence ? [{ id: "intelligence" as const, label: "Organizational Intelligence" }] : []),
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-stone uppercase tracking-wider">AI Opportunity Intelligence</span>
          <span className="text-xs text-stone">|</span>
          <span className="text-xs text-stone">Pipeline v{map.pipelineVersion}</span>
          <span className="text-xs text-stone">|</span>
          <span className="text-xs text-stone">Generated {new Date(map.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
        <h1 className="text-display font-bold text-ink">{map.executiveSummary.headline}</h1>
        {(map as any).companyName && (
          <p className="mt-2 text-sm text-stone">For: {(map as any).companyName}</p>
        )}
      </div>

      {/* Tab navigation */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id ? "border-forest text-forest" : "border-transparent text-stone hover:text-ink"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "executive-summary" && (
        <ExecutiveSummaryTab map={map} />
      )}

      {activeTab === "opportunities" && (
        <OpportunitiesTab map={map} />
      )}

      {activeTab === "portfolio" && (
        <div>
          <h2 className="text-heading font-bold text-ink mb-2">AI Portfolio</h2>
          <p className="text-body text-stone mb-6">
            Your ranked portfolio of AI opportunities. Track implementation status, compare tradeoffs, and plan sequencing.
          </p>
          <PortfolioBoard opportunities={map.opportunities} />
        </div>
      )}

      {activeTab === "intelligence" && (
        <OrgIntelligenceView profile={(map as any).organizationalIntelligence} />
      )}
    </div>
  );
}

function ExecutiveSummaryTab({ map }: { map: EnrichedOpportunityMap }) {
  const featured = map.opportunities[0];
  const tier1 = map.opportunities.filter((o) => o.tier === 1);
  const tier2 = map.opportunities.filter((o) => o.tier === 2);

  return (
    <div className="space-y-6">
      {/* Finding */}
      <div className="bg-mist border border-mist rounded-lg p-6">
        <h2 className="font-semibold text-ink mb-2">Key Finding</h2>
        <p className="text-sm text-stone leading-relaxed">{map.executiveSummary.finding}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatBox label="Tier 1 (Build Now)" value={tier1.length.toString()} color="text-forest" />
        <StatBox label="Tier 2 (Validate)" value={tier2.length.toString()} color="text-blue-600" />
        <StatBox label="Total Opportunities" value={map.opportunities.length.toString()} color="text-ink" />
        <StatBox label="Quick Wins" value={map.executiveSummary.quickWins.toString()} color="text-forest" />
      </div>

      {/* Recommended focus */}
      <div className="bg-white border border-border rounded-lg p-5">
        <h2 className="font-semibold text-ink mb-2">Recommended Focus</h2>
        <p className="text-sm text-forest font-medium">{map.executiveSummary.recommendedFocus}</p>
        {map.executiveSummary.strategicValue && (
          <p className="mt-2 text-sm text-stone">{map.executiveSummary.strategicValue}</p>
        )}
      </div>

      {/* Featured opportunity */}
      {featured && (
        <div>
          <h2 className="font-semibold text-ink mb-3">Top Recommendation</h2>
          <OpportunityCardV2 opportunity={featured} evidence={map.evidence} rank={1} />
        </div>
      )}

      {/* Implementation sequencing */}
      {map.implementationSequencing && (
        <div>
          <h2 className="font-semibold text-ink mb-3">Implementation Roadmap</h2>
          <p className="text-sm text-stone mb-4">Strategy: {map.implementationSequencing.strategy}</p>
          <div className="space-y-4">
            {map.implementationSequencing.phases.map((phase) => (
              <div key={phase.phase} className="border border-border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center text-xs font-medium">
                      {phase.phase}
                    </span>
                    <h3 className="font-medium text-ink">{phase.name}</h3>
                  </div>
                  <span className="text-xs text-stone">{phase.estimatedDuration}</span>
                </div>
                <p className="text-sm text-stone">{phase.description}</p>
                {phase.opportunityIds.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {phase.opportunityIds.map((id) => {
                      const opp = map.opportunities.find((o) => o.candidate.id === id);
                      return opp ? (
                        <span key={id} className="text-xs bg-mist text-forest px-2 py-1 rounded">
                          {opp.candidate.title}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why Not */}
      {(map as any).whyNot && (map as any).whyNot.length > 0 && (
        <WhyNotPanel opportunities={(map as any).whyNot} />
      )}
    </div>
  );
}

function OpportunitiesTab({ map }: { map: EnrichedOpportunityMap }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-stone mb-4">
        Ranked, evidence-backed opportunities with investment memos. Each recommendation includes business case, implementation options, and confidence scoring.
      </p>
      {map.opportunities.map((opp, i) => (
        <OpportunityCardV2 key={opp.candidate.id} opportunity={opp} evidence={map.evidence} rank={i + 1} />
      ))}

      {/* Why Not */}
      {(map as any).whyNot && (map as any).whyNot.length > 0 && (
        <WhyNotPanel opportunities={(map as any).whyNot} />
      )}
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="border border-border rounded-lg p-4 bg-white text-center">
      <p className={cn("text-2xl font-bold", color)}>{value}</p>
      <p className="text-xs text-stone mt-1">{label}</p>
    </div>
  );
}
