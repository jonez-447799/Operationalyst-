/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  getLiveSandboxReconciledModeMetrics,
  ILLUSTRATIVE_12400_CASE_METRICS,
} from '../utils/liveSandboxMetrics.ts';

export interface HeadlineVariant {
  id: 'A' | 'B' | 'C';
  badge: string;
  headline: string;
  subheadline: string;
}

export const HERO_HEADLINE_VARIANTS: Record<'A' | 'B' | 'C', HeadlineVariant> = {
  A: {
    id: 'A',
    badge: '48-HOUR DIAGNOSTIC AUDIT • P1–P4 ENGINE SUITE',
    headline: 'How Much of Your Inventory Has Stopped Moving?',
    subheadline:
      'Isolate dormant SKUs (>180 days), quantify 22% annual carrying-cost burn, and generate Pareto 80/20 floor review priorities directly from your existing 5-column Tally Prime, SAP, or Excel export.',
  },
  B: {
    id: 'B',
    badge: 'WORKING CAPITAL RECOVERY • ZERO ERP INTEGRATION',
    headline: 'Find Working Capital Hidden Inside Inventory',
    subheadline:
      'Turn raw stock register exports into an itemized working-capital release plan across dead stock, dispatch OTIF, carrier overcharges, and bin variance in 48 hours.',
  },
  C: {
    id: 'C',
    badge: 'CONTROL-TOWER VISIBILITY • FLOOR TO BOARDROOM',
    headline: 'Know Which Inventory Needs Attention Before Your Next Review',
    subheadline:
      'Eliminate blind stock write-offs and surprise bin shortages with deterministic 5-column aging checks reviewed directly by founder C. Jones Snowin.',
  },
};

export const ACTIVE_DEFAULT_VARIANT: 'A' | 'B' | 'C' = 'A';

export const PROBLEM_QUESTIONS: string[] = [
  'Which raw materials, castings, or spares have sat untouched past 180 days while still burning 22% annual holding capital?',
  'Which purchase orders or customer dispatches missed promised SLA gates without documented root-cause accountability?',
  'Where are transporter bills overcharging contracted corridor rate cards or hiding unjustified halting detention charges?',
  'Which warehouse bins show stock on ERP ledgers while physical racks run empty—triggering emergency spot buys?',
];

