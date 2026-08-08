import Link from "next/link";
import { DEMO_ORG } from "@/data/demo-data";
import { ArrowIcon, Needle } from "@/components/home/primitives";

export function DemoBanner() {
  return (
    <div className="border-b border-line bg-paper">
      <p className="mx-auto flex w-full max-w-6xl items-center gap-2 px-5 py-2 text-[11.5px] font-medium text-muted sm:px-8">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-deep"
        />
        Demo environment — illustrative data. Not connected to production systems.
      </p>
    </div>
  );
}

export function ExecutiveHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <Needle className="h-6 w-6 text-ink" />
          <div>
            <p className="text-[17px] font-bold tracking-tight text-ink">{DEMO_ORG.name}</p>
            <p className="text-[12px] text-muted">
              Reporting period: <span className="font-medium text-ink">{DEMO_ORG.period}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="text-[12.5px] font-semibold text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
          >
            ← Home
          </Link>
          <Link
            href="/assessment"
            className="text-[12.5px] font-semibold text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
          >
            Real assessment
          </Link>
          <Link
            href="/demo/assessment"
            className="group inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-paper transition-colors hover:bg-ink2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
          >
            New Decision
            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
