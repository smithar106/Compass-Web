"use client";

import { useCallback } from "react";
import { RecommendationData } from "./compass-choice";

interface BlueprintPrintProps {
  recommendation: RecommendationData;
  allRecommendations: RecommendationData[];
  generatedAt: string;
  runId: string;
  onClose: () => void;
}

export function BlueprintPrint({ recommendation: r, allRecommendations, generatedAt, runId, onClose }: BlueprintPrintProps) {
  const phases = [
    {
      name: "Planning & Setup",
      weeks: r.timeline.low_weeks ? Math.ceil(r.timeline.low_weeks * 0.3) : null,
      activities: [
        "Stakeholder alignment and goal definition",
        "Current workflow documentation",
        "Tool and system audit",
        "Data readiness assessment",
        "Team onboarding plan",
      ],
    },
    {
      name: "Implementation",
      weeks: r.timeline.low_weeks ? Math.ceil(r.timeline.low_weeks * 0.5) : null,
      activities: [
        "Core solution deployment",
        "Integration with existing systems",
        "Data migration and validation",
        "User acceptance testing",
        "Iteration based on feedback",
      ],
    },
    {
      name: "Scale & Optimize",
      weeks: r.timeline.low_weeks ? Math.ceil(r.timeline.low_weeks * 0.2) + 1 : null,
      activities: [
        "Full rollout to all teams",
        "Performance monitoring setup",
        "Training and documentation",
        "Continuous improvement cycle",
        "Success metrics tracking",
      ],
    },
  ];

  const impactText = r.projected_impact.is_sufficiently_supported ? r.projected_impact.label : null;
  const timelineText = r.timeline.low_weeks && r.timeline.high_weeks ? `${r.timeline.low_weeks}–${r.timeline.high_weeks} weeks` : null;

  const handleDownload = useCallback(async () => {
    const jsPDF = (await import("jspdf")).default;
    const html2canvas = (await import("html2canvas")).default;
    const el = document.getElementById("compass-blueprint-content");
    if (!el) return;

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "in", format: "letter" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 0.5;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
      position = -(pageHeight - margin * 2) * (imgHeight / canvas.height - 1) + margin;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    pdf.save(`Compass-Implementation-Blueprint-${r.title.slice(0, 30).replace(/\s+/g, "-")}.pdf`);
    onClose();
  }, [r.title, onClose]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, overflow: "auto",
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{ backgroundColor: "white", borderRadius: 16, maxWidth: 860, width: "100%", maxHeight: "90vh", overflow: "auto", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #E5E7EB" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>Implementation Blueprint</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleDownload}
              style={{
                padding: "8px 20px", backgroundColor: "#84CC16", color: "white", border: "none",
                borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              Download PDF
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px", backgroundColor: "white", color: "#6B7280", border: "1px solid #E5E7EB",
                borderRadius: 8, fontSize: 13, cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>

        <div id="compass-blueprint-content" style={{ padding: "40px 48px", fontFamily: "Inter, system-ui, sans-serif", color: "#1A1A1A", backgroundColor: "white" }}>
          <div style={{ textAlign: "center", marginBottom: 28, paddingBottom: 20, borderBottom: "2px solid #84CC16" }}>
            <div style={{ fontSize: 10, color: "#84CC16", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Compass</div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px", color: "#1A1A1A" }}>Implementation Blueprint</h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>{r.title}</p>
          </div>

          <Section title="Executive Summary" content={r.summary} />

          <Section title="Business Objective" content={r.summary.slice(0, 150)} />

          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#1A1A1A", borderBottom: "2px solid #84CC16", paddingBottom: 6, marginBottom: 12 }}>Expected Outcomes</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <MetricBox label="Estimated Annual Cost Savings" value={impactText} />
              <MetricBox label="Estimated Annual Time Savings" value={impactText} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#1A1A1A", borderBottom: "2px solid #84CC16", paddingBottom: 6, marginBottom: 12 }}>Implementation Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
              <Field label="Timeline" value={timelineText} />
              <Field label="Implementation Cost" value={impactText} />
              <Field label="Evidence Tier" value={r.evidence_summary.overall_tier.toUpperCase()} />
              <Field label="Confidence" value={`${Math.round(r.confidence.score * 100)}% (${r.confidence.label})`} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#1A1A1A", borderBottom: "2px solid #84CC16", paddingBottom: 6, marginBottom: 12 }}>Implementation Phases</h2>
            {phases.map((phase, i) => (
              <div key={i} style={{ marginBottom: 10, padding: 12, backgroundColor: "#F9FAFB", borderRadius: 8, border: "1px solid #F3F4F6" }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  Phase {i + 1}: {phase.name}
                  {phase.weeks ? ` (${phase.weeks} weeks)` : ""}
                </div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: "#4B5563", lineHeight: 1.6 }}>
                  {phase.activities.map((a, j) => <li key={j}>{a}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#1A1A1A", borderBottom: "2px solid #84CC16", paddingBottom: 6, marginBottom: 12 }}>Risks &amp; Mitigations</h2>
            {r.risks.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: "#4B5563", lineHeight: 1.6 }}>
                {r.risks.map((risk, i) => <li key={i}>{risk}</li>)}
              </ul>
            ) : (
              <p style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}>Insufficient evidence available.</p>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#1A1A1A", borderBottom: "2px solid #84CC16", paddingBottom: 6, marginBottom: 12 }}>Success Metrics &amp; KPIs</h2>
            {r.projected_impact.is_sufficiently_supported ? (
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: "#4B5563", lineHeight: 1.6 }}>
                <li>{r.projected_impact.label}</li>
                <li>Employee time saved per week</li>
                <li>Error rate reduction</li>
                <li>Process cycle time improvement</li>
              </ul>
            ) : (
              <p style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}>Insufficient evidence available.</p>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#1A1A1A", borderBottom: "2px solid #84CC16", paddingBottom: 6, marginBottom: 12 }}>Validation Plan</h2>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: "#4B5563", lineHeight: 1.6 }}>
              <li>Define baseline metrics before implementation</li>
              <li>Run pilot with subset of cases (2–4 weeks)</li>
              <li>Compare results to baseline targets</li>
              <li>Adjust approach before full rollout</li>
            </ul>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#1A1A1A", borderBottom: "2px solid #84CC16", paddingBottom: 6, marginBottom: 12 }}>Assumptions</h2>
            {r.assumptions.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: "#4B5563", lineHeight: 1.6 }}>
                {r.assumptions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            ) : (
              <p style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}>Insufficient evidence available.</p>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#1A1A1A", borderBottom: "2px solid #84CC16", paddingBottom: 6, marginBottom: 12 }}>Evidence Summary</h2>
            <p style={{ fontSize: 11, color: "#4B5563", marginBottom: 8 }}>
              {r.evidence_summary.total_comparables} comparable implementations analyzed.
              {r.evidence_summary.gold_count > 0 ? ` ${r.evidence_summary.gold_count} with Gold evidence,` : ""}
              {r.evidence_summary.silver_count > 0 ? ` ${r.evidence_summary.silver_count} with Silver evidence,` : ""}
              {r.evidence_summary.bronze_count > 0 ? ` ${r.evidence_summary.bronze_count} with Bronze evidence.` : ""}
              Overall tier: {r.evidence_summary.overall_tier}.
            </p>
            {r.comparables.filter(c => c.evidence_tier !== "rejected").length > 0 && (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                <thead>
                  <tr style={{ background: "#F9FAFB" }}>
                    <th style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid #E5E7EB", fontWeight: 600, fontSize: 9, color: "#6B7280", textTransform: "uppercase" }}>Organization</th>
                    <th style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid #E5E7EB", fontWeight: 600, fontSize: 9, color: "#6B7280", textTransform: "uppercase" }}>Outcome</th>
                    <th style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid #E5E7EB", fontWeight: 600, fontSize: 9, color: "#6B7280", textTransform: "uppercase" }}>Status</th>
                    <th style={{ textAlign: "left", padding: "6px 8px", borderBottom: "1px solid #E5E7EB", fontWeight: 600, fontSize: 9, color: "#6B7280", textTransform: "uppercase" }}>Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {r.comparables.filter(c => c.evidence_tier !== "rejected").slice(0, 5).map((c, i) => (
                    <tr key={i}>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid #F3F4F6", fontWeight: 500 }}>{c.organization}</td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid #F3F4F6" }}>{c.outcome}</td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid #F3F4F6" }}>{c.status}</td>
                      <td style={{ padding: "6px 8px", borderBottom: "1px solid #F3F4F6" }}>
                        <TierPill tier={c.evidence_tier} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #E5E7EB", textAlign: "center" }}>
            <p style={{ fontSize: 9, color: "#9CA3AF", margin: "0 0 2px" }}>Generated {generatedAt}</p>
            <p style={{ fontSize: 9, color: "#9CA3AF", margin: 0 }}>Run ID: {runId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#1A1A1A", borderBottom: "2px solid #84CC16", paddingBottom: 6, marginBottom: 8 }}>{title}</h2>
      <p style={{ fontSize: 11, lineHeight: 1.5, color: "#4B5563", margin: 0 }}>{content}</p>
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: string | null }) {
  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: 14 }}>
      <div style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6B7280", marginBottom: 4 }}>{label}</div>
      {value ? (
        <div style={{ fontSize: 16, fontWeight: 700, color: "#84CC16" }}>{value}</div>
      ) : (
        <div style={{ fontSize: 10, color: "#9CA3AF", fontStyle: "italic" }}>Insufficient evidence available.</div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6B7280", marginBottom: 2 }}>{label}</div>
      {value ? (
        <div style={{ fontSize: 12, color: "#1A1A1A" }}>{value}</div>
      ) : (
        <div style={{ fontSize: 10, color: "#9CA3AF", fontStyle: "italic" }}>Unknown</div>
      )}
    </div>
  );
}

function TierPill({ tier }: { tier: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    gold: { bg: "#FEF3C7", text: "#92400E" },
    silver: { bg: "#F3F4F6", text: "#4B5563" },
    bronze: { bg: "#FFF7ED", text: "#9A3412" },
  };
  const c = colors[tier] || colors.bronze;
  return (
    <span style={{ display: "inline-block", padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600, textTransform: "uppercase", background: c.bg, color: c.text, border: "1px solid", borderColor: c.text + "33" }}>
      {tier}
    </span>
  );
}
