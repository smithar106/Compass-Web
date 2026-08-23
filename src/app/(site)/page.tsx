import type { Metadata } from "next";
import { metadata as siteMetadata } from "@/content/marketing";
import { HomeHero } from "@/components/home/HomeHero";
import { Problem } from "@/components/home/Problem";
import { Flow } from "@/components/home/Flow";
import { ExampleDecision } from "@/components/home/ExampleDecision";
import { WhyCompass } from "@/components/home/WhyCompass";
import { LearningLoop } from "@/components/home/LearningLoop";
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
      <Flow />
      <ExampleDecision />
      <WhyCompass />
      <LearningLoop />
      <HomeCta />
    </>
  );
}
