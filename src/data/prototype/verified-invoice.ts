/**
 * Verified evidence set — Manual invoice processing.
 *
 * IMPORTANT: this file distinguishes TWO independent dimensions:
 *
 *   verification  — SOURCE dimension. Is the document authentic and does it
 *                   contain the cited claim? (source_authentic +
 *                   document_verified + claim_verified)
 *
 *   comparability — RELEVANCE dimension. Does the record document an actual
 *                   implementation of the recommended intervention, and does the
 *                   source attribute the outcome to it?
 *
 * A record can be claim_verified (source) while being only indirect_contextual
 * or not_relevant (comparability). Comparability is never used to overwrite
 * source verification, and source verification never implies comparability.
 *
 * Audit: docs/verified-brief-comparability-audit.md — finding: NONE of these
 * records is direct implementation evidence for "automated invoice capture with
 * exception-based review". They are verified CONTEXT, not verified comparable
 * implementation outcomes.
 *
 * Verification performed 2026-08-24 by fetching each source URL and locating the
 * quoted passage verbatim. `passage` is a short snippet of the source text.
 */

export interface VerifiedMetric {
  label: string;
  value: string;
  direction: "reduction" | "increase" | "volume" | "scale";
  passage: string;
}

export type Comparability =
  | "direct_implementation"
  | "indirect_contextual"
  | "not_relevant";

export interface VerifiedEvidence {
  id: string;
  organization: string;
  /** What the record describes. */
  intervention: string;
  /** What the source actually establishes (post-audit). */
  whatItEstablishes: string;
  metrics: VerifiedMetric[];
  source: {
    title: string;
    url: string;
    type: "SEC filing" | "SEC exhibit (earnings release)";
    date: string;
  };
  /** SOURCE dimension — unchanged by the comparability audit. */
  verification: {
    status: "claim_verified";
    sourceAuthentic: boolean;
    documentRetrieved: boolean;
    passageMatched: boolean;
    verifiedAt: string;
  };
  /** RELEVANCE dimension — assessed against the decision being evaluated. */
  comparability: {
    classification: Comparability;
    /** Does the source document an actual implementation of the intervention? */
    documentsImplementation: boolean;
    /** Does the source attribute the outcome to the intervention? */
    establishesInterventionOutcome: boolean;
  };
  selectionReason: string;
}

export const VERIFIED_INVOICE_EVIDENCE: VerifiedEvidence[] = [
  {
    id: "direct-insite-2010",
    organization: "Direct Insite Corp.",
    intervention: "Global electronic invoice (e-invoice) presentment and payment",
    whatItEstablishes: "The provider's own e-invoicing platform scale.",
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
    comparability: {
      classification: "indirect_contextual",
      documentsImplementation: false,
      establishesInterventionOutcome: false,
    },
    selectionReason: "Verified primary source; establishes e-invoicing platform scale (context, not comparable outcome).",
  },
  {
    id: "checkfree-2001",
    organization: "CheckFree Corporation",
    intervention: "Electronic billing and payment (E-Bill) platform",
    whatItEstablishes: "The provider's own operating scale and consumer reach.",
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
    comparability: {
      classification: "indirect_contextual",
      documentsImplementation: false,
      establishesInterventionOutcome: false,
    },
    selectionReason: "Verified primary source; establishes e-billing adoption (context, not comparable outcome).",
  },
  {
    id: "checkfree-2002",
    organization: "CheckFree Corporation",
    intervention: "Electronic Commerce division scale-up",
    whatItEstablishes: "The provider's own transaction growth.",
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
    comparability: {
      classification: "indirect_contextual",
      documentsImplementation: false,
      establishesInterventionOutcome: false,
    },
    selectionReason: "Verified primary source; establishes e-billing growth (context, not comparable outcome).",
  },
  {
    id: "heartland-q3-2011",
    organization: "Heartland Payment Systems, Inc.",
    intervention: "Card-payment processing & servicing efficiency program",
    whatItEstablishes: "Card-payment processing efficiency; not invoice processing.",
    metrics: [
      {
        label: "Processing & servicing expenses (share of net revenue)",
        value: "record-low 43.6%",
        direction: "reduction",
        passage: "Efficiency improvements reduced processing and servicing expenses to a record-low 43.6% of net revenue.",
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
    comparability: {
      classification: "not_relevant",
      documentsImplementation: false,
      establishesInterventionOutcome: false,
    },
    selectionReason: "Verified primary source, but concerns card-payment processing, not invoice automation.",
  },
  {
    id: "paybox-2017",
    organization: "Paybox Corp",
    intervention: "Working-capital platform (Order-to-Cash / Procure-to-Pay)",
    whatItEstablishes: "The provider's own SaaS platform scale.",
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
    comparability: {
      classification: "indirect_contextual",
      documentsImplementation: false,
      establishesInterventionOutcome: false,
    },
    selectionReason: "Verified primary source; establishes O2C/P2P platform scale (context, not comparable outcome).",
  },
  {
    id: "dover-supply-chain",
    organization: "Dover Corporation",
    intervention: "Global supply chain initiative (supplier consolidation, spend control)",
    whatItEstablishes: "A procurement / supply-chain cost program, adjacent to AP.",
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
    comparability: {
      classification: "indirect_contextual",
      documentsImplementation: false,
      establishesInterventionOutcome: false,
    },
    selectionReason: "Verified primary source; documents a supply-chain program, not invoice automation.",
  },
  {
    id: "rpm-map",
    organization: "RPM International Inc.",
    intervention: "MAP to Growth operational-improvement program",
    whatItEstablishes: "A broad multi-domain operational program.",
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
    comparability: {
      classification: "not_relevant",
      documentsImplementation: false,
      establishesInterventionOutcome: false,
    },
    selectionReason: "Verified primary source, but a multi-domain program; cannot be attributed to invoice automation.",
  },
];

/** Comparability summary for the brief header. */
export const VERIFIED_INVOICE_SUMMARY = {
  directImplementation: VERIFIED_INVOICE_EVIDENCE.filter(
    (e) => e.comparability.classification === "direct_implementation"
  ).length,
  indirectContextual: VERIFIED_INVOICE_EVIDENCE.filter(
    (e) => e.comparability.classification === "indirect_contextual"
  ).length,
  notRelevant: VERIFIED_INVOICE_EVIDENCE.filter(
    (e) => e.comparability.classification === "not_relevant"
  ).length,
};
