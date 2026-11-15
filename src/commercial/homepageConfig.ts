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

export const PROBLEM_QUESTIONS: string[] = [
  'How much inventory has sat unmoved for over 90 days?',
  'Which purchase orders were received after promised date without SLA credit claim?',
  'What is the discrepancy between freight invoices and contracted rate cards?'
];

export const METHODOLOGY_STAGES = [
  {
    num: '01',
    title: 'Data Ingestion',
    desc: 'Ingest purchase orders, goods receipts, and freight invoices with zero workflow disruption.'
  },
  {
    num: '02',
    title: 'Algorithmic Supervision',
    desc: 'Run multi-layer mathematical invariant checks across lead times, unit costs, and SLA rules.'
  },
  {
    num: '03',
    title: 'Evidence Generation',
    desc: 'Produce audit-ready proof packs linking every variance back to source transactional records.'
  },
  {
    num: '04',
    title: 'Capital Recovery',
    desc: 'Execute vendor credit notes, penalty enforcement, and inventory liquidation playbooks.'
  }
];

export interface SampleAuditMode {
  id: string;
  name: string;
  category: string;
  requiredColumns: string[];
  sampleLeak: string;
  deliverable: string;
  badge?: string;
  shortLabel?: string;
  totalBookValueFormatted?: string;
  skusEvaluatedText?: string;
  deadStockValueFormatted?: string;
  deadStockSubtext?: string;
  slowMovingValueFormatted?: string;
  slowMovingSubtext?: string;
  prioritySkusHeadline?: string;
  prioritySkusSubtext?: string;
}

export function getReconciledSampleAuditModes(): SampleAuditMode[] {
  return [
    {
      id: 'inventory_stagnancy',
      name: 'Un-reconciled Dead Stock & Batch Stagnancy',
      category: 'Inventory Capital',
      requiredColumns: ['SKU_ID', 'Batch_No', 'Received_Date', 'Last_Dispatched_Date', 'Unit_Cost', 'Qty_On_Hand'],
      sampleLeak: 'Warehouse racks occupied by items with zero movement for 180+ days.',
      deliverable: 'SKU-level batch aging ledger with automated liquidation triggers.',
      badge: 'High Impact',
      shortLabel: 'Dead Stock',
      totalBookValueFormatted: '$1.42M',
      skusEvaluatedText: '4,850 SKUs across 3 facilities',
      deadStockValueFormatted: '$412,000',
      deadStockSubtext: 'Zero movement > 180 days',
      slowMovingValueFormatted: '$285,000',
      slowMovingSubtext: '< 5 dispatches per quarter',
      prioritySkusHeadline: 'Top 12 SKUs represent 68% of trapped capital',
      prioritySkusSubtext: 'Immediate liquidation & return playbooks generated'
    },
    {
      id: 'otif_breach',
      name: 'Un-enforced Transporter OTIF SLA Penalties',
      category: 'Dispatch Operations',
      requiredColumns: ['PO_ID', 'Transporter_Code', 'Promised_Dispatch_Date', 'Actual_Dispatch_Date', 'SLA_Penalty_Rate'],
      sampleLeak: 'Delayed customer dispatches leading to customer debit notes and lost repeat orders.',
      deliverable: 'Transporter debit note schedule cross-referenced against promised vs actual GRN receipts.',
      badge: 'Contractual SLA',
      shortLabel: 'OTIF Breaches',
      totalBookValueFormatted: '$890K Spend',
      skusEvaluatedText: '1,240 Transporter Shipments',
      deadStockValueFormatted: '$84,500',
      deadStockSubtext: 'Unclaimed OTIF SLA Penalties',
      slowMovingValueFormatted: '$32,000',
      slowMovingSubtext: 'Late dispatch customer debit notes',
      prioritySkusHeadline: 'Transporter SLA breach rate exceeds 14.2%',
      prioritySkusSubtext: 'Automated debit notes drafted for top 3 carriers'
    },
    {
      id: 'freight_variance',
      name: 'Logistics Freight Rate-Card Variance',
      category: 'Logistics Cost',
      requiredColumns: ['Invoice_ID', 'Transporter_Code', 'Lane_ID', 'Billed_Amount', 'Contracted_Rate'],
      sampleLeak: 'Freight invoices paid as billed without contract rate-card validation.',
      deliverable: 'Line-item freight invoice variance audit report detailing exact overcharge amounts.',
      badge: 'Billing Variance',
      shortLabel: 'Freight Overcharge',
      totalBookValueFormatted: '$620K Freight',
      skusEvaluatedText: '840 Logistics Invoices',
      deadStockValueFormatted: '$53,200',
      deadStockSubtext: 'Billed rate exceeding contracted rate card',
      slowMovingValueFormatted: '$18,400',
      slowMovingSubtext: 'Un-audited detention & demurrage charges',
      prioritySkusHeadline: '8.5% average freight invoice overcharge rate',
      prioritySkusSubtext: 'Reconciliation report ready for logistics provider sign-off'
    }
  ];
}

