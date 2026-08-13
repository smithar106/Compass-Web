import type { Metadata } from "next";
import { metadata as siteMetadata } from "@/content/marketing";
import { HomeHero } from "@/components/home/HomeHero";
import { WhyCompass } from "@/components/home/WhyCompass";
import { Differentiation } from "@/components/home/Differentiation";
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
      <WhyCompass />
      <Differentiation />
      <ExecutiveBrief />
      <ImplementationIntelligence />
      <HomeCta />
    </>
  );
}