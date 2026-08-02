import Link from "next/link";
import { marketing } from "@/content/marketing";
import { ArrowIcon } from "./primitives";
import { EvidenceStats } from "./EvidenceStats";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

type PathIcon = "search" | "compass" | "check-square";
type Status = "Complete" | "Strong" | "Partial" | "Missing";

const STATUS_DOT: Record<Status, string> = {
  Complete: "bg-ok",
  Strong: "bg-accent-deep",
  Partial: "bg-warn",
  Missing: "bg-faint",
};

export function DecisionEntry() {
  const h = marketing.hero;

  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      {/* faint grid + evidence-path texture */}
      <div
        aria-hidden="true"
        className="grid-backdrop pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_72%)]"
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-6 hidden h-[560px] w-[720px] opacity-60 lg:block"
        viewBox="0 0 720 560"
        fill="none"
      >
        <path d="M40 420 C 160 380, 240 440, 360 360 S 560 280, 680 200" stroke="#4C650C" strokeOpacity="0.12" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M40 480 C 180 440, 300 500, 420 420 S 600 360, 690 300" stroke="#4C650C" strokeOpacity="0.08" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 6" />
        <circle cx="360" cy="360" r="3" fill="#4C650C" fillOpacity="0.25" />
        <circle cx="680" cy="200" r="3" fill="#4C650C" fillOpacity="0.25" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 lg:px-10 lg:pb-20 lg:pt-36">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* copy */}
          <div>
            <Reveal>
              <HeroEyebrow>{h.eyebrow}</HeroEyebrow>
            </Reveal>

            <Reveal delay={80}>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                {h.categoryLine}
              </p>
              <h1 className="mt-3 text-hero font-semibold tracking-tight text-ink">
                <span className="block">Make Operational</span>
                <span className="block">
                  <em className="font-serif italic font-medium text-accent-deep">{h.headlineAccent}</em> with
                </span>
                <span className="block">
                  Confidence<span className="text-accent-deep">.</span>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-lead leading-relaxed text-muted">
                {h.supporting}
              </p>
              <p className="mt-4 max-w-xl border-l-2 border-accent-deep pl-4 font-serif text-[16px] italic leading-relaxed text-ink">
                {h.stakes}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={h.ctaHref}
                  className="group inline-flex items-center gap-2 bg-ink px-6 py-3.5 text-[15px] font-semibold text-paper transition-colors hover:bg-ink2"
                >
                  {h.cta}
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={h.secondaryHref}
                  className="group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-accent-deep transition-colors hover:text-ink"
                >
                  {h.secondaryCta}
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* product proof */}
          <Reveal delay={200} className="lg:justify-self-end lg:self-start">
            <DecisionDefensibilityPanel />
          </Reveal>
        </div>

        {/* entry paths */}
        <div className="mt-16 lg:mt-20">
          <Reveal>
            <div className="flex items-center justify-center gap-4">
              <span aria-hidden="true" className="h-px w-12 bg-line sm:w-20" />
              <h2 className="text-center text-[15px] font-semibold uppercase tracking-[0.14em] text-ink">
                {h.entry.title}
              </h2>
              <span aria-hidden="true" className="h-px w-12 bg-line sm:w-20" />
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {h.entry.paths.map((p, i) => (
              <Reveal key={p.id} delay={260 + i * 100} className="h-full">
                <EntryPathCard path={{ ...p, icon: p.icon as PathIcon }} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={340}>
            <PrivacyNote>{h.privacy}</PrivacyNote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HeroEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent-deep">
      <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full border border-accent-deep/30 bg-accent-soft">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <path d="M8 1.5 13 3.5v4c0 3.2-2 5.6-5 7-3-1.4-5-3.8-5-7v-4L8 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="m5.5 8 1.7 1.7L10.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {children}
    </p>
  );
}

function DecisionDefensibilityPanel() {
  const d = marketing.hero.defensibility;
  return (
    <div className="w-full max-w-md overflow-hidden rounded-md border border-line bg-surface shadow-panel-lg">
      {/* header */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-paper/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-accent">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5 13 3.5v4c0 3.2-2 5.6-5 7-3-1.4-5-3.8-5-7v-4L8 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              <path d="m5.5 8 1.7 1.7L10.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-[12px] font-semibold tracking-wide text-ink">{d.title}</span>
        </div>
        <span className="border border-line bg-surface px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted">
          {d.topLabel}
        </span>
      </div>

      <div className="px-4 pt-2.5">
        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-faint">{d.illustrative}</span>
      </div>

      <ul className="space-y-2 p-4">
        {d.rows.map((r) => (
          <li key={r.q} className="flex items-center gap-3">
            <span aria-hidden="true" className={cn("h-2 w-2 shrink-0 rounded-full", STATUS_DOT[r.status as Status])} />
            <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
              <span className="truncate text-[12.5px] font-medium text-ink">{r.q}</span>
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-faint">
                {r.status}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* footer */}
      <div className="flex items-center justify-between gap-3 border-t border-line bg-paper/60 px-4 py-2.5">
        <EvidenceStats variant="compact" />
        <Link
          href={d.learnMore.href}
          className="group inline-flex items-center gap-1 text-[11.5px] font-semibold text-accent-deep transition-colors hover:text-ink"
        >
          {d.learnMore.label}
          <ArrowIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

function EntryPathCard({ path }: { path: { number: string; title: string; desc: string; time: string; cta: string; href: string; icon: PathIcon } }) {
  return (
    <Link
      href={path.href}
      className="group flex h-full flex-col border border-line bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/40 hover:shadow-panel"
    >
      <div className="flex items-start justify-between">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-deep transition-transform duration-200 group-hover:scale-105"
        >
          <PathIconComponent icon={path.icon} />
        </span>
        <span className="font-mono text-[11px] font-bold text-faint">{path.number}</span>
      </div>
      <h3 className="mt-4 text-[16px] font-semibold tracking-tight text-ink">{path.title}</h3>
      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">{path.desc}</p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {path.time}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink transition-colors group-hover:text-accent-deep">
          {path.cta}
          <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function PathIconComponent({ icon }: { icon: PathIcon }) {
  const base = { width: 18, height: 18, viewBox: "0 0 18 18", fill: "none" } as const;
  if (icon === "compass") {
    return (
      <svg {...base} aria-hidden="true">
        <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M12.2 5.8 10.9 10.9 5.8 12.2 7.1 7.1z" fill="currentColor" />
      </svg>
    );
  }
  if (icon === "check-square") {
    return (
      <svg {...base} aria-hidden="true">
        <rect x="2.5" y="2.5" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="m5.5 9 2 2 4-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg {...base} aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m11.5 11.5 3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PrivacyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-8 flex items-center justify-center gap-2 text-center text-[12px] text-muted">
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {children}
    </p>
  );
}
