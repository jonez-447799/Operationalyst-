/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
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
  Mail,
  Building2,
  Clock,
  Sparkles,
  Megaphone,
  Menu,
  X,
  SlidersHorizontal,
  Scale,
  Truck,
  Package,
} from 'lucide-react';
import {
  HERO_HEADLINE_VARIANTS,
  ACTIVE_DEFAULT_VARIANT,
  PROBLEM_QUESTIONS,
  PROCESS_STEPS,
  DATA_TRUST_ITEMS,
  FAQ_ITEMS,
} from './homepageConfig';
import { SelfAssessmentWidget } from './SelfAssessmentWidget';
import { FactoryAuditModal } from './FactoryAuditModal';
import { SampleAuditReportModal } from './SampleAuditReportModal';
import { InventoryChecklistModal } from './InventoryChecklistModal';
import { MethodologyModal } from './MethodologyModal';
import { B2BBehavioralSystem, BehavioralIcebergModal } from './B2BBehavioralSystem';
import { CampaignAssetStudio } from './CampaignAssetStudio';
import { trackEvent } from '../utils/analytics';

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
  isFounderMode?: boolean;
  onExitFounderMode?: () => void;
}

const ILLUSTRATIVE_HERO_SKUS = [
  {
    sku: 'PRG-4402-SS',
    partName: 'CNC Machined Flange Housing (304 SS)',
    daysInactive: 312,
    qty: '140 pcs',
    capitalLocked: '₹4.85L',
    ruleTriggered: 'ΔDays = 312d (>180d zero-issue rule)',
    priorityAction: 'Verify active BOM & hold next purchase order',
    severity: 'critical' as const,
  },
  {
    sku: 'BRG-6205-ZZ',
    partName: 'Sealed Spindle Bearing Assembly',
    daysInactive: 248,
    qty: '380 pcs',
    capitalLocked: '₹3.40L',
    ruleTriggered: 'ΔDays = 248d · Zero shop-floor requisition',
    priorityAction: 'Check insurance-spare tag vs vendor return',
    severity: 'critical' as const,
  },
  {
    sku: 'HSG-910-ALU',
    partName: 'Die-Cast Gearbox Cover (Batch B-19)',
    daysInactive: 196,
    qty: '95 pcs',
    capitalLocked: '₹2.90L',
    ruleTriggered: 'ΔDays = 196d · Post-revision leftover lot',
    priorityAction: 'Review alternate customer order allocation',
    severity: 'warning' as const,
  },
  {
    sku: 'VLV-220-BRS',
    partName: 'High-Pressure Brass Manifold Valve',
    daysInactive: 184,
    qty: '62 pcs',
    capitalLocked: '₹2.15L',
    ruleTriggered: 'ΔDays = 184d · Crossed 6-month dormancy gate',
    priorityAction: 'Confirm physical bin count before write-down',
    severity: 'warning' as const,
  },
];

