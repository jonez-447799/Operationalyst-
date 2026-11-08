/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  CalendarClock,
  Download,
  FileSpreadsheet,
  HelpCircle,
  AlertTriangle,
  SlidersHorizontal,
} from 'lucide-react';
import {
  LivePlatformDataSnapshot,
  PlatformNavId,
  formatINRCompact,
} from '../dashboardConfig';
import {
  DemoDataNotice,
  ExecutivePriorityCard,
  KPIStatusCard,
  InvestigationQueue,
  ExecutiveBrief,
  TrendInsightCard,
  StatusBadge,
} from '../components/SharedDashboardPrimitives';
import { PlantId, PeriodId, PlantConfig, PeriodConfig } from '../../context/PlantContext';
import { downloadCommandCenterWorkbook } from '../../utils/excelCommandCenterExporter';
import { trackEvent } from '../../utils/analytics';
import { computeCapaFinancialSummary } from '../../utils/capaLedger';
import { FourPillarSensitivitySimulatorPanel } from '../../components/FourPillarSensitivitySimulatorPanel';
import { readPlantDatasetFromBrowser } from '../../data/multiPlantBaselines';

interface ExecutiveOverviewViewProps {
  snapshot: LivePlatformDataSnapshot;
  allPlants: PlantConfig[];
  allPeriods: PeriodConfig[];
  onSelectPlant: (id: PlantId) => void;
  onSelectPeriod: (id: PeriodId) => void;
  onNavigateDomain: (domain: PlatformNavId) => void;
  onOpenMethodology: (metricId: string) => void;
  onOpenOnboarding: () => void;
}

