/**
 * Verified evidence set — Manual invoice processing (first fully verified brief).
 *
 * Every record here passed the strict verification bar against a PRIMARY source:
 *   1. source_authentic   — a resolvable SEC filing / primary document on a
 *                           trusted host (sec.gov)
 *   2. document_verified  — the document was retrieved and the passage located
 *   3. claim_verified     — the exact supporting passage is present in the
 *                           source and states the claim as characterized
 *
 * Verification was performed on 2026-08-24 by fetching each source URL and
 * locating the quoted passage verbatim. `passage` is a short paraphrase/snippet
 * of the source text (not a full reproduction).
 *
 * This is a CURATED, deliberately small verified set — not the whole corpus.
 * Records that did not meet the bar are excluded. See docs/verified_brief.md.
 */

export interface VerifiedMetric {
  label: string;
  value: string;
  direction: "reduction" | "increase" | "volume" | "scale";
  /** Short snippet of the source text that supports this metric. */
  passage: string;
}

export interface VerifiedEvidence {
  id: string;
  organization: string;
  intervention: string;
  problem: string;
  metrics: VerifiedMetric[];
  source: {
    title: string;
    url: string;
    type: "SEC filing" | "SEC exhibit (earnings release)";
    date: string;
  };
  verification: {
    status: "claim_verified";
    sourceAuthentic: boolean;
    documentRetrieved: boolean;
    passageMatched: boolean;
    verifiedAt: string;
  };
  selectionReason: string;
}

