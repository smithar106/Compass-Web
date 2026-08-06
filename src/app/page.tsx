import { HomeHero } from "@/components/home/HomeHero";
import { Problem } from "@/components/home/Problem";
import { HowCompassWorks } from "@/components/home/HowCompassWorks";
import { ImplementationIntelligence } from "@/components/home/ImplementationIntelligence";
import { ExecutiveBrief } from "@/components/home/ExecutiveBrief";
import { HomeScreenshots } from "@/components/home/HomeScreenshots";
import { HomeCta } from "@/components/home/HomeCta";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Problem />
      <HowCompassWorks />
      <ImplementationIntelligence />
      <ExecutiveBrief />
      <HomeScreenshots />
      <HomeCta />
    </>
  );
}