export interface ProcessStepItem {
  num: string;
  title: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStepItem[] = [
  {
    num: '01',
    title: '5-Column Anonymized Export',
    description:
      'Export 5 standard columns from Tally Prime, SAP, Busy, or Excel and strip vendor names right inside your browser.',
  },
  {
    num: '02',
    title: 'Deterministic Engine Parsing',
    description:
      'Isolate malformed rows, duplicate SKU codes, negative balances, and null movement dates into an explicit quarantine sheet.',
  },
  {
    num: '03',
    title: 'Aging & Capital Exposure Math',
    description:
      'Compute exact days idle, 22% annual carrying-cost burn, and Pareto 80/20 concentration without subjective assumptions.',
  },
  {
    num: '04',
    title: 'Floor Verification & Spares Guard',
    description:
      'Protect critical CNC/machine reserve spares (Item 07) while ranking the top SKUs needing immediate disposition review.',
  },
  {
    num: '05',
    title: '48-Hour Executive Walkthrough',
    description:
      'Review your line-by-line working-capital recovery schedule directly with founder C. Jones Snowin and your plant leads.',
  },
];

export interface AuditDeliverableItem {
  id: string;
  title: string;
  desc: string;
}

export const AUDIT_DELIVERABLES: AuditDeliverableItem[] = [
  {
    id: 'deliv_1',
    title: 'Data-Quality & Quarantine Overview',
    desc: 'Match health score isolating missing movement dates, negative stock balances, and duplicate SKU codes.',
  },
  {
    id: 'deliv_2',
    title: 'Non-Moving Stock Ledger (>180d)',
    desc: 'Line-by-line rupee value of dormant stock items alongside 22% annual carrying-cost burn.',
  },
  {
    id: 'deliv_3',
    title: 'Slow-Moving Watchlist (90–179d)',
    desc: 'Early-warning velocity deceleration register so procurement freezes reorders before stock turns dead.',
  },
  {
    id: 'deliv_4',
    title: 'Pareto 80/20 Priority Hitlist',
    desc: 'Top 20% of SKUs driving 80% of trapped working capital ranked highest-rupee first.',
  },
  {
    id: 'deliv_5',
    title: 'Item 07 Critical Spares Shield',
    desc: 'Explicit exclusion of insurance CNC and plant maintenance spares so critical equipment uptime stays protected.',
  },
  {
    id: 'deliv_6',
    title: '6-Sheet Actionable Excel Workbook',
    desc: 'Executive summary, aging register, category concentration, and CAPA owner action schedule.',
  },
  {
    id: 'deliv_7',
    title: 'Cross-Pillar P2/P3/P4 Signal Map',
    desc: 'Links dormant stock findings to dispatch OTIF delays, freight rate overcharges, and bin variance.',
  },
  {
    id: 'deliv_8',
    title: 'Cryptographic Deletion SLA',
    desc: 'Signed DELCERT-... purge verification within 14 days (or immediately after walkthrough).',
  },
  {
    id: 'deliv_9',
    title: 'Founder Review & Next-Action Brief',
    desc: 'Direct walkthrough with C. Jones Snowin covering disposition options, vendor contra notes, and reorder freezes.',
  },
];

export interface MethodologyStage {
  stage: string;
  stageNum: string;
  name: string;
  pillLabel: string;
  formula: string;
  inputs: string;
  outputs: string;
  summary: string;
}

export const METHODOLOGY_STAGES: MethodologyStage[] = [
  {
    stage: 'Stage 01',
    stageNum: '01',
    name: '5-Column Schema & Type Ingestion',
    pillLabel:
      '5-column intake: Part_ID, Part_Description, Closing_Stock_Qty, Unit_Cost_INR, Last_Movement_Date',
    formula: 'BookValue_i = Closing_Stock_Qty_i × Unit_Cost_INR_i',
    inputs:
      'Raw 5-column export (Part_ID, Part_Description, Closing_Stock_Qty, Unit_Cost_INR, Last_Movement_Date) from Tally Prime, SAP, Busy, or Excel.',
    outputs:
      'Normalized SKU ledger with exact rupee valuation BookValue_i and parsed ISO movement timestamps.',
    summary:
      'Ingests your standard 5-column ERP stock statement into a deterministic type-checked ledger without altering live ERP tables.',
  },
  {
    stage: 'Stage 02',
    stageNum: '02',
    name: 'Data Sanitization & Anomaly Isolation',
    pillLabel: 'Null dates, negative stock, duplicate SKU checks',
    formula: 'MatchHealth% = (ValidAcceptedRows / TotalSubmittedRows) × 100',
    inputs:
      'Normalized SKU ledger rows plus ERP header alias mappings for Tally/SAP/Busy.',
    outputs:
      'Clean validated stock corpus, MatchHealth% score, and downloadable Quarantined Rows CSV for stores cleanup.',
    summary:
      'Isolates corrupted rows (null dates, negative closing balances, non-numeric rates, duplicate SKU entries) without silent fallbacks.',
  },
  {
    stage: 'Stage 03',
    stageNum: '03',
    name: 'Deterministic Dormancy & Velocity Segmentation',
    pillLabel:
      'ΔDays = AsOfDate − LastMovementDate across 0–90d, 91–180d, 181–365d, >365d',
    formula: 'ΔDays = AsOfDate − LastMovementDate',
    inputs:
      'Validated SKU movement dates and agreed plant As-Of Cutoff Date (default 180d Dead / 90d Slow).',
    outputs:
      'Exact segmentation across Healthy (0–90d), Slow Watchlist (91–180d), Dead (181–365d), and Severe Stagnant (>365d).',
    summary:
      'Computes exact calendar days since the last stock movement event to categorize active vs decelerating vs dormant capital.',
  },
  {
    stage: 'Stage 04',
    stageNum: '04',
    name: 'Carrying-Cost Burn & Capital Trap Quantification',
    pillLabel: 'AnnualBurn = BookValue × HoldingRate%, default 22% p.a.',
    formula: 'AnnualBurn = BookValue × HoldingRate% (default 22% p.a.)',
    inputs:
      'Non-moving stock valuation per SKU paired with Indian manufacturing OD interest, storage, insurance, and obsolescence rate (22% p.a.).',
    outputs:
      'SKU-level and plant-total Annual Carrying-Cost Burn and monthly working-capital bleed in INR.',
    summary:
      'Quantifies the silent P&L drag caused by financing, storing, insuring, and depreciating dormant inventory beyond 180 days.',
  },
  {
    stage: 'Stage 05',
    stageNum: '05',
    name: 'Pareto 80/20 Concentration & Priority SKU Ranking',
    pillLabel: 'Cumulative value share isolation (Pareto 80/20 Priority Hitlist)',
    formula: 'CumulativeValueShare_k = (Σ_{j=1..k} BookValue_j / TotalBookValue) × 100',
    inputs:
      'Evaluated stagnant and slow-moving SKUs sorted descending by rupee book value, with Item 07 critical spare flags.',
    outputs:
      'Priority A/B/C hitlist isolating the top ~20% SKUs holding 80% of trapped working capital.',
    summary:
      'Ranks non-moving SKUs highest-rupee first while shielding machine reserve spares so floor teams investigate high-yield capital traps first.',
  },
  {
    stage: 'Stage 06',
    stageNum: '06',
    name: 'Cross-Pillar Floor Verification & Action Plan',
    pillLabel:
      'Linking P1 Dead Stock with P2 OTIF, P3 Freight Audit, and P4 Ghost/Bin Reconciliation',
    formula: 'TargetCashRelease = (0.70 × DeadStockINR) + (0.30 × SlowMovingINR)',
    inputs:
      'Priority SKU hitlist reconciled alongside P2 dispatch gate OTIF, P3 carrier freight overcharges, and P4 physical bin variance.',
    outputs:
      'Signed 6-sheet audit workbook with disposition path (Scrap / Vendor Contra / Re-machine / Reorder Freeze) and TargetCashRelease.',
    summary:
      'Bridges raw stock findings with dispatch reliability, corridor freight recovery, and physical bin reconciliation for Monday shop-floor execution.',
  },
];

export interface DataTrustItem {
  id: string;
  question: string;
  answer: string;
}

export const DATA_TRUST_ITEMS: DataTrustItem[] = [
  {
    id: 'trust_1',
    question: 'Do you need direct login access or integration with our live ERP?',
    answer:
      'No. Operationalyst works 100% read-only from standard 5-column CSV/Excel exports from Tally Prime, SAP, Busy, or Google Sheets—zero live ERP API or write access required.',
  },
  {
    id: 'trust_2',
    question: 'Can we remove supplier, customer, and pricing party names before sending files?',
    answer:
      'Yes. Our built-in in-browser privacy stripper strips party names, GSTINs, and vendor identifiers right inside your browser before anything is uploaded.',
  },
  {
    id: 'trust_3',
    question: 'Who can access submitted information?',
    answer:
      'Submitted pilot files are restricted exclusively to founder C. Jones Snowin for deterministic audit generation and executive review. Zero third-party outsourcing or model training.',
  },
  {
    id: 'trust_4',
    question: 'How long are uploaded stock records retained on the server?',
    answer:
      'All pilot snapshots follow an automated 14-day retention window, after which raw line items across P1–P4 stores are scrubbed automatically.',
  },
  {
    id: 'trust_5',
    question: 'How can deletion be requested immediately after our walkthrough call?',
    answer:
      'Email joneszz2004@gmail.com or click Purge Workspace inside your walkthrough view to wipe raw SKU rows immediately and receive a cryptographic DELCERT-... certificate.',
  },
  {
    id: 'trust_6',
    question: 'How are critical CNC machine spares protected from scrap recommendations?',
    answer:
      'Item 07 Reserve Spares protection isolates critical CNC and maintenance spares in a dedicated safety bucket so essential plant uptime parts are never recommended for liquidation.',
  },
  {
    id: 'trust_7',
    question: 'Are formulas transparent or hidden inside proprietary AI black boxes?',
    answer:
      '100% deterministic spreadsheet-verifiable arithmetic. Every rupee figure traces back to exact Closing_Stock_Qty × Unit_Cost_INR rows and AsOfDate − LastMovementDate rules.',
  },
];

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq_1',
    q: 'How fast do we get our 48-Hour Factory Diagnostic results?',
    a: 'You receive an executive teaser immediately after CSV ingestion and the full verified 6-sheet audit workbook plus walkthrough within 48 hours of submission.',
  },
  {
    id: 'faq_2',
    q: 'Which ERP and accounting exports are supported out of the box?',
    a: 'Tally Prime / Tally ERP 9, SAP (B1, ECC, S/4HANA), Busy Accounting, Zoho Inventory, Marg ERP, and any standard CSV or Excel stock summary export.',
  },
  {
    id: 'faq_3',
    q: 'What exact columns are needed for the P1 stock diagnostic?',
    a: 'Only 5 columns: Part_ID, Part_Description, Closing_Stock_Qty, Unit_Cost_INR, and Last_Movement_Date. Download our ready-to-fill blank template directly on this page.',
  },
  {
    id: 'faq_4',
    q: 'How does the ₹2,50,000 working-capital leak guarantee work?',
    a: 'For paid 48-Hour Executive Diagnostics, if our 4-pillar audit fails to surface at least ₹2,50,000 in actionable dead stock, freight, bin variance, or SLA capital traps, we refund 100% of your fee.',
  },
  {
    id: 'faq_5',
    q: 'Will vendor names or customer rates be exposed?',
    a: 'Never. Use the built-in browser anonymizer to strip Party_Name, Customer_Name, and Transporter names locally before submission—all rupee calculations stay 100% intact.',
  },
  {
    id: 'faq_6',
    q: 'What if our stores export has missing dates or formatting errors?',
    a: 'Our quarantine engine isolates missing dates, negative quantities, and non-numeric unit rates cleanly into a separate downloadable cleanup CSV without corrupting totals.',
  },
  {
    id: 'faq_7',
    q: 'Does Operationalyst replace our Chartered Accountant or internal auditor?',
    a: 'No—we equip your finance team and CA with line-item evidence sheets, proforma working papers, and co-branded CA Partner sign-off workflows.',
  },
  {
    id: 'faq_8',
    q: 'Why use a 22% annual carrying-cost benchmark for dormant inventory?',
    a: 'Across Indian manufacturing SMEs, working-capital OD interest (10–12%), warehouse space, insurance, material handling, and rust/obsolescence consistently average 20–24% p.a.',
  },
  {
    id: 'faq_9',
    q: 'Is the pilot free or paid?',
    a: 'Every plant begins with our Free 3-SKU Diagnostic Teaser & Executive Exposure Summary (₹0) directly from your CSV upload. Unlocking the complete multi-pillar line-item audit workbook and floor action plan is a single ₹14,999 one-time unlock via UPI (9080540047@yespop) or NEFT/IMPS—with zero automatic subscriptions or hidden lock-in fees.',
  },
  {
    id: 'faq_10',
    q: 'What happens after the initial one-time diagnostic audit?',
    a: 'You keep all 6 sheets and disposition playbooks permanently. Plants wanting fortnightly drift monitoring can optionally activate the Monthly Watchdog retainer.',
  },
];

