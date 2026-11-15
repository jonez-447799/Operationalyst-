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

export interface CashRecoveryEngineV2Props {
  items: StockItem[];
  rules: RulesConfig;
  currency: CurrencyCode;
  onNavigateToStock?: () => void;
}

export type RecoveryDispositionCategory =
  | 'RTV / Credit Note'
  | 'BOM Substitution / Reuse'
  | 'Scrap / Salvage Liquidation'
  | 'Active Stock';

export interface DispositionItem {
  id: string;
  itemCode: string;
  itemName: string;
  daysIdle: number;
  bookValue: number;
  recommendedDisposition: RecoveryDispositionCategory;
  estimatedRecoveryPercentage: number;
  estimatedRecoveryINR: number;
  assignedDesk: string;
}

export const CashRecoveryEngineV2: React.FC<CashRecoveryEngineV2Props> = ({
  items,
  rules,
  currency,
  onNavigateToStock
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'disposition_planner' | 'aging_top10' | 'abc_pareto_tracker' | 'freeze_forecast_ai'
  >('disposition_planner');

  const [dispositionFilter, setDispositionFilter] = useState<'ALL' | 'RTV' | 'BOM' | 'SCRAP'>('ALL');

  const evaluation = useMemo(() => {
    return evaluateStockEngine(items, rules);
  }, [items, rules]);

  const dispositionItems: DispositionItem[] = useMemo(() => {
    return items
      .filter(item => (item.daysIdle || 0) > 180)
      .map(item => {
        const days = item.daysIdle || 0;
        const bookVal = item.closingValue || (item.qtyOnHand * item.costRate) || 0;

        let recommendedDisposition: RecoveryDispositionCategory = 'RTV / Credit Note';
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
      })
      .sort((a, b) => b.bookValue - a.bookValue);
  }, [items]);

  const filteredDispositionItems = useMemo(() => {
    if (dispositionFilter === 'RTV') {
      return dispositionItems.filter(i => i.recommendedDisposition === 'RTV / Credit Note');
    }
    if (dispositionFilter === 'BOM') {
      return dispositionItems.filter(i => i.recommendedDisposition === 'BOM Substitution / Reuse');
    }
    if (dispositionFilter === 'SCRAP') {
      return dispositionItems.filter(i => i.recommendedDisposition === 'Scrap / Salvage Liquidation');
    }
    return dispositionItems;
  }, [dispositionItems, dispositionFilter]);

  const dispositionTotals = useMemo(() => {
    const totalBookValue = dispositionItems.reduce((acc, i) => acc + i.bookValue, 0);
    const totalEstimatedRecovery = dispositionItems.reduce((acc, i) => acc + i.estimatedRecoveryINR, 0);
    const rtvCount = dispositionItems.filter(i => i.recommendedDisposition === 'RTV / Credit Note').length;
    const bomCount = dispositionItems.filter(i => i.recommendedDisposition === 'BOM Substitution / Reuse').length;
    const scrapCount = dispositionItems.filter(i => i.recommendedDisposition === 'Scrap / Salvage Liquidation').length;

    return {
      totalBookValue,
      totalEstimatedRecovery,
      rtvCount,
      bomCount,
      scrapCount,
      totalCount: dispositionItems.length
    };
  }, [dispositionItems]);

  const handleExportDispositionCSV = () => {
    const headers = [
      'Part_ID',
      'Description',
      'Days_Stagnant',
      'Book_Value_INR',
      'Recommended_Disposition',
      'Estimated_Recovery_INR',
      'Assigned_Team_Desk'
    ];

    const rows = dispositionItems.map(item => [
      `"${item.itemCode}"`,
      `"${item.itemName.replace(/"/g, '""')}"`,
      item.daysIdle,
      item.bookValue.toFixed(2),
      `"${item.recommendedDisposition}"`,
      item.estimatedRecoveryINR.toFixed(2),
      `"${item.assignedDesk}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Operationalyst_Disposition_Action_Sheet_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-1">
              <Sparkles className="w-4 h-4" /> ENGINE P1 — CASH RECOVERY & DISPOSITION PLANNER
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Stagnant Inventory Liquidation & Recovery Engine
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Classifies &gt;180 day idle stock into RTV (75%), BOM Reuse (55%), and Salvage (20%) desks with 1-Click Executive Export.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportDispositionCSV}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-emerald-900/40 transition flex items-center gap-2 border border-emerald-500/30"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Disposition Action Sheet (CSV)
            </button>
            {onNavigateToStock && (
              <button
                onClick={onNavigateToStock}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition flex items-center gap-2 border border-slate-700"
              >
                View Full Stock Register <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5 text-rose-400" /> Stagnant Book Value (&gt;180d)
            </div>
            <div className="text-xl font-bold text-rose-400">
              {formatCurrency(dispositionTotals.totalBookValue, currency)}
            </div>
            <div className="text-xs text-slate-500 mt-1">{dispositionTotals.totalCount} high-risk SKU items</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Estimated Cash Recovery
            </div>
            <div className="text-xl font-bold text-emerald-400">
              {formatCurrency(dispositionTotals.totalEstimatedRecovery, currency)}
            </div>
            <div className="text-xs text-emerald-500/80 mt-1">
              {dispositionTotals.totalBookValue > 0
                ? `${((dispositionTotals.totalEstimatedRecovery / dispositionTotals.totalBookValue) * 100).toFixed(1)}% recovery yield`
                : '0% yield'}
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> RTV & BOM Candidates
            </div>
            <div className="text-xl font-bold text-amber-400">
              {dispositionTotals.rtvCount + dispositionTotals.bomCount} SKUs
            </div>
            <div className="text-xs text-slate-500 mt-1">
              RTV (181–270d): {dispositionTotals.rtvCount} | BOM (271–365d): {dispositionTotals.bomCount}
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-400" /> Scrap Liquidation
            </div>
            <div className="text-xl font-bold text-blue-400">
              {dispositionTotals.scrapCount} SKUs
            </div>
            <div className="text-xs text-slate-500 mt-1">Items &gt;365 days idle (20% recovery)</div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveSubTab('disposition_planner')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition flex items-center gap-2 ${
            activeSubTab === 'disposition_planner'
              ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Layers className="w-4 h-4" /> Disposition Action Planner
        </button>
        <button
          onClick={() => setActiveSubTab('aging_top10')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition flex items-center gap-2 ${
            activeSubTab === 'aging_top10'
              ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Top Dead Stock & Aging Breakdown
        </button>
        <button
          onClick={() => setActiveSubTab('abc_pareto_tracker')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition flex items-center gap-2 ${
            activeSubTab === 'abc_pareto_tracker'
              ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Filter className="w-4 h-4" /> ABC / Pareto Capital Allocation
        </button>
      </div>

      {activeSubTab === 'disposition_planner' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Stagnant Item Action Desk (&gt;180 Days)
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-400">Filter Disposition:</span>
              <button
                onClick={() => setDispositionFilter('ALL')}
                className={`px-3 py-1.5 rounded-md transition ${
                  dispositionFilter === 'ALL'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All ({dispositionItems.length})
              </button>
              <button
                onClick={() => setDispositionFilter('RTV')}
                className={`px-3 py-1.5 rounded-md transition ${
                  dispositionFilter === 'RTV'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                RTV (181-270d)
              </button>
              <button
                onClick={() => setDispositionFilter('BOM')}
                className={`px-3 py-1.5 rounded-md transition ${
                  dispositionFilter === 'BOM'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                BOM Reuse (271-365d)
              </button>
              <button
                onClick={() => setDispositionFilter('SCRAP')}
                className={`px-3 py-1.5 rounded-md transition ${
                  dispositionFilter === 'SCRAP'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Scrap (&gt;365d)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Part ID</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Days Stagnant</th>
                  <th className="py-3 px-4 text-right">Book Value (INR)</th>
                  <th className="py-3 px-4">Recommended Disposition</th>
                  <th className="py-3 px-4 text-right">Est. Recovery (INR)</th>
                  <th className="py-3 px-4">Assigned Team Desk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredDispositionItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                      No stagnant items match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredDispositionItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-emerald-400 font-bold">{item.itemCode}</td>
                      <td className="py-3 px-4 font-sans text-slate-200">{item.itemName}</td>
                      <td className="py-3 px-4 text-center font-bold text-amber-400">{item.daysIdle} d</td>
                      <td className="py-3 px-4 text-right font-bold text-white">
                        {formatCurrency(item.bookValue, currency)}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            item.recommendedDisposition === 'RTV / Credit Note'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                              : item.recommendedDisposition === 'BOM Substitution / Reuse'
                              ? 'bg-amber-950 text-amber-400 border border-amber-700/50'
                              : 'bg-rose-950 text-rose-400 border border-rose-700/50'
                          }`}
                        >
                          {item.recommendedDisposition}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400">
                        {formatCurrency(item.estimatedRecoveryINR, currency)}
                        <span className="text-[10px] text-slate-500 block font-normal">
                          ({(item.estimatedRecoveryPercentage * 100).toFixed(0)}%)
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-400">{item.assignedDesk}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'aging_top10' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-amber-400" /> Dead Stock Risk Evaluation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Total Evaluated Stock Items</h4>
              <p className="text-2xl font-bold text-white">{items.length} SKUs</p>
              <p className="text-xs text-slate-500 mt-1">Rule threshold: {rules.slowMovingDays} days idle threshold</p>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Evaluated Dead Stock Exposure</h4>
              <p className="text-2xl font-bold text-rose-400">
                {formatCurrency(evaluation.deadStockValue, currency)}
              </p>
              <p className="text-xs text-slate-500 mt-1">Identified across stagnant inventory buckets</p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'abc_pareto_tracker' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> ABC / Pareto Analysis
          </h3>
          <p className="text-sm text-slate-400">
            Categorization based on cumulative investment value to optimize cycle counts and working capital lockup.
          </p>
        </div>
      )}
    </div>
  );
};

export default CashRecoveryEngineV2;
