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
    headline: 'How Much of Your Inventory Has Stopped Moving?',
  },
  B: {
    id: 'B',
    headline: 'Find Working Capital Hidden Inside Inventory',
  },
  C: {
    id: 'C',
    headline: 'Know Which Inventory Needs Attention Before Your Next Review',
  },
};

export const ACTIVE_DEFAULT_VARIANT: 'A' | 'B' | 'C' = 'A';

export const PROBLEM_QUESTIONS: string[] = [
  'How much working capital is currently trapped in phantom raw material bin shortages across plant floors?',
  'Which purchase orders were received after promised date without SLA credit claim?',
  'What is the discrepancy between freight invoices and contracted rate cards?',
  'Why do dead-stock raw material plates sit un-reconciled past 180 days without automated alerts?',
];

export const PROCESS_STEPS = [
  {
    num: '01',
    title: '5-Column Anonymized Upload',
    description: 'Drag & drop raw ERP ledger export. No write access required.',
  },
  {
    num: '02',
    title: 'Deterministic Matching Engine',
    description: 'Cross-reference 3-way PO, GRN, and AP voucher invoices automatically.',
  },
  {
    num: '03',
    title: 'Variance & Leak Identification',
    description: 'Detect price hikes, duplicate billings, and freight overcharges.',
  },
  {
    num: '04',
    title: 'Audit-Ready Executive Workbook',
    description: 'Receive itemized recovery schedules signed by domain specialists.',
  },
  {
    num: '05',
    title: 'SLA Guarantee & Recovery',
    description: 'Realize working capital recovery or trigger 100% money-back clause.',
  },
];

export const AUDIT_DELIVERABLES = [
  { id: 'deliv_1', title: '3-Way Matching Variance Ledger', desc: 'Itemized discrepancy report across PO, GRN, and Vendor Invoice.' },
  { id: 'deliv_2', title: 'Phantom Inventory Bin Map', desc: 'Physical vs ERP ledger reconciliation matrix per SKU.' },
  { id: 'deliv_3', title: 'Freight Rate Card Auditor', desc: 'Overcharge breakdown across all logistics corridors.' },
  { id: 'deliv_4', title: 'Duplicate Voucher Purge Sheet', desc: 'Flagged payments with identical reference or transaction hashes.' },
  { id: 'deliv_5', title: 'Vendor Credit Claim Workbook', desc: 'Ready-to-issue credit notes for supplier SLA violations.' },
  { id: 'deliv_6', title: 'Dead Stock Working Capital Teardown', desc: 'Aging inventory liquidation roadmap (>180 days).' },
  { id: 'deliv_7', title: 'CA Partner Verification Seal', desc: 'Formal audit sign-off by accredited stock auditors.' },
  { id: 'deliv_8', title: 'SLA Penalty Claim Schedule', desc: 'Delayed delivery penalties calculated per PO terms.' },
  { id: 'deliv_9', title: 'Continuous ERP Watchdog Rules', desc: 'Automated rules package for ongoing leak prevention.' },
];

export const METHODOLOGY_STAGES = [
  { stageNum: '01', title: 'Data Ingestion & Invariant Validation', subtitle: '5-Column Schema Parsing', metric: '100% Deterministic' },
  { stageNum: '02', title: '3-Way Voucher & GRN Matching', subtitle: 'Line-Item Unit Rate Checks', metric: '< 0.01% False Positives' },
  { stageNum: '03', title: 'Logistics Rate Card Cross-Audit', subtitle: 'Corridor Overcharge Teardown', metric: 'Zero Manual Eyeballing' },
  { stageNum: '04', title: 'Duplicate & Phantom Leak Purge', subtitle: 'Cryptographic Voucher Matching', metric: 'Immediate Capital Recovery' },
  { stageNum: '05', title: 'Executive Forensic Signoff', subtitle: 'Signed Audit Ledger', metric: '₹2,50,000 Guarantee Base' },
  { stageNum: '06', title: 'SLA Recovery & Continuous Watchdog', subtitle: 'Continuous Audit Enforcement', metric: '24-Hour SLA Grievance Desk' },
];

