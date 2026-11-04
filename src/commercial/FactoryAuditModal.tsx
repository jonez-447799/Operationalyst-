/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Building2,
  Mail,
  User,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface FactoryAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchLiveDemo?: () => void;
  onOpenSmartMapper?: () => void;
}

export const FactoryAuditModal: React.FC<FactoryAuditModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Required fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [sector, setSector] = useState('');
  const [primaryChallenge, setPrimaryChallenge] = useState('');
  const [preferredContact, setPreferredContact] = useState<'email' | 'phone'>('email');
  const [consent, setConsent] = useState(false);

  // Optional fields
  const [approxSkus, setApproxSkus] = useState('');
  const [currentSystem, setCurrentSystem] = useState<'erp' | 'excel' | 'both' | 'other' | ''>('');
  const [additionalContext, setAdditionalContext] = useState('');

  // Form states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please provide your name.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Please provide a valid work email address.';
    if (!company.trim()) errs.company = 'Please specify your company name.';
    if (!role.trim()) errs.role = 'Please specify your operational role.';
    if (!sector.trim()) errs.sector = 'Please select or enter your manufacturing sector.';
    if (!primaryChallenge.trim()) errs.primaryChallenge = 'Please describe your primary inventory challenge.';
    if (!consent) errs.consent = 'Consent is required to be contacted regarding this review request.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    trackEvent('pilot_form_started', { company, sector, role });

    // Emulate clean asynchronous validation / local storage submission placeholder
    setTimeout(() => {
      try {
        const payload = {
          name,
          email,
          company,
          role,
          sector,
          primaryChallenge,
          preferredContact,
          approxSkus,
          currentSystem,
          additionalContext,
          submittedAt: new Date().toISOString(),
        };

        // Development placeholder: persist in localStorage for review
        const existing = JSON.parse(localStorage.getItem('audit_pilot_requests_v1') || '[]');
        existing.push(payload);
        localStorage.setItem('audit_pilot_requests_v1', JSON.stringify(existing));

        trackEvent('pilot_form_completed', { company, role });
      } catch (err) {
        // Safe fail
      }

      setSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setCompany('');
    setRole('');
    setSector('');
    setPrimaryChallenge('');
    setPreferredContact('email');
    setConsent(false);
    setApproxSkus('');
    setCurrentSystem('');
    setAdditionalContext('');
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pilot-audit-title"
    >
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-slate-800 relative space-y-5 my-6 max-h-[92vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                FOUNDER-LED PILOT AUDIT REQUEST
              </span>
            </div>
            <h2 id="pilot-audit-title" className="text-lg sm:text-xl font-bold text-white">
              Request a Factory Inventory Audit
            </h2>
            <p className="text-xs text-slate-400">
              Initial suitability review. No files or confidential records need to be shared at this stage.
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

        {/* Confirmation Screen */}
        {submitted ? (
          <div className="space-y-5 py-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Request Received</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                Thank you. Your request has been received. The next step is a short suitability review to confirm the audit scope, required data and handling process. No files need to be shared until those details are agreed.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2 text-xs font-mono text-slate-400">
              <div className="font-bold text-slate-300 uppercase">What happens next:</div>
              <ul className="space-y-1 list-disc list-inside">
                <li>Founder Jonez Snowin will review your plant profile and sector requirements.</li>
                <li>You will receive an email within 1–2 business days regarding scope confirmation.</li>
                <li>No automatic account creation or paid subscription is initiated.</li>
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer transition shadow"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Initial Request Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Name */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300 flex items-center gap-1">
                  <span>Name</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
                {errors.name && <p className="text-rose-400 text-[10px]">{errors.name}</p>}
              </div>

              {/* Work Email */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300 flex items-center gap-1">
                  <span>Work Email</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
                {errors.email && <p className="text-rose-400 text-[10px]">{errors.email}</p>}
              </div>

              {/* Company */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300 flex items-center gap-1">
                  <span>Company</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Apex Engineering Ltd"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
                {errors.company && <p className="text-rose-400 text-[10px]">{errors.company}</p>}
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300 flex items-center gap-1">
                  <span>Role</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Plant Head / Operations Director"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
                {errors.role && <p className="text-rose-400 text-[10px]">{errors.role}</p>}
              </div>

              {/* Manufacturing Sector */}
              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-300 flex items-center gap-1">
                  <span>Manufacturing Sector</span>
                  <span className="text-rose-400">*</span>
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  <option value="">Select your sector...</option>
                  <option value="Automotive & Ancillary Components">Automotive &amp; Ancillary Components (Tier-1/2)</option>
                  <option value="Precision Machining & Fabrication">Precision Machining &amp; Fabrication</option>
                  <option value="Industrial Machinery & Equipment">Industrial Machinery &amp; Equipment</option>
                  <option value="Electricals & Electronics Assembly">Electricals &amp; Electronics Assembly</option>
                  <option value="Castings & Forgings">Castings &amp; Forgings</option>
                  <option value="Other Discrete Manufacturing">Other Discrete Manufacturing</option>
                </select>
                {errors.sector && <p className="text-rose-400 text-[10px]">{errors.sector}</p>}
              </div>

              {/* Primary Inventory Challenge */}
              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-300 flex items-center gap-1">
                  <span>Primary Inventory Challenge</span>
                  <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  value={primaryChallenge}
                  onChange={(e) => setPrimaryChallenge(e.target.value)}
                  placeholder="e.g. Non-moving raw material stock accumulating; difficult to isolate aged SKUs before month-end."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs resize-none"
                />
                {errors.primaryChallenge && <p className="text-rose-400 text-[10px]">{errors.primaryChallenge}</p>}
              </div>

              {/* Preferred Contact Method */}
              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-300 flex items-center gap-1">
                  <span>Preferred Contact Method</span>
                  <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center gap-4 pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="email"
                      checked={preferredContact === 'email'}
                      onChange={() => setPreferredContact('email')}
                      className="accent-emerald-500"
                    />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="phone"
                      checked={preferredContact === 'phone'}
                      onChange={() => setPreferredContact('phone')}
                      className="accent-emerald-500"
                    />
                    <span>Phone consultation</span>
                  </label>
                </div>
              </div>

              {/* Optional Section Divider */}
              <div className="sm:col-span-2 border-t border-slate-850 pt-3">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Optional Plant Details (Helps us assess suitability)
                </span>
              </div>

              {/* Optional: Approximate SKUs */}
              <div className="space-y-1">
                <label className="text-slate-400">Approximate Number of SKUs</label>
                <input
                  type="text"
                  value={approxSkus}
                  onChange={(e) => setApproxSkus(e.target.value)}
                  placeholder="e.g. 2,000–10,000"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              {/* Optional: Current System */}
              <div className="space-y-1">
                <label className="text-slate-400">Current System</label>
                <select
                  value={currentSystem}
                  onChange={(e) => setCurrentSystem(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  <option value="">Select system...</option>
                  <option value="erp">ERP (SAP / Oracle / Busy / Other)</option>
                  <option value="excel">Tally Prime / Excel Spreadsheets</option>
                  <option value="both">Both ERP and Excel</option>
                  <option value="other">Custom in-house or Other</option>
                </select>
              </div>

              {/* Optional: Additional Context */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-400">Additional Context</label>
                <input
                  type="text"
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="Any specific timing, plant location, or review requirements"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              {/* Required Consent Checkbox */}
              <div className="sm:col-span-2 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 accent-emerald-500 rounded"
                  />
                  <span className="text-[11px] leading-relaxed">
                    I consent to being contacted regarding this Factory Inventory Audit request. No files need to be uploaded at this stage, and audit scope is confirmed before any analysis.
                  </span>
                </label>
                {errors.consent && <p className="text-rose-400 text-[10px] pt-1">{errors.consent}</p>}
              </div>
            </div>

            {/* Note & Action Buttons */}
            <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[10px] text-slate-400 font-mono">
                No automatic signup · Confidential inquiry
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition shadow disabled:opacity-50"
                >
                  <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
