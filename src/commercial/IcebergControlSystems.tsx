/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Layers,
  TrendingUp,
  Download,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Zap,
  Building2,
  FileSpreadsheet,
  Clock,
  ExternalLink,
  FileCheck2,
  Calculator
} from 'lucide-react';

export interface IcebergControlSystemsProps {
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

interface PlantPreset {
  id: string;
  name: string;
  location: string;
  partId: string;
  dispatchId: string;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  total: number;
  description: string;
}

const PLANT_PRESETS: PlantPreset[] = [
  {
    id: 'auto-ancillary-chennai',
    name: 'Auto Ancillary',
    location: 'Chennai / Oragadam',
    partId: 'ANC-CHE-8821',
    dispatchId: 'DSP-CHE-994',
    p4: 6.40,
    p2: 14.20,
    p3: 8.75,
    p1: 38.50,
    total: 67.85,
    description: 'High-volume tier-1 auto component plant experiencing gate turnaround detention and phantom bin shortages.'
  },
  {
    id: 'precision-cnc-hosur',
    name: 'Precision CNC',
    location: 'Hosur Industrial Hub',
    partId: 'CNC-HOS-4402',
    dispatchId: 'DSP-HOS-312',
    p4: 9.10,
    p2: 18.60,
    p3: 5.30,
    p1: 24.80,
    total: 57.80,
    description: 'Multi-axis CNC machining unit suffering from delayed line clearances and un-reconciled raw material bins.'
  },
  {
    id: 'valves-foundry-coimbatore',
    name: 'Valves & Foundry',
    location: 'Coimbatore Cluster',
    partId: 'VLV-CBE-1093',
    dispatchId: 'DSP-CBE-771',
    p4: 12.80,
    p2: 22.40,
    p3: 11.20,
    p1: 45.10,
    total: 91.50,
    description: 'Heavy casting & industrial valve foundry with high WIP stagnation and spot freight rush dispatching.'
  },
  {
    id: 'heavy-fab-pune',
    name: 'Heavy Fabrication',
    location: 'Pune / Chakan',
    partId: 'FAB-PUN-5561',
    dispatchId: 'DSP-PUN-404',
    p4: 15.20,
    p2: 31.50,
    p3: 14.80,
    p1: 62.00,
    total: 123.50,
    description: 'Large structural fabrication yard with trapped dead-stock plates and penalty-heavy OEM OTIF SLAs.'
  }
];

export const IcebergControlSystems: React.FC<IcebergControlSystemsProps> = ({
  onLaunchEngine,
  onOpenSampleAuditPage
}) => {
  // Module A State
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PLANT_PRESETS[0].id);
  const activePreset = PLANT_PRESETS.find(p => p.id === selectedPresetId) || PLANT_PRESETS[0];

  // Module B State - CA Partner Calculator
  const [quarterlyReferrals, setQuarterlyReferrals] = useState<number>(5);
  const [activeWatchdogPlants, setActiveWatchdogPlants] = useState<number>(8);

  // Module B State - 48-Hr Scope Intake
  const [selectedErp, setSelectedErp] = useState<string>('Tally Prime');
  const [selectedEngines, setSelectedEngines] = useState<Record<string, boolean>>({
    P1: true,
    P2: true,
    P3: true,
    P4: true
  });
  const [ndaAccepted, setNdaAccepted] = useState<boolean>(true);

