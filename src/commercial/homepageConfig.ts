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

export const PROBLEM_QUESTIONS = [
  {
    num: '01',
    label: 'STAGNANCY',
    question: 'Which SKUs have not moved?',
    description:
      'Items sitting on warehouse racks with zero consumption across multiple months or quarters, continuing to occupy physical footprint unnoticed.',
  },
  {
    num: '02',
    label: 'AGEING VELOCITY',
    question: 'How long have they been inactive?',
    description:
      'Tracking 90, 180, and 365+ day aging thresholds before items deteriorate, rust, or turn into irreversible scrap write-downs.',
  },
  {
    num: '03',
    label: 'VALUE CONCENTRATION',
    question: 'Where is inventory value concentrated?',
    description:
      'The Pareto 80/20 distribution showing which handful of high-value parts lock up the majority of idle working capital.',
  },
  {
    num: '04',
    label: 'PRIORITY RANKING',
    question: 'Which items should be investigated first?',
    description:
      'Clear priority ranking so procurement, stores, and plant heads focus on high-impact review rather than chasing low-value items.',
  },
];

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Export',
    detail: 'Start with an approved inventory or ERP export.',
    context: 'Standard Excel, CSV, or Tally stock dump.',
  },
  {
    step: '02',
    title: 'Validate',
    detail: 'Review data structure, required fields, completeness and agreed definitions.',
    context: 'In-memory ingestion check before any analysis.',
  },
  {
    step: '03',
    title: 'Analyse',
    detail: 'Classify relevant movement, ageing, value concentration and inventory patterns.',
    context: 'Automated velocity algorithms and Pareto isolation.',
  },
  {
    step: '04',
    title: 'Prioritise',
    detail: 'Highlight SKUs and categories that require operational investigation.',
    context: 'Clear high-risk part list for floor action.',
  },
  {
    step: '05',
    title: 'Review',
    detail: 'Discuss findings, limitations and next actions in a structured review.',
    context: '1-on-1 findings session directly with the founder.',
  },
];

export const AUDIT_DELIVERABLES = [
  {
    title: 'Data-Quality Overview',
    description: 'Validation of row counts, date formats, null values, and ingestion health before evaluation.',
  },
  {
    title: 'Non-Moving Stock Classification',
    description: 'Systematic isolation of items with zero issue or consumption records over the agreed review period.',
  },
  {
    title: 'Slow-Moving Inventory Analysis',
    description: 'Velocity tracking for items rotating below operational lead-time thresholds.',
  },
  {
    title: 'Inventory Ageing Review',
    description: 'Structured brackets (0–90d, 91–180d, 181–365d, >365d) mapped against carrying cost rates.',
  },
  {
    title: 'High-Value Exposure Analysis',
    description: 'Pareto 80/20 distribution identifying which high-value parts carry the most dormant capital.',
  },
  {
    title: 'Priority SKU & Category List',
    description: 'Exportable SKU list with part numbers, bin locations, and flagged review urgency.',
  },
  {
    title: 'Documented Assumptions & Limitations',
    description: 'Explicit notation of data boundaries, machine reserve spares exclusions, and scope constraints.',
  },
  {
    title: 'Executive Findings Summary',
    description: 'A 2-page management briefing prepared for plant head, CFO, and owner standup meetings.',
  },
  {
    title: 'Findings Review Call',
    description: '30-minute direct consultation with founder Jonez Snowin to walk through the findings structure.',
  },
];

export const METHODOLOGY_STAGES = [
  {
    stage: 'Stage 01',
    name: 'Input Validation',
    summary: 'Checking column headers, numerical consistency, date timestamps, and missing fields.',
  },
  {
    stage: 'Stage 02',
    name: 'Definition Agreement',
    summary: 'Aligning on specific plant thresholds for "dead stock" (>180 days default) and reserve buffer stock.',
  },
  {
    stage: 'Stage 03',
    name: 'Movement Classification',
    summary: 'Calculating days elapsed since last factory issue or transaction (ΔDays = Today − DateOfLastMovement).',
  },
  {
    stage: 'Stage 04',
    name: 'Ageing & Value Analysis',
    summary: 'Multiplying inactive quantities by unit valuation to determine total rupee exposure by category.',
  },
  {
    stage: 'Stage 05',
    name: 'Priority Classification',
    summary: 'Ranking inactive SKUs by financial impact to deliver an actionable top-15 floor investigation list.',
  },
  {
    stage: 'Stage 06',
    name: 'Executive Review',
    summary: 'Synthesizing observations into a structured executive report highlighting clear discussion points.',
  },
];

