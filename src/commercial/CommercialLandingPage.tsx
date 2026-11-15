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
  HelpCircle,
  TrendingUp,
  Award,
  Zap,
  Sparkles,
  MessageCircle,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { IcebergControlSystems } from './IcebergControlSystems';
import { B2BBehavioralSystem } from './B2BBehavioralSystem';
import {
  COMMERCIAL_PRICING_TIERS,
  FAQ_ITEMS,
  FOUNDER_EXECUTIVE_SIGNOFF,
  METHODOLOGY_STAGES,
  VALUE_PROPOSITIONS,
  OBJECTION_MATRIX,
  STAKEHOLDER_PERSPECTIVES
} from './homepageConfig';

export interface CommercialLandingPageProps {
  onSelectProject?: (projectId: 'p1' | 'p2' | 'p3' | 'p4') => void;
}

export const CommercialLandingPage: React.FC<CommercialLandingPageProps> = ({ onSelectProject }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Diagnostic Estimator state
  const [inventoryValue, setInventoryValue] = useState<number>(500); // In Lakhs (₹5 Cr default)
  const [supplierCount, setSupplierCount] = useState<number>(120);
  const [annualFreightSpend, setAnnualFreightSpend] = useState<number>(150); // In Lakhs (₹1.5 Cr)

  const officialPhone = '+91 90805 40047';
  const rawPhone = '919080540047';

  // Calculations (in Lakhs)
  const estimatedDeadStockLeak = Math.round(inventoryValue * 0.082); // ~8.2% idle >180 days
  const estimatedFreightLeak = Math.round(annualFreightSpend * 0.054); // ~5.4% demurrage & rate variance
  const estimatedVendorLeak = Math.round(supplierCount * 0.18 * 2.5); // ~₹2.5L per non-compliant vendor
  const totalLeakLakhs = estimatedDeadStockLeak + estimatedFreightLeak + estimatedVendorLeak;
  const totalLeakCr = (totalLeakLakhs / 100).toFixed(2);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleWhatsAppBooking = (tierName: string) => {
    const msg = `Hello C. Jones Snowin,\nI am interested in the ${tierName} tier for Operationalyst Audit.\nPlease contact me to discuss the ₹18,000 Factory Diagnostic with 100% Refund Guarantee if < ₹2.5L Leak Found.`;
    window.open(`https://wa.me/${rawPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600/20 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight">Operationalyst</span>
              <span className="ml-2 text-xs text-emerald-400 font-mono font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                INVARIANTS V2
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <a href="#estimator" className="hover:text-emerald-400 transition">Leak Estimator</a>
            <a href="#engines" className="hover:text-emerald-400 transition">Audit Engines</a>
            <a href="#iceberg-controls" className="hover:text-emerald-400 transition">Iceberg Controls</a>
            <a href="#b2b-behavioral" className="hover:text-emerald-400 transition">Behavioral System</a>
            <a href="#pricing" className="hover:text-emerald-400 transition">Diagnostic Pricing</a>
            <a href="#faq" className="hover:text-emerald-400 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${rawPhone}?text=${encodeURIComponent("Hello C. Jones Snowin, I'd like to request an Operationalyst Audit Scope.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
            >
              <MessageCircle className="w-4 h-4 fill-current" /> Direct WhatsApp ({officialPhone})
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-radial-at-c from-emerald-950/30 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> 100% Deterministic Mathematical Supervision &amp; Audit Gate
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Stop Hidden Working Capital Leakage Before It Hits Your P&amp;L
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Institutional operational audit suite engineered for Indian MSME manufacturing plants &amp; statutory auditors. Detects dead stock, demurrage overcharges, and vendor SLA breaches with mathematical invariant proofs.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <a
              href="#pricing"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xl shadow-emerald-900/40 transition flex items-center gap-2 text-sm border border-emerald-500/30"
            >
              Book ₹18,000 Factory Diagnostic <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#estimator"
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-700 transition text-sm flex items-center gap-2"
            >
              Calculate Plant Leakage <TrendingUp className="w-4 h-4 text-emerald-400" />
            </a>
          </div>

          <div className="pt-8 flex flex-wrap justify-center items-center gap-8 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Refund Guarantee if &lt; ₹2.5L Leak Found
            </div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" /> 48-Hour Rapid Plant Turnaround
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" /> Client-Side In-Browser CSV Sanitizer
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Leak Estimator */}
      <section id="estimator" className="py-20 bg-slate-900/60 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="text-emerald-400 font-semibold text-xs uppercase tracking-wider">Interactive Plant Diagnostic</div>
            <h2 className="text-3xl font-extrabold text-white">Factory Working Capital Leakage Estimator</h2>
            <p className="text-slate-400 text-sm">
              Adjust your plant parameters to simulate hidden leakage across inventory, logistics, and supplier desks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2 text-sm font-semibold text-slate-200">
                  <span>Total Gross Inventory Book Value</span>
                  <span className="text-emerald-400 font-mono font-bold">₹ {inventoryValue} Lakhs (₹ {(inventoryValue / 100).toFixed(2)} Cr)</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={5000}
                  step={50}
                  value={inventoryValue}
                  onChange={(e) => setInventoryValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 text-sm font-semibold text-slate-200">
                  <span>Active Vendor / Supplier Count</span>
                  <span className="text-emerald-400 font-mono font-bold">{supplierCount} Active Vendors</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={5}
                  value={supplierCount}
                  onChange={(e) => setSupplierCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 text-sm font-semibold text-slate-200">
                  <span>Annual Freight &amp; Logistics Spend</span>
                  <span className="text-emerald-400 font-mono font-bold">₹ {annualFreightSpend} Lakhs (₹ {(annualFreightSpend / 100).toFixed(2)} Cr)</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={2000}
                  step={20}
                  value={annualFreightSpend}
                  onChange={(e) => setAnnualFreightSpend(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Estimated Annual Working Capital Leak</div>
                <div className="text-3xl font-black text-rose-400 font-mono">
                  ₹ {totalLeakLakhs} Lakhs <span className="text-lg font-normal text-slate-400">(~₹ {totalLeakCr} Cr)</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Based on historical benchmark variances from 100+ Indian MSME plant audits</p>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Stagnant Inventory (&gt;180d):</span>
                  <span className="text-amber-400 font-bold">₹ {estimatedDeadStockLeak} L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Demurrage &amp; Freight Overcharge:</span>
                  <span className="text-amber-400 font-bold">₹ {estimatedFreightLeak} L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Vendor SLA &amp; Penalty Waiver:</span>
                  <span className="text-amber-400 font-bold">₹ {estimatedVendorLeak} L</span>
                </div>
              </div>

              <a
                href="#pricing"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition text-center block text-sm shadow-md shadow-emerald-900/40"
              >
                Claim ₹18,000 Diagnostic Audit
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Audit Engines Selection */}
      <section id="engines" className="py-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="text-emerald-400 font-semibold text-xs uppercase tracking-wider">Operational Audit Suite</div>
            <h2 className="text-3xl font-extrabold text-white">4 Specialized Supervision Engines</h2>
            <p className="text-slate-400 text-sm">
              Click any engine below to launch the live interactive mathematical invariant workbench.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              onClick={() => onSelectProject && onSelectProject('p1')}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-xl transition cursor-pointer group space-y-4 shadow-xl"
            >
              <div className="p-3 bg-emerald-950 text-emerald-400 rounded-lg w-fit group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">P1: Cash Recovery &amp; Stock Disposition</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                RTV, BOM Reuse, and Salvage Planner for items idle &gt;180 days with 1-Click Action CSV export.
              </p>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                Launch Engine P1 <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => onSelectProject && onSelectProject('p2')}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-xl transition cursor-pointer group space-y-4 shadow-xl"
            >
              <div className="p-3 bg-emerald-950 text-emerald-400 rounded-lg w-fit group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">P2: Customer Promise &amp; Order Fulfillment</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                SLA Breach Monitoring, OTIF fulfillment rate calculator, and dispatch variance tracking.
              </p>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                Launch Engine P2 <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => onSelectProject && onSelectProject('p3')}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-xl transition cursor-pointer group space-y-4 shadow-xl"
            >
              <div className="p-3 bg-emerald-950 text-emerald-400 rounded-lg w-fit group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">P3: Vendor Governance &amp; Price Variance</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                PO vs Invoice rate card audit, unapproved price escalation detector, and vendor scoring.
              </p>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                Launch Engine P3 <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => onSelectProject && onSelectProject('p4')}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-xl transition cursor-pointer group space-y-4 shadow-xl"
            >
              <div className="p-3 bg-emerald-950 text-emerald-400 rounded-lg w-fit group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">P4: Logistics &amp; Demurrage Watchdog</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Container detention free-time calculator, gross-tare weighbridge auditor, and route overcharge detector.
              </p>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                Launch Engine P4 <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Iceberg Control Systems Component */}
      <IcebergControlSystems />

      {/* B2B Behavioral System Component (Re-connected Section) */}
      <div id="b2b-behavioral">
        <B2BBehavioralSystem />
      </div>

      {/* Commercial Pricing Tiers with Von Restorff Flagship Highlight */}
      <section id="pricing" className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" /> Commercial Engagement Options
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Transparent Factory Audit Tiers &amp; Guarantee
            </h2>
            <p className="text-slate-400 text-base">
              Fixed fee diagnostic engagement backed by 100% money-back guarantee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {COMMERCIAL_PRICING_TIERS.map(tier => {
              const isFlagship = tier.id === 'tier_diagnostic_audit';
              return (
                <div
                  key={tier.id}
                  className={`rounded-2xl p-8 transition-all relative flex flex-col justify-between ${
                    isFlagship
                      ? 'bg-slate-900 border-2 border-emerald-500 shadow-2xl shadow-emerald-900/40 ring-4 ring-emerald-500/10 scale-105 z-10'
                      : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isFlagship && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 fill-current" /> VON RESTORFF FLAGSHIP TIER
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{tier.badge}</span>
                      <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed">{tier.description}</p>
                    </div>

                    <div className="border-y border-slate-800 py-4">
                      <div className="text-3xl font-black text-white font-mono">{tier.price}</div>
                      {isFlagship && (
                        <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 100% Refund if &lt; ₹2.5L Leak Found
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 text-xs text-slate-300">
                      {tier.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => handleWhatsAppBooking(tier.name)}
                      className={`w-full py-3.5 font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm ${
                        isFlagship
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 fill-current" /> {tier.ctaText} (+91 90805 40047)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-900/40 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <div className="text-emerald-400 font-semibold text-xs uppercase tracking-wider">Frequently Asked Questions</div>
            <h2 className="text-3xl font-extrabold text-white">Audit Security, Data Privacy &amp; SLAs</h2>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-bold text-white text-sm sm:text-base flex justify-between items-center hover:bg-slate-800/40 transition"
                >
                  <span>{item.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Signoff & Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-slate-900">
            <div className="space-y-2 text-center md:text-left">
              <div className="font-bold text-white text-base">Operationalyst Systems</div>
              <p className="text-slate-500 max-w-md">
                100% Deterministic Supervision Gate &amp; Invariants Engine for Factory Working Capital Audit.
              </p>
            </div>
            <div className="text-center md:text-right space-y-1 font-mono">
              <div className="text-emerald-400 font-bold">{FOUNDER_EXECUTIVE_SIGNOFF.name}</div>
              <div className="text-slate-500">{FOUNDER_EXECUTIVE_SIGNOFF.role} • {FOUNDER_EXECUTIVE_SIGNOFF.credentials}</div>
              <div className="text-slate-400">{officialPhone} | {FOUNDER_EXECUTIVE_SIGNOFF.contactEmail}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-600">
            <div>&copy; 2026 Operationalyst Systems. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="#estimator" className="hover:text-slate-400">Estimator</a>
              <a href="#pricing" className="hover:text-slate-400">Pricing</a>
              <a href="#faq" className="hover:text-slate-400">FAQ</a>
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