export const DATA_TRUST_ITEMS = [
  { id: 'trust_1', title: '100% In-Browser Stripper', desc: 'Vendor names and confidential party fields stripped before cloud parsing.' },
  { id: 'trust_2', title: 'Read-Only File Import', desc: 'Zero direct database integration or write permissions needed.' },
  { id: 'trust_3', title: 'Cryptographic Anonymization', desc: 'All ledger IDs hashed locally with SHA-256 client-side.' },
  { id: 'trust_4', title: 'Zero Data Retention Policy', desc: 'Uploaded ledgers purged from memory immediately after analysis.' },
  { id: 'trust_5', title: 'Bank-Grade AES-256 Encryption', desc: 'All payload transmissions secured end-to-end.' },
  { id: 'trust_6', title: 'SOC-2 & ISO Invariant Alignment', desc: 'Strict compliance with enterprise audit governance standards.' },
  { id: 'trust_7', title: 'Independent CA Desk Review', desc: 'All algorithmic claims cross-checked by certified auditors.' },
];

export const FAQ_ITEMS = [
  { id: 'faq_1', question: 'How quickly will we receive our 48-Hour Factory Diagnostic workbook?', answer: 'Within 48 hours of submitting your 5-column ledger export, our audit desk delivers the fully signed executive workbook.' },
  { id: 'faq_2', question: 'What ERP systems do you support?', answer: 'We support Tally, SAP S/4HANA, Oracle ERP Cloud, Microsoft Dynamics 365, Zoho Books, Busy, and custom CSV/Excel exports.' },
  { id: 'faq_3', question: 'How does the ₹2,50,000 audit guarantee work?', answer: 'If our 48-Hour Diagnostic identifies less than ₹2,50,000 in actionable plant cash leaks, we issue a 100% refund of your ₹18,000 audit fee immediately.' },
  { id: 'faq_4', question: 'Is our ERP data kept private?', answer: 'Yes. Vendor names and confidential party fields are stripped in-browser before any audit processing occurs.' },
  { id: 'faq_5', question: 'What minimum columns are required in our upload?', answer: 'Only 5 columns: Date, PO Number, GRN/Invoice Number, Unit Rate, and Quantity.' },
  { id: 'faq_6', question: 'Can our internal CA or Stock Auditor partner with Operationalyst?', answer: 'Yes. We offer a 20% Partner Desk revenue share for Chartered Accountants and audit firms.' },
  { id: 'faq_7', question: 'What happens after the initial audit?', answer: 'You can deploy our ₹15,000/mo Monthly Watchdog for continuous ERP monitoring and automated leak alerts.' },
  { id: 'faq_8', question: 'Are there any hidden onboarding or setup fees?', answer: 'Zero hidden fees. All pricing tiers are transparent and fixed.' },
  { id: 'faq_9', question: 'How are duplicate vouchers detected?', answer: 'Our engine computes cryptographic hashes of invoice references, dates, and amounts across all vendor accounts.' },
  { id: 'faq_10', question: 'How do we escalate grievances or request data purges?', answer: 'Our 24-Hr SLA Grievance/Purge Desk guarantees complete data deletion within 24 hours of request.' },
];

export interface StakeholderPerspective {
  roleId: 'economic_buyer' | 'champion' | 'user' | 'evaluator';
  title: string;
  role: string;
  coreQuestion: string;
  unspokenAnxiety: string;
  riskMitigation: string;
  keyMetrics: string[];
}

export const STAKEHOLDER_PERSPECTIVES: StakeholderPerspective[] = [
  {
    roleId: 'economic_buyer',
    title: 'Managing Director / Founder',
    role: 'P&L Owner & Capital Allocator',
    coreQuestion: 'Will this diagnostic recover real capital without disrupting ongoing plant operations?',
    unspokenAnxiety: 'I cannot afford complex IT projects that consume team bandwidth without guaranteed ROI.',
    riskMitigation: '₹2,50,000 leak recovery guarantee backed by 100% fee refund clause.',
    keyMetrics: ['Net Capital Recovered', 'ROI Multiple on Audit Fee', 'Plant Friction Score'],
  },
  {
    roleId: 'champion',
    title: 'Head of Operations / Plant Head',
    role: 'Execution Leader',
    coreQuestion: 'Can we run this audit using existing standard ERP reports without extra data entry?',
    unspokenAnxiety: 'My team is already stretched thin; manual data prep will stall plant operations.',
    riskMitigation: 'Simple 5-column CSV drag & drop requiring zero custom ERP integration.',
    keyMetrics: ['Setup Time (< 15 mins)', 'Phantom Shortage Elimination', 'Line-Item Accuracy'],
  },
  {
    roleId: 'user',
    title: 'Internal Auditor / Commercial Manager',
    role: 'Day-to-Day User',
    coreQuestion: 'How clear and actionable are the variance schedules produced by the engine?',
    unspokenAnxiety: 'If false positives are high, vendors will dispute our claims and ruin supplier relationships.',
    riskMitigation: '100% deterministic 3-way matching rules verified by CA stock auditors.',
    keyMetrics: ['Discrepancy Resolution Rate', 'Vendor Recovery Claims Accepted', 'Cycle Time'],
  },
  {
    roleId: 'evaluator',
    title: 'Chief Financial Officer / CA Advisor',
    role: 'Governance & Compliance Signoff',
    coreQuestion: 'Does this platform meet enterprise data security and audit standards?',
    unspokenAnxiety: 'Sending sensitive ledger data offsite could violate confidentiality protocols.',
    riskMitigation: '100% in-browser party name stripping & zero data retention architecture.',
    keyMetrics: ['Privacy Invariant Score', 'Data Purge Verification Time', 'Audit Signoff Compliance'],
  },
];

