"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { CompassChoice, type RecommendationData } from "@/components/results/compass-choice";
import { AlternativeCards } from "@/components/results/alternative-cards";
import { WhyCompassChose } from "@/components/results/why-compass-chose";
import { EvidenceTable } from "@/components/results/evidence-table";
import { NegativeEvidencePanel } from "@/components/results/negative-evidence";
import { ConfidenceMeter } from "@/components/results/confidence-meter";
import { AssumptionsRisks } from "@/components/results/assumptions-risks";
import { NextStepCTA } from "@/components/results/next-step-cta";

const STORAGE_KEY = "compass-assessment-session";
const ENGINE_VERSION = "2.0.0";
const DATASET_VERSION = "v1 (baseline)";

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="bg-white min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-lime-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Loading your AI Opportunity Portfolio...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => typeof window !== "undefined" ? createClient() : null, []);
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([]);
  const [confidenceBreakdown, setConfidenceBreakdown] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const [progressIdx, setProgressIdx] = useState(0);

  const progressMessages = [
    "Analyzing your workflow",
    "Comparing intervention paths",
    "Retrieving comparable implementations",
    "Evaluating evidence strength",
  ];

  useEffect(() => {
    const runId = searchParams?.get("run_id");
    if (runId) {
      loadExistingRun(runId);
    } else {
      runRecommendation();
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setProgressIdx((i) => Math.min(i + 1, progressMessages.length - 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [loading]);

  async function loadExistingRun(runId: string) {
    try {
      setLoading(true);
      const response = await fetch(`/api/recommendations?run_id=${runId}`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to load recommendations");
      }
      const data = await response.json();
      setRecommendations(data.recommendations || []);
      setConfidenceBreakdown(data.confidence_breakdown || {});
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load results");
    } finally {
      setLoading(false);
    }
  }

  async function runRecommendation() {
    try {
      setLoading(true);

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

      const { data: sessionData } = await supabase
        .from("assessment_sessions" as any)
        .select("*, organizations(*)")
        .eq("id", session.sessionId)
        .single();

      const { data: answers } = await supabase
        .from("assessment_answers" as any)
        .select("*")
        .eq("session_id", session.sessionId);

      const profile = extractProfile(answers || [], sessionData);

      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.sessionId,
          ...profile,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Recommendation failed");
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
      setConfidenceBreakdown(data.confidence_breakdown || {});

      const newUrl = `/assessment/results?run_id=${data.recommendation_run_id}`;
      window.history.replaceState({}, "", newUrl);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to generate recommendations");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-lime-500 rounded-full animate-spin mx-auto mb-4" />
          <div className="text-sm text-gray-400 mb-1">{progressMessages[progressIdx]}</div>
          <div className="w-full bg-gray-100 rounded-full h-1 mt-4 overflow-hidden">
            <div
              className="h-full bg-lime-500 rounded-full transition-all duration-1000"
              style={{ width: `${((progressIdx + 1) / progressMessages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-white min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-ink mb-2">Failed to Generate Recommendations</h2>
          <p className="text-sm text-gray-500 mb-6">{loadError}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setLoadError(null); runRecommendation(); }}
              className="px-5 py-2 bg-lime-500 text-white text-sm font-semibold rounded-lg hover:bg-lime-600 transition-colors border border-lime-500"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/assessment")}
              className="px-5 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-lg font-semibold text-ink mb-2">No Recommendations Generated</h2>
          <p className="text-sm text-gray-500 mb-6">Unable to generate recommendations from your assessment data.</p>
          <button
            onClick={() => router.push("/assessment")}
            className="px-5 py-2 bg-lime-500 text-white text-sm font-semibold rounded-lg hover:bg-lime-600 transition-colors border border-lime-500"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  const primary = recommendations[0];
  const alternatives = recommendations.slice(1);
  const generatedAt = new Date().toISOString();

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lime-500">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <h1 className="text-2xl font-bold text-ink">Compass Recommendation</h1>
          </div>
          <p className="text-sm text-gray-500 max-w-2xl mb-4">
            We evaluated multiple intervention strategies and identified the highest-confidence recommendation based on comparable implementations and available evidence.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
            <span>Investigation completed</span>
            <span>Engine v{ENGINE_VERSION}</span>
            <span>Dataset: {DATASET_VERSION}</span>
            <span>Generated {generatedAt}</span>
          </div>
        </div>

        <div className="mb-8">
          <CompassChoice
            recommendation={primary}
            onViewEvidence={() => setShowEvidence(!showEvidence)}
            onBlueprint={() => {}}
            onCompare={() => {
              const el = document.getElementById("alternatives-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            showEvidence={showEvidence}
          />
        </div>

        {alternatives.length > 0 && (
          <div id="alternatives-section" className="mb-10">
            <AlternativeCards alternatives={alternatives} />
          </div>
        )}

        <div className="mb-10">
          <WhyCompassChose
            why_it_ranked={primary.why_it_ranked}
            total_comparables={primary.evidence_summary.total_comparables}
            confidence_score={primary.confidence.score}
            evidence_quality={primary.evidence_summary.overall_tier}
          />
        </div>

        {showEvidence && (
          <div id="evidence-section" className="mb-10 animate-fadeIn">
            <EvidenceTable comparables={primary.comparables} />
          </div>
        )}

        {showEvidence && primary.negative_evidence.length > 0 && (
          <div className="mb-10 animate-fadeIn">
            <NegativeEvidencePanel negativeEvidence={primary.negative_evidence} />
          </div>
        )}

        <div className="mb-10">
          <ConfidenceMeter
            breakdown={confidenceBreakdown}
            confidence_explanation={primary.confidence.explanation}
          />
        </div>

        {(primary.assumptions.length > 0 || primary.risks.length > 0) && (
          <div className="mb-10">
            <AssumptionsRisks
              assumptions={primary.assumptions}
              risks={primary.risks}
            />
          </div>
        )}

        <div className="mb-8">
          <NextStepCTA title={primary.title} />
        </div>

        <div className="text-center text-[11px] text-gray-300">
          Compass AI &mdash; Evidence-driven recommendation engine
        </div>
      </div>
    </div>
  );
}

function extractProfile(answers: any[] | null, sessionData: any) {
  const answerMap = new Map<number, any>();
  for (const a of answers || []) {
    const qid = typeof a.question_id === "number" ? a.question_id : parseInt(a.question_id);
    answerMap.set(qid, a.answer_value ?? a.answer ?? a.value);
  }

  const deptPain: Record<string, number> = {
    Sales: 0, Marketing: 0, Customer_Success: 0, Support: 0,
    Finance: 0, Product: 0, Engineering: 0, People_HR: 0, Legal: 0, Operations: 0,
  };

  if (answerMap.get(1) === false || answerMap.get(1) === "No") deptPain.Sales += 8;
  if (answerMap.get(4) === false || answerMap.get(4) === "No") deptPain.Marketing += 7;
  if (answerMap.get(7) === false || answerMap.get(7) === "No") deptPain.Customer_Success += 7;
  if (answerMap.get(11) === false || answerMap.get(11) === "No") deptPain.Support += 7;
  if (answerMap.get(13) === false || answerMap.get(13) === "No") deptPain.Finance += 8;
  if (answerMap.get(15) === false || answerMap.get(15) === "No") deptPain.Product += 6;
  if (answerMap.get(17) === false || answerMap.get(17) === "No") deptPain.Engineering += 6;
  if (answerMap.get(20) === false || answerMap.get(20) === "No") deptPain.People_HR += 6;
  if (answerMap.get(22) === false || answerMap.get(22) === "No") deptPain.Legal += 6;
  if (answerMap.get(24) === false || answerMap.get(24) === "No") deptPain.Operations += 8;

  let worstDept = "Operations";
  let worstScore = -1;
  for (const [dept, score] of Object.entries(deptPain)) {
    if (score > worstScore) { worstScore = score; worstDept = dept; }
  }

  const workflowMap: Record<string, string> = {
    Sales: "lead_qualification", Marketing: "marketing_automation",
    Customer_Success: "customer_health_scoring", Support: "ticketing",
    Finance: "invoice_processing", Product: "product_analytics",
    Engineering: "ci_cd", People_HR: "onboarding", Legal: "contract_review",
    Operations: "process_automation",
  };

  const raw = answerMap.get(25);
  const desiredOutcome = typeof raw === "string"
    ? raw.toLowerCase().includes("cost") ? "cost"
    : raw.toLowerCase().includes("time") ? "time"
    : raw.toLowerCase().includes("revenue") ? "revenue"
    : raw.toLowerCase().includes("satisfaction") ? "satisfaction"
    : "efficiency"
    : "efficiency";

  const org = (sessionData as any)?.organizations;
  const deptDisplay = worstDept === "Customer_Success" ? "customer_success"
    : worstDept === "People_HR" ? "human_resources"
    : worstDept.toLowerCase();

  return {
    business_function: deptDisplay,
    workflow: workflowMap[worstDept] || "process_automation",
    problem_statement: `${worstDept} operations need optimization`,
    industry: org?.industry || "technology",
    company_size: org?.size_range || "",
    desired_outcome: desiredOutcome,
  };
}
