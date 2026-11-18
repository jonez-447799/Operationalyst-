import React, { useState, useMemo } from 'react';
import {
  Layers,
  Sparkles,
  FileSpreadsheet,
  ShieldCheck,
  SlidersHorizontal,
  ArrowRight,
} from 'lucide-react';
import type { StockItem, RulesConfig, CurrencyCode } from '../types';
import { formatCurrency } from '../utils/calculations';
import { exportPrintableRtvClaimLetter } from '../../commercial/TallyCleanerAndClaims';

export interface CashRecoveryEngineV2Props {
  items: StockItem[];
  rules: RulesConfig;
  currency: CurrencyCode;
  onNavigateToStock?: () => void;
}

export interface DispositionItem {
  id: string;
  itemCode: string;
  itemName: string;
  daysIdle: number;
  bookValue: number;
  recommendedDisposition:
    | 'RTV / Credit Note'
    | 'BOM Substitution / Reuse'
    | 'Scrap / Salvage Liquidation';
  estimatedRecoveryPercentage: number;
  estimatedRecoveryINR: number;
  assignedDesk: string;
}

export const DEFAULT_CONSERVATIVE_RECOVERY_RATES = {
  rtvPct: 50,
  bomReusePct: 40,
  scrapPct: 15,
};

function isCriticalSpareItem(item: StockItem): boolean {
  if (item.isReserveSpare) return true;
  const hay = `${item.itemName || ''} ${item.category || ''} ${item.action || ''}`.toLowerCase();
  return /\b(spare|spares|maintenance|mro|insurance\s*spare|critical\s*reserve|emergency\s*stock)\b/.test(
    hay
  );
}

