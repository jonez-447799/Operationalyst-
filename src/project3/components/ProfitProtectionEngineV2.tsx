import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Filter,
  DollarSign,
  Truck,
  Building,
  Clock,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { FreightDiscrepancy, FreightSummary, FreightVendorAudit } from '../types/freight';
import { formatCurrency } from '../../project1/utils/calculations';
import { exportPrintableTransporterDebitNote } from '../../commercial/TallyCleanerAndClaims';

export interface ProfitProtectionEngineV2Props {
  freightDiscrepancies: FreightDiscrepancy[];
  freightSummary?: FreightSummary;
  vendorAudits?: FreightVendorAudit[];
}

export function ProfitProtectionEngineV2({
  freightDiscrepancies,
  freightSummary,
  vendorAudits = []
}: ProfitProtectionEngineV2Props) {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredDiscrepancies = useMemo(() => {
    if (statusFilter === 'ALL') return freightDiscrepancies;
    return freightDiscrepancies.filter(d => d.status === statusFilter);
  }, [freightDiscrepancies, statusFilter]);

  const summaryMetrics = useMemo(() => {
    const totalBilled = freightDiscrepancies.reduce((acc, curr) => acc + (curr.billedAmount || 0), 0);
    const totalContracted = freightDiscrepancies.reduce((acc, curr) => acc + (curr.contractedAmount || 0), 0);
    const totalClaimable = freightDiscrepancies.reduce((acc, curr) => acc + (curr.claimableAmount || 0), 0);
    const pendingDebitNotes = freightDiscrepancies.filter(d => d.status === 'DEBIT_NOTE_PENDING').length;

    return {
      totalBilled,
      totalContracted,
      totalClaimable,
      pendingDebitNotes,
      discrepancyCount: freightDiscrepancies.length
    };
  }, [freightDiscrepancies]);

  const handleExportTransporterDebitNoteCSV = () => {
    const activeDiscrepancies = freightDiscrepancies.filter(
      d => d.status === 'DEBIT_NOTE_PENDING' || d.status === 'APPROVED_FOR_DEDUCTION' || d.claimableAmount > 0
    );
    const targetDiscrepancies = activeDiscrepancies.length > 0 ? activeDiscrepancies : freightDiscrepancies;

    const headers = [
      'Discrepancy_ID',
      'Transporter_Name',
      'Vehicle_Number',
      'LR_Number',
      'Discrepancy_Type',
      'Billed_Amount_INR',
      'Contracted_Amount_INR',
      'Debit_Claimable_INR',
      'Status',
      'Remarks'
    ];

    const rows = targetDiscrepancies.map(d => [
      `"${d.id}"`,
      `"${(d.transporterName || 'Default Transporter').replace(/"/g, '""')}"`,
      `"${d.vehicleNumber || 'N/A'}"`,
      `"${d.lrNumber || 'N/A'}"`,
      `"${d.discrepancyType || 'Freight Overcharge'}"`,
      d.billedAmount || 0,
      d.contractedAmount || 0,
      d.claimableAmount || 0,
      `"${d.status}"`,
      `"${(d.remarks || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Transporter_Debit_Notes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportTransporterDebitNotePDF = () => {
    const activeDiscrepancies = freightDiscrepancies.filter(
      d => d.status === 'DEBIT_NOTE_PENDING' || d.status === 'APPROVED_FOR_DEDUCTION' || d.claimableAmount > 0
    );
    const targetDiscrepancies = activeDiscrepancies.length > 0 ? activeDiscrepancies : freightDiscrepancies;

    const formattedItems = targetDiscrepancies.map(d => ({
      lrNumber: d.lrNumber || `LR-${d.id.slice(-5)}`,
      transporterName: d.transporterName || 'Logistics Partner',
      vehicleNumber: d.vehicleNumber || 'N/A',
      discrepancyType: d.discrepancyType || 'Freight Overcharge / Detention',
      originalAmount: d.billedAmount || 0,
      approvedAmount: d.contractedAmount || 0,
      debitAmount: d.claimableAmount || 0,
      remarks: d.remarks || 'Deduction per Contract Terms'
    }));

    const totalDebit = formattedItems.reduce((sum, item) => sum + item.debitAmount, 0);

    exportPrintableTransporterDebitNote({
      debitNoteNo: `DN-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      transporterName: formattedItems[0]?.transporterName || 'Logistics Partner',
      plantLocation: 'Central Dispatch Facility',
      items: formattedItems,
      totalDebitINR: totalDebit
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Engine P3: Freight Audit &amp; Transporter Leakage Engine
                </h2>
                <p className="text-sm text-slate-400">
                  Automated contract rate verification, detention tracking, and debit note issuance
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportTransporterDebitNoteCSV}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-rose-900/40 transition flex items-center gap-2 border border-rose-500/30"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Transporter Debit Notes (CSV)
            </button>
            <button
              onClick={handleExportTransporterDebitNotePDF}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-indigo-900/40 transition flex items-center gap-2 border border-indigo-500/30"
            >
              <FileSpreadsheet className="w-4 h-4" /> Print / Save PDF: Official Debit Note Voucher
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Billed Freight</div>
            <div className="text-2xl font-bold text-white mt-1">{formatCurrency(summaryMetrics.totalBilled, 'INR')}</div>
            <div className="text-xs text-slate-500 mt-1">{summaryMetrics.discrepancyCount} Audit Records</div>
          </div>

          <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-4">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Contracted Rate Base</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(summaryMetrics.totalContracted, 'INR')}</div>
            <div className="text-xs text-emerald-500/80 mt-1">Verified Agreement Rate</div>
          </div>

          <div className="bg-slate-950/60 border border-rose-500/20 rounded-xl p-4">
            <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Identified Freight Leakage</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">{formatCurrency(summaryMetrics.totalClaimable, 'INR')}</div>
            <div className="text-xs text-rose-500/80 mt-1">Pending Debit Recovery</div>
          </div>

          <div className="bg-slate-950/60 border border-amber-500/20 rounded-xl p-4">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Actionable Debit Vouchers</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{summaryMetrics.pendingDebitNotes} Pending</div>
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
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="DEBIT_NOTE_PENDING">Debit Note Pending</option>
              <option value="APPROVED_FOR_DEDUCTION">Approved for Deduction</option>
              <option value="SETTLED">Settled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Transporter &amp; Vehicle</th>
                <th className="px-4 py-3">LR Number</th>
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
                filteredDiscrepancies.map(d => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-medium text-white">
                      <div>{d.transporterName || 'Logistics Partner'}</div>
                      <div className="text-xs text-slate-500 font-mono">{d.vehicleNumber || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">{d.lrNumber || 'N/A'}</td>
                    <td className="px-4 py-3 text-slate-300">{d.discrepancyType || 'Freight Variance'}</td>
                    <td className="px-4 py-3 font-mono">{formatCurrency(d.billedAmount || 0, 'INR')}</td>
                    <td className="px-4 py-3 font-mono text-emerald-400">{formatCurrency(d.contractedAmount || 0, 'INR')}</td>
                    <td className="px-4 py-3 font-mono text-rose-400 font-semibold">
                      {formatCurrency(d.claimableAmount || 0, 'INR')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          d.status === 'DEBIT_NOTE_PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : d.status === 'APPROVED_FOR_DEDUCTION'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
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
