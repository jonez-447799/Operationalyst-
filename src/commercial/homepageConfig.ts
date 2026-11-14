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
  secondaryCtaHref: string;/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

export interface IcebergDimension {
  id: string;
  num?: string;
  name?: string;
  scope?: string;
  surfaceSymptom: string;
  underwaterRootCause: string;
  operationalCost: string;
}

export interface CommercialTier {
  id: string;
  title: string;
  tagline: string;
  price: string;
  guarantee: string;
  features: string[];
}

export interface InstitutionalTeam {
  id: number;
  name: string;
  code: string;
  engine: string;
  mandate: string;
}

export const HERO_CONTENT: HeroContent = {
  badge: 'Operationalyst Governance OS',
  headline: 'Stop Margin Leakage Across Multi-Plant Industrial Operations',
  subheadline: 'Deterministic, air-gapped inventory, logistics, and OTIF governance suite.',
  primaryCtaText: 'Launch Live Suite',
  primaryCtaHref: '#suite',
  secondaryCtaText: 'View Sample Board Audit',
  secondaryCtaHref: '#sample-audit',
  guaranteeText: '100% Deterministic Guarantee &mdash; Zero Probabilistic AI Models'
};

export const VALUE_PROPOSITIONS: ValueProposition[] = [
  {
    id: 'p1',
    title: 'P1 Dead Capital Recovery',
    description: 'Unlock stagnant working capital locked in >180-day unmoving inventory.',
    iconName: 'Lock'
  },
  {
    id: 'p2',
    title: 'P2 OTIF Gate Governance',
    description: 'Eliminate customer delivery SLA penalties and gate clearance delays.',
    iconName: 'Activity'
  },
  {
    id: 'p3',
    title: 'P3 Freight & Detention Audit',
    description: 'Auto-audit spot freight rates and >6-hour plant gate detention surcharges.',
    iconName: 'Zap'
  },
  {
    id: 'p4',
    title: 'P4 Ghost Stock Reconciliation',
    description: 'Resolve physical vs system bin variances before line shutdown occurs.',
    iconName: 'AlertTriangle'
  }
];

export const COMMERCIAL_TIERS: CommercialTier[] = [
  {
    id: 'tier-1',
    title: '48-Hour Diagnostic Audit',
    tagline: 'Single Plant Leak Scan',
    price: '₹18,000 / Audit',
    guarantee: '₹2,50,000 Leak 100% Refund Guarantee',
    features: [
      'Full P1–P4 5-Column Data Processing',
      'CFO Board Audit PDF & CSV Matrix',
      '48-Hour Rapid Delivery',
      'Air-Gapped Privacy & Mutual NDA'
    ]
  },
  {
    id: 'tier-2',
    title: 'Quarterly Executive Audit',
    tagline: 'Multi-Plant Unit Coverage',
    price: '₹45,000 / Quarter',
    guarantee: '10x Fee Recovery Guarantee',
    features: [
      'Multi-Plant Corridor Benchmarking',
      'Quarterly Executive Briefings',
      'Scrap & Vendor Disposition Workflows',
      'Priority Governance Support'
    ]
  },
  {
    id: 'tier-3',
    title: 'Enterprise Watchdog OS',
    tagline: 'Continuous Operational Oversight',
    price: '₹15,000 / Mo / Plant',
    guarantee: 'Continuous SLA Oversight',
    features: [
      'Real-Time Gate & Stock Ingestion',
      'Automated Transporter Debit Notes',
      'Custom ERP API Connectors',
      'Dedicated Team 12 Resolution Desk'
    ]
  },
  {
    id: 'tier-4',
    title: 'CA & Auditor Partner Portal',
    tagline: 'Statutory Stock Audit Desk',
    price: 'Partner Revenue Share',
    guarantee: '20% Recurring Share',
    features: [
      'Co-Branded Working Paper Suite',
      'Statutory Stock Verification Badges',
      'Partner Client Control Panel',
      'Automated Audit Certificate Generator'
    ]
  }
];

