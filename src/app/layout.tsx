import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { name, metadata as siteMetadata } from "@/content/marketing";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    type: "website",
    siteName: name,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%230E1722'/><polygon points='16,4 20,14 30,14 22,20 25,30 16,24 7,30 10,20 2,14 12,14' fill='%23C7F246' opacity='0.95'/><circle cx='16' cy='16' r='3' fill='%230E1722'/></svg>" />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