  // Module C State - Grievance & Data Purge SLA Desk
  const [requestType, setRequestType] = useState<string>('Immediate On-Demand Data Purge');
  const [companyName, setCompanyName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [generatedTicket, setGeneratedTicket] = useState<{
    ticketRef: string;
    timestamp: string;
    company: string;
    email: string;
    type: string;
    targetSla: string;
    team: string;
  } | null>(null);

  // Calculations for Module B
  const upfrontQuarterlyPayout = quarterlyReferrals * 3600;
  const monthlyRecurringPayout = activeWatchdogPlants * 3000;
  const totalAnnualEarnings = (upfrontQuarterlyPayout * 4) + (monthlyRecurringPayout * 12);

  const scopeRef = `SCOPE-2026-${selectedPresetId.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Export CFO Control Tower Matrix CSV
  const handleExportCFOMatrix = () => {
    const headers = [
      'Corridor Preset',
      'Location',
      'Sample Part ID',
      'Sample Dispatch ID',
      'P4 Ghost Stock Variance (Lakhs)',
      'P2 OTIF Dispatch Delay Risk (Lakhs)',
      'P3 Emergency Freight & Detention Leak (Lakhs)',
      'P1 Stagnant Capital Lock >180d (Lakhs)',
      'Total Cross-Engine Recoverable Pool (Lakhs)',
      'Audit Timestamp'
    ];
    const row = [
      `"${activePreset.name}"`,
      `"${activePreset.location}"`,
      `"${activePreset.partId}"`,
      `"${activePreset.dispatchId}"`,
      activePreset.p4.toFixed(2),
      activePreset.p2.toFixed(2),
      activePreset.p3.toFixed(2),
      activePreset.p1.toFixed(2),
      activePreset.total.toFixed(2),
      `"${new Date().toISOString()}"`
    ];

    const csvContent = [headers.join(','), row.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cfo_control_tower_matrix_${activePreset.id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download Blank 5-Column CSV Template
  const handleDownloadSampleCSV = () => {
    const csvContent = 'Part_ID,Bin_Location,System_Qty,Physical_Qty,Unit_Cost_INR\nSKU-9901-CHE,BIN-A-14,450,380,1250.00\nSKU-8842-HOS,BIN-B-08,1200,1200,850.50\nSKU-7731-CBE,BIN-C-22,80,0,4200.00\nSKU-5510-PUN,BIN-D-05,310,290,1950.00\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'operationalyst_5_column_audit_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate SLA Ticket
  const handleGenerateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = `OPL-SLA-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    setGeneratedTicket({
      ticketRef: ticketId,
      timestamp: now,
      company: companyName || 'Factory Plant Unit',
      email: contactEmail || 'cfo@company.com',
      type: requestType,
      targetSla: '< 24 Hours (Guaranteed SLA Window)',
      team: 'Team 12 — SLA Compliance & Governance Desk'
    });
  };