export const DATA_TRUST_ITEMS = [
  {
    question: 'What information is required?',
    answer:
      'An initial review only requires 5 standard inventory fields: Part Identifier, Description, Quantity on Hand, Unit Valuation/Rate, and Date of Last Movement (or Issue).',
  },
  {
    question: 'Which fields can be removed or anonymised?',
    answer:
      'You are encouraged to redact or remove supplier names, customer accounts, proprietary internal drawing codes, and specific plant identifiers before upload.',
  },
  {
    question: 'Who can access submitted information?',
    answer:
      'Only founder Jonez Snowin accesses submitted information during manual audit analysis. No third-party contractors or external data brokers have access.',
  },
  {
    question: 'How is information processed?',
    answer:
      'Analysis is performed in isolated browser and analytical sessions. No customer inventory records are used to train external public language models.',
  },
  {
    question: 'How long is information retained?',
    answer:
      'Pilot review files are retained strictly for the duration of the audit discussion and analysis period (maximum 14 days), after which files are permanently purged. (Policy details pending final implementation for self-serve cloud storage).',
  },
  {
    question: 'How can deletion be requested?',
    answer:
      'You can request immediate manual deletion at any time by emailing joneszz2004@gmail.com with your company reference. Deletion is completed within 24 hours.',
  },
  {
    question: 'What can and cannot be concluded?',
    answer:
      'The audit identifies statistical patterns and dormancy flags in the supplied data. It cannot make final scrap decisions, confirm physical bin integrity without a count, or replace plant engineering judgment regarding insurance spares.',
  },
];

export const FAQ_ITEMS = [
  {
    q: 'Is Operationalyst replacing our ERP?',
    a: 'No. Operationalyst is an analytical review layer that reads standard exports from Tally, SAP, Busy, or Excel. It requires zero IT integration or infrastructure replacement.',
  },
  {
    q: 'Which files are suitable for an initial audit?',
    a: 'Standard .xlsx, .xls, or .csv stock ledger dumps, Tally closing inventory reports, or warehouse movement spreadsheets.',
  },
  {
    q: 'Which data fields are normally required?',
    a: 'Part code/number, description, quantity on hand, unit rate/cost, and last transaction/movement date.',
  },
  {
    q: 'Can fields be anonymised?',
    a: 'Yes. You can mask part descriptions, delete vendor codes, and redact commercial account names prior to submission.',
  },
  {
    q: 'How is non-moving inventory defined?',
    a: 'The default analytical threshold is 180 consecutive days with zero consumption or issue from stores. This threshold can be calibrated to your industry lead times.',
  },
  {
    q: 'Does the audit guarantee financial recovery?',
    a: 'No. The audit identifies where inventory value has stopped moving. Actual recovery depends on vendor return agreements, alternative BOM substitutions, and salvage liquidation terms.',
  },
  {
    q: 'How long does an audit take?',
    a: 'Once approved data is confirmed, an initial findings summary is typically completed within 48 to 72 hours for scheduling a 30-minute review call.',
  },
  {
    q: 'What happens after the findings review?',
    a: 'You receive the structured report for internal discussions. There is no automatic commitment, no recurring software charge, and no obligation to proceed further.',
  },
  {
    q: 'Is the pilot free or paid?',
    a: 'Founder-led pilot audits are currently conducted on a collaborative validation basis with a limited number of manufacturing teams at zero upfront software cost. To be confirmed before public commercial launch for subsequent tiers.',
  },
  {
    q: 'How is submitted data handled?',
    a: 'Files are processed in an isolated analytical environment solely for producing your audit deliverable and are permanently deleted after review. Policy details pending final public implementation.',
  },
];