export interface StakeholderPerspective {
  id: 'economic_buyer' | 'champion' | 'user' | 'evaluator';
  roleId: 'economic_buyer' | 'champion' | 'user' | 'evaluator';
  title: string;
  roleTitle: string;
  role: string;
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
    roleId: 'economic_buyer',
    title: 'Managing Director / Owner / CFO',
    roleTitle: 'Managing Director / Owner / CFO',
    role: 'Economic Buyer',
    stakeholderType: 'Economic Buyer',
    coreQuestion:
      'How much idle cash is sitting silently in our stores right now, and how fast can we recover it without disrupting production?',
    priorityOutcome:
      'Unlock trapped working capital (>180d dormant SKUs) and cut 22% annual OD holding drain.',
    unspokenAnxiety:
      'Software vendors pitch long IT rollouts that drain management time without moving actual cash.',
    riskMitigation:
      'Starts with a Free 3-SKU Teaser (₹0) from a 5-column export and carries a ₹2,50,000 capital recovery guarantee.',
    keyMetrics: [
      'Non-Moving Cash Exposure (₹)',
      '22% Annual Carrying-Cost Drain',
      'Target 90-Day Cash Release',
    ],
  },
  {
    id: 'champion',
    roleId: 'champion',
    title: 'Plant Head / GM Operations',
    roleTitle: 'Plant Head / GM Operations',
    role: 'Internal Champion',
    stakeholderType: 'Internal Champion',
    coreQuestion:
      'Can my team run this diagnostic from existing Tally or SAP exports on Monday morning without heavy manual cleanup?',
    priorityOutcome:
      'Surface floor bottlenecks—dead castings, missed OTIF gates, and bin shortages—in one unified review.',
    unspokenAnxiety:
      'Plant supervisors already fight daily shortages and cannot spend days formatting custom spreadsheets.',
    riskMitigation:
      'Automatic header alias mapping for Tally Prime, SAP, and Busy—ready in under 15 minutes with zero IT support.',
    keyMetrics: [
      'Pareto 80/20 Priority Hitlist',
      'Dispatch Gate OTIF %',
      'Bin Match Accuracy %',
    ],
  },
  {
    id: 'user',
    roleId: 'user',
    title: 'Materials / Stores / Purchase Lead',
    roleTitle: 'Materials / Stores / Purchase Lead',
    role: 'Primary User',
    stakeholderType: 'Primary User',
    coreQuestion:
      'Which exact Part IDs should I inspect first on the rack, and which purchase indents should I freeze immediately?',
    priorityOutcome:
      'Actionable SKU-by-SKU floor checklist separating excess stock from Item 07 critical CNC machine spares.',
    unspokenAnxiety:
      'Blind cost-cutting might scrap essential machine insurance spares or trigger false alerts.',
    riskMitigation:
      'Item 07 Reserve Spares protection locks critical CNC spares safely out of liquidation schedules.',
    keyMetrics: [
      'Part_ID Rank by Trapped ₹',
      'Reorder Freeze Watchlist (90–179d)',
      'Critical Spares Protected Count',
    ],
  },
  {
    id: 'evaluator',
    roleId: 'evaluator',
    title: 'Finance Controller / IT / CA Advisor',
    roleTitle: 'Finance Controller / IT / CA Advisor',
    role: 'Technical & Financial Evaluator',
    stakeholderType: 'Technical & Financial Evaluator',
    coreQuestion:
      'Can we audit the math deterministically and ensure sensitive supplier and pricing identities never leave our control?',
    priorityOutcome:
      '100% spreadsheet-auditable formulas with in-browser anonymization and cryptographic data purge proof.',
    unspokenAnxiety:
      'Uploading raw ERP dumps to external portals could expose vendor rates or fail statutory audit governance.',
    riskMitigation:
      'In-browser party stripper + zero-write read-only CSV intake + DELCERT-... cryptographic purge certificate.',
    keyMetrics: [
      '100% Deterministic Formula Parity',
      'Zero Vendor PII Transmission',
      '14-Day Auto-Purge + DELCERT Receipt',
    ],
  },
];

