import { Hero } from "@/components/how-it-works/Hero";
import { SectionNav } from "@/components/how-it-works/SectionNav";
import { ConsultingRebuilt } from "@/components/how-it-works/ConsultingRebuilt";
import { Methodology } from "@/components/how-it-works/Methodology";
import { EvidenceAdvantage } from "@/components/how-it-works/EvidenceAdvantage";
import { CompoundingLoop } from "@/components/how-it-works/CompoundingLoop";
import { FinalCta } from "@/components/how-it-works/FinalCta";

export default function HowItWorksPage() {
  return (
    <>
      <Hero />
      <SectionNav />
      <ConsultingRebuilt />
      <Methodology />
      <EvidenceAdvantage />
      <CompoundingLoop />
      <FinalCta />
    </>
  );
}
