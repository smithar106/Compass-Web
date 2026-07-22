import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mapId, action, opportunityId } = body;

    if (!mapId || !action) {
      return NextResponse.json({ error: "mapId and action are required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await (supabase as any)
      .from("reasoning_traces")
      .insert({
        opportunity_map_id: mapId,
        pipeline: { feedback: { action, opportunityId, timestamp: new Date().toISOString() } },
        decisions: [],
        confidence_breakdown: {},
        opportunity_traces: [],
        performance: {},
        audit_log: [{ event: "user_feedback", ...body, timestamp: new Date().toISOString() }],
      });

    if (error) {
      return NextResponse.json({ error: "Failed to record feedback" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
