import type { AssessmentQuestion } from "@/types";

/**
 * Department-specific problem statements for the "situation" question.
 * The situation answer becomes the engine's `problem_statement`, so it must
 * reflect the department the user already selected — not a generic list.
 * Each department maps to concrete, department-appropriate problems.
 */
export const DEPARTMENT_SITUATIONS: Record<string, string[]> = {
  Sales: [
    "My sales team is missing inbound calls because we lack capacity",
    "Leads go cold because follow-up is too slow",
    "Reps spend more time on admin than selling",
    "Quotes take too long to turn around",
  ],
  Marketing: [
    "Campaigns take too long to launch",
    "Lead handoff to sales is inconsistent",
    "We can't tell which channels actually convert",
    "Content production doesn't scale",
  ],
  Operations: [
    "Order fulfillment has too many manual steps",
    "Work gets stuck between teams with no visibility",
    "Too many handoffs slow everything down",
    "Reporting takes days to assemble manually",
  ],
  Finance: [
    "Our finance team manually reconciles invoices",
    "Month-end close takes too long",
    "Approvals are slow and manual",
    "Financial reporting is error-prone",
  ],
  HR: [
    "Onboarding is slow and inconsistent",
    "Recruiting coordination is manual",
    "Employee requests take too long to resolve",
    "Compliance tracking is manual",
  ],
  Support: [
    "Customer support agents repeat the same work every day",
    "Response times miss SLAs",
    "Ticket routing is inconsistent",
    "Escalations are hard to predict",
  ],
  Legal: [
    "Our contracts take too long to review",
    "Contract review backlog keeps growing",
    "We can't quickly find past contract terms",
  ],
  IT: [
    "Access requests are manual and slow",
    "Provisioning takes too long",
    "Incident response is reactive",
  ],
  Engineering: [
    "Deployments are manual and risky",
    "Code review is a bottleneck",
    "Incident response is slow and manual",
  ],
  "Supply Chain": [
    "Supplier coordination is manual",
    "Inventory tracking is unreliable",
    "Order fulfillment has too many handoffs",
  ],
  Manufacturing: [
    "Production scheduling is manual",
    "Quality checks are inconsistent",
    "Downtime reporting is slow",
  ],
};

const GENERIC_SITUATIONS = [
  "My sales team is missing inbound calls because we lack capacity",
  "Our reporting team spends too much time building manual reports",
  "Customer support agents repeat the same work every day",
  "Our onboarding process doesn't scale",
  "Our finance team manually reconciles invoices",
  "Our contracts take too long to review",
];

/**
 * Return the situation options for a given department, falling back to the
 * generic list when the department is unknown or unselected.
 */
export function situationOptionsFor(dept: string | undefined): string[] {
  if (dept && DEPARTMENT_SITUATIONS[dept]) return DEPARTMENT_SITUATIONS[dept];
  return GENERIC_SITUATIONS;
}

