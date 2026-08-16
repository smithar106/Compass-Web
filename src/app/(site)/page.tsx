import type { Metadata } from "next";
import { metadata as siteMetadata } from "@/content/marketing";
import { HomeHero } from "@/components/home/HomeHero";
import { NotEveryProblemNeedsAi } from "@/components/home/NotEveryProblemNeedsAi";
import { EvidenceGraph } from "@/components/home/EvidenceGraph";
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
      <NotEveryProblemNeedsAi />
      <EvidenceGraph />
      <HomeCta />
    </>
  );
}