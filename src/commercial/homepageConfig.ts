import { AMBATTUR_FABRICATION_SAMPLE, DEFAULT_RULES as P1_DEFAULT_RULES } from '../project1/data/sampleData';
import { generateOwnerReport } from '../project1/utils/ownerReportGenerator';
import { evaluateStockEngine } from '../project1/utils/stockEvaluationEngine';
import { INITIAL_DISPATCHES, DEFAULT_RULES as P2_DEFAULT_RULES } from '../project2/data/sampleData';
import { calculateOTIFMetrics } from '../project2/utils/otifEngine';
import { INITIAL_TRIPS, DEFAULT_RULES as P3_DEFAULT_RULES } from '../project3/data/sampleData';
import { calculateAuditMetrics } from '../project3/utils/auditCalculations';
import { INITIAL_SAMPLE_SKUS, DEFAULT_RULES as P4_DEFAULT_RULES } from '../project4/data/sampleData';
import { computeSummary } from '../project4/utils/auditCalculations';

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
  metric: string;
  metricLabel: string;
}

export interface MethodologyStage {
  step: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface FounderExecutiveSignoff {
  headline: string;
  quote: string;
  founderName: string;
  founderTitle: string;
  guaranteeText: string;
}

export interface CommercialTier {
  id: string;
  name: string;
  targetAudience: string;
  price: string;
  billingPeriod: string;
  description: string;
  keyFeatures: string[];
  ctaText: string;
  highlighted?: boolean;
}

export interface InstitutionalTeam {
  id: string;
  teamName: string;
  primaryFocus: string;
  auditOutput: string;
}

export interface IcebergDimension {
  id: string;
  num?: string;
  name?: string;
  scope?: string;
  title?: string;
  visibleLayer?: string;
  hiddenSystems?: string[];
  reconciliationMechanism?: string;
  auditFrequency?: string;
  surfaceSymptom?: string;
  underwaterRootCause?: string;
  operationalCost?: string;
}

export interface ObjectionItem {
  id: string;
  objection: string;
  underlyingAnxiety: string;
  evidenceAndMechanism: string;
  institutionalGuarantee: string;
  verificationStep: string;
  preventionSystem?: string;
  verificationProof?: string;
  slaGuarantee?: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Sample Audit', href: '#sample-audit' },
  { label: 'Methodology', href: '#methodology' },
  { label: 'Commercial Tiers', href: '#tiers' },
  { label: '10-Team OS', href: '#teams' },
  { label: 'Behavioral Proof', href: '#proof' }
];

export const HERO_CONTENT: HeroContent = {
  badge: 'Operational Intelligence & Profit Recovery Engine',
  headline: 'Stop Working Capital Decay Across Industrial & B2B Operations',
  subheadline: 'Automated 4-pillar forensic audit engine that transforms silent inventory holding burn, OTIF penalties, and freight leakage into instant cash flow recovery.',
  primaryCtaText: 'Run Free Diagnostic Sample Audit',
  primaryCtaHref: '#sample-audit',
  secondaryCtaText: 'Explore Commercial Tiers',
  secondaryCtaHref: '#tiers',
  guaranteeText: 'Zero IT Migration Required • Works on Standard CSV/Excel Exports • Instant Setup'
};

export const VALUE_PROPOSITIONS: ValueProposition[] = [
  {
    id: 'capital_recovery',
    title: 'Working Capital Recovery',
    description: 'Pinpoint exact SKUs causing working capital lockup across 90/180/365+ day holding brackets.',
    metric: '15-28%',
    metricLabel: 'Average Working Capital Unlocked'
  },
  {
    id: 'otif_protection',
    title: 'OTIF Margin Protection',
    description: 'Eliminate SLA penalty deductions by matching dispatch lines against carrier SLA windows.',
    metric: '99.2%',
    metricLabel: 'Target Dispatch Compliance'
  },
  {
    id: 'freight_leakage',
    title: 'Freight Leakage Audit',
    description: 'Detect billing overcharges, empty return legs, and unoptimized route surcharges automatically.',
    metric: '8-14%',
    metricLabel: 'Direct Logistics Cost Reduction'
  },
  {
    id: 'bin_reconciliation',
    title: 'Store & Bin Reconciliation',
    description: 'Reconcile physical store location mismatches to eliminate phantom inventory write-offs.',
    metric: '100%',
    metricLabel: 'Mathematical Invariant Coverage'
  }
];

export const METHODOLOGY_STAGES: MethodologyStage[] = [
  {
    step: 'Stage 01',
    title: 'Raw Telemetry Ingestion',
    description: 'Export standard inventory, dispatch, or trip data as CSV/Excel without altering legacy software or IT infrastructure.',
    deliverable: 'Normalized Invariant Data Model'
  },
  {
    step: 'Stage 02',
    title: '4-Pillar Algorithmic Audit',
    description: 'Execute deterministic audit formulas across Stock Velocity (P1), OTIF (P2), Freight (P3), and Store Bins (P4).',
    deliverable: 'Quantified Capital Leakage Ledger'
  },
  {
    step: 'Stage 03',
    title: 'Pareto Action Prioritization',
    description: 'Isolate the critical 20% of SKUs and trips generating 80% of financial holding burn and penalties.',
    deliverable: 'Executive Priority Resolution List'
  },
  {
    step: 'Stage 04',
    title: 'Executive Sign-off & Recovery',
    description: 'Present actionable liquidation, dispatch correction, and freight claim instructions directly to plant leadership.',
    deliverable: 'Board-Ready Financial Recovery Package'
  }
];

export const FOUNDER_EXECUTIVE_SIGNOFF: FounderExecutiveSignoff = {
  headline: 'Executive Quality & Mathematical Determinism Guarantee',
  quote: 'We built Operationalyst because traditional ERPs record what happened, but fail to diagnose silent working capital decay. Our engines deliver mathematically verifiable profit recovery with zero friction.',
  founderName: 'Jonez',
  founderTitle: 'Founder & Chief Architect, Operationalyst',
  guaranteeText: 'Every metric generated by our engines is backed by 100% deterministic invariant formulas. If our audit does not identify actionable recovery opportunities, you pay nothing.'
};

export const COMMERCIAL_TIERS: CommercialTier[] = [
  {
    id: 'audit-teaser',
    name: 'Diagnostic Sample Audit',
    targetAudience: 'Single Plant / Mid-Market B2B',
    price: 'Free',
    billingPeriod: 'instant evaluation',
    description: 'Run our 4-pillar audit engine on up to 500 SKUs to experience full mathematical transparency instantly.',
    keyFeatures: [
      'P1 Working Capital & Dead Stock Analysis',
      'P2 Dispatch & OTIF Reliability Scorecard',
      'P3 Freight Overcharge Diagnostic',
      'P4 Store Location Bin Accuracy Check',
      'Exportable Executive Summary PDF'
    ],
    ctaText: 'Run Free Sample Audit',
    highlighted: false
  },
  {
    id: 'growth-audit',
    name: 'Growth Engine',
    targetAudience: 'Single-Site Manufacturing & Distribution',
    price: '₹49,000',
    billingPeriod: 'per month',
    description: 'Continuous audit automation and monthly profit recovery reports for expanding operations.',
    keyFeatures: [
      'Up to 5,000 Active SKUs Audited Monthly',
      'Automated Weekly Velocity Decay Alerts',
      'Carrier SLA Penalty Recovery Tracking',
      'Dedicated Operations Analyst Support',
      '90-Day Capital Recovery Roadmap'
    ],
    ctaText: 'Activate Growth Tier',
    highlighted: true
  },
  {
    id: 'enterprise-os',
    name: 'Enterprise Team OS',
    targetAudience: 'Multi-Plant Industrial Enterprises',
    price: '₹1,49,000',
    billingPeriod: 'per month',
    description: 'Full 10-team operating system integration with custom ERP data pipelines and real-time alerts.',
    keyFeatures: [
      'Unlimited SKUs & Multi-Facility Support',
      '10-Team Role-Based Executive Views',
      'Automated Daily ERP Lineage Tracking',
      'Custom Mathematical Invariant Rules',
      'Quarterly On-Site Operations Review'
    ],
    ctaText: 'Deploy Enterprise OS',
    highlighted: false
  },
  {
    id: 'sovereignty',
    name: 'Institutional Sovereignty',
    targetAudience: 'Conglomerates & Private Equity Portfolios',
    price: 'Custom',
    billingPeriod: 'annual agreement',
    description: 'Self-hosted air-gapped deployment with full source code access and custom agentic safeguards.',
    keyFeatures: [
      'Air-Gapped On-Premises Runtime Options',
      'Custom Agent Governance Guardrails',
      'Portfolio-Wide Executive BI Dashboards',
      'Dedicated 24/7 Forensic Engineering Team',
      'Institutional SLA & Performance Guarantee'
    ],
    ctaText: 'Request Sovereignty Briefing',
    highlighted: false
  }
];

export const TEN_TEAM_OPERATING_SYSTEM: InstitutionalTeam[] = [
  { id: 'ceo-executive', teamName: 'CEO & Executive Leadership', primaryFocus: 'Macro Capital Allocation & Profit Governance', auditOutput: 'Board Financial Summary & Portfolio Holding Risk' },
  { id: 'cfo-finance', teamName: 'CFO & Financial Control', primaryFocus: 'Working Capital Lockup & Provisioning', auditOutput: 'Dead Stock Provisioning & Holding Cost Burn Ledger' },
  { id: 'coo-operations', teamName: 'COO & Operations', primaryFocus: 'End-to-End Plant Throughput & Velocity', auditOutput: 'Operational Bottleneck & Plant Efficiency Index' },
  { id: 'supply-chain', teamName: 'Supply Chain & Inventory', primaryFocus: 'SKU Velocity Decay & Safety Stock Calibration', auditOutput: '90/180/365d Ageing Breakdown & Reorder Triggers' },
  { id: 'procurement', teamName: 'Procurement & Vendor Management', primaryFocus: 'Purchase Order Timing & Bulk Pricing Arbitrage', auditOutput: 'Supplier Over-Ordering & Lead-Time Variance Matrix' },
  { id: 'warehouse-logistics', teamName: 'Warehouse & Logistics', primaryFocus: 'Store Location Accuracy & Space Utilization', auditOutput: 'Bin Location Mismatch & Storage Density Report' },
  { id: 'sales-commercial', teamName: 'Sales & Commercial Operations', primaryFocus: 'Order Fulfillment & Stock Availability', auditOutput: 'Lost Sales Risk & High-Margin SKU Stagnation List' },
  { id: 'working-capital', teamName: 'Working Capital Optimization', primaryFocus: 'Cash Conversion Cycle (CCC) Compression', auditOutput: 'Actionable Cash Recovery & Inventory Liquidation Plan' },
  { id: 'audit-compliance', teamName: 'Internal Audit & Compliance', primaryFocus: 'Deterministic Invariant Verification', auditOutput: 'Audit Certificate & Lineage Variance Trace' },
  { id: 'it-systems', teamName: 'IT & Enterprise Systems', primaryFocus: 'ERP Data Integrity & Telemetry Synchronization', auditOutput: 'Data Pipeline Lineage & Schema Health Log' },
  { id: 'plant-manufacturing', teamName: 'Plant & Manufacturing Operations', primaryFocus: 'WIP Inventory & Raw Material Allocation', auditOutput: 'WIP Stagnation & Line Feeder Balance Report' },
  { id: 'quality-assurance', teamName: 'Quality Assurance & Standards', primaryFocus: 'Quarantine Inventory & Defect Holding', auditOutput: 'Quarantined Material Clearance & Rejection Cost Summary' },
  { id: 'vendor-management', teamName: 'Vendor & Supplier Relations', primaryFocus: 'Supplier SLA Compliance & Lead-Time Audit', auditOutput: 'Vendor OTIF Compliance Scorecard & Rebate Claims' },
  { id: 'strategy-mna', teamName: 'Corporate Strategy & M&A', primaryFocus: 'Post-Merger Inventory Rationalization', auditOutput: 'Synergy Realization & Duplicate SKU Liquidation Roadmap' }
];

export const ICEBERG_DIMENSIONS: IcebergDimension[] = [
  {
    id: 'data-pipeline',
    num: '01',
    name: 'Data & Telemetry Integration',
    scope: 'Dashboards & Ingestion pipelines',
    title: 'Data & Telemetry Integration',
    visibleLayer: 'Dashboards & BI Reports',
    hiddenSystems: ['Ingestion pipelines', 'Transformations', 'Schema validators'],
    reconciliationMechanism: 'Automated lineage tracking',
    auditFrequency: 'Continuous',
    surfaceSymptom: 'Dashboards & BI Reports',
    underwaterRootCause: 'Ingestion pipelines, Transformations, Schema validators',
    operationalCost: 'Automated lineage tracking'
  },
  {
    id: 'profit-recovery',
    num: '02',
    name: 'Profit & Margin Recovery',
    scope: 'Executive Financial Summaries',
    title: 'Profit & Margin Recovery',
    visibleLayer: 'Executive Financial Summaries',
    hiddenSystems: ['Leakage detection algorithms', 'Margin calculations', 'Reconciliation engines'],
    reconciliationMechanism: 'Cross-system ledger matching',
    auditFrequency: 'Daily',
    surfaceSymptom: 'Executive Financial Summaries',
    underwaterRootCause: 'Leakage detection algorithms, Margin calculations, Reconciliation engines',
    operationalCost: 'Cross-system ledger matching'
  },
  {
    id: 'agentic-workflow',
    num: '03',
    name: 'Agentic Workflow Governance',
    scope: 'Agent Execution Status',
    title: 'Agentic Workflow Governance',
    visibleLayer: 'Agent Execution Status',
    hiddenSystems: ['Prompt logs', 'Model routing', 'Safety guardrails', 'Tool invocation history'],
    reconciliationMechanism: 'Invariant constraint validation',
    auditFrequency: 'Real-time',
    surfaceSymptom: 'Agent Execution Status',
    underwaterRootCause: 'Prompt logs, Model routing, Safety guardrails, Tool invocation history',
    operationalCost: 'Invariant constraint validation'
  },
  {
    id: 'compliance-security',
    num: '04',
    name: 'Compliance & Security Safeguards',
    scope: 'Audit Certificates & Reports',
    title: 'Compliance & Security Safeguards',
    visibleLayer: 'Audit Certificates & Reports',
    hiddenSystems: ['Access control logs', 'Encryption mechanisms', 'Policy enforcement rules'],
    reconciliationMechanism: 'Cryptographic proof verification',
    auditFrequency: 'Continuous',
    surfaceSymptom: 'Audit Certificates & Reports',
    underwaterRootCause: 'Access control logs, Encryption mechanisms, Policy enforcement rules',
    operationalCost: 'Cryptographic proof verification'
  }
];

export const BEHAVIORAL_ICEBERG_DIMENSIONS: IcebergDimension[] = ICEBERG_DIMENSIONS;

export const OBJECTION_MATRIX: ObjectionItem[] = [
  {
    id: 'erp_exists',
    objection: '"We already run an ERP (SAP, Tally, Busy). Why do we need this?"',
    underlyingAnxiety: 'Fear of purchasing redundant software and feeling that current IT investments should have solved this.',
    evidenceAndMechanism: 'ERPs are transactional ledgers: they record that a transaction happened. They do not algorithmically diagnose velocity stagnation, calculate holding burn, or isolate the Pareto 80/20 critical review list.',
    institutionalGuarantee: 'Operationalyst does not replace your ERP; it acts as an analytical lens on top of it. It requires zero ERP modifications or migrations.',
    verificationStep: 'Compare your ERP closing stock report side-by-side with our structured velocity breakdown in the Sample Audit report.',
    preventionSystem: 'Zero-downtime shadow pipeline architecture',
    verificationProof: 'Automated diff report during 14-day dry run',
    slaGuarantee: '100% operational continuity guarantee'
  },
  {
    id: 'excel_does_this',
    objection: '"Our team already manages inventory with Microsoft Excel."',
    underlyingAnxiety: 'Reluctance to change established habits and assumption that internal spreadsheets are sufficient.',
    evidenceAndMechanism: 'Excel reports are manually generated, prone to formula corruption across multi-thousand row sheets, and rarely compute velocity decay curves across 90/180/365d brackets consistently.',
    institutionalGuarantee: 'You do not abandon Excel. You simply export your standard sheet and run it through Operationalyst to instantly reveal what manual formulas miss.',
    verificationStep: 'Upload your existing inventory Excel file to the Diagnostic Teaser and inspect the auto-generated velocity decay breakdown.',
    preventionSystem: 'Mathematical invariant verification gate',
    verificationProof: 'Determinism logs & automated rollback triggers',
    slaGuarantee: 'Zero false-positive financial recovery trigger SLA'
  },
  {
    id: 'data_security',
    objection: '"Is our proprietary cost and inventory data safe?"',
    underlyingAnxiety: 'Concern about data exposure, leaks, or misuse of sensitive financial figures.',
    evidenceAndMechanism: 'Client data is processed in isolated, single-tenant analytical runtime sessions with end-to-end encryption. No raw data is ever shared, resold, or used for generic model training.',
    institutionalGuarantee: 'Strict Non-Disclosure & Enterprise Data Isolation Agreement binding on all system operations.',
    verificationStep: 'Review our Security & Telemetry Architecture brief or request a SOC2-aligned security walkthrough.',
    preventionSystem: 'SOC2 Type II certified isolated enclave execution',
    verificationProof: 'Third-party audit reports & continuous telemetry',
    slaGuarantee: 'Full compliance SLA with zero unencrypted data residency'
  },
  {
    id: 'implementation_effort',
    objection: '"How much bandwidth will this demand from our internal IT team?"',
    underlyingAnxiety: 'Fear of protracted software rollouts that distract engineering and IT from core priorities.',
    evidenceAndMechanism: 'Operationalyst requires zero custom code, zero API development, and zero database schema changes to start. You provide standard inventory CSV/Excel exports; our engines handle parsing and audit math automatically.',
    institutionalGuarantee: 'Zero IT Bandwidth Commitment: audit delivery is fully turnkey.',
    verificationStep: 'Test with a sample 20-SKU CSV export today; total setup time is under 15 minutes.',
    preventionSystem: 'Real-time profit recovery telemetry dashboard',
    verificationProof: 'Audited monthly reconciliation report',
    slaGuarantee: 'Full refund of tier fee if target ROI not reached in 90 days'
  }
];

export const STAKEHOLDER_PERSPECTIVES = [
  { role: 'CEO', focus: 'Profitability & Capital Recovery', keyMetric: 'Cash Flow Growth' },
  { role: 'CFO', focus: 'Working Capital & Risk Control', keyMetric: 'Inventory Holding Cost' },
  { role: 'COO', focus: 'Throughput & Fulfillment SLAs', keyMetric: 'OTIF & SLA Accuracy' }
];

export const CUSTOMER_ANXIETY_MAP = [
  { anxiety: 'Loss of Control', mitigation: 'Full Deterministic Transparency' },
  { anxiety: 'Implementation Delay', mitigation: 'Zero-Integration Setup' }
];

export type SampleAuditModeId = 'sandbox_20' | 'illustrative_12400';

export interface ConnectedPillarPill {
  pillarCode: string;
  label: string;
  value: string;
  detail: string;
}

export interface SampleAuditModeMetrics {
  id: SampleAuditModeId;
  badge: string;
  badgeLabel: string;
  shortLabel: string;
  buttonLabel: string;
  subtitle: string;
  totalBookValueFormatted: string;
  skusEvaluatedText: string;
  deadStockValueFormatted: string;
  deadStockSubtext: string;
  slowMovingValueFormatted: string;
  slowMovingSubtext: string;
  prioritySkusHeadline: string;
  prioritySkusSubtext: string;
  topCategoryName: string;
  topCategorySubtext: string;
  p2OtifPill: string;
  p3FreightPill: string;
  p4BinPill: string;
  inventoryAnalysedValue: string;
  inventoryAnalysedSub: string;
  itemsReviewedValue: string;
  itemsReviewedSub: string;
  nonMovingValue: string;
  nonMovingSub: string;
  slowMovingValue: string;
  slowMovingSub: string;
  priorityReviewValue: string;
  priorityReviewSub: string;
  highestCategoryValue: string;
  highestCategorySub: string;
  connectedPillarPills: ConnectedPillarPill[];
}

export function getReconciledSampleAuditModes(): Record<SampleAuditModeId, SampleAuditModeMetrics> {
  const p1Evaluated = evaluateStockEngine(AMBATTUR_FABRICATION_SAMPLE, P1_DEFAULT_RULES);
  const p1Owner = generateOwnerReport(AMBATTUR_FABRICATION_SAMPLE, P1_DEFAULT_RULES);
  const p2Metrics = calculateOTIFMetrics(INITIAL_DISPATCHES, P2_DEFAULT_RULES);
  const p3Metrics = calculateAuditMetrics(INITIAL_TRIPS, P3_DEFAULT_RULES);
  const p4Summary = computeSummary(INITIAL_SAMPLE_SKUS, P4_DEFAULT_RULES);
  const p4AccuracyPct =
    p4Summary.skusCounted > 0
      ? ((p4Summary.linesMatched / p4Summary.skusCounted) * 100).toFixed(1)
      : '0.0';

  return {
    sandbox_20: {
      id: 'sandbox_20',
      badge: 'Interactive Demo Mode',
      badgeLabel: 'Interactive Sandbox (20 SKUs)',
      shortLabel: '20-SKU Sandbox',
      buttonLabel: 'Audit Mode A: 20-SKU Sandbox',
      subtitle: 'Live engine evaluation computed directly from the 20-SKU Ambattur sample dataset.',
      totalBookValueFormatted: `₹${(p1Evaluated.totalBookValue / 100000).toFixed(2)}L`,
      skusEvaluatedText: `${p1Evaluated.skus.length} SKUs (Ambattur Sample)`,
      deadStockValueFormatted: `₹${(p1Evaluated.deadStockValue / 100000).toFixed(2)}L`,
      deadStockSubtext: `${((p1Evaluated.deadStockValue / p1Evaluated.totalBookValue) * 100).toFixed(1)}% of total inventory value`,
      slowMovingValueFormatted: `₹${(p1Evaluated.slowMovingValue / 100000).toFixed(2)}L`,
      slowMovingSubtext: `${((p1Evaluated.slowMovingValue / p1Evaluated.totalBookValue) * 100).toFixed(1)}% of total inventory value`,
      prioritySkusHeadline: `${p1Evaluated.prioritySkus.length} SKUs Flagged for Review`,
      prioritySkusSubtext: `Representing ₹${(p1Owner.summaryMetrics.capitalAtRisk / 100000).toFixed(2)}L capital at risk`,
      topCategoryName: p1Evaluated.categoryBreakdown[0]?.category || 'N/A',
      topCategorySubtext: `₹${((p1Evaluated.categoryBreakdown[0]?.value || 0) / 100000).toFixed(2)}L across ${p1Evaluated.categoryBreakdown[0]?.count || 0} SKUs`,
      p2OtifPill: `${p2Metrics.otifRate.toFixed(1)}% OTIF`,
      p3FreightPill: `₹${(p3Metrics.financialImpact.recoverableCapital / 100000).toFixed(2)}L Freight Recoverable`,
      p4BinPill: `${p4AccuracyPct}% Bin Accuracy`,
      inventoryAnalysedValue: `₹${(p1Evaluated.totalBookValue / 100000).toFixed(2)}L`,
      inventoryAnalysedSub: '20 SKUs Evaluated',
      itemsReviewedValue: `${p1Evaluated.skus.length}`,
      itemsReviewedSub: 'Ambattur Fabrication Sample',
      nonMovingValue: `₹${(p1Evaluated.deadStockValue / 100000).toFixed(2)}L`,
      nonMovingSub: `${((p1Evaluated.deadStockValue / p1Evaluated.totalBookValue) * 100).toFixed(1)}% Dead Stock`,
      slowMovingValue: `₹${(p1Evaluated.slowMovingValue / 100000).toFixed(2)}L`,
      slowMovingSub: `${((p1Evaluated.slowMovingValue / p1Evaluated.totalBookValue) * 100).toFixed(1)}% Slow-Moving`,
      priorityReviewValue: `${p1Evaluated.prioritySkus.length} SKUs`,
      priorityReviewSub: `₹${(p1Owner.summaryMetrics.capitalAtRisk / 100000).toFixed(2)}L Capital at Risk`,
      highestCategoryValue: p1Evaluated.categoryBreakdown[0]?.category || 'N/A',
      highestCategorySub: `₹${((p1Evaluated.categoryBreakdown[0]?.value || 0) / 100000).toFixed(2)}L (${p1Evaluated.categoryBreakdown[0]?.count || 0} SKUs)`,
      connectedPillarPills: [
        {
          pillarCode: 'P2',
          label: 'P2 Dispatch & OTIF Engine',
          value: `${p2Metrics.otifRate.toFixed(1)}% OTIF`,
          detail: `${p2Metrics.totalDispatches} Dispatches Audited`
        },
        {
          pillarCode: 'P3',
          label: 'P3 Freight & Logistics Engine',
          value: `₹${(p3Metrics.financialImpact.recoverableCapital / 100000).toFixed(2)}L`,
          detail: `${p3Metrics.totalTrips} Trips Audited`
        },
        {
          pillarCode: 'P4',
          label: 'P4 Store & Bin Location Engine',
          value: `${p4AccuracyPct}% Accuracy`,
          detail: `${p4Summary.skusCounted} SKUs Sampled`
        }
      ]
    },
    illustrative_12400: {
      id: 'illustrative_12400',
      badge: 'Full Enterprise Scale',
      badgeLabel: 'Illustrative Enterprise Audit (12,400 SKUs)',
      shortLabel: '12,400-SKU Benchmark',
      buttonLabel: 'Audit Mode B: 12,400-SKU Enterprise Benchmark',
      subtitle: 'Simulated scale metrics representing a ₹48.5 Cr mid-sized manufacturing enterprise audit.',
      totalBookValueFormatted: '₹48.50 Cr',
      skusEvaluatedText: '12,400 SKUs (Multi-Plant Enterprise)',
      deadStockValueFormatted: '₹4.12 Cr',
      deadStockSubtext: '8.5% of total inventory value (>365d zero movement)',
      slowMovingValueFormatted: '₹7.68 Cr',
      slowMovingSubtext: '15.8% of total inventory value (180-365d low velocity)',
      prioritySkusHeadline: '842 SKUs Flagged for Immediate Action',
      prioritySkusSubtext: 'Representing ₹6.34 Cr in actionable capital recovery',
      topCategoryName: 'Raw Materials & Alloys',
      topCategorySubtext: '₹18.40 Cr across 3,120 SKUs',
      p2OtifPill: '81.4% OTIF Benchmark',
      p3FreightPill: '₹62.4L Freight Leakage',
      p4BinPill: '78.2% Bin Reconciliation',
      inventoryAnalysedValue: '₹48.50 Cr',
      inventoryAnalysedSub: '12,400 SKUs Evaluated',
      itemsReviewedValue: '12,400 SKUs',
      itemsReviewedSub: 'Multi-Plant Industrial Enterprise',
      nonMovingValue: '₹4.12 Cr',
      nonMovingSub: '8.5% Dead Stock (>365d)',
      slowMovingValue: '₹7.68 Cr',
      slowMovingSub: '15.8% Slow-Moving (180-365d)',
      priorityReviewValue: '842 SKUs',
      priorityReviewSub: '₹6.34 Cr Actionable Capital Recovery',
      highestCategoryValue: 'Raw Materials & Alloys',
      highestCategorySub: '₹18.40 Cr (3,120 SKUs)',
      connectedPillarPills: [
        {
          pillarCode: 'P2',
          label: 'P2 Dispatch & OTIF Engine',
          value: '81.4% OTIF',
          detail: '1,420 Dispatches Audited'
        },
        {
          pillarCode: 'P3',
          label: 'P3 Freight & Logistics Engine',
          value: '₹62.4L Leakage',
          detail: '840 Freight Invoices Audited'
        },
        {
          pillarCode: 'P4',
          label: 'P4 Store & Bin Location Engine',
          value: '78.2% Accuracy',
          detail: '2,150 Bins Physical Counted'
        }
      ]
    }
  };
}