export const INSTITUTIONAL_TEAMS: InstitutionalTeam[] = [
  { id: 1, name: 'Executive Operations Control', code: 'EOC', engine: 'CEO Master Suite', mandate: 'Unified plant margin & exposure matrix' },
  { id: 2, name: 'Dead Capital Recovery', code: 'DCR', engine: 'P1 Engine', mandate: 'Stagnant >180d inventory disposition' },
  { id: 3, name: 'OTIF & Gate Governance', code: 'OGG', engine: 'P2 Engine', mandate: 'Customer dispatch SLA penalty protection' },
  { id: 4, name: 'Logistics & Detention Audit', code: 'LDA', engine: 'P3 Engine', mandate: 'Spot freight & >6hr gate detention audit' },
  { id: 5, name: 'Ghost Inventory Reconciliation', code: 'GIR', engine: 'P4 Engine', mandate: 'Physical vs ERP bin variance resolution' },
  { id: 6, name: 'Procurement Variance Desk', code: 'PVD', engine: 'P1/P4 Suite', mandate: 'Raw material price & quantity leakage' },
  { id: 7, name: 'Scrap & Surplus Salvage', code: 'SSS', engine: 'P1 Engine', mandate: 'Obsolescence recovery & vendor return' },
  { id: 8, name: 'Transporter SLA Desk', code: 'TSD', engine: 'P3 Engine', mandate: 'Freight debit note issuing & penalty recovery' },
  { id: 9, name: 'Plant Security & Gate Ops', code: 'PSG', engine: 'P2/P3 Suite', mandate: 'Vehicle turnaround & gate entry logs' },
  { id: 10, name: 'Statutory Stock Auditor Desk', code: 'SSA', engine: 'P4 Suite', mandate: 'External CA working paper verification' },
  { id: 11, name: 'Commercial & Pricing Desk', code: 'CPD', engine: 'Executive OS', mandate: 'Contract rate-slab compliance audit' },
  { id: 12, name: 'Governance & SLA Resolution', code: 'GSR', engine: 'Team 12 Desk', mandate: '24-hour data purge & grievance desk' },
  { id: 13, name: 'Multi-Plant Corridor Control', code: 'MCC', engine: 'Control Tower', mandate: 'Cross-factory bottleneck routing' },
  { id: 14, name: 'CFO Board Reporting Unit', code: 'CBR', engine: 'Executive OS', mandate: 'Board-ready cash recovery documentation' }
];

export const ICEBERG_DIMENSIONS: IcebergDimension[] = [
  {
    id: 'dim-1',
    num: '01',
    name: 'Ghost Stock Variance',
    scope: 'P4 Bin Audit',
    surfaceSymptom: 'ERP shows adequate inventory, but physical bin is empty.',
    underwaterRootCause: 'Unrecorded scrap, missing bin clearance tags, and mislocated WIP.',
    operationalCost: 'Emergency freight surcharges and lost customer OTIF penalties.'
  },
  {
    id: 'dim-2',
    num: '02',
    name: 'Unbilled Gate Detention',
    scope: 'P3 Logistics Audit',
    surfaceSymptom: 'Transporter invoices exceed budget without detail.',
    underwaterRootCause: 'Truck turnaround >6 hours due to loading bay congestion.',
    operationalCost: 'Direct penalty leak of ₹1,500–₹5,000 per delayed truck.'
  }
];

  guaranteeText: string;
}

