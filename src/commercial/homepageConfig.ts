/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HeadlineVariant {
  id: 'A' | 'B' | 'C';
  headline: string;
}

export const HERO_HEADLINE_VARIANTS: Record<'A' | 'B' | 'C', HeadlineVariant> = {
  A: {
    id: 'A',
    headline: 'How Much of Your Inventory Has Stopped Moving?'
  },
  B: {
    id: 'B',
    headline: 'Find Working Capital Hidden Inside Inventory'
  },
  C: {
    id: 'C',
    headline: 'Know Which Inventory Needs Attention Before Your Next Review'
  }
};

export const ACTIVE_DEFAULT_VARIANT: 'A' | 'B' | 'C' = 'A';

export const PROBLEM_QUESTIONS = [
  {
    num: '01',
    label: 'STAGNANCY',
    question: 'Which SKUs have not moved?',
    description:
      'Items sitting on warehouse racks with zero consumption across multiple months or quarters, continuing to occupy physical footprint unnoticed.'
  },
  {
    num: '02',
    label: 'AGEING VELOCITY',
    question: 'How long have they been inactive?',
    description:
      'Tracking 90, 180, and 360+ day aging thresholds before items deteriorate, rust, or turn into irreversible scrap write-downs.'
  },
  {
    num: '03',
    label: 'VALUE CONCENTRATION',
    question: 'Where is inventory value concentrated?',
    description:
      'The Pareto 80/20 distribution showing which handful of high-value parts lock up the majority of idle working capital.'
  },
  {
    num: '04',
    label: 'PRIORITY RANKING',
    question: 'Which items should be investigated first?',
    description:
      'Algorithmic prioritization ranking inventory items by carrying cost burn and liquidation feasibility.'
  }
];

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
    sampleLeak: 'Batch #B-8842: 1,420 units inactive for 214 days. Trapped Working Capital: ₹18,46,000',
    deliverable: 'P1 Stagnant Inventory Liquidation Schedule & Provisioning Matrix'
  },
  {
    id: 'p2_otif',
    name: 'P2: OTIF Dispatch Reliability',
    category: 'Dispatch Penalties',
    requiredColumns: ['Order_ID', 'Promised_Date', 'Dispatch_Date', 'Penalty_Rate'],
    sampleLeak: 'Order #ORD-9912: Dispatch delayed 4 days without customer waiver. Penalty Leak: ₹1,24,000',
    deliverable: 'P2 OTIF Penalty Reconciliation & SLA Enforcement Guide'
  },
  {
    id: 'p3_freight',
    name: 'P3: Freight Rate-Card & Detention Audit',
    category: 'Logistics Overcharge',
    requiredColumns: ['Invoice_ID', 'Vehicle_Type', 'Contract_Rate', 'Billed_Rate', 'Detention_Hours'],
    sampleLeak: 'Invoice #INV-4401: Billed freight rate ₹45/km vs contracted ₹38/km. Overcharge: ₹87,500',
    deliverable: 'P3 Freight Invoice Recovery Pack & Transporter Overcharge Recovery'
  },
  {
    id: 'p4_bin_variance',
    name: 'P4: Warehouse Bin Variance & Ghost Stock',
    category: 'Physical Shrinkage',
    requiredColumns: ['Bin_ID', 'System_Qty', 'Physical_Qty', 'Unit_Value'],
    sampleLeak: 'Bin #C-14: System shows 500 units, physical count 320 units. Ghost Stock Leak: ₹3,15,000',
    deliverable: 'P4 Bin Variance Reconciliation & Shrinkage Prevention Plan'
  }
];

export interface MethodologyStage {
  phase: string;
  name: string;
  description: string;
}

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

export const FOUNDER_EXECUTIVE_SIGNOFF = {
  name: 'Operationalyst Engineering & Audit Governance',
  title: 'Institutional Profit Leak Supervision',
  note: 'Backed by our contractually guaranteed ₹2,50,000 minimum leak discovery or 100% money back.'
};

