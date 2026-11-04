/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Layers,
  Info,
  Calendar,
  Building2,
  FileCheck2,
} from 'lucide-react';

interface SampleAuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestAudit: () => void;
}

export const SampleAuditReportModal: React.FC<SampleAuditReportModalProps> = ({
  isOpen,
  onClose,
  onRequestAudit,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'sku_list' | 'methodology' | 'limitations'>('summary');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sample-report-title"
    >
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-5xl w-full p-4 sm:p-6 md:p-8 shadow-2xl border border-slate-750 relative space-y-6 my-6 max-h-[92vh] overflow-y-auto font-sans">
        {/* Top Watermark & Disclaimer Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold uppercase tracking-wider">
              ILLUSTRATIVE EXAMPLE • DEMONSTRATION DATA
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Example demonstration scenario based on standard industrial machining &amp; assembly data
          </span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Forensic Deliverable Preview
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-slate-400">File: Stock_Register_Q3_Dump.xlsx</span>
            </div>
            <h2 id="sample-report-title" className="text-xl sm:text-2xl font-black text-white">
              Factory Inventory Risk &amp; Working Capital Audit
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Audit Date: 12 October 2026 · Total Records Analyzed: 12,400 SKUs · Inventory Value: ₹4,82,50,000
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Executive Summary
          </button>
          <button
            onClick={() => setActiveTab('sku_list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeTab === 'sku_list'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. High-Priority SKUs (Top 15)
          </button>
          <button
            onClick={() => setActiveTab('methodology')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeTab === 'methodology'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Investigation Sequence
          </button>
          <button
            onClick={() => setActiveTab('limitations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeTab === 'limitations'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Scope &amp; Limitations
          </button>
        </div>

        {/* Tab 1: Executive Summary */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Top 4 Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Non-Moving Stock (&gt;180d)</div>
                <div className="text-xl sm:text-2xl font-black text-rose-300 mt-1">₹18,50,000</div>
                <div className="text-[10px] text-slate-400 mt-0.5">142 SKUs (3.8% of inventory)</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Slow-Moving (90-180d)</div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 mt-1">₹42,10,000</div>
                <div className="text-[10px] text-slate-400 mt-0.5">318 SKUs requiring review</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 bg-emerald-950/10">
                <div className="text-[10px] text-emerald-300 uppercase font-bold">Recoverable Working Capital</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">₹14,80,000</div>
                <div className="text-[10px] text-slate-400 mt-0.5">80% estimated recovery potential</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Pareto Concentration</div>
                <div className="text-xl sm:text-2xl font-black text-cyan-300 mt-1">78.4%</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Held in top 15 non-moving SKUs</div>
              </div>
            </div>

            {/* Data Quality Overview */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Data-Quality &amp; Ingestion Validation
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">99.8% Match Health</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">TOTAL ROWS PARSED:</span>
                  <span className="font-bold text-white">12,400 Line Items</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">SYNTAX / ENCODING ERRORS:</span>
                  <span className="font-bold text-emerald-400">0 Critical Errors</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">MISSING MOVEMENT DATES:</span>
                  <span className="font-bold text-amber-300">14 Items (Isolated in Log)</span>
                </div>
              </div>
            </div>

            {/* Category Level Breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Category-Level Stagnancy Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Castings &amp; Forgings</div>
                  <div className="text-base font-bold text-rose-300">₹8,40,000</div>
                  <div className="text-[10px] text-slate-400">45% of total non-moving cash</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Specialty Fasteners</div>
                  <div className="text-base font-bold text-amber-300">₹4,20,000</div>
                  <div className="text-[10px] text-slate-400">MOQ bulk order excess</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Raw Steel Bars (EN8)</div>
                  <div className="text-base font-bold text-amber-300">₹3,90,000</div>
                  <div className="text-[10px] text-slate-400">Customer drawing revision cancelled</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Packaging &amp; Consumables</div>
                  <div className="text-base font-bold text-slate-300">₹2,00,000</div>
                  <div className="text-[10px] text-slate-400">Slow rotation in Bay 4</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: High-Priority SKU List */}
        {activeTab === 'sku_list' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Top 5 of 142 Stagnant SKUs (Pareto Ranked by Rupee Exposure)</span>
              <span className="text-amber-400">Sorted by Total Value Locked</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">SKU / Part No</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Qty on Hand</th>
                    <th className="py-2.5 px-3">Unit Cost</th>
                    <th className="py-2.5 px-3 text-right">Total Value</th>
                    <th className="py-2.5 px-3 text-center">Days Idle</th>
                    <th className="py-2.5 px-3">Recommended Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/60 text-slate-200">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-rose-300">#CSG-8812</td>
                    <td className="py-2.5 px-3 text-slate-300">Heavy Pinion Gear Housing (Cast Iron)</td>
                    <td className="py-2.5 px-3">48 Units</td>
                    <td className="py-2.5 px-3">₹8,500</td>
                    <td className="py-2.5 px-3 text-right font-bold text-rose-400">₹4,08,000</td>
                    <td className="py-2.5 px-3 text-center text-rose-400 font-bold">214d</td>
                    <td className="py-2.5 px-3 text-emerald-300">Vendor Contra Debit Note</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-rose-300">#BRG-4092</td>
                    <td className="py-2.5 px-3 text-slate-300">Taper Roller Bearing Assembly</td>
                    <td className="py-2.5 px-3">120 Sets</td>
                    <td className="py-2.5 px-3">₹2,400</td>
                    <td className="py-2.5 px-3 text-right font-bold text-rose-400">₹2,88,000</td>
                    <td className="py-2.5 px-3 text-center text-rose-400 font-bold">198d</td>
                    <td className="py-2.5 px-3 text-emerald-300">Tier-1 Consignment Offset</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-rose-300">#SFT-1044</td>
                    <td className="py-2.5 px-3 text-slate-300">Splined Input Shaft (Forged 40Cr4)</td>
                    <td className="py-2.5 px-3">65 Pcs</td>
                    <td className="py-2.5 px-3">₹3,800</td>
                    <td className="py-2.5 px-3 text-right font-bold text-rose-400">₹2,47,000</td>
                    <td className="py-2.5 px-3 text-center text-rose-400 font-bold">186d</td>
                    <td className="py-2.5 px-3 text-amber-300">Machine Rework to Alt Variant</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-amber-300">#FST-9901</td>
                    <td className="py-2.5 px-3 text-slate-300">Grade 10.9 Flange Bolts M16x120</td>
                    <td className="py-2.5 px-3">2,200 Pcs</td>
                    <td className="py-2.5 px-3">₹85</td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-300">₹1,87,000</td>
                    <td className="py-2.5 px-3 text-center text-amber-300 font-bold">240d</td>
                    <td className="py-2.5 px-3 text-slate-300">Central Store Consolidation</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-amber-300">#RMB-3300</td>
                    <td className="py-2.5 px-3 text-slate-300">Round Bar Stock EN24 Dia 60mm</td>
                    <td className="py-2.5 px-3">1.2 Tonnes</td>
                    <td className="py-2.5 px-3">₹1,25,000/T</td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-300">₹1,50,000</td>
                    <td className="py-2.5 px-3 text-center text-amber-300 font-bold">182d</td>
                    <td className="py-2.5 px-3 text-slate-300">Raw Material Pool Allocation</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-400 font-mono italic">
              *Full audit deliverable contains complete spreadsheet of all 142 stagnant SKUs with bin numbers and vendor codes.
            </p>
          </div>
        )}

        {/* Tab 3: Investigation Sequence */}
        {activeTab === 'methodology' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Recommended 4-Week Investigation Sequence
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-amber-400 font-bold">WEEK 01 · PHYSICAL VERIFICATION</span>
                <p className="text-slate-300 leading-relaxed font-sans">
                  Audit top 15 SKUs (accounting for ₹14.5L) on warehouse racks to verify physical existence and condition before initiating accounting adjustments.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-emerald-400 font-bold">WEEK 02 · VENDOR CONTRA NOTES</span>
                <p className="text-slate-300 leading-relaxed font-sans">
                  Issue formal debit notes for defective or obsolete vendor-supplied forgings and bearings where warranty or contract returns apply.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-cyan-400 font-bold">WEEK 03 · PRODUCTION REWORK</span>
                <p className="text-slate-300 leading-relaxed font-sans">
                  Evaluate semi-finished shafts and bars for secondary CNC machining into fast-moving active assembly part numbers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-rose-400 font-bold">WEEK 04 · SCRAP LIQUIDATION</span>
                <p className="text-slate-300 leading-relaxed font-sans">
                  Execute competitive scrap bid for items obsolete for &gt;360 days to free physical floor space and release immediate cash.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Scope & Limitations */}
        {activeTab === 'limitations' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3 text-xs text-slate-300 font-sans">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold uppercase text-xs">
                <ShieldAlert className="w-4 h-4" />
                <span>Explicit Scope &amp; Legal Limitations (What the Audit Does NOT Do)</span>
              </div>
              <p className="leading-relaxed">
                To maintain complete commercial integrity, Operationalyst publishes explicit limitations:
              </p>
              <ul className="space-y-2 font-mono text-[11px] text-slate-300 list-disc list-inside">
                <li>
                  <strong className="text-white">Does NOT Guarantee Immediate Rupee Recovery:</strong> Recovery velocity depends on vendor contract terms, scrap market rates, and internal shop-floor agility.
                </li>
                <li>
                  <strong className="text-white">Does NOT Replace Managerial Judgment:</strong> Certain slow-moving parts are legitimate safety stock for critical machinery breakdowns. Final disposition decisions remain with the plant manager.
                </li>
                <li>
                  <strong className="text-white">Depends on Data Accuracy:</strong> Findings reflect the precision of your uploaded stock register. If stock dumps have outdated last-movement dates, findings will note these data gaps.
                </li>
                <li>
                  <strong className="text-white">Zero Third-Party Data Transfer:</strong> All file processing is performed in your isolated session. No data is stored, indexed, or shared externally.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400 text-center sm:text-left">
            <span>Want a report like this generated for your factory&apos;s inventory?</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer transition"
            >
              Close Preview
            </button>
            <button
              onClick={() => {
                onClose();
                onRequestAudit();
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition shadow-md touch-manipulation active:scale-95"
            >
              <span>Request Free Pilot Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
