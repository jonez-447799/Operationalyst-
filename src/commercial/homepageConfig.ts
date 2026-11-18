import {
  getLiveSandboxReconciliationMockData,
  ILLUSTRATIVE_12400_CA_BENCHMARK
} from '../utils/liveSandboxData';

export interface HeadlineVariant {
  id: 'A' | 'B' | 'C';
  badge: string;
  headline: string;
  subheadline: string;
}

export const HERO_HEADLINE_VARIANTS: Record<'A' | 'B' | 'C', HeadlineVariant> = {
  A: {
    id: 'A',
    badge: '48-HOUR FACTORY DIAGNOSTIC',
    headline: 'How Much Cash Is Trapped in Your Factory Inventory right now?',
    subheadline: 'Automated 14-stage inventory & margin audit. Clean Tally CSV data, uncover hidden leakage, and recover trapped working capital in 48 hours.'
  },
  B: {
    id: 'B',
    badge: 'ZERO-RISK LEAKAGE GUARANTEE',
    headline: 'We Find at Least ₹2,50,000 in Trapped Cash or Your Audit Is 100% Free',
    subheadline: 'Rigorous 14-stage automated margin watchdog. Flat ₹18,000 diagnostic billed under MSME Bill of Supply (0% GST exempt).'
  },
  C: {
    id: 'C',
    badge: 'CA WHOLESALE WORKING-PAPER DESK',
    headline: 'Turn Unbilled Inventory & Margin Leakage Into Billable Client Recovery',
    subheadline: 'Wholesale working-paper desk for CAs & Audit Firms. ₹14,400 partner diagnostic rate & ₹12,000/mo watchdog rate vs ₹18,000 / ₹15,000 direct.'
  }
};

export interface StakeholderPerspective {
  id: string;
  roleTitle: string;
  coreQuestion: string;
  objection: string;
  underlyingAnxiety: string;
  operationalystSolution: string;
}

export const STAKEHOLDER_PERSPECTIVES: StakeholderPerspective[] = [
  {
    id: 'cfo',
    roleTitle: 'CFO / Finance Director',
    coreQuestion: 'Why does our physical inventory balance differ from Tally closing balance?',
    objection: 'Our internal team already reconciles inventory monthly.',
    underlyingAnxiety: 'Fear of write-offs during statutory audit.',
    operationalystSolution: 'Automated 14-stage reconciliation detects negative stock, phantom rate spikes, and unbooked supplier debit notes instantly.'
  },
  {
    id: 'plant-head',
    roleTitle: 'Plant Head / Operations VP',
    coreQuestion: 'Which raw material SKUs are slowing down our production throughput?',
    objection: 'We do not have time for complex manual audits during shift runs.',
    underlyingAnxiety: 'Disruption of daily shop-floor production schedules.',
    operationalystSolution: 'Zero-footprint data pipeline runs directly off Tally export CSVs with no software installation or shop-floor downtime.'
  },
  {
    id: 'ca-partner',
    roleTitle: 'CA Firm Audit Partner',
    coreQuestion: 'How can we provide deep inventory margin assurance without inflating audit hours?',
    objection: 'We cannot recommend unverified third-party tools to clients.',
    underlyingAnxiety: 'Compliance liability and client relationship risk under ICAI guidelines.',
    operationalystSolution: 'ICAI-compliant CA Wholesale Working-Paper Desk with structured working papers at ₹14,400 partner rate.'
  }
];

export interface IcebergDimension {
  id: string;
  dimension: string;
  visibleSymptom: string;
  hiddenRootCause: string;
  financialLeakage: string;
}

export const ICEBERG_DIMENSIONS: IcebergDimension[] = [
  {
    id: 'spares',
    dimension: 'Maintenance & Spares Inventory',
    visibleSymptom: 'Rising MRO inventory expenditure despite static production volumes.',
    hiddenRootCause: 'Duplicate SKU coding and untracked emergency job-work issues.',
    financialLeakage: '₹3,50,000 - ₹12,00,000 annual carrying cost leak'
  },
  {
    id: 'debits',
    dimension: 'Vendor Debit Notes & RTV',
    visibleSymptom: 'Unresolved rejection inventory piled up in store quarantine.',
    hiddenRootCause: 'Unbilled Return-to-Vendor (RTV) claims and missing transporter debit notes.',
    financialLeakage: '₹5,00,000 - ₹25,00,000 in uncollected supplier claims'
  },
  {
    id: 'scrap',
    dimension: 'Scrap & Yield Variance',
    visibleSymptom: 'Standard BOM bill vs actual consumption mismatches.',
    hiddenRootCause: 'Unadjusted off-cut scrap and missing process yield tolerance checks.',
    financialLeakage: '2.5% - 4.8% gross margin erosion'
  }
];