export interface ObjectionItem {
  id: string;
  objection: string;
  underlyingAnxiety: string;
  evidenceAndMechanism: string;
  institutionalGuarantee: string;
  verificationStep: string;
}

export const OBJECTION_MATRIX: ObjectionItem[] = [
  {
    id: 'erp_exists',
    objection: 'We already have Tally / SAP stock reports—why do we need this?',
    underlyingAnxiety:
      'Why add another system if our existing ERP already prints closing stock value?',
    evidenceAndMechanism:
      'Standard ERP reports list flat quantities without isolating 22% carrying burn, Pareto 80/20 concentration, Item 07 spares protection, or corridor freight overcharges.',
    institutionalGuarantee:
      'Runs strictly on top of your existing 5-column ERP export—zero replacement, zero migration.',
    verificationStep:
      'Load the 20-SKU Ambattur sample CSV in the browser sandbox above in 1 click.',
  },
  {
    id: 'data_privacy',
    objection: 'We cannot share confidential supplier names or customer rates externally.',
    underlyingAnxiety:
      'Vendor pricing and customer margins are commercially sensitive across competitive clusters.',
    evidenceAndMechanism:
      'Use our client-side privacy stripper to mask Part_Description, Party_Name, and Transporter fields inside your browser before uploading.',
    institutionalGuarantee:
      'Reviewed solely by founder C. Jones Snowin and auto-purged within 14 days with a DELCERT-... cryptographic deletion certificate.',
    verificationStep:
      'Inspect the CSV Anonymizer tool below to see party columns stripped locally.',
  },
  {
    id: 'team_bandwidth',
    objection: 'Our stores and accounts staff do not have spare hours for IT onboarding.',
    underlyingAnxiety:
      'Complex software rollouts stall halfway when stores teams are busy hitting dispatch targets.',
    evidenceAndMechanism:
      'Requires no IT ticket or database connector—just a single 5-column CSV export that maps Tally, SAP, and Busy headers automatically.',
    institutionalGuarantee:
      'From export to first executive summary takes under 5 minutes.',
    verificationStep:
      'Download our pre-formatted 5-Column CSV Template to preview the exact fields.',
  },
  {
    id: 'critical_spares',
    objection: 'Old spare parts on our racks are machine insurance spares, not waste.',
    underlyingAnxiety:
      'Automated aging rules might mistakenly flag vital CNC spindle bearings as dead stock.',
    evidenceAndMechanism:
      'Operationalyst enforces Item 07 Critical Machine Reserve classification, separating high-risk maintenance spares from liquidatable raw material or finished goods.',
    institutionalGuarantee:
      'Configurable cutoff thresholds (120d / 180d / 270d) and spares safety locks reviewed with your Plant Head.',
    verificationStep:
      'Review Item 07 Spares Shield in the 6-Stage Methodology breakdown.',
  },
  {
    id: 'dirty_erp_data',
    objection: 'Our stock register has messy dates, blank rows, or negative ERP balances.',
    underlyingAnxiety:
      'Dirty rows could skew audit totals or produce unreliable boardroom numbers.',
    evidenceAndMechanism:
      'Stage 02 Data Sanitization isolates every invalid date, blank Part_ID, or negative stock entry into an explicit Quarantine CSV rather than silently guessing defaults.',
    institutionalGuarantee:
      'Strict MatchHealth% reporting ensures finance signs off only on verified lines.',
    verificationStep:
      'Inspect Stage 02 Quarantine rules inside the Full Sample Report.',
  },
  {
    id: 'ca_alignment',
    objection: 'Our Chartered Accountant already conducts annual statutory stock audits.',
    underlyingAnxiety:
      'Avoid duplicating fees or creating friction with external statutory audit partners.',
    evidenceAndMechanism:
      'Operationalyst delivers the exact 6-sheet working papers, aging splits, and physical-vs-book bin schedules that CAs use to sign off inventory valuation faster.',
    institutionalGuarantee:
      'Includes an optional 20% CA & Stock Auditor Partner Desk with co-branded executive workbooks.',
    verificationStep:
      'Download or print the 2-Page Executive PDF Briefing to share with your CA.',
  },
];