// ============================================================================
// BEHAVIORAL ECONOMICS & B2B BUYING PSYCHOLOGY DATA STRUCTURES
// ============================================================================

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
    priorityOutcome: 'Release locked working capital, reduce annual 18–24% inventory carrying cost burn, and establish financial visibility across manufacturing plants.',
    unspokenAnxiety: 'Will this require capital expenditure, create consultant dependency, or yield numbers my plant heads will dispute?',
    riskMitigation: 'Collaborative pilot audit at zero upfront software cost. Calculations are 100% explainable and traceable directly to your own accounting ledger.',
    keyMetrics: ['₹ Trapped Capital (>180d)', 'Annual Carrying Cost Burn', 'Net Working Capital Days'],
  },
  {
    id: 'champion',
    roleTitle: 'Head of Operations / Plant Manager',
    stakeholderType: 'Internal Champion',
    coreQuestion: 'How do I stop stockout firefighting, clear warehouse congestion, and walk into monthly reviews with verified answers?',
    priorityOutcome: 'Protect dispatch schedules (OTIF), isolate obsolete parts taking up physical racking, and align stores and procurement on a single priority list.',
    unspokenAnxiety: 'Will this expose past procurement errors or make my production superintendents look negligent?',
    riskMitigation: 'Findings focus on stock velocity and operational system gaps, explicitly respecting safety buffers and critical machine spares.',
    keyMetrics: ['Top 15 Priority SKUs', 'Rack Space Reclaimable', 'Lead-Time Velocity Deceleration'],
  },
  {
    id: 'user',
    roleTitle: 'Stores In-Charge / Inventory Controller',
    stakeholderType: 'Primary User',
    coreQuestion: 'How can I stop spending 15 hours each month manually wrangling messy Excel VLOOKUPs that break?',
    priorityOutcome: 'Automated 90/180/365-day aging segmentation, automated Pareto classification, and exportable action lists ready for physical bin verification.',
    unspokenAnxiety: 'Will this add yet another complicated software tool to my daily workload that I have to keep updated?',
    riskMitigation: 'Zero daily data entry required. Operationalyst reads the standard Excel or Tally export you already generate.',
    keyMetrics: ['Hours Saved per Month', 'Active vs Dormant SKU Ratio', 'Physical Audit Discrepancy Rate'],
  },
  {
    id: 'evaluator',
    roleTitle: 'IT Head / Systems Administrator',
    stakeholderType: 'Technical Evaluator / Blocker',
    coreQuestion: 'Will this demand invasive ERP schema alterations, API connectors, or create enterprise security vulnerabilities?',
    priorityOutcome: 'Strict operational security, zero invasive database hooks, zero server maintenance tickets, and complete compliance with data governance policies.',
    unspokenAnxiety: 'Will an unvetted vendor breach data security, expose customer pricing, or demand continuous IT support tickets?',
    riskMitigation: 'Operates entirely on standard offline exported spreadsheets. Requires zero API tokens, zero database credentials, and zero installed agent binaries.',
    keyMetrics: ['0 Lines of Invasive Code', '0 ERP Schema Alterations', '100% Offline Dump Compatibility'],
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
    objection: '“We already run an ERP (SAP, Tally, Busy). Why do we need this?”',
    underlyingAnxiety: 'Fear of purchasing redundant software and feeling that current IT investments should have solved this.',
    evidenceAndMechanism: 'ERPs are transactional ledgers: they record that a transaction happened. They do not algorithmically diagnose velocity stagnation, calculate holding burn, or isolate the Pareto 80/20 critical review list.',
    institutionalGuarantee: 'Operationalyst does not replace your ERP; it acts as an analytical lens on top of it. It requires zero ERP modifications or migrations.',
    verificationStep: 'Compare your ERP closing stock report side-by-side with our structured velocity breakdown in the Sample Audit report.',
  },
  {
    id: 'excel_does_this',
    objection: '“Our team already manages inventory with Microsoft Excel.”',
    underlyingAnxiety: 'Reluctance to change established habits and assumption that internal spreadsheets are sufficient.',
    evidenceAndMechanism: 'Excel reports are manually generated, prone to formula corruption across multi-thousand row sheets, and rarely compute velocity decay curves across 90/180/365d brackets consistently.',
    institutionalGuarantee: 'You do not abandon Excel. You simply export your standard sheet and run it through Operationalyst to instantly reveal what manual formulas miss.',
    verificationStep: 'Take 5 minutes to run your existing Excel stock sheet through the in-browser smart mapper without saving any data.',
  },
  {
    id: 'data_confidentiality',
    objection: '“We cannot share sensitive factory records or proprietary customer data.”',
    underlyingAnxiety: 'Deep risk aversion regarding competitor intelligence leaks, supplier pricing disclosure, or security compliance breaches.',
    evidenceAndMechanism: 'Operationalyst requires only 5 neutral inventory fields (Part ID, Description, Qty on Hand, Unit Rate, Last Movement Date). It never requires customer names, profit margins, or proprietary drawings.',
    institutionalGuarantee: 'Full anonymization supported. Mask part numbers and redact vendor codes before submission. Isolated analytical session with permanent 14-day deletion.',
    verificationStep: 'Review our explicit 7 Data & Trust Disclosures or execute a standard bilateral NDA prior to sharing any file.',
  },
  {
    id: 'team_blame',
    objection: '“What if our team feels audited, micromanaged, or blamed for excess stock?”',
    underlyingAnxiety: 'Internal political risk: department heads worry findings will trigger conflict between sales, procurement, and stores.',
    evidenceAndMechanism: 'Excess stock in manufacturing is almost always systemic (minimum order quantities, BOM revisions, customer forecast shifts)—rarely individual negligence.',
    institutionalGuarantee: 'Every audit report includes an explicit "Documented Assumptions & Engineering Spares Exclusion" section to protect legitimate safety stock from unfair critique.',
    verificationStep: 'Review the sample audit limitations section to see how operational judgment and insurance spares are treated with respect.',
  },
  {
    id: 'data_accuracy',
    objection: '“Our stock records have dirty dates and incomplete movement logs.”',
    underlyingAnxiety: 'Fear of looking disorganized or investing time in an audit that will produce garbage-in, garbage-out conclusions.',
    evidenceAndMechanism: 'Every audit starts with Stage 1 (Input Validation & Data Health). We identify missing timestamps, negative balances, and null values before analysis begins.',
    institutionalGuarantee: 'If your data quality is too degraded to yield actionable findings, we state this upfront during Stage 2 with zero false conclusions.',
    verificationStep: 'Take our 5-question Self-Assessment to gauge your current inventory record readiness before requesting an audit.',
  },
  {
    id: 'lock_in',
    objection: '“What happens after the audit? Are we locked into an expensive contract?”',
    underlyingAnxiety: 'Sunk-cost and commitment fear: fear of bait-and-switch SaaS pricing or endless consultant billing.',
    evidenceAndMechanism: 'The pilot audit is a discrete, founder-led diagnostic deliverable designed to validate real manufacturing value.',
    institutionalGuarantee: 'You receive the executive PDF summary and Excel action list. It is yours to keep and execute internally. Zero auto-billing, zero forced subscription.',
    verificationStep: 'Apply for the Founder-Led Pilot; review scope is agreed in writing beforehand.',
  },
];

