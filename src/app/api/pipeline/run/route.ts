import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { checkRateLimit } from "@/lib/rate-limit";

const requestSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
});

const compassApiUrl =
  process.env.COMPASS_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8001" : null);

const DEPARTMENT_WORKFLOWS: Record<string, string> = {
  Sales: "lead_qualification",
  Marketing: "marketing_automation",
  Customer_Success: "customer_health_scoring",
  Support: "ticketing",
  Finance: "invoice_processing",
  Product: "product_analytics",
  Engineering: "ci_cd",
  People_HR: "onboarding",
  Legal: "contract_review",
  Operations: "process_automation",
};

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).slice(2, 8);
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(`pipeline:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
    }

    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { sessionId } = parsed.data;
    const adminClient = createAdminClient();

    const { data: session, error: sessionError } = await (adminClient as any)
      .from("assessment_sessions" as any)
      .select("user_id, status, metadata")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const metadata = (session.metadata || {}) as Record<string, unknown>;
    if (metadata.pipeline_result) {
      return NextResponse.json(metadata.pipeline_result, { status: 200 });
    }

    if (!compassApiUrl) {
      console.error(`[Pipeline:${requestId}] COMPASS_API_URL not configured in production`);
      return NextResponse.json(
        { error: "Compass Engine URL is not configured. Set COMPASS_API_URL environment variable." },
        { status: 500 }
      );
    }

    console.log(`[Pipeline:${requestId}] Resolved COMPASS_API_URL: ${compassApiUrl}`);

    const { data: profileData } = await (adminClient as any)
      .from("assessment_answers")
      .select("question_id, answer_value, answer")
      .eq("session_id", sessionId);

    const profiles = await (adminClient as any)
      .from("assessment_sessions")
      .select("organization_id")
      .eq("id", sessionId)
      .single();

    const orgId = profiles.data?.organization_id;
    let industry = "technology";
    let size_range = "";
    if (orgId) {
      const { data: org } = await (adminClient as any)
        .from("organizations")
        .select("industry, size_range")
        .eq("id", orgId)
        .single();
      if (org) {
        industry = org.industry || "technology";
        size_range = org.size_range || "";
      }
    }

    const profile = extractProfileFromAnswers(profileData || [], industry, size_range);
    console.log(`[Pipeline:${requestId}] Sending to ${compassApiUrl}/api/recommendations`);
    const requestStart = Date.now();

    const pythonResponse = await fetch(`${compassApiUrl}/api/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    const elapsed = Date.now() - requestStart;
    console.log(`[Pipeline:${requestId}] Engine responded in ${elapsed}ms with status ${pythonResponse.status}`);

    if (!pythonResponse.ok) {
      const errText = await pythonResponse.text();
      console.error(`[Pipeline:${requestId}] Engine error body: ${errText.slice(0, 500)}`);
      throw new Error(`Compass engine error (${pythonResponse.status}): ${errText.slice(0, 200)}`);
    }

    const result = await pythonResponse.json();

    await (adminClient as any)
      .from("assessment_sessions")
      .update({
        status: "completed",
        metadata: { ...metadata, pipeline_result: result },
      })
      .eq("id", sessionId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(`[Pipeline:${requestId}] Error:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Pipeline execution failed" },
      { status: 500 }
    );
  }
}

function extractProfileFromAnswers(answers: any[], industry: string, size_range: string) {
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

  const deptDisplay = worstDept === "Customer_Success" ? "customer_success"
    : worstDept === "People_HR" ? "human_resources"
    : worstDept.toLowerCase();

  const raw = answerMap.get(25);
  const desiredOutcome = typeof raw === "string"
    ? raw.toLowerCase().includes("cost") ? "cost"
    : raw.toLowerCase().includes("time") ? "time"
    : raw.toLowerCase().includes("revenue") ? "revenue"
    : raw.toLowerCase().includes("satisfaction") ? "satisfaction"
    : "efficiency"
    : "efficiency";

  return {
    business_function: deptDisplay,
    workflow: DEPARTMENT_WORKFLOWS[worstDept] || "process_automation",
    problem_statement: `${worstDept} operations need optimization`,
    industry,
    company_size: size_range,
    desired_outcome: desiredOutcome,
  };
}
