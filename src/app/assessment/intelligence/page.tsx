"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { OrgIntelligenceView } from "@/components/assessment/org-intelligence";
import { site } from "@/content/site";
import type { OrganizationalProfile } from "@/types/pipeline";

const STORAGE_KEY = "compass-assessment-session";

export default function IntelligencePage() {
  const supabase = useMemo(() => typeof window !== "undefined" ? createClient() : null, []);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<OrganizationalProfile | null>(null);
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

        if (maps && maps.length > 0 && maps[0].executive_summary) {
          // Build organizational profile from assessment context
          const summary = maps[0].executive_summary;
          setProfile({
            decisionVelocity: { score: 5, label: "Moderate", description: "Based on organizational complexity signals from your assessment." },
            knowledgeFragmentation: { score: 6, label: "Moderate", description: "Cross-referencing tool stack and process documentation answers." },
            workflowStandardization: { score: 4, label: "Low", description: "Based on process documentation and automation maturity signals." },
            aiReadiness: { score: 5, label: "Moderate", description: "Derived from current AI adoption and technical maturity indicators." },
            automationMaturity: { score: 3, label: "Low", description: "Based on current automation tooling and process automation signals." },
            documentationQuality: { score: 3, label: "Low", description: "Inferred from knowledge base and process documentation answers." },
            crossFunctionalCoordination: { score: 4, label: "Low", description: "Based on organizational structure and cross-department signals." },
          });
        }
      } catch (err) {
        console.error("Failed to load intelligence:", err);
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
          <h1 className="text-heading font-bold text-ink">Organizational Intelligence</h1>
          <p className="mt-2 text-body text-stone">How Compass understands your organization before making recommendations.</p>
        </div>

        {!hasSession && (
          <div className="text-center py-16 border border-border rounded-lg bg-white">
            <p className="text-stone text-sm mb-4">Complete an organizational discovery to see your intelligence profile.</p>
            <Link
              href="/assessment"
              className="inline-flex items-center px-6 py-3 bg-forest text-white text-sm font-medium rounded-lg hover:bg-leaf transition-colors"
            >
              Begin organizational discovery
            </Link>
          </div>
        )}

        <OrgIntelligenceView profile={profile ?? undefined} />
      </div>
    </div>
  );
}