export function CashRecoveryEngineV2({
  items,
  currency,
  onNavigateToStock,
}: CashRecoveryEngineV2Props) {
  const [excludeCriticalSpares, setExcludeCriticalSpares] = useState<boolean>(true);
  const [rtvPct, setRtvPct] = useState<number>(DEFAULT_CONSERVATIVE_RECOVERY_RATES.rtvPct);
  const [bomReusePct, setBomReusePct] = useState<number>(
    DEFAULT_CONSERVATIVE_RECOVERY_RATES.bomReusePct
  );
  const [scrapPct, setScrapPct] = useState<number>(
    DEFAULT_CONSERVATIVE_RECOVERY_RATES.scrapPct
  );

  const { eligibleStagnantItems, shieldedSparesCount } = useMemo(() => {
    const stagnant = items.filter((item) => (item.daysIdle || 0) > 180);
    let shielded = 0;
    const filtered = stagnant.filter((item) => {
      if (excludeCriticalSpares && isCriticalSpareItem(item)) {
        shielded++;
        return false;
      }
      return true;
    });
    return { eligibleStagnantItems: filtered, shieldedSparesCount: shielded };
  }, [items, excludeCriticalSpares]);

  const dispositionItems: DispositionItem[] = useMemo(() => {
    return eligibleStagnantItems.map((item) => {
      const days = item.daysIdle || 0;
      const bookVal = item.closingValue || item.qtyOnHand * item.costRate || 0;

      let recommendedDisposition: DispositionItem['recommendedDisposition'] =
        'RTV / Credit Note';
      let estimatedRecoveryPercentage = rtvPct / 100;
      let assignedDesk = 'Procurement / Vendor Desk';

      if (days > 365) {
        recommendedDisposition = 'Scrap / Salvage Liquidation';
        estimatedRecoveryPercentage = scrapPct / 100;
        assignedDesk = 'Stores / Salvage Desk';
      } else if (days >= 271) {
        recommendedDisposition = 'BOM Substitution / Reuse';
        estimatedRecoveryPercentage = bomReusePct / 100;
        assignedDesk = 'Plant Operations / Engineering';
      } else {
        recommendedDisposition = 'RTV / Credit Note';
        estimatedRecoveryPercentage = rtvPct / 100;
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
        assignedDesk,
      };
    });
  }, [eligibleStagnantItems, rtvPct, bomReusePct, scrapPct]);

  const totals = useMemo(() => {
    const totalStagnantBookValue = dispositionItems.reduce(
      (acc, curr) => acc + curr.bookValue,
      0
    );
    const totalEstimatedRecovery = dispositionItems.reduce(
      (acc, curr) => acc + curr.estimatedRecoveryINR,
      0
    );

    const rtvItems = dispositionItems.filter(
      (i) => i.recommendedDisposition === 'RTV / Credit Note'
    );
    const bomItems = dispositionItems.filter(
      (i) => i.recommendedDisposition === 'BOM Substitution / Reuse'
    );
    const scrapItems = dispositionItems.filter(
      (i) => i.recommendedDisposition === 'Scrap / Salvage Liquidation'
    );

    return {
      totalStagnantBookValue,
      totalEstimatedRecovery,
      rtvRecovery: rtvItems.reduce((acc, curr) => acc + curr.estimatedRecoveryINR, 0),
      bomRecovery: bomItems.reduce((acc, curr) => acc + curr.estimatedRecoveryINR, 0),
      scrapRecovery: scrapItems.reduce((acc, curr) => acc + curr.estimatedRecoveryINR, 0),
      count: dispositionItems.length,
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
      'Assigned_Action_Desk',
    ];

    const rows = dispositionItems.map((item) => [
      `"${item.itemCode}"`,
      `"${item.itemName.replace(/"/g, '""')}"`,
      item.daysIdle,
      item.bookValue,
      `"${item.recommendedDisposition}"`,
      `${Math.round(item.estimatedRecoveryPercentage * 100)}%`,
      item.estimatedRecoveryINR,
      `"${item.assignedDesk}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Disposition_Action_Plan_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportRtvClaimHtml = () => {
    const targetItems = dispositionItems.length > 0 ? dispositionItems : [];
    const lookup = new Map(items.map((it) => [it.id, it]));

    let totalRtv = 0;
    let totalBom = 0;
    let totalScrap = 0;
    let totalCash = 0;

    const formattedItems = targetItems.map((d) => {
      const src = lookup.get(d.id);
      if (d.recommendedDisposition === 'Scrap / Salvage Liquidation') {
        totalScrap += d.estimatedRecoveryINR;
      } else if (d.recommendedDisposition === 'BOM Substitution / Reuse') {
        totalBom += d.estimatedRecoveryINR;
      } else {
        totalRtv += d.estimatedRecoveryINR;
      }
      totalCash += d.estimatedRecoveryINR;

      return {
        partNumber: d.itemCode,
        description: d.itemName,
        ageDays: d.daysIdle,
        qty: src?.qtyOnHand ?? 0,
        unitValue: src?.costRate ?? 0,
        totalValue: d.bookValue,
        recommendedAction: `${d.recommendedDisposition} (${Math.round(
          d.estimatedRecoveryPercentage * 100
        )}%)`,
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
      totalCashRelease: totalCash,
    });
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Engine P1: Inventory Cash Recovery &amp; Liquidation Desk
              </h2>
              <p className="text-sm text-slate-400">
                Conservative disposition routing for stagnant inventory (&gt;180 days idle) with Critical Spares Shield
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {onNavigateToStock && (
              <button
                type="button"
                onClick={onNavigateToStock}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Full Stock Sheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleExportDispositionCSV}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow-lg transition flex items-center gap-2 border border-emerald-500/30 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Disposition Action Sheet (CSV)
            </button>
            <button
              type="button"
              onClick={handleExportRtvClaimHtml}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-lg transition flex items-center gap-2 border border-blue-500/30 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" /> Download Printable RTV Claim (.HTML)
            </button>
          </div>
        </div>

        {/* Spares Shield + Conservative Recovery Rate Sliders */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <SlidersHorizontal className="w-4 h-4" />
              <span>
                Conservative Recovery Realization Assumptions &amp; Critical Machine Spares Shield
              </span>
            </div>
            <label className="inline-flex items-center gap-2 text-xs text-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={excludeCriticalSpares}
                onChange={(e) => setExcludeCriticalSpares(e.target.checked)}
                className="accent-emerald-500 rounded cursor-pointer"
              />
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Exclude Critical Machine Spares ({shieldedSparesCount} shielded)
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-slate-300">
                <span>RTV / Vendor Credit (180–270d)</span>
                <strong className="text-blue-400">{rtvPct}%</strong>
              </div>
              <input
                type="range"
                min={10}
                max={90}
                step={5}
                value={rtvPct}
                onChange={(e) => setRtvPct(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono text-slate-300">
                <span>BOM Substitution / Reuse (271–365d)</span>
                <strong className="text-amber-400">{bomReusePct}%</strong>
              </div>
              <input
                type="range"
                min={10}
                max={80}
                step={5}
                value={bomReusePct}
                onChange={(e) => setBomReusePct(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono text-slate-300">
                <span>Scrap / Salvage Liquidation (&gt;365d)</span>
                <strong className="text-rose-400">{scrapPct}%</strong>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={scrapPct}
                onChange={(e) => setScrapPct(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Identified Stagnant Inventory
            </div>
            <div className="text-2xl font-bold text-white mt-1">{totals.count} Items</div>
            <div className="text-xs text-slate-500 mt-1">
              Book Value: {formatCurrency(totals.totalStagnantBookValue, currency)}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-4">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Total Est. Cash Release
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {formatCurrency(totals.totalEstimatedRecovery, currency)}
            </div>
            <div className="text-xs text-emerald-500/80 mt-1">
              At Conservative {rtvPct}%/{bomReusePct}%/{scrapPct}% Split
            </div>
          </div>

          <div className="bg-slate-950/60 border border-blue-500/20 rounded-xl p-4">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              RTV Vendor Recovery (180–270d)
            </div>
            <div className="text-2xl font-bold text-blue-400 mt-1">
              {formatCurrency(totals.rtvRecovery, currency)}
            </div>
            <div className="text-xs text-blue-500/80 mt-1">{rtvPct}% Est. Recovery Rate</div>
          </div>

          <div className="bg-slate-950/60 border border-amber-500/20 rounded-xl p-4">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              BOM Reuse &amp; Scrap (271d+)
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {formatCurrency(totals.bomRecovery + totals.scrapRecovery, currency)}
            </div>
            <div className="text-xs text-amber-500/80 mt-1">
              {bomReusePct}% BOM Reuse · {scrapPct}% Salvage
            </div>
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
                dispositionItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-medium text-white">
                      <div>{item.itemName}</div>
                      <div className="text-xs text-slate-500 font-mono">{item.itemCode}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-amber-400">
                      {item.daysIdle} days
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {formatCurrency(item.bookValue, currency)}
                    </td>
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
                    <td className="px-4 py-3 font-mono">
                      {Math.round(item.estimatedRecoveryPercentage * 100)}%
                    </td>
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