export const TEN_TEAM_OPERATING_SYSTEM = [
  { id: 'desk_1', title: 'Inventory Capital & Stagnancy Supervision', category: 'Working Capital' },
  { id: 'desk_2', title: 'Transporter OTIF & SLA Penalty Supervision', category: 'Dispatch SLA' },
  { id: 'desk_3', title: 'Logistics Freight Rate-Card Variance', category: 'Logistics' },
  { id: 'desk_4', title: 'Supplier Price Escalation & Contract Audit', category: 'Procurement' },
  { id: 'desk_5', title: 'Warehouse Bin Variance & Shrinkage', category: 'Assets' },
  { id: 'desk_6', title: 'Order-to-Cash Margin Leak Supervision', category: 'Revenue Integrity' },
  { id: 'desk_7', title: 'Vendor Rebate & Early Payment Discount Recovery', category: 'Commercial Terms' },
  { id: 'desk_8', title: 'Quality Rejection & Scrap Loss Audit', category: 'Quality Control' },
  { id: 'desk_9', title: 'Production Yield Variance & Material Waste', category: 'Manufacturing' },
  { id: 'desk_10', title: 'Working Capital & Payment Terms Optimization', category: 'Executive Finance' },
  { id: 'desk_11', title: 'Customer Credit Terms & Bad Debt Early Warning', category: 'Credit Risk' },
  { id: 'desk_12', title: 'Multi-Location Inter-Warehouse Transfer Efficiency', category: 'Network Ops' },
  { id: 'desk_13', title: 'Customs Duty & Tariff Classification Audit', category: 'Import/Export' },
  { id: 'desk_14', title: 'Return-to-Vendor (RTV) & Warranty Claim Recovery', category: 'Vendor Recovery' }
];

export const INSTITUTIONAL_TEAMS = TEN_TEAM_OPERATING_SYSTEM;

export interface CommercialTier {
  id: string;
  tierName: string;
  badge?: string;
  monthlyPrice: string;
  annualPrice: string;
  targetAudience: string;
  desksIncluded: string;
  keyHighlights: string[];
  auditCadence: string;
  ctaText: string;
}