export interface ObjectionItem {
  id: string;
  objection: string;
  underlyingAnxiety: string;
  evidenceAndMechanism: string;
  institutionalGuarantee: string;
  verificationStep: string;
  underlyingRisk?: string;
  reconciliationAnswer?: string;
  proofMechanism?: string;
}

export const OBJECTION_MATRIX: ObjectionItem[] = [
  {
    id: 'erp_exists',
    objection: 'Our existing ERP system already handles inventory and invoice matching.',
    underlyingAnxiety: 'Why pay for an additional audit tool when we spent millions on ERP software?',
    evidenceAndMechanism: 'Standard ERPs lack cross-period multi-corridor freight rate card auditing and multi-vouchers cryptographic duplicate purge.',
    institutionalGuarantee: 'Operationalyst uncovers leaks that slip through standard ERP rule parameters.',
    verificationStep: 'Upload 1 month of ERP ledger data to run the ₹0 Browser Sandbox audit.',
    underlyingRisk: 'Standard ERPs miss cross-period rate card overcharges.',
    reconciliationAnswer: 'Operationalyst uncovers leaks that slip through standard ERP parameters.',
    proofMechanism: 'Run 1 month of ERP data through browser sandbox.',
  },
  {
    id: 'data_privacy',
    objection: 'We cannot upload proprietary pricing and vendor data to external software.',
    underlyingAnxiety: 'Leaking supplier margins or customer pricing would ruin our competitive advantage.',
    evidenceAndMechanism: 'All vendor names and party fields are stripped locally in your browser before analysis.',
    institutionalGuarantee: 'Zero server storage of raw vendor identifiers; 24-Hr SLA data purge desk.',
    verificationStep: 'Toggle the in-browser privacy stripper to verify raw vendor names never leave your device.',
    underlyingRisk: 'Third-party exposure of sensitive vendor pricing.',
    reconciliationAnswer: 'In-browser party stripper ensures zero vendor names leave client browser.',
    proofMechanism: 'Toggle privacy stripper preview in control panel.',
  },
  {
    id: 'team_bandwidth',
    objection: 'Our plant team does not have time to set up or configure new software.',
    underlyingAnxiety: 'Complex software rollouts distract plant managers from daily production targets.',
    evidenceAndMechanism: 'Requires only a 5-column CSV export from your existing ERP. No IT integration required.',
    institutionalGuarantee: 'Zero software installation; operational in under 15 minutes.',
    verificationStep: 'Download our 5-column sample CSV template and test import in under 60 seconds.',
    underlyingRisk: 'Excessive setup overhead for busy operations team.',
    reconciliationAnswer: 'Zero integration required; simply drag & drop standard 5-column report.',
    proofMechanism: 'Test 5-column sample template in browser.',
  },
  {
    id: 'false_positives',
    objection: 'Automated audits create false alarms that irritate vendors and disrupt supply chains.',
    underlyingAnxiety: 'Disputing valid vendor bills damages supplier relationships and halts deliveries.',
    evidenceAndMechanism: 'Deterministic 3-way matching engine with strict tolerance thresholds verified by CA stock auditors.',
    institutionalGuarantee: 'Every flagged item is backed by line-item PO, GRN, and rate-card evidence.',
    verificationStep: 'Inspect the top 3 high-leak SKU rows in full detail before issuing claims.',
    underlyingRisk: 'False alarms damaging supplier relationships.',
    reconciliationAnswer: 'Strict 3-way matching rules verified by CA stock auditors minimize false flags.',
    proofMechanism: 'Inspect row-level PO and GRN match evidence.',
  },
  {
    id: 'audit_cost',
    objection: '₹18,000 for a 48-hour diagnostic might not yield worthwhile financial recovery.',
    underlyingAnxiety: 'Paying upfront fees without guaranteed return creates unrecoverable expense.',
    evidenceAndMechanism: 'Every diagnostic is backed by our ₹2,50,000 leak recovery guarantee.',
    institutionalGuarantee: '100% money-back refund if identified cash leaks fall below ₹2,50,000.',
    verificationStep: 'Review the signed executive workbook refund terms prior to diagnostic engagement.',
    underlyingRisk: 'Diagnostic fee cost without matching financial recovery.',
    reconciliationAnswer: 'Full ₹18,000 refund if identified leaks total under ₹2,50,000.',
    proofMechanism: 'Enforce contractual refund clause in audit agreement.',
  },
  {
    id: 'ca_conflict',
    objection: 'Our internal CA or statutory auditor already conducts regular stock audits.',
    underlyingAnxiety: 'Appearing to bypass existing financial advisors creates internal governance friction.',
    evidenceAndMechanism: 'Operationalyst operates as an automated workbench for CAs and stock auditors.',
    institutionalGuarantee: '20% Partner Desk revenue share and co-branded workbook signoff for CA partners.',
    verificationStep: 'Share our CA Partner Desk breakdown with your external auditor.',
    underlyingRisk: 'Perceived conflict with external statutory auditors.',
    reconciliationAnswer: 'Operationalyst empowers CAs with continuous automated audit capabilities.',
    proofMechanism: 'Invite CA to sign off on co-branded audit workbook.',
  },
];