export interface CustomerAnxietyStage {
  stage: string;
  touchpoint: string;
  unspokenAnxiety: string;
  institutionalSafeguard: string;
  behavioralMechanism: string;
}

export const CUSTOMER_ANXIETY_MAP: CustomerAnxietyStage[] = [
  {
    stage: '1. First Visit',
    touchpoint: 'Commercial Landing Page',
    unspokenAnxiety: '“Is this real software, or another over-hyped tech landing page making exaggerated claims?”',
    institutionalSafeguard: 'Zero fake testimonials, zero invented customer logos, zero countdown timers. Explicit watermark on all sample reports.',
    behavioralMechanism: 'Credibility signaling via specificity and epistemic honesty.',
  },
  {
    stage: '2. Diagnostic',
    touchpoint: '5-Question Self-Assessment',
    unspokenAnxiety: '“Will answering this force me to provide my email and get spammed by sales reps?”',
    institutionalSafeguard: 'Zero login or contact details required. Results compute transparently in-browser.',
    behavioralMechanism: 'Reciprocity and low-friction self-diagnosis before commitment.',
  },
  {
    stage: '3. Data Request',
    touchpoint: 'Pilot Application Modal',
    unspokenAnxiety: '“Will our proprietary numbers be shared, leaked, or used to train third-party AI models?”',
    institutionalSafeguard: 'Column minimization (5 fields only), anonymization permitted, bilateral NDA available, isolated processing sessions.',
    behavioralMechanism: 'Risk reversal and psychological safety.',
  },
  {
    stage: '4. Findings Review',
    touchpoint: '30-Minute Executive Call',
    unspokenAnxiety: '“Will this be a high-pressure sales pitch disguised as a consulting review?”',
    institutionalSafeguard: 'Conducted directly by founder Jonez Snowin. Focused strictly on findings, data limitations, and floor priorities.',
    behavioralMechanism: 'Benevolence and authority over salesmanship.',
  },
  {
    stage: '5. Post-Audit',
    touchpoint: 'Deliverable Handover',
    unspokenAnxiety: '“Are we pressured to purchase immediately or lose access to our findings?”',
    institutionalSafeguard: 'The executive briefing and SKU action lists are yours permanently. Data purged within 14 days unless retention is explicitly requested.',
    behavioralMechanism: 'Autonomy and commitment consistency.',
  },
];