export interface CommercialTier {
  id: string;
  tierName: string;
  pricing: string;
  targetAudience: string;
  deliverable: string;
  guarantee: string;
  iconName: string;
  recommendedRole: string;
  scopeLimit: string;
  ctaText: string;
}

export const COMMERCIAL_TIERS: CommercialTier[] = [
  {
    id: 'sandbox',
    tierName: '₹0 Sandbox / Self-Serve',
    pricing: '₹0',
    targetAudience: 'Early Stage & Exploratory Operations',
    deliverable: 'Instant Automated ERP Data Ingestion & Preliminary Leak Detection',
    guarantee: '100% Free Access to Core Audit Sandbox',
    iconName: 'ShieldCheck',
    recommendedRole: 'Operations Analyst',
    scopeLimit: '1 ERP Data Source / 10,000 Rows',
    ctaText: 'Launch Sandbox'
  },
  {
    id: 'diagnostic',
    tierName: '₹18,000 Diagnostic Audit',
    pricing: '₹18,000',
    targetAudience: 'Mid-Market & Rapid Growth Operations',
    deliverable: 'Complete P1–P4 Profit Leak Reconciliation & Executive Recovery Playbook',
    guarantee: 'Guaranteed ₹2,50,000 Minimum Leak Discovery or 100% Refund',
    iconName: 'FileCheck',
    recommendedRole: 'CFO / VP Supply Chain',
    scopeLimit: 'Full Annual ERP Historical Data Audit',
    ctaText: 'Request Diagnostic'
  },
  {
    id: 'watchdog',
    tierName: '₹15,000/mo Watchdog',
    pricing: '₹15,000/mo',
    targetAudience: 'Enterprise Supply Chains & Multi-Facility Logistics',
    deliverable: 'Continuous Automated Monitoring & Real-time Profit Leak Prevention Alerts',
    guarantee: 'Ongoing Real-time SLA & Rate Card Compliance Enforcement',
    iconName: 'Activity',
    recommendedRole: 'Head of Audit / Chief Operating Officer',
    scopeLimit: 'Unlimited Transactions & Continuous Sync',
    ctaText: 'Activate Watchdog'
  },
  {
    id: 'ca_partner',
    tierName: '20% CA Partner Desk',
    pricing: '20%',
    targetAudience: 'Chartered Accountants & Fractional CFO Partners',
    deliverable: 'White-Labeled Audit Portal, Co-branded Reports & Partner Revenue Share',
    guarantee: '20% Success Share on Verified Leak Recovery Audit Engagements',
    iconName: 'Briefcase',
    recommendedRole: 'CA Firm Principal / Fractional CFO',
    scopeLimit: 'Multi-Client Partner Dashboard',
    ctaText: 'Join Partner Desk'
  }
];

export interface TenTeamOperatingSystemEntry {
  id: string;
  teamName: string;
  primaryMetric: string;
  leakVector: string;
  invariantMechanism: string;
  governanceArtifact: string;
}

