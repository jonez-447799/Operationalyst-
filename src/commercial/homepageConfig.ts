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
  focus: string;
  quote: string;
  metric: string;
}

export interface CommercialTier {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  highlighted?: boolean;
}

export interface TenTeamOperatingSystem {
  id: number;
  name: string;
  role: string;
  deliverable: string;
}

export interface DataTrustItem {
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ObjectionItem {
  objection: string;
  rebuttal: string;
}

export interface AnxietyMapItem {
  trigger: string;
  mitigation: string;
}

export interface IcebergDimension {
  visible: string;
  hiddenLeak: string;
}

export interface HeadlineVariant {
  id: string;
  headline: string;
  subheadline: string;
}

export interface ProblemQuestion {
  id: string;
  question: string;
  context: string;
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface AuditDeliverable {
  title: string;
  description: string;
  format: string;
}

export interface MethodologyStage {
  stageNumber: number;
  title: string;
  description: string;
}

export type SampleAuditModeId = 'P1' | 'P2' | 'P3' | 'P4';

export interface SampleAuditMode {
  id: SampleAuditModeId;
  name: string;
  title: string;
  description: string;
  summaryMetrics: { label: string; value: string }[];
  sampleFindings: { sku: string; location: string; issue: string; leakValue: string; status: string }[];
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Overview', href: '#overview' },
  { label: 'Value Proof', href: '#value-proof' },
  { label: 'Stakeholders', href: '#stakeholders' },
  { label: 'Tiers & Pricing', href: '#tiers' },
  { label: '14-Team OS', href: '#operating-system' },
  { label: 'FAQ', href: '#faq' },
];

export const HERO_CONTENT: HeroContent = {
  badge: '48-Hour Factory Diagnostic Audit',
  headline: 'Zero-Risk Working Capital Diagnostic for Manufacturing Leadership',
  subheadline: 'Expose ₹5L to ₹50L+ in stagnant inventory, unbilled freight, and bin-level shrinkage from standard 5-column ERP CSV exports.',
  primaryCtaText: 'Upload 5-Column CSV (Free Diagnostic Teaser)',
  primaryCtaHref: '#upload',
  secondaryCtaText: 'View Commercial Tiers',
  secondaryCtaHref: '#tiers',
  guaranteeText: '100% Refund Guarantee: If we find less than ₹2,50,000 in recoverable working capital leaks, your audit is completely free.',
};

export const VALUE_PROPOSITIONS: ValueProposition[] = [
  {
    id: 'speed',
    title: '48-Hour Audit Delivery',
    description: 'Rapid diagnostic analysis delivered within 48 hours without complex ERP integrations.',
    iconName: 'Zap',
  },
  {
    id: 'guarantee',
    title: '100% Refund Guarantee',
    description: 'Full refund on ₹18,000 diagnostic audit if recoverable leaks fall below ₹2,50,000.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'security',
    title: 'Zero ERP Hooks / Data Purge',
    description: 'Isolated in-memory schema validation with 14-day or on-demand strict data purge.',
    iconName: 'Lock',
  },
  {
    id: 'roi',
    title: 'Quantified Cash Recovery',
    description: 'Row-level traceable ledger of stagnant stock, detention slabs, and ghost inventory.',
    iconName: 'TrendingUp',
  },
];

export const STAKEHOLDER_PERSPECTIVES: StakeholderPerspective[] = [
  {
    role: 'Managing Director / CEO',
    focus: 'Capital Preservation & ROI',
    quote: 'Operationalyst provided line-item visibility into ₹18L in locked working capital across our regional units within 48 hours.',
    metric: '₹18L Leak Unlocked',
  },
  {
    role: 'CFO / VP Finance',
    focus: 'Audit Proof & Refund Guarantee',
    quote: 'The ₹18,000 audit carried zero downside risk with the ₹2,50,000 leak guarantee. It identified rate-slab overcharges immediately.',
    metric: '14x Audit ROI',
  },
  {
    role: 'Supply Chain Director',
    focus: 'OTIF & Freight Leakage',
    quote: 'Detention penalties and unbilled freight slabs were mapped directly to carrier debit notes.',
    metric: '99.4% Billing Accuracy',
  },
];

export const COMMERCIAL_TIERS: CommercialTier[] = [
  {
    id: 'sandbox',
    name: 'Free Diagnostic Teaser / Sandbox',
    price: '₹0',
    description: 'Instant in-browser 5-column CSV diagnostic teaser with zero sign-up required.',
    features: [
      'Instant in-browser 5-column CSV parsing',
      'Basic leakage exposure calculation',
      'Sample audit report preview',
      'Zero sign-up or credential requirement',
    ],
    ctaText: 'Try Free Sandbox',
    ctaHref: '#sandbox',
    highlighted: false,
  },
  {
    id: 'diagnostic',
    name: 'Factory Diagnostic Audit',
    price: '₹18,000',
    period: '+ 18% GST (One-time)',
    description: 'Comprehensive 48-hour working capital audit backed by a 100% money-back guarantee.',
    features: [
      'Complete P1–P4 Engine Diagnostic',
      'Row-traceable Excel & PDF executive report',
      '48-hour turnaround SLA',
      '100% Refund Guarantee if recoverable leaks < ₹2,50,000',
    ],
    ctaText: 'Order Diagnostic Audit',
    ctaHref: '#diagnostic',
    highlighted: true,
  },
  {
    id: 'watchdog',
    name: 'Monthly Watchdog Retainer',
    price: '₹15,000',
    period: '+ 18% GST / month',
    description: 'Continuous monthly inventory & freight drift alerts with proactive leak surveillance.',
    features: [
      'Monthly SKU drift & freight tariff surveillance',
      'Automated carrier debit note generation',
      'Quarterly executive review & trend analysis',
      'Cancel anytime with zero long-term contract',
    ],
    ctaText: 'Start Watchdog Retainer',
    ctaHref: '#retainer',
    highlighted: false,
  },
  {
    id: 'partner',
    name: 'CA & Stock Auditor Partner Desk',
    price: '20% Share',
    period: 'Recurring Partner Commission',
    description: 'Co-branded audit working papers and revenue share for CAs & stock auditing firms.',
    features: [
      '20% recurring revenue share on referred audits & retainers',
      'Co-branded audit working papers & executive reports',
      'Dedicated partner success manager',
      'Direct partner portal access & client onboarding',
    ],
    ctaText: 'Join Partner Network',
    ctaHref: '#partner',
    highlighted: false,
  },
];

export const TEN_TEAM_OPERATING_SYSTEM: TenTeamOperatingSystem[] = [
  { id: 1, name: 'Team 1: Diagnostic Ingestion & Schema Normalization Lab', role: 'Data Hygiene & Validation', deliverable: 'Cleaned 5-column schema matrix' },
  { id: 2, name: 'Team 2: Working Capital & Dead Stock Intelligence Desk', role: 'Inventory Aging Analysis', deliverable: 'RTV & Salvage Liquidation Plan' },
  { id: 3, name: 'Team 3: OTIF & Dispatch Reliability Engine Desk', role: 'Service Level Audit', deliverable: 'SLA Breach & Penalty Audit' },
  { id: 4, name: 'Team 4: Freight Rate-Card & Detention Forensic Cell', role: 'Logistics Cost Control', deliverable: 'Transporter Debit Note Claims' },
  { id: 5, name: 'Team 5: Bin Variance & Ghost Stock Reconciliation Lab', role: 'Warehouse Audit', deliverable: 'Physical vs ERP Variance Ledger' },
  { id: 6, name: 'Team 6: Financial Leak Quantification & Guarantee Gate', role: 'Audit Quality Assurance', deliverable: 'Verified Leak Exposure Certification' },
  { id: 7, name: 'Team 7: Executive Working Paper & Action Plan Desk', role: 'C-Suite Reporting', deliverable: 'Board-Ready PDF & Excel Audit Pack' },
  { id: 8, name: 'Team 8: Turnaround SLA & Delivery Operations Desk', role: 'Execution Control', deliverable: '48-Hour SLA Delivery Track' },
  { id: 9, name: 'Team 9: Client Data Governance & Security Operations Desk', role: 'Data Privacy & NDA', deliverable: 'Data Purge Certificate & NDA' },
  { id: 10, name: 'Team 10: Post-Audit Implementation Support Cell', role: 'Recovery Execution', deliverable: 'Vendor & Inventory Action Guide' },
  { id: 11, name: 'Team 11: CA & Channel Partner Alliance Desk', role: 'Partner Alliances', deliverable: '20% Recurring Ledger & Co-Branded Papers' },
  { id: 12, name: 'Team 12: 24-Hour SLA Grievance & Data Purge Desk', role: 'Data Purge & SLA Enforcement', deliverable: '14-Day Purge SLA via joneszz2004@gmail.com' },
  { id: 13, name: 'Team 13: ERP Data Sanitization & Ingestion Lab', role: 'ERP Normalization', deliverable: 'Tally/SAP/Busy/Excel Normalization' },
  { id: 14, name: 'Team 14: Market Radar & Watchdog Retention Cell', role: 'Corridor Benchmarking', deliverable: 'Chennai/Hosur/Coimbatore/Pune Radar' },
];

export const DATA_TRUST_ITEMS: DataTrustItem[] = [
  { title: 'Zero ERP Credentials Required', description: 'We only process static 5-column CSV files. No API tokens, passwords, or direct database connections are ever requested.' },
  { title: 'Deterministic Data Purge', description: 'All processed files are stored temporarily in isolated memory and automatically purged within 14 days or immediately upon request.' },
  { title: 'Strict NDA & Confidentiality', description: 'Every audit is executed under bilateral non-disclosure agreements with complete data privacy controls.' },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How does the ₹18,000 Factory Diagnostic Audit work?',
    answer: 'You upload your standard 5-column ERP CSV export (SKU, Category, Quantity, Unit Cost, Days in Stock). Our engine and 14-Team OS analyze P1–P4 leak vectors and deliver a full audit report within 48 hours.',
  },
  {
    question: 'What is the 100% Refund Guarantee criteria?',
    answer: 'If our diagnostic report fails to identify at least ₹2,50,000 in verifiable, actionable working capital leaks (stagnant inventory, freight overcharges, bin variance), we immediately refund your ₹18,000 audit fee in full.',
  },
  {
    question: 'What is included in the ₹15,000/month Watchdog Retainer?',
    answer: 'The Monthly Watchdog Retainer provides ongoing monthly SKU drift tracking, freight rate-card surveillance, automated carrier debit note generation, and quarterly strategic reviews with zero long-term lock-in.',
  },
  {
    question: 'How does the CA & Stock Auditor Partner Desk operate?',
    answer: 'Chartered Accountants and auditing firms receive a 20% recurring revenue share on referred ₹18,000 audits and ₹15,000/month retainers, along with co-branded audit working papers and dedicated partner support.',
  },
  {
    question: 'Is my manufacturing data safe during the audit?',
    answer: 'Yes. We require zero ERP system hooks or logins. All data is processed in isolated sandboxes and automatically purged within 14 days or on-demand via Team 12 (joneszz2004@gmail.com).',
  },
];

export const OBJECTION_REBUTTALS: ObjectionItem[] = [
  {
    objection: 'Our ERP system already tracks inventory aging.',
    rebuttal: 'Standard ERP reports show gross aging buckets but miss cross-functional leak vectors like rate-card slab jumps, phantom stock variances, and unrecovered supplier RTVs.',
  },
  {
    objection: 'We do not want to expose sensitive financial data.',
    rebuttal: 'Our diagnostic requires only 5 operational columns with zero financial ledger, bank, or customer PII data needed.',
  },
];

export const CUSTOMER_ANXIETY_MAP: AnxietyMapItem[] = [
  { trigger: 'Fear of long implementation timeline', mitigation: 'Zero setup required. Delivery completed within 48 hours from CSV submission.' },
  { trigger: 'Concern over audit fee ROI', mitigation: '100% money-back guarantee if recoverable leaks are under ₹2,50,000.' },
];

export const BEHAVIORAL_ICEBERG_DIMENSIONS: IcebergDimension[] = [
  { visible: 'Visible ERP Inventory Value', hiddenLeak: 'Stagnant Stock (>180 Days) & Carrying Cost Burn' },
  { visible: 'Base Transport Rates', hiddenLeak: 'Detention Slabs, Unbilled Surcharges & Rate-Card Drift' },
];

export const HERO_HEADLINE_VARIANTS: HeadlineVariant[] = [
  {
    id: 'default',
    headline: 'Zero-Risk Working Capital Diagnostic for Manufacturing Leadership',
    subheadline: 'Expose ₹5L to ₹50L+ in stagnant inventory, unbilled freight, and bin-level shrinkage from standard 5-column ERP CSV exports.',
  },
  {
    id: 'cfo',
    headline: 'Identify ₹2.5L+ in Recoverable Leaks or Pay ₹0 for Your Audit',
    subheadline: 'Quantify inventory holding burn and carrier detention overcharges in 48 hours.',
  },
];

export const ACTIVE_DEFAULT_VARIANT: HeadlineVariant = HERO_HEADLINE_VARIANTS[0];

export const PROBLEM_QUESTIONS: ProblemQuestion[] = [
  { id: 'q1', question: 'How much working capital is locked in inventory aging over 180 days?', context: 'P1 Dead Stock & Working Capital Engine' },
  { id: 'q2', question: 'Are you overpaying carrier detention penalties due to slab miscalculations?', context: 'P3 Freight Rate-Card & Detention Engine' },
  { id: 'q3', question: 'What percentage of catalog SKUs suffer from physical bin vs ERP ghost stock?', context: 'P4 Warehouse Bin Variance Engine' },
];

export const PROCESS_STEPS: ProcessStep[] = [
  { stepNumber: 1, title: 'Export 5-Column CSV', description: 'Download basic inventory or dispatch ledger from Tally, SAP, Busy, or Excel.' },
  { stepNumber: 2, title: 'Upload to Secure Portal', description: 'Submit CSV into zero-ERP-hook encrypted sandbox.' },
  { stepNumber: 3, title: '48-Hour Forensic Analysis', description: '14-Team Operating System executes P1–P4 diagnostic engines.' },
  { stepNumber: 4, title: 'Receive Actionable Audit Pack', description: 'Get row-level Excel ledger, debit note claim templates, and PDF executive summary.' },
];

export const AUDIT_DELIVERABLES: AuditDeliverable[] = [
  { title: 'Working Capital Recovery Plan', description: 'Itemized RTV, BOM substitution, and scrap salvage recommendations.', format: 'Excel / CSV' },
  { title: 'Transporter Debit Note Claims', description: 'Pre-formatted debit notes for detention and rate-card overcharges.', format: 'PDF / Excel' },
  { title: 'Executive Board Deck', description: 'High-level C-suite summary with quantified leak exposure metrics.', format: 'PDF Presentation' },
];

export const FOUNDER_EXECUTIVE_SIGNOFF = {
  name: 'Operationalyst Audit Desk',
  title: 'Lead Working Capital & Logistics Auditor',
  contactEmail: 'joneszz2004@gmail.com',
  location: 'Chennai / Hosur / Coimbatore / Pune Corridor Desk',
};

export const METHODOLOGY_STAGES: MethodologyStage[] = [
  { stageNumber: 1, title: 'Data Normalization', description: 'Validate 5-column schema structure and sanitize records.' },
  { stageNumber: 2, title: 'Cross-Engine Analysis', description: 'Run P1–P4 forensic leak detectors across inventory and freight.' },
  { stageNumber: 3, title: 'Leak Quantification', description: 'Calculate net recoverable value and guarantee qualification.' },
  { stageNumber: 4, title: 'Executive Deliverable Synthesis', description: 'Generate audit ledger, debit notes, and sign-off report.' },
];

export function getReconciledSampleAuditModes(): SampleAuditMode[] {
  return [
    {
      id: 'P1',
      name: 'Engine P1: Inventory & Working Capital',
      title: 'P1: Dead Stock & Working Capital Recovery',
      description: 'Identifies inventory holding burn, slow-moving SKUs, and stagnant working capital locked in raw materials and finished goods.',
      summaryMetrics: [
        { label: 'Total Inventory Analyzed', value: '₹4,85,000' },
        { label: 'Stagnant Capital (>180 Days)', value: '₹1,42,000' },
        { label: 'Annual Holding Burn (22%)', value: '₹31,240' },
        { label: 'Recoverable Cash Estimate', value: '₹1,15,000' },
      ],
      sampleFindings: [
        { sku: 'SKU-RM-802', location: 'Warehouse A - Hosur', issue: 'Stagnant >210 Days (RTV Candidate)', leakValue: '₹68,500', status: 'Actionable' },
        { sku: 'SKU-FG-104', location: 'Warehouse B - Chennai', issue: 'Slow Moving (BOM Substitution)', leakValue: '₹46,500', status: 'Actionable' },
        { sku: 'SKU-SP-309', location: 'Warehouse C - Pune', issue: 'Obsolescence (Scrap Salvage)', leakValue: '₹27,000', status: 'Actionable' },
      ],
    },
    {
      id: 'P2',
      name: 'Engine P2: OTIF & Dispatch Reliability',
      title: 'P2: OTIF Dispatch Reliability & Penalties',
      description: 'Measures on-time in-full dispatch performance, unbilled order delays, and SLA breach penalty risks.',
      summaryMetrics: [
        { label: 'Total Shipments Evaluated', value: '1,240 Orders' },
        { label: 'On-Time Dispatch Rate', value: '84.2%' },
        { label: 'In-Full Compliance Rate', value: '88.6%' },
        { label: 'Estimated SLA Penalty Risk', value: '₹78,400' },
      ],
      sampleFindings: [
        { sku: 'ORD-2026-901', location: 'Distributor Hub - Bangalore', issue: '48-Hour SLA Breach', leakValue: '₹34,000', status: 'Actionable' },
        { sku: 'ORD-2026-945', location: 'Direct Customer - Coimbatore', issue: 'Partial Fulfillment Variance', leakValue: '₹25,400', status: 'Actionable' },
        { sku: 'ORD-2026-988', location: 'Regional Depot - Pune', issue: 'Documentation Transit Delay', leakValue: '₹19,000', status: 'Actionable' },
      ],
    },
    {
      id: 'P3',
      name: 'Engine P3: Freight Rate-Card & Detention Audit',
      title: 'P3: Logistics Rate-Card & Detention Leakage',
      description: 'Exposes freight overcharges, incorrect tariff slab application, and detention penalty leakage.',
      summaryMetrics: [
        { label: 'Freight Bills Processed', value: '₹8,90,000' },
        { label: 'Rate-Card Slab Overcharges', value: '₹54,200' },
        { label: 'Unjustified Detention Charges', value: '₹38,600' },
        { label: 'Total Transporter Claims', value: '₹92,800' },
      ],
      sampleFindings: [
        { sku: 'LR-2026-4011', location: 'Chennai - Hosur Corridor', issue: 'Detention Slab Error (24h grace ignored)', leakValue: '₹22,400', status: 'Actionable' },
        { sku: 'LR-2026-4089', location: 'Coimbatore Hub', issue: 'Weight Slab Jump Overcharge', leakValue: '₹18,200', status: 'Actionable' },
        { sku: 'LR-2026-5120', location: 'Pune Corridor', issue: 'Unbilled Tariff Surcharge', leakValue: '₹13,600', status: 'Actionable' },
      ],
    },
    {
      id: 'P4',
      name: 'Engine P4: Warehouse Bin Variance & Ghost Stock',
      title: 'P4: Physical Bin vs ERP Inventory Variance',
      description: 'Reconciles physical count variances, ghost stock, and unrecorded shrinkage across warehouse locations.',
      summaryMetrics: [
        { label: 'Bin Locations Audited', value: '450 Bins' },
        { label: 'Variance Rate', value: '4.8%' },
        { label: 'Ghost Stock ERP Discrepancy', value: '₹86,500' },
        { label: 'Physical Shrinkage Exposure', value: '₹42,100' },
      ],
      sampleFindings: [
        { sku: 'BIN-A-14', location: 'Main Plant - Hosur', issue: 'Ghost Stock (ERP > Physical by 140 units)', leakValue: '₹52,000', status: 'Actionable' },
        { sku: 'BIN-C-08', location: 'Finished Goods Yard - Chennai', issue: 'Unrecorded Shrinkage', leakValue: '₹24,500', status: 'Actionable' },
        { sku: 'BIN-D-22', location: 'Raw Material Store - Pune', issue: 'Bin Misplacement Variance', leakValue: '₹10,000', status: 'Actionable' },
      ],
    },
  ];
}
