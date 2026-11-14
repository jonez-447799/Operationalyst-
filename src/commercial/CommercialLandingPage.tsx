/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  Layers,
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2,
  Lock,/**
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
  Linkedin,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  Calculator,
  Building2,
  Users,
  Award,
  Zap,
  Clock,
  Database,
  Search,
  Check,
  Megaphone,
} from 'lucide-react';

import {
  HERO_HEADLINE_VARIANTS,
  ACTIVE_DEFAULT_VARIANT,
  PROBLEM_QUESTIONS,
  PROCESS_STEPS,
  AUDIT_DELIVERABLES,
  METHODOLOGY_STAGES,
  DATA_TRUST_ITEMS,
  FAQ_ITEMS,
  FOUNDER_EXECUTIVE_SIGNOFF,
  getReconciledSampleAuditModes,
  type SampleAuditModeId,
  COMMERCIAL_TIERS,
  TEN_TEAM_OPERATING_SYSTEM,
} from './homepageConfig';

interface CommercialLandingPageProps {
  onLaunchEngine: (
    engine:
      | 'ceo_master'
      | 'standalone_p1'
      | 'standalone_p2'
      | 'standalone_p3'
      | 'standalone_p4'
      | 'standalone_p5'
      | 'merged_suite'
  ) => void;
  onOpenSmartMapper: () => void;
  onOpenAuditPage?: () => void;
  onOpenSampleAuditPage?: () => void;
  onOpenLeadInbox?: () => void;
}

// Interactive P1-P4 Audit Engine Proof Data
const ENGINE_PROOFS = [
  {
    id: 'p1',
    engineKey: 'standalone_p1' as const,
    code: 'P1 Engine',
    title: 'Dead-Stock & Working Capital Recovery',
    subtitle: '>180d aging, RTV/BOM/Scrap disposition',
    requiredFields: [
      'SKU ID / Item Code',
      'Location / Plant Bin',
      'Batch Mfg Date / Age (Days)',
      'Unit Standard Cost (₹)',
      'Current On-Hand Qty',
    ],
    sampleLeak: {
      id: 'SKU-77042-BOM (Specialty Polymer Component)',
      leakAmount: '₹8,42,000',
      detail: 'Stagnant >210 days without active BOM allocation across 3 plant stores',
    },
    deliverableSheet: 'Executive Dead-Stock Disposition & Capital Unlocking Register (PDF/XLSX)',
  },
  {
    id: 'p2',
    engineKey: 'standalone_p2' as const,
    code: 'P2 Engine',
    title: 'OTIF Dispatch Reliability',
    subtitle: 'Order-to-gate SLA & dispatch delay root causes',
    requiredFields: [
      'Sales Order / PO ID',
      'Customer Code & Tier',
      'Promised Ship Date',
      'Actual Gate-Out Date',
      'Dispatch Line Status / Delay Reason Code',
    ],
    sampleLeak: {
      id: 'SO-99214-DEL (Tier-1 OEM Assembly Pack)',
      leakAmount: '₹4,15,000',
      detail: 'Delayed 74 hours past SLA due to missing gate-out signoff; SLA penalty incurred',
    },
    deliverableSheet: 'OTIF Bottleneck Analysis & Dispatch SLA Penalty Recovery Matrix',
  },
  {
    id: 'p3',
    engineKey: 'standalone_p3' as const,
    code: 'P3 Engine',
    title: 'Freight Rate-Card & Detention Audit',
    subtitle: 'Transporter slab overcharges & >6 hr truck detention claims',
    requiredFields: [
      'LR / Lorry Receipt ID',
      'Transporter Code',
      'Origin-Destination Zone',
      'Invoiced Freight Rate (₹)',
      'Gate In/Out Loading Hours',
    ],
    sampleLeak: {
      id: 'LR-38910-TR (Western Corridor Fleet #44)',
      leakAmount: '₹3,28,500',
      detail: 'Slab rate overcharge (₹2,10,000) + unverified >6 hr detention claim (₹1,18,500)',
    },
    deliverableSheet: 'Transporter Freight Overcharge Audit & Detention Rejection Certificate',
  },
  {
    id: 'p4',
    engineKey: 'standalone_p4' as const,
    code: 'P4 Engine',
    title: 'Warehouse Bin Variance & Ghost Stock Control',
    subtitle: 'System vs. physical shelf count reconciliation',
    requiredFields: [
      'Bin Location Code',
      'Item SKU ID',
      'ERP System Quantity',
      'Physical Count Quantity',
      'Unit Inventory Value (₹)',
    ],
    sampleLeak: {
      id: 'BIN-B4-092 (Precision CNC Carbide Tooling)',
      leakAmount: '₹5,75,000',
      detail: 'Phantom ERP inventory recorded on shelf; physical count zero (Ghost Stock)',
    },
    deliverableSheet: 'Physical Shelf Reconciliation & Ghost Inventory Adjustment Ledger',
  },
];

export const CommercialLandingPage: React.FC<CommercialLandingPageProps> = ({
  onLaunchEngine,
  onOpenSmartMapper,
  onOpenAuditPage,
  onOpenSampleAuditPage,
  onOpenLeadInbox,
}) => {
  // Calculator State
  const [inventoryValueCr, setInventoryValueCr] = useState<number>(5);
  const [carryingCostPercent, setCarryingCostPercent] = useState<number>(22);

  // Engine Proof Switcher State
  const [activeEngineId, setActiveEngineId] = useState<string>('p1');

  // Interactive sample audit mode switcher state
  const [activeSampleModeId, setActiveSampleModeId] = useState<SampleAuditModeId>('deadstock');

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Calculator Math
  const inventoryValueLakhs = inventoryValueCr * 100;
  const stagnantCapitalLakhs = inventoryValueLakhs * 0.14; // 14% industrial baseline
  const carryingCostBurnLakhs = stagnantCapitalLakhs * (carryingCostPercent / 100);
  const freightBinExposureLakhs = inventoryValueLakhs * 0.025; // 2.5% baseline
  const totalRecoverableLeakLakhs = carryingCostBurnLakhs + freightBinExposureLakhs;
  const refundMultiplier = (totalRecoverableLeakLakhs / 2.5).toFixed(1);

  const formatLakhsCr = (lakhs: number) => {
    if (lakhs >= 100) {
      return `₹${(lakhs / 100).toFixed(2)} Cr`;
    }
    return `₹${lakhs.toFixed(2)} Lakhs`;
  };

  const sampleAuditModes = getReconciledSampleAuditModes();
  const activeSampleMode = sampleAuditModes.find((m) => m.id === activeSampleModeId) || sampleAuditModes[0];
  const activeEngineProof = ENGINE_PROOFS.find((e) => e.id === activeEngineId) || ENGINE_PROOFS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Banner / Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-mono font-bold text-lg text-white tracking-tight">
              Operationalyst<span className="text-emerald-400">.</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              14-TEAM OS
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
            <a href="#leak-calculator" className="hover:text-emerald-400 transition-colors">
              Leak Estimator
            </a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
              How It Works
            </a>
            <a href="#audit" className="hover:text-emerald-400 transition-colors">
              Audit Engines
            </a>
            <a href="#operating-system" className="hover:text-emerald-400 transition-colors">
              14-Team Desks
            </a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {onOpenLeadInbox && (
              <button
                type="button"
                onClick={onOpenLeadInbox}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                Lead Desk
              </button>
            )}
            <button
              type="button"
              onClick={() => onLaunchEngine('ceo_master')}
              className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <span>Launch Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-12 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>48-Hour Factory Inventory Leak &amp; Working Capital Recovery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            {HERO_HEADLINE_VARIANTS[ACTIVE_DEFAULT_VARIANT]}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Plug working capital leaks across dead-stock aging (&gt;180d), OTIF dispatch bottlenecks, freight slab overcharges, and warehouse bin variances in 48 hours without replacing your existing ERP.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              type="button"
              onClick={() => {
                if (onOpenAuditPage) {
                  onOpenAuditPage();
                } else {
                  window.location.href = '?view=audit';
                }
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Book ₹18,000 48-Hr Diagnostic Audit</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenSampleAuditPage) {
                  onOpenSampleAuditPage();
                } else {
                  window.location.href = '?view=sample-audit';
                }
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>View Executive Sample Deliverable</span>
            </button>
          </div>

          {/* Quick Problem Questions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left max-w-5xl mx-auto">
            {PROBLEM_QUESTIONS.map((q, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-mono text-emerald-400 mb-1">{q.metric}</div>
                <div className="text-sm font-semibold text-slate-200">{q.question}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 1 UPGRADE: 60-Second Factory Leak & Holding Burn Estimator */}
      <section id="leak-calculator" className="py-16 border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-3">
              <Calculator className="w-3.5 h-3.5" />
              <span>60-Second Executive Estimator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Factory Leak &amp; Holding Burn Estimator
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Adjust your plant parameters to calculate immediate working capital unlocking potential and leak exposure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Controls Panel */}
            <div className="lg:col-span-5 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-200">
                    Total Plant Inventory Value
                  </label>
                  <span className="text-lg font-mono font-bold text-emerald-400">
                    ₹{inventoryValueCr} Cr
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={inventoryValueCr}
                  onChange={(e) => setInventoryValueCr(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between items-center text-xs text-slate-400 font-mono mt-2">
                  <span>₹1 Cr</span>
                  <span>₹25 Cr</span>
                  <span>₹50 Cr</span>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {[1, 5, 10, 25, 50].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setInventoryValueCr(val)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors ${
                        inventoryValueCr === val
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      ₹{val} Cr
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-200">
                    Annual Inventory Carrying Cost %
                  </label>
                  <span className="text-lg font-mono font-bold text-emerald-400">
                    {carryingCostPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="28"
                  step="1"
                  value={carryingCostPercent}
                  onChange={(e) => setCarryingCostPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between items-center text-xs text-slate-400 font-mono mt-2">
                  <span>18%</span>
                  <span>22% (Std)</span>
                  <span>28%</span>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {[18, 20, 22, 25, 28].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCarryingCostPercent(val)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors ${
                        carryingCostPercent === val
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Grid & Guarantee Badge */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs font-mono text-slate-400 mb-1">
                    Est. Stagnant Capital (&gt;180 Days)
                  </div>
                  <div className="text-2xl font-mono font-bold text-amber-400">
                    {formatLakhsCr(stagnantCapitalLakhs)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">14% industrial baseline stock</div>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs font-mono text-slate-400 mb-1">
                    Annual Carrying Cost Burn
                  </div>
                  <div className="text-2xl font-mono font-bold text-rose-400">
                    {formatLakhsCr(carryingCostBurnLakhs)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {carryingCostPercent}% annual holding cost on stagnant stock
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs font-mono text-slate-400 mb-1">
                    Freight &amp; Bin Shrinkage Exposure
                  </div>
                  <div className="text-2xl font-mono font-bold text-amber-400">
                    {formatLakhsCr(freightBinExposureLakhs)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    2.5% baseline freight overcharges &amp; bin count variance
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-emerald-500/30 bg-emerald-500/5">
                  <div className="text-xs font-mono text-emerald-400 mb-1">
                    Total Recoverable Leak Exposure
                  </div>
                  <div className="text-2xl font-mono font-bold text-emerald-400">
                    {formatLakhsCr(totalRecoverableLeakLakhs)}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Combined annual holding burn &amp; leakage risk
                  </div>
                </div>
              </div>

              {/* 100% Refund Guarantee Badge */}
              <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      100% Refund Guarantee Active
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-slate-950">
                      {refundMultiplier}x COVERAGE
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/90 mt-1 leading-relaxed">
                    Estimated total recoverable leak exposure ({formatLakhsCr(totalRecoverableLeakLakhs)}) exceeds the <strong className="text-white">₹2,50,000 (₹2.5L)</strong> refund threshold by <strong className="text-white">{refundMultiplier}x</strong> on the ₹18,000 (+18% GST) 48-Hour Diagnostic Audit. If identified leaks do not exceed ₹2.5L, your audit fee is 100% refunded.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: How It Works */}
      <section id="how-it-works" className="py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>Zero ERP Modification Required</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              48-Hour Diagnostic Audit Process
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              From raw ERP export to executive disposition ledger in 3 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative hover:border-slate-700 transition-all"
              >
                <div className="text-3xl font-mono font-bold text-emerald-400 mb-3">
                  0{step.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{step.description}</p>
                <div className="pt-3 border-t border-slate-800 text-xs font-mono text-emerald-400/90">
                  Deliverable: {step.timeframe}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 UPGRADE: Interactive P1–P4 Audit Engine Proof Switcher */}
      <section id="audit" className="py-16 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Section 3: Interactive Audit Engine Proofs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Core Diagnostic Engines (P1–P4)
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Switch across the 4 specialized audit engines to inspect exact required ERP export fields, traceable leak samples, and 48-hour executive deliverables.
            </p>
          </div>

          {/* Engine Tabs Switcher */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {ENGINE_PROOFS.map((eng) => {
              const isActive = eng.id === activeEngineId;
              return (
                <button
                  key={eng.id}
                  type="button"
                  onClick={() => setActiveEngineId(eng.id)}
                  className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 border ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="px-1.5 py-0.5 rounded bg-slate-950/20 text-[10px]">
                    {eng.code}
                  </span>
                  <span>{eng.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Engine Card Display */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
              <div>
                <div className="inline-block px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
                  {activeEngineProof.code}
                </div>
                <h3 className="text-xl font-bold text-white">{activeEngineProof.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{activeEngineProof.subtitle}</p>
              </div>

              <button
                type="button"
                onClick={() => onLaunchEngine(activeEngineProof.engineKey)}
                className="px-4 py-2.5 rounded-xl font-mono font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 self-start md:self-auto"
              >
                <span>Launch {activeEngineProof.code} Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Required Fields */}
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>Required 5-Column ERP Fields</span>
                </h4>
                <ul className="space-y-2">
                  {activeEngineProof.requiredFields.map((field, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{field}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Sample Leak Caught */}
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Row-Traceable Sample Leak</span>
                </h4>
                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 space-y-2">
                  <div className="text-xs font-mono text-slate-300 font-semibold truncate">
                    {activeEngineProof.sampleLeak.id}
                  </div>
                  <div className="text-lg font-mono font-bold text-rose-400">
                    {activeEngineProof.sampleLeak.leakAmount}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {activeEngineProof.sampleLeak.detail}
                  </p>
                </div>
              </div>

              {/* 3. Executive Deliverable Sheet */}
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>48-Hour Executive Deliverable</span>
                </h4>
                <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                  <p className="text-xs font-mono font-bold text-white mb-2 leading-snug">
                    {activeEngineProof.deliverableSheet}
                  </p>
                  <p className="text-xs text-slate-400">
                    Board-ready PDF signoff report + row-level Excel reconciliation ledger ready for CFO audit review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUTIONAL OPERATING SYSTEM (14 Specialized Desks) */}
      <section id="operating-system" className="py-16 border-b border-slate-800">
        <div id="ten-teams" />
        <div id="teams" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>14 Specialized Institutional Desks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              14-Team Institutional Operating System
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Every audit and subscription tier is backed by specialized institutional desks enforcing compliance, data security, retention, and partner growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEN_TEAM_OPERATING_SYSTEM.map((team) => (
              <div
                key={team.teamNumber}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                    Team {team.teamNumber}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{team.sla}</span>
                </div>
                <h3 className="text-base font-bold text-white">{team.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{team.responsibility}</p>
                <div className="pt-2 border-t border-slate-800 text-xs font-mono text-emerald-400/90">
                  Deliverable: {team.primaryDeliverable}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMERCIAL TIERS / PRICING */}
      <section id="pricing" className="py-16 border-b border-slate-800 bg-slate-900/40">
        <div id="commercial-tiers" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Transparent Industrial Commercials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              4 Commercial Tiers &amp; Partner Desk
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              From free sandbox exploration to 48-hour diagnostic audits and recurring audit partner desks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMMERCIAL_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-2xl p-6 flex flex-col justify-between border transition-all ${
                  tier.highlighted
                    ? 'bg-slate-900 border-emerald-500/50 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {tier.badge && (
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-3">
                      {tier.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
                  <div className="text-2xl font-mono font-bold text-emerald-400 mb-1">
                    {tier.price}
                  </div>
                  {tier.gstNote && (
                    <div className="text-[11px] text-slate-400 font-mono mb-3">{tier.gstNote}</div>
                  )}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{tier.targetAudience}</p>
                  
                  <ul className="space-y-2 mb-6 text-xs text-slate-300">
                    {tier.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (tier.id === 'sandbox') {
                      onLaunchEngine('ceo_master');
                    } else if (onOpenAuditPage) {
                      onOpenAuditPage();
                    } else {
                      window.location.href = '?view=audit';
                    }
                  }}
                  className={`w-full py-2.5 rounded-xl font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    tier.highlighted
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DATA TRUST & SECURITY */}
      <section id="data-trust" className="py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-3">
              <Lock className="w-3.5 h-3.5" />
              <span>Data Security Standards</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Enterprise Security &amp; Confidentiality Guarantee
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DATA_TRUST_ITEMS.map((trust, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">{trust.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{trust.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-16 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Industrial Audit &amp; Technical Clarifications
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left font-semibold text-sm text-slate-200 hover:text-white flex items-center justify-between gap-4"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOUNDER EXECUTIVE SIGNOFF & FOOTER */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-sm font-bold text-white mb-1">
                {FOUNDER_EXECUTIVE_SIGNOFF.title}
              </div>
              <p className="text-xs text-slate-400 max-w-xl">
                {FOUNDER_EXECUTIVE_SIGNOFF.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onOpenAuditPage) {
                  onOpenAuditPage();
                } else {
                  window.location.href = '?view=audit';
                }
              }}
              className="px-5 py-2.5 rounded-xl font-mono font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
            >
              Book 48-Hour Audit (₹18,000)
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 pt-6">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-white font-bold">Operationalyst</span>
              <span>© {new Date().getFullYear()} Operationalyst Technologies. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#privacy" className="hover:text-emerald-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-emerald-400 transition-colors">
                Terms of Service
              </a>
              <a href="#security" className="hover:text-emerald-400 transition-colors">
                Security Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CommercialLandingPage;

  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Activity,
  FileCheck2,
  ExternalLink,
  User,
  Mail,
  Linkedin,
  HelpCircle,
  AlertCircle,
  Building2,
  Clock,
  Sparkles,
  Megaphone,
  Download,
} from 'lucide-react';
import {
  HERO_HEADLINE_VARIANTS,
  ACTIVE_DEFAULT_VARIANT,
  PROBLEM_QUESTIONS,
  PROCESS_STEPS,
  AUDIT_DELIVERABLES,
  METHODOLOGY_STAGES,
  DATA_TRUST_ITEMS,
  FAQ_ITEMS,
  FOUNDER_EXECUTIVE_SIGNOFF,
  getReconciledSampleAuditModes,
  type SampleAuditModeId,
} from './homepageConfig';
import { FactoryAuditModal } from './FactoryAuditModal';
import { SampleAuditReportModal } from './SampleAuditReportModal';
import { InventoryChecklistModal } from './InventoryChecklistModal';
import { MethodologyModal } from './MethodologyModal';
import { B2BBehavioralSystem, BehavioralIcebergModal } from './B2BBehavioralSystem';
import { CampaignAssetStudio } from './CampaignAssetStudio';
import { trackEvent, trackServerFunnelEvent } from '../utils/analytics';
import {
  downloadAuditTemplate,
  downloadPilotDataKitXlsx,
} from '../utils/pilotDataKitExporter';
import { LegalGovernanceModal, LegalGovernanceTab } from './LegalGovernanceModal';
import type { BuyerPersona } from '../utils/leadValidation';
import type { SelfAssessmentEvaluation } from '../utils/selfAssessmentScorer';
import { InstantAuditDropzone } from './InstantAuditDropzone';

interface CommercialLandingPageProps {
  onLaunchEngine: (
    engine:
      | 'ceo_master'
      | 'standalone_p1'
      | 'standalone_p2'
      | 'standalone_p3'
      | 'standalone_p4'
      | 'standalone_p5'
      | 'merged_suite'
  ) => void;
  onOpenSmartMapper: () => void;
  onOpenAuditPage?: () => void;
  onOpenSampleAuditPage?: () => void;
  onOpenLeadInbox?: () => void;
}

export const CommercialLandingPage: React.FC<CommercialLandingPageProps> = ({
  onLaunchEngine,
  onOpenSampleAuditPage,
}) => {
  // Modal states
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditModalSource, setAuditModalSource] = useState<string>('landing_hero');
  const [auditModalPersona, setAuditModalPersona] = useState<BuyerPersona | undefined>(undefined);
  const [auditModalDiagnostic, setAuditModalDiagnostic] = useState<
    SelfAssessmentEvaluation | undefined
  >(undefined);
  const [isSampleReportOpen, setIsSampleReportOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isIcebergModalOpen, setIsIcebergModalOpen] = useState(false);
  const [isCampaignStudioOpen, setIsCampaignStudioOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalGovernanceTab>('privacy');
  const [sampleModeId, setSampleModeId] = useState<SampleAuditModeId>('illustrative_12400');
  const [sampleTablePage, setSampleTablePage] = useState<number>(1);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const sampleAuditModes = getReconciledSampleAuditModes();
  const activeSampleMode = sampleAuditModes[sampleModeId] || sampleAuditModes.sandbox_20;

  const handleOpenDedicatedSamplePage = () => {
    if (onOpenSampleAuditPage) {
      onOpenSampleAuditPage();
    } else {
      window.location.href = '?view=sample-audit';
    }
  };

  const handleOpenLegalModal = (tab: LegalGovernanceTab) => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  // A/B Test Readiness Configuration (defaults to Variant A, switchable via Iceberg Lab)
  const [headlineVariant, setHeadlineVariant] = useState<'A' | 'B' | 'C'>(ACTIVE_DEFAULT_VARIANT);

  // Phase 9 & 11 Collapsible Deep-Dive Drawer States
  const [isMethodologyDrawerOpen, setIsMethodologyDrawerOpen] = useState<boolean>(false);
  const showMethodologyStagesDrawer = isMethodologyDrawerOpen;
  const setShowMethodologyStagesDrawer = setIsMethodologyDrawerOpen;
  const [showGovernanceFaqDrawer, setShowGovernanceFaqDrawer] = useState<boolean>(false);

  // Data & Trust Accordion State
  const [openTrustIndex, setOpenTrustIndex] = useState<number | null>(0);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Phase 9 & 10: First-Party Server Funnel & 4-Stage Scroll-Depth Tracking (25%, 50%, 75%, 90%)
  const hasTrackedPageViewRef = useRef<boolean>(false);
  const hasTrackedScroll25Ref = useRef<boolean>(false);
  const hasTrackedScroll50Ref = useRef<boolean>(false);
  const hasTrackedScroll75Ref = useRef<boolean>(false);
  const hasTrackedScroll90Ref = useRef<boolean>(false);

  useEffect(() => {
    if (!hasTrackedPageViewRef.current) {
      hasTrackedPageViewRef.current = true;
      trackServerFunnelEvent('LANDING_PAGE_VIEW', { sourceSection: 'landing_page_load' });
    }

    const handleHashChange = () => {
      if (typeof window !== 'undefined' && window.location.hash === '#methodology') {
        setIsMethodologyDrawerOpen(true);
      }
    };
    handleHashChange();

    const handleScroll = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight =
        Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        ) - window.innerHeight;
      if (docHeight <= 0) return;
      const scrollPct = (scrollTop / docHeight) * 100;

      if (scrollPct >= 25 && !hasTrackedScroll25Ref.current) {
        hasTrackedScroll25Ref.current = true;
        trackServerFunnelEvent('SCROLL_DEPTH_25_PCT', { sourceSection: 'scroll_25_pct' });
      }
      if (scrollPct >= 50 && !hasTrackedScroll50Ref.current) {
        hasTrackedScroll50Ref.current = true;
        trackServerFunnelEvent('SCROLL_DEPTH_50_PCT', { sourceSection: 'scroll_50_pct' });
      }
      if (scrollPct >= 75 && !hasTrackedScroll75Ref.current) {
        hasTrackedScroll75Ref.current = true;
        trackServerFunnelEvent('SCROLL_DEPTH_75_PCT', { sourceSection: 'scroll_75_pct' });
      }
      if (scrollPct >= 90 && !hasTrackedScroll90Ref.current) {
        hasTrackedScroll90Ref.current = true;
        trackServerFunnelEvent('SCROLL_DEPTH_90_PCT', { sourceSection: 'scroll_90_pct' });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleOpenAuditModal = (
    source: string,
    persona?: BuyerPersona,
    diagnostic?: SelfAssessmentEvaluation
  ) => {
    trackEvent('hero_primary_cta_clicked', { source, persona });
    trackServerFunnelEvent('AUDIT_MODAL_OPENED', {
      sourceSection: source,
      buyerPersona: persona,
    });
    setAuditModalSource(source);
    setAuditModalPersona(persona);
    setAuditModalDiagnostic(diagnostic);
    setIsAuditModalOpen(true);
  };

  const handleOpenSampleReport = (source: string) => {
    trackEvent('sample_report_clicked', { source });
    trackServerFunnelEvent('SAMPLE_REPORT_CLICKED', { sourceSection: source });
    setIsSampleReportOpen(true);
  };

  const handleViewPlatform = () => {
    trackEvent('platform_view_clicked');
    onLaunchEngine('ceo_master');
  };

  const toggleTrust = (idx: number) => {
    trackEvent('data_trust_opened', { itemIndex: idx });
    setOpenTrustIndex((prev) => (prev === idx ? null : idx));
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* ===================================================================== */}
      {/* SECTION 1: NAVIGATION                                                 */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-850">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-lg font-black tracking-tight text-white uppercase font-mono block truncate">
                OPERATIONALYST
              </span>
              <p className="text-[10px] text-slate-400 hidden sm:block font-mono">
                Manufacturing Inventory Intelligence
              </p>
            </div>
          </div>

          {/* Clean Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-300">
            <a href="#how-it-works" className="hover:text-emerald-400 transition">
              How It Works
            </a>
            <a href="#audit" className="hover:text-emerald-400 transition">
              Factory Audit
            </a>
            <a href="#stakeholders" className="hover:text-emerald-400 transition">
              By Role
            </a>
            <button
              type="button"
              onClick={() => handleOpenSampleReport('nav')}
              className="hover:text-emerald-400 transition cursor-pointer text-left"
            >
              View Sample Report
            </button>
            <button
              type="button"
              data-testid="nav-full-sample-report-btn"
              onClick={handleOpenDedicatedSamplePage}
              className="hover:text-emerald-400 transition cursor-pointer text-left inline-flex items-center gap-1"
            >
              <span>Full-Page Sample Report</span>
              <ExternalLink className="w-3 h-3 text-emerald-400" />
            </button>
            <a href="#data-trust" className="hover:text-emerald-400 transition">
              Data &amp; Trust
            </a>
            <button
              type="button"
              onClick={() => setIsIcebergModalOpen(true)}
              className="px-2.5 py-1 rounded-md bg-slate-900 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-[11px] font-mono transition flex items-center gap-1 cursor-pointer"
              title="View the 27 Behavioral Economics & Decision Science Dimensions"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Iceberg Lab</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCampaignStudioOpen(true)}
              className="px-2.5 py-1 rounded-md bg-slate-900 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-[11px] font-mono transition flex items-center gap-1 cursor-pointer"
              title="View 6 Ad Variations, Founder Teleprompter & Outreach Playbook"
            >
              <Megaphone className="w-3 h-3 text-emerald-400" />
              <span>Campaigns</span>
            </button>
            <button
              type="button"
              onClick={handleViewPlatform}
              className="text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer font-mono text-[11px]"
              title="Launch the underlying multi-engine software platform"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Platform</span>
            </button>
          </nav>

          {/* Right Action Button & Responsive Menu Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleViewPlatform}
              className="hidden sm:flex lg:hidden min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono font-semibold items-center gap-1 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Platform</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenAuditModal('nav_button')}
              className="min-h-[36px] sm:min-h-[38px] px-2.5 sm:px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] sm:text-xs flex items-center gap-1 cursor-pointer transition shadow-md touch-manipulation active:scale-95 whitespace-nowrap"
            >
              <span>Request Pilot Audit</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button
              type="button"
              data-testid="mobile-nav-menu-toggle"
              aria-expanded={isMobileNavOpen}
              aria-label="Toggle navigation menu"
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
              className="lg:hidden min-h-[36px] sm:min-h-[38px] px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-[11px] sm:text-xs font-mono font-bold flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Menu</span>
              {isMobileNavOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div
            data-testid="mobile-nav-panel"
            className="lg:hidden border-t border-slate-850 bg-slate-950 px-4 py-3 space-y-2 text-xs font-mono"
          >
            <div className="grid grid-cols-2 gap-2">
              <a
                href="#how-it-works"
                onClick={() => setIsMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-emerald-400"
              >
                How It Works
              </a>
              <a
                href="#audit"
                onClick={() => setIsMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-emerald-400"
              >
                Factory Audit
              </a>
              <a
                href="#stakeholders"
                onClick={() => setIsMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-emerald-400"
              >
                By Role
              </a>
              <a
                href="#data-trust"
                onClick={() => setIsMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-emerald-400"
              >
                Data &amp; Trust
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsMobileNavOpen(false);
                  handleOpenSampleReport('mobile_nav');
                }}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-left text-emerald-300 font-bold cursor-pointer"
              >
                View Sample Report
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileNavOpen(false);
                  handleOpenDedicatedSamplePage();
                }}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-emerald-500/30 text-left text-emerald-300 font-bold cursor-pointer flex items-center justify-between"
              >
                <span>Full-Page Sample Report</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileNavOpen(false);
                  handleViewPlatform();
                }}
                className="col-span-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-left text-white font-bold cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Launch Executive Platform View</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ===================================================================== */}
      {/* SECTION 2: HERO                                                       */}
      {/* ===================================================================== */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative">
          {/* Small Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
            <span>FACTORY INVENTORY INTELLIGENCE</span>
          </div>

          {/* Dominant Headline (Configurable via A/B/C Test Variants) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            {HERO_HEADLINE_VARIANTS[headlineVariant].headline}
          </h1>

          {/* Supporting Copy: Phase 9 Concrete 5-Second Factory Pitch */}
          <p
            data-testid="hero-subheadline"
            className="max-w-3xl mx-auto text-base sm:text-lg text-slate-200 leading-relaxed font-normal"
          >
            Start with a 5-column Tally Prime, SAP, or Excel export. Get a ranked list of your non-moving SKUs, carrying-cost exposure, and priority floor investigation targets in 48 hours—reviewed directly by founder C. Jones Snowin.
          </p>

          {/* Primary Choice Architecture: Exactly Two Primary Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleOpenAuditModal('hero_primary')}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition shadow-xl touch-manipulation active:scale-95"
            >
              <span>Request a Pilot Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleOpenSampleReport('hero_secondary')}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-200 font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition touch-manipulation active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>View Sample Report</span>
            </button>
          </div>

          {/* Microcopy & 1-Click Dedicated /audit Sample Report Link Beneath CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 max-w-2xl mx-auto font-mono">
            <span>
              Start with an existing inventory export. Audit scope and data requirements are confirmed before analysis.
            </span>
            <button
              type="button"
              data-testid="open-sample-audit-page-btn"
              onClick={() => {
                if (onOpenSampleAuditPage) {
                  onOpenSampleAuditPage();
                } else {
                  window.location.href = '?view=sample-audit';
                }
              }}
              className="text-emerald-400 hover:text-emerald-300 underline inline-flex items-center gap-1 cursor-pointer font-bold"
            >
              <span>Open Full-Page Sample Report (/audit)</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Hero Visual: Simplified Product-Preview Composition */}
          {/* Inventory export → structured analysis → priority review */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-left shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Inventory Export ➔ Structured Analysis ➔ Priority Review
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                  Illustrative demonstration data
                </span>
              </div>

              {/* 4 Output Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Inventory Analysed</div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-1">₹4,82,50,000</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">12,400 Line Items</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30">
                  <div className="text-[10px] uppercase text-rose-300 font-bold">Potentially Non-Moving</div>
                  <div className="text-xl sm:text-2xl font-black text-rose-400 mt-1">₹18,42,000</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">&gt;180 Days Inactive (24 SKUs)</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30">
                  <div className="text-[10px] uppercase text-amber-300 font-bold">Slow-Moving (90–180d)</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">₹32,60,000</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Velocity Deceleration (41 SKUs)</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30">
                  <div className="text-[10px] uppercase text-emerald-300 font-bold">Priority Action Items</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">18 SKUs</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">76% of Stagnant Capital</div>
                </div>
              </div>

              {/* Velocity Band Breakdown Bar */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Stock Velocity Distribution</span>
                  <span className="text-slate-300">Active: 72% · Slow: 18% · Stagnant: 10%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                  <div className="h-full bg-emerald-500" style={{ width: '72%' }} title="Active 0-90d: 72%" />
                  <div className="h-full bg-amber-500" style={{ width: '18%' }} title="Slow-Moving 90-180d: 18%" />
                  <div className="h-full bg-rose-500" style={{ width: '10%' }} title="Non-Moving >180d: 10%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* INSTANT IN-BROWSER 5-COLUMN CSV AUDIT DROPZONE (PHASE 12)             */}
      {/* ===================================================================== */}
      <InstantAuditDropzone
        onOpenRequestAuditModal={() => handleOpenAuditModal('instant_dropzone')}
      />

      {/* ===================================================================== */}
      {/* SECTION 3: PROBLEM RECOGNITION                                        */}
      {/* ===================================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-900/40 border-y border-slate-850">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              PROBLEM RECOGNITION
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Your Inventory Total Doesn&apos;t Tell the Whole Story.
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Total stock value does not immediately show which items are inactive, where value is
              concentrated, or which SKUs deserve attention first.
            </p>
          </div>

          {/* 4 Core Diagnostic Question Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROBLEM_QUESTIONS.map((item) => (
              <div
                key={item.num}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition"
              >
                <div className="text-xs font-mono font-bold text-amber-400">
                  {item.num}. {item.label}
                </div>
                <h3 className="text-base font-bold text-white">{item.question}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Section Closing Note */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <p className="text-sm font-semibold text-slate-200">
              The information may already exist inside your current inventory records.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 5: HOW IT WORKS                                               */}
      {/* ===================================================================== */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-900/40 border-y border-slate-850">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              THE PROCESS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              From Existing Data to Clear Review Priorities
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              A structured 5-step analysis designed to provide clarity without operational disruption.
            </p>
          </div>

          {/* Horizontal Process on Desktop, Vertical on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="text-lg font-black font-mono text-emerald-400">{step.step}</div>
                  <h3 className="text-base font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{step.detail}</p>
                </div>
                <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-850">
                  {step.context}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 6: AUDIT DELIVERABLES                                         */}
      {/* ===================================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            DEFINED SCOPE &amp; OUTPUTS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            What the Factory Inventory Audit Includes
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            Concrete analytical deliverables prepared for plant leadership and management discussions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AUDIT_DELIVERABLES.map((del, idx) => (
            <div
              key={del.title}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition"
            >
              <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                Item 0{idx + 1}
              </div>
              <h3 className="text-base font-bold text-white">{del.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{del.description}</p>
            </div>
          ))}
        </div>

        {/* Clear Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center max-w-3xl mx-auto">
          <p className="text-xs text-slate-400 leading-relaxed">
            The audit identifies patterns and review priorities based on the supplied data. It does not
            guarantee recovery, replace operational judgement, or make inventory-disposal decisions.
          </p>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 7: SAMPLE AUDIT (INTERACTIVE 2-MODE RECONCILED DATA SWITCHER) */}
      {/* ===================================================================== */}
      <section id="audit" className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-900/40 border-y border-slate-850">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              RECONCILED DEMONSTRATION DATA • ZERO PLACEHOLDERS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              See What a Factory Audit Looks Like
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Toggle between the live 20-SKU platform sandbox (computed deterministically by the P1–P4 engines) and the 12,400-line mid-sized auto-component plant benchmark.
            </p>
          </div>

          {/* Premium Report Preview Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase block">
                  Audit Findings Summary Template
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  {activeSampleMode.badge}
                </span>
              </div>

              {/* 2-Mode Sample Data Switcher (Aligned with /audit & SampleAuditReportModal) */}
              <div
                role="tablist"
                aria-label="Sample Audit Dataset Mode"
                className="flex flex-wrap items-center gap-2 font-mono text-xs"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={sampleModeId === 'illustrative_12400'}
                  data-testid="sample-mode-illustrative"
                  onClick={() => {
                    setSampleModeId('illustrative_12400');
                    setSampleTablePage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition ${
                    sampleModeId === 'illustrative_12400'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Mode A: 12,400-SKU Plant Case
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={sampleModeId === 'sandbox_20'}
                  data-testid="sample-mode-sandbox"
                  onClick={() => {
                    setSampleModeId('sandbox_20');
                    setSampleTablePage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition ${
                    sampleModeId === 'sandbox_20'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Mode B: 20-SKU Sandbox
                </button>
              </div>
            </div>

            {/* Reconciled 6-Card Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Inventory Analysed</div>
                <div
                  data-testid="sample-card-book-value"
                  className="text-base sm:text-lg font-black text-white mt-0.5"
                >
                  {activeSampleMode.totalBookValueFormatted}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Total Book Valuation</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Items Reviewed</div>
                <div
                  data-testid="sample-card-skus-evaluated"
                  className="text-base sm:text-lg font-black text-white mt-0.5"
                >
                  {activeSampleMode.skusEvaluatedText}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">100% Line-Item Coverage</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30">
                <div className="text-[10px] text-rose-300 uppercase font-bold">Potentially Non-Moving</div>
                <div
                  data-testid="sample-card-dead-stock"
                  className="text-base sm:text-lg font-black text-rose-400 mt-0.5"
                >
                  {activeSampleMode.deadStockValueFormatted}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {activeSampleMode.deadStockSubtext}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30">
                <div className="text-[10px] text-amber-300 uppercase font-bold">Slow-Moving</div>
                <div
                  data-testid="sample-card-slow-stock"
                  className="text-base sm:text-lg font-black text-amber-400 mt-0.5"
                >
                  {activeSampleMode.slowMovingValueFormatted}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {activeSampleMode.slowMovingSubtext}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30">
                <div className="text-[10px] text-emerald-300 uppercase font-bold">Priority Review</div>
                <div
                  data-testid="sample-card-priority-skus"
                  className="text-base sm:text-lg font-black text-emerald-400 mt-0.5"
                >
                  {activeSampleMode.prioritySkusHeadline}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {activeSampleMode.prioritySkusSubtext}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30">
                <div className="text-[10px] text-cyan-300 uppercase font-bold">Highest-Value Category</div>
                <div
                  data-testid="sample-card-top-category"
                  className="text-base sm:text-lg font-black text-cyan-300 mt-0.5"
                >
                  {activeSampleMode.topCategoryName}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {activeSampleMode.topCategorySubtext}
                </div>
              </div>
            </div>

            {/* Dynamic Velocity Distribution Chart & Paginated Priority SKU Table */}
            <div
              data-testid="sample-mode-dynamic-chart"
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className="font-bold text-slate-200 uppercase">
                  {sampleModeId === 'illustrative_12400'
                    ? 'Mode A Velocity Distribution (12,400 Line Items · ₹4,82,50,000)'
                    : 'Mode B Velocity Distribution (20-SKU Sandbox · ₹6,45,650)'}
                </span>
                <span className="text-emerald-300">
                  {sampleModeId === 'illustrative_12400'
                    ? 'Active (<90d): 89.4% · Slow (90–180d): 6.8% · Non-Moving (>180d): 3.8%'
                    : 'Active (<90d): 55.5% · Slow (90–179d): 9.9% · Non-Moving (>180d): 34.6%'}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden flex border border-slate-800">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: sampleModeId === 'illustrative_12400' ? '89.4%' : '55.5%' }}
                />
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: sampleModeId === 'illustrative_12400' ? '6.8%' : '9.9%' }}
                />
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: sampleModeId === 'illustrative_12400' ? '3.8%' : '34.6%' }}
                />
              </div>

              {/* Paginated Top Priority SKUs Preview */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="text-slate-400">
                    Flagged Priority SKUs (Page {sampleTablePage} of 2)
                  </span>
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      data-testid="sample-table-page-1-btn"
                      onClick={() => setSampleTablePage(1)}
                      className={`px-2 py-0.5 rounded border cursor-pointer ${
                        sampleTablePage === 1
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Page 1
                    </button>
                    <button
                      type="button"
                      data-testid="sample-table-page-2-btn"
                      onClick={() => setSampleTablePage(2)}
                      className={`px-2 py-0.5 rounded border cursor-pointer ${
                        sampleTablePage === 2
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Page 2
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {(sampleModeId === 'illustrative_12400'
                    ? sampleTablePage === 1
                      ? [
                          {
                            code: 'PRG-4402-SS',
                            name: 'CNC Machined Flange Housing',
                            val: '₹7,77,000',
                            idle: '312d inactive · ₹1,70,940/yr burn',
                          },
                          {
                            code: 'HSG-910-ALU',
                            name: 'Die-Cast Gearbox Cover Housing',
                            val: '₹4,18,000',
                            idle: '196d inactive · ₹91,960/yr burn',
                          },
                        ]
                      : [
                          {
                            code: 'SHF-304-EN24',
                            name: 'Induction Hardened Drive Shaft',
                            val: '₹3,43,000',
                            idle: '248d inactive · ₹75,460/yr burn',
                          },
                          {
                            code: 'BRG-6205-ZZ',
                            name: 'Sealed Spindle Bearing (Item 07 Reserve)',
                            val: '₹54,400',
                            idle: '214d inactive · Retain 15 pcs reserve',
                          },
                        ]
                    : sampleTablePage === 1
                    ? [
                        {
                          code: 'FG-VALVE-90',
                          name: 'High-Pressure Control Valve Assembly',
                          val: '₹62,000',
                          idle: '320d inactive · Non-Moving (>180d)',
                        },
                        {
                          code: 'RM-CR-COIL',
                          name: 'Cold Rolled Steel Slit Coil 1.6mm',
                          val: '₹45,000',
                          idle: '295d inactive · Non-Moving (>180d)',
                        },
                      ]
                    : [
                        {
                          code: 'FG-GEAR-210',
                          name: 'Helical Gearbox Sub-Assembly',
                          val: '₹42,000',
                          idle: '260d inactive · Non-Moving (>180d)',
                        },
                        {
                          code: 'SP-HYD-SEAL',
                          name: 'Hydraulic Press Cylinder Seal Kit',
                          val: '₹38,500',
                          idle: '132d inactive · Slow-Moving (90–179d)',
                        },
                      ]
                  ).map((item) => (
                    <div
                      key={item.code}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-white">{item.code}</span>{' '}
                        <span className="text-slate-400 font-sans">· {item.name}</span>
                        <div className="text-[10px] text-rose-300 mt-0.5">{item.idle}</div>
                      </div>
                      <div className="text-right font-bold text-emerald-300 shrink-0">{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA to open full modal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-850">
              <span className="text-[11px] text-slate-400 font-mono">
                Click below to review the multi-page illustrative report with SKU breakdowns and 2-page PDF briefing.
              </span>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleOpenDedicatedSamplePage}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Full-Page Sample Report (/audit)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenSampleReport('sample_section')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>View Sample Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 8: WHY NOT AN ERP REPLACEMENT                                */}
      {/* ===================================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Add Analytical Visibility Without Replacing Existing Systems
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Operationalyst is designed to analyse approved operational exports and make review priorities
            easier to see. It does not need to replace the systems the team already uses.
          </p>
        </div>

        {/* Visual Flow: ERP / Excel / Inventory Export → Operationalyst → Structured Inventory Review */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Current Tools</div>
              <div className="text-sm font-bold text-white">ERP / Excel / Inventory Export</div>
              <p className="text-[11px] text-slate-400 font-sans">
                Tally Prime, SAP, Busy, or operational warehouse spreadsheets
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5">
              <div className="text-[10px] text-emerald-400 font-bold uppercase">Analytical Layer</div>
              <div className="text-sm font-bold text-white">Operationalyst</div>
              <p className="text-[11px] text-slate-400 font-sans">
                Velocity classification, dormancy algorithms, and risk priorities
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-1.5">
              <div className="text-[10px] text-cyan-400 font-bold uppercase">Operational Output</div>
              <div className="text-sm font-bold text-white">Structured Inventory Review</div>
              <p className="text-[11px] text-slate-400 font-sans">
                Priority discussions, vendor contra targets, and review standups
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* B2B BEHAVIORAL ARCHITECTURE & STAKEHOLDER LENSES                     */}
      {/* ===================================================================== */}
      <section id="stakeholders" className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <B2BBehavioralSystem
          onRequestAudit={(source, persona) =>
            handleOpenAuditModal(source, persona || 'GENERAL', auditModalDiagnostic)
          }
          onViewSampleReport={(source) => handleOpenSampleReport(source)}
          onOpenIcebergModal={() => setIsIcebergModalOpen(true)}
        />
      </section>

      {/* ===================================================================== */}
      {/* SECTION 9: EXPLAINABLE METHODOLOGY                                    */}
      {/* ===================================================================== */}
      <section id="explainable" className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-900/40 border-y border-slate-850">
        <div id="methodology" className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              TRANSPARENT METHODOLOGY
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Built Around Explainable Inventory Analysis
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Every finding must be linked to the supplied data, the agreed definitions and documented assumptions.
            </p>
          </div>

          {/* Collapsible 6 Methodology Stages Drawer with Always-Visible 6-Pill Summary Strip */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            {/* Phase 11: Crisp 6-Pill Summary Strip (Always Visible Even When Collapsed) */}
            <div
              data-testid="methodology-6-pill-summary-strip"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pb-3 border-b border-slate-800/80"
            >
              {METHODOLOGY_STAGES.map((stg) => (
                <div
                  key={stg.stage}
                  data-testid={`methodology-pill-${stg.stage.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-200 leading-snug flex items-start gap-2"
                >
                  <span className="text-emerald-400 font-bold shrink-0">{stg.stage}:</span>
                  <span className="text-slate-300">{stg.pillLabel.replace(`${stg.stage}: `, '')}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  6-Stage Deterministic Audit Pipeline (Validation → Ageing → Pareto Priority)
                </div>
                <p className="text-xs text-slate-400">
                  Traceable formula chain: ΔDays = AsOfDate − LastMovementDate · Carrying Cost = BookValue × HoldingRate%.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  data-testid="toggle-methodology-stages-drawer"
                  aria-expanded={isMethodologyDrawerOpen}
                  onClick={() => setIsMethodologyDrawerOpen((prev) => !prev)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition"
                >
                  {isMethodologyDrawerOpen ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Collapse 6-Stage Breakdown</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Expand 6-Stage Analytical Methodology Details</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  data-testid="read-methodology-btn"
                  onClick={() => {
                    trackEvent('methodology_opened');
                    setIsMethodologyDrawerOpen(true);
                    setIsMethodologyOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 cursor-pointer transition"
                >
                  <span>Read the Methodology ➔</span>
                </button>
              </div>
            </div>

            {showMethodologyStagesDrawer && (
              <div
                data-testid="methodology-stages-grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-3 border-t border-slate-850"
              >
                {METHODOLOGY_STAGES.map((stg) => (
                  <div
                    key={stg.stage}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
                  >
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                      {stg.stage}
                    </span>
                    <h3 className="text-sm font-bold text-white">{stg.name}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{stg.summary}</p>
                    <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] font-mono">
                      <div className="text-emerald-300">
                        <span className="text-slate-400">Formula: </span>
                        <code>{stg.formula}</code>
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">Inputs: </span>
                        <span>{stg.inputs}</span>
                      </div>
                      <div className="text-cyan-300">
                        <span className="text-slate-400">Output: </span>
                        <span>{stg.outputs}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 10: DATA AND TRUST                                            */}
      {/* ===================================================================== */}
      <section id="data-trust" className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            DATA GOVERNANCE &amp; TRUST
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Know What Happens Before Sharing Data
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Visitors must have authorized permission to share uploaded information. Review our clear technical policies below.
          </p>
        </div>

        {/* Phase 9: High-Contrast 1-Sentence Plain-English Privacy Guarantee Banner */}
        <div
          data-testid="landing-plain-english-privacy-banner"
          className="p-4 sm:p-5 rounded-2xl bg-emerald-950/35 border border-emerald-500/40 flex items-start gap-3.5 shadow-lg"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-sans">
            <strong className="text-emerald-300 font-bold">Plain-English Privacy Guarantee:</strong>{' '}
            Strip vendor and customer names before sending. Reviewed only by founder C. Jones Snowin and purged within 14 days (or immediately after your call) with a cryptographic Deletion Certificate (<code className="font-mono text-emerald-300 font-bold">DELCERT-...</code>).
          </p>
        </div>

        {/* Collapsible 7-Point Technical Data Governance FAQ Drawer */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-mono font-bold text-white uppercase">
                7-Point Technical Data Governance &amp; Redaction Policy
              </div>
              <p className="text-xs text-slate-400">
                Covers required 5-column schema, field anonymization, isolated processing, and 14-day automatic purge.
              </p>
            </div>
            <button
              type="button"
              data-testid="toggle-governance-faq-drawer"
              aria-expanded={showGovernanceFaqDrawer}
              onClick={() => setShowGovernanceFaqDrawer((prev) => !prev)}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition shrink-0"
            >
              {showGovernanceFaqDrawer ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Collapse 7-Point Technical Governance FAQ</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Full 7-Point Technical Data Governance FAQ</span>
                </>
              )}
            </button>
          </div>

          {showGovernanceFaqDrawer && (
            <div
              data-testid="governance-faq-accordion-list"
              className="space-y-2.5 pt-3 border-t border-slate-800"
            >
              {DATA_TRUST_ITEMS.map((item, idx) => {
                const isOpen = openTrustIndex === idx;
                return (
                  <div
                    key={item.question}
                    className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleTrust(idx)}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-900 transition"
                      aria-expanded={isOpen}
                    >
                      <span className="text-xs sm:text-sm font-bold text-white font-mono">
                        {item.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 text-xs text-slate-300 leading-relaxed font-sans border-t border-slate-850 pt-3">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Downloadable 5-Column Pilot Audit Data Kit */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase">
              5-Column Pilot Audit Data Kit (Tally Prime / SAP / Busy / Excel)
            </div>
            <p className="text-xs text-slate-300">
              Inspect the exact 5-column export structure (<code className="font-mono text-emerald-300">Part_ID, Part_Description, Closing_Stock_Qty, Unit_Cost_INR, Last_Movement_Date</code>) and part-number anonymization guide before requesting an audit.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                trackServerFunnelEvent('DATA_KIT_DOWNLOADED', {
                  sourceSection: 'data_trust_xlsx',
                });
                downloadPilotDataKitXlsx();
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono inline-flex items-center gap-1.5 cursor-pointer transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download 5-Column Data Guide (.XLSX)</span>
            </button>
            <button
              type="button"
              onClick={() => downloadAuditTemplate('data_trust_csv')}
              className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs font-mono inline-flex items-center gap-1.5 cursor-pointer transition"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Download Blank CSV Template</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 11: FOUNDER-LED PILOT                                         */}
      {/* ===================================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-900/40 border-y border-slate-850">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>FOUNDER-LED PILOT PROGRAM</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Help Shape Operationalyst With a Real Manufacturing Use Case
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Operationalyst is currently seeking manufacturing teams willing to evaluate a structured
            Factory Inventory Audit and provide direct feedback on its usefulness, clarity and relevance.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono text-center">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">01</span>
              <span>Founder-led review</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">02</span>
              <span>Defined audit scope</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">03</span>
              <span>Clear deliverables</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">04</span>
              <span>Structured findings</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-emerald-400 font-bold block mb-1">05</span>
              <span>No auto-subscription</span>
            </div>
          </div>

          {/* Genuine Scarcity Text */}
          <p className="text-xs font-mono text-amber-400">
            Pilot capacity is limited because submissions are manually reviewed.
          </p>

          <div>
            <button
              type="button"
              onClick={() => handleOpenAuditModal('founder_pilot_section')}
              className="min-h-[48px] px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base inline-flex items-center justify-center gap-2 cursor-pointer transition shadow-xl touch-manipulation active:scale-95"
            >
              <span>Apply for a Pilot Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 13: FOUNDER SECTION                                           */}
      {/* ===================================================================== */}
      <section id="about" className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-900/40 border-t border-slate-850">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              ABOUT THE FOUNDER
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Built to Make Operational Data Easier to Act On
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 max-w-xl mx-auto text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold flex items-center justify-center font-mono text-base">
                CJ
              </div>
              <div>
                <h3 className="font-bold text-white text-base">C. Jones Snowin</h3>
                <div className="text-xs text-slate-400 font-mono">
                  Operations &amp; Manufacturing Analytics Builder
                </div>
              </div>
            </div>

            <p
              data-testid="founder-executive-signoff"
              className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans"
            >
              &ldquo;
              {FOUNDER_EXECUTIVE_SIGNOFF ||
                'Operationalyst isolates stagnant working capital, 22% annual carrying-cost burn, and Pareto 80/20 floor review priorities directly from standard 5-column Tally Prime, SAP, Busy, or Excel stock exports—with zero ERP integration or operational disruption.'}
              &rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono pt-3 border-t border-slate-850 text-slate-300">
              <a
                href="mailto:joneszz2004@gmail.com"
                data-testid="founder-contact-email-link"
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 hover:text-white inline-flex items-center gap-2 transition"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Direct Founder Desk (C. Jones Snowin)</span>
              </a>
              <a
                href="https://linkedin.com/in/c-jones-snowin"
                target="_blank"
                rel="noreferrer"
                data-testid="founder-contact-linkedin-link"
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:text-white inline-flex items-center gap-2 transition"
              >
                <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                <span>LinkedIn Profile (C. Jones Snowin)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 14: FAQ                                                       */}
      {/* ===================================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Clear Answers for Manufacturing Leaders
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-850 transition"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-white font-mono">
                    {idx + 1}. {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed font-sans border-t border-slate-850 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 15: FINAL CTA                                                 */}
      {/* ===================================================================== */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider">
            FACTORY INVENTORY AUDIT
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Turn Existing Inventory Data Into Clearer Action Priorities.
          </h2>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Start with a defined audit scope and understand exactly what will be analysed before sharing data.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => handleOpenAuditModal('final_cta')}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition shadow-xl touch-manipulation active:scale-95"
            >
              <span>Request a Pilot Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleOpenSampleReport('final_cta')}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition touch-manipulation active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>View Sample Report</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            No automatic subscription. Scope and data requirements are confirmed before analysis.
          </p>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 16: FOOTER                                                    */}
      {/* ===================================================================== */}
      <footer className="border-t border-slate-850 bg-slate-950 py-10 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong className="text-white">Operationalyst</strong> · Factory Inventory Intelligence Platform. Built by C. Jones Snowin.
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono">
              <a href="#how-it-works" className="hover:text-white transition">
                How It Works
              </a>
              <a href="#audit" className="hover:text-white transition">
                Factory Audit
              </a>
              <button
                type="button"
                onClick={() => handleOpenSampleReport('footer')}
                className="hover:text-white transition cursor-pointer"
              >
                Sample Report
              </button>
              <a
                href="#methodology"
                data-testid="footer-methodology-link"
                onClick={() => {
                  setIsMethodologyDrawerOpen(true);
                  setIsMethodologyOpen(true);
                }}
                className="hover:text-white transition cursor-pointer"
              >
                Methodology
              </a>
              <a href="#data-trust" className="hover:text-white transition">
                Data &amp; Trust
              </a>
              <a href="#about" className="hover:text-white transition">
                About
              </a>
              <a href="mailto:joneszz2004@gmail.com" className="hover:text-white transition">
                Contact
              </a>
              <button
                type="button"
                onClick={handleViewPlatform}
                className="text-emerald-400 hover:text-emerald-300 font-bold transition cursor-pointer flex items-center gap-1"
              >
                <Activity className="w-3 h-3" />
                <span>View Platform</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-850 pt-4 text-[11px] text-slate-400 font-mono">
            <div>
              Operationalyst findings depend on the quality, completeness and definitions of the supplied data.
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                data-testid="footer-privacy-policy-btn"
                onClick={() => handleOpenLegalModal('privacy')}
                className="text-slate-400 hover:text-emerald-300 transition underline underline-offset-4 cursor-pointer"
              >
                Privacy &amp; Data Governance Policy
              </button>
              <span>·</span>
              <button
                type="button"
                data-testid="footer-terms-of-service-btn"
                onClick={() => handleOpenLegalModal('terms')}
                className="text-slate-400 hover:text-emerald-300 transition underline underline-offset-4 cursor-pointer"
              >
                Pilot Audit Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FactoryAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        sourceView={auditModalSource}
        initialBuyerPersona={auditModalPersona}
        diagnosticAttachment={auditModalDiagnostic}
      />

      <SampleAuditReportModal
        isOpen={isSampleReportOpen}
        onClose={() => setIsSampleReportOpen(false)}
        onRequestAudit={() => {
          setIsSampleReportOpen(false);
          setIsAuditModalOpen(true);
        }}
      />

      <InventoryChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        onRequestAudit={() => {
          setIsChecklistOpen(false);
          setIsAuditModalOpen(true);
        }}
      />

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
        onRequestAudit={() => {
          setIsMethodologyOpen(false);
          setIsAuditModalOpen(true);
        }}
      />

      <BehavioralIcebergModal
        isOpen={isIcebergModalOpen}
        onClose={() => setIsIcebergModalOpen(false)}
        onSelectVariant={(v) => {
          setHeadlineVariant(v);
          setIsIcebergModalOpen(false);
        }}
        currentVariant={headlineVariant}
      />

      <LegalGovernanceModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
        onRequestAudit={() => handleOpenAuditModal('legal_modal')}
      />

      {isCampaignStudioOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-6xl w-full my-6 max-h-[92vh] overflow-y-auto">
            <CampaignAssetStudio onClose={() => setIsCampaignStudioOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
