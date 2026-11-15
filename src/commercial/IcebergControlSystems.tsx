/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BEHAVIORAL_ICEBERG_DIMENSIONS, IcebergDimension } from './homepageConfig';

interface SampleLeakRow {
  rowNum: number;
  skuOrLr: string;
  category: string;
  discrepancyType: string;
  amountLakhs: number;
  status: string;
}

const SAMPLE_LEAK_ROWS: SampleLeakRow[] = [
  { rowNum: 1, skuOrLr: 'SKU-8842 / LR-99214', category: 'Logistics', discrepancyType: 'Demurrage Free-Time Breach', amountLakhs: 4.85, status: 'Audited' },
  { rowNum: 2, skuOrLr: 'SKU-1049 / PO-44812', category: 'Procurement', discrepancyType: 'PO SLA Late Delivery Penalty', amountLakhs: 3.90, status: 'Audited' },
  { rowNum: 3, skuOrLr: 'SKU-7720 / INV-88103', category: 'Accounts Payable', discrepancyType: 'Duplicate Voucher Disbursement', amountLakhs: 2.75, status: 'Audited' },
  { rowNum: 4, skuOrLr: 'SKU-3319 / BIN-00421', category: 'Physical Stock', discrepancyType: 'Phantom Bin Shortage', amountLakhs: 5.10, status: 'Locked' },
  { rowNum: 5, skuOrLr: 'SKU-9921 / LR-44102', category: 'Inbound Freight', discrepancyType: 'Weighbridge Gross-Tare Variance', amountLakhs: 1.85, status: 'Locked' },
  { rowNum: 6, skuOrLr: 'SKU-4402 / BOM-10294', category: 'Production', discrepancyType: 'BOM Scrap Ratio Exceeded', amountLakhs: 3.40, status: 'Locked' },
];