export const CommercialLandingPage: React.FC<CommercialLandingPageProps> = ({
  onLaunchEngine,
  onOpenSmartMapper,
  onOpenAuditPage,
  isFounderMode = false,
  onExitFounderMode,
}) => {
  // Modals
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isSampleReportOpen, setIsSampleReportOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isIcebergModalOpen, setIsIcebergModalOpen] = useState(false);
  const [isCampaignStudioOpen, setIsCampaignStudioOpen] = useState(false);

  // Mobile Nav & Optional Diagnostic Toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSelfDiagnostic, setShowSelfDiagnostic] = useState(false);

  // A/B Headline State (Variant A default; switchable in /founder)
  const [headlineVariant, setHeadlineVariant] = useState<'A' | 'B' | 'C'>(ACTIVE_DEFAULT_VARIANT);

  // Accordions
  const [openTrustIndex, setOpenTrustIndex] = useState<number | null>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleOpenAuditModal = (source: string) => {
    trackEvent('hero_primary_cta_clicked', { source });
    setMobileMenuOpen(false);
    setIsAuditModalOpen(true);
  };

  const handleOpenSampleReport = (source: string) => {
    trackEvent('sample_report_clicked', { source });
    setMobileMenuOpen(false);
    setIsSampleReportOpen(true);
  };

  const handleViewPlatform = (
    engine:
      | 'ceo_master'
      | 'standalone_p1'
      | 'standalone_p2'
      | 'standalone_p3'
      | 'standalone_p4'
      | 'standalone_p5'
      | 'merged_suite' = 'ceo_master'
  ) => {
    trackEvent('platform_view_clicked', { engine });
    setMobileMenuOpen(false);
    onLaunchEngine(engine);
  };

  const toggleTrust = (idx: number) => {
    trackEvent('data_trust_opened', { itemIndex: idx });
    setOpenTrustIndex((prev) => (prev === idx ? null : idx));
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  const conciseFaqs = FAQ_ITEMS.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0a0d12] text-stone-100 font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-200">
      {/* Private Founder Studio Bar (Only rendered at /founder or ?founder=1) */}
      {isFounderMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Founder Campaign &amp; A/B Studio (/founder)</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5">
              <span className="text-[10px] text-slate-400 mr-1">Headline:</span>
              {(['A', 'B', 'C'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setHeadlineVariant(v)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                    headlineVariant === v
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsCampaignStudioOpen(true)}
              className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer hover:bg-amber-400 transition"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Campaign Studio</span>
            </button>
            <button
              onClick={() => setIsIcebergModalOpen(true)}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 hover:text-white cursor-pointer transition"
            >
              Buyer Psychology Lab
            </button>
            {onExitFounderMode && (
              <button
                onClick={onExitFounderMode}
                className="px-2 py-1 rounded text-slate-400 hover:text-white cursor-pointer transition"
              >
                Exit Studio
              </button>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TOP NAVIGATION — Calm, 4 Focused Links + Primary Audit Action
         ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#0a0d12]/95 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <a
            href="/"
            className="flex items-center gap-2.5 text-stone-100 hover:opacity-90 transition"
          >
            <div className="w-8 h-8 rounded-md bg-stone-100 text-[#0a0d12] flex items-center justify-center font-black text-sm tracking-tight">
              OP
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-[0.14em] uppercase leading-none">
                Operationalyst
              </span>
              <span className="text-[10px] font-mono text-stone-400 tracking-wide mt-0.5 hidden sm:inline">
                Factory Inventory Intelligence
              </span>
            </div>
          </a>

          {/* Desktop Navigation (4 Clean Items) */}
          <nav className="hidden md:flex items-center gap-7 text-sm text-stone-300 font-medium">
            <a href="#methodology" className="hover:text-white transition">
              Methodology
            </a>
            <a href="#sample-audit" className="hover:text-white transition">
              Sample Audit
            </a>
            <a href="#data-privacy" className="hover:text-white transition">
              Data &amp; Privacy
            </a>
            <a
              href="/platform"
              onClick={(e) => {
                e.preventDefault();
                handleViewPlatform('ceo_master');
              }}
              className="text-stone-300 hover:text-emerald-300 transition inline-flex items-center gap-1.5"
            >
              <span>Platform</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800/90 text-stone-400 border border-slate-700/80">
                Demo
              </span>
            </a>
          </nav>

          {/* Right CTA + Mobile Menu Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleOpenAuditModal('navbar')}
              className="px-4 py-2 rounded-md bg-stone-100 hover:bg-white text-[#0a0d12] font-bold text-xs sm:text-sm transition cursor-pointer shadow-sm"
            >
              Request Factory Audit
            </button>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-md border border-slate-800 text-stone-300 hover:text-white cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Clean Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#0d1118] px-4 py-4 space-y-3 text-sm">
            <a
              href="#methodology"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-stone-200 font-medium"
            >
              Methodology
            </a>
            <a
              href="#sample-audit"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-stone-200 font-medium"
            >
              Sample Audit
            </a>
            <a
              href="#data-privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-stone-200 font-medium"
            >
              Data &amp; Privacy
            </a>
            <button
              onClick={() => handleViewPlatform('ceo_master')}
              className="w-full text-left py-1.5 text-emerald-400 font-semibold flex items-center justify-between cursor-pointer"
            >
              <span>Interactive Platform (/platform)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {onOpenAuditPage && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuditPage();
                }}
                className="w-full text-left py-1.5 text-stone-300 font-medium flex items-center justify-between cursor-pointer"
              >
                <span>Dedicated Pilot Audit Page (/audit)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </header>

      {/* =====================================================================
          BEAT 1: HERO — One Question, Two Actions, One Cropped Visual
         ===================================================================== */}
      <section className="relative border-b border-slate-800/80 py-16 sm:py-24 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-slate-800 bg-[#11161f] text-[11px] font-mono uppercase tracking-[0.16em] text-stone-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Factory Inventory Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-stone-50 leading-[1.12] mb-6">
              {HERO_HEADLINE_VARIANTS[headlineVariant].headline}
            </h1>

            <p className="text-lg sm:text-xl text-stone-300 leading-relaxed mb-4 max-w-2xl">
              Turn existing Tally, SAP, or Excel stock exports into clear review priorities before
              your next management meeting.
            </p>

            <p className="text-sm text-stone-400 leading-relaxed mb-9 max-w-2xl">
              Built for mid-sized discrete manufacturing owners, COOs, and plant heads. Works
              alongside your current ERP — no software integration or floor disruption required.
            </p>

            {/* Strictly TWO Primary Commercial Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-4">
              <button
                onClick={() => handleOpenAuditModal('hero_primary')}
                className="px-6 py-3.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base transition cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
              >
                <span>Request Factory Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleOpenSampleReport('hero_secondary')}
                className="px-6 py-3.5 rounded-md bg-[#121722] hover:bg-[#181f2d] text-stone-100 border border-slate-700/90 font-semibold text-sm sm:text-base transition cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-4 h-4 text-stone-300" />
                <span>View Sample Audit</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-stone-400 font-mono">
              <span>5 standard columns required</span>
              <span className="text-slate-700">·</span>
              <span>Vendor &amp; customer fields can be anonymised</span>
              {onOpenAuditPage && (
                <>
                  <span className="text-slate-700">·</span>
                  <button
                    onClick={onOpenAuditPage}
                    className="text-stone-300 hover:text-white underline underline-offset-4 cursor-pointer"
                  >
                    Read full pilot audit brief (/audit)
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ONE Focused Cropped Product Visual — Priority Dormant SKU Extract */}
          <div className="mt-14 sm:mt-16 rounded-xl border border-slate-800 bg-[#0e131b] shadow-2xl overflow-hidden">
            {/* Top Framing Bar with Unmistakable Demonstration Data Label */}
            <div className="px-4 sm:px-6 py-3.5 bg-[#121824] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-stone-100">
                  Priority SKU Review — Flagged Non-Moving Inventory Extract
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-semibold">
                <span>DEMONSTRATION DATA · ILLUSTRATIVE PLANT EXTRACT</span>
              </div>
            </div>

            {/* Clean 4-Row Cropped Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/90 text-[11px] font-mono uppercase tracking-wider text-stone-400 bg-[#0b0f16]">
                    <th className="py-3 px-4 sm:px-6">SKU / Part Description</th>
                    <th className="py-3 px-4">Inactivity Math</th>
                    <th className="py-3 px-4">Capital Locked</th>
                    <th className="py-3 px-4 sm:px-6">Recommended Monday Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-xs sm:text-sm">
                  {ILLUSTRATIVE_HERO_SKUS.map((row) => (
                    <tr key={row.sku} className="hover:bg-slate-900/40 transition">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-mono font-bold text-stone-100">{row.sku}</div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          {row.partName} · <span className="font-mono">{row.qty}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                            row.severity === 'critical'
                              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/25'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/25'
                          }`}
                        >
                          {row.daysInactive} days inactive
                        </span>
                        <div className="text-[11px] font-mono text-stone-400 mt-1">
                          {row.ruleTriggered}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-100 whitespace-nowrap">
                        {row.capitalLocked}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-stone-300 text-xs sm:text-sm">
                        {row.priorityAction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Context Strip */}
            <div className="px-4 sm:px-6 py-3 bg-[#0b0f16] border-t border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-400">
              <span>
                Instead of handing plant leadership a 4,000-line stock ledger, Operationalyst
                isolates the exact 15–25 SKUs carrying concentrated dormant capital.
              </span>
              <button
                onClick={() => handleOpenSampleReport('hero_extract_footer')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold whitespace-nowrap inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect full sample findings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BEAT 2: THE PROBLEM — Why Standard Stock Sheets Fail Leadership
         ===================================================================== */}
      <section id="problem" className="py-20 sm:py-24 border-b border-slate-800/80 bg-[#0c1017]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-mono uppercase tracking-[0.16em] text-stone-400 mb-3">
              01 · The Operational Blind Spot
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-stone-50 tracking-tight leading-tight mb-4">
              Every plant has stock reports. Few show where working capital actually stopped moving.
            </h2>
            <p className="text-stone-300 text-base leading-relaxed">
              Closing stock valuation in Tally or ERP tells finance the total rupee balance on the
              floor — not which specific parts quietly crossed 180 or 365 days without a single
              shop-floor issue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROBLEM_QUESTIONS.map((item) => (
              <div
                key={item.num}
                className="p-6 rounded-xl bg-[#111620] border border-slate-800/90 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-3">
                    <span>QUESTION {item.num}</span>
                    <span className="uppercase tracking-wider text-stone-500">{item.label}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-100 mb-2.5">
                    {item.question}
                  </h3>
                  <p className="text-sm text-stone-300 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quiet Collapsible 60-Second Plant Self-Assessment */}
          <div className="mt-8 rounded-xl border border-slate-800 bg-[#0e131b] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
                  Optional 60-Second Check
                </div>
                <div className="text-base font-bold text-stone-100">
                  Unsure whether your stock ledger warrants a formal audit?
                </div>
                <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
                  Score 5 operational inventory visibility signals across stores, procurement, and
                  monthly reviews.
                </p>
              </div>
              <button
                onClick={() => setShowSelfDiagnostic((prev) => !prev)}
                className="px-4 py-2.5 rounded-md bg-slate-800/90 hover:bg-slate-800 text-stone-100 border border-slate-700 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-center"
              >
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <span>{showSelfDiagnostic ? 'Hide Self-Check' : 'Run 5-Question Self-Check'}</span>
              </button>
            </div>

            {showSelfDiagnostic && (
              <div className="mt-6 pt-6 border-t border-slate-800">
                <SelfAssessmentWidget
                  onRequestAudit={() => handleOpenAuditModal('self_assessment')}
                  onOpenChecklist={() => setIsChecklistOpen(true)}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          BEAT 3: EXPLAINABLE METHODOLOGY — Transparent Rules, Zero Black Box
         ===================================================================== */}
      <section id="methodology" className="py-20 sm:py-24 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-mono uppercase tracking-[0.16em] text-emerald-400 mb-3">
              02 · Explainable Operational Logic
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-stone-50 tracking-tight leading-tight mb-4">
              Every flagged SKU and dispatch metric shows the exact math behind it.
            </h2>
            <p className="text-stone-300 text-base leading-relaxed">
              Plant heads and stores managers reject opaque software scores when nobody can explain
              why an item turned red. Operationalyst documents explicit, auditable thresholds that
              your engineering and finance teams can verify row by row.
            </p>
          </div>

          {/* Two Explainable Rule Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-xl bg-[#10151f] border border-slate-800">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-300 mb-2">
                Inventory Dormancy &amp; Pareto Rule
              </div>
              <h3 className="text-lg font-bold text-stone-100 mb-2">
                Explicit Inactivity Day &amp; Exposure Calculation
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed mb-4">
                Each part is classified using agreed plant thresholds (180 days zero-issue default,
                calibrated to your lead times) with explicit carve-outs for critical machine
                insurance spares.
              </p>
              <div className="p-3.5 rounded-lg bg-[#0a0d12] border border-slate-800/90 font-mono text-xs text-stone-300 space-y-1.5">
                <div>ΔDays = Audit_Date − Last_Shop_Issue_Date</div>
                <div>Dormant_Exposure (₹) = Closing_Qty × Unit_Valuation</div>
                <div className="text-emerald-400">
                  → Ranked by Pareto 80/20 rupee concentration for floor verification
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#10151f] border border-slate-800">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-300 mb-2">
                Dispatch Reliability Rule (OTIF — On-Time In-Full)
              </div>
              <h3 className="text-lg font-bold text-stone-100 mb-2">
                The Dual-Gate Mathematical Rule
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed mb-4">
                Inside the full platform, customer delivery reliability never hides partial
                shipments behind averages. A dispatch passes only when both operational gates clear
                simultaneously:
              </p>
              <div className="p-3.5 rounded-lg bg-[#0a0d12] border border-slate-800/90 font-mono text-xs text-stone-300 space-y-1.5">
                <div>Gate 1 (Schedule): Actual_Gate_Out ≤ Promised_Date</div>
                <div>Gate 2 (Quantity): Dispatched_Units == Ordered_Units</div>
                <div className="text-emerald-400">
                  → Dual-Gate Pass = Gate 1 AND Gate 2 (plain-English delay cause logged)
                </div>
              </div>
            </div>
          </div>

          {/* 5-Step Audit Workflow */}
          <div className="rounded-xl border border-slate-800 bg-[#0e131b] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-bold text-stone-100">
                  How a 5-Step Pilot Inventory Audit Runs
                </h3>
                <p className="text-xs sm:text-sm text-stone-400">
                  Zero ERP integration. Starts from a single approved spreadsheet export.
                </p>
              </div>
              <button
                onClick={() => setIsMethodologyOpen(true)}
                className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
              >
                <span>View 6-Stage Specification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {PROCESS_STEPS.map((s) => (
                <div
                  key={s.step}
                  className="p-4 rounded-lg bg-[#121824] border border-slate-800/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-mono font-bold text-emerald-400 mb-1.5">
                      STEP {s.step}
                    </div>
                    <div className="text-base font-bold text-stone-100 mb-1.5">{s.title}</div>
                    <p className="text-xs text-stone-300 leading-relaxed mb-3">{s.detail}</p>
                  </div>
                  <div className="text-[11px] font-mono text-stone-400 pt-2 border-t border-slate-800">
                    {s.context}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BEAT 4: SAMPLE AUDIT DELIVERABLE — Concrete Output Before Any Call
         ===================================================================== */}
      <section id="sample-audit" className="py-20 sm:py-24 border-b border-slate-800/80 bg-[#0c1017]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <div className="text-xs font-mono uppercase tracking-[0.16em] text-stone-400 mb-3">
                03 · Concrete Audit Deliverable
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-stone-50 tracking-tight leading-tight mb-3">
                See the exact findings brief your team receives in 48–72 hours.
              </h2>
              <p className="text-stone-300 text-base leading-relaxed">
                Before sharing any plant file, inspect a complete illustrative audit package so your
                finance and stores leads know what will be delivered.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold self-start lg:self-auto">
              <span>DEMONSTRATION SCENARIO · SAMPLE DELIVERABLE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="p-6 rounded-xl bg-[#111620] border border-slate-800">
              <div className="text-xs font-mono text-emerald-400 uppercase mb-2">
                Deliverable 01 · Executive Brief
              </div>
              <h3 className="text-lg font-bold text-stone-100 mb-2">
                2-Page Management Findings PDF
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                Ageing distribution across 0–90d, 91–180d, 181–365d, and &gt;365d brackets, Pareto
                capital concentration, data-quality validation notes, and explicit scope
                assumptions.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#111620] border border-slate-800">
              <div className="text-xs font-mono text-emerald-400 uppercase mb-2">
                Deliverable 02 · Working File
              </div>
              <h3 className="text-lg font-bold text-stone-100 mb-2">
                Ranked Priority SKU Action Sheet (.xlsx)
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                Clean, sortable spreadsheet isolating the top 15–25 non-moving and slow-moving SKUs
                by rupee exposure for stores verification, BOM substitution, or vendor return review.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#111620] border border-slate-800">
              <div className="text-xs font-mono text-emerald-400 uppercase mb-2">
                Deliverable 03 · Review Session
              </div>
              <h3 className="text-lg font-bold text-stone-100 mb-2">
                30-Minute Findings Walkthrough
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                Focused 1-on-1 review directly with founder Jonez Snowin to walk through flagged
                categories, reserve-spare exclusions, and practical next floor checks.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={() => handleOpenSampleReport('deliverable_section')}
              className="px-5 py-3 rounded-md bg-stone-100 hover:bg-white text-[#0a0d12] font-bold text-sm transition cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Open Interactive Sample Audit Report</span>
            </button>
            <button
              onClick={() => setIsChecklistOpen(true)}
              className="px-5 py-3 rounded-md bg-[#121722] hover:bg-[#181f2d] text-stone-200 border border-slate-700 font-semibold text-sm transition cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Check 5 Required Spreadsheet Columns</span>
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BEAT 5: DATA, PRIVACY & CONFIDENTIALITY — Earn Trust Before Upload
         ===================================================================== */}
      <section id="data-privacy" className="py-20 sm:py-24 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <div className="text-xs font-mono uppercase tracking-[0.16em] text-emerald-400 mb-3">
                04 · Data Governance &amp; Confidentiality
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-50 tracking-tight leading-tight mb-4">
                Built so you never have to expose sensitive commercial relationships.
              </h2>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed mb-6">
                Manufacturing stock files are commercially sensitive. An initial pilot audit needs
                only 5 operational columns — supplier names, customer accounts, and proprietary
                drawing numbers can be stripped before sharing.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-stone-300">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-stone-100">Anonymisation friendly:</strong> Mask vendor
                    codes, customer names, or proprietary descriptions prior to export.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-stone-100">Sole founder access:</strong> Reviewed only
                    by Jonez Snowin; never shared with external brokers or used to train public
                    models.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-stone-100">14-day retention &amp; 24h purge:</strong>{' '}
                    Pilot files are purged after your review or within 24 hours of emailing{' '}
                    <a
                      href="mailto:joneszz2004@gmail.com"
                      className="text-emerald-400 hover:underline font-mono"
                    >
                      joneszz2004@gmail.com
                    </a>
                    .
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-2.5">
              {DATA_TRUST_ITEMS.map((item, idx) => {
                const isOpen = openTrustIndex === idx;
                return (
                  <div
                    key={item.question}
                    className="rounded-lg border border-slate-800 bg-[#10151f] overflow-hidden"
                  >
                    <button
                      onClick={() => toggleTrust(idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition"
                    >
                      <span className="text-sm font-semibold text-stone-100">{item.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs sm:text-sm text-stone-300 leading-relaxed border-t border-slate-800/70 pt-3">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BEAT 6: CROPPED PLATFORM PREVIEW -> "VIEW PLATFORM" (/platform)
         ===================================================================== */}
      <section
        id="platform-preview"
        className="py-20 sm:py-24 border-b border-slate-800/80 bg-[#0c1017]"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="text-xs font-mono uppercase tracking-[0.16em] text-stone-400 mb-3">
                05 · Beyond the Initial Audit
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-stone-50 tracking-tight leading-tight mb-3">
                Explore the Operationalyst Platform when you are ready for continuous tracking.
              </h2>
              <p className="text-stone-300 text-base leading-relaxed">
                Most engagements begin with a single spreadsheet audit. For teams that want ongoing
                visibility across dead stock, dispatch reliability, freight leakage, and bin
                accuracy, explore our interactive demonstration suite.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold self-start lg:self-auto">
              <span>DEMONSTRATION ENVIRONMENT · SIMULATED PLANT DATA</span>
            </div>
          </div>

          {/* 3 Clean Cropped Module Slices (Not 30 Widgets at Once) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {/* Slice 1 */}
            <div className="rounded-xl border border-slate-800 bg-[#111620] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-stone-400 border border-slate-800">
                    Demo Module 01
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-100 mb-2">
                  Dead Stock &amp; Cash Recovery
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                  Isolates &gt;180-day zero-movement inventory, carrying-cost bleed, and Pareto SKU
                  liquidation or substitution priorities.
                </p>
              </div>
              <button
                onClick={() => handleViewPlatform('standalone_p1')}
                className="pt-3 border-t border-slate-800 text-xs font-mono font-semibold text-amber-300 hover:text-amber-200 inline-flex items-center justify-between w-full cursor-pointer"
              >
                <span>Preview Dead Stock Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Slice 2 */}
            <div className="rounded-xl border border-slate-800 bg-[#111620] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-stone-400 border border-slate-800">
                    Demo Module 02
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-100 mb-2">
                  Dispatch Reliability (Dual-Gate OTIF)
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                  Measures whether customer orders left the gate on time and at full quantity,
                  logging plain-English root causes for every miss.
                </p>
              </div>
              <button
                onClick={() => handleViewPlatform('standalone_p2')}
                className="pt-3 border-t border-slate-800 text-xs font-mono font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center justify-between w-full cursor-pointer"
              >
                <span>Preview Dispatch Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Slice 3 */}
            <div className="rounded-xl border border-slate-800 bg-[#111620] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-stone-200">
                    <Scale className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-stone-400 border border-slate-800">
                    Demo Module 03
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-100 mb-2">
                  Executive Overview &amp; Margin Audit
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                  Consolidates multi-plant working capital, freight rate leakage, and bin accuracy
                  into a weekly plant leadership briefing.
                </p>
              </div>
              <button
                onClick={() => handleViewPlatform('ceo_master')}
                className="pt-3 border-t border-slate-800 text-xs font-mono font-semibold text-stone-200 hover:text-white inline-flex items-center justify-between w-full cursor-pointer"
              >
                <span>Preview Executive Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dedicated Transition Bar into /platform */}
          <div className="rounded-xl border border-slate-700/80 bg-[#121824] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
                Interactive Product Sandbox (/platform)
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-100 mb-1">
                Want to inspect the full software workspace right now?
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                Open the interactive Operationalyst demonstration environment pre-loaded with
                illustrative manufacturing records, or test your own Tally/Excel sheet directly in
                your browser.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => handleViewPlatform('ceo_master')}
                className="px-5 py-3 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>View Full Platform</span>
              </button>
              <button
                onClick={onOpenSmartMapper}
                className="px-4 py-3 rounded-md bg-[#0a0d12] hover:bg-slate-900 text-stone-200 border border-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Test Your Excel / Tally File</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BEAT 7: FOUNDER-LED PILOT VALIDATION & DIRECT HUMAN IDENTITY
         ===================================================================== */}
      <section id="about" className="py-20 sm:py-24 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <div className="text-xs font-mono uppercase tracking-[0.16em] text-emerald-400 mb-3">
                06 · Founder-Led Pilot Program
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-50 tracking-tight leading-tight mb-4">
                Validating directly with mid-sized manufacturing teams — zero inflated claims.
              </h2>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed mb-4">
                Operationalyst is in active pilot validation with discrete manufacturing plants
                (machining, fabrication, automotive components, industrial assemblies, and packaging
                units). Rather than publishing invented logos or generic ROI promises, every pilot
                audit is executed directly with plant leadership so you can judge the quality of the
                SKU priority list on your own inventory data first.
              </p>
              <div className="space-y-2.5 text-xs sm:text-sm text-stone-300 mb-6">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Collaborative founder-led pilot audit with zero upfront software fee</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>48–72 hour turnaround from approved 5-column export to findings brief</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No automatic subscription or obligation after your 30-minute review</span>
                </div>
              </div>
            </div>

            {/* Direct Founder Identity & Contact Card */}
            <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#10151f] p-6 sm:p-7">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-[#0a0d12] font-bold text-base flex items-center justify-center shrink-0">
                  JS
                </div>
                <div>
                  <div className="text-base font-bold text-stone-100">Jonez Snowin</div>
                  <div className="text-xs font-mono text-stone-400">
                    Founder · Operationalyst
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-5">
                Have a question about whether your Tally or ERP export fits, or prefer to discuss
                anonymisation before submitting a request? Reach out directly.
              </p>

              <div className="space-y-2.5 mb-6 text-xs font-mono">
                <a
                  href="mailto:joneszz2004@gmail.com?subject=Operationalyst%20Factory%20Inventory%20Audit%20Enquiry"
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0a0d12] border border-slate-800 hover:border-emerald-500/40 text-stone-200 hover:text-emerald-300 transition"
                >
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>joneszz2004@gmail.com</span>
                </a>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0a0d12] border border-slate-800 text-stone-400">
                  <Building2 className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Chennai, India · Serving Discrete Manufacturing Units</span>
                </div>
              </div>

              <button
                onClick={() => handleOpenAuditModal('founder_card')}
                className="w-full py-3 px-4 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Request Pilot Factory Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BEAT 8: CONCISE FAQ & FINAL CALL TO ACTION
         ===================================================================== */}
      <section id="faq" className="py-20 sm:py-24 border-b border-slate-800/80 bg-[#0c1017]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <div className="text-xs font-mono uppercase tracking-[0.16em] text-stone-400 mb-2">
              07 · Common Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-50 tracking-tight">
              Practical questions before starting a review
            </h2>
          </div>

          <div className="space-y-2.5 mb-14">
            {conciseFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-lg border border-slate-800 bg-[#10151f] overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition"
                  >
                    <span className="text-sm font-semibold text-stone-100">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-stone-300 leading-relaxed border-t border-slate-800/70 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Calm Final Conversion Card */}
          <div className="rounded-xl border border-slate-800 bg-[#111620] p-7 sm:p-9 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-50 mb-3">
              Ready to see which inventory has stopped moving on your floor?
            </h3>
            <p className="text-sm text-stone-300 max-w-xl mx-auto mb-6">
              Request a founder-led pilot audit or inspect the sample deliverable first. No ERP
              changes and no upfront software commitment.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <button
                onClick={() => handleOpenAuditModal('bottom_cta')}
                className="px-6 py-3.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Request Factory Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleOpenSampleReport('bottom_secondary')}
                className="px-6 py-3.5 rounded-md bg-[#0a0d12] hover:bg-slate-900 text-stone-200 border border-slate-700 font-semibold text-sm transition cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>View Sample Audit</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Founder-Only Behavioral Architecture Reference */}
      {isFounderMode && (
        <div className="border-b border-slate-800">
          <B2BBehavioralSystem
            onRequestAudit={() => handleOpenAuditModal('founder_behavioral')}
            onOpenSampleReport={() => handleOpenSampleReport('founder_behavioral')}
            onOpenIcebergModal={() => setIsIcebergModalOpen(true)}
          />
        </div>
      )}

      {/* =====================================================================
          CLEAN INDUSTRIAL FOOTER
         ===================================================================== */}
      <footer className="py-12 bg-[#080a0e] text-stone-400 text-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div>
              <div className="font-bold text-stone-200 tracking-[0.14em] uppercase text-xs mb-1">
                Operationalyst
              </div>
              <p className="text-stone-400">
                Inventory dormancy &amp; operational review intelligence for discrete manufacturers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs font-medium">
              <button
                onClick={() => setIsMethodologyOpen(true)}
                className="hover:text-stone-100 transition cursor-pointer"
              >
                Methodology
              </button>
              <a href="#data-privacy" className="hover:text-stone-100 transition">
                Data &amp; Privacy
              </a>
              {onOpenAuditPage && (
                <button
                  onClick={onOpenAuditPage}
                  className="hover:text-stone-100 transition cursor-pointer"
                >
                  Pilot Audit (/audit)
                </button>
              )}
              <a
                href="/platform"
                onClick={(e) => {
                  e.preventDefault();
                  handleViewPlatform('ceo_master');
                }}
                className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Platform Demo (/platform)</span>
              </a>
              <a
                href="mailto:joneszz2004@gmail.com"
                className="hover:text-stone-100 transition font-mono"
              >
                joneszz2004@gmail.com
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-stone-500 font-mono">
            <span>
              Analytical findings depend on the completeness, accuracy, and agreed definitions of
              supplied plant records. All preview figures on this site are clearly labeled
              illustrative demonstration data.
            </span>
            <span className="shrink-0">© {new Date().getFullYear()} Operationalyst</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FactoryAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
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
