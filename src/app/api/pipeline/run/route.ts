import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const { createAdminClient } = await import("@/lib/supabase-admin");
    const supabase = createAdminClient();

    // Verify the session exists
    const { data: session, error: sessionError } = await supabase
      .from("assessment_sessions" as any)
      .select("user_id")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Run the pipeline
    const { runAssessment } = await import("@compass/pipeline");

    const result = await runAssessment(
      { sessionId, userId: (session as any).user_id },
      supabase
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pipeline execution failed";
    console.error("Pipeline error:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