export interface CustomerAnxiety {
  stage: string;
  unspokenAnxiety: string;
  institutionalSafeguard: string;
}

export const CUSTOMER_ANXIETY_MAP: CustomerAnxiety[] = [
  {
    stage: '1. Initial Evaluation',
    unspokenAnxiety: 'Will this require giving an external app access to our live Tally or SAP server?',
    institutionalSafeguard: '100% read-only offline 5-column CSV intake—zero ERP credentials ever requested.',
  },
  {
    stage: '2. Data Preparation & Masking',
    unspokenAnxiety: 'What if sensitive vendor names or customer pricing leak in transit?',
    institutionalSafeguard: 'Client-side browser masking strips all party identities before analysis.',
  },
  {
    stage: '3. 48-Hour Diagnostic Run',
    unspokenAnxiety: 'How do I know critical machine spares will not be mislabelled as scrap?',
    institutionalSafeguard: 'Deterministic Item 07 Reserve Spares protection plus quarantine isolation for dirty rows.',
  },
  {
    stage: '4. Findings Review',
    unspokenAnxiety: 'Will we get generic slides instead of concrete line-item SKU fixes?',
    institutionalSafeguard:
      'Direct line-item walkthrough reviewed personally by founder C. Jones Snowin with ranked SKU disposition actions.',
  },
  {
    stage: '5. Post-Review Data Governance',
    unspokenAnxiety: 'Will our uploaded inventory file linger indefinitely after the call?',
    institutionalSafeguard: 'Automatic 14-day purge or instant manual purge backed by a verifiable DELCERT-... certificate.',
  },
];

export interface IcebergDimension {
  id: string;
  num: string;
  name: string;
  title: string;
  description: string;
  metric: string;
  category: string;
  symptom: string;
  scope: string;
  underlyingCause: string;
  financialImpact: string;
  preventativeMechanism: string;
}

