/**
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
