import type { Metadata } from "next";
import { metadata as siteMetadata } from "@/content/marketing";
import { HomeHero } from "@/components/home/HomeHero";
import { Problem } from "@/components/home/Problem";
import { ImplementationReality } from "@/components/marketing/ImplementationReality";
import { WhyCompass } from "@/components/home/WhyCompass";
import { ExecutiveBrief } from "@/components/home/ExecutiveBrief";
import { ImplementationIntelligence } from "@/components/home/ImplementationIntelligence";
import { HomeCta } from "@/components/home/HomeCta";

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    type: "website",
    siteName: "Compass",
  },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Problem />
      <ImplementationReality />
      <WhyCompass />
      <ExecutiveBrief />
      <ImplementationIntelligence />
      <HomeCta />
    </>
  );
}
