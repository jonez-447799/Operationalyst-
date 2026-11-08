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
  getReconciledSampleAuditModes,
  type SampleAuditModeId,
} from './homepageConfig';
import { SelfAssessmentWidget } from './SelfAssessmentWidget';
import { FactoryAuditModal } from './FactoryAuditModal';
import { SampleAuditReportModal } from './SampleAuditReportModal';
import { InventoryChecklistModal } from './InventoryChecklistModal';
import { MethodologyModal } from './MethodologyModal';
import { B2BBehavioralSystem, BehavioralIcebergModal } from './B2BBehavioralSystem';
import { CampaignAssetStudio } from './CampaignAssetStudio';
import { trackEvent, trackServerFunnelEvent } from '../utils/analytics';
import {
  downloadAuditTemplate,
  downloadPilotDataKitCsv,
  downloadPilotDataKitXlsx,
} from '../utils/pilotDataKitExporter';
import { LegalGovernanceModal, LegalGovernanceTab } from './LegalGovernanceModal';
import type { BuyerPersona } from '../utils/leadValidation';
import type { SelfAssessmentEvaluation } from '../utils/selfAssessmentScorer';
import type { VerifiedProofRecord } from '../utils/verifiedProofRegistryStore';
import type { DeletionCertificateRecord } from '../utils/dataPurgeEngine';
import { formatCurrency } from '../project1/utils/calculations';

