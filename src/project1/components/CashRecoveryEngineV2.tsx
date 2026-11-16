import React, { useState, useMemo } from 'react';
import {
  Ban,
  TrendingUp,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  IndianRupee,
  FileSpreadsheet,
  Download,
  Filter,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';
import { StockItem, RulesConfig, CurrencyCode } from '../types';
import { evaluateStockEngine, formatCurrency } from '../utils/calculations';
import { exportPrintableRtvClaimLetter } from '../../commercial/TallyCleanerAndClaims';

export interface CashRecoveryEngineV2Props {
  items: StockItem[];
  rules: RulesConfig;
  currency: CurrencyCode;
}

export interface DispositionItem {
  id: string;
  itemCode: string;
  itemName: string;
  daysIdle: number;
  bookValue: number;
  recommendedDisposition: 'RTV / Credit Note' | 'BOM Substitution / Reuse' | 'Scrap / Salvage Liquidation';
  estimatedRecoveryPercentage: number;
  estimatedRecoveryINR: number;
  assignedDesk: string;
}

export function CashRecoveryEngineV2({ items, rules, currency }: CashRecoveryEngineV2Props) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  const dispositionItems: DispositionItem[] = useMemo(() => {
    return items
      .filter(item => (item.daysIdle || 0) > 180)
      .map(item => {
        const days = item.daysIdle || 0;
        const bookVal = item.closingValue || (item.qtyOnHand * item.costRate) || 0;

        let recommendedDisposition: DispositionItem['recommendedDisposition'] = 'RTV / Credit Note';
        let estimatedRecoveryPercentage = 0.75;
        let assignedDesk = 'Procurement / Vendor Desk';

        if (days > 365) {
          recommendedDisposition = 'Scrap / Salvage Liquidation';
          estimatedRecoveryPercentage = 0.20;
          assignedDesk = 'Stores / Salvage Desk';
        } else if (days >= 271) {
          recommendedDisposition = 'BOM Substitution / Reuse';
          estimatedRecoveryPercentage = 0.55;
          assignedDesk = 'Plant Operations / Engineering';
        } else {
          recommendedDisposition = 'RTV / Credit Note';
          estimatedRecoveryPercentage = 0.75;
          assignedDesk = 'Procurement / Vendor Desk';
        }

        const estimatedRecoveryINR = Math.round(bookVal * estimatedRecoveryPercentage);

        return {
          id: item.id,
          itemCode: item.itemCode,
          itemName: item.itemName,
          daysIdle: days,
          bookValue: bookVal,
          recommendedDisposition,
          estimatedRecoveryPercentage,
          estimatedRecoveryINR,
          assignedDesk
        };
      });
  }, [items]);

  const totals = useMemo(() => {
    const totalStagnantBookValue = dispositionItems.reduce((acc, curr) => acc + curr.bookValue, 0);
    const totalEstimatedRecovery = dispositionItems.reduce((acc, curr) => acc + curr.estimatedRecoveryINR, 0);

    const rtvItems = dispositionItems.filter(i => i.recommendedDisposition === 'RTV / Credit Note');
    const bomItems = dispositionItems.filter(i => i.recommendedDisposition === 'BOM Substitution / Reuse');
    const scrapItems = dispositionItems.filter(i => i.recommendedDisposition === 'Scrap / Salvage Liquidation');

    return {
      totalStagnantBookValue,
      totalEstimatedRecovery,
      rtvRecovery: rtvItems.reduce((acc, curr) => acc + curr.estimatedRecoveryINR, 0),
      bomRecovery: bomItems.reduce((acc, curr) => acc + curr.estimatedRecoveryINR, 0),
      scrapRecovery: scrapItems.reduce((acc, curr) => acc + curr.estimatedRecoveryINR, 0),
      count: dispositionItems.length
    };
  }, [dispositionItems]);

  const handleExportDispositionCSV = () => {
    const headers = [
      'Item_Code',
      'Item_Name',
      'Days_Idle',
      'Book_Value_INR',
      'Recommended_Disposition',
      'Est_Recovery_Pct',
      'Est_Recovery_INR',
      'Assigned_Action_Desk'
    ];

    const rows = dispositionItems.map(item => [
      `"${item.itemCode}"`,
      `"${item.itemName.replace(/"/g, '""')}"`,
      item.daysIdle,
      item.bookValue,
      `"${item.recommendedDisposition}"`,
      `${(item.estimatedRecoveryPercentage * 100).toFixed(0)}%`,
      item.estimatedRecoveryINR,
      `"${item.assignedDesk}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Disposition_Action_Plan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportRtvClaimPDF = () => {
    const stagnantItems = items.filter(item => (item.daysIdle || 0) > 180);
    const targetItems = stagnantItems.length > 0 ? stagnantItems : items;

    let totalRtv = 0;
    let totalBom = 0;
    let totalScrap = 0;
    let totalCash = 0;

    const formattedItems = targetItems.map(item => {
      const days = item.daysIdle || 0;
      const bookVal = item.closingValue || (item.qtyOnHand * item.costRate) || 0;
      let recAction = 'RTV / Credit Note';
      let estPct = 0.75;

      if (days > 365) {
        recAction = 'Scrap / Salvage Liquidation';
        estPct = 0.20;
      } else if (days >= 271) {
        recAction = 'BOM Substitution / Reuse';
        estPct = 0.55;
      } else {
        recAction = 'RTV / Credit Note';
        estPct = 0.75;
      }

      const recoveryINR = Math.round(bookVal * estPct);
      if (days > 365) totalScrap += recoveryINR;
      else if (days >= 271) totalBom += recoveryINR;
      else totalRtv += recoveryINR;
      totalCash += recoveryINR;

      return {
        partNumber: item.itemCode,
        description: item.itemName,
        ageDays: days,
        qty: item.qtyOnHand,
        unitValue: item.costRate,
        totalValue: bookVal,
        recommendedAction: recAction
      };
    });

    exportPrintableRtvClaimLetter({
      plantName: 'Central Operations Plant',
      referenceNo: `RTV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      items: formattedItems,
      totalRtvRecovery: totalRtv,
      totalBomReuse: totalBom,
      totalScrapLiquidation: totalScrap,
      totalCashRelease: totalCash
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Engine P1: Inventory Cash Recovery & Liquidation Desk
                </h2>
                <p className="text-sm text-slate-400">
                  Automated disposition routing for slow-moving, non-moving, and stagnant inventory (&gt;180 days idle)
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportDispositionCSV}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-emerald-900/40 transition flex items-center gap-2 border border-emerald-500/30"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Disposition Action Sheet (CSV)
            </button>
            <button
              onClick={handleExportRtvClaimPDF}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-blue-900/40 transition flex items-center gap-2 border border-blue-500/30"
            >
              <FileSpreadsheet className="w-4 h-4" /> Print / Save PDF: RTV & Scrap Claim Letter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Identified Stagnant Inventory</div>
            <div className="text-2xl font-bold text-white mt-1">{totals.count} Items</div>
            <div className="text-xs text-slate-500 mt-1">Book Value: {formatCurrency(totals.totalStagnantBookValue, currency)}</div>
          </div>

          <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-4">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Total Est. Cash Release</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(totals.totalEstimatedRecovery, currency)}</div>
            <div className="text-xs text-emerald-500/80 mt-1">Weighted Recovery Potential</div>
          </div>

          <div className="bg-slate-950/60 border border-blue-500/20 rounded-xl p-4">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">RTV Vendor Recovery (180-270d)</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">{formatCurrency(totals.rtvRecovery, currency)}</div>
            <div className="text-xs text-blue-500/80 mt-1">75% Est. Recovery Rate</div>
          </div>

          <div className="bg-slate-950/60 border border-amber-500/20 rounded-xl p-4">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">BOM Reuse &amp; Scrap (271d+)</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{formatCurrency(totals.bomRecovery + totals.scrapRecovery, currency)}</div>
            <div className="text-xs text-amber-500/80 mt-1">Internal Reuse &amp; Salvage</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" /> Stagnant Inventory Disposition Routing Table
          </h3>
          <div className="text-xs text-slate-400">
            Showing {dispositionItems.length} items requiring immediate commercial disposition
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Item Code &amp; Name</th>
                <th className="px-4 py-3">Idle Days</th>
                <th className="px-4 py-3">Book Value</th>
                <th className="px-4 py-3">Recommended Disposition</th>
                <th className="px-4 py-3">Est. Recovery %</th>
                <th className="px-4 py-3">Est. Recovery (INR)</th>
                <th className="px-4 py-3">Assigned Desk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {dispositionItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No stagnant inventory items found matching criteria (&gt;180 days idle).
                  </td>
                </tr>
              ) : (
                dispositionItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-medium text-white">
                      <div>{item.itemName}</div>
                      <div className="text-xs text-slate-500 font-mono">{item.itemCode}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-amber-400">{item.daysIdle} days</td>
                    <td className="px-4 py-3 font-mono">{formatCurrency(item.bookValue, currency)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.recommendedDisposition === 'RTV / Credit Note'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : item.recommendedDisposition === 'BOM Substitution / Reuse'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {item.recommendedDisposition}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">{(item.estimatedRecoveryPercentage * 100).toFixed(0)}%</td>
                    <td className="px-4 py-3 font-mono text-emerald-400 font-semibold">
                      {formatCurrency(item.estimatedRecoveryINR, currency)}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{item.assignedDesk}</td>
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

export default CashRecoveryEngineV2;