const RAW_ICEBERG_DIMENSIONS: Array<{
  num: string;
  name: string;
  category: string;
  scope: string;
  symptom: string;
  underlyingCause: string;
  financialImpact: string;
  preventativeMechanism: string;
  metric: string;
}> = [
  { num: '01', name: 'Loss Aversion Framing', category: 'Decision Science', scope: 'Quantifies active 22% carrying burn rather than vague upside promises.', symptom: 'Teams postpone stock cleanups because idle racks feel sunk cost.', underlyingCause: 'Losses loom larger than theoretical efficiency gains.', financialImpact: '₹4.9L+ annual OD interest drag per ₹22L dormant pile.', preventativeMechanism: 'Daily rupee carrying-burn visibility.', metric: '22% p.a. Burn Baseline' },
  { num: '02', name: 'Zero-Write ERP Isolation', category: 'Trust Architecture', scope: 'Read-only 5-column CSV workflow removes IT friction and data-loss fear.', symptom: 'IT blocks SaaS pilots requiring ERP database connectors.', underlyingCause: 'Status-quo bias protects production ERP stability.', financialImpact: '6-month delayed audit starts.', preventativeMechanism: 'Offline CSV/XLSX template intake.', metric: '0 ERP Write Permissions' },
  { num: '03', name: 'Pareto 80/20 Cognitive Offload', category: 'Cognitive Load', scope: 'Ranks top stagnant rupees first instead of dumping 12,000 unranked rows.', symptom: 'Stores teams freeze when handed massive ERP stock dumps.', underlyingCause: 'Choice overload stalls Monday action.', financialImpact: '80% of locked capital sits unaddressed.', preventativeMechanism: 'Descending rupee rank + top-18 priority cut.', metric: 'Top 20% = 76–80% Value' },
  { num: '04', name: 'Item 07 Reserve Spares Shield', category: 'Engineering Safety', scope: 'Protects insurance CNC spares from blind liquidation rules.', symptom: 'Plant Heads reject financial cleanups that endanger uptime.', underlyingCause: 'Blanket aging rules ignore critical maintenance spares.', financialImpact: 'Line stoppage risks up to ₹8,500/hr.', preventativeMechanism: 'Dedicated Item 07 reserve exclusion gate.', metric: '100% Critical Uptime Lock' },
  { num: '05', name: 'Client-Side PII Masking', category: 'Privacy Control', scope: 'Browser strips vendor and customer names before payload dispatch.', symptom: 'Owners hesitate to export ledgers with party rates.', underlyingCause: 'Fear of competitive price leakage.', financialImpact: 'Blocked external financial reviews.', preventativeMechanism: 'Local regex + SHA-256 hash masking.', metric: '0 Vendor Names Exposed' },
  { num: '06', name: 'Quarantine Isolation Invariant', category: 'Data Integrity', scope: 'Segregates null dates and negative stock cleanly without silent coercion.', symptom: 'Blank ERP rows silently corrupt pivot-table totals.', underlyingCause: 'Ad-hoc Excel fixes mask missing audit data.', financialImpact: 'Distorted boardroom working-capital counts.', preventativeMechanism: 'Explicit MatchHealth% & Quarantine CSV.', metric: 'Zero Silent Coercion' },
  { num: '07', name: 'Single-Page Executive Clarity', category: 'Hierarchy Design', scope: 'Leads with 4 headline KPIs before drilling into SKU tables.', symptom: 'CEOs skip 40-tab operational reports.', underlyingCause: 'Information density mismatches executive bandwidth.', financialImpact: 'Missed monthly capital reallocation windows.', preventativeMechanism: 'Headline KPI strip + plain-English sentence.', metric: '5-Second Comprehension' },
  { num: '08', name: 'Founder Direct Accountability', category: 'Mayer Trust Triad', scope: 'Every audit reviewed directly by C. Jones Snowin without junior handoffs.', symptom: 'SME founders distrust anonymous offshore ticket queues.', underlyingCause: 'Ability + Benevolence + Integrity trust requirements.', financialImpact: 'Low buyer confidence in automated tools.', preventativeMechanism: 'Direct founder desk + WhatsApp line.', metric: '48-Hr Founder SLA' },
  { num: '09', name: 'Cryptographic Deletion Proof', category: 'Governance', scope: '14-day automatic purge backed by verifiable DELCERT-... certificates.', symptom: 'Finance controllers demand written data destruction proof.', underlyingCause: 'Enterprise audit compliance policies.', financialImpact: 'Blocked pilot approvals by legal/finance.', preventativeMechanism: 'Multi-store purge sweep + DELCERT receipt.', metric: '14-Day Auto Purge' },
  { num: '10', name: 'Deterministic Formula Parity', category: 'Reproducibility', scope: '100% spreadsheet-verifiable equations with zero probabilistic hallucinations.', symptom: 'CFOs challenge black-box AI inventory estimates.', underlyingCause: 'Statutory audits demand exact line-item arithmetic.', financialImpact: 'Claims rejected during CA review.', preventativeMechanism: 'Published 6-stage formula specification.', metric: '100% Math Parity' },
  { num: '11', name: 'Contractual Guarantee Anchor', category: 'Risk Reversal', scope: '₹2,50,000 minimum leak discovery guarantee or 100% fee refund.', symptom: 'Upfront audit fees stall SME discretionary spend.', underlyingCause: 'Asymmetric downside risk for first-time buyers.', financialImpact: 'Unclaimed cash leaks persist quarter over quarter.', preventativeMechanism: 'Written refund covenant in diagnostic scope.', metric: '₹2.5L Leak Guarantee' },
  { num: '12', name: 'Free 3-SKU Diagnostic Entry', category: 'Foot-in-the-Door', scope: 'Prove real rupee traps on your own file at ₹0 before paying ₹14,999.', symptom: 'Cold buyers doubt generic industry benchmarks.', underlyingCause: 'High skepticism toward generic B2B ROI claims.', financialImpact: 'Slow enterprise sales cycles.', preventativeMechanism: 'Instant CSV sandbox + ₹0 Teaser Workspace.', metric: '₹0 Zero-Risk Entry' },
  { num: '13', name: 'Multi-Stakeholder Alignment', category: 'JTBD Architecture', scope: 'Prepares tailored metrics for Owner, Plant Head, Stores, and CA separately.', symptom: 'One skeptical department head vetoes cross-functional tools.', underlyingCause: 'Different jobs-to-be-done across factory seats.', financialImpact: 'Stalled cross-department sign-offs.', preventativeMechanism: '4-Role Lens switcher & shared workbook.', metric: '4 Plant Lenses Aligned' },
  { num: '14', name: 'Dual-Mode Sample Verification', category: 'Evidence Anchoring', scope: 'Compare 12,400-SKU plant scale alongside 20-SKU exact sandbox totals.', symptom: 'Buyers test if headline metrics reconcile to sample tables.', underlyingCause: 'Financial analysts spot mismatched numbers immediately.', financialImpact: 'Loss of credibility when numbers diverge.', preventativeMechanism: 'Engine-computed Mode A & Mode B reconciliation.', metric: '0 Reconciliation Drift' },
  { num: '15', name: 'Threshold Sensitivity Modeling', category: 'Scenario Control', scope: 'Toggle Strict CFO (120d) vs Standard (180d) vs Lenient (270d) cutoffs.', symptom: 'Departments argue over what qualifies as truly dead stock.', underlyingCause: 'Fixed thresholds feel arbitrary across product lines.', financialImpact: 'Analysis paralysis in review meetings.', preventativeMechanism: 'Live CFO policy slider + row reclassification.', metric: '3 Instant Policy Presets' },
  { num: '16', name: 'Gate OTIF Cross-Linkage', category: 'End-to-End Flow', scope: 'Connects dead stock capital traps with 50% dispatch gate OTIF bottlenecks.', symptom: 'High inventory coexist paradoxically with late customer deliveries.', underlyingCause: 'Working capital locked in wrong slow SKUs.', financialImpact: 'OEM line-stop penalties and lost share.', preventativeMechanism: 'P1 Dead Stock + P2 Dual-Gate OTIF linking.', metric: 'On-Time × In-Full Gate' },
  { num: '17', name: 'Corridor Freight Rate Card Check', category: 'Margin Protection', scope: 'Isolates carrier rate overcharges and unverified halting detention fees.', symptom: 'Transporter bills approved on trust without LR corridor audits.', underlyingCause: 'Manual accounts payable bill clearing.', financialImpact: '₹13.9K–₹1.5L+ monthly freight overpayment.', preventativeMechanism: 'P3 LR corridor rate + detention gate.', metric: '12-LR Baseline Verified' },
  { num: '18', name: 'Ghost Stock & Bin Variance Map', category: 'Stores Accuracy', scope: 'Exposes ERP-vs-rack mismatches causing phantom shortages.', symptom: 'Tally shows stock on hand while shop floor bin sits empty.', underlyingCause: 'Unposted floor issues and mixed rack storage.', financialImpact: '₹24,800+ immediate bin variance exposure.', preventativeMechanism: 'P4 bin accuracy + fast-mover hidden alerts.', metric: '60% Baseline Match Map' },
  { num: '19', name: 'Disposition Path Clarity', category: 'Execution Design', scope: 'Assigns Scrap vs Vendor Contra vs Re-machine vs Reorder Freeze per SKU.', symptom: 'Identified dead stock remains sitting for another 6 months.', underlyingCause: 'Lack of concrete liquidation playbook.', financialImpact: 'Zero realized cash recovery despite audits.', preventativeMechanism: 'Line-item CAPA disposition tracker.', metric: '4 Disposition Paths' },
  { num: '20', name: 'ECN Revision Trap Detection', category: 'Engineering Sync', scope: 'Flags old revision blanks still sitting idle after drawing upgrades.', symptom: 'Engineering updates CAD revisions without freezing old raw buys.', underlyingCause: 'Siloed QA ECN logs and stores replenishment.', financialImpact: 'Permanent obsolescence write-downs.', preventativeMechanism: 'Revision-linked aging velocity alerts.', metric: 'ECN Risk Flagged' },
  { num: '21', name: 'MOQ Over-Ordering Detector', category: 'Procurement Discipline', scope: 'Balances apparent 8% bulk discounts against 22% multi-year holding drain.', symptom: 'Buyers purchase 24-month supply for small unit price cuts.', underlyingCause: 'Procurement KPI rewards unit rate over cash cycle.', financialImpact: 'Net negative ROI after 6 months storage.', preventativeMechanism: 'Months-of-cover vs discount payback check.', metric: 'Holding vs Rebate Math' },
  { num: '22', name: 'CA-Ready Proforma & Udyam Flow', category: 'Commercial Trust', scope: 'Generates SAC 998311 B2B invoices with MSME Udyam registration.', symptom: 'Accounts payable stalls non-compliant vendor invoices.', underlyingCause: 'Missing statutory tax/MSME classifications.', financialImpact: 'Delayed procurement clearance.', preventativeMechanism: 'Auto INV-... Proforma + RCPT-... Paid Receipt.', metric: 'SAC 998311 Compliant' },
  { num: '23', name: 'Frictionless UPI / NEFT Settlement', category: 'Payment UX', scope: 'Scannable NPCI UPI QR code (9080540047@yespop) plus 12-digit UTR unlock.', symptom: 'Corporate card limits fail mid-checkout for SME owners.', underlyingCause: 'B2B SMEs prefer instant UPI or NEFT bank transfer.', financialImpact: 'Abandoned checkouts.', preventativeMechanism: 'Live NPCI SVG QR + instant UTR audit trail.', metric: '9080540047@yespop Direct' },
  { num: '24', name: 'Non-Coercive Teaser Transparency', category: 'Ethical Persuasion', scope: 'Zero fake urgency timers or inflated social proof—pure ledger math.', symptom: 'Manufacturing directors ignore hyped SaaS countdown banners.', underlyingCause: 'High B2B skepticism toward consumer marketing tactics.', financialImpact: 'Brand erosion in industrial clusters.', preventativeMechanism: 'Real sample math + transparent pricing FAQ.', metric: '0 Artificial Timers' },
  { num: '25', name: 'Header Alias Auto-Tolerance', category: 'Onboarding Ease', scope: 'Accepts MATNR, Stock Item Name, Qty On Hand, and VERPR automatically.', symptom: 'Every plant formats Excel column titles differently.', underlyingCause: 'Diverse ERP versions across clusters.', financialImpact: 'High CSV upload rejection frustration.', preventativeMechanism: 'Multi-ERP alias dictionary resolver.', metric: 'Tally / SAP / Busy Ready' },
  { num: '26', name: '15-Minute Calendar Lock (.ICS)', category: 'Commitment Ladder', scope: 'Lets buyers lock a 15-min review call via WhatsApp or .ICS download.', symptom: 'Unscheduled email leads go cold over 48 hours.', underlyingCause: 'Context switching between shop floor and inbox.', financialImpact: 'Drop-off between upload and review.', preventativeMechanism: 'Instant WhatsApp deep-link + .ICS invite.', metric: '15-Min Walkthrough Slot' },
  { num: '27', name: 'Verified Proof Hash Continuity', category: 'Audit Lineage', scope: 'Retains SHA-256 dataset prefix even after raw rows purge on day 14.', symptom: 'Clients want proof of past findings after raw data deletion.', underlyingCause: 'Tension between confidentiality purge and audit history.', financialImpact: 'Loss of historical baseline comparison.', preventativeMechanism: 'Pre-purge summary hash preservation.', metric: 'SHA-256 Lineage Lock' },
];

