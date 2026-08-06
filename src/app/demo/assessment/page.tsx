import type { Metadata } from "next";
import { DemoAssessment } from "@/components/demo/DemoAssessment";

export const metadata: Metadata = {
  title: "Demo Assessment — Compass",
  robots: { index: false, follow: false },
};

export default function DemoAssessmentPage() {
  return (
    <div>
      <h1 className="text-center text-[22px] font-semibold tracking-tight text-ink sm:text-[24px]">
        Try the assessment
      </h1>
      <p className="mx-auto mt-2 max-w-md text-center text-[13.5px] leading-relaxed text-muted">
        The same questions a Compass customer answers — shown here with demo data.
      </p>
      <DemoAssessment />
    </div>
  );
}
