import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({}),
    });

    let body: Record<string, unknown>;
    try {
      body = await res.json();
    } catch {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Auth server returned non-JSON response (HTTP ${res.status}): ${text.slice(0, 100)}` },
        { status: 502 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: body.msg || body.error || body.message || `Sign-in failed (HTTP ${res.status})` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      user: body.user ?? body.id,
      access_token: body.access_token,
      refresh_token: body.refresh_token,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sign-in failed" },
      { status: 500 }
    );
  }
}