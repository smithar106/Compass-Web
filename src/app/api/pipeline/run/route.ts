import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { checkRateLimit } from "@/lib/rate-limit";

const requestSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
});

export async function POST(request: NextRequest) {
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

    const { runAssessment } = await import("@compass/pipeline");

    const result = await runAssessment(
      { sessionId, userId: user.id },
      adminClient
    );

    const { error: updateError } = await (adminClient as any)
      .from("assessment_sessions")
      .update({
        status: "completed",
        metadata: { ...metadata, pipeline_result: result },
      })
      .eq("id", sessionId);

    if (updateError) {
      console.error("Failed to store pipeline result:", updateError);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Pipeline error:", error);
    return NextResponse.json(
      { error: "Pipeline execution failed" },
      { status: 500 }
    );
  }
}
