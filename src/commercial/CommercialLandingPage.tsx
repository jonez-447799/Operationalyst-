/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Layers,
  CheckCircle2,
  Lock,
  Mail,
  Linkedin,
  HelpCircle,
  BookOpen,
  ExternalLink,
  SlidersHorizontal,
  UserCheck,
  Briefcase,
  PackageSearch,
  BarChart3,
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
  STAKEHOLDER_PERSPECTIVES,
  OBJECTION_MATRIX,
  COMMERCIAL_TIERS,
  TEN_TEAM_OPERATING_SYSTEM,
  FOUNDER_EXECUTIVE_SIGNOFF,
  getReconciledSampleAuditModes,
  type SampleAuditModeId,
} from './homepageConfig';
import { InstantAuditDropzone } from './InstantAuditDropzone';
import { TallyCleanerDesk } from './TallyCleanerAndClaims';
import { B2BBehavioralSystem } from './B2BBehavioralSystem';
import { IcebergControlSystems } from './IcebergControlSystems';
import { FactoryAuditModal } from './FactoryAuditModal';
import { SampleAuditReportModal } from './SampleAuditReportModal';
import { MethodologyModal } from './MethodologyModal';
import { LegalGovernanceModal, type LegalGovernanceTab } from './LegalGovernanceModal';
import { trackEvent, trackServerFunnelEvent } from '../utils/analytics';

export interface CommercialLandingPageProps {
  onLaunchEngine: (mode: any) => void;
  onOpenSmartMapper?: () => void;
  onOpenAuditPage?: () => void;
  onOpenSampleAuditPage?: () => void;
  onOpenLeadInbox?: () => void;
}

const ControlTowerIcebergEmblem: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Operationalyst Control-Tower Iceberg Emblem"
    className={className}
  >
    <rect width="128" height="128" rx="22" fill="#0B1320" />
    <circle cx="64" cy="64" r="54" fill="#111C2D" stroke="#475569" strokeWidth="2" />
    {/* Above-waterline visible ERP peak */}
    <polygon points="64,20 35,51 64,51" fill="#F8FAFC" />
    <polygon points="64,20 64,51 93,51" fill="#E2E8F0" />
    {/* Clean horizontal negative-space waterline gap */}
    <rect x="16" y="51" width="96" height="7" fill="#0B1320" />
    {/* Submerged 4-Pillar Signal Amber Polygon */}
    <polygon points="24,58 44,58 50,91 37,83" fill="#F59E0B" />
    <polygon points="45.6,58 63.2,58 63.2,109 51.6,91" fill="#FBBF24" />
    <polygon points="64.8,58 82.4,58 76.4,91 64.8,109" fill="#FBBF24" />
    <polygon points="84,58 104,58 91,83 78,91" fill="#F59E0B" />
  </svg>
);

