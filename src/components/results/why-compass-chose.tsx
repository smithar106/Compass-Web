"use client";

interface Props {
  why_it_ranked: string[];
  total_comparables: number;
  confidence_score: number;
  evidence_quality: string;
}

function Factor({ icon, label, detail }: { icon: React.ReactNode; label: string; detail: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 text-lime-600">
        {icon}
      </div>
      <div className="min-w-0">
        <span className="text-xs font-semibold text-ink block">{label}</span>
        <span className="text-xs text-gray-500 block mt-0.5 leading-relaxed">{detail}</span>
      </div>
    </div>
  );
}

export function WhyCompassChose({ why_it_ranked, total_comparables, confidence_score, evidence_quality }: Props) {
  const factors: { icon: React.ReactNode; label: string; detail: string }[] = [];

  if (why_it_ranked.length > 0) {
    const wf = why_it_ranked.find((r) => r.toLowerCase().includes("workflow"));
    if (wf) factors.push({
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
      label: "Workflow Similarity",
      detail: wf,
    });

    const ind = why_it_ranked.find((r) => r.toLowerCase().includes("industr"));
    if (ind) factors.push({
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
      label: "Industry Similarity",
      detail: ind,
    });

    const comp = why_it_ranked.find((r) => r.toLowerCase().includes("comparable") || r.toLowerCase().includes("implementation"));
    if (comp) factors.push({
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>,
      label: "Comparable Implementations",
      detail: comp,
    });

    const ev = why_it_ranked.find((r) => r.toLowerCase().includes("evidence") || r.toLowerCase().includes("data"));
    if (ev) factors.push({
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
      label: "Evidence Quality",
      detail: ev,
    });

    const out = why_it_ranked.find((r) => r.toLowerCase().includes("outcome"));
    if (out) factors.push({
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
      label: "Observed Outcomes",
      detail: out,
    });

    const biz = why_it_ranked.find((r) => r.toLowerCase().includes("constraint") || r.toLowerCase().includes("budget") || r.toLowerCase().includes("resource"));
    if (biz) factors.push({
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      label: "Business Constraints",
      detail: biz,
    });

    const remaining = why_it_ranked.filter((r) =>
      !r.toLowerCase().includes("workflow") &&
      !r.toLowerCase().includes("industr") &&
      !r.toLowerCase().includes("comparable") &&
      !r.toLowerCase().includes("implementation") &&
      !r.toLowerCase().includes("evidence") &&
      !r.toLowerCase().includes("data") &&
      !r.toLowerCase().includes("outcome") &&
      !r.toLowerCase().includes("constraint") &&
      !r.toLowerCase().includes("budget") &&
      !r.toLowerCase().includes("resource")
    );
    remaining.forEach((r) => {
      factors.push({
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
        label: "Factor",
        detail: r,
      });
    });
  }

  if (total_comparables > 0 && !factors.find((f) => f.label === "Comparable Implementations")) {
    factors.push({
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>,
      label: "Comparable Implementations",
      detail: `${total_comparables} comparable implementation${total_comparables !== 1 ? "s" : ""} analyzed across similar organizations.`,
    });
  }

  if (!factors.length) return null;

  return (
    <div>
      <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Why Compass Chose This</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {factors.slice(0, 6).map((f, i) => (
          <Factor key={i} icon={f.icon} label={f.label} detail={f.detail} />
        ))}
      </div>
    </div>
  );
}
