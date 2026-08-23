import type { Metadata } from "next";
import { PrototypeAssessment } from "@/components/prototype/PrototypeAssessment";

export const metadata: Metadata = {
  title: "Compass Decision Prototype",
};

export default function PrototypeProblemPage({
  params,
  searchParams,
}: {
  params: { problemId: string };
  searchParams?: { view?: string };
}) {
  const view = searchParams?.view === "decision" ? "decision" : "context";
  return <PrototypeAssessment initialProblemId={params.problemId} view={view} />;
}
