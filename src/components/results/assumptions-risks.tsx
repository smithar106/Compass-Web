"use client";

interface Props {
  assumptions: string[];
  risks: string[];
}

function categorizeRisk(risk: string): string {
  const lower = risk.toLowerCase();
  if (lower.includes("tech") || lower.includes("system") || lower.includes("integration") || lower.includes("data") || lower.includes("infrastructure") || lower.includes("tool") || lower.includes("software") || lower.includes("platform")) return "Technology";
  if (lower.includes("people") || lower.includes("team") || lower.includes("staff") || lower.includes("talent") || lower.includes("training") || lower.includes("hire") || lower.includes("culture") || lower.includes("skill") || lower.includes("resource")) return "People";
  if (lower.includes("operational") || lower.includes("process") || lower.includes("workflow") || lower.includes("daily") || lower.includes("disruption") || lower.includes("efficiency") || lower.includes("bottleneck")) return "Operations";
  return "Adoption";
}

const GROUP_STYLES: Record<string, { icon: string; color: string }> = {
  Technology: { icon: "M9 3v2M15 3v2M5 7h14M5 19h14M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z", color: "text-blue-600 bg-blue-50 border-blue-200" },
  People: { icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", color: "text-purple-600 bg-purple-50 border-purple-200" },
  Operations: { icon: "M12 6V2M6 12H2M22 12h-4M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83", color: "text-amber-600 bg-amber-50 border-amber-200" },
  Adoption: { icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8", color: "text-rose-600 bg-rose-50 border-rose-200" },
};

export function AssumptionsRisks({ assumptions, risks }: Props) {
  const hasAssumptions = assumptions.length > 0;
  const hasRisks = risks.length > 0;

  if (!hasAssumptions && !hasRisks) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {hasAssumptions && (
        <div>
          <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Assumptions</h3>
          <ul className="space-y-1.5">
            {assumptions.map((a, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-gray-300 mt-0.5 shrink-0">&#8226;</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasRisks && <RisksGrouped risks={risks} />}
    </div>
  );
}

function RisksGrouped({ risks }: { risks: string[] }) {
  const grouped: Record<string, string[]> = {};
  for (const risk of risks) {
    const category = categorizeRisk(risk);
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(risk);
  }

  const order = ["Technology", "People", "Operations", "Adoption"];

  return (
    <div>
      <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">Implementation Risks</h3>
      <div className="space-y-3">
        {order.map((cat) => {
          const items = grouped[cat];
          if (!items?.length) return null;
          const style = GROUP_STYLES[cat];
          return (
            <div key={cat} className={`rounded-lg border p-3 ${style.color.split(" ").slice(1).join(" ")}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={style.color.split(" ")[0]}>
                  <path d={style.icon} />
                </svg>
                <span className={`text-xs font-bold uppercase tracking-wider ${style.color.split(" ")[0]}`}>{cat}</span>
              </div>
              <ul className="space-y-0.5">
                {items.map((r, i) => (
                  <li key={i} className="text-xs" style={{ color: "inherit" }}>{r}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
