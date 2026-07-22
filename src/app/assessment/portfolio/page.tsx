"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { PortfolioBoard } from "@/components/assessment/portfolio-board";
import { site } from "@/content/site";
import type { EnrichedOpportunity, EnrichedOpportunityMap } from "@/types/pipeline";

const STORAGE_KEY = "compass-assessment-session";

export default function PortfolioPage() {
  const router = useRouter();
  const supabase = useMemo(() => typeof window !== "undefined" ? createClient() : null, []);
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<EnrichedOpportunity[]>([]);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const stored = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
        if (!stored || !supabase) {
          setLoading(false);
          return;
        }

        const session = JSON.parse(stored);
        if (!session.sessionId) {
          setLoading(false);
          return;
        }

        setHasSession(true);

        const { data: maps } = await (supabase as any)
          .from("opportunity_maps")
          .select("*")
          .eq("assessment_session_id", session.sessionId)
          .order("created_at", { ascending: false })
          .limit(1);

        if (maps && maps.length > 0) {
          const { data: opps } = await (supabase as any)
            .from("opportunities")
            .select("*")
            .eq("opportunity_map_id", maps[0].id)
            .order("rank", { ascending: true });

          if (opps) {
            setOpportunities(opps.map((opp: any) => ({
              candidate: {
                id: `opp-${opp.rank}`,
                title: opp.title,
                problemStatement: opp.problem || "",
                targetWorkflow: "",
                department: opp.department,
                businessObjective: "",
                proposedSystemType: opp.business_impact?.impactType || "",
                detectedSignals: [],
                requiredCapabilities: [],
                dependencies: (opp.dependencies || []).map((d: any) => d.dependency),
                risks: (opp.risks || []).map((r: any) => r.risk),
                evidenceIds: opp.evidence?.evidenceIds || [],
                candidateSource: "blueprint",
              },
              tier: opp.tier || 2,
              sequence: opp.rank,
              recommendation: opp.recommendation || "validate_next",
              feasibility: { score: 0, maxScore: 10, label: "pass", details: [] },
              businessLeverage: { score: 0, maxScore: 10, label: "pass", details: [] },
              implementationReadiness: { score: 0, maxScore: 10, label: "pass", details: [] },
              strategicAlignment: { score: 0, maxScore: 10, label: "pass", details: [] },
              confidence: { level: opp.confidence || "Medium", score: 0.6, dimensions: { sourceAuthority: 0.6, dataFreshness: 0.8, directness: 0.6, consistency: 0.6, specificity: 0.6 }, reasoning: [] },
              evidenceIds: opp.evidence?.evidenceIds || [],
              dependencies: (opp.dependencies || []).map((d: any) => d.dependency),
              disqualifiers: [],
              reasoningTraceId: "",
            })));
          }
        }
      } catch (err) {
        console.error("Failed to load portfolio:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [supabase]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-heading font-bold text-ink">{site.portfolio.headline}</h1>
          <p className="mt-2 text-body text-stone">{site.portfolio.subtitle}</p>
        </div>

        {!hasSession && (
          <div className="text-center py-16 border border-border rounded-lg bg-white">
            <p className="text-stone text-sm mb-4">{site.portfolio.noResults}</p>
            <Link
              href="/assessment"
              className="inline-flex items-center px-6 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
            >
              Begin organizational discovery
            </Link>
          </div>
        )}

        {hasSession && opportunities.length === 0 && (
          <div className="text-center py-16 border border-border rounded-lg bg-white">
            <p className="text-stone text-sm mb-4">Your portfolio is empty. Complete an organizational discovery first.</p>
            <Link
              href="/assessment"
              className="inline-flex items-center px-6 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
            >
              Start discovery
            </Link>
          </div>
        )}

        {opportunities.length > 0 && (
          <PortfolioBoard opportunities={opportunities} />
        )}
      </div>
    </div>
  );
}
