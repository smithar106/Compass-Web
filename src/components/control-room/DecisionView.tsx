import { SectionHeading, ReviewCta } from "./ControlRoomShell";

// The five questions answered in ~10 seconds, per the control-room concept.
const FIVE_QUESTIONS = [
  {
    q: "What should I do?",
    a: "Automate invoice intake and redesign exception handling",
  },
  {
    q: "Why?",
    a: "Best fit for your volume, process variability, economics, and implementation constraints.",
  },
  {
    q: "What will it do?",
    a: "$1.4M\u2013$1.9M annual impact · 62% faster processing · 9\u201312 month payback",
  },
  {
    q: "Why should I believe this?",
    a: "43 comparable implementations · 31 observed outcomes · 18 claim-verified metrics · High evidence confidence",
  },
  {
    q: "What happens next?",
    a: "Review implementation plan →",
  },
];

const COMPARE_SCORES = [
  { label: "AI Agent", score: 82, recommended: false },
  { label: "Workflow Automation", score: 91, recommended: true },
  { label: "New Software", score: 68, recommended: false },
  { label: "Process Redesign", score: 76, recommended: false },
  { label: "Staffing", score: 42, recommended: false },
];

export function DecisionView() {
  return (
    <div>
      <SectionHeading
        kicker="Decision"
        title="Reduce customer support operating cost"
        sub="Automate Tier 1 resolution + redesign escalation"
      />

      {/* impact strip */}
      <div className="mt-8 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
        {[
          { v: "$2.1M/yr", l: "Impact" },
          { v: "8 mo", l: "Payback" },
          { v: "High", l: "Confidence" },
          { v: "47 cases", l: "Evidence" },
        ].map((s) => (
          <div key={s.l} className="bg-surface px-5 py-4">
            <p className="text-[clamp(1.6rem,2.4vw,2.1rem)] font-extralight leading-none tracking-[-0.02em] text-ink">{s.v}</p>
            <p className="mt-1.5 text-[10.5px] font-bold uppercase tracking-wide text-muted">{s.l}</p>
          </div>
        ))}
      </div>

      {/* why this wins */}
      <div className="mt-8 border border-line bg-surface p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">Why this wins</p>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink">
          Your ticket volume and repetitive Tier-1 workload favor automation, but comparable implementations
          show fully autonomous support performs poorly on complex cases. A hybrid model produces stronger
          cost reduction without the service-quality tradeoff.
        </p>
      </div>

      {/* compare scores */}
      <div className="mt-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">How the options compare</p>
        <div className="mt-3 space-y-2">
          {COMPARE_SCORES.map((o) => (
            <div
              key={o.label}
              className={
                o.recommended
                  ? "flex items-center gap-4 border border-accent/60 bg-accent/5 px-4 py-3"
                  : "flex items-center gap-4 border border-line bg-surface px-4 py-3"
              }
            >
              <span className="w-40 text-[14px] font-medium text-ink">{o.label}</span>
              <div className="h-1.5 flex-1 bg-line">
                <div
                  className={cn("h-1.5", o.recommended ? "bg-accent-deep" : "bg-muted/40")}
                  style={{ width: `${o.score}%` }}
                />
              </div>
              <span className="w-10 text-right text-[14px] font-semibold text-ink">{o.score}</span>
              {o.recommended && <span className="text-[12px] font-semibold text-accent-deep">✓</span>}
            </div>
          ))}
        </div>
      </div>

      <ReviewCta />
    </div>
  );
}

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}
