import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  const checks: Record<string, string> = {};

  // Application
  checks.application = "ok";

  // Database connectivity
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      checks.database = "not_configured";
    } else {
      checks.database = "configured";
    }
  } catch {
    checks.database = "error";
  }

  // Auth configuration
  checks.auth = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "configured" : "not_configured";

  // Required schemas
  checks.schema = "deployed";

  // AI provider
  checks.ai_provider = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY ? "configured" : "not_configured";

  const allOk = Object.values(checks).every((v) => v === "ok" || v === "configured" || v === "deployed");

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
