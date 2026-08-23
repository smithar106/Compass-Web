/**
 * Compass Decision prototype — problem library.
 *
 * Ten common operational problems, each with the context questions the
 * prototype asks on Screen 2. Context answers are used deterministically by
 * the recommendation layer (`src/lib/prototype/recommendation.ts`) to tune
 * illustrative impact/timeline values — never to fabricate evidence.
 */

export interface ContextQuestion {
  id: string;
  label: string;
  options: string[];
}

export interface PrototypeProblem {
  id: string;
  name: string;
  category: string;
  description: string;
  /** Lightweight context questions asked on Screen 2. */
  context: ContextQuestion[];
}

export const PROBLEM_LIBRARY: PrototypeProblem[] = [
  {
    id: "slow-customer-onboarding",
    name: "Slow customer onboarding",
    category: "Onboarding",
    description: "New customers take too long to reach full value.",
    context: [
      {
        id: "org-size",
        label: "How large is your organization?",
        options: ["Under 50 people", "50–500", "500–2,000", "2,000+"],
      },
      {
        id: "onboard-volume",
        label: "How many customers onboard per month?",
        options: ["Under 25", "25–100", "100–500", "500+"],
      },
      {
        id: "primary-objective",
        label: "What matters most?",
        options: ["Faster time-to-value", "Less manual effort", "Fewer errors", "Consistent process"],
      },
    ],
  },
  {
    id: "manual-invoice-processing",
    name: "Too much manual invoice processing",
    category: "Finance",
    description: "Finance capacity is consumed by manual invoice handling.",
    context: [
      {
        id: "org-size",
        label: "How large is your organization?",
        options: ["Under 50 people", "50–500", "500–2,000", "2,000+"],
      },
      {
        id: "invoice-volume",
        label: "How many invoices do you process per month?",
        options: ["Under 500", "500–2,000", "2,000–10,000", "10,000+"],
      },
      {
        id: "primary-objective",
        label: "What matters most?",
        options: ["Lower processing cost", "Faster cycle time", "Fewer errors", "Audit readiness"],
      },
    ],
  },
  {
    id: "misrouted-support",
    name: "Support requests routed incorrectly",
    category: "Support",
    description: "Tickets are misrouted, delaying resolution and frustrating customers.",
    context: [
      {
        id: "org-size",
        label: "How large is your organization?",
        options: ["Under 50 people", "50–500", "500–2,000", "2,000+"],
      },
      {
        id: "ticket-volume",
        label: "How many tickets arrive per week?",
        options: ["Under 200", "200–1,000", "1,000–5,000", "5,000+"],
      },
      {
        id: "current-approach",
        label: "How are tickets routed today?",
        options: ["Manual, by whoever answers", "Rules by department", "Mix of tools", "Automated but inaccurate"],
      },
    ],
  },
  {
    id: "trapped-knowledge",
    name: "Knowledge trapped across documents",
    category: "Knowledge",
    description: "Answers live in spreadsheets and documents no one can search.",
    context: [
      {
        id: "org-size",
        label: "How large is your organization?",
        options: ["Under 50 people", "50–500", "500–2,000", "2,000+"],
      },
      {
        id: "knowledge-sources",
        label: "Where does the knowledge live?",
        options: ["Spreadsheets and email", "Docs + wikis", "Multiple tools", "Tribal knowledge"],
      },
      {
        id: "primary-objective",
        label: "What matters most?",
        options: ["Faster answers", "Fewer repeat questions", "Consistency", "Onboarding"],
      },
    ],
  },
  {
    id: "sales-handoff-rework",
    name: "Sales-to-implementation rework",
    category: "Handoffs",
    description: "Handoffs between sales and delivery require too much rework.",
    context: [
      {
        id: "org-size",
        label: "How large is your organization?",
        options: ["Under 50 people", "50–500", "500–2,000", "2,000+"],
      },
      {
        id: "handoff-volume",
        label: "How many handoffs happen per month?",
        options: ["Under 20", "20–100", "100–500", "500+"],
      },
      {
        id: "primary-objective",
        label: "What matters most?",
        options: ["Less rework", "Faster kickoff", "Fewer dropped details", "Predictability"],
      },
    ],
  },
  {
    id: "repetitive-reporting",
    name: "Too much repetitive reporting",
    category: "Reporting",
    description: "Employees spend hours assembling the same reports by hand.",
    context: [
      {
        id: "org-size",
        label: "How large is your organization?",
        options: ["Under 50 people", "50–500", "500–2,000", "2,000+"],
      },
      {
        id: "report-volume",
        label: "How many reports are built per month?",
        options: ["Under 10", "10–50", "50–200", "200+"],
      },
      {
        id: "primary-objective",
        label: "What matters most?",
        options: ["Returned hours", "Faster delivery", "Consistent numbers", "Self-service"],
      },
    ],
  },
  {
    id: "late-escalations",
    name: "Escalations identified too late",
    category: "Customer Risk",
    description: "At-risk customers are spotted only after revenue is already at risk.",
    context: [
      {
        id: "org-size",
        label: "How large is your organization?",
        options: ["Under 50 people", "50–500", "500–2,000", "2,000+"],
      },
      {
        id: "customer-base",
        label: "How large is your customer base?",
        options: ["Under 100", "100–1,000", "1,000–10,000", "10,000+"],
      },
      {
        id: "primary-objective",
        label: "What matters most?",
        options: ["Early warning", "Less churn", "Faster response", "Visibility"],
      },
    ],
  },
  {
    id: "manual-forecasting",
    name: "Forecasting requires too much manual work",
    category: "Planning",
    description: "Forecasts are assembled by hand in spreadsheets and go stale quickly.",
    context: [
      {
        id: "org-size",
        label: "How large is your organization?",
        options: ["Under 50 people", "50–500", "500–2,000", "2,000+"],
      },
      {
        id: "forecast-cadence",
        label: "How often is the forecast rebuilt?",
        options: ["Weekly", "Monthly", "Quarterly", "Ad hoc"],
      },
      {
        id: "primary-objective",
        label: "What matters most?",
        options: ["Faster cycles", "More accurate", "Less manual work", "Scenario planning"],
      },
    ],
  },
  {
    id: "hard-to-find-information",
    name: "Teams can't find accurate information",
    category: "Knowledge",
    description: "Employees waste time searching for internal information that exists.",
    context: [
      {
        id: "org-size",
        label: "How large is your organization?",
        options: ["Under 50 people", "50–500", "500–2,000", "2,000+"],
      },
      {
        id: "search-frequency",
        label: "How often do people search for internal answers?",
        options: ["Occasionally", "Daily", "Multiple times a day", "Constantly"],
      },
      {
        id: "primary-objective",
        label: "What matters most?",
        options: ["Faster answers", "Fewer interruptions", "Trustworthy sources", "Consistency"],
      },
    ],
  },
  {
    id: "slow-employee-ramp",
    name: "New employees take too long to become productive",
    category: "Onboarding",
    description: "Time-to-productivity for new hires is too long and too inconsistent.",
    context: [
      {
        id: "org-size",
        label: "How large is your organization?",
        options: ["Under 50 people", "50–500", "500–2,000", "2,000+"],
      },
      {
        id: "hire-volume",
        label: "How many people onboard per year?",
        options: ["Under 10", "10–50", "50–200", "200+"],
      },
      {
        id: "primary-objective",
        label: "What matters most?",
        options: ["Faster ramp", "Consistent experience", "Less mentor load", "Retention"],
      },
    ],
  },
];

export function problemById(id: string): PrototypeProblem | undefined {
  return PROBLEM_LIBRARY.find((p) => p.id === id);
}

/** "Something else" routes to the free-form Analyze a Problem experience. */
export const FREE_FORM_ROUTE = "/assessment";