export const COMMERCIAL_TIERS: CommercialTier[] = [
  {
    id: 'starter',
    tierName: 'Operational Pilot',
    badge: 'Risk-Free Trial',
    monthlyPrice: '$0',
    annualPrice: '$0 upfront',
    targetAudience: 'Single-facility operations looking to audit inventory stagnancy & freight overcharges',
    desksIncluded: '2 Operating Desks (Inventory + Logistics)',
    keyHighlights: [
      '14-day sample data audit',
      'Up to $50,000 detected leak report',
      'SKU-level dead stock aging ledger',
      'Email audit support'
    ],
    auditCadence: 'One-Time Pilot Audit',
    ctaText: 'Start Free Pilot'
  },
  {
    id: 'growth',
    tierName: 'Commercial Supervision',
    badge: 'Most Popular',
    monthlyPrice: '$2,450',
    annualPrice: '$2,050/mo billed annually',
    targetAudience: 'Growing mid-market manufacturing & distribution enterprises',
    desksIncluded: '5 Operating Desks (Inventory, Transporter, Freight, Procurement, Bin Variance)',
    keyHighlights: [
      'Weekly automated data ingestion',
      'Full mathematical invariant supervision',
      'Automated vendor debit note generation',
      'Dedicated audit engineer support'
    ],
    auditCadence: 'Weekly Automated Runs',
    ctaText: 'Deploy Supervision'
  },
  {
    id: 'enterprise',
    tierName: 'Enterprise Operating System',
    badge: 'Full Suite',
    monthlyPrice: '$4,950',
    annualPrice: '$4,150/mo billed annually',
    targetAudience: 'Multi-plant enterprise operations with complex supply chains',
    desksIncluded: 'All 14 Operating Desks Included',
    keyHighlights: [
      'Daily continuous audit execution',
      'Custom ERP API connectors & automated ingestion',
      'Board-ready executive financial dashboards',
      'Guaranteed 10x ROI audit SLA'
    ],
    auditCadence: 'Continuous Daily Audit',
    ctaText: 'Schedule Executive Demo'
  },
  {
    id: 'custom',
    tierName: 'Custom Sovereign Audit',
    monthlyPrice: 'Custom',
    annualPrice: 'Bespoke Terms',
    targetAudience: 'Global enterprises requiring on-premise deployment & custom mathematical models',
    desksIncluded: 'Custom Desk Architecture',
    keyHighlights: [
      'Sovereign on-premise / private cloud deployment',
      'Bespoke invariant algorithm development',
      'Dedicated quantitative audit team',
      'Custom SLA & credit recovery management'
    ],
    auditCadence: 'Real-Time Continuous',
    ctaText: 'Contact Enterprise Team'
  }
];

export const FOUNDER_EXECUTIVE_SIGNOFF = {
  quote: "Operational leaks are not theoretical—they represent hard cash draining out of your balance sheet every day. Operationalyst was built to give operations leaders deterministic mathematical proof of every dollar lost.",
  founderName: 'Operationalyst Engineering Team',
  title: 'Operationalyst Supervision Systems',
  evidenceAndMechanism: 'Every detected leak links to specific line-item PO numbers, invoice IDs, and physical batch locations.',
  institutionalGuarantee: 'Contractually backed leak recovery playbook detailing exact credit note and claim mechanisms.',
  verificationStep: 'Inspect our sample recovery dossier with exact line-item evidence packs.',
  response: 'Every finding includes row-level proof-specific invoice numbers, freight rate card discrepancies, and SKU batch locations ready for immediate recovery claims.'
};

export const NAV_LINKS = [
  { label: 'Problem', href: '#problem' },
  { label: 'Methodology', href: '#methodology' },
  { label: 'Desks', href: '#desks' },
  { label: 'Tiers', href: '#tiers' },
  { label: 'B2B Behavioral', href: '#b2b' },
  { label: 'FAQ', href: '#faq' }
];

export const HERO_CONTENT = {
  badge: 'Autonomous Profit Protection Engine',
  title: 'Stop Cash Leakage Across Supply Chain & Freight Operations',
  subtitle: 'Continuous mathematical invariant supervision that surfaces trapped working capital, un-enforced OTIF penalties, and freight overcharges with row-level proof.'
};

export const VALUE_PROPOSITIONS = [
  {
    title: 'Deterministic Proof',
    desc: 'Every finding is backed by row-level ERP evidence packs, eliminating internal disputes.'
  },
  {
    title: 'Zero Workflow Interruption',
    desc: 'Operates on standard CSV data exports with no complex software integrations required.'
  },
  {
    title: 'Immediate Cash Recovery',
    desc: 'Actionable debit notes and claim deliverables ready for execution on day one.'
  }
];

