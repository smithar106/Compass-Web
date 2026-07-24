"use client";

import { RecommendationData } from "./compass-choice";

interface BlueprintPrintProps {
  recommendation: RecommendationData;
  allRecommendations: RecommendationData[];
  generatedAt: string;
  runId: string;
}

export function BlueprintPrint({ recommendation: r, allRecommendations, generatedAt, runId }: BlueprintPrintProps) {
  const phases = [
    {
      name: "Planning & Setup",
      weeks: r.timeline.low_weeks ? Math.ceil(r.timeline.low_weeks * 0.3) : 2,
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
      weeks: r.timeline.low_weeks ? Math.ceil(r.timeline.low_weeks * 0.5) : 4,
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
      weeks: r.timeline.low_weeks ? Math.ceil(r.timeline.low_weeks * 0.2) + 1 : 3,
      activities: [
        "Full rollout to all teams",
        "Performance monitoring setup",
        "Training and documentation",
        "Continuous improvement cycle",
        "Success metrics tracking",
      ],
    },
  ];

  const impactText = r.projected_impact.is_sufficiently_supported
    ? r.projected_impact.label
    : "Insufficient evidence available.";

  const costText = r.projected_impact.is_sufficiently_supported
    ? r.projected_impact.label
    : "Insufficient evidence available.";

  const timelineText = r.timeline.low_weeks && r.timeline.high_weeks
    ? `${r.timeline.low_weeks}–${r.timeline.high_weeks} weeks`
    : "Insufficient evidence available.";

  return (
    <div id="compass-blueprint-print" style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "white", zIndex: 9999, overflow: "auto",
      padding: "48px 56px", fontFamily: "Inter, system-ui, sans-serif",
      color: "#1A1A1A", display: "none",
    }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #compass-blueprint-print { display: block !important; }
          #compass-blueprint-print, #compass-blueprint-print * { visibility: visible; }
          #compass-blueprint-print { position: absolute; left: 0; top: 0; }
          @page { margin: 0.5in; size: letter; }
        }
        .blueprint-page { max-width: 800px; margin: 0 auto; }
        .bp-h1 { font-size: 24px; font-weight: 700; margin: 0 0 4px; color: #1A1A1A; }
        .bp-h2 { font-size: 14px; font-weight: 700; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #1A1A1A; border-bottom: 2px solid #84CC16; padding-bottom: 6px; }
        .bp-h3 { font-size: 12px; font-weight: 600; margin: 0 0 4px; color: #1A1A1A; }
        .bp-text { font-size: 11px; line-height: 1.5; color: #4B5563; margin: 0 0 4px; }
        .bp-meta { font-size: 10px; color: #9CA3AF; margin: 0 0 2px; }
        .bp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .bp-section { margin-bottom: 20px; }
        .bp-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .bp-badge-gold { background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; }
        .bp-badge-silver { background: #F3F4F6; color: #4B5563; border: 1px solid #D1D5DB; }
        .bp-badge-bronze { background: #FFF7ED; color: #9A3412; border: 1px solid #FDBA74; }
        .bp-row { display: flex; gap: 40px; margin-bottom: 6px; }
        .bp-field { flex: 1; }
        .bp-field-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6B7280; margin-bottom: 2px; }
        .bp-field-value { font-size: 12px; color: #1A1A1A; }
        .bp-table { width: 100%; border-collapse: collapse; font-size: 10px; }
        .bp-table th { text-align: left; padding: 6px 8px; background: #F9FAFB; border-bottom: 1px solid #E5E7EB; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; font-size: 9px; color: #6B7280; }
        .bp-table td { padding: 6px 8px; border-bottom: 1px solid #F3F4F6; }
        .bp-card { border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
        .bp-card-compass { border-color: #84CC16; border-width: 2px; }
        .bp-list { margin: 0; padding-left: 16px; font-size: 11px; color: #4B5563; line-height: 1.6; }
        .bp-phase { margin-bottom: 12px; }
        .bp-phase-title { font-size: 12px; font-weight: 600; margin-bottom: 4px; }
      `}</style>

      <div className="blueprint-page">

        <div style={{ textAlign: "center", marginBottom: 28, paddingBottom: 20, borderBottom: "2px solid #84CC16" }}>
          <div style={{ fontSize: 10, color: "#84CC16", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Compass</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 4px", color: "#1A1A1A" }}>Implementation Blueprint</h1>
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>{r.title}</p>
        </div>

        <div className="bp-section">
          <h2 className="bp-h2">Executive Summary</h2>
          <p className="bp-text">{r.summary}</p>
        </div>

        <div className="bp-section">
          <h2 className="bp-h2">Business Objective</h2>
          <p className="bp-text">{r.summary.slice(0, 150)}</p>
        </div>

        <div className="bp-section">
          <h2 className="bp-h2">Expected Outcomes</h2>
          <div className="bp-grid">
            <div className="bp-card">
              <div className="bp-field-label">Estimated Annual Cost Savings</div>
              <div className="bp-field-value" style={{ fontSize: 18, fontWeight: 700, color: "#84CC16" }}>{costText}</div>
            </div>
            <div className="bp-card">
              <div className="bp-field-label">Estimated Annual Time Savings</div>
              <div className="bp-field-value" style={{ fontSize: 18, fontWeight: 700, color: "#84CC16" }}>{impactText}</div>
            </div>
          </div>
        </div>

        <div className="bp-section">
          <h2 className="bp-h2">Implementation Overview</h2>
          <div className="bp-row">
            <div className="bp-field"><div className="bp-field-label">Timeline</div><div className="bp-field-value">{timelineText}</div></div>
            <div className="bp-field"><div className="bp-field-label">Implementation Cost</div><div className="bp-field-value">{costText}</div></div>
            <div className="bp-field"><div className="bp-field-label">Evidence Tier</div><div className="bp-field-value"><span className={`bp-badge bp-badge-${r.evidence_summary.overall_tier}`}>{r.evidence_summary.overall_tier}</span></div></div>
            <div className="bp-field"><div className="bp-field-label">Confidence</div><div className="bp-field-value">{Math.round(r.confidence.score * 100)}% ({r.confidence.label})</div></div>
          </div>
        </div>

        <div className="bp-section">
          <h2 className="bp-h2">Required Resources</h2>
          <div className="bp-grid">
            <div>
              <h3 className="bp-h3">Teams Involved</h3>
              <ul className="bp-list">
                <li>Operations team</li>
                <li>IT / Engineering</li>
                <li>Department stakeholders</li>
              </ul>
            </div>
            <div>
              <h3 className="bp-h3">Stakeholders</h3>
              <ul className="bp-list">
                <li>Department head</li>
                <li>Project sponsor (executive)</li>
                <li>Technical lead</li>
              </ul>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <h3 className="bp-h3">Required Software</h3>
            <p className="bp-text">Solution components as defined in the implementation plan — see phases below.</p>
          </div>
        </div>

        <div className="bp-section">
          <h2 className="bp-h2">Implementation Phases</h2>
          {phases.map((phase, i) => (
            <div key={i} className="bp-phase">
              <div className="bp-phase-title">Phase {i + 1}: {phase.name} ({phase.weeks} weeks)</div>
              <ul className="bp-list">
                {phase.activities.map((a, j) => <li key={j}>{a}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="bp-section">
          <h2 className="bp-h2">Risks & Mitigations</h2>
          {r.risks.length > 0 ? (
            <ul className="bp-list">
              {r.risks.map((risk, i) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          ) : (
            <p className="bp-text">Insufficient evidence available.</p>
          )}
        </div>

        <div className="bp-section">
          <h2 className="bp-h2">Success Metrics & KPIs</h2>
          {r.projected_impact.is_sufficiently_supported ? (
            <ul className="bp-list">
              <li>{r.projected_impact.label}</li>
              <li>Employee time saved per week</li>
              <li>Error rate reduction</li>
              <li>Process cycle time improvement</li>
            </ul>
          ) : (
            <p className="bp-text">Insufficient evidence available.</p>
          )}
        </div>

        <div className="bp-section">
          <h2 className="bp-h2">Validation Plan</h2>
          <ul className="bp-list">
            <li>Define baseline metrics before implementation</li>
            <li>Run pilot with subset of cases (2–4 weeks)</li>
            <li>Compare results to baseline targets</li>
            <li>Adjust approach before full rollout</li>
          </ul>
        </div>

        <div className="bp-section">
          <h2 className="bp-h2">Assumptions</h2>
          {r.assumptions.length > 0 ? (
            <ul className="bp-list">
              {r.assumptions.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          ) : (
            <p className="bp-text">Insufficient evidence available.</p>
          )}
        </div>

        <div className="bp-section">
          <h2 className="bp-h2">Evidence Summary</h2>
          <p className="bp-text">
            {r.evidence_summary.total_comparables} comparable implementations analyzed.
            {r.evidence_summary.gold_count > 0 ? ` ${r.evidence_summary.gold_count} with Gold evidence,` : ""}
            {r.evidence_summary.silver_count > 0 ? ` ${r.evidence_summary.silver_count} with Silver evidence,` : ""}
            {r.evidence_summary.bronze_count > 0 ? ` ${r.evidence_summary.bronze_count} with Bronze evidence.` : ""}
            Overall tier: {r.evidence_summary.overall_tier}.
          </p>

          {r.comparables.length > 0 && (
            <>
              <h3 className="bp-h3" style={{ marginTop: 12 }}>Comparable Implementations</h3>
              <table className="bp-table">
                <thead>
                  <tr>
                    <th>Organization</th>
                    <th>Outcome</th>
                    <th>Status</th>
                    <th>Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {r.comparables.filter(c => c.evidence_tier !== "rejected").slice(0, 5).map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{c.organization}</td>
                      <td>{c.outcome}</td>
                      <td>{c.status}</td>
                      <td><span className={`bp-badge bp-badge-${c.evidence_tier}`}>{c.evidence_tier}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        <div style={{ marginTop: 28, paddingTop: 16, borderTop: "1px solid #E5E7EB", textAlign: "center" }}>
          <p className="bp-meta">Generated {generatedAt}</p>
          <p className="bp-meta">Recommendation Run ID: {runId}</p>
          <p className="bp-meta" style={{ marginTop: 8 }}>Compass AI — Evidence-driven recommendation engine</p>
        </div>

      </div>
    </div>
  );
}
