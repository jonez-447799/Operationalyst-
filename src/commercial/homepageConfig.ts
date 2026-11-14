export interface NavLink {
  label: string;
  href: string;
}

export interface HeroContent {
  badge: string;
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  guaranteeText: string;
}

export interface ValueProposition {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface StakeholderPerspective {
  role: string;
  unspokenAnxiety: string;
  priorityOutcome: string;
  coreQuestion: string;
}

export interface CommercialTier {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  pricing: string;
  commitment: string;
  targetAudience: string;
  deliverables: string[];
  guarantee: string;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary' | 'outline';
  isPopular?: boolean;
}

export interface TenTeamOperatingSystem {
  id: string;
  name: string;
  leadRole: string;
  focus: string;
  deliverable: string;
  sla: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HeroHeadlineVariant {
  badge: string;
  headline: string;
  subhead: string;
}

export interface ProblemQuestion {
  question: string;
  impact: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  detail: string;
}

export interface AuditDeliverable {
  name: string;
  desc: string;
}

export interface MethodologyStage {
  stage: string;
  title: string;
  output: string;
}

export interface DataTrustItem {
  title: string;
  detail: string;
}

export interface FounderExecutiveSignoff {
  name: string;
  role: string;
  email: string;
  phone: string;
  commitment: string;
  guarantee: string;
}

export type SampleAuditModeId = 'P1' | 'P2' | 'P3' | 'P4';

export interface SampleAuditMode {
  id: SampleAuditModeId;
  name: string;
  badge: string;
  subhead: string;
  requiredColumns: string[];
  sampleLeakCaught: string;
  recoverableRange: string;
  deliverable: string;
  reconciliationRule: string;
}

export const HERO_HEADLINE_VARIANTS: Record<string, HeroHeadlineVariant> = {
  A: {
    badge: '48-Hour Forensic Operations Audit',
    headline: 'Stop Factory Capital Leakage Before Your Next Board Cycle',
    subhead: 'We audit dead inventory, OTIF dispatch delays, freight overbillings, and bin discrepancies in 48 hours—backed by a ₹18,000 diagnostic with a ₹2,50,000 refund guarantee.'
  },
  B: {
    badge: '100% Guaranteed Recovery Diagnostic',
    headline: 'Identify ₹2,50,000+ in Trapped Working Capital in 48 Hours',
    subhead: 'Zero invasive ERP integration. Direct row-by-row data audit across inventory, dispatches, freight contracts, and warehouse physical bin counts.'
  },
  C: {
    badge: '14-Team Institutional Operating System',
    headline: 'Eliminate Ghost Stock, Freight Overcharges & SLA Delay Penalties',
    subhead: 'Institutional-grade operational supervision for Indian manufacturing plants. ₹18,000 48-hour diagnostic audit & ₹15,000/month continuous watchdog.'
  }
};

export const ACTIVE_DEFAULT_VARIANT = 'A';

export const NAV_LINKS: NavLink[] = [
  { label: 'Calculators', href: '#calculator' },
  { label: 'Audit Engines', href: '#engines' },
  { label: '14-Team OS', href: '#teams' },
  { label: 'Commercial Tiers', href: '#pricing' },
  { label: 'FAQ', href: '#faq' }
];

export const HERO_CONTENT: HeroContent = {
  badge: 'Forensic Operations Supervision',
  headline: 'Eliminate Hidden Factory Leaks & Unlock Trapped Working Capital',
  subheadline: 'Our 14-team institutional operating system audits dead stock, OTIF delays, freight rate overbillings, and warehouse bin variances in 48 hours.',
  primaryCtaText: 'Book ₹18,000 Diagnostic Audit',
  primaryCtaHref: '#pricing',
  secondaryCtaText: 'Explore Interactive Engines',
  secondaryCtaHref: '#engines',
  guaranteeText: '100% Money-Back Guarantee: If we find < ₹2,50,000 in recoverable leakage, your ₹18,000 is fully refunded within 24 hours.'
};

export const VALUE_PROPOSITIONS: ValueProposition[] = [
  {
    id: 'speed',
    title: '48-Hour Executive Turnaround',
    description: 'No 6-month consulting engagements. Receive actionable, row-traceable leakage workbooks within 48 hours of CSV/Excel data ingestion.',
    iconName: 'Clock'
  },
  {
    id: 'zero-hooks',
    title: 'Zero Invasive ERP Access Required',
    description: '100% offline & read-only analysis. Export standard reports from Tally, SAP, Busy, or Excel—no API integration or IT tickets required.',
    iconName: 'Lock'
  },
  {
    id: 'guarantee',
    title: '₹2,50,000 Refund Guarantee',
    description: 'If our 48-hour diagnostic audit fails to identify at least ₹2,50,000 in operational leakage, your ₹18,000 fee is refunded in full.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'institutional',
    title: '14-Team Specialized Operating System',
    description: 'Dedicated specialized desks covering every loss surface: dead stock, OTIF penalties, freight rate cards, bin variance, and CA alliances.',
    iconName: 'Layers'
  }
];

export const STAKEHOLDER_PERSPECTIVES: StakeholderPerspective[] = [
  {
    role: 'Managing Director / Plant Owner',
    unspokenAnxiety: 'Uncertain whether working capital is locked in genuine buffer stock or unmarketable dead inventory.',
    priorityOutcome: 'Immediate liquidity unlocking without disrupting ongoing factory production.',
    coreQuestion: 'How much cash is trapped in our warehouse right now, and when can we liquidate it?'
  },
  {
    role: 'Chief Financial Officer (CFO)',
    unspokenAnxiety: 'Skepticism over software promises that demand months of implementation without guaranteed balance sheet ROI.',
    priorityOutcome: 'Verified line-item audit trails that withstand statutory and internal board scrutiny.',
    coreQuestion: 'Can we prove ₹2,50,000+ in recoverable leakage from standard ERP dumps before paying full engagement costs?'
  },
  {
    role: 'Head of Operations & Supply Chain',
    unspokenAnxiety: 'Fear of customer SLA penalty deductions and delayed dispatches hurting key accounts.',
    priorityOutcome: 'Pinpoint root causes for dispatch delays and eliminate unverified freight detention charges.',
    coreQuestion: 'Why are our OTIF dispatch metrics slipping despite high inventory holding levels?'
  },
  {
    role: 'Chartered Accountant / Statutory Auditor',
    unspokenAnxiety: 'Manual sample checking misses hidden ghost stock and line-item freight rate discrepancies.',
    priorityOutcome: 'Co-branded statutory stock audit workbooks backed by row-traceable reconciliation logic.',
    coreQuestion: 'How can we provide 100% physical vs ERP stock audit accuracy to our audit clients?'
  }
];

export const COMMERCIAL_TIERS: CommercialTier[] = [
  {
    id: 'diagnostic',
    name: '48-Hour Factory Diagnostic Audit',
    badge: 'Entry / Risk-Free',
    subtitle: 'Single-factory deep-dive identifying dead stock, OTIF delays, freight overbillings, and bin leakage.',
    pricing: '₹18,000',
    commitment: 'One-Time Payment',
    targetAudience: 'Single-plant manufacturers (₹5 Cr – ₹100 Cr turnover)',
    deliverables: [
      'Complete P1–P4 Leakage Audit Workbook',
      'Row-traceable ERP variance reconciliation',
      'Executive Working Capital Unlocking Roadmap',
      '100% Refund Guarantee if leak < ₹2,50,000'
    ],
    guarantee: 'Full ₹18,000 refund if identified leak is under ₹2,50,000',
    buttonText: 'Book ₹18,000 Diagnostic',
    buttonVariant: 'secondary'
  },
  {
    id: 'watchdog',
    name: 'Monthly Operational Watchdog',
    badge: 'Most Popular',
    subtitle: 'Continuous monthly audit of ERP dumps, SKU drift tracking, freight rate-card enforcement, and inventory health monitoring.',
    pricing: '₹15,000 / mo',
    commitment: 'Monthly Retainer (Cancel Anytime)',
    targetAudience: 'Growing manufacturers needing ongoing operational discipline',
    deliverables: [
      'Monthly SKU movement drift reports',
      'Recurring freight bill & detention audit',
      'Unannounced bin variance spot-checks',
      'Monthly CFO executive briefing'
    ],
    guarantee: 'Guaranteed positive ROI or month fee waived',
    buttonText: 'Start ₹15,000/mo Retainer',
    buttonVariant: 'primary',
    isPopular: true
  },
  {
    id: 'enterprise',
    name: '10-Team Institutional Enterprise OS',
    badge: 'Full Operations Suite',
    subtitle: 'Comprehensive multi-plant operational overhaul deployed with our 14-team institutional operating framework.',
    pricing: 'Custom / ₹2,50,000 Guarantee',
    commitment: 'Annual Engagement',
    targetAudience: 'Multi-plant industrial groups & heavy manufacturers',
    deliverables: [
      'Full 14-Team OS Deployment',
      'Dedicated Lead Principal Auditor',
      'Custom ERP ingestion pipelines',
      'Quarterly board presentation pack'
    ],
    guarantee: 'Guaranteed ₹25L+ leakage elimination target',
    buttonText: 'Request Enterprise Proposal',
    buttonVariant: 'outline'
  },
  {
    id: 'ca-partner',
    name: 'CA & Stock Auditor Partner Desk',
    badge: 'Partner Alliance',
    subtitle: 'Collaborate with Operationalyst to provide institutional inventory diagnostic workbooks to your audit clients.',
    pricing: '20% Recurring Partner Share',
    commitment: 'Zero Partner Fee',
    targetAudience: 'Chartered Accountants, Statutory Stock Auditors & Operations Consultants',
    deliverables: [
      '20% recurring partner share on referred ₹18,000 audits & ₹15,000/mo retainers',
      'Co-branded statutory stock audit working papers',
      'Dedicated CA partner desk support',
      'Deterministic NDA & client data protection'
    ],
    guarantee: 'Zero partner setup fee & guaranteed payouts',
    buttonText: 'Join CA Partner Desk',
    buttonVariant: 'outline'
  }
];

export const TEN_TEAM_OPERATING_SYSTEM: TenTeamOperatingSystem[] = [
  {
    id: 'team-01',
    name: 'Team 01 — Dead Stock & Working Capital Unlocking Desk',
    leadRole: 'Senior Inventory Forensic Specialist',
    focus: 'Identifies non-moving and slow-moving (>180d) inventory trapped in raw materials and finished goods.',
    deliverable: 'Executive Working Capital Unlocking Matrix (Excel + PDF) with liquidation pricing tiers.',
    sla: '24 Hours'
  },
  {
    id: 'team-02',
    name: 'Team 02 — Dispatch Delay & OTIF SLA Enforcement Desk',
    leadRole: 'Supply Chain SLA Specialist',
    focus: 'Audits dispatch logs against customer SLA promises to prevent penalty deductions.',
    deliverable: 'OTIF Root-Cause & SLA Penalty Recovery Action Plan.',
    sla: '36 Hours'
  },
  {
    id: 'team-03',
    name: 'Team 03 — Freight Rate-Card & Detention Audit Cell',
    leadRole: 'Logistics Billing Auditor',
    focus: 'Reconciles billed freight against contracted rate cards and detects unverified detention charges.',
    deliverable: 'Transporter-by-Transporter Overbilling Recovery Ledger.',
    sla: '24 Hours'
  },
  {
    id: 'team-04',
    name: 'Team 04 — Warehouse Bin Variance & Ghost Stock Desk',
    leadRole: 'Warehouse Forensic Auditor',
    focus: 'Detects physical vs ERP system discrepancies, ghost stock, and unaccounted bin shrink.',
    deliverable: 'Physical-to-ERP Variance Reconciliation Workbook.',
    sla: '48 Hours'
  },
  {
    id: 'team-05',
    name: 'Team 05 — Production Yield & Scrap Leakage Cell',
    leadRole: 'Industrial Process Engineer',
    focus: 'Audits raw material BOM consumption vs standard yields to flag excess scrap and floor loss.',
    deliverable: 'BOM Yield Variance & Scrap Reduction Protocol.',
    sla: '48 Hours'
  },
  {
    id: 'team-06',
    name: 'Team 06 — Vendor Price Variance & Purchase PO Audit Desk',
    leadRole: 'Procurement Compliance Auditor',
    focus: 'Compares PO prices against master agreement rate contracts to identify price creep.',
    deliverable: 'Vendor Overcharge Recovery Ledger.',
    sla: '36 Hours'
  },
  {
    id: 'team-07',
    name: 'Team 07 — Credit Term & Cash Flow Velocity Cell',
    leadRole: 'Commercial Credit Specialist',
    focus: 'Audits customer payment cycles and supplier credit terms to optimize cash conversion cycles.',
    deliverable: 'Cash Conversion Velocity Scorecard.',
    sla: '24 Hours'
  },
  {
    id: 'team-08',
    name: 'Team 08 — Maintenance Spares & Obsolescence Desk',
    leadRole: 'Plant Asset Auditor',
    focus: 'Audits MRO spare parts inventory to prevent duplicate orders and eliminate dead machine spares.',
    deliverable: 'MRO Rationalization & Spares Control Guide.',
    sla: '36 Hours'
  },
  {
    id: 'team-09',
    name: 'Team 09 — Logistics Route & Transit Shrinkage Desk',
    leadRole: 'Transit Risk Auditor',
    focus: 'Monitors transit times and loss rates across dispatch corridors to stop transit damage.',
    deliverable: 'Transit Loss & Corridor Risk Assessment.',
    sla: '48 Hours'
  },
  {
    id: 'team-10',
    name: 'Team 10 — CFO Executive Dashboard & Supervision Cell',
    leadRole: 'Principal Executive Auditor',
    focus: 'Consolidates all 14 desk findings into a unified executive dashboard for board review.',
    deliverable: '48-Hour Executive Briefing & Action Roadmap.',
    sla: '48 Hours'
  },
  {
    id: 'team-11',
    name: 'Team 11 — CA & Channel Partner Alliance Desk',
    leadRole: 'Partner Success Manager',
    focus: 'Manages Chartered Accountant stock auditor alliances, 20% recurring revenue-share tracking, and co-branded audit workbooks.',
    deliverable: 'Co-Branded Statutory Audit Workbook & Partner Revenue Tracker.',
    sla: '24 Hours'
  },
  {
    id: 'team-12',
    name: 'Team 12 — 24-Hour SLA Grievance & Data Purge Desk',
    leadRole: 'Data Privacy & SLA Compliance Officer',
    focus: 'Enforces NDA governance, deterministic 14-day or on-demand data purge (joneszz2004@gmail.com), and <24-hour grievance resolution.',
    deliverable: 'Certificate of Irreversible Data Elimination & Grievance Resolution Log.',
    sla: '24 Hours'
  },
  {
    id: 'team-13',
    name: 'Team 13 — ERP Data Sanitization & Ingestion Lab',
    leadRole: 'Data Engineering Specialist',
    focus: 'Sanitizes messy Tally, SAP, Busy, and Excel exports into clean 5-column schemas with zero invasive ERP hooks.',
    deliverable: 'Sanitized Standardized 5-Column Audit Schema.',
    sla: '12 Hours'
  },
  {
    id: 'team-14',
    name: 'Team 14 — Market Radar & Watchdog Retention Cell',
    leadRole: 'Market Intelligence Analyst',
    focus: 'Monitors monthly SKU drift, industrial corridor benchmarks (Chennai, Hosur, Coimbatore, Pune), and continuous working capital retention.',
    deliverable: 'Industrial Corridor SKU Benchmark & Watchdog Retention Report.',
    sla: '48 Hours'
  }
];

export const PROBLEM_QUESTIONS: ProblemQuestion[] = [
  {
    question: 'How much stagnant capital (>180 days) is trapped in obsolete inventory across your warehouses?',
    impact: 'Consumes up to 25% of working capital lines with unnecessary interest costs.'
  },
  {
    question: 'Why are OTIF dispatch delays recurring despite adequate finished goods inventory?',
    impact: 'Leads to heavy SLA penalty deductions and damaged tier-1 client relationships.'
  },
  {
    question: 'Are your billed freight costs matching contracted rate-cards, or are detention fees unverified?',
    impact: 'Freight leakage typically accounts for 8%–18% of total annual logistics spend.'
  },
  {
    question: 'What is the exact physical vs system bin discrepancy across your high-value SKUs?',
    impact: 'Unreported shrink and ghost stock cause sudden production line halts.'
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Data Ingestion',
    detail: 'Export standard CSV/Excel reports from Tally, SAP, Busy, or custom ERP systems—zero API integration needed.'
  },
  {
    step: '02',
    title: 'Forensic Reconciliation',
    detail: 'Our 14 specialized teams run automated mathematical invariant checks across all 4 loss vectors.'
  },
  {
    step: '03',
    title: 'Variance Verification',
    detail: 'Line-item identification of dead stock, delay penalty root causes, and freight overbilling.'
  },
  {
    step: '04',
    title: '48-Hour Report Delivery',
    detail: 'Receive an executive workbook with exact row-traceable proof of identified leakage.'
  },
  {
    step: '05',
    title: 'Recovery Execution',
    detail: 'Implement structured liquidation, SLA renegotiation, and freight credit note claims.'
  }
];

export const AUDIT_DELIVERABLES: AuditDeliverable[] = [
  { name: 'P1 Working Capital Unlocking Matrix', desc: 'Line-by-line categorization of non-moving stock with recommended liquidation discounts.' },
  { name: 'P2 OTIF Delay & SLA Penalty Ledger', desc: 'Root-cause mapping of customer order dispatch delays and penalty claim justification.' },
  { name: 'P3 Freight Rate-Card Recovery Audit', desc: 'Detailed variance report comparing carrier invoices against master contracts.' },
  { name: 'P4 Bin Variance & Ghost Stock Reconciliation', desc: 'Physical vs ERP bin count audit identifying unaccounted shrinkage.' },
  { name: 'Executive Summary Dashboard', desc: 'Board-ready overview of identified cash leakage and priority action items.' },
  { name: '100% Money-Back Guarantee Verification', desc: 'Formal signoff confirming >₹2,50,000 in identified leakage or instant refund.' },
  { name: 'CA Co-Branded Working Papers', desc: 'Statutory audit compliance sheets formatted for external auditor review.' },
  { name: 'Industrial Corridor Benchmark Summary', desc: 'Comparative holding cost metrics relative to regional industrial hubs.' },
  { name: 'Data Elimination Certificate', desc: 'Formal proof of data purge following audit completion under strict NDA terms.' }
];

export const METHODOLOGY_STAGES: MethodologyStage[] = [
  { stage: 'Stage 1', title: 'Data Ingestion & Schema Alignment', output: 'Standardized 5-column datasets' },
  { stage: 'Stage 2', title: 'Invariant & Rule Engine Execution', output: 'Raw variance candidate logs' },
  { stage: 'Stage 3', title: 'Forensic Cross-Verification', output: 'Verified leakage line items' },
  { stage: 'Stage 4', title: 'Impact Quantification', output: 'Financial recovery totals' },
  { stage: 'Stage 5', title: 'Executive Report Generation', output: 'Comprehensive audit pack' },
  { stage: 'Stage 6', title: 'Data Purge & Confidentiality Close', output: 'Data purge certificate' }
];

export const DATA_TRUST_ITEMS: DataTrustItem[] = [
  { title: 'Zero Invasive Hooks', detail: 'We never connect to your live databases or install software on your servers.' },
  { title: 'Strict NDA Governance', detail: 'All data is governed by standard non-disclosure agreements before file transfer.' },
  { title: 'Deterministic Data Purge', detail: '100% of uploaded data files are purged after 14 days or immediately upon request.' },
  { title: 'Read-Only Analysis', detail: 'Operations are performed entirely offline on your exported CSV and Excel files.' },
  { title: 'Encrypted Storage', detail: 'All temporary working files are stored using enterprise AES-256 encryption.' },
  { title: 'Dedicated CA Oversight', detail: 'Audits are supervised directly by qualified financial and forensic professionals.' },
  { title: '24-Hour SLA Support', detail: 'Dedicated account principal available for immediate clarification and support.' }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How does the ₹18,000 diagnostic audit work?',
    answer: 'You export standard inventory, dispatch, freight, and bin count files in CSV or Excel format. Our 14 specialized teams analyze the data within 48 hours and deliver a detailed leakage report showing exactly where capital is trapped.'
  },
  {
    question: 'What is the ₹2,50,000 money-back guarantee?',
    answer: 'If our 48-hour diagnostic audit fails to identify at least ₹2,50,000 in recoverable leakage across dead stock, dispatch penalties, freight overcharges, and bin variance, your ₹18,000 fee is refunded in full within 24 hours.'
  },
  {
    question: 'Do we need to install software or grant database access?',
    answer: 'No. Operationalyst operates entirely on read-only file exports from your existing ERP systems (Tally, SAP, Busy, Excel). No software installation or database connections are required.'
  },
  {
    question: 'How does the CA & Stock Auditor Partner Program work?',
    answer: 'Chartered Accountants and statutory auditors can refer clients for diagnostic audits or ongoing monthly supervision. Partners receive a 20% recurring share on referred ₹18,000 audits and ₹15,000/month retainers, along with co-branded audit workbooks.'
  },
  {
    question: 'How fast will we receive the audit results?',
    answer: 'The complete executive audit workbook and recovery roadmap are delivered within 48 hours of receiving your data files.'
  },
  {
    question: 'What happens to our data after the audit?',
    answer: 'All data is handled under strict NDA governance. Files are automatically purged 14 days after audit completion, or immediately upon request. A formal Data Elimination Certificate is issued upon request.'
  },
  {
    question: 'What is included in the ₹15,000/month Operational Watchdog retainer?',
    answer: 'The monthly retainer provides continuous monitoring of ERP data dumps, tracking SKU drift, enforcing freight rate cards, conducting unannounced bin spot checks, and delivering monthly CFO briefings.'
  },
  {
    question: 'Which industrial corridors do you cover?',
    answer: 'We provide specialized operational benchmarking for manufacturing hubs including Chennai, Hosur, Coimbatore, Pune, and surrounding industrial clusters across India.'
  },
  {
    question: 'Can this audit be integrated with statutory stock audits?',
    answer: 'Yes. Our output workbooks are formatted to complement statutory stock audits, giving statutory auditors line-item visibility into physical vs system variances and working capital velocity.'
  },
  {
    question: 'How do we get started?',
    answer: 'Click "Book ₹18,000 Diagnostic", select your audit scope, and upload your data files. Our lead principal auditor will confirm data receipt within 2 hours.'
  }
];

export const FOUNDER_EXECUTIVE_SIGNOFF: FounderExecutiveSignoff = {
  name: 'Jones S',
  role: 'Founder & Principal Operations Auditor',
  email: 'joneszz2004@gmail.com',
  phone: '+91 94883 45678',
  commitment: 'Every audit is executed directly under my personal supervision. We do not sell software licenses; we deliver verified working capital recovery within 48 hours.',
  guarantee: '₹18,000 flat diagnostic fee backed by our 100% money-back guarantee: if we do not identify at least ₹2,50,000 in recoverable leakage, your diagnostic fee is fully refunded within 24 hours.'
};

export function getReconciledSampleAuditModes(): SampleAuditMode[] {
  return [
    {
      id: 'P1',
      name: 'P1: Dead Stock & Working Capital Leak Audit',
      badge: 'High Impact',
      subhead: 'Identifies non-moving, slow-moving (>180 days) stock and capital locked in idle inventory.',
      requiredColumns: ['Item Code', 'Category', 'Current Stock', 'Last Movement Date', 'Unit Cost (₹)'],
      sampleLeakCaught: '₹42,50,000 trapped in 14 obsolete raw material SKUs unused for >210 days',
      recoverableRange: '15% – 35% of total inventory value',
      deliverable: 'Executive Working Capital Unlocking Matrix (Excel + PDF) with liquidation discount recommendations',
      reconciliationRule: 'Stock age > 180 days cross-referenced with active sales orders and production BOMs.'
    },
    {
      id: 'P2',
      name: 'P2: OTIF Dispatch & Delay Penalty Audit',
      badge: 'Customer Satisfaction',
      subhead: 'Uncovers root causes of delayed dispatches and penalty deductions from key customer accounts.',
      requiredColumns: ['Order ID', 'Promised Date', 'Actual Dispatch Date', 'Invoice Value (₹)', 'Penalty Amount (₹)'],
      sampleLeakCaught: '₹12,80,000 lost in Q3 penalty deductions due to dispatch delays exceeding SLA by 48+ hours',
      recoverableRange: '60% – 90% reduction in delay penalties',
      deliverable: 'OTIF Root-Cause & SLA Penalty Recovery Action Plan',
      reconciliationRule: 'Discrepancy between SLA target date and gate-pass dispatch timestamp.'
    },
    {
      id: 'P3',
      name: 'P3: Freight Rate-Card & Detention Penalty Audit',
      badge: 'Cost Reduction',
      subhead: 'Audits freight invoices against contract rate cards and identifies unverified detention charges.',
      requiredColumns: ['Transporter', 'LR Number', 'Billed Freight (₹)', 'Contract Rate (₹)', 'Detention Days'],
      sampleLeakCaught: '₹8,40,000 in freight overbillings and unverified detention charges across 3 logistics partners',
      recoverableRange: '8% – 18% savings on total freight spend',
      deliverable: 'Transporter-by-Transporter Overbilling Recovery Ledger',
      reconciliationRule: 'Billed freight amount vs contracted rate matrix + GPS entry/exit timestamps.'
    },
    {
      id: 'P4',
      name: 'P4: Warehouse Bin Variance & Ghost Stock Audit',
      badge: 'Physical Control',
      subhead: 'Detects physical vs system inventory discrepancies, ghost stock, and unaccounted shrink.',
      requiredColumns: ['Bin Location', 'System Qty', 'Physical Count', 'Variance Qty', 'Unit Cost (₹)'],
      sampleLeakCaught: '₹18,60,000 ghost stock discrepancy across 3 primary warehouse racks during physical reconciliation',
      recoverableRange: '95%+ inventory accuracy',
      deliverable: 'Physical-to-ERP Variance Reconciliation Workbook',
      reconciliationRule: 'System stock quantity minus physical audit count multiplied by unit cost.'
    }
  ];
}