const DEFAULT_SANDBOX_DEMO_PROOF: VerifiedProofRecord = {
  proofId: 'PROOF-SANDBOX-DEMO',
  publishedAt: '2026-10-12T09:00:00.000Z',
  plantCorridor: 'Ambattur Industrial Estate, Chennai (Sandbox Benchmark)',
  erpEnvironment: 'Tally Prime + Gate & Stores Registers',
  linkedWorkspaceId: 'AUDIT-DEMO-P1P4',
  importRunId: 'IMPRUN-20261012-DEMO',
  datasetSha256Prefix: 'e3b0c44298fc1c14',
  clientSignOffConfirmed: true,
  zeroFabricationAttested: true,
  industrySector: 'Precision Machined Castings, Flanges & Industrial Valves (Sandbox)',
  datasetScope: '20 SKUs · 18 Dispatches · 12 Freight LRs · 15 Bins',
  initialChallenge:
    'Unverified dead-stock capital lockup across fabrication stores, recurring late OEM gate dispatches, un-audited carrier rate/detention bills, and ghost stock mismatches between Tally book balances and physical racks.',
  analysisPerformed:
    'Deterministic 4-Pillar Ingestion & Quarantine Audit across 20 SKUs, 18 OEM dispatches, 12 carrier LR bills, and 15 physical rack bins with Item 07 Reserve Spares protection applied.',
  verifiedFindings: {
    p1BookValueInr: 645650,
    p1DeadStockInr: 223110,
    p1SlowMovingInr: 63600,
    p1ReserveSparesProtectedInr: 82500,
    p2OtifPassPct: 50,
    p3FreightLeakInr: 13944,
    p4BinAccuracyPct: 60,
    p4GhostStockInr: 24240,
  },
  actionTaken:
    'Isolated 8 Dead SKUs (₹2,23,110) while protecting 2 critical CNC/hydraulic spares (₹82,500) under Item 07; raised Siva Transport debit note and scheduled blind morning cycle counts on 6 mismatched bins.',
  approvedQuotation:
    'SCHEMA DEMONSTRATION ONLY — Bound to canonical 20-SKU Ambattur Sandbox Snapshot (No external client quotation attached).',
  documentedLimitations:
    'Item 07 Scope & Exclusions: Evaluation baseline fixed at 2026-09-20 (Dead Stock > 180d, Carrying Cost 22% p.a.). 2 critical machine/insurance spares (₹82,500) retained as operational insurance and excluded from liquidation targets. 100% of submitted ERP rows passed schema & date validation.',
};

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
  onOpenLeadInbox,
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
  const [sampleModeId, setSampleModeId] = useState<SampleAuditModeId>('sandbox_20');

  // Phase 7: Verified Proof Registry State
  const [verifiedProofs, setVerifiedProofs] = useState<VerifiedProofRecord[]>([]);
  const [sandboxDemoProof, setSandboxDemoProof] = useState<VerifiedProofRecord>(
    DEFAULT_SANDBOX_DEMO_PROOF
  );
  const [showSandboxProofPreview, setShowSandboxProofPreview] = useState<boolean>(false);

  // Phase 8: Cryptographic Deletion Certificate Verification State
  const [delCertInput, setDelCertInput] = useState<string>('DELCERT-DEMO-P1P4');
  const [verifiedDelCert, setVerifiedDelCert] = useState<DeletionCertificateRecord | null>(null);
  const [delCertLoading, setDelCertLoading] = useState<boolean>(false);
  const [delCertError, setDelCertError] = useState<string | null>(null);

  const handleVerifyDeletionCertificate = async (certIdToCheck: string) => {
    const cleanId = certIdToCheck.trim();
    if (!cleanId) return;
    setDelCertLoading(true);
    setDelCertError(null);
    try {
      const res = await fetch(`/api/deletion-certificates/${encodeURIComponent(cleanId)}`);
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok || !data.certificate) {
        setVerifiedDelCert(null);
        setDelCertError(
          data?.error || `Certificate ${cleanId} not found in server Deletion Certificate Ledger.`
        );
        setDelCertLoading(false);
        return;
      }
      setVerifiedDelCert(data.certificate as DeletionCertificateRecord);
    } catch {
      setDelCertError('Network error while verifying Deletion Certificate.');
    } finally {
      setDelCertLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch('/api/verified-proofs')
      .then((res) => res.json())
      .then((data) => {
        if (!active || !data?.ok) return;
        if (Array.isArray(data.proofs)) {
          setVerifiedProofs(data.proofs);
        }
        if (data.sandboxDemonstrationProof) {
          setSandboxDemoProof(data.sandboxDemonstrationProof);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const sampleAuditModes = getReconciledSampleAuditModes();
  const activeSampleMode = sampleAuditModes[sampleModeId] || sampleAuditModes.sandbox_20;

  const handleOpenLegalModal = (tab: LegalGovernanceTab) => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  // A/B Test Readiness Configuration (defaults to Variant A, switchable via Iceberg Lab)
  const [headlineVariant, setHeadlineVariant] = useState<'A' | 'B' | 'C'>(ACTIVE_DEFAULT_VARIANT);

  // Phase 9 Collapsible Deep-Dive Drawer States
  const [showMethodologyStagesDrawer, setShowMethodologyStagesDrawer] = useState<boolean>(false);
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
    return () => {
      window.removeEventListener('scroll', handleScroll);
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
          onRequestAudit={(diagnostic) =>
            handleOpenAuditModal('self_assessment', 'GENERAL', diagnostic || null)
          }
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

              {/* 2-Mode Sample Data Switcher */}
              <div
                role="tablist"
                aria-label="Sample Audit Dataset Mode"
                className="flex flex-wrap items-center gap-2 font-mono text-xs"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={sampleModeId === 'sandbox_20'}
                  data-testid="sample-mode-sandbox"
                  onClick={() => setSampleModeId('sandbox_20')}
                  className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition ${
                    sampleModeId === 'sandbox_20'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Mode A: Live 20-SKU Sandbox Dataset
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={sampleModeId === 'illustrative_12400'}
                  data-testid="sample-mode-illustrative"
                  onClick={() => setSampleModeId('illustrative_12400')}
                  className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer transition ${
                    sampleModeId === 'illustrative_12400'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Mode B: 12,400-SKU Auto-Component Case
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

            {/* Connected Multi-Pillar Summary Pills (P2 OTIF, P3 Freight, P4 Bin Accuracy) */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
              <span className="text-slate-400 font-bold uppercase">
                Connected 4-Pillar Audit Signals:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  data-testid="sample-pill-p2"
                  className="px-2.5 py-1 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold"
                >
                  {activeSampleMode.p2OtifPill}
                </span>
                <span
                  data-testid="sample-pill-p3"
                  className="px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold"
                >
                  {activeSampleMode.p3FreightPill}
                </span>
                <span
                  data-testid="sample-pill-p4"
                  className="px-2.5 py-1 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold"
                >
                  {activeSampleMode.p4BinPill}
                </span>
              </div>
            </div>

            {/* CTA to open full modal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-850">
              <span className="text-[11px] text-slate-400 font-mono">
                Click below to review the multi-page illustrative report with SKU breakdowns and 2-page PDF briefing.
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

          {/* Collapsible 6 Methodology Stages Drawer */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
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
                  aria-expanded={showMethodologyStagesDrawer}
                  onClick={() => setShowMethodologyStagesDrawer((prev) => !prev)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition"
                >
                  {showMethodologyStagesDrawer ? (
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
                  onClick={() => {
                    trackEvent('methodology_opened');
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
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5"
                  >
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                      {stg.stage}
                    </span>
                    <h3 className="text-sm font-bold text-white">{stg.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">{stg.summary}</p>
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

        {/* Phase 8: Interactive Cryptographic Deletion Certificate (DELCERT-...) Verifier */}
        <div
          data-testid="landing-verify-delcert-panel"
          className="p-5 rounded-2xl bg-slate-900 border border-sky-500/30 space-y-4 text-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold text-sky-400 uppercase flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>
                  Verify a Deletion Certificate (DELCERT-...) / Inspect Sample Certificate (DELCERT-DEMO-P1P4)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                IT Heads and CFOs can verify any issued 14-day data purge certificate against the server Deletion Certificate Ledger (<code className="font-mono text-sky-300">/api/deletion-certificates/:id</code>).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <input
                type="text"
                aria-label="Deletion Certificate ID"
                data-testid="landing-delcert-input"
                value={delCertInput}
                onChange={(e) => setDelCertInput(e.target.value)}
                placeholder="DELCERT-YYYYMMDD-XXXX"
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs w-52 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                data-testid="landing-verify-delcert-btn"
                disabled={delCertLoading}
                onClick={() => handleVerifyDeletionCertificate(delCertInput)}
                className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{delCertLoading ? 'Verifying...' : 'Verify Certificate'}</span>
              </button>
              <button
                type="button"
                data-testid="landing-inspect-demo-delcert-btn"
                disabled={delCertLoading}
                onClick={() => {
                  setDelCertInput('DELCERT-DEMO-P1P4');
                  handleVerifyDeletionCertificate('DELCERT-DEMO-P1P4');
                }}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs cursor-pointer"
              >
                Inspect Sample (DELCERT-DEMO-P1P4)
              </button>
            </div>
          </div>

          {delCertError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 font-mono text-xs"
            >
              {delCertError}
            </div>
          )}

          {verifiedDelCert && (
            <div
              data-testid="landing-verified-delcert-card"
              className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 font-mono text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-emerald-300">
                    VERIFIED DELETION CERTIFICATE: {verifiedDelCert.certificateId}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[11px]">
                    Workspace: {verifiedDelCert.workspaceId}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Issued: {verifiedDelCert.issuedAt.slice(0, 19).replace('T', ' ')} UTC · By:{' '}
                  {verifiedDelCert.purgedBy}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">P1 SKUs Scrubbed</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {verifiedDelCert.recordsPurgedSummary.p1SkusPurged} → 0
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">P2 Dispatches</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {verifiedDelCert.recordsPurgedSummary.p2DispatchesPurged} → 0
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">P3 Freight Trips</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {verifiedDelCert.recordsPurgedSummary.p3FreightTripsPurged} → 0
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">P4 Bins Scrubbed</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {verifiedDelCert.recordsPurgedSummary.p4WarehouseBinsPurged} → 0
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Quarantined Rows</div>
                  <div className="text-sm font-bold text-emerald-300 mt-0.5">
                    {verifiedDelCert.recordsPurgedSummary.quarantinedRowsPurged} → 0
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 truncate">
                  <span className="text-slate-400">Pre-Purge Dataset SHA-256: </span>
                  <span className="text-sky-300">{verifiedDelCert.prePurgeDatasetSha256}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30 truncate">
                  <span className="text-slate-400">Post-Purge Zero-Array Hash: </span>
                  <span className="text-emerald-300">
                    {verifiedDelCert.postPurgeVerificationHash}
                  </span>
                </div>
              </div>
            </div>
          )}
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
      {/* SECTION 12: VERIFIED PROOF REGISTRY (CRYPTOGRAPHICALLY BOUND 8-FIELD) */}
      {/* ===================================================================== */}
      <section
        id="verified-proof-registry"
        data-testid="verified-proof-registry-section"
        className="py-16 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto space-y-6"
      >
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            VERIFIED PROOF REGISTRY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Verified Manufacturing Outcomes
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {verifiedProofs.length > 0
              ? 'Cryptographically bound 8-field pilot outcomes derived directly from server-persisted audit snapshots.'
              : 'Customer evidence will be published here after pilot outcomes have been documented and approved.'}
          </p>
        </div>

        {verifiedProofs.length > 0 ? (
          <div className="space-y-4">
            {verifiedProofs.map((proof) => (
              <div
                key={proof.proofId}
                data-testid={`verified-proof-card-${proof.proofId}`}
                className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/40 text-xs space-y-4 shadow-xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 font-mono">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold">
                      {proof.proofId}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-700 text-slate-200 font-bold">
                      Snapshot: {proof.linkedWorkspaceId}
                    </span>
                    {proof.importRunId && (
                      <span className="px-2.5 py-1 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold">
                        ImportRun: {proof.importRunId}
                      </span>
                    )}
                    {proof.datasetSha256Prefix && (
                      <span className="px-2.5 py-1 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold">
                        SHA-256: {proof.datasetSha256Prefix}...
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold">
                    ✓ Client Sign-Off Confirmed · {new Date(proof.publishedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* 8-Field Structured Documentation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      01 · Industry Sector
                    </div>
                    <div className="text-white font-semibold">{proof.industrySector}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      02 · Dataset Scope (Derived from Snapshot)
                    </div>
                    <div className="text-slate-200 font-mono text-[11px]">{proof.datasetScope}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      03 · Initial Challenge
                    </div>
                    <div className="text-slate-300 leading-relaxed">{proof.initialChallenge}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      04 · Analysis Performed
                    </div>
                    <div className="text-slate-300 leading-relaxed">{proof.analysisPerformed}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2 md:col-span-2">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      05 · Verified Findings (Cryptographically Bound to {proof.linkedWorkspaceId})
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono text-[11px]">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-slate-400">Book Value</div>
                        <div className="font-bold text-white">
                          {formatCurrency(proof.verifiedFindings.p1BookValueInr)}
                        </div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-rose-400">Dead Stock</div>
                        <div className="font-bold text-rose-300">
                          {formatCurrency(proof.verifiedFindings.p1DeadStockInr)}
                        </div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-emerald-400">Protected Spares</div>
                        <div className="font-bold text-emerald-300">
                          {formatCurrency(proof.verifiedFindings.p1ReserveSparesProtectedInr)}
                        </div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-sky-400">P2 OTIF %</div>
                        <div className="font-bold text-sky-300">
                          {proof.verifiedFindings.p2OtifPassPct.toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-amber-400">P3 Freight Leak</div>
                        <div className="font-bold text-amber-300">
                          {formatCurrency(proof.verifiedFindings.p3FreightLeakInr)}
                        </div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-purple-400">P4 Bin Accuracy</div>
                        <div className="font-bold text-purple-300">
                          {proof.verifiedFindings.p4BinAccuracyPct.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      06 · Action Taken
                    </div>
                    <div className="text-slate-300 leading-relaxed">{proof.actionTaken}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      07 · Approved Quotation (Anonymized)
                    </div>
                    <div className="text-slate-200 italic leading-relaxed">
                      {proof.approvedQuotation ||
                        'Published with written client sign-off under anonymized sector identifier.'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1 md:col-span-2">
                    <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                      08 · Documented Limitations &amp; Item 07 Exclusions
                    </div>
                    <div className="text-slate-300 text-[11px] font-mono leading-relaxed">
                      {proof.documentedLimitations}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Honest Empty State + Interactive 8-Field Cryptographic Proof Schema Demonstration Toggle */
          <div className="p-6 rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-xs font-mono text-slate-400 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-300">
                Case Study Documentation Schema (Reserved Component)
              </span>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-850">
              <p className="text-[11px] text-slate-400 font-sans">
                Note: In strict alignment with ethical persuasion principles, Operationalyst displays zero fabricated customer logos or invented savings figures.
              </p>
              <button
                type="button"
                data-testid="toggle-sandbox-proof-preview"
                onClick={() => setShowSandboxProofPreview((prev) => !prev)}
                className="shrink-0 px-3.5 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-[11px] cursor-pointer transition"
              >
                {showSandboxProofPreview
                  ? 'Hide 8-Field Cryptographic Proof Schema'
                  : 'Preview 8-Field Cryptographic Proof Schema (Bound to Live Sandbox Audit)'}
              </button>
            </div>

            {showSandboxProofPreview && (
              <div
                data-testid="sandbox-proof-schema-card"
                className="p-5 rounded-xl bg-slate-950 border border-amber-500/40 space-y-4 text-xs font-sans mt-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 font-mono">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[10px]">
                      SCHEMA DEMONSTRATION • BOUND TO SANDBOX SNAPSHOT
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-300 text-[11px] font-bold">
                      {sandboxDemoProof.linkedWorkspaceId}
                    </span>
                    {sandboxDemoProof.importRunId && (
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-sky-300 text-[11px]">
                        {sandboxDemoProof.importRunId}
                      </span>
                    )}
                    {sandboxDemoProof.datasetSha256Prefix && (
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-purple-300 text-[11px]">
                        SHA-256: {sandboxDemoProof.datasetSha256Prefix}...
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Record ID: {sandboxDemoProof.proofId}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      01 · Industry Sector
                    </div>
                    <div className="text-white font-semibold">{sandboxDemoProof.industrySector}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      02 · Dataset Scope
                    </div>
                    <div className="text-slate-200 font-mono text-[11px]">
                      {sandboxDemoProof.datasetScope}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      03 · Initial Challenge
                    </div>
                    <div className="text-slate-300 leading-relaxed">
                      {sandboxDemoProof.initialChallenge}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      04 · Analysis Performed
                    </div>
                    <div className="text-slate-300 leading-relaxed">
                      {sandboxDemoProof.analysisPerformed}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/90 border border-emerald-500/30 space-y-2 md:col-span-2">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      05 · Verified Findings (Pulled from {sandboxDemoProof.linkedWorkspaceId})
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono text-[11px]">
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <div className="text-[10px] text-slate-400">Book Value</div>
                        <div className="font-bold text-white">
                          {formatCurrency(sandboxDemoProof.verifiedFindings.p1BookValueInr)}
                        </div>
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <div className="text-[10px] text-rose-400">Dead Stock</div>
                        <div className="font-bold text-rose-300">
                          {formatCurrency(sandboxDemoProof.verifiedFindings.p1DeadStockInr)}
                        </div>
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <div className="text-[10px] text-emerald-400">Protected Spares</div>
                        <div className="font-bold text-emerald-300">
                          {formatCurrency(sandboxDemoProof.verifiedFindings.p1ReserveSparesProtectedInr)}
                        </div>
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <div className="text-[10px] text-sky-400">P2 OTIF %</div>
                        <div className="font-bold text-sky-300">
                          {sandboxDemoProof.verifiedFindings.p2OtifPassPct.toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <div className="text-[10px] text-amber-400">P3 Freight Leak</div>
                        <div className="font-bold text-amber-300">
                          {formatCurrency(sandboxDemoProof.verifiedFindings.p3FreightLeakInr)}
                        </div>
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-800">
                        <div className="text-[10px] text-purple-400">P4 Bin Accuracy</div>
                        <div className="font-bold text-purple-300">
                          {sandboxDemoProof.verifiedFindings.p4BinAccuracyPct.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      06 · Action Taken
                    </div>
                    <div className="text-slate-300 leading-relaxed">
                      {sandboxDemoProof.actionTaken}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      07 · Approved Quotation
                    </div>
                    <div className="text-slate-200 italic leading-relaxed">
                      {sandboxDemoProof.approvedQuotation}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/90 border border-amber-500/30 space-y-1 md:col-span-2">
                    <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                      08 · Documented Limitations
                    </div>
                    <div className="text-slate-300 font-mono text-[11px] leading-relaxed">
                      {sandboxDemoProof.documentedLimitations}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
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

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              &ldquo;Operationalyst is being developed to help manufacturing teams convert existing
              inventory and operational data into clearer review priorities. The current focus is learning
              directly from manufacturing teams and validating the audit method with real operational use
              cases.&rdquo;
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
              <span>·</span>
              <a
                href="?view=lead-inbox"
                onClick={(e) => {
                  if (onOpenLeadInbox) {
                    e.preventDefault();
                    onOpenLeadInbox();
                  }
                }}
                className="text-slate-400 hover:text-emerald-300 transition underline underline-offset-4 cursor-pointer"
              >
                Founder Lead Inbox
              </a>
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