export const TEN_TEAM_OPERATING_SYSTEM: TenTeamOperatingSystemEntry[] = [
  {
    id: 'procurement',
    teamName: 'Procurement & Vendor Management',
    primaryMetric: 'Purchase Order Price Variance (PPV)',
    leakVector: 'Unsanctioned vendor price increases and un-reconciled volume rebates',
    invariantMechanism: 'Algorithmic line-item validation against historical rate-card invariants',
    governanceArtifact: 'Automated PO Variance Flagging & Vendor SLA Audit Summary'
  },
  {
    id: 'warehouse',
    teamName: 'Warehouse & Goods Receipt',
    primaryMetric: 'GRN Bin Placement Accuracy & Cycle Count Delta',
    leakVector: 'Unrecorded damaged stock arrivals and mis-binned inventory items',
    invariantMechanism: 'Real-time double-entry bin reconciliation protocol',
    governanceArtifact: 'Physical Inventory Variance Matrix & Shrinkage Root Cause Audit'
  },
  {
    id: 'inventory_control',
    teamName: 'Inventory Control & Provisioning',
    primaryMetric: 'Dead Stock & Slow-Moving Capital Lockup',
    leakVector: 'Stagnant inventory aging past 180 days with zero consumption alerts',
    invariantMechanism: 'Automated aging velocity tracking & write-down forecasting',
    governanceArtifact: 'P1 Inventory Liquidation Schedule & Stagnancy Playbook'
  },
  {
    id: 'logistics',
    teamName: 'Logistics & Freight Audit',
    primaryMetric: 'OTIF Dispatch Reliability & Rate Card Compliance',
    leakVector: 'Transporter overcharges, unauthorized detention fees, and route inflation',
    invariantMechanism: 'Automated freight invoice audit against contract rate matrices',
    governanceArtifact: 'P3 Freight Rate Recovery Pack & Transporter SLA Scorecard'
  },
  {
    id: 'accounts_payable',
    teamName: 'Accounts Payable & Invoicing',
    primaryMetric: '3-Way Matching Compliance Rate',
    leakVector: 'Duplicate invoice payments and missed early payment cash discounts',
    invariantMechanism: 'Automated 3-way match invariant enforcement (PO vs GRN vs Invoice)',
    governanceArtifact: 'Duplicate Payment Recovery Ledger & Early Payment Discount Log'
  },
  {
    id: 'accounts_receivable',
    teamName: 'Accounts Receivable & Credit Risk',
    primaryMetric: 'DSO (Days Sales Outstanding) & Credit Limit Breach Delta',
    leakVector: 'Uncollected bad debt and un-billed customer freight surcharges',
    invariantMechanism: 'Automated aging waterfall & credit line freeze triggers',
    governanceArtifact: 'Receivables Aging Reconciliation & Customer Credit Governance Report'
  },
  {
    id: 'sales_ops',
    teamName: 'Sales Operations & Commercial Terms',
    primaryMetric: 'Discount Invariant Compliance & Margin Erosion Delta',
    leakVector: 'Unauthorized sales discounts and un-audited promotional rebates',
    invariantMechanism: 'Strict algorithmic threshold enforcement for discount matrix overrides',
    governanceArtifact: 'Margin Protection Audit & Discount Violation Remediation Log'
  },
  {
    id: 'quality_assurance',
    teamName: 'Quality Assurance & Returns (RMA)',
    primaryMetric: 'RMA Processing Velocity & Vendor Scrap Debit Note Claims',
    leakVector: 'Unclaimed vendor debit notes for rejected raw materials and scrap',
    invariantMechanism: 'Automated defect log to vendor debit note conversion pipeline',
    governanceArtifact: 'Vendor Debit Note Claim Register & QA Rejection Audit'
  },
  {
    id: 'production_planning',
    teamName: 'Production Planning & Material Yield',
    primaryMetric: 'BOM (Bill of Materials) Variance & Scrap Allowance Invariant',
    leakVector: 'Excess material wastage and un-tracked production scrap losses',
    invariantMechanism: 'Real-time BOM consumption vs finished goods yield audit',
    governanceArtifact: 'Material Yield Reconciliation & Production Scrap Audit Report'
  },
  {
    id: 'executive_finance',
    teamName: 'Executive Finance & CFO Oversight',
    primaryMetric: 'Net Working Capital Days & Cash Leak Velocity',
    leakVector: 'Executive blind spots across decentralized multi-unit operational leaks',
    invariantMechanism: 'Unified profit leak supervision portal with automated recovery tracking',
    governanceArtifact: 'Executive Working Capital Leak Executive Brief & Board Governance Deck'
  },
  {
    id: 'tax_compliance',
    teamName: 'Tax & Regulatory Compliance',
    primaryMetric: 'ITC (Input Tax Credit) Mismatch & Penalty Prevention',
    leakVector: 'Unclaimed GST/VAT input credits due to vendor filing mismatches',
    invariantMechanism: 'Automated GSTR-2B vs ERP invoice reconciliation algorithm',
    governanceArtifact: 'Input Tax Credit Reconciliation Register & Vendor Compliance Matrix'
  },
  {
    id: 'store_operations',
    teamName: 'Store Operations & Retail Fulfillment',
    primaryMetric: 'Store-Level Shrinkage & Inventory Accuracy',
    leakVector: 'Point-of-sale inventory leakage, un-recorded transfers, and store scrap',
    invariantMechanism: 'Daily store POS to ERP perpetual inventory balance check',
    governanceArtifact: 'Store Shrinkage Variance Matrix & Inter-Store Transfer Log'
  },
  {
    id: 'contract_governance',
    teamName: 'Contract Governance & Vendor Claims',
    primaryMetric: 'Contractual SLA Compliance & Penalty Enforceability',
    leakVector: 'Un-enforced vendor SLA delay penalties and missed service credits',
    invariantMechanism: 'Automated SLA breach tracking against contractual penalty matrices',
    governanceArtifact: 'Contractual Penalty Recovery Dossier & SLA Audit Register'
  },
  {
    id: 'ca_partner_desk',
    teamName: 'CA Partner Desk & External Audit',
    primaryMetric: 'External Recovery Verification & Revenue Share Audit',
    leakVector: 'Missed profit leak recovery opportunities during traditional annual audits',
    invariantMechanism: 'Continuous algorithmic audit overlay for fractional CFOs & CA firms',
    governanceArtifact: 'External CA Partner Co-Branded Profit Leak Audit Report'
  }
];