export interface ObjectionItem {
  id: string;
  objection: string;
  realityCheck: string;
  proofPoint: string;
}

export const OBJECTION_MATRIX: ObjectionItem[] = [
  {
    id: 'replace',
    objection: 'Does Operationalyst replace our existing Tally or ERP system?',
    realityCheck: 'No. Operationalyst operates alongside Tally/ERP as a specialized margin audit layer.',
    proofPoint: '100% read-only CSV ingestion. Zero changes to your primary accounting data.'
  },
  {
    id: 'cost',
    objection: 'Is an external inventory audit expensive for MSME manufacturing plants?',
    realityCheck: 'Flat ₹18,000 diagnostic fee with 0% GST under MSME Bill of Supply.',
    proofPoint: 'Guaranteed discovery of at least ₹2,50,000 in trapped leakage or 100% fee refund.'
  },
  {
    id: 'ca-compliance',
    objection: 'How does this work with our statutory CA auditors?',
    realityCheck: 'We provide structured working papers directly aligned with statutory standards.',
    proofPoint: 'Dedicated CA Wholesale Working-Paper Desk at ₹14,400 partner rate.'
  }
];

export interface OperatingSystemTeam {
  id: string;
  title: string;
  coreFocus: string;
  auditOutput: string;
}

export const TEN_TEAM_OPERATING_SYSTEM: OperatingSystemTeam[] = [
  {
    id: 'stage-1',
    title: 'Automated Audit & Governance Stage 1: Tally CSV Data Sanitation',
    coreFocus: 'Quoted-comma parsing, decimal quantity preservation, rate-vs-total valuation verification.',
    auditOutput: 'Cleaned master dataset with zero line shifts or header corruption.'
  },
  {
    id: 'stage-2',
    title: 'Automated Audit & Governance Stage 2: OEM Buyer Brand Redaction',
    coreFocus: 'Automated masking of client OEM partner names across part descriptions.',
    auditOutput: 'Anonymized audit working paper ready for external governance review.'
  },
  {
    id: 'stage-3',
    title: 'Automated Audit & Governance Stage 3: Negative Stock Quarantine',
    coreFocus: 'Detection of negative inventory balances caused by timing delays in voucher entry.',
    auditOutput: 'Quarantine register detailing physical stock vs ledger entry timing.'
  },
  {
    id: 'stage-4',
    title: 'Automated Audit & Governance Stage 4: Zero-Rate Job-Work Isolation',
    coreFocus: 'Identification of ₹0 free-issue customer materials and unbilled job-work stock.',
    auditOutput: 'Separated job-work inventory ledger isolating client-owned assets.'
  },
  {
    id: 'stage-5',
    title: 'Automated Audit & Governance Stage 5: Strict Indian Date Anchoring',
    coreFocus: 'Date format parsing (DD/MM/YYYY, DD-MM-YYYY, D-MMM-YY) anchored to AsOfDate.',
    auditOutput: 'Chronologically verified voucher timeline eliminating date ambiguity.'
  },
  {
    id: 'stage-6',
    title: 'Automated Audit & Governance Stage 6: Unit Rate Inflation Guard',
    coreFocus: 'Automated calculation of total closing value vs unit rate to prevent 100x errors.',
    auditOutput: 'Validated unit pricing matrix across all raw material categories.'
  },
  {
    id: 'stage-7',
    title: 'Automated Audit & Governance Stage 7: Vendor Debit Note Reconciliation',
    coreFocus: 'Matching RTV quarantine items with unraised vendor debit notes.',
    auditOutput: 'Printable supplier debit note claim package with MSME Bill of Supply details.'
  },
  {
    id: 'stage-8',
    title: 'Automated Audit & Governance Stage 8: Transporter Recovery Desk',
    coreFocus: 'Shortage and transit damage tracking against logistics invoices.',
    auditOutput: 'Printable transporter debit note claim ready for instant recovery execution.'
  },
  {
    id: 'stage-9',
    title: 'Automated Audit & Governance Stage 9: Slow-Moving Stock Valuation',
    coreFocus: 'Ageing analysis isolating inventory unmoved for >90 days.',
    auditOutput: 'Working capital release roadmap with suggested liquidation pricing.'
  },
  {
    id: 'stage-10',
    title: 'Automated Audit & Governance Stage 10: BOM Variance Detection',
    coreFocus: 'Bill of materials consumption audit against actual production outputs.',
    auditOutput: 'Yield loss variance report detailing material wastage percentages.'
  },
  {
    id: 'stage-11',
    title: 'Automated Audit & Governance Stage 11: Scrap & Off-Cut Accounting',
    coreFocus: 'Unbooked scrap generation tracking across metal, plastic, and process inputs.',
    auditOutput: 'Scrap recovery schedule with estimated scrap realization value.'
  },
  {
    id: 'stage-12',
    title: 'Automated Audit & Governance Stage 12: Price Variation Clause Audit',
    coreFocus: 'Raw material metal index price adjustment tracking against customer PO terms.',
    auditOutput: 'Escalation claim register for pending customer price hikes.'
  },
  {
    id: 'stage-13',
    title: 'Automated Audit & Governance Stage 13: Statutory MSME Compliance Check',
    coreFocus: 'Verification of MSME Bill of Supply terms (UDYAM-TN-02-0444630, SAC 998311).',
    auditOutput: '0% GST compliant invoice schedule meeting MSME Act requirements.'
  },
  {
    id: 'stage-14',
    title: 'Automated Audit & Governance Stage 14: Executive Signoff & Refund Guarantee',
    coreFocus: 'Final reconciliation review by Founder C. Jones Snowin under ₹2,50,000 leak guarantee.',
    auditOutput: 'Executive Audit Signoff Certificate with guaranteed leakage recovery threshold.'
  }
];

