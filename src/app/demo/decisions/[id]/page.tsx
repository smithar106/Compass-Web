import type { Metadata } from "next";
import Link from "next/link";
import { decisionById } from "@/data/demo-data";
import { DecisionDetail } from "@/components/demo/DecisionDetail";

export const metadata: Metadata = {
  title: "Compass Demo — Decision",
  robots: { index: false, follow: false },
};

export default function DemoDecisionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const decision = decisionById(params.id);

  if (!decision) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-[20px] font-semibold tracking-tight text-ink">Decision not found</h1>
        <p className="mt-2 text-[13.5px] text-muted">
          This demo decision does not exist. Choose one from the portfolio.
        </p>
        <Link
          href="/demo/decisions"
          className="mt-6 inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-[13.5px] font-semibold text-paper transition-colors hover:bg-ink2"
        >
          Back to decisions
        </Link>
      </div>
    );
  }

  return <DecisionDetail decision={decision} />;
}