export const FAQ_ITEMS = [
  {
    q: 'How does Operationalyst access our operational data?',
    a: 'Operationalyst works via standard file exports (CSV/Excel) from your existing ERP or warehouse software. Zero API integration or IT overhead required.'
  },
  {
    q: 'How quickly can we expect to see audit findings?',
    a: 'Initial pilot findings are typically delivered within 48-72 hours after initial sample data ingestion.'
  },
  {
    q: 'What happens if no operational leaks are found?',
    a: 'If our initial sample audit uncovers zero verified leaks, you receive a clean compliance sign-off certificate at zero cost.'
  }
];

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
    riskMitigation: 'Non-invasive CSV ingestion requiring zero API integration or IT overhead. Designed as an operational asset for supply chain leads.',
    keyMetrics: ['Dead Stock Recovery', 'OTIF Breach Penalties', 'Freight Rate Discrepancies']
  },
  {
    id: 'user',
    roleTitle: 'Warehouse Manager / Dispatch Lead',
    stakeholderType: 'Daily User / Practitioner',
    coreQuestion: 'How quickly can I clear blocked shelf space and stop spending hours matching POs to freight bills?',
    priorityOutcome: 'Instant discrepancy alerts with line-item ERP proof ready for immediate vendor credit claims.',
    unspokenAnxiety: 'Is this another complicated software tool that will slow down daily dispatches?',
    riskMitigation: 'Zero data entry required. Upload standard ERP CSV reports and get instant actionable audit deliverables.',
    keyMetrics: ['Dispatch Variance Rate', 'Un-reconciled GRN Receipts', 'Claim Settlement Speed']
  },
  {
    id: 'evaluator',
    roleTitle: 'Head of Finance & Controlling / Internal Auditor',
    stakeholderType: 'Evaluator / Risk Lead',
    coreQuestion: 'Are these audit findings mathematically verifiable with a complete audit trail back to source invoices?',
    priorityOutcome: '100% deterministic mathematical invariant verification with immutable audit evidence packages.',
    unspokenAnxiety: 'What if false positives create friction with key suppliers or warehouse teams?',
    riskMitigation: 'Dual-reconciliation algorithm requiring multi-table cross-validation before flagging any leak.',
    keyMetrics: ['Audit Trail Coverage', 'Mathematical Invariant Accuracy', 'Vendor Claim Rebuttal Rate']
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

export interface ObjectionItem {
  id: string;
  objection: string;
  underlyingRisk: string;
  reconciliationAnswer: string;
  proofMechanism: string;
}

export const OBJECTION_MATRIX: ObjectionItem[] = [
  {
    id: 'objection_1',
    objection: 'Our team already tracks inventory aging in Excel.',
    underlyingRisk: 'Manual spreadsheets miss cross-table correlation and lack automated enforcement triggers.',
    reconciliationAnswer: 'Operationalyst automates multi-source cross-table reconciliation across ERP, WMS, and logistics rate cards continuously.',
    proofMechanism: 'Automated multi-table join and invariant validation engine.'
  },
  {
    id: 'objection_2',
    objection: 'We cannot afford a complex IT integration right now.',
    underlyingRisk: 'Fear of long implementation cycles and heavy IT resource drain.',
    reconciliationAnswer: 'Zero integration required. Operationalyst ingests standard file exports directly from day one.',
    proofMechanism: 'Non-invasive file parser supporting standard CSV/XLSX formats.'
  },
  {
    id: 'objection_3',
    objection: 'What if the audit findings create friction with our suppliers?',
    underlyingRisk: 'Concern over inaccurate claims damaging key vendor relationships.',
    reconciliationAnswer: 'Every finding is backed by row-level transactional proof linking POs, GRNs, and invoices before flagging.',
    proofMechanism: 'Deterministic mathematical invariant verification packs.'
  }
];

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
