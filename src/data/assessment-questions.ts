import type { AssessmentQuestion } from "@/types";

export const questions: AssessmentQuestion[] = [
  { id: "situation", section: "Problem", category: "situation", question: "Which statement best describes your situation?", type: "multi-choice", chip: true, options: [
    "My sales team is missing inbound calls because we lack capacity",
    "Our reporting team spends too much time building manual reports",
    "Customer support agents repeat the same work every day",
    "Our onboarding process doesn't scale",
    "Our finance team manually reconciles invoices",
    "Our contracts take too long to review",
    "Something else",
  ]},
  { id: "dept", section: "Problem", category: "department", question: "Which department owns this workflow?", type: "multi-choice", chip: true, options: [
    "Sales", "Marketing", "Customer Success", "Support", "Finance",
    "Product", "Engineering", "People/HR", "Legal", "Operations",
    "IT", "Supply Chain",
  ]},

  { id: "workflow-type", section: "Workflow", category: "workflow", question: "How would you describe the current workflow?", type: "multi-choice", chip: true, options: [
    "Entirely manual \u2014 people pass information between tools",
    "Mostly manual with some spreadsheets or email",
    "Partially automated with existing software",
    "Mostly automated but results are unreliable",
    "We don\u2019t have a clear process at all",
  ]},
  { id: "frequency", section: "Workflow", category: "frequency", question: "How often does this workflow run?", type: "multi-choice", chip: true, options: [
    "Multiple times per hour", "Hourly", "Daily", "Weekly", "Monthly", "Quarterly", "Annually",
  ]},
  { id: "people", section: "Workflow", category: "people", question: "How many people are involved?", type: "multi-choice", chip: true, options: [
    "1", "2\u20133", "4\u201310", "11\u201325", "26\u201350", "51\u2013100", "100+",
  ]},
  { id: "handoffs", section: "Workflow", category: "handoffs", question: "How many handoffs occur in this process?", type: "multi-choice", chip: true, options: [
    "None \u2014 one person owns it", "1\u20132 handoffs", "3\u20135 handoffs", "6+ handoffs", "Unclear / varies",
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
    "Almost no exceptions", "Some exceptions (<10%)", "Many exceptions (10\u201330%)",
    "Highly variable (30%+)", "The entire process is exceptions",
  ]},
  { id: "budget", section: "Constraints", category: "budget", question: "Do you have a budget for addressing this?", type: "multi-choice", chip: true, options: [
    "Under $10k", "$10k\u201325k", "$25k\u201350k", "$50k\u2013100k", "$100k\u2013250k", "$250k+",
  ]},
  { id: "timeline", section: "Constraints", category: "timeline", question: "What is your expected timeline for improvement?", type: "multi-choice", chip: true, options: [
    "Immediately", "30 days", "1\u20133 months", "3\u20136 months", "6\u201312 months", "Flexible",
  ]},

  { id: "risk", section: "Outcome", category: "risk", question: "What is the risk of getting this wrong?", type: "multi-choice", chip: true, options: [
    "Very Low \u2014 minor inconvenience",
    "Low \u2014 small impact",
    "Medium \u2014 noticeable business impact",
    "High \u2014 significant revenue or compliance risk",
    "Critical \u2014 legal or safety implications",
  ]},
  { id: "stability", section: "Outcome", category: "stability", question: "How stable is this process?", type: "multi-choice", chip: true, options: [
    "Very stable \u2014 unchanged in years",
    "Mostly stable \u2014 minor tweaks",
    "Somewhat volatile \u2014 changes every few months",
    "Highly volatile \u2014 changes frequently",
    "Brand new \u2014 still being defined",
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
];
