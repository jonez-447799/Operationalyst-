/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  X,
  CheckCircle2,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  FileLock2,
  FileSpreadsheet,
  Download,
  ClipboardCheck,
  Users,
} from 'lucide-react';
import { trackEvent, trackServerFunnelEvent } from '../utils/analytics';
import {
  downloadPilotDataKitCsv,
  downloadPilotDataKitXlsx,
} from '../utils/pilotDataKitExporter';
import type { BuyerPersona } from '../utils/leadValidation';
import type { SelfAssessmentEvaluation } from '../utils/selfAssessmentScorer';

interface FactoryAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceView?: string;
  initialBuyerPersona?: BuyerPersona;
  diagnosticAttachment?: SelfAssessmentEvaluation | null;
  onLaunchLiveDemo?: () => void;
  onOpenSmartMapper?: () => void;
}

const BUYER_PERSONA_OPTIONS: {
  value: BuyerPersona;
  label: string;
  helperText: string;
}[] = [
  {
    value: 'ECONOMIC_BUYER',
    label: 'Economic Buyer (Managing Director / Owner / CFO)',
    helperText:
      'Focuses on working-capital release, dead-stock rupee exposure (>180 days), and board-ready audit trails.',
  },
  {
    value: 'INTERNAL_CHAMPION',
    label: 'Internal Champion (Plant Head / GM Operations)',
    helperText:
      'Focuses on objective cross-department inventory alignment, dispatch OTIF protection, and 48-hour diagnostic turnaround.',
  },
  {
    value: 'PRIMARY_USER',
    label: 'Primary User (Materials / Purchase / Stores Head)',
    helperText:
      'Focuses on zero manual Excel VLOOKUPs, clean 5-column export templates, and SKU-level reorder vs non-moving priority lists.',
  },
  {
    value: 'TECHNICAL_EVALUATOR',
    label: 'Technical / Financial Evaluator (Finance Controller / ERP / IT)',
    helperText:
      'Focuses on zero ERP write-back risk, deterministic ageing rules, and strict part-number masking / data-governance compliance.',
  },
  {
    value: 'GENERAL',
    label: 'General Operational Inquiry',
    helperText:
      'Standard 3-step suitability review covering inventory ageing, dispatch OTIF, freight leakage, and warehouse bin accuracy.',
  },
];

