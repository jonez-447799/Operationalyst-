/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Package,
  Layers,
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Activity,
  FileCheck2,
  ExternalLink,
  User,
  Mail,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { COMMERCIAL_TIERS, INSTITUTIONAL_TEAMS } from './homepageConfig';
import { IcebergControlSystems } from './IcebergControlSystems';

export interface CommercialLandingPageProps {
  onLaunchEngine?: (
    engine:
      | 'ceo_master'
      | 'standalone_p1'
      | 'standalone_p2'
      | 'standalone_p3'
      | 'standalone_p4'
      | 'standalone_p5'
      | 'merged_suite'
  ) => void;
  onOpenSmartMapper?: () => void;
  onOpenAuditPage?: () => void;
  onOpenSampleAuditPage?: () => void;
  onOpenLeadInbox?: () => void;
}

export const CommercialLandingPage: React.FC<CommercialLandingPageProps> = ({
  onLaunchEngine,
  onOpenSmartMapper,
  onOpenAuditPage,
  onOpenSampleAuditPage,
  onOpenLeadInbox
}) => {
  // Estimator State
  const [annualRevenue, setAnnualRevenue] = useState<number>(50); // ₹ Crores
  const [skuCount, setSkuCount] = useState<number>(1200);
  const [plantLocations, setPlantLocations] = useState<number>(2);

  // FAQ Toggle State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Engine Switcher Active Tab
  const [activeEngineTab, setActiveEngineTab] = useState<'p1' | 'p2' | 'p3' | 'p4'>('p1');

  // Leak calculations
  const estimatedP1Leak = annualRevenue * 0.024; // ~2.4% trapped capital
  const estimatedP2Leak = annualRevenue * 0.012; // ~1.2% OTIF penalties
  const estimatedP3Leak = annualRevenue * 0.008; // ~0.8% freight detention
  const estimatedP4Leak = annualRevenue * 0.006; // ~0.6% ghost inventory variance
  const totalEstimatedLeak = estimatedP1Leak + estimatedP2Leak + estimatedP3Leak + estimatedP4Leak;

  const faqs = [
    {
      q: 'How does Operationalyst achieve 100% deterministic leak identification?',
      a: 'We eliminate probabilistic LLM hallucinations by running strict mathematical matrix algorithms directly across 5-column plant inventory, dispatch, and gate logs.'
    },
    {
      q: 'Can we run an audit without giving cloud database access?',
      a: 'Yes. Operationalyst supports 100% air-gapped local browser execution via 5-column CSV templates. No external DB connection required.'
    },
    {
      q: 'What is the 48-Hour Leak Refund Guarantee?',
      a: 'If our diagnostic audit fails to uncover actionable inventory, freight, or OTIF leakage exceeding the audit fee within 48 hours, we refund 100% of the audit charge.'
    },
    {
      q: 'How do CA and Stock Auditor partners engage?',
      a: 'Certified partners access Tier 4 statutory stock audit working papers, co-branded reporting toolkits, and receive 20% recurring revenue share on managed client plants.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* SECTION 1: Executive Hero & 60-Second Leak Estimator */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4" />
            100% Deterministic Plant Leakage Intelligence
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Stop Margin Erosion in Industrial Plants &amp; Multi-Location Units
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Uncover trapped working capital, ghost inventory variances, emergency freight surcharges, and gate OTIF penalties across P1&ndash;P4 engines.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {onLaunchEngine && (
              <button
                onClick={() => onLaunchEngine('merged_suite')}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/50 flex items-center gap-2"
              >
                <Zap className="w-4 h-4" /> Launch Live Executive Suite
              </button>
            )}
            {onOpenSampleAuditPage && (
              <button
                onClick={onOpenSampleAuditPage}
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" /> View Sample Board Audit
              </button>
            )}
            {onOpenLeadInbox && (
              <button
                onClick={onOpenLeadInbox}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-semibold text-sm rounded-xl border border-amber-500/30 transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> CFO Direct Desk
              </button>
            )}
          </div>
        </div>

        {/* 60-Second Interactive Leak Estimator */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                60-Second Plant Leakage Estimator
              </h2>
              <p className="text-xs text-slate-400">Adjust plant scale to estimate annual cross-engine leakage exposure.</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/30 self-start sm:self-auto">
              Mathematical Model V2.4
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="space-y-5 lg:col-span-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Annual Plant Revenue (₹ Cr)</span>
                  <span className="font-mono text-emerald-400 font-bold">₹{annualRevenue} Crores</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  value={annualRevenue}
                  onChange={(e) => setAnnualRevenue(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Active SKU Count</span>
                  <span className="font-mono text-emerald-400 font-bold">{skuCount.toLocaleString()} SKUs</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="20000"
                  step="100"
                  value={skuCount}
                  onChange={(e) => setSkuCount(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Manufacturing Plant Units</span>
                  <span className="font-mono text-emerald-400 font-bold">{plantLocations} Locations</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={plantLocations}
                  onChange={(e) => setPlantLocations(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Estimated Recoverable Leak Pool</span>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                  ₹{(totalEstimatedLeak * 100).toFixed(2)} Lakhs
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Estimated annual leakage based on industry baseline metrics.</p>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
                <div className="flex justify-between text-slate-400">
                  <span>P1 Stagnant Capital Lock:</span>
                  <span className="font-mono text-slate-200">₹{(estimatedP1Leak * 100).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>P2 OTIF Penalty Exposure:</span>
                  <span className="font-mono text-slate-200">₹{(estimatedP2Leak * 100).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>P3 Freight &amp; Gate Detention:</span>
                  <span className="font-mono text-slate-200">₹{(estimatedP3Leak * 100).toFixed(2)} L</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>P4 Ghost Stock Variance:</span>
                  <span className="font-mono text-slate-200">₹{(estimatedP4Leak * 100).toFixed(2)} L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Interactive P1-P4 Engine Switcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white">4 Specialized Operational Engines</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Each engine solves a specific financial and operational leak vector using deterministic mathematical formulas.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-slate-800 pb-4">
          {[
            { id: 'p1', label: 'P1 — Capital Recovery', icon: Lock },
            { id: 'p2', label: 'P2 — OTIF Gate SLA', icon: Activity },
            { id: 'p3', label: 'P3 — Freight & Detention', icon: Zap },
            { id: 'p4', label: 'P4 — Ghost Inventory Audit', icon: AlertTriangle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeEngineTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveEngineTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Engine Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          {activeEngineTab === 'p1' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Engine P1 &mdash; Dead Capital Planner</span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300">Target: &gt;180 Days Dead Stock</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Unlock Frozen Working Capital</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                P1 categorizes unmoving raw materials, WIP, and finished goods into actionable disposition buckets (Scrap, Vendor Return, Alternative Unit Re-allocation).
              </p>
              {onLaunchEngine && (
                <button
                  onClick={() => onLaunchEngine('standalone_p1')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Launch P1 Standalone Engine
                </button>
              )}
            </div>
          )}

          {activeEngineTab === 'p2' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Engine P2 &mdash; Customer OTIF Governance</span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300">Target: Customer Order Line Clearances</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Eliminate OEM Gate Delivery SLA Penalties</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                P2 identifies dispatch delays before trucks hit factory gates, measuring line clearance efficiency and dispatch risk.
              </p>
              {onLaunchEngine && (
                <button
                  onClick={() => onLaunchEngine('standalone_p2')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Launch P2 Standalone Engine
                </button>
              )}
            </div>
          )}

          {activeEngineTab === 'p3' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Engine P3 &mdash; Profit Protection</span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300">Target: Spot Freight &amp; Gate Detention</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Audit Transporter Invoices &amp; Gate Detention</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                P3 cross-references vehicle gate timestamps with contract rate-slabs to automatically calculate transporter debit notes for turnaround delays &gt;6 hours.
              </p>
              {onLaunchEngine && (
                <button
                  onClick={() => onLaunchEngine('standalone_p3')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Launch P3 Standalone Engine
                </button>
              )}
            </div>
          )}

          {activeEngineTab === 'p4' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Engine P4 &mdash; Ghost Inventory Reconciliation</span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300">Target: Physical vs System Stock</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Reconcile System vs Physical Bin Quantities</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                P4 detects phantom stock (ERP shows quantity, physical bin is empty) before it causes emergency assembly line shutdowns.
              </p>
              {onLaunchEngine && (
                <button
                  onClick={() => onLaunchEngine('standalone_p4')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Launch P4 Standalone Engine
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: 4 Commercial Tiers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            Flexible Commercial Tiers
          </div>
          <h2 className="text-3xl font-extrabold text-white">Designed for Plants, Enterprises &amp; Auditors</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            From single-plant 48-hour diagnostic audits to multi-unit enterprise watchdog subscriptions and partner portals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMMERCIAL_TIERS.map((tier) => (
            <div
              key={tier.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-6 shadow-lg hover:border-slate-700 transition-all"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">{tier.tagline}</span>
                  <h3 className="text-xl font-bold text-white">{tier.title}</h3>
                </div>

                <div className="space-y-1 border-t border-slate-800 pt-3">
                  <div className="text-2xl font-extrabold text-white font-mono">{tier.price}</div>
                  <div className="text-xs text-amber-400 font-medium">{tier.guarantee}</div>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800">
                {onOpenLeadInbox && (
                  <button
                    onClick={onOpenLeadInbox}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all"
                  >
                    Select {tier.title}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: 14 Institutional Teams OS Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            14 Institutional Operations Teams
          </div>
          <h2 className="text-3xl font-extrabold text-white">Full-Spectrum Operational Coverage</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Our 14 specialized teams cover every link in the industrial supply chain.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {INSTITUTIONAL_TEAMS.map((team) => (
            <div
              key={team.id}
              className="bg-slate-900/80 rounded-xl border border-slate-800/80 p-4 space-y-2 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold">Team {team.id}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">{team.code}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{team.name}</h4>
              <p className="text-xs text-slate-400">{team.mandate}</p>
              <div className="pt-2 border-t border-slate-800/60 text-[11px] text-amber-400/90 font-mono">
                Engine Focus: {team.engine}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: MOUNTED ICEBERG CONTROL SYSTEMS (The Whole Iceberg) */}
      <IcebergControlSystems
        onLaunchEngine={onLaunchEngine}
        onOpenSmartMapper={onOpenSmartMapper}
        onOpenAuditPage={onOpenAuditPage}
        onOpenSampleAuditPage={onOpenSampleAuditPage}
        onOpenLeadInbox={onOpenLeadInbox}
      />

      {/* SECTION 6: FAQ Accordion Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            <HelpCircle className="w-4 h-4 text-emerald-400" /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-extrabold text-white">Executive &amp; Technical Governance</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 7: Executive Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-slate-200 text-sm">Operationalyst Governance Suite &mdash; Team 12</div>
            <div>Deterministic Industrial Inventory &amp; Logistics Leakage Intelligence</div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-slate-400 font-medium">
            <a href="#control-tower" className="hover:text-emerald-400 transition-colors">Control Tower</a>
            <a href="#grievance-desk" className="hover:text-emerald-400 transition-colors">Grievance Desk</a>
            {onOpenLeadInbox && (
              <button onClick={onOpenLeadInbox} className="hover:text-emerald-400 transition-colors">
                Contact CFO Desk
              </button>
            )}
          </div>

          <div className="text-center md:text-right text-slate-500">
            &copy; {new Date().getFullYear()} Operationalyst. Apache 2.0 Open License.
          </div>
        </div>
      </footer>

    </div>
  );
};
