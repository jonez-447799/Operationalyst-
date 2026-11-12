import React, { useState } from 'react';
import { StockItem, RulesConfig, CurrencyCode, UserRole } from '../types';
import { formatCurrency, generateOwnerReport } from '../utils/calculations';
import { calculateWorkingCapitalOptimization, InventoryRecord, PolicyConfig } from '../../intelligence/workingCapitalOptimizer';
import {
  AlertTriangle,
  Clock,
  TrendingDown,
  Package,
  Flame,
  ArrowRight,
  Send,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Copy,
  Layers,
  Award,
  Zap,
  Database
} from 'lucide-react';

interface OwnerReportProps {
  items: StockItem[];
  rules: RulesConfig;
  currency: CurrencyCode;
  onOpenAuditDossier?: () => void;
  onOpenSimulator?: () => void;
  userRole?: UserRole;
}

export const OwnerReport: React.FC<OwnerReportProps> = ({
  items,
  rules,
  currency,
  onOpenAuditDossier,
  onOpenSimulator,
  userRole = 'owner'
}) => {
  const [copiedScript, setCopiedScript] = useState(false);

  // Invoke CFO Working Capital Optimizer Engine
  const inventoryRecords: InventoryRecord[] = (items || []).map((item) => ({
    id: item.id || item.itemCode,
    name: item.itemName,
    category: item.category,
    qty: item.qtyOnHand,
    unitCost: item.costRate,
    daysNonMoving: item.daysIdle ?? 0,
    isCriticalSpare: item.isReserveSpare === true || (item.itemName && item.itemName.includes('Item 07')),
  }));

  const policyConfig: PolicyConfig = {
    cutoffDays: rules?.deadThresholdDays ?? 90,
    carryingCostPct: rules?.holdingCostPercent ?? 22,
    excludeCriticalSpares: rules?.excludeCriticalSpares ?? true,
  };

  const optimizerResult = calculateWorkingCapitalOptimization(inventoryRecords, policyConfig);

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const report = generateOwnerReport(items, rules, currency);

  const whatsappMessage = `*Executive Operationalyst Summary*
Plant Capital: ${formatCurrency(report.totalValuation, currency)}
Dead Stock Exposure: ${formatCurrency(report.deadStockValuation, currency)} (${report.deadStockPercent.toFixed(1)}%)
Annual Carrying Burn: ${formatCurrency(report.annualHoldingCostBurn, currency)}/yr

*Top Action Items:*
${report.top5DeadItems.map(i => `• ${i.itemName} (${i.daysIdle} days): ${formatCurrency(i.totalCost, currency)}`).join('\n')}

_Generated via Project 1 Engine | Verified Tally Summary_`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Owner Report
            </h1>
            <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              1-Page Deliverable
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            As of <strong className="font-mono text-neutral-900 dark:text-neutral-200">{rules.asOfDate}</strong> • Ambattur fabrication unit sample • Cutoff: {rules.deadThresholdDays} days idle
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="px-3 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-md transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Cash Simulator</span>
            </button>
          )}

          {onOpenAuditDossier && (
            <button
              onClick={onOpenAuditDossier}
              className="px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-md transition-colors flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-emerald-500" />
              <span>CA Dossier</span>
            </button>
          )}
        </div>
      </div>

      {/* Working Capital Optimizer & Actionable Recovery Tranches Card */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CFO Working Capital Optimizer
              </span>
              <span className="px-2 py-0.5 rounded text-xs text-slate-400 bg-slate-800">
                Deterministic Engine
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Working Capital Optimizer &amp; Actionable Recovery Tranches
            </h3>
            <p className="text-sm text-slate-400">
              Active Plant Inventory &amp; CFO Policy Simulator Integration • Exclusively 100% Client-Side Privacy
            </p>
          </div>
          <div className="sm:text-right">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Actionable Recovery</div>
            <div className="text-2xl font-black text-emerald-400">{formatINR(optimizerResult.actionableRecoverableValue)}</div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-lg">
            <div className="text-xs text-slate-400 font-medium">Total Active Inventory Stock</div>
            <div className="text-lg font-bold text-white mt-1">{formatINR(optimizerResult.totalInventoryValue)}</div>
            <div className="text-xs text-slate-500 mt-1">{optimizerResult.summary.totalSKUs} Total SKUs Tracked</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-lg">
            <div className="text-xs text-slate-400 font-medium">Dead Stock Valuation</div>
            <div className="text-lg font-bold text-amber-400 mt-1">{formatINR(optimizerResult.deadStockValue)}</div>
            <div className="text-xs text-slate-500 mt-1">{optimizerResult.summary.deadStockSKUs} Non-Moving SKUs (≥{policyConfig.cutoffDays} days)</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-lg">
            <div className="text-xs text-slate-400 font-medium">Actionable Recoverable Capital</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">{formatINR(optimizerResult.actionableRecoverableValue)}</div>
            <div className="text-xs text-emerald-500/80 mt-1">Net Recovery Yield across 3 Tranches</div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-lg">
            <div className="text-xs text-slate-400 font-medium">Annual Carrying-Burn Savings</div>
            <div className="text-lg font-bold text-cyan-400 mt-1">{formatINR(optimizerResult.annualCarryingBurnSavings)}/yr</div>
            <div className="text-xs text-slate-500 mt-1">Based on {policyConfig.carryingCostPct}% Annual Holding Rate</div>
          </div>
        </div>

        {/* Critical Spare Exclusion Banner */}
        {optimizerResult.summary.criticalSparesProtectedCount > 0 && (
          <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-lg p-3.5 flex items-center justify-between text-xs sm:text-sm text-indigo-200">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-indigo-300">🛡️ Safety Guard Active:</span>
              <span>
                {optimizerResult.summary.criticalSparesProtectedCount} Critical Spare(s) ({formatINR(optimizerResult.summary.criticalSparesProtectedValue)}) automatically protected from liquidation (e.g. Item 07 / Critical Spares Protection).
              </span>
            </div>
          </div>
        )}

        {/* Recovery Tranches Table */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Deterministic Action Recovery Tranches
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {optimizerResult.tranches.map((tranche) => (
              <div key={tranche.trancheId} className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      {tranche.trancheId}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      tranche.riskLevel === 'LOW' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      tranche.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {tranche.riskLevel} RISK
                    </span>
                  </div>
                  <h5 className="font-bold text-white text-sm">{tranche.title}</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tranche.dispositionStrategy}</p>
                </div>

                <div className="pt-3 border-t border-slate-700/60 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Gross Stock Tranche:</span>
                    <span className="text-slate-200 font-medium">{formatINR(tranche.totalValue)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Actionable Recoverable:</span>
                    <span>{formatINR(tranche.actionableRecoverableValue)}</span>
                  </div>
                  <div className="flex justify-between text-cyan-400">
                    <span>Carrying Savings:</span>
                    <span>{formatINR(tranche.annualCarryingSavings)}/yr</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1 text-[11px]">
                    <span>Timeframe:</span>
                    <span className="text-slate-300">{tranche.executionTimeframe}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Key Executive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Stock Value</span>
            <Package className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
            {formatCurrency(report.totalValuation, currency)}
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            Across {items.length} active SKUs
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Dead Stock Exposure</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {formatCurrency(report.deadStockValuation, currency)}
          </div>
          <div className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
            {report.deadStockPercent.toFixed(1)}% of total stock trapped
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Annual Carrying Burn</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">
            {formatCurrency(report.annualHoldingCostBurn, currency)}
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            At {rules.holdingCostPercent}% annual holding cost rate
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Protected Spares</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {report.reserveSpareCount} SKUs
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            {formatCurrency(report.reserveSpareValuation, currency)} excluded from scrap
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerReport;
