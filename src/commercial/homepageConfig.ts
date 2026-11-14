Ximport { NavLink, HeroContent, ValueProposition, StakeholderPerspective, CommercialTier, TenTeamOperatingSystem, FAQItem } from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Overview', href: '#overview' },
  { label: 'Value Proof', href: '#value-proof' },
  { label: 'Stakeholders', href: '#stakeholders' },
  { label: 'Tiers & Pricing', href: '#tiers' },
  { label: '10-Team OS', href: '#operating-system' },
  { label: 'FAQ', href: '#faq' },
];

export const HERO_CONTENT: HeroContent = {
  badge: '48-Hour Factory Diagnostic Audit',
  headline: 'Zero-Risk Working Capital Diagnostic for Manufacturing Leadership',
  subheadline: 'Expose ₹5L to ₹50L+ in stagnant inventory, unbilled freight, and bin-level shrinkage from standard 5-column ERP exports—in 48 hours with a 100% money-back guarantee.',
  primaryCtaText: 'Upload 5-Column CSV (Free Diagnostic Teaser)',
  primaryCtaHref: '#upload',
  secondaryCtaText: 'View Commercial Tiers',
  secondaryCtaHref: '#tiers',
  guaranteeText: '100% Refund Guarantee: If we find less than ₹2,50,000 in recoverable working capital leaks, your audit is free.',
};

export const VALUE_PROPOSITIONS: ValueProposition[] = [
  {
    title: '48-Hour Actionable Diagnostic',
    description: 'Transform raw, messy ERP inventory dumps into immediate working capital recovery plans within 2 business days.',
    icon: 'Clock',
  },
  {
    title: '100% Money-Back Guarantee',
    description: 'Full audit fee refund if identified recoverable stagnant, freight, or bin leaks total under ₹2,50,000.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Zero ERP/IT Integration Required',
    description: 'No software installation, API connectors, or IT security approvals needed. Works directly from 5-column CSV exports.',
    icon: 'Database',
  },
  {
    title: 'Multi-Plant Working Capital OS',
    description: 'Unified diagnostic architecture designed to scale across single units, multi-plant operations, and enterprise groups.',
    icon: 'Layers',
  },
];

export const STAKEHOLDER_PERSPECTIVES: StakeholderPerspective[] = [
  {
    id: 'economic_buyer',
    roleTitle: 'Owner / Managing Director / CFO',
    stakeholderType: 'Economic Buyer',
    coreQuestion: 'How much working capital is needlessly trapped in our warehouse, and what does it cost to do nothing?',
    priorityOutcome: 'Release locked working capital, reduce annual 18-24% inventory carrying cost burn, and establish capital discipline.',
    unspokenAnxiety: 'Will this require capital expenditure, create consultant dependency, or yield numbers my plant teams ignore?',
    riskMitigation: 'Fixed ₹18,000 (+ 18% GST) 48-hour diagnostic backed by a 100% refund guarantee if <₹2,50,000 in recoverable leaks is found, with zero ERP capex and zero forced subscription lock-in.',
    keyMetrics: ['₹ Trapped Capital (>180d)', 'Annual Carrying Cost Burn', 'Net Working Capital Days'],
  },
  {
    id: 'technical_buyer',
    roleTitle: 'VP / GM Operations & Supply Chain Head',
    stakeholderType: 'Technical Buyer',
    coreQuestion: 'How reliable is this classification logic, and will it integrate with our existing SAP/Tally/ERP workflows?',
    priorityOutcome: 'Identify specific SKU-level slow-movers, eliminate stockouts of critical A-class items, and standardize safety stock math.',
    unspokenAnxiety: 'Will this expose operational flaws to the board or add duplicate reporting overhead for my store managers?',
    riskMitigation: 'Non-invasive 5-column CSV intake; generates actionable XLSX execution sheets matching existing store dispatch codes.',
    keyMetrics: ['Dead Stock %', 'Inventory Turnover Ratio', 'Stockout Exposure Index'],
  },
  {
    id: 'user_buyer',
    roleTitle: 'Store Manager / Inventory Accountant / Dispatch Lead',
    stakeholderType: 'User Buyer',
    coreQuestion: 'Will this make my daily stock audits faster, or will I be stuck manually fixing broken spreadsheets?',
    priorityOutcome: 'Clear out obsolete bin locations, resolve physical vs system inventory discrepancies, and stop fire-fighting.',
    unspokenAnxiety: 'Is this audit designed to assign blame for historical variances or penalize my team?',
    riskMitigation: 'Pre-formatted bin-location audit templates and step-by-step resolution playbooks designed for operational clarity.',
    keyMetrics: ['Bin Audit Variance Rate', 'Slow-Moving SKU Count', 'Dispatch Cycle Time'],
  },
];

