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
    priorityOutcome: 'Release locked working capital, reduce annual 18-24% inventory carrying cost burn, and establish financial visibility across manufacturing plants.',
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
    riskMitigation: 'Focus on stock velocity and operational system gaps, explicitly respecting safety buffers and critical machine spares.',
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