export interface CustomerAnxiety {
  stage: string;
  unspokenAnxiety: string;
  institutionalSafeguard: string;
}

export const CUSTOMER_ANXIETY_MAP: CustomerAnxiety[] = [
  { stage: 'Pre-Audit Evaluation', unspokenAnxiety: 'Will this compromise our ERP data integrity?', institutionalSafeguard: 'Read-only 5-column upload with 100% in-browser privacy stripper.' },
  { stage: 'Diagnostic Execution', unspokenAnxiety: 'What if the audit takes weeks and delays monthly closing?', institutionalSafeguard: 'Strict 48-Hour SLA execution timeline.' },
  { stage: 'Report Delivery', unspokenAnxiety: 'Will the report contain vague recommendations instead of line items?', institutionalSafeguard: 'Itemized SKU & LR variance schedules with PO numbers.' },
  { stage: 'Vendor Recovery', unspokenAnxiety: 'How do we present these claims to vendors without conflict?', institutionalSafeguard: 'Signed CA-verified executive workbook with supporting vouchers.' },
  { stage: 'Post-Audit Monitoring', unspokenAnxiety: 'Will leaks recur once the audit engagement ends?', institutionalSafeguard: 'Continuous ₹15,000/mo Monthly Watchdog continuous monitoring.' },
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
  { id: 'iceberg_1', num: '01', name: 'Phantom Bin Shortages', category: 'Physical Inventory', symptom: 'Ledger shows stock, physical bin is empty.', scope: 'Plant Bin Level', underlyingCause: 'Unrecorded floor scraps and unaccounted material movements.', financialImpact: '₹5L - ₹25L annually in unplanned emergency purchases.', preventativeMechanism: 'Daily bin variance reconciliation auto-alerts.' },
  { id: 'iceberg_2', num: '02', name: 'Freight Detention Leakage', category: 'Logistics', symptom: 'Uncontracted demurrage fees paid on long-haul transport.', scope: 'Logistics Corridors', underlyingCause: 'Manual LR approval without checking contracted free-time SLA.', financialImpact: '₹3L - ₹12L in unverified detention vouchers.', preventativeMechanism: 'Automated LR free-time gate verification.' },
  { id: 'iceberg_3', num: '03', name: 'Unclaimed PO Delay Penalties', category: 'Procurement', symptom: 'Vendors deliver 30+ days late with zero penalty deduction.', scope: 'Purchase Orders', underlyingCause: 'AP team processes invoice without cross-referencing PO delivery terms.', financialImpact: '₹4L - ₹18L in lost SLA penalty credits.', preventativeMechanism: 'PO SLA penalty calculation gate.' },
  { id: 'iceberg_4', num: '04', name: 'Duplicate Vendor Vouchers', category: 'Accounts Payable', symptom: 'Multiple invoice entries for single shipment.', scope: 'Vendor Ledgers', underlyingCause: 'Slight variations in vendor invoice numbering passed manually.', financialImpact: '₹2L - ₹15L in duplicate disbursements.', preventativeMechanism: 'Cryptographic hash invoice duplicate purge.' },
  { id: 'iceberg_5', num: '05', name: 'Scrap & Shrinkage Discrepancy', category: 'Production', symptom: 'Scrap weight does not match raw material input loss.', scope: 'Shop Floor', underlyingCause: 'Unmonitored scrap generation rates during machine calibration.', financialImpact: '₹6L - ₹30L in uncaptured metal scrap value.', preventativeMechanism: 'BOM scrap tolerance validation algorithm.' },
  { id: 'iceberg_6', num: '06', name: 'Unbilled Freight Weight Margins', category: 'Logistics', symptom: 'Transporter bills gross vehicle weight without tare deduction.', scope: 'Inbound Freight', underlyingCause: 'Weighbridge receipts not automatically linked to freight invoices.', financialImpact: '₹4L - ₹16L in excessive freight billing.', preventativeMechanism: 'Weighbridge integration & auto tare check.' },
  { id: 'iceberg_7', num: '07', name: 'Overdue Vendor SLA Credit Notes', category: 'Procurement', symptom: 'Quality rejections noted but credit note never received.', scope: 'Quality Control', underlyingCause: 'QC rejection slips isolated from AP accounting ledger.', financialImpact: '₹5L - ₹20L in uncollected rejection credits.', preventativeMechanism: 'QC rejection to AP credit note bridge.' },
  { id: 'iceberg_8', num: '08', name: 'Unreconciled Advance Payments', category: 'Finance', symptom: 'Advance payments sit unadjusted against final invoices.', scope: 'Vendor Advances', underlyingCause: 'Lack of automated advance aging alerts in accounting.', financialImpact: '₹8L - ₹35L in locked working capital.', preventativeMechanism: 'Vendor advance aging watchdog.' },
  { id: 'iceberg_9', num: '09', name: 'Tier 2 Material Price Hikes', category: 'Procurement', symptom: 'Vendor bills above agreed purchase contract rate card.', scope: 'Contract Management', underlyingCause: 'Manual price updates in ERP without management signoff.', financialImpact: '₹3L - ₹14L in unauthorised price escalations.', preventativeMechanism: 'Contractual rate card invariant check.' },
  { id: 'iceberg_10', num: '10', name: 'Sub-optimal Batch Sizing Losses', category: 'Production', symptom: 'Frequent setup adjustments eroding daily yield.', scope: 'Production Planning', underlyingCause: 'Manufacturing small batches without considering setup cost thresholds.', financialImpact: '₹4L - ₹18L in setup labor overheads.', preventativeMechanism: 'Economic batch quantity optimizer.' },
  { id: 'iceberg_11', num: '11', name: 'Transit Insurance Claim Lapses', category: 'Logistics', symptom: 'Damaged transit stock written off as plant loss.', scope: 'Supply Chain Risk', underlyingCause: 'Lapse in submitting transit damage claim within insurance window.', financialImpact: '₹2L - ₹10L in lost insurance claims.', preventativeMechanism: 'Automated transit incident claim tracker.' },
  { id: 'iceberg_12', num: '12', name: 'BOM Revision Lag Variance', category: 'Engineering', symptom: 'Production uses obsolete BOM version material ratios.', scope: 'Engineering Master Data', underlyingCause: 'Delayed updates to engineering BOM in main ERP system.', financialImpact: '₹5L - ₹22L in excess raw material consumption.', preventativeMechanism: 'Real-time BOM version synchronization.' },
  { id: 'iceberg_13', num: '13', name: 'Uncaptured Quantity Discounts', category: 'Procurement', symptom: 'Tiered volume rebates not claimed at year end.', scope: 'Commercial Contracts', underlyingCause: 'Volume threshold tracking not automated in vendor ledgers.', financialImpact: '₹6L - ₹28L in unclaimed rebate income.', preventativeMechanism: 'Automated volume rebate tracker.' },
  { id: 'iceberg_14', num: '14', name: 'Excess Packing Material Expense', category: 'Packaging', symptom: 'Packaging material consumption exceeds standard specs.', scope: 'Packaging Operations', underlyingCause: 'Lack of strict packaging material usage standards per batch.', financialImpact: '₹3L - ₹12L in wasted packaging stock.', preventativeMechanism: 'Packaging standard variance monitor.' },
  { id: 'iceberg_15', num: '15', name: 'Unverified Off-Spec Material Claims', category: 'Quality Control', symptom: 'Off-spec raw material accepted with full price payment.', scope: 'Receiving Inspection', underlyingCause: 'QC concessions granted without commercial price markdown.', financialImpact: '₹4L - ₹19L in quality concession losses.', preventativeMechanism: 'QC concession price adjustment gate.' },
  { id: 'iceberg_16', num: '16', name: 'Idle Equipment Energy Waste', category: 'Utilities', symptom: 'High baseline energy draw during non-production shifts.', scope: 'Plant Maintenance', underlyingCause: 'Auxiliary machinery left running during shift changes.', financialImpact: '₹3L - ₹15L in excess electricity costs.', preventativeMechanism: 'Shift change energy load monitor.' },
  { id: 'iceberg_17', num: '17', name: 'Untracked Toll Manufacturing Losses', category: 'Outsourcing', symptom: 'Job work vendor yield return is consistently below target.', scope: 'Job Work Ledgers', underlyingCause: 'Inadequate reconciliation of input raw material vs output goods.', financialImpact: '₹7L - ₹32L in job work material loss.', preventativeMechanism: 'Job work material balance ledger.' },
  { id: 'iceberg_18', num: '18', name: 'Uncollected Customer Penalty Credits', category: 'Sales Operations', symptom: 'Customer debits penalizing late delivery accepted without verification.', scope: 'Accounts Receivable', underlyingCause: 'Sales team accepts customer debit notes without checking despatch proof.', financialImpact: '₹5L - ₹24L in unwarranted penalty debits.', preventativeMechanism: 'Customer debit note challenge protocol.' },
  { id: 'iceberg_19', num: '19', name: 'Excess Spares Stocking', category: 'Maintenance', symptom: 'High inventory of obsolete MRO spare parts.', scope: 'MRO Stores', underlyingCause: 'Over-ordering spare parts for legacy machines no longer active.', financialImpact: '₹4L - ₹16L in idle spare parts capital.', preventativeMechanism: 'MRO spare part movement audit.' },
  { id: 'iceberg_20', num: '20', name: 'Unoptimized Loading Bay Turnaround', category: 'Logistics', symptom: 'Trucks idling inside plant premises past turnaround SLA.', scope: 'Plant Gate', underlyingCause: 'Bottlenecks at loading bay manual documentation counter.', financialImpact: '₹2L - ₹8L in detention charges & vehicle delays.', preventativeMechanism: 'Gate turnaround SLA monitoring.' },
  { id: 'iceberg_21', num: '21', name: 'Unclaimed Export Incentive Subsidies', category: 'Taxation & Regulatory', symptom: 'Eligible export incentive benefit schemes not filed in time.', scope: 'Export Operations', underlyingCause: 'Filing deadlines missed due to manual export document tracking.', financialImpact: '₹6L - ₹30L in lost government subsidies.', preventativeMechanism: 'Export subsidy filing calendar.' },
  { id: 'iceberg_22', num: '22', name: 'Unmonitored Vendor Tooling Costs', category: 'Procurement', symptom: 'Tooling charges paid multiple times to contract suppliers.', scope: 'Asset Management', underlyingCause: 'Lack of centralized register for vendor-held tooling assets.', financialImpact: '₹3L - ₹14L in duplicate tooling payments.', preventativeMechanism: 'Vendor tooling asset register.' },
  { id: 'iceberg_23', num: '23', name: 'Demurrage Fee Non-Recovery', category: 'Logistics', symptom: 'Port container demurrage fees absorbed without vendor billing.', scope: 'Import Logistics', underlyingCause: 'Delayed clearance due to vendor late document dispatch.', financialImpact: '₹5L - ₹25L in port demurrage absorption.', preventativeMechanism: 'Import document dispatch watchdog.' },
  { id: 'iceberg_24', num: '24', name: 'Inaccurate Machine Downtime Logging', category: 'Operations', symptom: 'OEE figures artificially high due to unrecorded micro-stoppages.', scope: 'Shop Floor OEE', underlyingCause: 'Manual logging of downtime by machine operators.', financialImpact: '₹4L - ₹18L in lost plant capacity.', preventativeMechanism: 'Automated downtime tracking invariant.' },
  { id: 'iceberg_25', num: '25', name: 'Unverified Sub-Contracting Rates', category: 'Procurement', symptom: 'Higher job work rates paid without rate card contract.', scope: 'Job Work Vendors', underlyingCause: 'Emergency sub-contracting approved at spot rates.', financialImpact: '₹3L - ₹15L in premium sub-contracting costs.', preventativeMechanism: 'Sub-contracting spot rate cap.' },
  { id: 'iceberg_26', num: '26', name: 'Overdue Scrap Disposal Realization', category: 'Stores', symptom: 'Accumulated metal scrap sits unsold for months.', scope: 'Scrap Yard', underlyingCause: 'Scrap auction cycle delayed awaiting market price peaks.', financialImpact: '₹4L - ₹20L in delayed cash realization.', preventativeMechanism: 'Scrap auction cycle trigger.' },
  { id: 'iceberg_27', num: '27', name: 'Inaccurate Freight Distance Billing', category: 'Logistics', symptom: 'Transporters bill for inflated route distances.', scope: 'Logistics Master Data', underlyingCause: 'Manual distance verification instead of GPS/Map routing data.', financialImpact: '₹3L - ₹12L in inflated distance billing.', preventativeMechanism: 'Geofenced route distance audit.' },
];