export const BEHAVIORAL_ICEBERG_DIMENSIONS: IcebergDimension[] = RAW_ICEBERG_DIMENSIONS.map(
  (d, idx) => ({
    id: `iceberg_${idx + 1}`,
    num: d.num,
    name: d.name,
    title: d.name,
    description: d.scope,
    metric: d.metric,
    category: d.category,
    symptom: d.symptom,
    scope: d.scope,
    underlyingCause: d.underlyingCause,
    financialImpact: d.financialImpact,
    preventativeMechanism: d.preventativeMechanism,
  })
);

export type SampleAuditModeId = 'sandbox_20' | 'illustrative_12400';

export interface ReconciledSampleAuditModeView {
  modeId: SampleAuditModeId;
  shortLabel: string;
  badge: string;
  companyName: string;
  plantLocation: string;
  totalBookValueFormatted: string;
  skusEvaluatedText: string;
  skusEvaluatedSubtext: string;
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
}

export function getReconciledSampleAuditModes(): Record<
  SampleAuditModeId,
  ReconciledSampleAuditModeView
> {
  const live = getLiveSandboxReconciledModeMetrics();
  const ill = ILLUSTRATIVE_12400_CASE_METRICS;

  return {
    illustrative_12400: {
      modeId: 'illustrative_12400',
      shortLabel: 'Mode A: 12,400-SKU Plant Case (Mid-Sized Auto-Component Plant)',
      badge: ill.modeBadge,
      companyName: ill.companyName,
      plantLocation: ill.plantLocation,
      totalBookValueFormatted: ill.inventoryAnalysedFormatted,
      skusEvaluatedText: ill.skusEvaluatedFormatted,
      skusEvaluatedSubtext: ill.skusEvaluatedSubtext,
      deadStockValueFormatted: ill.nonMovingFormatted,
      deadStockSubtext: ill.nonMovingSubtext,
      slowMovingValueFormatted: ill.slowMovingFormatted,
      slowMovingSubtext: ill.slowMovingSubtext,
      prioritySkusHeadline: ill.priorityItemsFormatted,
      prioritySkusSubtext: ill.priorityItemsSubtext,
      topCategoryName: ill.highestValueCategory,
      topCategorySubtext: ill.highestValueCategorySubtext,
      p2OtifPill: ill.connectedP2Pill,
      p3FreightPill: ill.connectedP3Pill,
      p4BinPill: ill.connectedP4Pill,
    },
    sandbox_20: {
      modeId: 'sandbox_20',
      shortLabel: 'Mode B: 20-SKU Sandbox (Live P1–P4 Engine Dataset)',
      badge: live.modeBadge,
      companyName: live.companyName,
      plantLocation: live.plantLocation,
      totalBookValueFormatted: live.inventoryAnalysedFormatted,
      skusEvaluatedText: live.skusEvaluatedFormatted,
      skusEvaluatedSubtext: live.skusEvaluatedSubtext,
      deadStockValueFormatted: live.nonMovingFormatted,
      deadStockSubtext: live.nonMovingSubtext.replace(/•/g, '·'),
      slowMovingValueFormatted: live.slowMovingFormatted,
      slowMovingSubtext: live.slowMovingSubtext.replace(/•/g, '·'),
      prioritySkusHeadline: '10 Priority SKUs',
      prioritySkusSubtext: live.priorityItemsSubtext,
      topCategoryName: 'Finished Goods',
      topCategorySubtext: live.highestValueCategorySubtext,
      p2OtifPill: live.connectedP2Pill,
      p3FreightPill: live.connectedP3Pill,
      p4BinPill: live.connectedP4Pill,
    },
  };
}