export const INSTITUTIONAL_TEAMS = TEN_TEAM_OPERATING_SYSTEM;

export interface StakeholderPerspective {
  id: 'economic_buyer' | 'champion' | 'user' | 'evaluator';
  roleTitle: string;
  stakeholderType: string;
  coreQuestion: string;
  priorityOutcome: string;
  unspokenAnxiety: string;
  riskMitigation: string;
  keyMetrics: string[];
}

export const STAKEHOLDER_PERSPECTIVES: StakeholderPerspective[] = [
  {
    id: 'economic_buyer',
    roleTitle: 'Owner / Managing Director / CFO',
    stakeholderType: 'Economic Buyer',
    coreQuestion: 'How much working capital is needlessly trapped in our warehouse, and what does it cost to do nothing?',
    priorityOutcome: 'Release locked working capital, reduce annual 18-24% inventory carrying cost burn, and establish permanent profit leak supervision.',
    unspokenAnxiety: 'Will this require capital expenditure, create consultant dependency, or yield numbers my team disputes?',
    riskMitigation: 'Collaborative pilot audit at zero upfront software cost. Calculations are 100% explainable and verified against ERP source rows.',
    keyMetrics: ['Trapped Capital (>180d)', 'Annual Carrying Cost Burn', 'Net Working Capital Days']
  },
  {
    id: 'champion',
    roleTitle: 'Head of Operations / VP Supply Chain',
    stakeholderType: 'Operational Champion',
    coreQuestion: 'Can this show us exact SKUs, batch numbers, and bin locations without burdening my team with manual audit work?',
    priorityOutcome: 'Automated identification of dead stock, OTIF penalties, and freight overcharges with actionable resolution steps.',
    unspokenAnxiety: 'Will this make my team look incompetent or disrupt our daily dispatch operations?',
    riskMitigation: 'Frames leak detection as system/process improvement, not personal fault. Non-invasive read-only data ingestion.',
    keyMetrics: ['OTIF Reliability %', 'Bin Variance Delta', 'Slow-Moving Stock Reduction']
  },
  {
    id: 'user',
    roleTitle: 'Warehouse Manager / Inventory Controller',
    stakeholderType: 'Primary User',
    coreQuestion: 'Will this give me a clear list of what to move, liquidate, or audit first today?',
    priorityOutcome: 'Prioritized daily action queues for stagnant batch liquidation and physical cycle counts.',
    unspokenAnxiety: 'Is this another complicated software tool I have to spend hours learning and feeding data into?',
    riskMitigation: 'Simple CSV/Excel batch upload with pre-configured templates. Instant output in standard operational terms.',
    keyMetrics: ['Physical Count Accuracy', 'Batch Liquidation Velocity', 'Bin Utilization Rate']
  },
  {
    id: 'evaluator',
    roleTitle: 'IT Director / Data Governance Lead',
    stakeholderType: 'Technical Evaluator',
    coreQuestion: 'How is data secured, processed, and validated for mathematical accuracy?',
    priorityOutcome: 'Zero core ERP schema modification, standard file interface, clear data privacy and encryption guarantees.',
    unspokenAnxiety: 'Will this require complex API integrations or risk compromising operational ERP data integrity?',
    riskMitigation: 'File-based ingestion options (CSV/XLSX), client-side mathematical invariant execution, zero database writes.',
    keyMetrics: ['Data Ingestion Time', 'Schema Match Rate', 'Zero Write Footprint']
  }
];