export const IcebergControlSystems: React.FC = () => {
  const [selectedDimension, setSelectedDimension] = useState<IcebergDimension>(BEHAVIORAL_ICEBERG_DIMENSIONS[0]);
  const [activeTab, setActiveTab] = useState<'tower' | 'teaser' | 'calculator' | 'builder' | 'purge'>('tower');
  
  // CA Partner Calculator state
  const [monthlyAuditClients, setMonthlyAuditClients] = useState<number>(5);
  const [avgClientLeakLakhs, setAvgClientLeakLakhs] = useState<number>(8.5);

  // 48-Hr Scope Builder state
  const [selectedErp, setSelectedErp] = useState<string>('Tally ERP / Prime');
  const [plantCorridor, setPlantCorridor] = useState<string>('West & North Corridors');
  const [requestedTier, setRequestedTier] = useState<string>('₹18,000 48-Hr Diagnostic');

  // Privacy Stripper preview toggle state
  const [stripPrivacyEnabled, setStripPrivacyEnabled] = useState<boolean>(true);

  // 24-Hr SLA Data Purge form state
  const [purgeEmail, setPurgeEmail] = useState<string>('');
  const [purgeReference, setPurgeReference] = useState<string>('');
  const [purgeSubmitted, setPurgeSubmitted] = useState<boolean>(false);

  // Calculations
  const caPartnerMonthlyPayout = monthlyAuditClients * 18000 * 0.20;
  const caPartnerAnnualPayout = caPartnerMonthlyPayout * 12;
  const totalIdentifiedLeakLakhs = SAMPLE_LEAK_ROWS.reduce((acc, row) => acc + row.amountLakhs, 0);

  // Download Teaser Report handler
  const handleDownloadTeaser = () => {
    const csvContent = [
      'Row,SKU/LR Reference,Category,Discrepancy Type,Amount (₹ Lakhs),Status',
      ...SAMPLE_LEAK_ROWS.map(r => `${r.rowNum},"${r.skuOrLr}","${r.category}","${r.discrepancyType}",${r.amountLakhs},${r.status}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Operationalyst_Sample_Executive_Teaser_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp outreach URL construction
  const whatsappMessage = encodeURIComponent(
    `Hello Operationalyst Audit Desk, I would like to request an audit review.\nERP System: ${selectedErp}\nPlant Corridors: ${plantCorridor}\nRequested Engagement: ${requestedTier}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  const mailtoUrl = `mailto:joneszz2004@gmail.com?subject=${encodeURIComponent('Audit Engagement Request: ' + requestedTier)}&body=${whatsappMessage}`;

  const handlePurgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (purgeEmail && purgeReference) {
      setPurgeSubmitted(true);
    }
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Control Tower Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span className="text-cyan-400">Operationalyst</span> Control Tower
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Institutional Cash Leak Diagnostic &amp; CA Partner Operations Workbench
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('tower')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'tower'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Control Tower
            </button>
            <button
              onClick={() => setActiveTab('teaser')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'teaser'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Teaser Report Preview
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'calculator'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              CA Partner Calculator
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'builder'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              48-Hr Scope Builder
            </button>
            <button
              onClick={() => setActiveTab('purge')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'purge'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              24-Hr SLA Data Purge
            </button>
          </div>
        </div>

        {/* TAB 1: Control Tower */}
        {activeTab === 'tower' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">
                27 Operational Iceberg Dimensions
              </h3>
              {BEHAVIORAL_ICEBERG_DIMENSIONS.map((dim) => (
                <button
                  key={dim.id}
                  onClick={() => setSelectedDimension(dim)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedDimension.id === dim.id
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 shadow-md'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400 font-bold">#{dim.num}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">{dim.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-200 mt-1">{dim.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{dim.symptom}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    Dimension #{selectedDimension.num} — {selectedDimension.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">{selectedDimension.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">Scope: {selectedDimension.scope}</p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
                  Active Control Invariant
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg space-y-1">
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Operational Symptom</span>
                  <p className="text-sm text-slate-200">{selectedDimension.symptom}</p>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg space-y-1">
                  <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">Underlying Cause</span>
                  <p className="text-sm text-slate-200">{selectedDimension.underlyingCause}</p>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg space-y-1">
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Financial Impact</span>
                  <p className="text-sm font-semibold text-emerald-300">{selectedDimension.financialImpact}</p>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg space-y-1">
                  <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Preventative Mechanism</span>
                  <p className="text-sm text-slate-200">{selectedDimension.preventativeMechanism}</p>
                </div>
              </div>

              <div className="bg-cyan-950/30 border border-cyan-500/20 p-4 rounded-lg flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-cyan-200">Test this dimension on your ERP data</h4>
                  <p className="text-xs text-slate-400">Run a ₹0 in-browser audit sandbox to detect this leak category.</p>
                </div>
                <button
                  onClick={() => setActiveTab('teaser')}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md"
                >
                  Preview Teaser Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Blurred Executive Teaser Report Preview */}
        {activeTab === 'teaser' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Sale #1 Conversion Kit
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  Blurred Executive Teaser Report Preview
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Total Plant Cash Leak Identified: <span className="text-emerald-400 font-extrabold text-lg">₹ {totalIdentifiedLeakLakhs.toFixed(2)} Lakhs</span>
                </p>
              </div>
              <button
                onClick={handleDownloadTeaser}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <span>Download Sample Executive Teaser (HTML/CSV)</span>
              </button>
            </div>

            {/* In-Browser Privacy Stripper Toggle */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  100% In-Browser Party &amp; Vendor Name Stripper:
                </span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${stripPrivacyEnabled ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
                  {stripPrivacyEnabled ? 'ACTIVE (Vendor Names Anonymized Local Client-Side)' : 'INACTIVE (Raw Ledger Mode)'}
                </span>
              </div>
              <button
                onClick={() => setStripPrivacyEnabled(!stripPrivacyEnabled)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700"
              >
                {stripPrivacyEnabled ? 'Disable Privacy Stripper Preview' : 'Enable Privacy Stripper'}
              </button>
            </div>

            {/* Table displaying top 3 clear rows + blurred rows 4+ */}
            <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 uppercase text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">SKU / LR Reference</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Discrepancy Type</th>
                    <th className="py-3 px-4 text-right">Amount (₹ Lakhs)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {/* Top 3 High-Leak SKUs / Transporter LRs in full row-level clarity */}
                  {SAMPLE_LEAK_ROWS.slice(0, 3).map((row) => (
                    <tr key={row.rowNum} className="bg-slate-950 hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-bold text-cyan-400">{row.rowNum}</td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {stripPrivacyEnabled ? row.skuOrLr.replace(/SKU|LR|INV|PO/g, 'ANON') : row.skuOrLr}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{row.category}</td>
                      <td className="py-3 px-4 text-slate-200">{row.discrepancyType}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400">₹ {row.amountLakhs.toFixed(2)} L</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {/* Rows 4+ visually blurred behind conversion callout */}
                  {SAMPLE_LEAK_ROWS.slice(3).map((row) => (
                    <tr key={row.rowNum} className="bg-slate-950 blur-sm select-none opacity-40">
                      <td className="py-3 px-4 font-bold text-slate-500">{row.rowNum}</td>
                      <td className="py-3 px-4 text-slate-500">{row.skuOrLr}</td>
                      <td className="py-3 px-4 text-slate-500">{row.category}</td>
                      <td className="py-3 px-4 text-slate-500">{row.discrepancyType}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-500">₹ {row.amountLakhs.toFixed(2)} L</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-500">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Conversion Overlay */}
              <div className="absolute inset-x-0 bottom-0 top-[140px] flex flex-col items-center justify-center p-6 text-center bg-slate-950/80 backdrop-blur-xs">
                <div className="bg-slate-900 border-2 border-cyan-500/60 p-6 rounded-xl max-w-2xl shadow-2xl space-y-4">
                  <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Executive Audit Lockdown
                  </span>
                  <h4 className="text-base sm:text-lg font-extrabold text-white">
                    Unlock All Audited Leak Rows + 48-Hr Signed Executive Workbook (₹18,000 — 100% Refunded if &lt; ₹2,50,000 Identified)
                  </h4>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                    >
                      <span>WhatsApp Audit Desk (Instant Review)</span>
                    </a>
                    <button
                      onClick={() => setActiveTab('builder')}
                      className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-lg"
                    >
                      Configure 48-Hr Scope
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CA Partner Calculator */}
        {activeTab === 'calculator' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Auditor Partner Desk Workbench
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">CA &amp; Stock Auditor Revenue Share Calculator</h3>
              <p className="text-sm text-slate-400 mt-1">
                Calculate your 20% Partner Desk revenue payout for introducing plant clients to 48-Hr Diagnostics.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Monthly Audit Clients Referred: <span className="text-cyan-400 text-sm font-extrabold">{monthlyAuditClients}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={monthlyAuditClients}
                    onChange={(e) => setMonthlyAuditClients(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Est. Avg Identified Leaks Per Client: <span className="text-emerald-400 text-sm font-extrabold">₹ {avgClientLeakLakhs} Lakhs</span>
                  </label>
                  <input
                    type="range"
                    min="2.5"
                    max="50"
                    step="0.5"
                    value={avgClientLeakLakhs}
                    onChange={(e) => setAvgClientLeakLakhs(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
                  <p className="font-bold text-slate-300">Partner Desk Terms:</p>
                  <p>• 20% direct payout per ₹18,000 diagnostic (₹3,600 per client).</p>
                  <p>• Co-branded CA verification seal on executive workbook.</p>
                  <p>• Priority 24-hour turnaround for partner desk submissions.</p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Earnings</span>
                  <div>
                    <span className="text-xs text-slate-400 block">Monthly Partner Revenue Share</span>
                    <span className="text-3xl font-extrabold text-cyan-400">₹ {caPartnerMonthlyPayout.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Annualized Revenue Share</span>
                    <span className="text-3xl font-extrabold text-emerald-400">₹ {caPartnerAnnualPayout.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Apply for 20% CA Partner Desk via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 48-Hr Scope Builder */}
        {activeTab === 'builder' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Instant Configuration
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">48-Hr Diagnostic Scope Builder</h3>
              <p className="text-sm text-slate-400 mt-1">
                Select your ERP stack, plant corridors, and tier to initiate outreach with instant WhatsApp or Email.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Primary ERP / Accounting System
                </label>
                <select
                  value={selectedErp}
                  onChange={(e) => setSelectedErp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-3 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Tally ERP / Prime">Tally ERP / Prime</option>
                  <option value="SAP S/4HANA">SAP S/4HANA</option>
                  <option value="Oracle ERP Cloud">Oracle ERP Cloud</option>
                  <option value="Microsoft Dynamics 365">Microsoft Dynamics 365</option>
                  <option value="Zoho Books / Busy">Zoho Books / Busy</option>
                  <option value="Custom Excel / CSV Ledger">Custom Excel / CSV Ledger</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Plant &amp; Freight Corridors
                </label>
                <select
                  value={plantCorridor}
                  onChange={(e) => setPlantCorridor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-3 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="West & North Corridors">West &amp; North Corridors</option>
                  <option value="South Corridors (TN/KA/TS)">South Corridors (TN/KA/TS)</option>
                  <option value="East & Central Industrial Belts">East &amp; Central Industrial Belts</option>
                  <option value="Pan-India Multi-Plant Corridors">Pan-India Multi-Plant Corridors</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Requested Commercial Tier
                </label>
                <select
                  value={requestedTier}
                  onChange={(e) => setRequestedTier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-3 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="₹18,000 48-Hr Diagnostic">₹18,000 48-Hr Diagnostic (₹2.5L Guarantee)</option>
                  <option value="₹15,000/mo Monthly Watchdog">₹15,000/mo Monthly Watchdog</option>
                  <option value="20% CA Partner Desk">20% CA &amp; Stock Auditor Partner Desk</option>
                  <option value="₹0 Browser Sandbox">₹0 Browser Sandbox</option>
                </select>
              </div>
            </div>

            {/* Instant WhatsApp + 15-Min Leak Review Outreach Bar */}
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Instant Outreach &amp; 15-Min Leak Review Desk
              </h4>
              <p className="text-xs text-slate-400">
                Contact our audit engineering team directly with your configured scope. Response SLA: under 15 minutes.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <span>WhatsApp Audit Desk (Instant Review)</span>
                </a>
                <a
                  href={mailtoUrl}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-all border border-slate-700"
                >
                  Email Audit Desk (joneszz2004@gmail.com)
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: 24-Hr SLA Grievance & Data Purge Desk */}
        {activeTab === 'purge' && (
          <div className="bg-slate-900/90 border border-rose-950/60 rounded-xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
                Institutional Data Invariant
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">24-Hr SLA Data Purge &amp; Grievance Desk</h3>
              <p className="text-sm text-slate-400 mt-1">
                Enforce complete data destruction and issue cryptographic purge certificates within 24 hours.
              </p>
            </div>

            {purgeSubmitted ? (
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-6 rounded-xl text-center space-y-3">
                <span className="text-emerald-400 text-2xl font-bold block">✓ Purge Request Registered</span>
                <p className="text-sm text-slate-200">
                  Your cryptographic data purge ticket for reference <span className="font-mono text-cyan-400">{purgeReference}</span> has been logged.
                </p>
                <p className="text-xs text-slate-400">
                  A signed certificate of data destruction will be dispatched to <span className="text-slate-300">{purgeEmail}</span> within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setPurgeSubmitted(false);
                    setPurgeEmail('');
                    setPurgeReference('');
                  }}
                  className="mt-2 px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded hover:bg-slate-700"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handlePurgeSubmit} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Authorized Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={purgeEmail}
                    onChange={(e) => setPurgeEmail(e.target.value)}
                    placeholder="md@company.com"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-3 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Audit Reference / Session Hash
                  </label>
                  <input
                    type="text"
                    required
                    value={purgeReference}
                    onChange={(e) => setPurgeReference(e.target.value)}
                    placeholder="AUD-2026-99412"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-3 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-all shadow-lg shadow-rose-600/30"
                >
                  Request 24-Hr SLA Data Purge
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default IcebergControlSystems;
