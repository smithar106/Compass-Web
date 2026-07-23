import type { AssessmentQuestion } from "@/types";

export const questions: AssessmentQuestion[] = [
  // Phase 1: Understand the operational problem
  { id: "situation", section: "Problem", category: "situation", question: "Which statement best describes your situation?", type: "multi-choice", chip: true, options: [
    "My sales team is missing inbound calls because we lack capacity",
    "Our reporting team spends too much time building manual reports",
    "Customer support agents repeat the same work every day",
    "Our onboarding process doesn\u2019t scale",
    "Our finance team manually reconciles invoices",
    "Our contracts take too long to review",
    "Something else",
  ]},
  { id: "dept", section: "Problem", category: "department", question: "Which department owns this workflow?", type: "multi-choice", chip: true, options: ["Sales", "Marketing", "Customer Success", "Support", "Finance", "Product", "Engineering", "People/HR", "Legal", "Operations"] },

  // Phase 2: Understand current workflow (adaptive by department)
  { id: "workflow-type", section: "Workflow", category: "workflow", question: "How would you describe the current workflow?", type: "multi-choice", chip: true, options: [
    "Entirely manual \u2014 people pass information between tools",
    "Mostly manual with some spreadsheets or email",
    "Partially automated with existing software",
    "Mostly automated but results are unreliable",
    "We don\u2019t have a clear process at all",
  ]},
  { id: "frequency", section: "Workflow", category: "frequency", question: "How often does this workflow run?", type: "multi-choice", chip: true, options: ["Multiple times daily", "Daily", "Weekly", "Monthly", "Quarterly", "Occasionally"] },
  { id: "people", section: "Workflow", category: "people", question: "How many people are involved?", type: "multi-choice", chip: true, options: ["1 person", "2\u20133 people", "4\u201310 people", "11\u201350 people", "50+ people"] },
  { id: "handoffs", section: "Workflow", category: "handoffs", question: "How many handoffs occur in this process?", type: "multi-choice", chip: true, options: ["None \u2014 one person owns it", "1\u20132 handoffs", "3\u20135 handoffs", "6+ handoffs", "Unclear / varies"] },

  // Phase 3: Understand constraints
  { id: "tools", section: "Constraints", category: "tools", question: "What tools or software do you currently use here?", type: "multi-choice", chip: true, options: ["Spreadsheets & email only", "A dedicated platform or CRM", "Custom-built software", "A mix of tools with no central system", "Nothing formal yet"] },
  { id: "exceptions", section: "Constraints", category: "exceptions", question: "How many exceptions or edge cases arise in this process?", type: "multi-choice", chip: true, options: ["Almost no exceptions", "Some exceptions (<10%)", "Many exceptions (10\u201330%)", "Highly variable (30%+)"] },
  { id: "budget", section: "Constraints", category: "budget", question: "Do you have a budget for addressing this?", type: "multi-choice", chip: true, options: ["No dedicated budget", "Under $10K", "$10K \u2013 $50K", "$50K \u2013 $200K", "$200K+", "Unsure"] },
  { id: "timeline", section: "Constraints", category: "timeline", question: "What is your expected timeline for improvement?", type: "multi-choice", chip: true, options: ["Immediate \u2014 within weeks", "Short-term \u2014 1\u20133 months", "Medium-term \u2014 3\u20136 months", "Long-term \u2014 6+ months", "No specific timeline"] },

  // Phase 4: Define success
  { id: "risk", section: "Outcome", category: "risk", question: "What is the risk of getting this wrong?", type: "multi-choice", chip: true, options: ["Low \u2014 minor inconvenience", "Medium \u2014 noticeable business impact", "High \u2014 significant revenue or compliance risk", "Critical \u2014 legal or safety implications"] },
  { id: "stability", section: "Outcome", category: "stability", question: "How stable is this process?", type: "multi-choice", chip: true, options: ["Very stable \u2014 unchanged in years", "Mostly stable \u2014 minor tweaks", "Somewhat volatile \u2014 changes every few months", "Highly volatile \u2014 changes frequently"] },
  { id: "prior-attempts", section: "Outcome", category: "prior-attempts", question: "Have you tried to improve this before?", type: "multi-choice", chip: true, options: ["Yes, and it worked partially", "Yes, but it failed", "No, this is the first time", "We\u2019ve discussed it but haven\u2019t started"] },
  { id: "desired-outcome", section: "Outcome", category: "desired-outcome", question: "What outcome matters most to you?", type: "multi-choice", chip: true, options: ["Reduce time spent on this workflow", "Improve accuracy or quality", "Scale without adding headcount", "Reduce cost or waste", "Improve team satisfaction", "Compliance or risk reduction"] },
];