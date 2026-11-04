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
  AlertCircle,
  Building2,
  Clock,
  Sparkles,
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
}

export const CommercialLandingPage: React.FC<CommercialLandingPageProps> = ({
  onLaunchEngine,
}) => {
  // Modal states
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isSampleReportOpen, setIsSampleReportOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isIcebergModalOpen, setIsIcebergModalOpen] = useState(false);
  const [isCampaignStudioOpen, setIsCampaignStudioOpen] = useState(false);

  // A/B Test Readiness Configuration (defaults to Variant A, switchable via Iceberg Lab)
  const [headlineVariant, setHeadlineVariant] = useState<'A' | 'B' | 'C'>(ACTIVE_DEFAULT_VARIANT);

  // Data & Trust Accordion State
  const [openTrustIndex, setOpenTrustIndex] = useState<number | null>(0);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleOpenAuditModal = (source: string) => {
    trackEvent('hero_primary_cta_clicked', { source });
    setIsAuditModalOpen(true);
  };

  const handleOpenSampleReport = (source: string) => {
    trackEvent('sample_report_clicked', { source });
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-mono">
                OPERATIONALYST
              </span>
              <p className="text-[10px] text-slate-400 hidden sm:block font-mono">
                Manufacturing Inventory Intelligence
              </p>
            </div>
          </div>

          {/* Clean Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
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
              onClick={() => handleOpenSampleReport('nav')}
              className="hover:text-emerald-400 transition cursor-pointer text-left"
            >
              Sample Report
            </button>
            <a href="#data-trust" className="hover:text-emerald-400 transition">
              Data &amp; Trust
            </a>
            <button
              onClick={() => setIsIcebergModalOpen(true)}
              className="px-2.5 py-1 rounded-md bg-slate-900 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-[11px] font-mono transition flex items-center gap-1 cursor-pointer"
              title="View the 27 Behavioral Economics & Decision Science Dimensions"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Iceberg Lab</span>
            </button>
            <button
              onClick={() => setIsCampaignStudioOpen(true)}
              className="px-2.5 py-1 rounded-md bg-slate-900 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-[11px] font-mono transition flex items-center gap-1 cursor-pointer"
              title="View 6 Ad Variations, Founder Teleprompter & Outreach Playbook"
            >
              <Megaphone className="w-3 h-3 text-emerald-400" />
              <span>Campaigns</span>
            </button>
            <button
              onClick={handleViewPlatform}
              className="text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer font-mono text-[11px]"
              title="Launch the underlying multi-engine software platform"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Platform</span>
            </button>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleViewPlatform}
              className="lg:hidden min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Platform</span>
            </button>
            <button
              onClick={() => handleOpenAuditModal('nav_button')}
              className="min-h-[38px] px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer transition shadow-md touch-manipulation active:scale-95"
            >
              <span>Request Pilot Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
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

          {/* Supporting Copy */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Operationalyst turns existing manufacturing inventory data into a structured analysis of
            non-moving stock, slow-moving inventory, value exposure and priority areas requiring
            investigation.
          </p>

          {/* Primary Choice Architecture: Exactly Two Primary Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleOpenAuditModal('hero_primary')}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition shadow-xl touch-manipulation active:scale-95"
            >
              <span>Request a Pilot Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleOpenSampleReport('hero_secondary')}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-200 font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition touch-manipulation active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>View Sample Report</span>
            </button>
          </div>

          {/* Microcopy Beneath CTAs */}
          <p className="text-xs text-slate-400 max-w-xl mx-auto font-mono">
            Start with an existing inventory export. Audit scope and data requirements are confirmed before analysis.
          </p>

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
      {/* SECTION 4: SELF-ASSESSMENT                                            */}
      {/* ===================================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
        <SelfAssessmentWidget
          onRequestAudit={() => handleOpenAuditModal('self_assessment')}
          onViewSampleReport={() => handleOpenSampleReport('self_assessment')}
        />
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
      {/* SECTION 7: SAMPLE AUDIT                                               */}
      {/* ===================================================================== */}
      <section id="audit" className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-900/40 border-y border-slate-850">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              ILLUSTRATIVE EXAMPLE • DEMONSTRATION DATA
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              See What a Factory Audit Looks Like
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Examine the structure of an actual executive findings deliverable using neutral placeholder metrics.
            </p>
          </div>

          {/* Premium Report Preview Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                Audit Findings Summary Template
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Format: PDF Executive Document + Exportable .XLSX SKU Table
              </span>
            </div>

            {/* Neutral Placeholders Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Inventory Analysed</div>
                <div className="text-base sm:text-lg font-black text-white mt-0.5">₹X (Total Book Value)</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Items Reviewed</div>
                <div className="text-base sm:text-lg font-black text-white mt-0.5">X SKUs Evaluated</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30">
                <div className="text-[10px] text-rose-300 uppercase font-bold">Potentially Non-Moving</div>
                <div className="text-base sm:text-lg font-black text-rose-400 mt-0.5">₹X (&gt;180 Days Inactive)</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30">
                <div className="text-[10px] text-amber-300 uppercase font-bold">Slow-Moving</div>
                <div className="text-base sm:text-lg font-black text-amber-400 mt-0.5">₹X (Low Turnover)</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30">
                <div className="text-[10px] text-emerald-300 uppercase font-bold">Priority Review</div>
                <div className="text-base sm:text-lg font-black text-emerald-400 mt-0.5">X High-Impact Items</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30">
                <div className="text-[10px] text-cyan-300 uppercase font-bold">Highest-Value Category</div>
                <div className="text-base sm:text-lg font-black text-cyan-300 mt-0.5">Example Category</div>
              </div>
            </div>

            {/* CTA to open full modal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-850">
              <span className="text-[11px] text-slate-400 font-mono">
                Click below to review the multi-page illustrative report with SKU breakdowns.
              </span>
              <button
                onClick={() => handleOpenSampleReport('sample_section')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>View Sample Report</span>
              </button>
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
          onRequestAudit={(source) => handleOpenAuditModal(source)}
          onViewSampleReport={(source) => handleOpenSampleReport(source)}
          onOpenIcebergModal={() => setIsIcebergModalOpen(true)}
        />
      </section>

      {/* ===================================================================== */}
      {/* SECTION 9: EXPLAINABLE METHODOLOGY                                    */}
      {/* ===================================================================== */}
      <section id="explainable" className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-900/40 border-y border-slate-850">
        <div className="max-w-5xl mx-auto space-y-10">
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

          {/* 6 Methodology Stages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {METHODOLOGY_STAGES.map((stg) => (
              <div
                key={stg.stage}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
              >
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  {stg.stage}
                </span>
                <h3 className="text-sm font-bold text-white">{stg.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{stg.summary}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                trackEvent('methodology_opened');
                setIsMethodologyOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
            >
              <span>Read the Methodology ➔</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 10: DATA AND TRUST                                            */}
      {/* ===================================================================== */}
      <section id="data-trust" className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
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

        {/* Clear Expandable Accordion Items */}
        <div className="space-y-3">
          {DATA_TRUST_ITEMS.map((item, idx) => {
            const isOpen = openTrustIndex === idx;
            return (
              <div
                key={item.question}
                className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => toggleTrust(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-850 transition"
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
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed font-sans border-t border-slate-850 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
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
      {/* SECTION 12: FUTURE PROOF AREA (RESERVED FOR VERIFIED PROOF)            */}
      {/* ===================================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            VERIFIED PROOF REGISTRY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Verified Manufacturing Outcomes
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Customer evidence will be published here after pilot outcomes have been documented and approved.
          </p>
        </div>

        {/* Structured Case Study Template for Future Real Data */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-xs font-mono text-slate-400 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-300">Case Study Documentation Schema (Reserved Component)</span>
            <span>Status: Awaiting Pilot Validations</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div>• Industry Sector</div>
            <div>• Dataset Scope</div>
            <div>• Initial Challenge</div>
            <div>• Analysis Performed</div>
            <div>• Verified Findings</div>
            <div>• Action Taken</div>
            <div>• Approved Quotation</div>
            <div>• Documented Limitations</div>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 font-sans">
            Note: In strict alignment with ethical persuasion principles, Operationalyst displays zero fabricated customer logos or invented savings figures.
          </p>
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
                JS
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Jonez Snowin</h3>
                <div className="text-xs text-slate-400 font-mono">
                  Operations &amp; Manufacturing Analytics Builder
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              &ldquo;Operationalyst is being developed to help manufacturing teams convert existing
              inventory and operational data into clearer review priorities. The current focus is learning
              directly from manufacturing teams and validating the audit method with real operational use
              cases.&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-2 border-t border-slate-850 text-slate-400">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <a href="mailto:joneszz2004@gmail.com" className="text-slate-300 hover:text-white hover:underline">
                  joneszz2004@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">LinkedIn: /in/jonezsnowin (Profile Pending)</span>
              </div>
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
              onClick={() => handleOpenAuditModal('final_cta')}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition shadow-xl touch-manipulation active:scale-95"
            >
              <span>Request a Pilot Audit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
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
                <strong className="text-white">Operationalyst</strong> · Factory Inventory Intelligence Platform. Built by Jonez Snowin.
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
                onClick={() => handleOpenSampleReport('footer')}
                className="hover:text-white transition cursor-pointer"
              >
                Sample Report
              </button>
              <button
                onClick={() => setIsMethodologyOpen(true)}
                className="hover:text-white transition cursor-pointer"
              >
                Methodology
              </button>
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
            <div className="flex items-center gap-3">
              <span>Privacy Policy (Placeholder)</span>
              <span>·</span>
              <span>Terms of Service (Placeholder)</span>
            </div>
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
