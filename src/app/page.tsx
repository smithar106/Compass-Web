import { DecisionEntry } from "@/components/home/DecisionEntry";
import { Category } from "@/components/home/Category";
import { Pillars } from "@/components/home/Pillars";
import { LiveRecommendation } from "@/components/home/LiveRecommendation";
import { SearchRecommendations } from "@/components/home/SearchRecommendations";
import { Differentiation } from "@/components/home/Differentiation";
import { Founder } from "@/components/home/Founder";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <DecisionEntry />
      <Category />
      <Pillars />
      <LiveRecommendation />
      <SearchRecommendations />
      <Differentiation />
      <Founder />
      <FinalCta />
    </>
  );
}
