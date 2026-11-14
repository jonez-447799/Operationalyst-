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
