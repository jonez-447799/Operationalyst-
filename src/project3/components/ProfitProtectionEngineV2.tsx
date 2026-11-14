import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Scale,
  Truck,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  Flame,
  BarChart3,
  CopyCheck,
  Calculator,
  Users,
  Download
} from 'lucide-react';
import { CalculatedTrip, LaneSummary, TransporterSummary } from '../types/freight';

interface ProfitProtectionEngineV2Props {
  trips: CalculatedTrip[];
  laneSummaries: LaneSummary[];
  transporterSummaries: TransporterSummary[];
  totalFreightPaid: number;
  totalLeakFound: number;
}

function formatINR(val: number): string {
  return '₹' + Math.round(val || 0).toLocaleString('en-IN');
}

const EXTERNAL_MARKET_RATES: Record<string, number> = {
  'Ambattur to Oragadam': 1420,
  'Ambattur to Sriperumbudur': 1150,
  'Ambattur to Maraimalai Nagar': 1520,
  'Chennai to Bangalore': 1850,
  'Chennai to Hosur': 1750,
};

const SAMPLE_CUSTOMERS = [
  { name: 'TVS Supply Chain (OEM)', marginTargetPct: 18 },
  { name: 'Ashok Leyland Unit-2', marginTargetPct: 18 },
  { name: 'Sri Balaji Traders (Small Lot)', marginTargetPct: 16 },
  { name: 'Apex Auto Spares (Urgent)', marginTargetPct: 18 },
];