export const ExecutiveOverviewView: React.FC<ExecutiveOverviewViewProps> = ({
  snapshot,
  allPlants,
  allPeriods,
  onSelectPlant,
  onSelectPeriod,
  onNavigateDomain,
  onOpenMethodology,
  onOpenOnboarding,
}) => {
  const [comparePriorPeriod, setComparePriorPeriod] = useState<boolean>(true);

  const handleInspectDomain = (domain: PlatformNavId, source = 'overview') => {
    trackEvent('executive_priority_opened', { domain, source });
    onNavigateDomain(domain);
  };

  const handleExportWorkbook = () => {
    trackEvent('report_exported', { reportType: 'executive_6sheet_workbook', plantId: snapshot.plant.id });
    downloadCommandCenterWorkbook(snapshot.plant.id);
  };

  const attentionCount = snapshot.priorities.length;
  const plantDataset = readPlantDatasetFromBrowser(snapshot.plant.id);
  const capaSummary = computeCapaFinancialSummary(
    (snapshot.capaItems || plantDataset.capaItems || []) as unknown as Array<
      Record<string, unknown>
    >
  );

  return (
    <div className="space-y-6">
      {/* Persistent Demonstration Environment Notice */}
      <DemoDataNotice onOpenImports={() => onNavigateDomain('data_imports')} />

      {/* Section 1: Page Header */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Executive Overview
            </h1>
            <StatusBadge
              status={snapshot.p2DualGate.otifPercent < 60 ? 'Critical' : 'Requires attention'}
              size="md"
            />
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Current operational status, priority issues, and recommended investigations across your selected manufacturing unit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Factory / Unit Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
            <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <label htmlFor="overview-plant-select" className="sr-only">
              Select Factory Unit
            </label>
            <select
              id="overview-plant-select"
              value={snapshot.plant.id}
              onChange={(e) => onSelectPlant(e.target.value as PlantId)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {allPlants.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reporting Period Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 max-w-full">
            <CalendarClock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <label htmlFor="overview-period-select" className="sr-only">
              Select Reporting Period
            </label>
            <select
              id="overview-period-select"
              value={snapshot.period.id}
              onChange={(e) => onSelectPeriod(e.target.value as PeriodId)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer max-w-[230px] sm:max-w-none truncate"
            >
              {allPeriods.map((per) => (
                <option key={per.id} value={per.id} className="bg-slate-900 text-white">
                  {per.label}
                </option>
              ))}
            </select>
          </div>

          {/* Compare to Previous Period Toggle */}
          <button
            onClick={() => setComparePriorPeriod((v) => !v)}
            className={`px-3 py-2 rounded-lg border font-semibold inline-flex items-center gap-1.5 cursor-pointer transition ${
              comparePriorPeriod
                ? 'bg-sky-950/70 border-sky-500/40 text-sky-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Compare Prior Period: {comparePriorPeriod ? 'ON' : 'OFF'}</span>
          </button>

          {/* Export Executive Summary */}
          <button
            onClick={handleExportWorkbook}
            className="px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold inline-flex items-center gap-1.5 cursor-pointer transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Executive Summary (.xlsx)</span>
          </button>

          <button
            onClick={onOpenOnboarding}
            className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Reopen Platform Guide"
            aria-label="Reopen Platform Orientation Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Section 2: "What Needs Attention Today" (Maximum 3 Priority Cards in First Viewport) */}
      <section aria-labelledby="attention-heading" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 id="attention-heading" className="text-base font-bold text-white">
              What Needs Attention Today — {attentionCount} Areas Require Attention
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Ranked by operational and working-capital impact • Maximum 3 executive priority cards
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {snapshot.priorities.slice(0, 3).map((item) => (
            <ExecutivePriorityCard
              key={item.id}
              item={item}
              onInspectDomain={(domain) => handleInspectDomain(domain, `priority_card_${item.id}`)}
              onOpenMethodology={(mId) => {
                trackEvent('metric_methodology_opened', { metricId: mId });
                onOpenMethodology(mId);
              }}
            />
          ))}
        </div>
      </section>

      {/* Section 3: Executive KPI Strip (Maximum 5 Cards in a Single Row) */}
      <section aria-labelledby="kpi-strip-heading" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="kpi-strip-heading" className="text-base font-bold text-white">
            Core Operational Indicators (With Numerators &amp; Denominators)
          </h2>
          <span className="text-xs text-slate-400">
            Click &ldquo;Formula&rdquo; on any indicator to inspect exact calculation rules and data scope
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {snapshot.kpiStrip.slice(0, 5).map((kpi) => (
            <KPIStatusCard
              key={kpi.id}
              kpi={kpi}
              onInspectDomain={(domain) => handleInspectDomain(domain, `kpi_card_${kpi.id}`)}
              onOpenMethodology={(mId) => {
                trackEvent('metric_methodology_opened', { metricId: mId });
                onOpenMethodology(mId);
              }}
            />
          ))}
        </div>
      </section>

      {/* Section 4: Priority Investigation Queue (Exception-First Design) */}
      <section aria-label="Priority Investigation Queue">
        <InvestigationQueue
          rows={snapshot.investigationQueue}
          onInspectDomain={(domain) => handleInspectDomain(domain, 'investigation_queue')}
          onOpenMethodology={(mId) => {
            trackEvent('metric_methodology_opened', { metricId: mId });
            onOpenMethodology(mId);
          }}
          onOpenActionsView={() => onNavigateDomain('actions')}
        />
      </section>

      {/* Section 5: "What Changed?" Trend Section */}
      <section aria-labelledby="trends-heading" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="trends-heading" className="text-base font-bold text-white">
            What Changed? — Multi-Period Operational Trajectory
          </h2>
          <span className="text-xs text-slate-400">
            Includes unit volume context and target reference thresholds
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TrendInsightCard
            title="Customer Promise (Gate OTIF %) — Current Period Snapshot"
            dateRange={snapshot.period.dateRange}
            unit="%"
            targetLabel="95% SLA (60% Min Threshold)"
            targetValue={95}
            status={snapshot.p2DualGate.otifPercent < 60 ? 'Critical' : 'Requires attention'}
            points={[
              {
                label: 'Current',
                value: snapshot.p2DualGate.otifPercent,
                volumeContext: `${snapshot.p2DualGate.passedBoth}/${snapshot.p2DualGate.totalDispatches} POs`,
              },
            ]}
            interpretation={`Historical trends will appear after multiple analysis periods are available. In the current snapshot, Gate OTIF is ${snapshot.p2DualGate.otifPercent}% (${snapshot.p2DualGate.passedBoth} of ${snapshot.p2DualGate.totalDispatches} lines passed).`}
            dataSource="Gate Register + ERP Dispatch Advice"
          />

          <TrendInsightCard
            title="Non-Moving Inventory Exposure (>180 Days Idle)"
            dateRange={snapshot.period.dateRange}
            unit=" L"
            targetLabel="< ₹1.0 L Ceiling"
            targetValue={1.0}
            status="Requires attention"
            points={[
              {
                label: 'Current',
                value: Number((snapshot.p1DeadValue / 100000).toFixed(2)),
                volumeContext: `${snapshot.p1DeadSkuCount} SKUs`,
              },
            ]}
            interpretation={`Historical trends will appear after multiple analysis periods are available. Currently, potentially non-moving stock (>180 days) stands at ${formatINRCompact(snapshot.p1DeadValue)} across ${snapshot.p1DeadSkuCount} SKUs (${snapshot.p1DeadPercent}% of total inventory value).`}
            dataSource="Tally Prime Stock Summary & Item Movement Ledger"
          />
        </div>
      </section>

      {/* Section 6: Rule-Based Executive Brief */}
      <section aria-label="Executive Brief">
        <ExecutiveBrief
          brief={snapshot.executiveBrief}
          onOpenReports={() => onNavigateDomain('executive_reports')}
        />
      </section>

      {/* Section 7: Closed-Loop CAPA Financial Realization Funnel */}
      <section
        data-testid="overview-capa-financial-funnel"
        className="bg-slate-900/95 border border-slate-800 rounded-xl p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">
              Closed-Loop CAPA Financial Realization Funnel — {snapshot.plant.name}
            </h2>
            <p className="text-xs text-slate-400">
              Tracks rupee exposure from audit identification through shop-floor disposition and finance controller sign-off.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateDomain('actions')}
            className="px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
          >
            Open Full CAPA Financial Ledger ({capaSummary.totalCapasCount} Items)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 font-mono tabular-nums">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
            <div className="text-[11px] font-sans text-slate-400">1. Identified Exposure</div>
            <div className="text-lg font-bold text-white mt-1">
              ₹{capaSummary.totalIdentifiedExposureInr.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] font-sans text-slate-500 mt-0.5">
              Across {capaSummary.totalCapasCount} linked P1–P4 records
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
            <div className="text-[11px] font-sans text-sky-400">2. Target Recovery</div>
            <div className="text-lg font-bold text-sky-300 mt-1">
              ₹{capaSummary.totalTargetRecoveryInr.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] font-sans text-slate-500 mt-0.5">
               recoverable cash &amp; debit notes
            </div>
          </div>

          <div className="bg-slate-950 border border-amber-500/30 rounded-lg p-3.5">
            <div className="text-[11px] font-sans text-amber-400">3. Pending Finance Sign-Off</div>
            <div className="text-lg font-bold text-amber-300 mt-1">
              ₹{capaSummary.pendingFinanceSignOffInr.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] font-sans text-slate-500 mt-0.5">
              {capaSummary.byStage.PENDING_FINANCE_SIGN_OFF.count} items awaiting voucher verification
            </div>
          </div>

          <div className="bg-slate-950 border border-emerald-500/30 rounded-lg p-3.5">
            <div className="text-[11px] font-sans text-emerald-400">4. Verified Realized Cash</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">
              ₹{capaSummary.totalRealizedRecoveryInr.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] font-sans text-slate-500 mt-0.5">
              {capaSummary.byStage.VERIFIED_REALIZED.count} closed &amp; controller-verified
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
            <div className="text-[11px] font-sans text-slate-300">Net Realization Rate</div>
            <div className="text-lg font-bold text-white mt-1">
              {capaSummary.realizationRatePct.toFixed(1)}%
            </div>
            <div className="text-[11px] font-sans text-slate-500 mt-0.5">
              Realized vs. Target Recovery
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: 4-Pillar Policy & Threshold Sensitivity Simulator */}
      <FourPillarSensitivitySimulatorPanel
        skus={plantDataset.p1Items}
        p1Rules={plantDataset.p1Rules}
        p2Dispatches={plantDataset.p2Dispatches}
        p2Rules={plantDataset.p2Rules}
        p3FreightTrips={plantDataset.p3Trips}
        p3Rules={plantDataset.p3Rules}
        p4WarehouseBins={plantDataset.p4Bins}
        p4Rules={plantDataset.p4Rules}
      />
    </div>
  );
};