export const VERIFIED_INVOICE_EVIDENCE: VerifiedEvidence[] = [
  {
    id: "direct-insite-2010",
    organization: "Direct Insite Corp.",
    intervention: "Global electronic invoice (e-invoice) presentment and payment",
    problem: "Manual invoice-to-order reconciliation and disputes",
    metrics: [
      {
        label: "Annual invoice volume processed",
        value: "25,000,000+ invoices",
        direction: "volume",
        passage: "Direct Insite processes more than 25 million invoices annually with an invoice value of $125 billion.",
      },
      {
        label: "Annual invoice value processed",
        value: "$125 billion",
        direction: "scale",
        passage: "…more than 25 million invoices annually with an invoice value of $125 billion.",
      },
    ],
    source: {
      title: "Direct Insite Corp. Form 10-K (FY2010)",
      url: "https://www.sec.gov/Archives/edgar/data/0000879703/000120180011000033/diri10k-dec312010.htm",
      type: "SEC filing",
      date: "2010-12-31",
    },
    verification: {
      status: "claim_verified",
      sourceAuthentic: true,
      documentRetrieved: true,
      passageMatched: true,
      verifiedAt: "2026-08-24",
    },
    selectionReason: "Primary-source SEC 10-K; exact invoice-volume and value passage present.",
  },
  {
    id: "checkfree-2001",
    organization: "CheckFree Corporation",
    intervention: "Electronic billing and payment (E-Bill) platform",
    problem: "Manual bill presentment and payment processing",
    metrics: [
      {
        label: "Consumers using electronic billing & payment",
        value: "5.2 million",
        direction: "scale",
        passage: "We provide electronic billing and payment services for over 5.2 million consumers as of June 30, 2001.",
      },
      {
        label: "Billers in production",
        value: "173 billers",
        direction: "scale",
        passage: "As of June 30, 2001, we have 173 billers in production and are delivering nearly 500,000 electronic bills monthly.",
      },
      {
        label: "Electronic bills delivered monthly",
        value: "~500,000",
        direction: "volume",
        passage: "…delivering nearly 500,000 electronic bills monthly.",
      },
      {
        label: "Transactions processed (FY2001)",
        value: "231 million+",
        direction: "volume",
        passage: "…for the year ended June 30, 2001, we processed over 231 million transactions.",
      },
    ],
    source: {
      title: "CheckFree Corporation Form 10-K (FY2001)",
      url: "https://www.sec.gov/Archives/edgar/data/0000949341/000095015201504724/l90431ae10-k.txt",
      type: "SEC filing",
      date: "2001-06-30",
    },
    verification: {
      status: "claim_verified",
      sourceAuthentic: true,
      documentRetrieved: true,
      passageMatched: true,
      verifiedAt: "2026-08-24",
    },
    selectionReason: "Primary-source SEC 10-K; consumer, biller, and transaction passages present.",
  },
  {
    id: "checkfree-2002",
    organization: "CheckFree Corporation",
    intervention: "Electronic Commerce division expansion (e-billing scale-up)",
    problem: "Scaling electronic bill delivery and payment",
    metrics: [
      {
        label: "Transactions processed (FY2002)",
        value: "316 million",
        direction: "volume",
        passage: "For the year ended June 30, 2002, we processed approximately 316 million transactions, and delivered approximately 10.8 million electronic bills.",
      },
      {
        label: "Transaction growth (YoY)",
        value: "36%+",
        direction: "increase",
        passage: "For the year ended June 30, 2002, growth in the number of transactions exceeded 36%.",
      },
      {
        label: "Electronic bills delivered (FY2002)",
        value: "10.8 million",
        direction: "volume",
        passage: "…delivered approximately 10.8 million electronic bills.",
      },
      {
        label: "Consumers enabled",
        value: "6.6 million+",
        direction: "scale",
        passage: "As of June 30, 2002, over 6.6 million consumers were enabled to use our systems…",
      },
    ],
    source: {
      title: "CheckFree Corporation Form 10-K (FY2002)",
      url: "https://www.sec.gov/Archives/edgar/data/0000949341/000095015202007199/l96244ae10vk.txt",
      type: "SEC filing",
      date: "2002-06-30",
    },
    verification: {
      status: "claim_verified",
      sourceAuthentic: true,
      documentRetrieved: true,
      passageMatched: true,
      verifiedAt: "2026-08-24",
    },
    selectionReason: "Primary-source SEC 10-K; transaction growth and delivery passages present.",
  },
  {
    id: "heartland-q3-2011",
    organization: "Heartland Payment Systems, Inc.",
    intervention: "Processing and servicing efficiency program",
    problem: "High processing and servicing cost as a share of net revenue",
    metrics: [
      {
        label: "Processing & servicing expenses (share of net revenue)",
        value: "record-low 43.6%",
        direction: "reduction",
        passage: "Efficiency improvements reduced processing and servicing expenses to a record-low 43.6% of net revenue.",
      },
      {
        label: "Operating margin on net revenue",
        value: "17.7% (from 12.3%)",
        direction: "increase",
        passage: "Operating margin on net revenue of 17.7% compared to 12.3% for the same quarter in 2010.",
      },
    ],
    source: {
      title: "Heartland Payment Systems Q3 2011 earnings release (SEC 8-K exhibit)",
      url: "https://www.sec.gov/Archives/edgar/data/0001144354/000114435411000041/exhibit991newsrelease.htm",
      type: "SEC exhibit (earnings release)",
      date: "2011-09-30",
    },
    verification: {
      status: "claim_verified",
      sourceAuthentic: true,
      documentRetrieved: true,
      passageMatched: true,
      verifiedAt: "2026-08-24",
    },
    selectionReason: "Primary-source SEC exhibit; efficiency and operating-margin passages present.",
  },
  {
    id: "paybox-2017",
    organization: "Paybox Corp",
    intervention: "Unified working capital management platform (Order-to-Cash / Procure-to-Pay)",
    problem: "Manual order-to-cash and procure-to-pay processing",
    metrics: [
      {
        label: "Annual transaction value facilitated",
        value: "$160 billion+",
        direction: "scale",
        passage: "…platform for Order-to-Cash and Procure-to-Pay processes that facilitate over $160 billion worth of transactions annually…",
      },
      {
        label: "Companies using the platform",
        value: "375,000+",
        direction: "scale",
        passage: "…between more than 375,000 companies worldwide.",
      },
    ],
    source: {
      title: "Paybox Corp Form 10-K",
      url: "https://www.sec.gov/Archives/edgar/data/0000879703/000165495417002714/pbox_10k.htm",
      type: "SEC filing",
      date: "2017-12-31",
    },
    verification: {
      status: "claim_verified",
      sourceAuthentic: true,
      documentRetrieved: true,
      passageMatched: true,
      verifiedAt: "2026-08-24",
    },
    selectionReason: "Primary-source SEC 10-K; transaction-value and company-count passages present.",
  },
  {
    id: "dover-supply-chain",
    organization: "Dover Corporation",
    intervention: "Global supply chain initiative (supplier consolidation, spend control)",
    problem: "Fragmented supplier base and unconsolidated spend",
    metrics: [
      {
        label: "Supply chain savings",
        value: "6–7%",
        direction: "reduction",
        passage: "Several waves completed, 6%-7% savings will be achieved. Significantly reduced supplier count, consolidated spend.",
      },
    ],
    source: {
      title: "Dover Corporation Global Supply Chain Initiative (SEC exhibit)",
      url: "https://www.sec.gov/Archives/edgar/data/0000029905/000095012310105320/y87692exv99w1.htm",
      type: "SEC exhibit (earnings release)",
      date: "2010-10-21",
    },
    verification: {
      status: "claim_verified",
      sourceAuthentic: true,
      documentRetrieved: true,
      passageMatched: true,
      verifiedAt: "2026-08-24",
    },
    selectionReason: "Primary-source SEC exhibit; savings-range passage present.",
  },
  {
    id: "rpm-map",
    organization: "RPM International Inc.",
    intervention: "MAP to Growth operating-improvement program",
    problem: "Operating inefficiency across acquired businesses",
    metrics: [
      {
        label: "Annualized run-rate MAP savings",
        value: "$320 million",
        direction: "reduction",
        passage: "MAP to Growth Annualized Run Rate $320 (in millions) — MAP Savings.",
      },
    ],
    source: {
      title: "RPM International MAP to Growth results (SEC exhibit)",
      url: "https://www.sec.gov/Archives/edgar/data/0000110621/000119312522259185/d395915dex991.htm",
      type: "SEC exhibit (earnings release)",
      date: "2022-07-25",
    },
    verification: {
      status: "claim_verified",
      sourceAuthentic: true,
      documentRetrieved: true,
      passageMatched: true,
      verifiedAt: "2026-08-24",
    },
    selectionReason: "Primary-source SEC exhibit; annualized run-rate savings passage present.",
  },
];