export const questions: AssessmentQuestion[] = [
  { id: "situation", section: "Problem", category: "situation", question: "Which statement best describes your situation?", type: "multi-choice", chip: true, options: GENERIC_SITUATIONS },
  { id: "dept", section: "Problem", category: "department", question: "Which department owns this workflow?", type: "multi-choice", chip: true, options: [
    "Sales", "Marketing", "Operations", "Finance", "HR",
    "Support", "Legal", "IT", "Engineering", "Supply Chain",
    "Manufacturing",
  ]},

  { id: "workflow-type", section: "Workflow", category: "workflow", question: "How would you describe the current workflow?", type: "multi-choice", chip: true, options: [
    "Entirely manual — people pass information between tools",
    "Mostly manual with some spreadsheets or email",
    "Partially automated with existing software",
    "Mostly automated but results are unreliable",
    "We don’t have a clear process at all",
  ]},
  { id: "frequency", section: "Workflow", category: "frequency", question: "How often does this workflow run?", type: "multi-choice", chip: true, options: [
    "Multiple times per hour", "Hourly", "Daily", "Weekly", "Monthly", "Quarterly", "Annually",
  ]},
  {
    id: "volume",
    section: "Workflow",
    category: "volume",
    question: "How many items does your team process per month?",
    type: "multi-choice",
    chip: true,
    options: ["Under 1,000", "1,000–5,000", "5,000–20,000", "20,000–100,000", "Over 100,000"],
  },
  {
    id: "handling-time",
    section: "Workflow",
    category: "handling-time",
    question: "How long does one item take to handle?",
    type: "multi-choice",
    chip: true,
    options: ["Under 15 minutes", "15–30 minutes", "30–60 minutes", "1–2 hours", "Over 2 hours"],
  },
  { id: "people", section: "Workflow", category: "people", question: "How many people are involved?", type: "multi-choice", chip: true, options: [
    "1", "2–3", "4–10", "11–25", "26–50", "51–100", "100+",
  ]},
  { id: "handoffs", section: "Workflow", category: "handoffs", question: "How many handoffs occur in this process?", type: "multi-choice", chip: true, options: [
    "None — one person owns it", "1–2 handoffs", "3–5 handoffs", "6+ handoffs", "Unclear / varies",
  ]},

  { id: "tools", section: "Constraints", category: "tools", question: "What tools or software do you currently use here?", type: "multi-choice", chip: true, options: [
    "Spreadsheets and email only",
    "A dedicated platform or CRM",
    "Custom-built software",
    "A mix of tools with no central system",
    "Nothing formal yet",
    "We use AI tools already",
  ]},
  { id: "exceptions", section: "Constraints", category: "exceptions", question: "How many exceptions or edge cases arise in this process?", type: "multi-choice", chip: true, options: [
    "Almost no exceptions", "Some exceptions (<10%)", "Many exceptions (10–30%)",
    "Highly variable (30%+)", "The entire process is exceptions",
  ]},
  {
    id: "loaded-cost",
    section: "Constraints",
    category: "loaded-cost",
    question: "What is the fully loaded cost of the team\u2019s time per hour?",
    type: "multi-choice",
    chip: true,
    options: ["Under $25", "$25\u2013$50", "$50\u2013$100", "$100\u2013$200", "Over $200"],
  },
  { id: "budget", section: "Constraints", category: "budget", question: "Do you have a budget for addressing this?", type: "multi-choice", chip: true, options: [
    "Under $10k", "$10k–25k", "$25k–50k", "$50k–100k", "$100k–250k", "$250k+",
  ]},
  { id: "timeline", section: "Constraints", category: "timeline", question: "What is your expected timeline for improvement?", type: "multi-choice", chip: true, options: [
    "Immediately", "30 days", "1–3 months", "3–6 months", "6–12 months", "Flexible",
  ]},

  { id: "risk", section: "Outcome", category: "risk", question: "What is the risk of getting this wrong?", type: "multi-choice", chip: true, options: [
    "Very Low — minor inconvenience",
    "Low — small impact",
    "Medium — noticeable business impact",
    "High — significant revenue or compliance risk",
    "Critical — legal or safety implications",
  ]},
  { id: "stability", section: "Outcome", category: "stability", question: "How stable is this process?", type: "multi-choice", chip: true, options: [
    "Very stable — unchanged in years",
    "Mostly stable — minor tweaks",
    "Somewhat volatile — changes every few months",
    "Highly volatile — changes frequently",
    "Brand new — still being defined",
  ]},
  { id: "prior-attempts", section: "Outcome", category: "prior-attempts", question: "Have you tried to improve this before?", type: "multi-choice", chip: true, options: [
    "Never attempted",
    "Internal project",
    "Software implementation",
    "Consultant engagement",
    "AI pilot",
    "Partial success",
    "Failed completely",
  ]},
  { id: "desired-outcome", section: "Outcome", category: "desired-outcome", question: "What outcome matters most to you?", type: "multi-choice", chip: true, options: [
    "Revenue growth",
    "Cost reduction",
    "Time savings",
    "Customer satisfaction",
    "Employee productivity",
    "Compliance",
    "Risk reduction",
    "Quality improvement",
    "Capacity / scale without headcount",
  ]},
  {
    id: "constraint",
    section: "Problem",
    category: "constraint",
    question: "What is actually preventing this workflow from performing better?",
    type: "multi-choice",
    chip: true,
    options: [
      "Insufficient capacity — we simply don't have enough people",
      "Too many errors — rework and quality issues",
      "Too slow — process takes too long, missing SLAs",
      "Inconsistent quality — varies between team members",
      "Too expensive — current cost is unsustainable",
      "Lack of visibility — can't track or measure performance",
      "Compliance / regulatory risk",
      "Unknown — we need to diagnose the root cause",
    ],
  },
  {
    id: "standardization",
    section: "Workflow",
    category: "standardization",
    question: "How standardized is the work?",
    type: "multi-choice",
    chip: true,
    options: [
      "Mostly repeatable — consistent steps every time",
      "Repeatable with exceptions — standard process with some edge cases",
      "Highly variable — different every time",
      "Requires significant judgment — decisions, not procedures",
    ],
  },
  {
    id: "failure-impact",
    section: "Outcome",
    category: "failure-impact",
    question: "What happens if the system or process gets it wrong?",
    type: "multi-choice",
    chip: true,
    options: [
      "Low impact — minor inconvenience, easily corrected",
      "Moderate operational impact — slows down the team",
      "Material financial or customer impact — costs money or loses customers",
      "Regulatory, safety, or legal implications — could expose the organization",
    ],
  },
];
