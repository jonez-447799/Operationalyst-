import {
  getLiveSandboxReconciliationMockData,
  ILLUSTRATIVE_12400_CA_BENCHMARK
} from '../utils/liveSandboxMetrics';

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
    subheadline: 'Automated 14-stage inventory & margin audit. Clean Tally CSV data, uncover hidden leakage, and recover 3.8% EBIT in under 48 hours.',
  },
  B: {
    id: 'B',
    badge: 'ZERO-RISK LEAKAGE GUARANTEE',
    headline: 'We Find at Least ₹2,50,000 in Trapped Cash or Your Audit Is 100% Free',
    subheadline: 'Zero integration required. Simply upload your exported Tally XML/CSV and get a plant-by-plant leak ledger verified by former CFOs.',
  },
  C: {
    id: 'C',
    badge: 'CLOSED-LOOP CAPA ENGINE',
    headline: 'Turn Unbilled WIP & Scrap Claims Into Bankable Working Capital',
    subheadline: 'Stop margin erosion from unallocated freight, split PO leaks, and phantom stock. Operationalyst continuously enforces financial invariants.',
  },
};