export const FactoryAuditModal: React.FC<FactoryAuditModalProps> = ({
  isOpen,
  onClose,
  sourceView = 'audit_modal',
  initialBuyerPersona = 'GENERAL',
  diagnosticAttachment = null,
}) => {
  // Required fields aligned with POST /api/pilot-requests schema
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phoneOrWhatsapp, setPhoneOrWhatsapp] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [plantLocation, setPlantLocation] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [consentConfirmed, setConsentConfirmed] = useState(false);

  // Optional fields aligned with POST /api/pilot-requests schema
  const [erpSystem, setErpSystem] = useState('');
  const [approxSkuCount, setApproxSkuCount] = useState('');
  const [primaryChallenge, setPrimaryChallenge] = useState('');
  const [buyerPersona, setBuyerPersona] = useState<BuyerPersona>(initialBuyerPersona);

  // Hidden honeypot spam trap
  const [websiteHoneypot, setWebsiteHoneypot] = useState('');

  // Submission & validation states
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [submittedTimestamp, setSubmittedTimestamp] = useState<string | null>(null);

  // Synchronize pre-selected buyer persona when modal opens
  useEffect(() => {
    if (isOpen && initialBuyerPersona) {
      setBuyerPersona(initialBuyerPersona);
    }
  }, [isOpen, initialBuyerPersona]);

  // Pre-fill primaryChallenge when diagnosticAttachment is provided
  useEffect(() => {
    if (isOpen && diagnosticAttachment?.recommendedChallengeText) {
      setPrimaryChallenge((prev) =>
        prev.trim().length === 0 ? diagnosticAttachment.recommendedChallengeText : prev
      );
    }
  }, [isOpen, diagnosticAttachment]);

  if (!isOpen) return null;

  const activePersonaMeta =
    BUYER_PERSONA_OPTIONS.find((p) => p.value === buyerPersona) || BUYER_PERSONA_OPTIONS[4];

  const validateClientSide = (): boolean => {
    const errs: Record<string, string> = {};
    if (fullName.trim().length < 2) {
      errs.fullName = 'Please provide your full name (at least 2 characters).';
    }
    if (!workEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(workEmail.trim())) {
      errs.workEmail = 'Please provide a valid work email address.';
    }
    if (phoneOrWhatsapp.trim().length < 7) {
      errs.phoneOrWhatsapp = 'Please provide a phone or WhatsApp number (7–25 characters).';
    }
    if (companyName.trim().length < 2) {
      errs.companyName = 'Please specify your company or factory name.';
    }
    if (plantLocation.trim().length < 2) {
      errs.plantLocation = 'Please specify your plant location (City / Industrial Estate).';
    }
    if (roleTitle.trim().length < 2) {
      errs.roleTitle = 'Please specify your role or title.';
    }
    if (!consentConfirmed) {
      errs.consentConfirmed = 'Explicit consent is required to submit a Pilot Audit request.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildFallbackMailtoUrl = (): string => {
    const subject = encodeURIComponent(
      `Pilot Factory Inventory Audit Request — ${companyName.trim() || 'Manufacturing Inquiry'}`
    );
    const bodyLines = [
      'Hello C. Jones Snowin,',
      '',
      'I would like to request a Pilot Factory Inventory Audit:',
      `- Full Name: ${fullName.trim()}`,
      `- Role / Title: ${roleTitle.trim()}`,
      `- Buyer Seat: ${buyerPersona}`,
      `- Company / Factory: ${companyName.trim()}`,
      `- Plant Location: ${plantLocation.trim()}`,
      `- Work Email: ${workEmail.trim()}`,
      `- Phone / WhatsApp: ${phoneOrWhatsapp.trim()}`,
      `- ERP / Current System: ${erpSystem || 'Not specified'}`,
      `- Approx. SKU Count: ${approxSkuCount.trim() || 'Not specified'}`,
      `- Primary Challenge: ${primaryChallenge.trim() || 'Not specified'}`,
      ...(diagnosticAttachment
        ? [
            `- Self-Assessment Score: ${diagnosticAttachment.readinessScore}/100 (${diagnosticAttachment.riskBand})`,
          ]
        : []),
      '',
      'Please share the suitability review and 5-column data scope guide.',
    ];
    return `mailto:joneszz2004@gmail.com?subject=${subject}&body=${encodeURIComponent(
      bodyLines.join('\n')
    )}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateClientSide()) return;

    setSubmitting(true);
    trackEvent('pilot_form_started', {
      company: companyName.trim(),
      role: roleTitle.trim(),
      buyerPersona,
      hasDiagnostic: Boolean(diagnosticAttachment),
      sourceView,
    });

    try {
      const response = await fetch('/api/pilot-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          workEmail: workEmail.trim(),
          phoneOrWhatsapp: phoneOrWhatsapp.trim(),
          companyName: companyName.trim(),
          plantLocation: plantLocation.trim(),
          roleTitle: roleTitle.trim(),
          erpSystem: erpSystem.trim(),
          approxSkuCount: approxSkuCount.trim(),
          primaryChallenge: primaryChallenge.trim(),
          buyerPersona,
          ...(diagnosticAttachment
            ? {
                selfAssessmentScore: diagnosticAttachment.readinessScore,
                selfAssessmentBand: diagnosticAttachment.riskBand,
                selfAssessmentSummary: diagnosticAttachment.summaryText,
              }
            : {}),
          consentConfirmed,
          websiteHoneypot,
          sourceView,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data || !data.ok) {
        if (data?.fieldErrors && typeof data.fieldErrors === 'object') {
          setFieldErrors(data.fieldErrors);
        }
        setSubmitError(
          data?.error ||
            `Submission returned HTTP ${response.status}. You can retry or send your details directly via email below.`
        );
        setSubmitting(false);
        return;
      }

      trackEvent('pilot_form_completed', {
        leadId: data.leadId,
        buyerPersona,
        sourceView,
      });
      trackServerFunnelEvent('PILOT_AUDIT_SUBMITTED', {
        sourceSection: sourceView,
        buyerPersona,
      });

      setSubmittedLeadId(data.leadId || 'PILOT-PENDING');
      setSubmittedTimestamp(data.createdAt || new Date().toISOString());
      setSubmitting(false);
    } catch {
      setSubmitError(
        'Network error while reaching the Operationalyst server. Your details were not lost — please retry or click the pre-filled email link below.'
      );
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedLeadId(null);
    setSubmittedTimestamp(null);
    setSubmitError(null);
    setFieldErrors({});
    setFullName('');
    setWorkEmail('');
    setPhoneOrWhatsapp('');
    setCompanyName('');
    setPlantLocation('');
    setRoleTitle('');
    setErpSystem('');
    setApproxSkuCount('');
    setPrimaryChallenge('');
    setBuyerPersona('GENERAL');
    setConsentConfirmed(false);
    setWebsiteHoneypot('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pilot-audit-title"
    >
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-800 relative space-y-5 my-6 max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                FOUNDER-LED PILOT AUDIT REQUEST
              </span>
              {diagnosticAttachment && (
                <span
                  data-testid="modal-diagnostic-badge"
                  className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold inline-flex items-center gap-1"
                >
                  <ClipboardCheck className="w-3 h-3" />
                  <span>
                    Self-Assessment Attached: Score {diagnosticAttachment.readinessScore}/100
                  </span>
                </span>
              )}
            </div>
            <h2 id="pilot-audit-title" className="text-lg sm:text-xl font-bold text-white">
              Request a Factory Inventory Audit
            </h2>
            <p className="text-xs text-slate-300">
              Step 1 suitability intake with founder C. Jones Snowin.
            </p>
          </div>

          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center justify-center cursor-pointer"
            aria-label="Close Request Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explicit Confidentiality & No-File-Upload Boundary Banner */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
          <div className="flex items-start gap-3">
            <FileLock2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-200 leading-relaxed">
              <strong className="text-emerald-300">No File Upload in Step 1:</strong> Do not upload confidential inventory files in this step. Data scope, 5-column template, and anonymization options are confirmed after suitability review.
            </p>
          </div>
          <div
            data-testid="modal-plain-english-privacy-banner"
            className="pt-2 border-t border-slate-800/80 flex items-start gap-2.5 text-[11px] text-emerald-200 leading-relaxed"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-emerald-300">Plain-English Privacy Guarantee:</strong> Strip vendor and customer names before sending. Reviewed only by founder C. Jones Snowin and purged within 14 days (or immediately after your call) with a cryptographic Deletion Certificate (<code className="font-mono text-emerald-300">DELCERT-...</code>).
            </span>
          </div>
        </div>

        {/* Confirmation Screen on 201 Created */}
        {submittedLeadId ? (
          <div className="space-y-5 py-2 animate-in fade-in duration-200">
            <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Pilot Audit Request Recorded on Server</span>
                </div>
                <span
                  data-testid="pilot-lead-reference-id"
                  className="px-3 py-1 rounded-md bg-slate-950 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs"
                >
                  Reference ID: {submittedLeadId}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Your request for <strong>{companyName}</strong> ({plantLocation}) has been saved. Please keep your Reference ID (<strong>{submittedLeadId}</strong>) for your records.
              </p>
              {submittedTimestamp && (
                <div className="text-[11px] font-mono text-slate-400">
                  Recorded at: {new Date(submittedTimestamp).toLocaleString()}
                </div>
              )}
            </div>

            {/* 3 Concrete Next Steps */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="font-mono font-bold text-slate-200 uppercase tracking-wider">
                3-Step Intake &amp; Audit Sequence:
              </div>
              <ol className="space-y-2.5 text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono font-bold text-[11px] shrink-0">
                    1. Suitability Review
                  </span>
                  <span>
                    Founder C. Jones Snowin reviews your plant profile, ERP format, and inventory challenge within 1 business day.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono font-bold text-[11px] shrink-0">
                    2. Scope &amp; 5-Column Data Guide
                  </span>
                  <span>
                    We confirm mutual NDA/privacy terms and share the 5-column export guide (with part-number masking options) before any file is transferred.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono font-bold text-[11px] shrink-0">
                    3. 30-Minute Findings Walkthrough
                  </span>
                  <span>
                    1-on-1 walkthrough of non-moving exposure, ageing brackets, and priority SKUs with C. Jones Snowin.
                  </span>
                </li>
              </ol>

              {/* Step 2 Data Kit Download Actions */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    trackServerFunnelEvent('DATA_KIT_DOWNLOADED', {
                      sourceSection: 'audit_modal_confirmation_xlsx',
                    });
                    downloadPilotDataKitXlsx();
                  }}
                  className="px-3.5 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download 5-Column Data Guide (.XLSX)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    trackServerFunnelEvent('DATA_KIT_DOWNLOADED', {
                      sourceSection: 'audit_modal_confirmation_csv',
                    });
                    downloadPilotDataKitCsv();
                  }}
                  className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>Download Blank CSV Template</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={buildFallbackMailtoUrl()}
                className="text-xs font-mono text-slate-400 hover:text-emerald-300 underline"
              >
                Direct Founder Desk (C. Jones Snowin)
              </a>
              <button
                onClick={handleResetAndClose}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer transition shadow"
              >
                Done &amp; Close
              </button>
            </div>
          </div>
        ) : (
          /* Initial Request Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
            {/* Hidden spam honeypot field */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="pilot-website-honeypot">Website URL (Leave blank)</label>
              <input
                id="pilot-website-honeypot"
                type="text"
                name="websiteHoneypot"
                tabIndex={-1}
                autoComplete="off"
                value={websiteHoneypot}
                onChange={(e) => setWebsiteHoneypot(e.target.value)}
              />
            </div>

            {/* Server / Network Error Alert with Direct Mailto Fallback */}
            {submitError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 space-y-2"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-rose-300">Unable to Complete Request</div>
                    <p className="text-xs text-rose-200 leading-relaxed">{submitError}</p>
                  </div>
                </div>
                <div className="pt-1 flex flex-wrap items-center gap-3">
                  <a
                    href={buildFallbackMailtoUrl()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-100 font-mono font-bold text-[11px]"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Pre-Filled Request via Email (joneszz2004@gmail.com)</span>
                  </a>
                </div>
              </div>
            )}

            {/* Buyer Persona / Stakeholder Seat Selector */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label
                htmlFor="pilot-buyer-persona"
                className="font-mono font-bold text-[11px] text-emerald-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Your Operational Seat / Perspective</span>
              </label>
              <select
                id="pilot-buyer-persona"
                name="buyerPersona"
                data-testid="modal-buyer-persona-select"
                value={buyerPersona}
                onChange={(e) => setBuyerPersona(e.target.value as BuyerPersona)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 text-xs font-medium"
              >
                {BUYER_PERSONA_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p
                data-testid="modal-buyer-persona-helper"
                className="text-[11px] text-slate-300 leading-relaxed"
              >
                {activePersonaMeta.helperText}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label htmlFor="pilot-full-name" className="font-semibold text-slate-200 flex items-center gap-1">
                  <span>Full Name</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  id="pilot-full-name"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
                {fieldErrors.fullName && (
                  <p className="text-rose-400 text-[11px]">{fieldErrors.fullName}</p>
                )}
              </div>

              {/* Work Email */}
              <div className="space-y-1">
                <label htmlFor="pilot-work-email" className="font-semibold text-slate-200 flex items-center gap-1">
                  <span>Work Email</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  id="pilot-work-email"
                  name="workEmail"
                  type="email"
                  required
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="rajesh@apexengineering.in"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
                {fieldErrors.workEmail && (
                  <p className="text-rose-400 text-[11px]">{fieldErrors.workEmail}</p>
                )}
              </div>

              {/* Phone or WhatsApp */}
              <div className="space-y-1">
                <label htmlFor="pilot-phone" className="font-semibold text-slate-200 flex items-center gap-1">
                  <span>Phone / WhatsApp</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  id="pilot-phone"
                  name="phoneOrWhatsapp"
                  type="tel"
                  required
                  value={phoneOrWhatsapp}
                  onChange={(e) => setPhoneOrWhatsapp(e.target.value)}
                  placeholder="+91 98400 12345"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
                {fieldErrors.phoneOrWhatsapp && (
                  <p className="text-rose-400 text-[11px]">{fieldErrors.phoneOrWhatsapp}</p>
                )}
              </div>

              {/* Role / Title */}
              <div className="space-y-1">
                <label htmlFor="pilot-role-title" className="font-semibold text-slate-200 flex items-center gap-1">
                  <span>Role / Job Title</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  id="pilot-role-title"
                  name="roleTitle"
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Managing Director / Plant Head / Materials Head"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
                {fieldErrors.roleTitle && (
                  <p className="text-rose-400 text-[11px]">{fieldErrors.roleTitle}</p>
                )}
              </div>

              {/* Company Name */}
              <div className="space-y-1">
                <label htmlFor="pilot-company-name" className="font-semibold text-slate-200 flex items-center gap-1">
                  <span>Company / Factory Name</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  id="pilot-company-name"
                  name="companyName"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Auto Components Pvt Ltd"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
                {fieldErrors.companyName && (
                  <p className="text-rose-400 text-[11px]">{fieldErrors.companyName}</p>
                )}
              </div>

              {/* Plant Location */}
              <div className="space-y-1">
                <label htmlFor="pilot-plant-location" className="font-semibold text-slate-200 flex items-center gap-1">
                  <span>Plant Location (City / Industrial Estate)</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  id="pilot-plant-location"
                  name="plantLocation"
                  type="text"
                  required
                  value={plantLocation}
                  onChange={(e) => setPlantLocation(e.target.value)}
                  placeholder="e.g. Ambattur SIDCO, Chennai / Chakan, Pune"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
                {fieldErrors.plantLocation && (
                  <p className="text-rose-400 text-[11px]">{fieldErrors.plantLocation}</p>
                )}
              </div>

              {/* Optional Section Header */}
              <div className="sm:col-span-2 border-t border-slate-800 pt-3">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Optional Operational Context (Helps Prepare Your Scope Review)
                </span>
              </div>

              {/* Optional: ERP / Inventory System */}
              <div className="space-y-1">
                <label htmlFor="pilot-erp-system" className="text-slate-300 font-medium">
                  ERP / Inventory System
                </label>
                <select
                  id="pilot-erp-system"
                  name="erpSystem"
                  value={erpSystem}
                  onChange={(e) => setErpSystem(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  <option value="">Select system (optional)...</option>
                  <option value="Tally Prime / Tally ERP 9">Tally Prime / Tally ERP 9</option>
                  <option value="SAP (B1 / S4 / ECC)">SAP (B1 / S4 / ECC)</option>
                  <option value="Busy / Marg / Zoho">Busy / Marg / Zoho</option>
                  <option value="Microsoft Dynamics / Oracle / Infor">Microsoft Dynamics / Oracle / Infor</option>
                  <option value="Excel / Google Sheets">Excel / Google Sheets</option>
                  <option value="Custom ERP + Spreadsheets">Custom ERP + Spreadsheets</option>
                </select>
                {fieldErrors.erpSystem && (
                  <p className="text-rose-400 text-[11px]">{fieldErrors.erpSystem}</p>
                )}
              </div>

              {/* Optional: Approx SKU Count */}
              <div className="space-y-1">
                <label htmlFor="pilot-sku-count" className="text-slate-300 font-medium">
                  Approximate Active SKUs / Parts
                </label>
                <input
                  id="pilot-sku-count"
                  name="approxSkuCount"
                  type="text"
                  value={approxSkuCount}
                  onChange={(e) => setApproxSkuCount(e.target.value)}
                  placeholder="e.g. 1,500–8,000 SKUs (or ₹2 Cr – ₹10 Cr)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
                {fieldErrors.approxSkuCount && (
                  <p className="text-rose-400 text-[11px]">{fieldErrors.approxSkuCount}</p>
                )}
              </div>

              {/* Optional: Primary Inventory Challenge */}
              <div className="space-y-1 sm:col-span-2">
                <label htmlFor="pilot-primary-challenge" className="text-slate-300 font-medium">
                  Primary Inventory or Working-Capital Challenge
                </label>
                <textarea
                  id="pilot-primary-challenge"
                  name="primaryChallenge"
                  rows={2}
                  value={primaryChallenge}
                  onChange={(e) => setPrimaryChallenge(e.target.value)}
                  placeholder="e.g. Non-moving raw material and slow-moving spares accumulating across stores; need SKU-level ageing priority before quarterly review."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs resize-none"
                />
                {fieldErrors.primaryChallenge && (
                  <p className="text-rose-400 text-[11px]">{fieldErrors.primaryChallenge}</p>
                )}
              </div>

              {/* Required Consent Checkbox */}
              <div className="sm:col-span-2 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-slate-300">
                  <input
                    id="pilot-consent-checkbox"
                    name="consentConfirmed"
                    type="checkbox"
                    checked={consentConfirmed}
                    onChange={(e) => setConsentConfirmed(e.target.checked)}
                    className="mt-0.5 accent-emerald-500 rounded cursor-pointer"
                  />
                  <span className="text-[11px] leading-relaxed">
                    I confirm that I am requesting a Pilot Factory Inventory Audit suitability review and consent to being contacted by founder C. Jones Snowin regarding audit scope and data handling.
                  </span>
                </label>
                {fieldErrors.consentConfirmed && (
                  <p className="text-rose-400 text-[11px] pt-1">{fieldErrors.consentConfirmed}</p>
                )}
              </div>
            </div>

            {/* Footer Action Bar */}
            <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>No automatic subscription · Direct founder review</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition shadow disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Pilot Audit Request</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