export interface SampleAuditMode {
  id: string;
  name: string;
  description: string;
  sampleFile: string;
}

export function getReconciledSampleAuditModes(): SampleAuditMode[] {
  return [
    { id: 'mode_3way', name: '3-Way Voucher Audit', description: 'Cross-reference PO, GRN, and AP Invoices', sampleFile: '3way_sample.csv' },
    { id: 'mode_freight', name: 'Freight Corridor Audit', description: 'Logistics rate card overcharge verification', sampleFile: 'freight_sample.csv' },
    { id: 'mode_phantom', name: 'Phantom Stock Audit', description: 'Bin level ERP vs physical inventory teardown', sampleFile: 'phantom_sample.csv' },
  ];
}

export const FOUNDER_EXECUTIVE_SIGNOFF = {
  founderName: 'Jonez',
  role: 'Founder & Principal Audit Systems Architect',
  guaranteeText: 'Operationalyst guarantees a minimum of ₹2,50,000 in identified actionable plant cash leaks per ₹18,000 diagnostic engagement, or 100% of the audit fee is immediately refunded.',
  contactEmail: 'joneszz2004@gmail.com',
};

export interface CommercialTier {
  id: string;
  name: string;
  badge: string;
  price: string;
  period?: string;
  description: string;
  guarantee?: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
}

