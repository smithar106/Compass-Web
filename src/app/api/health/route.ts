import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  const checks: Record<string, { status: string; detail?: string }> = {};

  checks.application = { status: "ok" };

  checks.database = await checkDatabaseConnectivity();

  checks.schema = await checkRequiredSchema();

  checks.auth_config = {
    status: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "configured" : "not_configured",
  };

  const healthyStatuses = ["ok", "configured", "deployed"];
  const allOk = Object.values(checks).every((c) => healthyStatuses.includes(c.status));

  return NextResponse.json(
    {
      status: allOk ? "healthy" : "degraded",
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
}

async function checkDatabaseConnectivity(): Promise<{ status: string; detail?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return { status: "not_configured", detail: "Missing Supabase configuration" };
  }

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/assessment_sessions?select=id&limit=1`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return { status: "error", detail: `HTTP ${response.status}: ${text.slice(0, 200)}` };
    }
    return { status: "ok" };
  } catch (err) {
    return { status: "error", detail: err instanceof Error ? err.message.slice(0, 200) : "Unknown error" };
  }
}

async function checkRequiredSchema(): Promise<{ status: string; detail?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return { status: "not_configured", detail: "Missing Supabase configuration" };
  }

  const requiredTables = ["assessment_sessions", "design_partner_applications", "feedback"];

  try {
    const missing: string[] = [];
    for (const table of requiredTables) {
      const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}?select=id&limit=1`, {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      });
      if (response.status === 404) {
        missing.push(table);
      } else if (!response.ok && response.status !== 401 && response.status !== 403) {
        return { status: "error", detail: `Table check failed for ${table}: HTTP ${response.status}` };
      }
    }

    if (missing.length > 0) {
      return { status: "degraded", detail: `Missing tables: ${missing.join(", ")}` };
    }

    return { status: "deployed" };
  } catch (err) {
    return { status: "error", detail: err instanceof Error ? err.message.slice(0, 200) : "Unknown error" };
  }
}
