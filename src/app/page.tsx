import { DecisionEntry } from "@/components/home/DecisionEntry";
import { Category } from "@/components/home/Category";
import { ConsultingRebuilt } from "@/components/home/ConsultingRebuilt";
import { Pillars } from "@/components/home/Pillars";
import { LiveRecommendation } from "@/components/home/LiveRecommendation";
import { CompoundingMoat } from "@/components/home/CompoundingMoat";
import { Founder } from "@/components/home/Founder";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <DecisionEntry />
      <Category />
      <ConsultingRebuilt />
      <Pillars />
      <LiveRecommendation />
      <CompoundingMoat />
      <Founder />
      <FinalCta />
    </>
  );
}