export const BEHAVIORAL_ICEBERG_DIMENSIONS = [
  { num: '01', name: 'Behavioral Economics', scope: 'Prospect theory, loss aversion, status quo bias, mental accounting, sunk-cost inertia.' },
  { num: '02', name: 'Cognitive Biases', scope: 'Anchoring, confirmation bias, default effect, negativity bias, zero-risk preference.' },
  { num: '03', name: 'Choice Architecture', scope: 'Strict sequencing: Problem ➔ Sample ➔ Trust ➔ Pilot. 2-CTA max, progressive disclosure.' },
  { num: '04', name: 'Cognitive Load Theory', scope: 'Information chunking, recognition over recall, visual noise reduction, low working-memory strain.' },
  { num: '05', name: 'Attention Psychology', scope: 'Visual salience, 3-second comprehension, serial-position effects, contrast hierarchy.' },
  { num: '06', name: 'Gestalt Perception', scope: 'Proximity, symmetry, common region, figure-ground clarity across analytical cards.' },
  { num: '07', name: 'Behavioral UX', scope: 'Hick’s Law, Fitts’s Law, interaction cost minimization, predictable feedback loops.' },
  { num: '08', name: 'Trust Psychology', scope: 'Mayer’s triad: Ability (competence), Integrity (honesty), Benevolence (genuine helpfulness).' },
  { num: '09', name: 'Risk Psychology', scope: 'Systematic reduction of financial, career, operational, security, and switching risks.' },
  { num: '10', name: 'Motivation Systems', scope: 'Goal-gradient effect, self-determination theory, competence and autonomy reinforcement.' },
  { num: '11', name: 'Fogg Behavior Model', scope: 'Behavior = Motivation × Ability × Prompt. Lowering friction so ability meets motivation.' },
  { num: '12', name: 'COM-B Model', scope: 'Capability (simple exports), Opportunity (offline data), Motivation (trapped capital recovery).' },
  { num: '13', name: 'EAST Framework', scope: 'Easy (5 fields), Attractive (clear value), Social (verified proof registry), Timely (review season).' },
  { num: '14', name: 'Jobs To Be Done (JTBD)', scope: 'Job: “Help me know where inventory attention should go before quarterly executive review.”' },
  { num: '15', name: 'B2B Buying Psychology', scope: 'Multi-stakeholder lenses: Economic Buyer vs Champion vs User vs Technical Evaluator.' },
  { num: '16', name: 'Organizational Buying', scope: 'Consensus building, procurement friction reduction, internal champion enablement.' },
  { num: '17', name: 'Pricing Psychology', scope: 'Cost-of-inaction framing, reference pricing, zero upfront pilot friction.' },
  { num: '18', name: 'Behavioral CRO', scope: 'Live telemetry, micro-conversion funnel analysis, empirical hypothesis testing.' },
  { num: '19', name: 'Customer Research (VOC)', scope: 'Mom Test interview patterns, objection mining, real factory operational language.' },
  { num: '20', name: 'Neuromarketing Guardrails', scope: 'Ethical boundary: Rejecting deceptive pseudoscience in favor of cognitive fluency.' },
  { num: '21', name: 'Behavioral Segmentation', scope: 'Unaware ➔ Problem Aware ➔ Solution Aware ➔ Product Aware ➔ Ready.' },
  { num: '22', name: 'Message-Market Fit', scope: 'Testing 3 distinct narratives: Capital (Money), Velocity (Risk), Clarity (Control).' },
  { num: '23', name: 'Objection Engineering', scope: 'Systematic database: Evidence ➔ Explanation ➔ Risk Reduction ➔ Verification.' },
  { num: '24', name: 'Customer Anxiety Mapping', scope: 'Addressing unspoken fears at each touchpoint with institutional safeguards.' },
  { num: '25', name: 'Value Perception', scope: 'High-specificity framing turning raw ledger rows into board-level strategic intelligence.' },
  { num: '26', name: 'Information Architecture', scope: 'Decoupled showroom from industrial cockpit; structured progressive navigation.' },
  { num: '27', name: 'Emotional Design', scope: 'Target emotion: Relieved competence and clarity (“Finally, I know what needs attention”).' },
];

