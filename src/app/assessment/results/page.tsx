"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { InvestmentMemoView } from "@/components/assessment/investment-memo";
import type { EnrichedOpportunityMap, EnrichedOpportunity } from "@/types/pipeline";

const STORAGE_KEY = "compass-assessment-session";

export default function ResultsPage() {
  const router = useRouter();
  const supabase = useMemo(() => typeof window !== "undefined" ? createClient() : null, []);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [opportunityMap, setOpportunityMap] = useState<EnrichedOpportunityMap | null>(null);
  const [pipelineStatus, setPipelineStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadResults() {
      try {
        const stored = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
        if (!stored) {
          router.replace("/assessment");
          return;
        }

        const session = JSON.parse(stored);
        if (!session.completed || !session.sessionId) {
          router.replace("/assessment");
          return;
        }

        if (!supabase) return;

        const { data: existingMaps, error: mapError } = await (supabase as any)
          .from("opportunity_maps")
          .select("*")
          .eq("assessment_session_id", session.sessionId)
          .order("created_at", { ascending: false })
          .limit(1);

        if (mapError) throw mapError;

        if (existingMaps && existingMaps.length > 0) {
          const map = existingMaps[0];
          const { data: opportunities } = await (supabase as any)
            .from("opportunities")
            .select("*")
            .eq("opportunity_map_id", map.id)
            .order("rank", { ascending: true });

          setOpportunityMap(buildEnrichedMap(map, (opportunities || [])));
          setReady(true);
          setLoading(false);
          return;
        }

        setPipelineStatus("Analyzing company and workflows");
        setLoading(true);

        const response = await fetch("/api/pipeline/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: session.sessionId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Pipeline execution failed");
        }

        const result = await response.json();

        setOpportunityMap({
          mapId: result.mapId,
          companyName: result.companyName,
          assessmentSessionId: result.assessmentSessionId,
          generatedAt: result.generatedAt,
          pipelineVersion: result.pipelineVersion,
          executiveSummary: result.executiveSummary,
          opportunities: (result.opportunities || []).map((opp: any, i: number) => ({
            ...opp,
            rank: i + 1,
          })),
          implementationSequencing: result.implementationSequencing,
          evidence: result.evidence || [],
          generationMetadata: result.generationMetadata,
          whyNot: result.whyNot || [],
        });
        setReady(true);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load results");
      } finally {
        setLoading(false);
        setPipelineStatus(null);
      }
    }

    loadResults();
  }, [router, supabase]);

  if (!ready) {
    return (
      <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          {pipelineStatus && (
            <div className="mb-4">
              <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-stone text-sm">{pipelineStatus}</p>
            </div>
          )}
          {loadError && (
            <div>
              <p className="text-red-600 text-sm mb-4">{loadError}</p>
              <button
                onClick={() => router.push("/assessment")}
                className="text-forest text-sm underline"
              >
                Return to assessment
              </button>
            </div>
          )}
          {!pipelineStatus && !loadError && (
            <p className="text-stone text-sm">Loading your AI Opportunity Portfolio...</p>
          )}
        </div>
      </div>
    );
  }

  if (opportunityMap && opportunityMap.opportunities.length === 0) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-heading font-bold text-ink">AI Opportunity Portfolio</h1>
          <p className="mt-4 text-body text-stone">No opportunities identified. Your assessment may need more detailed responses.</p>
          <button
            onClick={() => router.push("/assessment")}
            className="mt-8 px-6 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
          >
            Retake assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {opportunityMap && <InvestmentMemoView map={opportunityMap} />}
      </div>
    </div>
  );
}

function buildEnrichedMap(mapRecord: any, opportunities: any[]): EnrichedOpportunityMap {
  return {
    mapId: mapRecord.id,
    companyName: mapRecord.company_name || "Organization",
    assessmentSessionId: mapRecord.assessment_session_id,
    generatedAt: mapRecord.created_at,
    pipelineVersion: "1.0.0",
    executiveSummary: mapRecord.executive_summary || {
      headline: "AI Opportunity Portfolio",
      finding: "Analysis complete.",
      recommendedFocus: "Review opportunities below.",
      quickWins: 0,
    },
    opportunities: (opportunities || []).map((opp: any) => ({
      candidate: {
        id: `opp-${opp.rank}`,
        title: opp.title,
        problemStatement: opp.problem,
        targetWorkflow: "",
        department: opp.department,
        businessObjective: "",
        proposedSystemType: opp.business_impact?.impactType || "",
        detectedSignals: [],
        requiredCapabilities: [],
        dependencies: (opp.dependencies || []).map((d: any) => d.dependency),
        risks: (opp.risks || []).map((r: any) => r.risk),
        evidenceIds: opp.evidence?.evidenceIds || [],
        candidateSource: "blueprint" as const,
      },
      tier: opp.tier || 2,
      sequence: opp.rank,
      recommendation: opp.recommendation || "validate_next",
      feasibility: { score: 0, maxScore: 10, label: "pass" as const, details: [] },
      businessLeverage: { score: 0, maxScore: 10, label: "pass" as const, details: [] },
      implementationReadiness: { score: 0, maxScore: 10, label: "pass" as const, details: [] },
      strategicAlignment: { score: 0, maxScore: 10, label: "pass" as const, details: [] },
      confidence: { level: opp.confidence || "Medium", score: 0.6, dimensions: { sourceAuthority: 0.6, dataFreshness: 0.8, directness: 0.6, consistency: 0.6, specificity: 0.6 }, reasoning: [] },
      evidenceIds: opp.evidence?.evidenceIds || [],
      dependencies: (opp.dependencies || []).map((d: any) => d.dependency),
      disqualifiers: [],
      reasoningTraceId: "",
    })) as EnrichedOpportunity[],
    implementationSequencing: mapRecord.implementation_sequencing || { strategy: "Standard", strategyRationale: "", phases: [] },
    evidence: [],
    generationMetadata: {} as any,
  };
}
