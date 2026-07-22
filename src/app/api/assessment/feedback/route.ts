import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase-admin";
import { checkRateLimit } from "@/lib/rate-limit";

const FEEDBACK_TYPES = [
  "useful",
  "irrelevant",
  "missing_context",
  "wrong_intervention",
  "wrong_priority",
  "unclear_evidence",
  "blueprint_incomplete",
] as const;

const feedbackSchema = z.object({
  assessment_id: z.string().uuid(),
  map_id: z.string().min(1),
  intervention_id: z.string().optional(),
  engine_version: z.string().min(1),
  feedback_type: z.enum(FEEDBACK_TYPES),
  comment: z.string().max(2000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(`feedback:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = feedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error: insertError } = await (supabase as any)
      .from("feedback")
      .insert({
        assessment_id: parsed.data.assessment_id,
        map_id: parsed.data.map_id,
        intervention_id: parsed.data.intervention_id || null,
        engine_version: parsed.data.engine_version,
        feedback_type: parsed.data.feedback_type,
        comment: parsed.data.comment || null,
      });

    if (insertError) {
      console.error("Failed to store feedback:", insertError);
      return NextResponse.json({ error: "Failed to record feedback" }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: "Feedback recorded" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