export const COMMERCIAL_TIERS: CommercialTier[] = [
  {
    id: 'tier_0_sandbox',
    name: '₹0 Browser Sandbox',
    badge: 'Self-Serve Instant Audit',
    price: '₹0',
    description: 'Instant in-browser audit with 100% data privacy. No sign-up or credit card required.',
    features: [
      '100% In-browser processing (zero data leaves device)',
      'Deterministic 3-way PO-GRN-Invoice matching',
      'Instant leak summary preview',
      'Sample data generator included',
    ],
    ctaText: 'Launch Free Sandbox',
  },
  {
    id: 'tier_18k_diagnostic',
    name: '₹18,000 48-Hr Factory Diagnostic',
    badge: '₹2,50,000 Money-Back Guarantee',
    price: '₹18,000',
    period: 'one-time',
    description: 'Comprehensive 48-hour plant cash leak diagnostic with signed CA executive workbook.',
    guarantee: '100% Refunded if < ₹2,50,000 identified',
    features: [
      'Full 5-column ERP ledger teardown',
      'Line-item variance & overcharge breakdown',
      '48-Hour SLA turnaround time',
      'Signed Executive Audit Workbook',
      '₹2,50,000 Leak Recovery Guarantee',
    ],
    ctaText: 'Claim 48-Hr Diagnostic',
    popular: true,
  },
  {
    id: 'tier_15k_watchdog',
    name: '₹15,000/mo Monthly Watchdog',
    badge: 'Continuous Protection',
    price: '₹15,000',
    period: 'per month',
    description: 'Continuous automated ERP monitoring and real-time cash leak alerts for ongoing operations.',
    features: [
      'Continuous ERP audit automation',
      'Automated weekly variance reports',
      'Duplicate voucher purge alerts',
      'Freight rate card breach watchdog',
      'Dedicated audit support desk',
    ],
    ctaText: 'Deploy Watchdog',
  },
  {
    id: 'tier_ca_partner',
    name: '20% CA & Stock Auditor Partner Desk',
    badge: 'Auditor Workbench',
    price: '20% Share',
    description: 'Revenue share & co-branded audit workbench for Chartered Accountants and stock audit firms.',
    features: [
      '20% Revenue share per diagnostic client',
      'Co-branded executive audit workbooks',
      'Multi-client dashboard management',
      'Priority 24-hour SLA processing',
      'Dedicated Partner Desk manager',
    ],
    ctaText: 'Apply for CA Partner Desk',
  },
];