export const COMMERCIAL_TIERS: CommercialTier[] = [
  {
    id: 'free_sandbox',
    name: 'Free Diagnostic Teaser',
    badge: '100% Free - Zero Sign-Up',
    pricing: '₹0',
    billingFrequency: 'Instant In-Browser',
    targetAudience: 'Plant Managers & Controllers evaluating data readiness',
    highlights: [
      'Instant in-browser 5-column CSV processing',
      '3-SKU detailed diagnostic teaser sample',
      'Executive Exposure Summary dashboard',
      'Data anonymization & zero cloud persistence',
    ],
    ctaText: 'Launch Free Sandbox',
    ctaHref: '#upload',
    isPopular: false,
  },
  {
    id: 'factory_diagnostic',
    name: 'Factory Diagnostic Audit',
    badge: '100% Money-Back Guarantee',
    pricing: '₹18,000',
    gstNote: '+ 18% GST (One-time)',
    billingFrequency: 'Per Plant Audit',
    targetAudience: 'Single-plant manufacturing units looking for rapid working capital recovery',
    highlights: [
      'Full-plant SKU classification (Stagnant, Slow, Active)',
      'Freight & bin-level shrinkage leak exposure',
      '6-Sheet Excel Action Workbook with recovery targets',
      '48-hour delivery guaranteed',
      '30-minute Founder-led diagnostic review call',
      '100% Refund if identified leaks are <₹2,50,000',
    ],
    ctaText: 'Schedule 48-Hr Audit',
    ctaHref: '#schedule',
    isPopular: true,
  },
  {
    id: 'monthly_watchdog',
    name: 'Monthly Watchdog Retainer',
    badge: 'Continuous Protection',
    pricing: '₹15,000',
    gstNote: '+ 18% GST / month',
    billingFrequency: 'Billed Monthly (Cancel Anytime)',
    targetAudience: 'Multi-plant enterprises requiring ongoing inventory drift monitoring',
    highlights: [
      'Monthly re-diagnostic of inventory & freight data',
      'Drift alert reports for newly stagnating SKUs',
      'Quarterly executive working capital review call',
      'Priority support & custom ERP export templates',
      'Zero long-term contract or lock-in',
    ],
    ctaText: 'Add Monthly Retainer',
    ctaHref: '#retainer',
    isPopular: false,
  },
];

export const TEN_TEAM_OPERATING_SYSTEM: TenTeamOperatingSystem[] = [
  {
    teamNumber: 1,
    teamName: 'Executive & Strategy',
    focusArea: 'Capital Allocation & ROI Alignment',
    impactDescription: 'Aligns working capital reduction targets with executive growth goals.',
  },
  {
    teamNumber: 2,
    teamName: 'Plant Operations',
    focusArea: 'Floor Inventory & WIP Movement',
    impactDescription: 'Identifies floor bottlenecks and stagnant WIP inventory.',
  },
  {
    teamNumber: 3,
    teamName: 'Stores & Warehouse',
    focusArea: 'Bin Location & Physical Audit',
    impactDescription: 'Eliminates bin drift and speeds up physical count reconciliations.',
  },
  {
    teamNumber: 4,
    teamName: 'Procurement & Sourcing',
    focusArea: 'Vendor Terms & Reorder Triggers',
    impactDescription: 'Prevents over-ordering of slow-moving raw materials.',
  },
  {
    teamNumber: 5,
    teamName: 'Logistics & Freight',
    focusArea: 'Freight Cost & Transit Shrinkage',
    impactDescription: 'Exposes unbilled freight surcharges and transit leaks.',
  },
  {
    teamNumber: 6,
    teamName: 'Finance & Accounts',
    focusArea: 'Working Capital & Carrying Cost',
    impactDescription: 'Quantifies holding cost burn and cash release trajectory.',
  },
  {
    teamNumber: 7,
    teamName: 'Quality & Compliance',
    focusArea: 'Rejection & Scrap Isolation',
    impactDescription: 'Isolates rejected stock before it ages into permanent loss.',
  },
  {
    teamNumber: 8,
    teamName: 'Sales & Demand Planning',
    focusArea: 'Finished Goods Velocity',
    impactDescription: 'Matches FG stock levels against realistic 90-day demand.',
  },
  {
    teamNumber: 9,
    teamName: 'Maintenance & MRO',
    focusArea: 'Critical Spares vs Dead MRO',
    impactDescription: 'Separates strategic insurance spares from obsolete MRO clutter.',
  },
  {
    teamNumber: 10,
    teamName: 'IT & Data Governance',
    focusArea: 'ERP Hygiene & 5-Column Schema',
    impactDescription: 'Ensures clean master data and standard ERP export formats.',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'What data is required for the audit?',
    a: 'Only a simple 5-column CSV export: Part Number/Code, Description, Quantity on Hand, Unit Cost/Rate, and Last Movement/Transaction Date.',
  },
  {
    q: 'How is data security and confidentiality handled?',
    a: 'Data processing can be done entirely in-browser or under a standard NDA. We never sell, store permanently, or share your proprietary ERP inventory numbers.',
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
    a: 'Once approved data is confirmed, an initial findings summary is completed within 48 hours for scheduling a 30-minute founder review call.',
  },
  {
    q: 'Is the pilot free or paid?',
    a: 'The instant in-browser 5-column CSV sandbox is 100% free with zero sign-up. The founder-led 48-hour Factory Diagnostic Audit is ₹18,000 (+ 18% GST), backed by a 100% refund guarantee if <₹2,50,000 in recoverable stagnant, freight, or bin leaks is identified, with an optional ₹15,000/month (+ 18% GST) Monthly Watchdog retainer and zero automatic subscription lock-in.',
  },
  {
    q: 'What happens after the findings review?',
    a: 'You receive the structured report for internal discussions. There is no automatic commitment, no recurring retainer, and no pressure.',
  },
];
