import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase-admin";
import { checkRateLimit } from "@/lib/rate-limit";

const designPartnerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  companyName: z.string().min(1),
  companySize: z.string().min(1),
  role: z.string().min(2),
  linkedinUrl: z.string().url().or(z.literal("")),
  currentAiInitiatives: z.string().min(10),
  biggestChallenge: z.string().min(10),
  honeypot: z.string().max(0).optional(),
});

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    if (!checkRateLimit(`design-partner:${ip}`, 5, 3_600_000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: corsHeaders() }
      );
    }

    const body = await request.json();

    if (body.honeypot) {
      return NextResponse.json(
        { error: "Spam detected" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const parsed = designPartnerSchema.parse(body);
    const supabase = createAdminClient();

    const { data: existing } = await (supabase as any)
      .from("design_partner_applications")
      .select("id, status")
      .eq("email", parsed.email)
      .maybeSingle();

    if (existing) {
      if ((existing as any).status === "pending") {
        return NextResponse.json(
          { success: true, message: "Application already received. We will be in touch." },
          { status: 200, headers: corsHeaders() }
        );
      }
      return NextResponse.json(
        { success: true, message: "Thank you for your continued interest." },
        { status: 200, headers: corsHeaders() }
      );
    }

    const { error: insertError } = await (supabase as any)
      .from("design_partner_applications")
      .insert({
        name: parsed.name,
        email: parsed.email,
        company_name: parsed.companyName,
        company_size: parsed.companySize,
        role: parsed.role,
        linkedin_url: parsed.linkedinUrl || null,
        current_ai_initiatives: parsed.currentAiInitiatives,
        biggest_challenge: parsed.biggestChallenge,
        status: "pending",
      });

    if (insertError) {
      console.error("Failed to insert design partner:", insertError);
      return NextResponse.json(
        { error: "Failed to save application" },
        { status: 500, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { success: true, message: "Application received. We will review and be in touch soon." },
      { status: 201, headers: corsHeaders() }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400, headers: corsHeaders() }
      );
    }

    console.error("Design partner submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
