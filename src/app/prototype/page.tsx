import type { Metadata } from "next";
import { PrototypeAssessment } from "@/components/prototype/PrototypeAssessment";

export const metadata: Metadata = {
  title: "Compass Decision Prototype",
};

export default function PrototypePage() {
  return <PrototypeAssessment />;
}
