import Link from "next/link";
import { controlRoom } from "@/content/marketing";

// One actual comparable implementation surfaced on the homepage.
const SAMPLE = {
  organization: "West Midlands Police",
  intervention: "Robotic Process Automation for duplicate records",
  result: "299K duplicates removed · 22,000 hours saved",
  source: "Verified source passage",
  verified: true,
};

export function EvidenceGraph() {
  const eg = controlRoom.evidenceGraph;
  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-20">
        <h2 className="text-[26px] font-semibold tracking-tight text-ink sm:text-[30px]">
          {eg.headline}
        </h2>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse">
            <thead>
              <tr>
                {eg.columns.map((col) => (
                  <th
                    key={col}
                    className="border-b border-line bg-paper px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-muted"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="transition-colors hover:bg-paper">
                <td className="border-b border-line px-4 py-4 text-[14px] font-semibold text-ink">
                  {SAMPLE.organization}
                </td>
                <td className="border-b border-line px-4 py-4 align-top text-[13px] text-ink">
                  {SAMPLE.intervention}
                </td>
                <td className="border-b border-line px-4 py-4 align-top text-[13px] text-ink">
                  {SAMPLE.result}
                </td>
                <td className="border-b border-line px-4 py-4 align-top">
                  <span className="inline-block border border-line bg-paper px-2 py-1 text-[11px] font-medium leading-tight text-muted">
                    {SAMPLE.source}
                  </span>
                </td>
                <td className="border-b border-line px-4 py-4 align-top whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-valid">
                    <span aria-hidden="true">✓</span> Claim verified
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-[14px] text-muted">
          Every recommendation carries the exact passage behind it.{" "}
          <Link href="/control-room" className="font-semibold text-ink underline decoration-accent underline-offset-4 hover:text-accent-deep">
            Open the Control Room
          </Link>
        </p>
      </div>
    </section>
  );
}