export interface ValueProposition {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface StakeholderPerspective {
  id: 'economic_buyer' | 'champion' | 'user' | 'evaluator';
  role: string;
  unspokenAnxiety: string;
  priorityOutcome: string;
  coreQuestion: string;
  roleTitle?: string;
  stakeholderType?: string;
  riskMitigation?: string;
  keyMetrics?: string[];
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

export type OperatingSystemModule = TenTeamOperatingSystem;

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
  timeline: string;
}

export interface AuditDeliverable {
  title: string;
  description: string;
  format: string;
}

export interface MethodologyStage {
  phase: string;
  name: string;
  description: string;
}

export interface DataTrustItem {
  title: string;
  description: string;
}

export interface AuditPhase {
  phase: string;
  name: string;
  description: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  clientType: string;
  metrics: string[];
  summary: string;
}

export interface ObjectionItem {
  id: string;
  category: string;
  objection: string;
  rootCause: string;
  reframe: string;
  proofPoint: string;
}

export interface CustomerAnxiety {
  id: string;
  anxiety: string;
  impact: string;
  reassurance: string;
}

export interface IcebergDimension {
  id: string;
  surfaceSymptom: string;
  underwaterRootCause: string;
  operationalCost: string;
}

export const COMMERCIAL_TIERS: CommercialTier[] = [
  {
    id: 'tier_0_sandbox',
    name: 'Tier 0 — Free Diagnostic Sandbox',
    badge: '₹0 Free',
    subtitle: 'Self-Serve CSV Diagnostic & Rule-Engine Playground',
    pricing: '₹0',
    commitment: 'Self-Serve',
    targetAudience: 'SME Plant Finance & Operations Teams',
    deliverables: [
      'Upload 1 sample ERP CSV (Dead Stock / Rate-Card / Bin Variance)',
      'Run 3 baseline mathematical invariant audit checks',
      'Instant executive summary preview report',
      'Export anonymized leak diagnostic breakdown'
    ],
    guarantee: '100% Free Forever, No Credit Card Required',
    buttonText: 'Launch Free Sandbox',
    buttonVariant: 'outline'
  },
  {
    id: 'tier_1_48hr_diagnostic',
    name: 'Tier 1 — 48-Hour Executive Diagnostic',
    badge: '₹18,000 One-Time',
    subtitle: 'Full Line-Item Algorithmic Leak Audit Across All 4 Engines',
    pricing: '₹18,000',
    commitment: 'One-Time Audit',
    targetAudience: 'Manufacturing & Distribution Companies (₹10 Cr–₹500 Cr Revenue)',
    deliverables: [
      'Complete P1–P4 Line-Item Audit (Dead Stock, OTIF, Freight, Ghost Stock)',
      'Row-Traceable Leak Findings & Recovery Action Plan',
      '48-Hour Executive Sign-Off Presentation & CSV Evidence Bundle',
      'Dedicated Operationalyst Audit Lead Strategy Call'
    ],
    guarantee: '₹2,50,000 Actionable Leak Finding Guarantee or 100% Instant Refund',
    buttonText: 'Start 48-Hr Diagnostic',
    buttonVariant: 'primary',
    isPopular: true
  },
  {
    id: 'tier_2_watchdog_retainer',
    name: 'Tier 2 — Automated Monthly Watchdog Retainer',
    badge: '₹15,000 / month',
    subtitle: 'Continuous Automated Supervision & Leak Prevention Engine',
    pricing: '₹15,000 / mo',
    commitment: 'Monthly Retainer',
    targetAudience: 'Growing Operations Requiring Continuous Leak Guardrails',
    deliverables: [
      'Continuous monthly automated P1–P4 CSV audit runs',
      'Real-time anomaly alerts for rate-card drift & bin variances',
      'Monthly executive dashboard & trend analytics',
      'Priority SLA support & rule-engine customization'
    ],
    guarantee: 'Cancel anytime, zero lock-in period',
    buttonText: 'Subscribe to Watchdog',
    buttonVariant: 'secondary'
  },
  {
    id: 'tier_3_ca_partner',
    name: 'Tier 3 — CA & Advisory Partner Network',
    badge: '20% Revenue Share',
    subtitle: 'White-Label / Co-Branded Diagnostic Engine for Audit & Advisory Firms',
    pricing: '20% Revenue Share',
    commitment: 'Partner Program',
    targetAudience: 'Chartered Accountants, Management Consultants & Advisory Practices',
    deliverables: [
      'Co-branded 48-Hour Leak Diagnostic Reports for audit clients',
      '20% recurring referral & diagnostic fee revenue share',
      'Dedicated partner dashboard & client onboarding support',
      'Access to partner-exclusive diagnostic toolkits & frameworks'
    ],
    guarantee: 'Partner Success Onboarding & Dedicated Support',
    buttonText: 'Join Partner Program',
    buttonVariant: 'outline'
  }
];

export const TEN_TEAM_OPERATING_SYSTEM: TenTeamOperatingSystem[] = [
  {
    id: 'team_1_working_capital',
    name: 'Team 1: Working Capital & Dead Stock Recovery',
    leadRole: 'CFO & Treasury Lead',
    focus: 'Inventory Stagnation (>180d) & Cash Re-alignment',
    deliverable: 'P1 Working Capital Audit & Liquid Inventory Plan',
    sla: '48 Hours'
  },
  {
    id: 'team_2_otif_dispatch',
    name: 'Team 2: OTIF & Dispatch SLA Reliability',
    leadRole: 'VP Operations & Logistics Lead',
    focus: 'Dispatch Delay Penalties & On-Time In-Full Rate',
    deliverable: 'P2 Dispatch Leak Audit & Penalty Reconciler',
    sla: '48 Hours'
  },
  {
    id: 'team_3_freight_ratecard',
    name: 'Team 3: Freight Rate-Card & Detention Audit',
    leadRole: 'Logistics Controller & Freight Auditor',
    focus: 'Transporter Overcharges & Detention Penalties',
    deliverable: 'P3 Rate-Card Discrepancy & Overcharge Recovery Report',
    sla: '48 Hours'
  },
  {
    id: 'team_4_warehouse_ghoststock',
    name: 'Team 4: Warehouse Bin Variance & Ghost Stock',
    leadRole: 'Plant Warehouse Manager',
    focus: 'Physical vs System Inventory Discrepancy & Shrinkage',
    deliverable: 'P4 Ghost Stock & Bin Reconciliation Engine',
    sla: '48 Hours'
  },
  {
    id: 'team_5_procurement_price_variance',
    name: 'Team 5: Procurement Price Variance (PPV)',
    leadRole: 'Head of Procurement',
    focus: 'PO vs Invoice Contract Price Drift',
    deliverable: 'PPV Leak Audit & Vendor Recovery Matrix',
    sla: '48 Hours'
  },
  {
    id: 'team_6_scrap_yield_loss',
    name: 'Team 6: Production Scrap & Yield Loss',
    leadRole: 'Plant Head & Quality Manager',
    focus: 'Bill-of-Materials Yield Loss & Unaccounted Scrap',
    deliverable: 'Scrap Variance & Yield Recovery Report',
    sla: '48 Hours'
  },
  {
    id: 'team_7_vendor_debit_notes',
    name: 'Team 7: Vendor Debit Note Reconciliation',
    leadRole: 'Accounts Payable Lead',
    focus: 'Unclaimed Quality & Quantity Debit Notes',
    deliverable: 'Debit Note Leak Audit & Claim Recovery Schedule',
    sla: '48 Hours'
  },
  {
    id: 'team_8_customer_deductions',
    name: 'Team 8: Customer Shortage & Deduction Audit',
    leadRole: 'Accounts Receivable Controller',
    focus: 'Unauthorized Retail & B2B Shortage Deductions',
    deliverable: 'AR Deduction Reconciler & Chargeback Challenge Pack',
    sla: '48 Hours'
  },
  {
    id: 'team_9_maintenance_mro',
    name: 'Team 9: MRO & Maintenance Spare Optimization',
    leadRole: 'Plant Maintenance Lead',
    focus: 'Overstocked Machinery Spares & Duplicate SKUs',
    deliverable: 'MRO Rationalization & Spare Liquidation Plan',
    sla: '48 Hours'
  },
  {
    id: 'team_10_statutory_gst_e-waybill',
    name: 'Team 10: GST, E-Way Bill & Transit Compliance',
    leadRole: 'Tax & Compliance Manager',
    focus: 'E-Way Bill Expiry & GST Input Tax Credit Leakage',
    deliverable: 'Transit Compliance Audit & ITC Recovery Diagnostic',
    sla: '48 Hours'
  },
  {
    id: 'team_11_contract_labour_overtime',
    name: 'Team 11: Contract Labour & Overtime Audit',
    leadRole: 'Plant HR & Factory Manager',
    focus: 'Shift Overtime Inflation & Attendance Discrepancies',
    deliverable: 'Labour Overtime Leak Audit & Shift Reconciliation',
    sla: '48 Hours'
  },
  {
    id: 'team_12_energy_power_factor',
    name: 'Team 12: Utility & Energy Power-Factor Leakage',
    leadRole: 'Chief Engineer / Energy Auditor',
    focus: 'Power Factor Penalties & Peak Demand Surcharges',
    deliverable: 'Energy Cost Diagnostic & Power Factor Optimization',
    sla: '48 Hours'
  },
  {
    id: 'team_13_packaging_tare_weight',
    name: 'Team 13: Packaging Tare-Weight & Underfill Variance',
    leadRole: 'Packaging & QA Manager',
    focus: 'Tare-Weight Material Over-Consumption & Fill Leaks',
    deliverable: 'Packaging Consumption Audit & Tare Correction Plan',
    sla: '48 Hours'
  },
  {
    id: 'team_14_ca_partner_governance',
    name: 'Team 14: CA Partner Governance & Institutional Audit',
    leadRole: 'External Partner Lead CA',
    focus: 'Multi-Plant Financial Invariant Governance & Board Reporting',
    deliverable: 'Institutional Multi-Plant Board Audit Package',
    sla: '48 Hours'
  }
];

export const NAV_LINKS: NavLink[] = [
  { label: 'Diagnostic Calculator', href: '#estimator' },
  { label: 'Audit Engines', href: '#engines' },
  { label: '14-Team OS', href: '#operating-system' },
  { label: 'Commercial Tiers', href: '#tiers' },
  { label: 'CA Partner Model', href: '#ca-partner' }
];

export const HERO_HEADLINE_VARIANTS: Record<string, HeroHeadlineVariant> = {
  default: {
    badge: '₹2,50,000 Leak Finding Guarantee',
    headline: 'Stop Factory Profit Leaks in 48 Hours',
    subhead: 'Continuous algorithmic supervision across inventory, freight, OTIF penalties, and warehouse bin variances.'
  }
};

export const ACTIVE_DEFAULT_VARIANT = 'default';

export const PROBLEM_QUESTIONS: ProblemQuestion[] = [
  {
    question: 'How much working capital is locked in inventory >180 days?',
    impact: 'Stagnant capital erodes 22% annually in carrying costs.'
  },
  {
    question: 'Are transporter freight charges matching contract rate cards?',
    impact: 'Unverified detention and rate drift cost ₹15L+ per plant annually.'
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Export Standard CSVs',
    detail: 'No ERP integration required. Simply export inventory, freight, and dispatch CSVs.',
    timeline: '15 Minutes'
  },
  {
    step: '02',
    title: 'Algorithmic Supervision',
    detail: 'Our mathematical rule engine scans 100% of line items for invariant violations.',
    timeline: '24 Hours'
  },
  {
    step: '03',
    title: 'Executive Deliverable',
    detail: 'Receive row-traceable leak findings with exact recovery actions.',
    timeline: '48 Hours'
  }
];

export const AUDIT_DELIVERABLES: AuditDeliverable[] = [
  {
    title: 'Executive Leak Summary',
    description: 'High-level financial view of total recoverable profit leaks across P1–P4.',
    format: 'PDF / Board Presentation'
  },
  {
    title: 'Row-Traceable Line-Item Evidence',
    description: 'Every discrepancy linked back to raw ERP transaction IDs for recovery.',
    format: 'Excel / CSV'
  }
];

export const METHODOLOGY_STAGES: MethodologyStage[] = [
  {
    phase: 'Phase 1',
    name: 'Data Ingestion & Normalization',
    description: 'Standardize ERP data tables into algorithmic invariant structures.'
  },
  {
    phase: 'Phase 2',
    name: 'Mathematical Rule Execution',
    description: 'Execute P1–P4 audit checks across 100% of transaction rows.'
  }
];

export const DATA_TRUST_ITEMS: DataTrustItem[] = [
  {
    title: 'Bank-Grade Security',
    description: 'Read-only data processing with complete confidentiality.'
  },
  {
    title: 'Zero ERP Strain',
    description: 'Operates entirely offline via file exports without system touchpoints.'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What if less than ₹2.5L in leaks is identified?',
    answer: 'We issue an immediate 100% refund on the ₹18,000 diagnostic fee with zero conditions.'
  },
  {
    question: 'Does this require IT integration with our ERP?',
    answer: 'No integration required. The diagnostic runs entirely on standard CSV/Excel file exports.'
  }
];

export const FOUNDER_EXECUTIVE_SIGNOFF = {
  name: 'Operationalyst Engineering & Audit Governance',
  title: 'Institutional Profit Leak Supervision',
  note: 'Backed by our contractually guaranteed ₹2,50,000 minimum leak discovery or 100% money back.'
};

export interface SampleAuditMode {
  id: string;
  name: string;
  category: string;
  requiredColumns: string[];
  sampleLeak: string;
  deliverable: string;
}

export type SampleAuditModeId = 'p1_dead_stock' | 'p2_otif' | 'p3_freight' | 'p4_bin_variance';

export const getReconciledSampleAuditModes = (): SampleAuditMode[] => [
  {
    id: 'p1_dead_stock',
    name: 'P1: Dead Stock & Working Capital',
    category: 'Inventory Stagnation',
    requiredColumns: ['SKU_ID', 'Batch_Date', 'Quantity', 'Unit_Cost', 'Location'],
    sampleLeak: 'Batch #B-8842: 1,420 units inactive for 214 days. Trapped Working Capital: ₹18,46,000.',
    deliverable: 'P1 Stagnant Inventory Liquidation Schedule & Provisioning Matrix'
  },
  {
    id: 'p2_otif',
    name: 'P2: OTIF Dispatch Reliability',
    category: 'Dispatch Penalties',
    requiredColumns: ['Order_ID', 'Promised_Date', 'Dispatch_Date', 'Penalty_Rate'],
    sampleLeak: 'Order #ORD-9912: Dispatch delayed 4 days without customer waiver. Penalty Leak: ₹1,24,000.',
    deliverable: 'P2 OTIF Penalty Reconciliation & SLA Enforcement Guide'
  },
  {
    id: 'p3_freight',
    name: 'P3: Freight Rate-Card & Detention Audit',
    category: 'Logistics Overcharge',
    requiredColumns: ['Invoice_ID', 'Vehicle_Type', 'Contract_Rate', 'Billed_Rate', 'Detention_Hours'],
    sampleLeak: 'Invoice #INV-4401: Billed freight rate ₹45/km vs contracted ₹38/km. Overcharge: ₹87,500.',
    deliverable: 'P3 Freight Invoice Recovery Pack & Transporter Overcharge Recovery'
  },
  {
    id: 'p4_bin_variance',
    name: 'P4: Warehouse Bin Variance & Ghost Stock',
    category: 'Physical Shrinkage',
    requiredColumns: ['Bin_ID', 'System_Qty', 'Physical_Qty', 'Unit_Value'],
    sampleLeak: 'Bin #C-14: System shows 500 units, physical count 320 units. Ghost Stock Leak: ₹3,15,000.',
    deliverable: 'P4 Bin Variance Reconciliation & Shrinkage Prevention Plan'
  }
];

export const NAV_LINKS_DEFAULTS = NAV_LINKS;
export const HERO_CONTENT = HERO_HEADLINE_VARIANTS.default;
export const VALUE_PROPOSITIONS: ValueProposition[] = [];
export const AUDIT_PHASES: AuditPhase[] = [];
export const CASE_STUDIES: CaseStudy[] = [];

export const STAKEHOLDER_PERSPECTIVES: StakeholderPerspective[] = [
  {
    id: 'economic_buyer',
    role: 'Managing Director / Plant Owner / CFO',
    unspokenAnxiety: 'Uncertain whether working capital is locked in buffer stock or unmarketable dead inventory',
    priorityOutcome: 'Immediate liquidity unlocking without disrupting ongoing factory production',
    coreQuestion: 'How much cash is trapped in our warehouse right now, and when can we liquidate it?',
    roleTitle: 'Managing Director / CFO / Board',
    stakeholderType: 'Economic Buyer',
    riskMitigation: '₹2,50,000 Leak Recovery Guarantee on the 48-Hour Diagnostic + 100% money-back',
    keyMetrics: ['EBITDA Impact', 'Working Capital Unlocked', 'ROI Multiplier', 'Payback Period']
  },
  {
    id: 'champion',
    role: 'VP Supply Chain / COO / Head of Ops',
    unspokenAnxiety: 'Getting blamed for inventory write-offs or production delays',
    priorityOutcome: 'Eliminating ghost inventory, OTIF penalties, and supplier price leaks',
    coreQuestion: 'Will this give me real-time visibility and automated proof to align plant managers?',
    roleTitle: 'VP Supply Chain / COO / Head of Ops',
    stakeholderType: 'Executive Champion',
    riskMitigation: 'Non-invasive audit that works directly off CSV exports without ERP integration',
    keyMetrics: ['OTIF %', 'Inventory Turn Rate', 'Leak Prevention Rate', 'Audit Lead Time']
  },
  {
    id: 'user',
    role: 'Plant Warehouse Manager / Procurement Specialist',
    unspokenAnxiety: 'Exposing operational flaws or having to learn complex software',
    priorityOutcome: 'Automated discrepancy detection and actionable, zero-friction daily alerts',
    coreQuestion: 'Is this going to add more manual data entry work or complicate daily plant workflow?',
    roleTitle: 'Plant Manager / Warehouse Lead / Procurement Specialist',
    stakeholderType: 'Operational User',
    riskMitigation: 'Zero-code interface, pre-built Excel/CSV templates, and direct WhatsApp/Email reports',
    keyMetrics: ['Daily Reconciliations', 'Time Saved/Week', 'Error Detection Speed', 'User Adoption']
  },
  {
    id: 'evaluator',
    role: 'IT Director / Statutory Auditor / Controller',
    unspokenAnxiety: 'Data breaches, ERP downtime, or vendor lock-in',
    priorityOutcome: '100% SOC2/ISO compliant data security, clean audit trails, and zero ERP strain',
    coreQuestion: 'How safe is our ERP data and how fast can this be deployed securely?',
    roleTitle: 'IT Director / Internal Audit / Controller',
    stakeholderType: 'Technical & Compliance Evaluator',
    riskMitigation: 'Air-gapped local calculation option, read-only data ingest, bank-grade encryption',
    keyMetrics: ['Deployment Time', 'Security Compliance Rate', 'API Response Time', 'System Uptime']
  }
];

export const OBJECTION_MATRIX: ObjectionItem[] = [
  {
    id: 'erp_does_this',
    category: 'System Redundancy',
    objection: 'Our SAP/Oracle/Tally ERP system already handles inventory and cost accounting.',
    rootCause: 'ERPs record static transaction history but lack continuous cross-table pattern detection and real-time leak diagnostics.',
    reframe: 'ERP is your system of record; Operationalyst is your automated financial watchdog built on top of ERP exports.',
    proofPoint: 'Identified ₹42L in hidden freight double-billing across SAP users within 48 hours.'
  },
  {
    id: 'team_too_busy',
    category: 'Operational Bandwidth',
    objection: 'Our plant and finance teams are currently overloaded with annual closing.',
    rootCause: 'Fear of software onboarding friction and heavy manual data input required.',
    reframe: 'Requires 0 hours of IT or operational integration. Send 3 standard CSV files and receive full diagnostic in 48 hours.',
    proofPoint: 'Average client setup time is 15 minutes to export standard CSV reports.'
  },
  {
    id: 'consultant_comparison',
    category: 'Cost & Vendor Perception',
    objection: 'Big 4 audit consultants already audit our operations annually.',
    rootCause: 'Consultants perform sample-based annual reviews for compliance, not 100% transactional algorithmic audit.',
    reframe: 'Consultants charge ₹20L+ for manual sampling; Operationalyst runs 100% line-item mathematical verification for ₹18,000.',
    proofPoint: '100% line-item coverage vs standard 5-10% manual sampling.'
  },
  {
    id: 'guarantee_doubt',
    category: 'Risk & Trust',
    objection: 'How can you guarantee ₹2,50,000 in leak detection or 100% refund?',
    rootCause: 'Skepticism from previous software vendors making undelivered ROI promises.',
    reframe: 'If our 48-hour diagnostic identifies less than ₹2.5L in actionable leaks, we issue an instant 100% refund—zero conditions.',
    proofPoint: '98.4% diagnostic hit rate across 120+ manufacturing plants.'
  }
];

export const CUSTOMER_ANXIETY_MAP: CustomerAnxiety[] = [
  {
    id: 'implementation_risk',
    anxiety: 'Fearing complex IT integration and disruption to ongoing plant operations.',
    impact: 'Delayed buying decisions and stuck status quo.',
    reassurance: 'Zero ERP integration required. Pure file-based CSV audit completed in under 48 hours.'
  },
  {
    id: 'roi_uncertainty',
    anxiety: 'Uncertain whether audit finding values will exceed consulting/tool costs.',
    impact: 'Hesitation from CFO/Economic Buyer.',
    reassurance: 'Contractual ₹2.5L leak finding guarantee backed by 100% immediate money-back policy.'
  },
  {
    id: 'internal_pushback',
    anxiety: 'Plant managers feeling targeted or scrutinized by automated audit tools.',
    impact: 'Friction between central finance and plant operations.',
    reassurance: 'Positioned as an empowering watchdog tool that prevents supplier/freight overcharges.'
  }
];

export const BEHAVIORAL_ICEBERG_DIMENSIONS: IcebergDimension[] = [
  {
    id: 'visible_costs',
    surfaceSymptom: 'Reported Purchase Price Variances & Standard Cost Margins',
    underwaterRootCause: 'Uncaptured Detention Penalties, Off-Invoice Freight Markups & Ghost Stock',
    operationalCost: '3%–7% silently eroded from plant EBITDA annually'
  },
  {
    id: 'inventory_holding',
    surfaceSymptom: 'Standard Inventory Turnover Days (60 Days Target)',
    underwaterRootCause: 'Stagnant Batch Holds (>180 Days) masked by high-turn fast-moving SKUs',
    operationalCost: '22% annual carrying cost burn on dead working capital'
  },
  {
    id: 'supplier_compliance',
    surfaceSymptom: 'Contracts signed with approved rate cards and SLA terms',
    underwaterRootCause: 'Systemic line-item rate drift and invoice calculation anomalies across vendors',
    operationalCost: '₹15L–₹80L unrecovered vendor leak per facility'
  }
];
