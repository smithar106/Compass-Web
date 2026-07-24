import { NextRequest, NextResponse } from "next/server";

const COMPASS_API_URL = process.env.COMPASS_API_URL || "http://127.0.0.1:8001";
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
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const { createAdminClient } = await import("@/lib/supabase-admin");
    const supabase = createAdminClient();

    const { data: session } = await supabase
      .from("assessment_sessions" as any)
      .select("id, organization_id")
      .eq("id", sessionId)
      .single();

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const { data: answers } = await supabase
      .from("assessment_answers" as any)
      .select("*")
      .eq("session_id", sessionId);

    const profile = extractProfile(answers || [], session);

    const pythonResponse = await fetch(`${COMPASS_API_URL}/api/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (!pythonResponse.ok) {
      const errText = await pythonResponse.text();
      throw new Error(`Compass engine error (${pythonResponse.status}): ${errText}`);
    }

    return NextResponse.json(await pythonResponse.json(), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pipeline execution failed";
    console.error("Pipeline error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function extractProfile(answers: any[], session: any) {
  const answerMap = new Map<number, any>();
  for (const a of answers || []) {
    const qid = typeof a.question_id === "number" ? a.question_id : parseInt(a.question_id);
    answerMap.set(qid, a.answer_value ?? a.answer ?? a.value);
  }

  const deptPain: Record<string, number> = {};
  if (answerMap.get(1) === false || answerMap.get(1) === "No") deptPain.Sales = 8;
  if (answerMap.get(4) === false || answerMap.get(4) === "No") deptPain.Marketing = 7;
  if (answerMap.get(7) === false || answerMap.get(7) === "No") deptPain.Customer_Success = 7;
  if (answerMap.get(11) === false || answerMap.get(11) === "No") deptPain.Support = 7;
  if (answerMap.get(13) === false || answerMap.get(13) === "No") deptPain.Finance = 8;
  if (answerMap.get(15) === false || answerMap.get(15) === "No") deptPain.Product = 6;
  if (answerMap.get(17) === false || answerMap.get(17) === "No") deptPain.Engineering = 6;
  if (answerMap.get(20) === false || answerMap.get(20) === "No") deptPain.People_HR = 6;
  if (answerMap.get(22) === false || answerMap.get(22) === "No") deptPain.Legal = 6;
  if (answerMap.get(24) === false || answerMap.get(24) === "No") deptPain.Operations = 8;

  let worstDept = "Operations";
  let worstScore = -1;
  for (const [dept, score] of Object.entries(deptPain)) {
    if (score > worstScore) { worstScore = score; worstDept = dept; }
  }

  if (worstScore < 0) worstDept = "Operations";

  const raw = answerMap.get(25);
  const desiredOutcome = typeof raw === "string"
    ? raw.toLowerCase().includes("cost") ? "cost"
    : raw.toLowerCase().includes("time") ? "time"
    : raw.toLowerCase().includes("revenue") ? "revenue"
    : raw.toLowerCase().includes("satisfaction") ? "satisfaction"
    : "efficiency"
    : "efficiency";

  const org = (session as any)?.organizations;
  const deptDisplay = worstDept === "Customer_Success" ? "customer_success"
    : worstDept === "People_HR" ? "human_resources"
    : worstDept.toLowerCase();

  return {
    business_function: deptDisplay,
    workflow: DEPARTMENT_WORKFLOWS[worstDept] || "process_automation",
    industry: org?.industry || "technology",
    company_size: org?.size_range || "",
    desired_outcome: desiredOutcome,
    problem_statement: `${worstDept} operations need optimization`,
  };
}
