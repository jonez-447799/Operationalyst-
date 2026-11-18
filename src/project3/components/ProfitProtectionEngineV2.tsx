import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Filter,
  Truck,
  ShieldAlert,
} from 'lucide-react';
import type {
  CalculatedTrip,
  LaneSummary,
  TransporterSummary,
} from '../types/freight';
import { formatCurrency } from '../../project1/utils/calculations';
import { exportPrintableTransporterDebitNote } from '../../commercial/TallyCleanerAndClaims';

export interface ProfitProtectionEngineV2Props {
  trips?: CalculatedTrip[];
  laneSummaries?: LaneSummary[];
  transporterSummaries?: TransporterSummary[];
  totalFreightPaid?: number;
  totalLeakFound?: number;
}

interface DerivedFreightDiscrepancy {
  id: string;
  transporterName: string;
  vehicleNumber: string;
  lrNumber: string;
  lane: string;
  discrepancyType: string;
  billedAmount: number;
  contractedAmount: number;
  rateOvercharge: number;
  detentionClaim: number;
  claimableAmount: number;
  status: 'DEBIT_NOTE_PENDING' | 'APPROVED_FOR_DEDUCTION' | 'BENCHMARK_CLEAN';
  remarks: string;
}

export function ProfitProtectionEngineV2({
  trips = [],
  totalFreightPaid,
  totalLeakFound,
}: ProfitProtectionEngineV2Props) {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const derivedDiscrepancies: DerivedFreightDiscrepancy[] = useMemo(() => {
    return trips.map((t) => {
      const rateOvercharge = Math.max(0, Math.round(t.rateLeak || 0));
      const detentionClaim = Math.max(0, Math.round(t.detention || 0));
      const claimableAmount = Math.max(
        0,
        Math.round(t.totalLeak ?? rateOvercharge + detentionClaim)
      );
      const contractedAmount = Math.max(0, Math.round((t.bill || 0) - claimableAmount));

      let discrepancyType = 'Compliant Contract Rate';
      if (rateOvercharge > 0 && detentionClaim > 0) {
        discrepancyType = 'Rate Overcharge + Gate Detention';
      } else if (rateOvercharge > 0) {
        discrepancyType = 'Contract Rate Overcharge';
      } else if (detentionClaim > 0) {
        discrepancyType = 'Gate Detention (>6h)';
      }

      const status: DerivedFreightDiscrepancy['status'] =
        claimableAmount <= 0
          ? 'BENCHMARK_CLEAN'
          : claimableAmount >= 5000
          ? 'APPROVED_FOR_DEDUCTION'
          : 'DEBIT_NOTE_PENDING';

      return {
        id: t.id,
        transporterName: t.transporter || 'Logistics Partner',
        vehicleNumber: t.split === 'Yes' ? 'SPLIT-LOAD' : 'FTL-STANDARD',
        lrNumber: t.sourceDoc || `LR-${t.id}`,
        lane: t.lane || 'Plant Corridor',
        discrepancyType,
        billedAmount: Math.round(t.bill || 0),
        contractedAmount,
        rateOvercharge,
        detentionClaim,
        claimableAmount,
        status,
        remarks:
          t.notes ||
          (claimableAmount > 0
            ? `Lane best rate ₹${Math.round(t.bestRate || 0).toLocaleString('en-IN')}/T`
            : 'Verified against benchmark'),
      };
    });
  }, [trips]);

  const actionableDiscrepancies = useMemo(
    () => derivedDiscrepancies.filter((d) => d.claimableAmount > 0),
    [derivedDiscrepancies]
  );

  const filteredDiscrepancies = useMemo(() => {
    const base = actionableDiscrepancies;
    if (statusFilter === 'ALL') return base;
    return base.filter((d) => d.status === statusFilter);
  }, [actionableDiscrepancies, statusFilter]);

  const summaryMetrics = useMemo(() => {
    const computedBilled =
      typeof totalFreightPaid === 'number'
        ? totalFreightPaid
        : derivedDiscrepancies.reduce((acc, curr) => acc + curr.billedAmount, 0);
    const computedClaimable =
      typeof totalLeakFound === 'number'
        ? totalLeakFound
        : derivedDiscrepancies.reduce((acc, curr) => acc + curr.claimableAmount, 0);
    const totalContracted = Math.max(0, computedBilled - computedClaimable);
    const pendingDebitNotes = actionableDiscrepancies.filter(
      (d) => d.status === 'DEBIT_NOTE_PENDING' || d.status === 'APPROVED_FOR_DEDUCTION'
    ).length;

    return {
      totalBilled: computedBilled,
      totalContracted,
      totalClaimable: computedClaimable,
      pendingDebitNotes,
      discrepancyCount: actionableDiscrepancies.length,
    };
  }, [derivedDiscrepancies, actionableDiscrepancies, totalFreightPaid, totalLeakFound]);

  const handleExportTransporterDebitNoteCSV = () => {
    const targetDiscrepancies =
      actionableDiscrepancies.length > 0 ? actionableDiscrepancies : derivedDiscrepancies;

    const headers = [
      'Discrepancy_ID',
      'Transporter_Name',
      'Lane',
      'LR_Number',
      'Discrepancy_Type',
      'Billed_Amount_INR',
      'Contracted_Amount_INR',
      'Debit_Claimable_INR',
      'Status',
      'Remarks',
    ];

    const rows = targetDiscrepancies.map((d) => [
      `"${d.id}"`,
      `"${d.transporterName.replace(/"/g, '""')}"`,
      `"${d.lane.replace(/"/g, '""')}"`,
      `"${d.lrNumber.replace(/"/g, '""')}"`,
      `"${d.discrepancyType}"`,
      d.billedAmount,
      d.contractedAmount,
      d.claimableAmount,
      `"${d.status}"`,
      `"${d.remarks.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Transporter_Debit_Notes_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportTransporterDebitNoteHtml = () => {
    const targetDiscrepancies =
      actionableDiscrepancies.length > 0 ? actionableDiscrepancies : derivedDiscrepancies;

    const formattedItems = targetDiscrepancies.map((d) => ({
      lrNumber: d.lrNumber,
      route: d.lane,
      rateOvercharge: d.rateOvercharge,
      detentionClaim: d.detentionClaim,
      netDebit: d.claimableAmount,
      status: d.status,
    }));

    const totalRateOvercharge = formattedItems.reduce(
      (sum, item) => sum + item.rateOvercharge,
      0
    );
    const totalDetentionClaim = formattedItems.reduce(
      (sum, item) => sum + item.detentionClaim,
      0
    );
    const totalNetDebit = formattedItems.reduce((sum, item) => sum + item.netDebit, 0);

    exportPrintableTransporterDebitNote({
      voucherNo: `DN-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      transporterName: targetDiscrepancies[0]?.transporterName || 'All Contracted Transporters',
      plantName: 'Central Dispatch Facility',
      discrepancies: formattedItems,
      totalRateOvercharge,
      totalDetentionClaim,
      totalNetDebit,
    });
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Engine P3: Freight Audit &amp; Transporter Leakage Engine
              </h2>
              <p className="text-sm text-slate-400">
                Automated contract rate verification, gate detention tracking, and debit note issuance
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportTransporterDebitNoteCSV}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-lg shadow-lg transition flex items-center gap-2 border border-rose-500/30 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Transporter Debit Notes (CSV)
            </button>
            <button
              type="button"
              onClick={handleExportTransporterDebitNoteHtml}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg transition flex items-center gap-2 border border-indigo-500/30 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" /> Download Printable Debit Note (.HTML)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Billed Freight
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {formatCurrency(summaryMetrics.totalBilled, 'INR')}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {summaryMetrics.discrepancyCount} Leak Audit Records
            </div>
          </div>

          <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-4">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Contracted Rate Base
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {formatCurrency(summaryMetrics.totalContracted, 'INR')}
            </div>
            <div className="text-xs text-emerald-500/80 mt-1">Verified Agreement Rate</div>
          </div>

          <div className="bg-slate-950/60 border border-rose-500/20 rounded-xl p-4">
            <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Identified Freight Leakage
            </div>
            <div className="text-2xl font-bold text-rose-400 mt-1">
              {formatCurrency(summaryMetrics.totalClaimable, 'INR')}
            </div>
            <div className="text-xs text-rose-500/80 mt-1">Pending Debit Recovery</div>
          </div>

          <div className="bg-slate-950/60 border border-amber-500/20 rounded-xl p-4">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Actionable Debit Vouchers
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {summaryMetrics.pendingDebitNotes} Pending
            </div>
            <div className="text-xs text-amber-500/80 mt-1">Ready for Recovery</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" /> Freight Discrepancy &amp; Detention Audit Register
          </h3>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">All Discrepancy Statuses</option>
              <option value="DEBIT_NOTE_PENDING">Debit Note Pending</option>
              <option value="APPROVED_FOR_DEDUCTION">Approved for Deduction</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Transporter &amp; Lane</th>
                <th className="px-4 py-3">LR Reference</th>
                <th className="px-4 py-3">Discrepancy Type</th>
                <th className="px-4 py-3">Billed (INR)</th>
                <th className="px-4 py-3">Contracted (INR)</th>
                <th className="px-4 py-3">Debit Amount (INR)</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDiscrepancies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No freight discrepancies found.
                  </td>
                </tr>
              ) : (
                filteredDiscrepancies.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-medium text-white">
                      <div>{d.transporterName}</div>
                      <div className="text-xs text-slate-500 font-mono">{d.lane}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">{d.lrNumber}</td>
                    <td className="px-4 py-3 text-slate-300">{d.discrepancyType}</td>
                    <td className="px-4 py-3 font-mono">{formatCurrency(d.billedAmount, 'INR')}</td>
                    <td className="px-4 py-3 font-mono text-emerald-400">
                      {formatCurrency(d.contractedAmount, 'INR')}
                    </td>
                    <td className="px-4 py-3 font-mono text-rose-400 font-semibold">
                      {formatCurrency(d.claimableAmount, 'INR')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          d.status === 'DEBIT_NOTE_PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProfitProtectionEngineV2;