export const CommercialLandingPage: React.FC<CommercialLandingPageProps> = ({
  onLaunchEngine,
  onOpenSmartMapper,
  onOpenAuditPage,
  onOpenSampleAuditPage,
}) => {
  const [heroVariant, setHeroVariant] = useState<'A' | 'B' | 'C'>(ACTIVE_DEFAULT_VARIANT);
  const [sampleMode, setSampleMode] = useState<SampleAuditModeId>('illustrative_12400');
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);
  const [isMethodologyDrawerOpen, setIsMethodologyDrawerOpen] = useState<boolean>(false);
  const [showGovernanceFaqDrawer, setShowGovernanceFaqDrawer] = useState<boolean>(false);
  const [showAllStages, setShowAllStages] = useState<boolean>(false);

  // Modals
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [auditModalSource, setAuditModalSource] = useState<string>('hero_primary');
  const [isSampleReportOpen, setIsSampleReportOpen] = useState<boolean>(false);
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalGovernanceTab | null>(null);

  const reconciledModes = getReconciledSampleAuditModes();
  const activeModeView = reconciledModes[sampleMode];
  const activeHero = HERO_HEADLINE_VARIANTS[heroVariant];
  const activeStakeholder =
    STAKEHOLDER_PERSPECTIVES[selectedRoleIndex] || STAKEHOLDER_PERSPECTIVES[0];

  useEffect(() => {
    trackEvent('demo_environment_viewed', { surface: 'commercial_landing' });
    trackServerFunnelEvent('LANDING_PAGE_VIEW', {
      sourceSection: 'commercial_landing',
    });

    if (typeof window !== 'undefined' && window.location.hash === '#methodology') {
      setIsMethodologyDrawerOpen(true);
    }
  }, []);

  const openRequestAuditModal = (sourceSection: string) => {
    setAuditModalSource(sourceSection);
    setIsAuditModalOpen(true);
    trackEvent('pilot_form_started', { sourceSection });
    trackServerFunnelEvent('AUDIT_MODAL_OPENED', { sourceSection });
  };

  const handleOpenAndScrollToMethodology = () => {
    setIsMethodologyDrawerOpen(true);
    if (typeof document !== 'undefined') {
      const el = document.getElementById('methodology');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const scrollToSection = (id: string) => {
    if (typeof document !== 'undefined') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const visibleGovernanceStages = showAllStages
    ? TEN_TEAM_OPERATING_SYSTEM
    : TEN_TEAM_OPERATING_SYSTEM.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0B1320] text-[#F8FAFC] font-['Inter',system-ui,sans-serif] selection:bg-amber-500/25 selection:text-amber-200">
      {/* Top Control-Tower Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[#475569]/40 bg-[#0B1320]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ControlTowerIcebergEmblem size={40} className="shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#F8FAFC]">
                  OPERATIONALYST
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-[#111C2D] border border-[#475569]/60 text-[10px] font-['JetBrains_Mono',monospace] font-semibold text-[#F59E0B] uppercase tracking-wider">
                  CONTROL-TOWER P1–P4
                </span>
              </div>
              <p className="text-[11px] font-['JetBrains_Mono',monospace] text-slate-400">
                Inventory &amp; Working-Capital Diagnostic · Snowin Ventures
              </p>
            </div>
          </div>

          <nav
            aria-label="Primary Navigation"
            className="flex flex-wrap items-center gap-2 text-xs font-['JetBrains_Mono',monospace]"
          >
            <button
              type="button"
              data-testid="nav-platform-btn"
              onClick={() => onLaunchEngine('ceo_master')}
              className="px-3 py-2 rounded-lg bg-[#111C2D] hover:bg-slate-800 border border-[#475569]/60 text-[#F8FAFC] font-semibold transition cursor-pointer"
            >
              Platform
            </button>
            <button
              type="button"
              data-testid="nav-sample-report-btn"
              onClick={() => setIsSampleReportOpen(true)}
              className="px-3 py-2 rounded-lg bg-[#111C2D] hover:bg-slate-800 border border-[#475569]/60 text-slate-200 hover:text-white font-semibold transition cursor-pointer"
            >
              View Sample Report
            </button>
            <button
              type="button"
              data-testid="nav-full-sample-page-btn"
              onClick={() => {
                if (onOpenSampleAuditPage) {
                  onOpenSampleAuditPage();
                } else {
                  setIsSampleReportOpen(true);
                }
              }}
              className="px-3 py-2 rounded-lg bg-[#111C2D] hover:bg-slate-800 border border-[#475569]/60 text-[#FBBF24] font-semibold transition cursor-pointer"
            >
              Full-Page Sample Report
            </button>
            <button
              type="button"
              data-testid="nav-pricing-btn"
              onClick={() => scrollToSection('pricing-tiers')}
              className="hidden md:inline-flex px-3 py-2 rounded-lg text-slate-300 hover:text-white font-semibold transition cursor-pointer"
            >
              Pricing (₹18,000)
            </button>
            <button
              type="button"
              data-testid="nav-request-pilot-btn"
              onClick={() => openRequestAuditModal('navbar_cta')}
              className="px-4 py-2 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B1320] font-bold transition inline-flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/15"
            >
              <span>Request Pilot Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14">
        {/* SECTION 1: Control-Tower Hero + Framing Switcher + Plain-English Privacy Banner */}
        <section className="rounded-2xl bg-[#111C2D] border border-[#475569]/50 p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="space-y-5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#0B1320] border border-[#F59E0B]/40 text-[11px] font-['JetBrains_Mono',monospace] font-bold text-[#F59E0B] uppercase tracking-wider">
                  {activeHero.badge}
                </span>
                <span className="px-2.5 py-1 rounded bg-[#0B1320] border border-[#475569]/50 text-[11px] font-['JetBrains_Mono',monospace] text-slate-300">
                  MSME Bill of Supply · 0% GST · SAC 998311
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.12]">
                {activeHero.headline}
              </h1>

              {/* Required concrete 5-second Hero sub-headline */}
              <p
                data-testid="hero-subheadline"
                className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl"
              >
                Start with a 5-column Tally Prime, SAP, or Excel export. Get a ranked list of your non-moving SKUs, carrying-cost exposure, and priority floor investigation targets in 48 hours—reviewed directly by founder C. Jones Snowin.
              </p>

              {/* Hero Variant Switcher (A / B / C) */}
              <div className="flex flex-wrap items-center gap-2 pt-1 font-['JetBrains_Mono',monospace] text-[11px]">
                <span className="text-slate-400">Lens:</span>
                {(['A', 'B', 'C'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    data-testid={`hero-variant-btn-${v}`}
                    onClick={() => setHeroVariant(v)}
                    className={`px-2.5 py-1 rounded border transition cursor-pointer ${
                      heroVariant === v
                        ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#FBBF24] font-bold'
                        : 'bg-[#0B1320] border-[#475569]/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    {v === 'A'
                      ? 'Dead-Stock Burn'
                      : v === 'B'
                      ? 'Working Capital'
                      : 'Review Control'}
                  </button>
                ))}
              </div>

              {/* Hero Primary CTA Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  data-testid="hero-request-audit-btn"
                  onClick={() => openRequestAuditModal('hero_primary')}
                  className="px-5 py-3 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B1320] font-['JetBrains_Mono',monospace] font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition shadow-lg shadow-amber-500/20"
                >
                  <span>Request 48-Hr Factory Audit (₹0 Teaser First)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  data-testid="hero-open-platform-btn"
                  onClick={() => onLaunchEngine('ceo_master')}
                  className="px-4 py-3 rounded-xl bg-[#0B1320] hover:bg-slate-900 border border-[#475569] text-[#F8FAFC] font-['JetBrains_Mono',monospace] font-semibold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition"
                >
                  <BarChart3 className="w-4 h-4 text-[#F59E0B]" />
                  <span>Open Live P1–P4 Control Tower</span>
                </button>

                <button
                  type="button"
                  data-testid="read-methodology-btn"
                  onClick={handleOpenAndScrollToMethodology}
                  className="px-4 py-3 rounded-xl bg-[#0B1320] hover:bg-slate-900 border border-[#475569]/60 text-slate-200 hover:text-white font-['JetBrains_Mono',monospace] font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer transition"
                >
                  <BookOpen className="w-4 h-4 text-[#FBBF24]" />
                  <span>Read the Methodology</span>
                </button>

                {onOpenSmartMapper && (
                  <button
                    type="button"
                    data-testid="hero-smart-mapper-btn"
                    onClick={onOpenSmartMapper}
                    className="px-4 py-3 rounded-xl bg-[#0B1320] hover:bg-slate-900 border border-[#475569]/60 text-slate-300 hover:text-white font-['JetBrains_Mono',monospace] font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Open Dirty-Tally Column Mapper</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Control-Tower Iceberg Snapshot Panel */}
            <div className="w-full lg:w-[340px] shrink-0 rounded-2xl bg-[#0B1320] border border-[#475569]/60 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#475569]/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <ControlTowerIcebergEmblem size={44} />
                  <div>
                    <div className="text-[10px] font-['JetBrains_Mono',monospace] text-slate-400 uppercase tracking-wider">
                      VISIBLE ERP LEDGER VS HIDDEN CASH
                    </div>
                    <div className="text-xs font-bold text-[#F8FAFC]">
                      4-Pillar Working Capital Iceberg
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 font-['JetBrains_Mono',monospace]">
                <div className="p-3 rounded-xl bg-[#111C2D] border border-[#475569]/40">
                  <div className="text-[10px] text-slate-400">P1 · DEAD STOCK</div>
                  <div className="text-base font-bold text-[#F59E0B] mt-0.5">&gt;180 Days</div>
                  <div className="text-[10px] text-slate-400">22% Carrying Burn</div>
                </div>
                <div className="p-3 rounded-xl bg-[#111C2D] border border-[#475569]/40">
                  <div className="text-[10px] text-slate-400">P2 · GATE OTIF</div>
                  <div className="text-base font-bold text-[#F8FAFC] mt-0.5">On-Time × Full</div>
                  <div className="text-[10px] text-slate-400">Dual SLA Gate</div>
                </div>
                <div className="p-3 rounded-xl bg-[#111C2D] border border-[#475569]/40">
                  <div className="text-[10px] text-slate-400">P3 · FREIGHT</div>
                  <div className="text-base font-bold text-[#FBBF24] mt-0.5">LR Corridor</div>
                  <div className="text-[10px] text-slate-400">Rate &amp; Detention</div>
                </div>
                <div className="p-3 rounded-xl bg-[#111C2D] border border-[#475569]/40">
                  <div className="text-[10px] text-slate-400">P4 · WAREHOUSE</div>
                  <div className="text-base font-bold text-[#F8FAFC] mt-0.5">Bin Variance</div>
                  <div className="text-[10px] text-slate-400">Ghost vs Excess</div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#475569]/40 flex items-center justify-between text-[11px] font-['JetBrains_Mono',monospace]">
                <span className="text-slate-400">Entry Teaser:</span>
                <span className="text-[#FBBF24] font-bold">₹0 Instant · ₹18,000 Full</span>
              </div>
            </div>
          </div>

          {/* 1-Sentence Plain-English Privacy Banner */}
          <div
            data-testid="landing-plain-english-privacy-banner"
            className="p-4 rounded-xl bg-[#0B1320] border border-emerald-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-slate-200 leading-relaxed">
                <strong className="text-emerald-300">Plain-English Privacy Guarantee:</strong>{' '}
                Strip vendor and customer names before sending. Reviewed only by founder C. Jones Snowin and purged within 14 days (or immediately after your call) with a cryptographic Deletion Certificate (<code className="font-['JetBrains_Mono',monospace] text-emerald-300">DELCERT-...</code>).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLegalModalTab('privacy')}
              className="px-3 py-1.5 rounded-lg bg-[#111C2D] hover:bg-slate-800 border border-[#475569]/60 text-emerald-300 font-['JetBrains_Mono',monospace] text-[11px] font-bold shrink-0 cursor-pointer"
            >
              Read Data Charter
            </button>
          </div>
        </section>

        {/* SECTION 2: In-Browser 5-Column CSV Sandbox */}
        <InstantAuditDropzone
          onOpenRequestAuditModal={() => openRequestAuditModal('instant_dropzone')}
        />

        {/* SECTION 3: Reconciled Mode A / Mode B Sample Audit Switcher */}
        <section
          id="sample-audit-comparison"
          className="rounded-2xl bg-[#111C2D] border border-[#475569]/50 p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#475569]/40 pb-4">
            <div className="space-y-1">
              <div className="text-[11px] font-['JetBrains_Mono',monospace] font-bold text-[#F59E0B] uppercase tracking-wider">
                DETERMINISTIC RECONCILIATION BENCHMARKS
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                Compare Mid-Sized Plant Scale vs. Live 20-SKU Sandbox Dataset
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Inspect exact mathematical parity between Mode A (12,400-SKU Plant Case) and Mode B (20-SKU Sandbox) before scheduling a pilot review.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-['JetBrains_Mono',monospace] text-xs shrink-0">
              <button
                type="button"
                data-testid="sample-mode-a-btn"
                onClick={() => setSampleMode('illustrative_12400')}
                className={`px-3.5 py-2 rounded-xl border font-bold transition cursor-pointer ${
                  sampleMode === 'illustrative_12400'
                    ? 'bg-[#F59E0B] text-[#0B1320] border-[#FBBF24]'
                    : 'bg-[#0B1320] text-slate-300 border-[#475569]/60 hover:text-white'
                }`}
              >
                Mode A: 12,400-SKU Plant Case
              </button>
              <button
                type="button"
                data-testid="sample-mode-b-btn"
                onClick={() => setSampleMode('sandbox_20')}
                className={`px-3.5 py-2 rounded-xl border font-bold transition cursor-pointer ${
                  sampleMode === 'sandbox_20'
                    ? 'bg-[#F59E0B] text-[#0B1320] border-[#FBBF24]'
                    : 'bg-[#0B1320] text-slate-300 border-[#475569]/60 hover:text-white'
                }`}
              >
                Mode B: 20-SKU Sandbox
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-['JetBrains_Mono',monospace]">
            <div className="p-4 rounded-xl bg-[#0B1320] border border-[#475569]/50 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase">Inventory Analysed</div>
              <div className="text-2xl font-bold text-[#F8FAFC]">
                {activeModeView.totalBookValueFormatted}
              </div>
              <div className="text-[11px] text-slate-400">
                {activeModeView.skusEvaluatedText} · {activeModeView.skusEvaluatedSubtext}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1320] border border-[#F59E0B]/40 space-y-1">
              <div className="text-[10px] text-[#F59E0B] uppercase">Non-Moving (&gt;180d)</div>
              <div className="text-2xl font-bold text-[#F59E0B]">
                {activeModeView.deadStockValueFormatted}
              </div>
              <div className="text-[11px] text-slate-300">{activeModeView.deadStockSubtext}</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1320] border border-[#FBBF24]/40 space-y-1">
              <div className="text-[10px] text-[#FBBF24] uppercase">Slow-Moving (90–179d)</div>
              <div className="text-2xl font-bold text-[#FBBF24]">
                {activeModeView.slowMovingValueFormatted}
              </div>
              <div className="text-[11px] text-slate-300">{activeModeView.slowMovingSubtext}</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1320] border border-[#475569]/50 space-y-1">
              <div className="text-[10px] text-emerald-400 uppercase">Priority Hitlist</div>
              <div className="text-2xl font-bold text-[#F8FAFC]">
                {activeModeView.prioritySkusHeadline}
              </div>
              <div className="text-[11px] text-slate-400">{activeModeView.prioritySkusSubtext}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-['JetBrains_Mono',monospace]">
            <div className="text-slate-300">
              Dataset: <strong className="text-[#F8FAFC]">{activeModeView.companyName}</strong> ({activeModeView.plantLocation})
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSampleReportOpen(true)}
                className="px-3.5 py-2 rounded-lg bg-[#0B1320] hover:bg-slate-900 border border-[#475569] text-[#F8FAFC] font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Inspect Full Sample Modal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {onOpenSampleAuditPage && (
                <button
                  type="button"
                  onClick={onOpenSampleAuditPage}
                  className="px-3.5 py-2 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B1320] font-bold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Open Full /audit Report</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 4: Problem Questions & 5-Step Process */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[#111C2D] border border-[#475569]/50 p-6 space-y-4">
            <div className="text-[11px] font-['JetBrains_Mono',monospace] font-bold text-[#F59E0B] uppercase tracking-wider">
              4 QUESTIONS STANDARD ERP REPORTS DON&apos;T ANSWER
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#F8FAFC]">
              Where Factory Working Capital Silently Leaks
            </h2>
            <ul className="space-y-3">
              {PROBLEM_QUESTIONS.map((q, idx) => (
                <li
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#0B1320] border border-[#475569]/40 text-xs sm:text-sm text-slate-200 flex items-start gap-3"
                >
                  <span className="px-2 py-0.5 rounded bg-[#111C2D] border border-[#F59E0B]/40 font-['JetBrains_Mono',monospace] text-[11px] font-bold text-[#F59E0B] shrink-0">
                    Q{idx + 1}
                  </span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-[#111C2D] border border-[#475569]/50 p-6 space-y-4">
            <div className="text-[11px] font-['JetBrains_Mono',monospace] font-bold text-emerald-400 uppercase tracking-wider">
              5-STEP READ-ONLY DIAGNOSTIC FLOW
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#F8FAFC]">
              From Tally/SAP Stock Export to Floor Action in 48 Hours
            </h2>
            <div className="space-y-2.5">
              {PROCESS_STEPS.map((step) => (
                <div
                  key={step.num}
                  className="p-3 rounded-xl bg-[#0B1320] border border-[#475569]/40 flex items-start gap-3"
                >
                  <span className="px-2 py-1 rounded bg-[#111C2D] border border-[#475569]/60 font-['JetBrains_Mono',monospace] text-xs font-bold text-[#FBBF24] shrink-0">
                    {step.num}
                  </span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#F8FAFC]">{step.title}</div>
                    <p className="text-xs text-slate-300 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: Interactive Role Selector (4 Manufacturing Plant Seats) */}
        <section
          data-testid="role-selector-section"
          className="rounded-2xl bg-[#111C2D] border border-[#475569]/50 p-6 sm:p-8 space-y-6"
        >
          <div className="space-y-1">
            <div className="text-[11px] font-['JetBrains_Mono',monospace] font-bold text-[#F59E0B] uppercase tracking-wider">
              MULTI-STAKEHOLDER ROLE LENS
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
              What Each Decision Maker Gets From One 5-Column Export
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 font-['JetBrains_Mono',monospace]">
            {STAKEHOLDER_PERSPECTIVES.map((perspective, idx) => (
              <button
                key={perspective.id}
                type="button"
                data-testid={`role-selector-tab-${perspective.id}`}
                onClick={() => setSelectedRoleIndex(idx)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  selectedRoleIndex === idx
                    ? 'bg-[#F59E0B] text-[#0B1320] border-[#FBBF24] font-bold'
                    : 'bg-[#0B1320] text-slate-300 border-[#475569]/60 hover:text-white'
                }`}
              >
                <div className="text-[10px] uppercase opacity-80">{perspective.role}</div>
                <div className="text-xs font-bold mt-0.5">{perspective.roleTitle}</div>
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-[#0B1320] border border-[#475569]/50 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="space-y-2 lg:col-span-2">
              <div className="text-xs font-['JetBrains_Mono',monospace] font-bold text-[#F59E0B] uppercase">
                {activeStakeholder.role} · {activeStakeholder.roleTitle}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
                &ldquo;{activeStakeholder.coreQuestion}&rdquo;
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                <strong className="text-[#F8FAFC]">Priority Outcome:</strong>{' '}
                {activeStakeholder.priorityOutcome}
              </p>
              <p className="text-xs text-slate-400">
                <strong className="text-emerald-300">Built-In Safeguard:</strong>{' '}
                {activeStakeholder.riskMitigation}
              </p>
            </div>
            <div className="space-y-2 font-['JetBrains_Mono',monospace] text-xs border-t lg:border-t-0 lg:border-l border-[#475569]/40 pt-4 lg:pt-0 lg:pl-5">
              <div className="text-[10px] text-slate-400 uppercase font-bold">
                KEY VERIFIED OUTPUTS
              </div>
              {activeStakeholder.keyMetrics.map((m) => (
                <div
                  key={m}
                  className="p-2 rounded-lg bg-[#111C2D] border border-[#475569]/40 text-slate-200 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: 6-Stage Analytical Methodology (#methodology) */}
        <section
          id="methodology"
          className="rounded-2xl bg-[#111C2D] border border-[#475569]/50 p-6 sm:p-8 space-y-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-['JetBrains_Mono',monospace] font-bold text-emerald-400 uppercase tracking-wider">
                TRANSPARENT SPREADSHEET-AUDITABLE EQUATIONS
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                The 6-Stage Inventory Audit Methodology
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsMethodologyModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0B1320] hover:bg-slate-900 border border-[#475569] text-slate-200 font-['JetBrains_Mono',monospace] text-xs font-bold cursor-pointer"
            >
              Open Full Formula Sheet Modal
            </button>
          </div>

          {/* 6-Pill Summary Strip MUST appear above toggle-methodology-stages-drawer */}
          <div
            data-testid="methodology-6-pill-summary-strip"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-['JetBrains_Mono',monospace]"
          >
            {METHODOLOGY_STAGES.map((stg) => (
              <div
                key={stg.stageNum}
                className="p-3.5 rounded-xl bg-[#0B1320] border border-[#475569]/50 space-y-1"
              >
                <div className="text-[10px] font-bold text-[#F59E0B] uppercase">
                  {stg.stage}: {stg.name}
                </div>
                <div className="text-[11px] text-slate-300">{stg.pillLabel}</div>
              </div>
            ))}
          </div>

          <button
            type="button"
            data-testid="toggle-methodology-stages-drawer"
            aria-expanded={isMethodologyDrawerOpen}
            onClick={() => setIsMethodologyDrawerOpen((prev) => !prev)}
            className="w-full px-4 py-3 rounded-xl bg-[#0B1320] hover:bg-slate-900 border border-[#475569] text-[#F8FAFC] font-['JetBrains_Mono',monospace] text-xs font-bold flex items-center justify-between cursor-pointer transition"
          >
            <span>
              {isMethodologyDrawerOpen
                ? 'Hide Exact Formulas, Inputs & Outputs (Stages 01–06)'
                : 'Inspect Exact Formulas, Inputs & Outputs Across All 6 Stages'}
            </span>
            {isMethodologyDrawerOpen ? (
              <ChevronUp className="w-4 h-4 text-[#F59E0B]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#F59E0B]" />
            )}
          </button>

          {isMethodologyDrawerOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {METHODOLOGY_STAGES.map((stg) => (
                <div
                  key={stg.stageNum}
                  className="p-4 rounded-xl bg-[#0B1320] border border-[#475569]/50 space-y-2.5 text-xs"
                >
                  <div className="font-['JetBrains_Mono',monospace] font-bold text-[#FBBF24]">
                    {stg.stage} — {stg.name}
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#111C2D] border border-emerald-500/30 font-['JetBrains_Mono',monospace] text-[11px] text-emerald-300">
                    Formula: {stg.formula}
                  </div>
                  <p className="text-slate-300">
                    <strong className="text-white">Inputs:</strong> {stg.inputs}
                  </p>
                  <p className="text-slate-300">
                    <strong className="text-white">Outputs:</strong> {stg.outputs}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 7: MSME Pricing Tiers (0% GST Bill of Supply + ICAI CA Wholesale) */}
        <section id="pricing-tiers" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-['JetBrains_Mono',monospace] font-bold text-[#F59E0B] uppercase tracking-wider">
                TRANSPARENT COMMERCIAL ARCHITECTURE · 0% GST MSME BILL OF SUPPLY
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                Start at ₹0 on Your CSV. Flat Pricing With Zero Hidden Subscriptions.
              </h2>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#111C2D] border border-[#475569]/60 font-['JetBrains_Mono',monospace] text-[11px] text-slate-300">
              SNOWIN VENTURES · Udyam Reg: UDYAM-TN-02-0444630 · SAC 998311
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMMERCIAL_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-2xl p-5 flex flex-col justify-between space-y-5 border ${
                  tier.popular
                    ? 'bg-[#111C2D] border-[#F59E0B] shadow-xl shadow-amber-500/10'
                    : 'bg-[#111C2D] border-[#475569]/50'
                }`}
              >
                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#0B1320] border border-[#475569]/60 text-[10px] font-['JetBrains_Mono',monospace] font-bold text-[#FBBF24]">
                    {tier.badge}
                  </span>
                  <h3 className="text-base font-bold text-[#F8FAFC]">{tier.name}</h3>
                  <div>
                    <div className="text-2xl font-extrabold font-['JetBrains_Mono',monospace] text-[#F8FAFC]">
                      {tier.price}
                    </div>
                    {tier.period && (
                      <div className="text-[11px] font-['JetBrains_Mono',monospace] text-slate-400">
                        {tier.period}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{tier.description}</p>
                  {tier.guarantee && (
                    <div className="p-2.5 rounded-lg bg-[#0B1320] border border-emerald-500/35 text-[11px] text-emerald-300 leading-relaxed">
                      {tier.guarantee}
                    </div>
                  )}
                  <ul className="space-y-1.5 pt-1">
                    {tier.features.map((feat) => (
                      <li key={feat} className="text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (tier.id === 'tier_0_sandbox') {
                      scrollToSection('instant-audit-dropzone-section');
                    } else {
                      openRequestAuditModal(`pricing_${tier.id}`);
                    }
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl font-['JetBrains_Mono',monospace] text-xs font-bold cursor-pointer transition ${
                    tier.popular
                      ? 'bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B1320]'
                      : 'bg-[#0B1320] hover:bg-slate-900 border border-[#475569] text-[#F8FAFC]'
                  }`}
                >
                  {tier.ctaText}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 8: 14-Stage Automated Audit & Governance Architecture */}
        <section className="rounded-2xl bg-[#111C2D] border border-[#475569]/50 p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-['JetBrains_Mono',monospace] font-bold text-[#F59E0B] uppercase tracking-wider">
                MULTI-PLANT FINANCIAL INVARIANT ARCHITECTURE
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                14-Stage Automated Audit &amp; Governance Architecture — Personally Reviewed by Founder C. Jones Snowin
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowAllStages((prev) => !prev)}
              className="px-3.5 py-2 rounded-xl bg-[#0B1320] hover:bg-slate-900 border border-[#475569] text-xs font-['JetBrains_Mono',monospace] font-bold text-slate-200 cursor-pointer"
            >
              {showAllStages ? 'Show Core 6 Stages' : 'View All 14 Automated Audit Stages'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleGovernanceStages.map((stageItem) => (
              <div
                key={stageItem.id}
                className="p-4 rounded-xl bg-[#0B1320] border border-[#475569]/50 space-y-2"
              >
                <div className="flex items-center justify-between font-['JetBrains_Mono',monospace] text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-[#111C2D] border border-[#F59E0B]/40 text-[#F59E0B] font-bold">
                    Stage {stageItem.num}
                  </span>
                  <span className="text-slate-400">{stageItem.role}</span>
                </div>
                <h3 className="text-sm font-bold text-[#F8FAFC]">{stageItem.name}</h3>
                <p className="text-xs text-slate-300">Focus: {stageItem.focus}</p>
                <div className="text-[11px] font-['JetBrains_Mono',monospace] text-emerald-300 pt-1 border-t border-[#475569]/30">
                  Deliverable: {stageItem.deliverable}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 9: Deliverables Checklist */}
        <section className="rounded-2xl bg-[#111C2D] border border-[#475569]/50 p-6 sm:p-8 space-y-4">
          <div className="text-[11px] font-['JetBrains_Mono',monospace] font-bold text-emerald-400 uppercase tracking-wider">
            48-HOUR DIAGNOSTIC DELIVERABLES
          </div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">
            9 Concrete Working Papers &amp; Governance Artifacts Delivered
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {AUDIT_DELIVERABLES.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#0B1320] border border-[#475569]/40 space-y-1"
              >
                <div className="text-xs font-bold text-[#F8FAFC] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 10: Interactive Commercial Workdesks & Control Systems */}
        <TallyCleanerDesk />

        <B2BBehavioralSystem
          onRequestAudit={() => openRequestAuditModal('behavioral_system')}
          onViewSampleReport={() => setIsSampleReportOpen(true)}
          onOpenIcebergModal={() => scrollToSection('iceberg-control-systems')}
          isFounderMode={false}
        />

        <div id="iceberg-control-systems">
          <IcebergControlSystems />
        </div>

        {/* SECTION 11: Collapsible Data Governance & Pricing FAQ Drawer */}
        <section className="rounded-2xl bg-[#111C2D] border border-[#475569]/50 p-6 sm:p-8 space-y-4">
          <button
            type="button"
            data-testid="toggle-governance-faq-drawer"
            aria-expanded={showGovernanceFaqDrawer}
            onClick={() => setShowGovernanceFaqDrawer((prev) => !prev)}
            className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
          >
            <div>
              <div className="text-[11px] font-['JetBrains_Mono',monospace] font-bold text-[#F59E0B] uppercase tracking-wider">
                FREQUENTLY ASKED QUESTIONS · DATA TRUST · PRICING CLARITY
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#F8FAFC] mt-0.5">
                ERP Safety, Privacy Deletion SLA &amp; ₹18,000 Pricing FAQ ({FAQ_ITEMS.length} Questions)
              </h2>
            </div>
            <span className="p-2 rounded-lg bg-[#0B1320] border border-[#475569] text-[#F59E0B] shrink-0">
              {showGovernanceFaqDrawer ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
          </button>

          {showGovernanceFaqDrawer && (
            <div className="space-y-6 pt-3 border-t border-[#475569]/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FAQ_ITEMS.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-4 rounded-xl bg-[#0B1320] border border-[#475569]/50 space-y-1.5"
                  >
                    <h3 className="text-xs sm:text-sm font-bold text-[#F8FAFC]">{faq.q}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DATA_TRUST_ITEMS.map((trust) => (
                  <div
                    key={trust.id}
                    className="p-4 rounded-xl bg-[#0B1320] border border-emerald-500/30 space-y-1"
                  >
                    <h4 className="text-xs font-bold text-emerald-300">{trust.question}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{trust.answer}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {OBJECTION_MATRIX.map((obj) => (
                  <div
                    key={obj.id}
                    className="p-4 rounded-xl bg-[#0B1320] border border-[#475569]/40 space-y-1.5"
                  >
                    <div className="text-xs font-bold text-[#FBBF24]">{obj.objection}</div>
                    <p className="text-xs text-slate-300">{obj.evidenceAndMechanism}</p>
                    <div className="text-[11px] font-['JetBrains_Mono',monospace] text-emerald-300">
                      {obj.institutionalGuarantee}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer with Direct Founder Signoff & Navigation */}
      <footer className="border-t border-[#475569]/40 bg-[#0B1320] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="p-5 rounded-2xl bg-[#111C2D] border border-[#475569]/50 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2.5">
                <ControlTowerIcebergEmblem size={32} />
                <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
                  FOUNDER EXECUTIVE SIGN-OFF · C. JONES SNOWIN
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {FOUNDER_EXECUTIVE_SIGNOFF ||
                  'Operationalyst isolates stagnant working capital, 22% annual carrying-cost burn, and Pareto 80/20 floor review priorities directly from standard 5-column Tally Prime, SAP, Busy, or Excel stock exports—with zero ERP integration or operational disruption.'}
              </p>
              <p className="text-[11px] font-['JetBrains_Mono',monospace] text-slate-400">
                Snowin Ventures · Ambattur &amp; Chennai Industrial Corridor · Udyam MSME: UDYAM-TN-02-0444630 · SAC 998311 (0% GST Bill of Supply)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 font-['JetBrains_Mono',monospace] text-xs shrink-0">
              <a
                href="mailto:joneszz2004@gmail.com?subject=Operationalyst%2048-Hr%20Factory%20Inventory%20Audit"
                data-testid="founder-contact-email-link"
                className="px-3.5 py-2 rounded-xl bg-[#0B1320] hover:bg-slate-900 border border-[#475569] text-[#F8FAFC] font-bold inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Direct Founder Desk (C. Jones Snowin)</span>
              </a>
              <a
                href="https://www.linkedin.com/in/c-jones-snowin-230a181b7"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="founder-contact-linkedin-link"
                className="px-3.5 py-2 rounded-xl bg-[#0B1320] hover:bg-slate-900 border border-[#475569] text-slate-200 hover:text-white font-bold inline-flex items-center gap-1.5"
              >
                <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                <span>LinkedIn Profile (C. Jones Snowin)</span>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-['JetBrains_Mono',monospace] text-slate-400">
            <div>© {new Date().getFullYear()} Operationalyst (Snowin Ventures, Chennai). Deterministic P1–P4 Manufacturing Intelligence.</div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                data-testid="footer-methodology-link"
                onClick={handleOpenAndScrollToMethodology}
                className="hover:text-white cursor-pointer"
              >
                6-Stage Methodology
              </button>
              <button
                type="button"
                onClick={() => setLegalModalTab('privacy')}
                className="hover:text-white cursor-pointer"
              >
                Data Governance &amp; Privacy
              </button>
              <button
                type="button"
                onClick={() => setLegalModalTab('terms')}
                className="hover:text-white cursor-pointer"
              >
                Audit Scope &amp; Refund Guarantee
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
        onLaunchLiveDemo={() => {
          setIsAuditModalOpen(false);
          onLaunchEngine('ceo_master');
        }}
        onOpenSmartMapper={onOpenSmartMapper}
      />

      <SampleAuditReportModal
        isOpen={isSampleReportOpen}
        onClose={() => setIsSampleReportOpen(false)}
        onRequestAudit={() => {
          setIsSampleReportOpen(false);
          openRequestAuditModal('sample_report_modal');
        }}
        onOpenLiveWalkthrough={() => {
          setIsSampleReportOpen(false);
          if (onOpenSampleAuditPage) {
            onOpenSampleAuditPage();
          }
        }}
      />

      <MethodologyModal
        isOpen={isMethodologyModalOpen}
        onClose={() => setIsMethodologyModalOpen(false)}
        onRequestAudit={() => {
          setIsMethodologyModalOpen(false);
          openRequestAuditModal('methodology_modal');
        }}
      />

      <LegalGovernanceModal
        isOpen={legalModalTab !== null}
        onClose={() => setLegalModalTab(null)}
        initialTab={legalModalTab || 'privacy'}
        onRequestAudit={() => {
          setLegalModalTab(null);
          openRequestAuditModal('legal_governance_modal');
        }}
      />
    </div>
  );
};

export default CommercialLandingPage;
