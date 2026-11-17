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

export const HERO_CONTENT = {
  variants: [
    {
      id: 'A' as const,
      badge: 'MSME UDYAM COMPLIANT (0% GST — UDYAM-TN-02-0444630)',
      headline: 'Stop Unchecked Factory Margin Leakage Before Your Annual Audit',
      subheadline: '14-Stage Automated Audit & Governance Architecture framing — engineered for Indian manufacturing plants.'
    }
  ]
};

export const NAV_LINKS = [
  { label: '14-Stage Architecture', href: '#architecture' },
  { label: 'Iceberg Control', href: '#iceberg' },
  { label: 'Tally Claims Cleaner', href: '#tally-cleaner' },
  { label: 'CA Wholesale Desk', href: '#ca-desk' },
  { label: 'Pricing & Guarantee', href: '#pricing' }
];

export const FOUNDER_EXECUTIVE_SIGNOFF = {
  founderName: 'C. Jones Snowin',
  role: 'Founder & Principal Operational Engineer',
  firm: 'Operationalyst Systems (MSME Udyam: UDYAM-TN-02-0444630)',
  sacCode: '998311 (Management Consulting Services)',
  gstNote: '0% GST — MSME Bill of Supply / Section 22 Exemption'
};

export const COMMERCIAL_TIERS = [
  {
    id: 'tier-1',
    name: '48-Hr Diagnostic Audit',
    price: '₹18,000',
    subtext: 'Flat MSME Bill of Supply (0% GST)',
    description: 'Complete 14-stage automated forensic scan of Tally XML & ERP data.',
    features: ['14-Stage Forensic Audit Report', 'Spares & Inventory Leakage Map', '100% Money-Back Guarantee']
  },
  {
    id: 'tier-2',
    name: 'Monthly Watchdog',
    price: '₹15,000/mo',
    subtext: 'Flat MSME Bill of Supply (0% GST)',
    description: 'Continuous automated monitoring of inventory & claims.',
    features: ['Real-time Tally / ERP Watchdog', 'Weekly Variance Alerts', 'CA Audit Working-Paper Trail']
  },
  {
    id: 'tier-4',
    name: 'ICAI CA Wholesale Desk',
    price: '₹14,400 / ₹12,000/mo',
    subtext: 'Partner Diagnostic & Watchdog Working-Paper License',
    description: 'ICAI compliant CA firm bulk licensing for statutory audit support.',
    features: ['Wholesale Working-Paper License', 'Zero Commission / Flat Fee', 'SHA-256 Purge Verification']
  }
];

export const METHODOLOGY_STAGES = [
  { stage: 1, title: 'Tally & ERP Ingestion', desc: 'Secure XML/CSV parser with strict Indian date format support' },
  { stage: 2, title: 'OEM Buyer Brand Masking', desc: 'Quarantine and mask tier-1 OEM brand descriptions' },
  { stage: 3, title: 'Closing Stock Valuation Guard', desc: '100x rate vs total value anomaly detection' },
  { stage: 4, title: 'Free-Issue & Zero Rate Isolation', desc: 'Separate quarantine for non-revenue stock items' },
  { stage: 5, title: 'Spares Depreciation Recalculation', desc: 'Critical machine spare holding cost analysis' },
  { stage: 6, title: 'Vendor Claims Reconciliation', desc: 'Purchase order vs vendor invoice claim matching' },
  { stage: 7, title: 'GST SAC 998311 Compliance Check', desc: 'MSME bill of supply zero-tax classification' },
  { stage: 8, title: 'Inventory Iceberg Dimensioning', desc: 'Multi-layer operational loss exposure mapping' },
  { stage: 9, title: 'Recovery Engine Slider Calibration', desc: 'Adjustable 50%/40%/15% cash recovery modeling' },
  { stage: 10, title: 'CA Working Paper Generation', desc: 'Automated audit trail generation for statutory auditors' },
  { stage: 11, title: 'SHA-256 Purge Receipt Minting', desc: 'DELCERT cryptographic proof of data purging' },
  { stage: 12, title: 'Executive Sign-Off Validation', desc: 'Founder C. Jones Snowin governance sign-off' },
  { stage: 13, title: 'Automated Dispatch & Alerts', desc: 'WhatsApp & Email instant anomaly notifications' },
  { stage: 14, title: 'Continuous Watchdog Loop', desc: 'Real-time monitoring of ongoing ledger invariants' }
];

export const TEN_TEAM_OPERATING_SYSTEM = [
  { id: 1, title: 'Plant Finance & CA Desk' },
  { id: 2, title: 'Store & Inventory Control' }
];

export const STAKEHOLDER_PERSPECTIVES = [
  { id: 'cfo', title: 'Plant CFO / Finance Head', desc: 'Eliminate surprise inventory write-offs before annual audit.' }
];

export const ICEBERG_DIMENSIONS = [
  { id: 'spares', dimension: 'Unverified Spares Write-Downs', risk: 'High' },
  { id: 'debits', dimension: 'Unclaimed Vendor Debits', risk: 'Critical' }
];

export const OBJECTION_MATRIX = [
  { id: 'replace', objection: 'Does this replace our Tally or ERP?', response: 'No, Operationalyst runs as a non-invasive governance layer on top of your existing software.' }
];

export const VALUE_PROPOSITIONS = [
  { id: 'zero-risk', title: 'Zero Risk Money Back', desc: 'Reconciled 100% money-back guarantee if no margin leaks found.' }
];

export const FAQ_ITEMS = [
  { id: 'gst', question: 'Is GST applicable?', answer: 'No, billed under MSME Bill of Supply (0% GST - UDYAM-TN-02-0444630, SAC 998311).' }
];

export function getReconciledSampleAuditModes() {
  const metrics = getLiveSandboxReconciledModeMetrics();
  return {
    modes: [
      { id: 'mode-1', label: 'Standard Diagnostic', metrics },
      { id: 'mode-2', label: 'Deep Forensic Audit', metrics: ILLUSTRATIVE_12400_CASE_METRICS }
    ]
  };
}