export const FOUNDER_EXECUTIVE_SIGNOFF =
  'Operationalyst isolates stagnant working capital, 22% annual carrying-cost burn, and Pareto 80/20 floor review priorities directly from standard 5-column Tally Prime, SAP, Busy, or Excel stock exports—with zero ERP integration or operational disruption.';

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
    name: 'Free 3-SKU Diagnostic Teaser',
    badge: '₹0 Instant Browser & Teaser',
    price: '₹0',
    period: 'Free Entry',
    description:
      'Instant in-browser 5-column CSV check + official executive exposure workspace preview.',
    features: [
      '100% In-browser processing (zero data leaves device)',
      'Instant non-moving (>180d) & 22% burn calculation',
      'Top 3 flagged SKUs revealed with disposition actions',
      'Blank 5-column CSV & 5-Sheet XLSX Data Kit included',
    ],
    ctaText: 'Run Free CSV Sandbox',
  },
  {
    id: 'tier_18k_diagnostic',
    name: 'Full 4-Pillar Line-Item Unlock',
    badge: '₹2,50,000 Leak Discovery Guarantee',
    price: '₹14,999',
    period: 'one-time unlock',
    description:
      'Complete line-by-line 4-Pillar audit unlock, 6-sheet Excel workbook, and direct 48-Hr Founder Walkthrough.',
    guarantee: '100% Money-Back Refund if < ₹2,50,000 identified',
    features: [
      'Full 5-column ERP ledger teardown & Pareto hitlist',
      'P2 Gate OTIF, P3 Freight & P4 Bin Variance reconciliation',
      'SAC 998311 B2B Proforma & Official Paid Receipt',
      'Direct walkthrough with Founder C. Jones Snowin',
      '14-Day Auto Purge + DELCERT Cryptographic Certificate',
    ],
    ctaText: 'Request 48-Hr Pilot Audit',
    popular: true,
  },
  {
    id: 'tier_15k_watchdog',
    name: 'Monthly ERP Watchdog Retainer',
    badge: 'Continuous Drift Protection',
    price: '₹24,999',
    period: 'per month',
    description:
      'Recurring fortnightly 4-pillar variance audits, new slow-mover alerts, and transporter rate-card enforcement.',
    features: [
      'Fortnightly automated CSV variance audit runs',
      'Real-time slow-mover & reorder freeze alerts',
      'Transporter corridor overcharge & detention watchdog',
      'Multi-plant comparison across SIPCOT & Ambattur units',
      'Dedicated SLA desk & CA working-paper pack',
    ],
    ctaText: 'Deploy Monthly Watchdog',
  },
  {
    id: 'tier_ca_partner',
    name: '20% CA & Stock Auditor Partner Desk',
    badge: 'Chartered Accountant Workbench',
    price: '20% Share',
    description:
      'Revenue share & co-branded working-paper workbench for Chartered Accountants and industrial audit firms.',
    features: [
      '20% Revenue share on referred plant diagnostics',
      'Co-branded executive audit workbooks & dossiers',
      'Item 07 & MatchHealth% audit trail documentation',
      'Priority 24-hour review support desk',
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