export interface CommercialTier {
  id: string;
  name: string;
  price: string;
  subtext: string;
  description: string;
  deliverables: string[];
  primaryCTA: string;
  highlight?: boolean;
}

export const COMMERCIAL_TIERS: CommercialTier[] = [
  {
    id: 'tier-1',
    name: '48-Hour Factory Diagnostic',
    price: '₹18,000',
    subtext: 'Billed under SNOWIN VENTURES MSME Bill of Supply (0% GST exempt)',
    description: 'Comprehensive 14-stage automated margin and inventory audit for mid-market factories.',
    deliverables: [
      'Full Tally CSV Data Sanitation & 100x Valuation Guard',
      'Negative Stock & Zero-Rate Job-Work Quarantine Audit',
      'Printable Vendor RTV & Transporter Debit Note Package',
      '₹2,50,000 Leak-Discovery Refund Guarantee',
      'Founder C. Jones Snowin Executive Audit Signoff'
    ],
    primaryCTA: 'Book 48-Hour Diagnostic',
    highlight: true
  },
  {
    id: 'tier-2',
    name: 'Monthly Watchdog',
    price: '₹15,000 / month',
    subtext: 'Billed under SNOWIN VENTURES MSME Bill of Supply (0% GST exempt)',
    description: 'Continuous monthly inventory monitoring and recurring margin leakage prevention.',
    deliverables: [
      'Monthly 14-Stage Automated Audit Runs',
      'Real-Time Supplier Debit Note Claim Generation',
      'BOM Consumption Variance Tracking',
      'Dedicated Audit Working Paper Repository'
    ],
    primaryCTA: 'Start Monthly Watchdog'
  },
  {
    id: 'tier-4',
    name: 'CA Wholesale Desk',
    price: '₹14,400',
    subtext: 'CA Wholesale Working-Paper Desk (₹14,400 Partner Diagnostic & ₹12,000/mo Partner Watchdog vs. ₹18,000 / ₹15,000 Direct)',
    description: 'ICAI-compliant working-paper desk designed for CA firms to serve client inventory audits.',
    deliverables: [
      'Structured CA Audit Working Papers under Statutory Standards',
      'Partner Diagnostic Rate: ₹14,400 (vs ₹18,000 direct)',
      'Partner Watchdog Rate: ₹12,000/mo (vs ₹15,000 direct)',
      'White-labeled client presentation templates'
    ],
    primaryCTA: 'Access CA Wholesale Desk'
  }
];

export interface MethodologyStage {
  id: string;
  stage: string;
  title: string;
  duration: string;
  output: string;
  description: string;
}