export interface ObjectionItem {
  id: string;
  objection: string;
  category: string;
  underlyingAnxiety: string;
  evidenceAndMechanism: string;
  institutionalGuarantee: string;
  verificationStep: string;
  response?: string;
}

export const OBJECTION_MATRIX: ObjectionItem[] = [
  {
    id: 'obj_1',
    objection: 'Our ERP and internal team already track inventory and logistics variance.',
    category: 'Process Capability',
    underlyingAnxiety: 'Fear that existing internal controls are being questioned or that buying external audit tools is redundant.',
    evidenceAndMechanism: 'Standard ERP reports summarize totals but rarely run multi-table invariant checks across batch aging, rate cards, and OTIF waivers simultaneously.',
    institutionalGuarantee: 'Zero cost pilot finding guarantee: We identify at least ₹2,50,000 in un-reconciled leaks or there is no fee.',
    verificationStep: 'Upload sample past 90-day dispatch & invoice CSV files to test against our P1–P4 audit rules.',
    response: 'Internal ERP systems log transactions, but Operationalyst applies continuous mathematical invariant algorithms specifically designed to uncover hidden cross-table profit leaks.'
  },
  {
    id: 'obj_2',
    objection: 'We cannot share sensitive operational and pricing data externally.',
    category: 'Data Security',
    underlyingAnxiety: 'Concern regarding proprietary customer pricing, vendor rate cards, or operational leak exposure.',
    evidenceAndMechanism: 'Data processing can run completely on anonymized CSV files with masked vendor and customer IDs.',
    institutionalGuarantee: 'Strict enterprise NDA with option for completely client-side local data processing.',
    verificationStep: 'Review our data sanitization specification and sample anonymized ingestion schema.',
    response: 'Security is guaranteed: all analysis operates on sanitized CSV data or client-side execution with zero database write back.'
  },
  {
    id: 'obj_3',
    objection: 'Our team does not have time to implement or learn another complex platform.',
    category: 'Operational Burden',
    underlyingAnxiety: 'Worry about heavy IT setup, staff training overhead, and implementation delays.',
    evidenceAndMechanism: 'Zero IT integration required. Operationalyst ingests standard CSV export files without API development.',
    institutionalGuarantee: 'Turnkey operationalization: full initial audit setup completed within 48 hours.',
    verificationStep: 'Run a 15-minute diagnostic test with standard ERP report exports.',
    response: 'No integration required. Just upload your existing ERP CSV exports, and instant audit deliverables are generated automatically.'
  },
  {
    id: 'obj_4',
    objection: 'How do we know the identified leaks are recoverable cash and not theoretical accounting numbers?',
    category: 'Financial ROI',
    underlyingAnxiety: 'Skepticism about theoretical vs actual cash flow impact and recovery enforceability.',
    evidenceAndMechanism: 'Every detected leak links to specific line-item PO numbers, invoice IDs, and physical batch locations.',
    institutionalGuarantee: 'Contractually backed leak recovery playbook detailing exact credit note and claim mechanisms.',
    verificationStep: 'Inspect our sample recovery dossier with exact line-item evidence packs.',
    response: 'Every finding includes row-level proof—specific invoice numbers, freight rate card discrepancies, and SKU batch locations ready for immediate recovery claims.'
  }
];

