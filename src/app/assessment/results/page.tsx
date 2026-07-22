"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { site } from "@/content/site";
import type { OpportunityMap } from "@/types";
import { OpportunityCard } from "@/components/home/opportunity-card";

const STORAGE_KEY = "compass-assessment-session";

export default function ResultsPage() {
  const router = useRouter();
  const supabase = useMemo(() => typeof window !== "undefined" ? createClient() : null, []);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [opportunityMap, setOpportunityMap] = useState<OpportunityMap | null>(null);
  const [pipelineStatus, setPipelineStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadResults() {
      try {
        const stored = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
        if (!stored) {
          // No session found at all — redirect to assessment
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
          // Load existing map and its opportunities
          const map = existingMaps[0];
          const { data: opportunities } = await (supabase as any)
            .from("opportunities")
            .select("*")
            .eq("opportunity_map_id", map.id)
            .order("rank", { ascending: true });

          setOpportunityMap({
            mapId: map.id,
            companyName: map.company_name,
            generatedAt: map.created_at,
            executiveSummary: map.executive_summary,
            rankings: (opportunities || []).map((opp: any) => ({
              rank: opp.rank,
              department: opp.department,
              name: opp.title,
              confidence: opp.confidence,
              description: opp.problem,
              kpis: [],
              phases: [],
              evidence: [],
              tradeoff: "",
            })),
            implementationSequencing: map.implementation_sequencing,
            crossOpportunityDependencies: map.cross_opportunity_dependencies,
          });
          setReady(true);
          setLoading(false);
          return;
        }

        // No map found — run the pipeline
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
          generatedAt: result.generatedAt,
          executiveSummary: result.executiveSummary,
          rankings: (result.opportunities || []).map((opp: any, i: number) => ({
            rank: i + 1,
            department: opp.candidate.department,
            name: opp.candidate.title,
            confidence: opp.confidence.level,
            description: opp.candidate.problemStatement,
            kpis: [],
            phases: [],
            evidence: (opp.candidate.evidenceIds || []).map((id: string) => ({
              type: "Research" as const,
              source: "Pipeline analysis",
              detail: id,
            })),
            tradeoff: opp.disqualifiers?.join("; ") || "",
          })),
          implementationSequencing: result.implementationSequencing,
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
            <p className="text-stone text-sm">Loading your AI Opportunity Map...</p>
          )}
        </div>
      </div>
    );
  }

  if (opportunityMap && opportunityMap.rankings.length === 0) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-heading font-bold text-ink">{site.results.headline}</h1>
          <p className="mt-4 text-body text-stone">{site.results.noResults}</p>
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
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-heading font-bold text-ink">
            {opportunityMap?.companyName || site.results.headline}
          </h1>
          <p className="mt-2 text-sm text-stone">
            AI Opportunity Map generated {new Date(opportunityMap?.generatedAt || "").toLocaleDateString()}
          </p>
          {opportunityMap?.executiveSummary && (
            <div className="mt-6 bg-mist rounded-lg p-6 text-left">
              <h2 className="font-semibold text-ink mb-2">Executive Summary</h2>
              <p className="text-sm text-stone mb-2">{opportunityMap.executiveSummary.finding}</p>
              <p className="text-sm font-medium text-forest">
                Recommended focus: {opportunityMap.executiveSummary.recommendedFocus}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {opportunityMap?.rankings.map((opp) => (
            <OpportunityCard key={opp.rank} opportunity={opp} />
          ))}
        </div>

        {opportunityMap?.implementationSequencing && (
          <div className="mt-10">
            <h2 className="text-subhead font-semibold text-ink mb-4">Implementation Roadmap</h2>
            <p className="text-sm text-stone mb-4">
              Strategy: {opportunityMap.implementationSequencing.strategy}
            </p>
            <div className="space-y-4">
              {opportunityMap.implementationSequencing.phases.map((phase) => (
                <div key={phase.phase} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-ink">{phase.name}</h3>
                    <span className="text-xs text-stone">{phase.estimatedDuration}</span>
                  </div>
                  <p className="text-sm text-stone">{phase.description}</p>
                  {phase.opportunities && phase.opportunities.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {phase.opportunities.map((opp: any) => (
                        <span key={opp.rank} className="text-xs bg-mist text-forest px-2 py-1 rounded">
                          {opp.title || opp.rank}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={() => {
              fetch("/api/assessment/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  mapId: opportunityMap?.mapId,
                  action: "feedback_page_viewed",
                }),
              }).catch(() => {});
            }}
            className="text-sm text-stone underline"
          >
            {site.results.buildBrief}
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-forest underline"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