  // Download SLA Receipt CSV / TXT
  const handleDownloadSLAData = () => {
    if (!generatedTicket) return;
    const content = [
      'OPERATIONALYST TEAM 12 — 24-HOUR SLA GOVERNANCE RECEIPT',
      `Ticket Reference: ${generatedTicket.ticketRef}`,
      `Timestamp: ${generatedTicket.timestamp}`,
      `Company / Unit: ${generatedTicket.company}`,
      `Contact Email: ${generatedTicket.email}`,
      `Request Type: ${generatedTicket.type}`,
      `Target SLA Resolution: ${generatedTicket.targetSla}`,
      `Assigned Operations Unit: ${generatedTicket.team}`,
      'Status: ACKNOWLEDGED & QUEUED FOR SLA EXECUTION',
      'Guaranteed Purge / Response SLA: 24 Hours'
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sla_ticket_receipt_${generatedTicket.ticketRef}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const selectedEnginesList = Object.entries(selectedEngines)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key);

  return (
    <div className="w-full bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 space-y-20 border-t border-slate-800">
      
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
          <ShieldCheck className="w-4 h-4" />
          The Whole Iceberg &mdash; Operational Governance Suite
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Below the Waterline: Cross-Engine Control, Partner Revenue &amp; 24-Hr SLA Desk
        </h2>
        <p className="max-w-3xl mx-auto text-slate-400 text-base sm:text-lg">
          Connect P1&ndash;P4 operational leaks into a single deterministic board-level recovery matrix, model CA partner share earnings, and mandate 24-hour SLA data purges.
        </p>
      </div>

      {/* MODULE A: Connected P1-P4 Cross-Engine Control Tower */}
      <section id="control-tower" className="max-w-7xl mx-auto bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" /> Module A &mdash; Industrial Corridor Control Tower
            </div>
            <h3 className="text-2xl font-bold text-white">Compounding Leak Chain (P1 &rarr; P2 &rarr; P3 &rarr; P4)</h3>
            <p className="text-sm text-slate-400">
              Select an industrial corridor preset to inspect how ghost stock triggers gate delays, freight penalties, and stagnant capital lock.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportCFOMatrix}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-all shadow-md"
            >
              <Download className="w-4 h-4" /> Export CFO Control Tower Matrix (CSV)
            </button>
            {onLaunchEngine && (
              <button
                onClick={() => onLaunchEngine('merged_suite')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Open Sandbox Suite
              </button>
            )}
          </div>
        </div>

        {/* Corridor Preset Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PLANT_PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-400">{preset.location}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="font-bold text-sm text-white">{preset.name}</div>
                <div className="text-xs text-slate-400 mt-2">
                  Exposure: <span className="font-mono text-emerald-400 font-bold">₹{preset.total.toFixed(2)} Lakhs</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Preset Details & Causal Chain */}
        <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-xs text-slate-400">Active Corridor Preset:</span>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                {activePreset.name} &mdash; {activePreset.location}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">{activePreset.description}</p>
            </div>
            <div className="flex items-center gap-3 bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400">Sample Linked SKU / Dispatch:</span>
              <span className="font-mono text-xs text-amber-400 font-bold">{activePreset.partId} / {activePreset.dispatchId}</span>
            </div>
          </div>

          {/* 4-Step Causal Chain Flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Step 1: P4 */}
            <div className="bg-slate-900/90 rounded-lg p-4 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                  <span>STEP 1 &mdash; P4</span>
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <h5 className="text-sm font-bold text-white">Ghost Stock Variance</h5>
                <p className="text-xs text-slate-400">System shows stock on shelf, but physical bin is short.</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex justify-between items-end">
                <span className="text-[11px] text-slate-400">Bin Variance Leak</span>
                <span className="font-mono text-sm font-bold text-amber-400">₹{activePreset.p4.toFixed(2)} L</span>
              </div>
            </div>

            {/* Step 2: P2 */}
            <div className="bg-slate-900/90 rounded-lg p-4 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                  <span>STEP 2 &mdash; P2</span>
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <h5 className="text-sm font-bold text-white">OTIF Dispatch Delay</h5>
                <p className="text-xs text-slate-400">Customer order misses gate SLA due to surprise bin shortage.</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex justify-between items-end">
                <span className="text-[11px] text-slate-400">Gate SLA Penalty Risk</span>
                <span className="font-mono text-sm font-bold text-amber-400">₹{activePreset.p2.toFixed(2)} L</span>
              </div>
            </div>

            {/* Step 3: P3 */}
            <div className="bg-slate-900/90 rounded-lg p-4 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                  <span>STEP 3 &mdash; P3</span>
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <h5 className="text-sm font-bold text-white">Emergency Freight &amp; Detention</h5>
                <p className="text-xs text-slate-400">Spot-rate truck premium + &gt;6 hr gate turnaround detention.</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex justify-between items-end">
                <span className="text-[11px] text-slate-400">Spot &amp; Detention Leak</span>
                <span className="font-mono text-sm font-bold text-amber-400">₹{activePreset.p3.toFixed(2)} L</span>
              </div>
            </div>

            {/* Step 4: P1 */}
            <div className="bg-slate-900/90 rounded-lg p-4 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>STEP 4 &mdash; P1</span>
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <h5 className="text-sm font-bold text-white">Stagnant Capital Lock</h5>
                <p className="text-xs text-slate-400">Working capital frozen in unmoving SKUs (&gt;180d) instead of active runners.</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex justify-between items-end">
                <span className="text-[11px] text-slate-400">Trapped Capital</span>
                <span className="font-mono text-sm font-bold text-emerald-400">₹{activePreset.p1.toFixed(2)} L</span>
              </div>
            </div>
          </div>

          {/* Unified Exposure Summary Banner */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Unified Cross-Engine Exposure</span>
                <div className="text-2xl font-extrabold text-white font-mono">
                  ₹{activePreset.total.toFixed(2)} Lakhs <span className="text-xs font-sans text-emerald-400 font-semibold">Recoverable Pool</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {onOpenSampleAuditPage && (
                <button
                  onClick={onOpenSampleAuditPage}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md"
                >
                  View Sample Executive Audit
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MODULE B: CA Partner Calculator & 48-Hour Scope Builder */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sub-Module B1: CA Partner Recurring Revenue Calculator */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Calculator className="w-4 h-4" /> Module B1 &mdash; CA &amp; Stock Auditor Partner Desk (Tier 4)
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 text-[11px] font-bold border border-amber-500/20">
                20% Statutory Share
              </span>
            </div>

            <h3 className="text-xl font-bold text-white">Partner Recurring Revenue Calculator</h3>
            <p className="text-xs text-slate-400">
              Model your firm revenue share from quarterly plant diagnostic audits and ongoing monthly watchdog governance.
            </p>

            {/* Slider 1: Quarterly Referrals */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Quarterly Diagnostic Referrals</span>
                <span className="font-mono text-emerald-400 font-bold">{quarterlyReferrals} Plants / Qtr</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={quarterlyReferrals}
                onChange={(e) => setQuarterlyReferrals(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Fee: ₹18,000 / plant</span>
                <span>Partner Upfront Share (20%): <strong className="text-emerald-400">₹3,600 / plant</strong></span>
              </div>
            </div>

            {/* Slider 2: Active Monthly Watchdog Plants */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Active Monthly Watchdog Retainer Plants</span>
                <span className="font-mono text-emerald-400 font-bold">{activeWatchdogPlants} Plants / Mo</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={activeWatchdogPlants}
                onChange={(e) => setActiveWatchdogPlants(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Monthly Fee: ₹15,000 / plant</span>
                <span>Partner Recurring Share (20%): <strong className="text-emerald-400">₹3,000 / mo per plant</strong></span>
              </div>
            </div>

            {/* Revenue Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Monthly Recurring Payout</span>
                <span className="text-lg font-bold font-mono text-emerald-400">₹{monthlyRecurringPayout.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Total Annual Partner Earnings</span>
                <span className="text-lg font-bold font-mono text-white">₹{totalAnnualEarnings.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Badge */}
            <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
              <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Includes <strong>Co-Branded Statutory Stock Audit Working Papers</strong> badge and audit sign-off templates.</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <a
              href={`mailto:joneszz2004@gmail.com?subject=CA%20Partner%20Desk%20Registration&body=Hello%20Operationalyst%20Team%2C%0A%0AI%20am%20interested%20in%20registering%20for%20the%20CA%20%26%20Stock%20Auditor%20Partner%20Desk.%0A%0AConfigured%20Partner%20Estimates%3A%0A-%20Quarterly%20Diagnostic%20Referrals%3A%20${quarterlyReferrals}%20plants%0A-%20Active%20Watchdog%20Plants%3A%20${activeWatchdogPlants}%20plants%0A-%20Estimated%20Annual%20Payout%3A%20%E2%82%B9${totalAnnualEarnings.toLocaleString('en-IN')}%0A%0APlease%20send%20the%20onboarding%20kit.`}
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
            >
              <Mail className="w-4 h-4" /> Register CA Partner Desk
            </a>
          </div>
        </div>

        {/* Sub-Module B2: 48-Hour Diagnostic Scope & NDA Intake Builder */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <FileSpreadsheet className="w-4 h-4" /> Module B2 &mdash; 48-Hour Diagnostic Scope Intake (Tier 1)
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                100% Refund Guarantee
              </span>
            </div>

            <h3 className="text-xl font-bold text-white">Scope &amp; NDA intake Builder</h3>
            <p className="text-xs text-slate-400">
              Select your plant ERP format, choose target engines, and request a fixed 48-hour diagnostic audit agreement.
            </p>

            {/* ERP Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Select Plant ERP Export Format:</label>
              <div className="grid grid-cols-2 gap-2">
                {['Tally Prime', 'SAP B1 / S/4HANA', 'Busy / Marg', 'Excel / CSV'].map((erp) => (
                  <button
                    key={erp}
                    type="button"
                    onClick={() => setSelectedErp(erp)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition-all ${
                      selectedErp === erp
                        ? 'bg-emerald-950/60 border-emerald-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {erp}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Engine Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Target Audit Engines:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'P1', label: 'P1 (Dead Capital Lock)' },
                  { id: 'P2', label: 'P2 (OTIF Gate SLA)' },
                  { id: 'P3', label: 'P3 (Freight & Detention)' },
                  { id: 'P4', label: 'P4 (Ghost Bin Stock)' }
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEngines[item.id]}
                      onChange={(e) =>
                        setSelectedEngines(prev => ({ ...prev, [item.id]: e.target.checked }))
                      }
                      className="rounded accent-emerald-500 bg-slate-800 border-slate-700"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mutual NDA & Guarantee Indicator */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-start gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={ndaAccepted}
                onChange={(e) => setNdaAccepted(e.target.checked)}
                className="mt-0.5 rounded accent-emerald-500 bg-slate-800 border-slate-700"
              />
              <span>
                <strong>Mutual NDA + ₹2,50,000 Leak 100% Refund Guarantee</strong> confirmed. If zero actionable leaks are identified in 48 hours, audit fee is refunded in full.
              </span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Generated Scope Reference Code: <strong className="text-amber-400">{scopeRef}</strong>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadSampleCSV}
              className="flex-1 py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all inline-flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Blank 5-Column CSV Template
            </button>
            <a
              href={`mailto:joneszz2004@gmail.com?subject=48-Hour%20Diagnostic%20Scope%20Request%20%5B${scopeRef}%5D&body=Hello%20Operationalyst%20Team%2C%0A%0AI%20am%20submitting%20a%2048-Hour%20Diagnostic%20Scope%20Intake.%0A%0AScope%20Reference%3A%20${scopeRef}%0AERP%20Export%20Format%3A%20${selectedErp}%0ATarget%20Audit%20Engines%3A%20${selectedEnginesList.join('%2C%20')}%0AMutual%20NDA%20%26%20Refund%20Guarantee%3A%20${ndaAccepted%20%3F%20'Confirmed'%20%3A%20'Pending'}%0A%0APlease%20dispatch%20the%20data-ingestion%20link.`}
              className="flex-1 py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" /> Request 48-Hr Diagnostic Scope
            </a>
          </div>
        </div>

      </section>

      {/* MODULE C: Interactive 24-Hour SLA Grievance & Deterministic Data Purge Desk */}
      <section id="grievance-desk" className="max-w-7xl mx-auto bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" /> Module C &mdash; Team 12 Governance Live Desk
            </div>
            <h3 className="text-2xl font-bold text-white">Interactive 24-Hour SLA Grievance &amp; Data Purge Desk</h3>
            <p className="text-sm text-slate-400">
              Request immediate on-demand data purge certificates, NDA verification, or submit an audit calculation grievance directly to Team 12.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" /> Team 12 Resolution SLA: &lt; 24 Hours
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ticket Request Form */}
          <form onSubmit={handleGenerateTicket} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Governance Request Type:</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Immediate On-Demand Data Purge">Immediate On-Demand Data Purge</option>
                <option value="14-Day Post-Audit Purge Certificate">14-Day Post-Audit Purge Certificate</option>
                <option value="Mutual NDA Verification">Mutual NDA Verification</option>
                <option value="Audit Calculation Grievance">Audit Calculation Grievance</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Plant / Company Name:</label>
              <input
                type="text"
                placeholder="e.g. Oragadam Auto Components Pvt Ltd"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Contact Email:</label>
              <input
                type="email"
                placeholder="cfo@company.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" /> Generate 24-Hr SLA Ticket
            </button>
          </form>

          {/* Ticket Receipt Display */}
          <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-6 flex flex-col justify-between space-y-6">
            {generatedTicket ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> SLA Ticket Formally Registered
                  </span>
                  <span className="font-mono text-xs text-amber-400 font-bold">{generatedTicket.ticketRef}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-400">Timestamp:</span>
                    <span className="text-slate-200 font-mono">{generatedTicket.timestamp}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-400">Company / Unit:</span>
                    <span className="text-slate-200 font-semibold">{generatedTicket.company}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-400">Contact Email:</span>
                    <span className="text-slate-200">{generatedTicket.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-400">Request Type:</span>
                    <span className="text-emerald-400 font-semibold">{generatedTicket.type}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-400">Resolution SLA:</span>
                    <span className="text-amber-400 font-semibold">{generatedTicket.targetSla}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Handling Unit:</span>
                    <span className="text-slate-300">{generatedTicket.team}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownloadSLAData}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> 1-Click Download SLA Receipt
                  </button>
                  <a
                    href={`mailto:joneszz2004@gmail.com?subject=Team%2012%20SLA%20Ticket%20%5B${generatedTicket.ticketRef}%5D&body=Hello%20Team%2012%20Governance%20Desk%2C%0A%0AHere%20is%20the%20registered%20SLA%20ticket%20details%3A%0A-%20Ticket%20ID%3A%20${generatedTicket.ticketRef}%0A-%20Company%3A%20${generatedTicket.company}%0A-%20Email%3A%20${generatedTicket.email}%0A-%20Request%20Type%3A%20${generatedTicket.type}%0A-%20Target%20SLA%3A%20${generatedTicket.targetSla}%0A%0APlease%20execute%20the%20requested%20governance%20action.`}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <Mail className="w-4 h-4" /> Email Team 12 Desk
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <ShieldCheck className="w-12 h-12 text-slate-700" />
                <h4 className="text-sm font-bold text-slate-300">No SLA Ticket Generated Yet</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Fill in your company name and email, choose a request type, and click &quot;Generate 24-Hr SLA Ticket&quot; to issue a binding ticket receipt.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
