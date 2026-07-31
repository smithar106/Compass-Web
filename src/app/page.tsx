import { DecisionEntry } from "@/components/home/DecisionEntry";
import { Pillars } from "@/components/home/Pillars";
import { LiveRecommendation } from "@/components/home/LiveRecommendation";
import { SearchRecommendations } from "@/components/home/SearchRecommendations";
import { Trust } from "@/components/home/Trust";
import { Founder } from "@/components/home/Founder";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <DecisionEntry />
      <Pillars />
      <LiveRecommendation />
      <SearchRecommendations />
      <Trust />
      <Founder />
      <FinalCta />
    </>
  );
}
