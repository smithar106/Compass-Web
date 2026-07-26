import { NextRequest, NextResponse } from "next/server";

const compassApiUrl =
  process.env.COMPASS_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8001" : null);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recId = searchParams.get("rec_id");

    if (!recId || typeof recId !== "string") {
      return NextResponse.json({ error: "rec_id query parameter is required" }, { status: 400 });
    }

    if (!compassApiUrl) {
      return NextResponse.json({ error: "Compass Engine URL is not configured." }, { status: 500 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const engineRes = await fetch(`${compassApiUrl}/api/recommendations/${encodeURIComponent(recId)}/report.pdf`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!engineRes.ok) {
      const errText = await engineRes.text();
      return NextResponse.json({ error: `Engine error: ${errText.slice(0, 200)}` }, { status: 502 });
    }

    const pdfBytes = await engineRes.arrayBuffer();
    const contentType = engineRes.headers.get("content-type") || "application/pdf";
    const contentDisposition = engineRes.headers.get("content-disposition") || `attachment; filename="compass-report-${recId.slice(0, 8)}.pdf"`;

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
        "Content-Length": pdfBytes.byteLength.toString(),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Engine did not respond within 30 seconds." }, { status: 504 });
    }
    const message = error instanceof Error ? error.message : "PDF generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