export const METHODOLOGY_STAGES: MethodologyStage[] = [
  {
    id: 'phase-1',
    stage: 'Phase 1',
    title: 'Data Ingestion & Sanitation',
    duration: 'Hours 0 - 12',
    output: 'Sanitized Master Dataset',
    description: 'Ingest raw Tally CSV files, parse Indian dates, apply 100x rate guard, and quarantine zero-rate items.'
  },
  {
    id: 'phase-2',
    stage: 'Phase 2',
    title: '14-Stage Automated Margin Audit',
    duration: 'Hours 12 - 36',
    output: 'Leakage Finding Matrix',
    description: 'Execute automated algorithms across BOM variance, vendor debits, transporter claims, and slow-moving stock.'
  },
  {
    id: 'phase-3',
    stage: 'Phase 3',
    title: 'Executive Signoff & Action Plan',
    duration: 'Hours 36 - 48',
    output: 'Executive Signoff Package',
    description: 'Final review by Founder C. Jones Snowin with actionable debit note claim letters and refund guarantee verification.'
  }
];

export interface ReconciledSampleAuditMode {
  id: string;
  title: string;
  metric: string;
  description: string;
}

export const getReconciledSampleAuditModes = (): ReconciledSampleAuditMode[] => {
  const mockData = getLiveSandboxReconciliationMockData();
  return [
    {
      id: 'diagnostic',
      title: '48-Hour Diagnostic Baseline',
      metric: `₹${mockData.totalLeakageIdentified.toLocaleString('en-IN')}`,
      description: 'Total identified margin leakage across inventory, debits, and yield variances.'
    },
    {
      id: 'ca-benchmark',
      title: 'CA Wholesale Benchmark',
      metric: `₹${ILLUSTRATIVE_12400_CA_BENCHMARK.toLocaleString('en-IN')}`,
      description: 'Standard working-paper benchmark savings for partner audit firms.'
    }
  ];
};

export const FOUNDER_EXECUTIVE_SIGNOFF = {
  founderName: 'C. Jones Snowin',
  role: 'Founder & Principal Operational Auditor',
  firm: 'Operationalyst (SNOWIN VENTURES)',
  sacCode: '998311 (Management Consulting & Audit)',
  gstNote: '0% GST — MSME Bill of Supply (UDYAM-TN-02-0444630)'
};

export const NAV_LINKS = [
  { label: 'Diagnostic', href: '#pricing' },
  { label: 'Methodology', href: '#methodology' },
  { label: 'CA Desk', href: '#ca-desk' },
  { label: 'FAQ', href: '#faq' }
];

export const HERO_CONTENT = {
  headline: 'Recover Trapped Factory Inventory & Margin Leakage in 48 Hours',
  subheadline: 'Automated 14-Stage Governance & Audit Engine. Flat ₹18,000 Diagnostic under SNOWIN VENTURES MSME Bill of Supply (0% GST exempt). Guaranteed ₹2,50,000 Leak Discovery or 100% Refund.',
  ctaPrimary: 'Book 48-Hour Factory Diagnostic',
  ctaSecondary: 'CA Partner Desk'
};

export const VALUE_PROPOSITIONS = [
  {
    id: 'zero-risk',
    title: 'Zero-Risk ₹2,50,000 Leak Discovery Guarantee',
    description: 'If our 14-stage audit fails to identify at least ₹2,50,000 in operational leakage and recoverable cash, your diagnostic is 100% free.'
  },
  {
    id: 'msme-billing',
    title: 'MSME Bill of Supply (0% GST Exempt)',
    description: 'Billed directly under SNOWIN VENTURES (UDYAM-TN-02-0444630, SAC 998311) with zero GST surcharge.'
  },
  {
    id: 'ca-wholesale',
    title: 'ICAI-Compliant CA Wholesale Desk',
    description: 'Partner rates of ₹14,400 diagnostic and ₹12,000/mo watchdog for chartered accounting firms.'
  }
];

export const FAQ_ITEMS = [
  {
    id: 'gst',
    question: 'Is GST applicable on the ₹18,000 diagnostic fee?',
    answer: 'No. Operationalyst operates under SNOWIN VENTURES MSME Bill of Supply (UDYAM-TN-02-0444630, SAC 998311), which is 0% GST exempt.'
  },
  {
    id: 'guarantee',
    question: 'How does the ₹2,50,000 leak discovery guarantee work?',
    answer: 'If our 14-stage audit output uncovers less than ₹2,50,000 in trapped inventory, unbilled vendor debits, or yield leakage, we refund 100% of the ₹18,000 fee.'
  },
  {
    id: 'ca-desk',
    question: 'What is the pricing for CA firms on the CA Wholesale Desk?',
    answer: 'CA partner firms receive wholesale working-paper rates of ₹14,400 for the diagnostic (vs ₹18,000 direct) and ₹12,000/mo for monthly watchdog (vs ₹15,000 direct).'
  }
];