export const ProfitProtectionEngineV2: React.FC<ProfitProtectionEngineV2Props> = ({
  trips,
  laneSummaries,
  transporterSummaries,
  totalFreightPaid,
  totalLeakFound,
}) => {
  const [activeSubView, setActiveSubView] = useState<
    'multi_leak_dup' | 'profitability_margin' | 'carrier_route_score' | 'recovery_approval'
  >('multi_leak_dup');

  const [recoveredIds, setRecoveredIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('p3_recovered_invoices_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      'TRIP-02': true,
      'TRIP-07': true,
    };
  });

  const [approvedRiskIds, setApprovedRiskIds] = useState<
    Record<string, 'Pending Approval' | 'Held for Audit' | 'Approved'>
  >(() => {
    try {
      const saved = localStorage.getItem('p3_manager_approvals_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [calcSalesValue, setCalcSalesValue] = useState<number>(100000);
  const [calcGrossMarginPct, setCalcGrossMarginPct] = useState<number>(18);
  const [calcFreightCost, setCalcFreightCost] = useState<number>(15000);

  useEffect(() => {
    try {
      localStorage.setItem('p3_recovered_invoices_v2', JSON.stringify(recoveredIds));
    } catch {}
  }, [recoveredIds]);

  useEffect(() => {
    try {
      localStorage.setItem('p3_manager_approvals_v2', JSON.stringify(approvedRiskIds));
    } catch {}
  }, [approvedRiskIds]);

  const toggleRecovered = (id: string) => {
    setRecoveredIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateApprovalStatus = (id: string, status: 'Pending Approval' | 'Held for Audit' | 'Approved') => {
    setApprovedRiskIds((prev) => ({ ...prev, [id]: status }));
  };

  const calcRealProfit = useMemo(() => {
    const marginRatio = calcGrossMarginPct / 100;
    const initialExpectedProfit = calcSalesValue * marginRatio;
    return initialExpectedProfit - calcFreightCost;
  }, [calcSalesValue, calcGrossMarginPct, calcFreightCost]);

  const leakBreakdown = useMemo(() => {
    let rateSlabCount = 0;
    let rateSlabTotal = 0;
    let detentionCount = 0;
    let detentionTotal = 0;

    trips.forEach((t) => {
      if (t.rateLeak > 0) {
        rateSlabCount++;
        rateSlabTotal += t.rateLeak;
      }
      if (t.detention > 0 || t.waitHours > 6) {
        detentionCount++;
        detentionTotal += t.detention;
      }
    });

    const totalClaimableAmount = rateSlabTotal + detentionTotal;

    return {
      rateSlabCount,
      rateSlabTotal,
      detentionCount,
      detentionTotal,
      totalClaimableAmount,
    };
  }, [trips]);

  const handleExportDebitNoteCSV = () => {
    const headers = [
      'Invoice_or_LR_ID',
      'Transporter',
      'Route_Lane',
      'Contracted_INR',
      'Billed_INR',
      'Rate_Slab_Overcharge_INR',
      'Detention_Leak_INR',
      'Total_Debit_Claim_INR',
      'Audit_Status'
    ];

    const claimTrips = trips.filter((t) => t.totalLeak > 0);
    const targetTrips = claimTrips.length > 0 ? claimTrips : trips;

    const rows = targetTrips.map((t) => {
      const contracted = t.bill - t.totalLeak;
      const status = t.totalLeak > 0 ? (approvedRiskIds[t.id] || 'Overcharge Detected') : 'Clean / Verified';
      const transporter = (t.transporter || '').replace(/"/g, '""');
      const lane = (t.lane || '').replace(/"/g, '""');
      return `"${t.id}","${transporter}","${lane}",${contracted.toFixed(2)},${t.bill.toFixed(2)},${t.rateLeak.toFixed(2)},${t.detention.toFixed(2)},${t.totalLeak.toFixed(2)},"${status}"`;
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Transporter_Debit_Note_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
              Engine P3 Active Audit
            </span>
            <span className="text-xs text-slate-400">Freight Rate-Card &amp; Detention Audit Engine</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Freight Profit Protection &amp; Leak Audit</h2>
          <p className="text-xs text-slate-400">
            Automated detection of rate-card overcharges, detention leaks, duplicate billing, and CFO margin impact.
          </p>
        </div>

        <div className="flex items-center gap-4 border-t lg:border-t-0 border-slate-700/60 pt-4 lg:pt-0">
          <div className="bg-slate-950/60 border border-slate-700 rounded-xl px-4 py-3 text-right min-w-[150px]">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Freight Paid</p>
            <p className="text-lg font-black text-slate-200">{formatINR(totalFreightPaid)}</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-700 rounded-xl px-4 py-3 text-right min-w-[150px]">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Leak Found</p>
            <p className="text-lg font-black text-rose-400">{formatINR(totalLeakFound)}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-2xl p-6 border border-emerald-500/30 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-bold text-slate-100">Freight Leak Source Breakdown &amp; Debit Claim</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Categorized freight overcharge leaks and claim-ready transporter debit note generation
            </p>
          </div>
          <button
            onClick={handleExportDebitNoteCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-semibold rounded-xl shadow-lg transition-all text-xs"
          >
            <Download className="w-4 h-4" />
            Export Transporter Debit Note (CSV)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/60 border border-amber-500/30 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
              <span>Contract Rate-Slab Overcharges</span>
              <span className="bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{leakBreakdown.rateSlabCount} Shipments</span>
            </div>
            <p className="text-xs text-slate-400">Billed freight above contracted rate card</p>
            <div className="pt-2 border-t border-slate-700/50 flex justify-between items-baseline">
              <span className="text-xs text-slate-400">₹ Leak Subtotal:</span>
              <span className="text-lg font-bold text-amber-300">{formatINR(leakBreakdown.rateSlabTotal)}</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-rose-500/30 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-rose-400 font-semibold">
              <span>Truck Detention Leaks (&gt;6 hrs)</span>
              <span className="bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">{leakBreakdown.detentionCount} Shipments</span>
            </div>
            <p className="text-xs text-slate-400">Detention charges beyond free turnaround hours</p>
            <div className="pt-2 border-t border-slate-700/50 flex justify-between items-baseline">
              <span className="text-xs text-slate-400">₹ Leak Subtotal:</span>
              <span className="text-lg font-bold text-rose-300">{formatINR(leakBreakdown.detentionTotal)}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span>Total Claimable Amount</span>
              <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Finance Claim Ready</span>
            </div>
            <p className="text-xs text-slate-400">Combined overcharges &amp; detention debit note</p>
            <div className="pt-2 border-t border-slate-700/50 flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Total Claimable (₹):</span>
              <span className="text-xl font-black text-emerald-300">{formatINR(leakBreakdown.totalClaimableAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-800 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveSubView('multi_leak_dup')}
          className={`pb-3 transition-colors relative flex items-center gap-2 ${
            activeSubView === 'multi_leak_dup' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Multi-Leak Audit &amp; Duplicate Invoices
        </button>

        <button
          onClick={() => setActiveSubView('profitability_margin')}
          className={`pb-3 transition-colors relative flex items-center gap-2 ${
            activeSubView === 'profitability_margin' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          CFO Margin Impact &amp; Real Profit Calculator
        </button>

        <button
          onClick={() => setActiveSubView('carrier_route_score')}
          className={`pb-3 transition-colors relative flex items-center gap-2 ${
            activeSubView === 'carrier_route_score' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Transporter Scorecard &amp; Market Benchmarks
        </button>

        <button
          onClick={() => setActiveSubView('recovery_approval')}
          className={`pb-3 transition-colors relative flex items-center gap-2 ${
            activeSubView === 'recovery_approval' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CopyCheck className="w-4 h-4" />
          Pre-Approval Gate &amp; Debit Recovery Tracker
        </button>
      </div>

      {activeSubView === 'multi_leak_dup' && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                Line-Item Freight Trip Leaks
              </h3>
              <span className="text-xs text-slate-400">{trips.length} Audited Trips</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Trip ID</th>
                    <th className="p-3">Transporter</th>
                    <th className="p-3">Route Lane</th>
                    <th className="p-3 text-right">Billed Freight</th>
                    <th className="p-3 text-right">Rate Overcharge</th>
                    <th className="p-3 text-right">Detention Leak</th>
                    <th className="p-3 text-right">Total Leak</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {trips.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono text-amber-400 font-medium">{t.id}</td>
                      <td className="p-3 font-medium text-slate-200">{t.transporter}</td>
                      <td className="p-3 text-slate-400">{t.lane}</td>
                      <td className="p-3 text-right font-bold text-slate-200">{formatINR(t.bill)}</td>
                      <td className="p-3 text-right text-amber-400">{formatINR(t.rateLeak)}</td>
                      <td className="p-3 text-right text-rose-400">{formatINR(t.detention)}</td>
                      <td className="p-3 text-right font-bold text-rose-400">{formatINR(t.totalLeak)}</td>
                      <td className="p-3 text-center">
                        {t.totalLeak > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                            Overcharge Detected
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                            Clean
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubView === 'profitability_margin' && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              CFO Real Profit &amp; Margin Erosion Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Calculate net profit erosion after factoring true audited freight costs into customer order gross margins.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Order Invoice Value (₹)</label>
                <input
                  type="number"
                  value={calcSalesValue}
                  onChange={(e) => setCalcSalesValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Expected Gross Margin (%)</label>
                <input
                  type="number"
                  value={calcGrossMarginPct}
                  onChange={(e) => setCalcGrossMarginPct(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Billed Freight Cost (₹)</label>
                <input
                  type="number"
                  value={calcFreightCost}
                  onChange={(e) => setCalcFreightCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between mt-4">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Net Real Profit After Freight</span>
                <p className={`text-2xl font-black mt-1 ${calcRealProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatINR(calcRealProfit)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Effective Profit Margin</span>
                <p className="text-lg font-bold text-slate-200 mt-1">
                  {calcSalesValue ? ((calcRealProfit / calcSalesValue) * 100).toFixed(1) : '0'}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubView === 'carrier_route_score' && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Transporter Overcharge Scorecard
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transporterSummaries.map((ts) => (
                <div key={ts.transporter} className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-200">{ts.transporter}</span>
                    <span className="text-xs text-slate-400">{ts.tripCount} Trips</span>
                  </div>
                  <div className="flex justify-between text-xs pt-2 border-t border-slate-800">
                    <span className="text-slate-400">Total Billed:</span>
                    <span className="font-semibold text-slate-200">{formatINR(ts.totalBilled)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Total Leakage:</span>
                    <span className="font-bold text-rose-400">{formatINR(ts.totalLeak)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubView === 'recovery_approval' && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <CopyCheck className="w-4 h-4 text-emerald-400" />
              Debit Note Pre-Approval Gate &amp; Status Tracker
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Trip ID</th>
                    <th className="p-3">Transporter</th>
                    <th className="p-3 text-right">Overcharge</th>
                    <th className="p-3 text-center">Approval Gate</th>
                    <th className="p-3 text-center">Debit Recovered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {trips
                    .filter((t) => t.totalLeak > 0)
                    .map((t) => {
                      const appStatus = approvedRiskIds[t.id] || 'Pending Approval';
                      const isRec = !!recoveredIds[t.id];
                      return (
                        <tr key={t.id} className="hover:bg-slate-800/40">
                          <td className="p-3 font-mono text-amber-400 font-medium">{t.id}</td>
                          <td className="p-3 font-medium text-slate-200">{t.transporter}</td>
                          <td className="p-3 text-right font-bold text-rose-400">{formatINR(t.totalLeak)}</td>
                          <td className="p-3 text-center">
                            <select
                              value={appStatus}
                              onChange={(e) =>
                                updateApprovalStatus(
                                  t.id,
                                  e.target.value as 'Pending Approval' | 'Held for Audit' | 'Approved'
                                )
                              }
                              className="bg-slate-950 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                            >
                              <option value="Pending Approval">Pending Approval</option>
                              <option value="Held for Audit">Held for Audit</option>
                              <option value="Approved">Approved</option>
                            </select>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => toggleRecovered(t.id)}
                              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                                isRec
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {isRec ? 'Recovered' : 'Pending Claim'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