export interface IcebergDimension {
  id: string;
  num: string;
  name: string;
  category: string;
  symptom: string;
  scope: string;
  underlyingCause: string;
  financialImpact: string;
  preventativeMechanism: string;
}

export const BEHAVIORAL_ICEBERG_DIMENSIONS: IcebergDimension[] = [
  {
    id: 'iceberg_1',
    num: '01',
    name: 'Un-reconciled Dead Stock & Batch Stagnancy',
    category: 'Inventory Capital',
    symptom: 'Warehouse racks occupied by items with zero movement for 180+ days.',
    scope: 'Enterprise Inventory & Working Capital',
    underlyingCause: 'Purchase forecasting based on outdated demand velocity without automated aging alerts.',
    financialImpact: '18-24% annual capital carrying cost burn plus irreversible inventory write-downs.',
    preventativeMechanism: 'Algorithmic 90/180/360-day stagnancy thresholds with automated liquidation triggers.'
  },
  {
    id: 'iceberg_2',
    num: '02',
    name: 'Un-enforced Transporter OTIF SLA Penalties',
    category: 'Dispatch Operations',
    symptom: 'Delayed customer dispatches leading to customer debit notes and lost repeat orders.',
    scope: 'Outbound Logistics & Customer SLAs',
    underlyingCause: 'Manual dispatch tracking without automatic correlation between promised date and actual dispatch date.',
    financialImpact: 'Substantial contractual SLA penalty deductions and freight overcharge leakages.',
    preventativeMechanism: 'Automated 3-way date verification (PO Promised vs GRN vs Freight Invoice).'
  },
  {
    id: 'iceberg_3',
    num: '03',
    name: 'Logistics Freight Rate-Card Variance',
    category: 'Logistics Cost',
    symptom: 'Freight invoices paid as billed without contract rate-card validation.',
    scope: 'Freight & Transportation',
    underlyingCause: 'Spot freight rate approvals and un-audited detention/demurrage charges.',
    financialImpact: '5-12% excess logistics cost pay-out on annual freight spend.',
    preventativeMechanism: 'Automated freight invoice line-item reconciliation against contracted rate cards.'
  },
  {
    id: 'iceberg_4',
    num: '04',
    name: 'Warehouse Bin Variance & Physical Shrinkage',
    category: 'Physical Assets',
    symptom: 'Discrepancy between system inventory balance and physical cycle count.',
    scope: 'Warehouse Operations',
    underlyingCause: 'Unrecorded internal transfers, bin misplacements, and untracked scrap.',
    financialImpact: 'Ghost stock causing unexpected stock-outs and emergency high-cost procurement.',
    preventativeMechanism: 'Double-entry bin placement audits and automated variance threshold alerts.'
  }
];

export const ICEBERG_DIMENSIONS = BEHAVIORAL_ICEBERG_DIMENSIONS;

export const CUSTOMER_ANXIETY_MAP = [
  {
    id: 'anxiety_1',
    anxiety: 'Will this process disrupt daily warehouse dispatches?',
    mitigation: 'Non-invasive read-only file exports without software installation on core ERP.'
  },
  {
    id: 'anxiety_2',
    anxiety: 'What if our data is incomplete or has missing columns?',
    mitigation: 'Flexible schema mapping normalizes non-standard ERP data structures automatically.'
  }
];