export interface InstitutionalTeam {
  id: string;
  num: string;
  name: string;
  role: string;
  focus: string;
  invariant: string;
  deliverable: string;
}

export const TEN_TEAM_OPERATING_SYSTEM: InstitutionalTeam[] = [
  { id: 'desk_1', num: '01', name: 'Raw Material Inwarding Desk', role: 'Inbound Verification', focus: 'GRN vs PO Gate Matching', invariant: 'Zero rate variance accepted on entry', deliverable: 'Inward Discrepancy Log' },
  { id: 'desk_2', num: '02', name: 'Logistics & Freight Corridor Audit Desk', role: 'Freight Clearance', focus: 'Contracted Rate Card Compliance', invariant: 'Demurrage SLA verification mandatory', deliverable: 'Logistics Overcharge Ledger' },
  { id: 'desk_3', num: '03', name: 'Accounts Payable Voucher Purge Desk', role: 'Disbursement Control', focus: 'Duplicate Voucher Elimination', invariant: 'Cryptographic hash uniqueness', deliverable: 'Purged Duplicate Schedule' },
  { id: 'desk_4', num: '04', name: 'Physical Stock & Bin Reconciliation Desk', role: 'Stores Management', focus: 'ERP vs Bin Count Alignment', invariant: 'Bin variance < 0.05% threshold', deliverable: 'Phantom Bin Adjustment Report' },
  { id: 'desk_5', num: '05', name: 'Vendor SLA & Credit Claim Desk', role: 'Procurement Governance', focus: 'Delayed Delivery Penalty Enforcement', invariant: 'PO SLA terms strictly enforced', deliverable: 'Vendor Credit Claim Notes' },
  { id: 'desk_6', num: '06', name: 'Scrap & Material Yield Invariant Desk', role: 'Shop Floor Oversight', focus: 'BOM Scrap Ratio Reconciliation', invariant: 'Yield variance alerts triggered daily', deliverable: 'Material Yield Teardown' },
  { id: 'desk_7', num: '07', name: 'Dead Stock & Liquidation Desk', role: 'Working Capital Recovery', focus: 'Aging Material (>180 Days) Clearance', invariant: 'Capital release targets enforced', deliverable: 'Liquidation & Recovery Schedule' },
  { id: 'desk_8', num: '08', name: 'CA Partner Verification & Audit Signoff Desk', role: 'External Compliance', focus: 'Executive Workbook Signoff', invariant: '100% Deterministic evidence proof', deliverable: 'Signed CA Verification Seal' },
  { id: 'desk_9', num: '09', name: 'Contractual Price Escalation Review Desk', role: 'Commercial Gatekeeper', focus: 'Vendor Price Hike Validation', invariant: 'No unapproved price escalations', deliverable: 'Price Invariant Breach Report' },
  { id: 'desk_10', num: '10', name: 'Job Work & Outsourcing Balance Desk', role: 'Outsourcing Control', focus: 'Sub-contractor Material Accounting', invariant: 'Input vs output mass balance check', deliverable: 'Job Work Reconciliation Sheet' },
  { id: 'desk_11', num: '11', name: 'Weighbridge & Gross-Tare Audit Desk', role: 'Weight Invariance', focus: 'Gross vs Tare Weighbridge Data', invariant: 'Weighbridge slip mandatory link', deliverable: 'Tare Weight Variance Report' },
  { id: 'desk_12', num: '12', name: 'Customer Debit Note Challenge Desk', role: 'Receivables Protection', focus: 'Customer Penalty Claim Verification', invariant: 'Despatch SLA proof verification', deliverable: 'Debit Note Rejection Docket' },
  { id: 'desk_13', num: '13', name: 'Export Subsidy & Incentive Filing Desk', role: 'Regulatory Maximization', focus: 'Government Scheme Benefit Claims', invariant: 'Zero missed regulatory timelines', deliverable: 'Export Incentive Filing Register' },
  { id: 'desk_14', num: '14', name: '24-Hr SLA Grievance & Data Purge Desk', role: 'Privacy & Data Governance', focus: 'Client Privacy & Data Purge SLA', invariant: 'Data purged within 24 hours of request', deliverable: 'Cryptographic Purge Certificate' },
];

export const INSTITUTIONAL_TEAMS = TEN_TEAM_OPERATING_SYSTEM;
