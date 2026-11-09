/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { AMBATTUR_FABRICATION_SAMPLE, DEFAULT_RULES } from '../project1/data/initialData';
import { evaluateStockEngine } from '../project1/utils/calculations';
import type { StockItem } from '../project1/types';
import { downloadAuditTemplate } from '../utils/pilotDataKitExporter';
import { trackEvent } from '../utils/analytics';

export interface InstantCsvAuditRow {
  partId: string;
  partDescription: string;
  closingStockQty: number;
  unitCostInr: number;
  lastMovementDate: string;
  totalValueInr: number;
  daysIdle: number;
  bucket: 'NON_MOVING_180D' | 'SLOW_MOVING_90_179D' | 'ACTIVE_UNDER_90D';
}

export interface InstantCsvAuditSummary {
  totalSkus: number;
  totalValuationInr: number;
  totalValuationFormatted: string;
  nonMovingValueInr: number;
  nonMovingFormatted: string;
  nonMovingSkuCount: number;
  nonMovingSharePct: number;
  slowMovingValueInr: number;
  slowMovingFormatted: string;
  slowMovingSkuCount: number;
  slowMovingSharePct: number;
  prioritySkuCount: number;
  carryingCostPct: number;
  annualCarryingBurnInr: number;
  annualCarryingBurnFormatted: string;
  rows: InstantCsvAuditRow[];
  topNonMovingRows: InstantCsvAuditRow[];
}

/**
 * Generates the canonical 20-SKU Ambattur 5-Column CSV string directly from AMBATTUR_FABRICATION_SAMPLE.
 */
export function buildAmbattur20SkuSampleCsv(): string {
  const header = 'Part_ID,Part_Description,Closing_Stock_Qty,Unit_Cost_INR,Last_Movement_Date';
  const lines = AMBATTUR_FABRICATION_SAMPLE.map(
    (item) =>
      `${item.itemCode},"${item.itemName.replace(/"/g, '""')}",${item.qtyOnHand},${item.costRate},${item.lastMovement}`
  );
  return [header, ...lines].join('\n');
}

export const AMBATTUR_20_SKU_SAMPLE_CSV = buildAmbattur20SkuSampleCsv();

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

/**
 * Pure, deterministic 5-column CSV parser & evaluator (100% local in-browser).
 * Uses canonical P1 evaluateStockEngine so all Ambattur 20-SKU totals match 100%.
 */
export function parseAndEvaluateFiveColumnCsv(
  csvText: string,
  asOfDate: string = DEFAULT_RULES.asOfDate
): InstantCsvAuditSummary {
  const rawLines = (csvText || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'));

  if (rawLines.length === 0) {
    return {
      totalSkus: 0,
      totalValuationInr: 0,
      totalValuationFormatted: '₹0',
      nonMovingValueInr: 0,
      nonMovingFormatted: '₹0',
      nonMovingSkuCount: 0,
      nonMovingSharePct: 0,
      slowMovingValueInr: 0,
      slowMovingFormatted: '₹0',
      slowMovingSkuCount: 0,
      slowMovingSharePct: 0,
      prioritySkuCount: 0,
      carryingCostPct: 22,
      annualCarryingBurnInr: 0,
      annualCarryingBurnFormatted: '₹0',
      rows: [],
      topNonMovingRows: [],
    };
  }

  const headerCells = splitCsvLine(rawLines[0]).map((h) =>
    h.toLowerCase().replace(/[^a-z0-9]/g, '')
  );

  // Detect whether first line is a header row
  const hasHeader =
    headerCells.some((h) =>
      ['partid', 'itemcode', 'sku', 'partno', 'matnr', 'stockitemcode'].includes(h)
    ) ||
    headerCells.some((h) =>
      ['closingstockqty', 'qty', 'closingbalance', 'closingqty', 'quantity'].includes(h)
    );

  const findColIdx = (candidates: string[], fallbackIdx: number): number => {
    if (!hasHeader) return fallbackIdx;
    const idx = headerCells.findIndex((h) => candidates.includes(h));
    return idx >= 0 ? idx : fallbackIdx;
  };

  const partIdIdx = findColIdx(
    ['partid', 'itemcode', 'sku', 'partno', 'matnr', 'stockitemcode'],
    0
  );
  const descIdx = findColIdx(
    ['partdescription', 'description', 'stockitemname', 'materialdescription', 'particulars', 'itemname'],
    1
  );
  const qtyIdx = findColIdx(
    ['closingstockqty', 'qty', 'closingbalance', 'closingqty', 'labst', 'quantity', 'qtyonhand'],
    2
  );
  const costIdx = findColIdx(
    ['unitcostinr', 'rate', 'unitprice', 'standardprice', 'verpr', 'cost', 'costrate'],
    3
  );
  const dateIdx = findColIdx(
    ['lastmovementdate', 'lastissue', 'lasttxn', 'lastused', 'budat', 'lastmovement'],
    4
  );

  const dataLines = hasHeader ? rawLines.slice(1) : rawLines;
  const stockItems: StockItem[] = [];

  dataLines.forEach((line, index) => {
    const cols = splitCsvLine(line);
    if (cols.length < 3) return;
    const partId = (cols[partIdIdx] || `SKU-${index + 1}`).trim();
    const partDescription = (cols[descIdx] || partId).trim();
    const rawQty = Number(String(cols[qtyIdx] || '0').replace(/[^0-9.-]/g, ''));
    const rawCost = Number(String(cols[costIdx] || '0').replace(/[^0-9.-]/g, ''));
    const lastMovement = (cols[dateIdx] || '2026-01-01').trim();

    if (!Number.isFinite(rawQty) || !Number.isFinite(rawCost) || rawQty < 0 || rawCost < 0) {
      return;
    }

    stockItems.push({
      id: `csv-sku-${index + 1}`,
      itemCode: partId,
      itemName: partDescription,
      category: 'Raw Material',
      qtyOnHand: rawQty,
      costRate: rawCost,
      lastMovement,
    });
  });

  const evaluated = evaluateStockEngine(stockItems, {
    ...DEFAULT_RULES,
    asOfDate,
    holdingCostPercent: 22,
  });

  let totalValuationInr = 0;
  let nonMovingValueInr = 0;
  let nonMovingSkuCount = 0;
  let slowMovingValueInr = 0;
  let slowMovingSkuCount = 0;

  const rows: InstantCsvAuditRow[] = evaluated.map((item) => {
    const val = Math.round(item.closingValue ?? item.qtyOnHand * item.costRate);
    const days = item.daysIdle ?? 0;
    totalValuationInr += val;

    let bucket: InstantCsvAuditRow['bucket'] = 'ACTIVE_UNDER_90D';
    if (days >= 180) {
      bucket = 'NON_MOVING_180D';
      nonMovingValueInr += val;
      nonMovingSkuCount++;
    } else if (days >= 90) {
      bucket = 'SLOW_MOVING_90_179D';
      slowMovingValueInr += val;
      slowMovingSkuCount++;
    }

    return {
      partId: item.itemCode,
      partDescription: item.itemName,
      closingStockQty: item.qtyOnHand,
      unitCostInr: item.costRate,
      lastMovementDate: item.lastMovement,
      totalValueInr: val,
      daysIdle: days,
      bucket,
    };
  });

  const prioritySkuCount = nonMovingSkuCount + slowMovingSkuCount;
  const carryingCostPct = 22;
  const annualCarryingBurnInr = Math.round(nonMovingValueInr * (carryingCostPct / 100));
  const nonMovingSharePct =
    totalValuationInr > 0 ? Math.round((nonMovingValueInr / totalValuationInr) * 1000) / 10 : 0;
  const slowMovingSharePct =
    totalValuationInr > 0 ? Math.round((slowMovingValueInr / totalValuationInr) * 1000) / 10 : 0;

  const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

  const topNonMovingRows = rows
    .filter((r) => r.bucket === 'NON_MOVING_180D')
    .sort((a, b) => b.totalValueInr - a.totalValueInr)
    .slice(0, 5);

  return {
    totalSkus: rows.length,
    totalValuationInr,
    totalValuationFormatted: formatINR(totalValuationInr),
    nonMovingValueInr,
    nonMovingFormatted: formatINR(nonMovingValueInr),
    nonMovingSkuCount,
    nonMovingSharePct,
    slowMovingValueInr,
    slowMovingFormatted: formatINR(slowMovingValueInr),
    slowMovingSkuCount,
    slowMovingSharePct,
    prioritySkuCount,
    carryingCostPct,
    annualCarryingBurnInr,
    annualCarryingBurnFormatted: formatINR(annualCarryingBurnInr),
    rows,
    topNonMovingRows,
  };
}

interface InstantAuditDropzoneProps {
  onOpenRequestAuditModal: () => void;
}

export const InstantAuditDropzone: React.FC<InstantAuditDropzoneProps> = ({
  onOpenRequestAuditModal,
}) => {
  const [auditResult, setAuditResult] = useState<InstantCsvAuditSummary | null>(null);
  const [activeSourceName, setActiveSourceName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLoadSampleCsv = () => {
    trackEvent('import_started', { source: 'instant_dropzone_sample_20sku' });
    const summary = parseAndEvaluateFiveColumnCsv(AMBATTUR_20_SKU_SAMPLE_CSV);
    setAuditResult(summary);
    setActiveSourceName('Ambattur_20_SKU_Sample_Export.csv (20 SKUs)');
  };

  const handleFileText = (text: string, fileName: string) => {
    trackEvent('import_validation_completed', { source: 'instant_dropzone_upload' });
    const summary = parseAndEvaluateFiveColumnCsv(text);
    setAuditResult(summary);
    setActiveSourceName(fileName);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleFileText(String(reader.result || ''), file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleFileText(String(reader.result || ''), file.name);
    };
    reader.readAsText(file);
  };

  return (
    <section
      data-testid="instant-audit-dropzone"
      className="py-10 bg-slate-900 text-white border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Header & Value Prop */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Instant In-Browser 5-Column CSV Audit Sandbox (100% Local Browser Processing)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Test the 5-Column Stock Aging Engine Right Now — Zero Sign-Up Required
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Drop a 5-column CSV (<code className="text-blue-300 font-mono">Part_ID, Part_Description, Closing_Stock_Qty, Unit_Cost_INR, Last_Movement_Date</code>) or load the 20-SKU Ambattur sample to calculate Non-Moving (&gt;180d) exposure and 22% Annual Carrying Burn in milliseconds.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                data-testid="instant-dropzone-load-sample-btn"
                onClick={handleLoadSampleCsv}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-sm transition cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Load 20-SKU Ambattur Sample CSV</span>
              </button>

              <button
                type="button"
                data-testid="instant-dropzone-download-template-btn"
                onClick={() => downloadAuditTemplate('instant_dropzone')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Blank 5-Column CSV Template</span>
              </button>
            </div>
          </div>

          {/* Drag-and-Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
              isDragging
                ? 'border-blue-400 bg-blue-950/30'
                : 'border-slate-700 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-900'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              data-testid="instant-dropzone-file-input"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-white">
                Drop your 5-column Tally Prime, SAP, Busy, or Excel <code className="text-blue-300">.csv</code> export here, or <span className="text-blue-400 underline">browse file</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% local browser execution — your file is parsed in memory and never uploaded automatically.</span>
              </div>
            </div>
          </div>

          {/* Instant Computed Results */}
          {auditResult && (
            <div
              data-testid="instant-dropzone-results"
              className="bg-slate-900 border border-blue-500/40 rounded-xl p-5 space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">
                    Instant Audit Computed: {activeSourceName} ({auditResult.totalSkus} SKUs Evaluated)
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded">
                  P1 Engine Verified · 22% Annual Carrying Rate
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <div className="text-[11px] font-semibold text-slate-400">1. Total Valuation</div>
                  <div
                    data-testid="instant-dropzone-total-valuation"
                    className="text-xl font-mono font-bold text-white mt-1"
                  >
                    {auditResult.totalValuationFormatted}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Across {auditResult.totalSkus} audited SKUs
                  </div>
                </div>

                <div className="bg-slate-950 border border-l-4 border-l-rose-500 border-slate-800 rounded-xl p-3.5">
                  <div className="text-[11px] font-semibold text-rose-300">
                    2. Non-Moving (&gt;180d)
                  </div>
                  <div
                    data-testid="instant-dropzone-nonmoving-value"
                    className="text-xl font-mono font-bold text-rose-400 mt-1"
                  >
                    {auditResult.nonMovingFormatted}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    {auditResult.nonMovingSkuCount} SKUs · {auditResult.nonMovingSharePct}% of stock
                  </div>
                </div>

                <div className="bg-slate-950 border border-l-4 border-l-amber-500 border-slate-800 rounded-xl p-3.5">
                  <div className="text-[11px] font-semibold text-amber-300">
                    3. Slow-Moving (90–179d)
                  </div>
                  <div
                    data-testid="instant-dropzone-slowmoving-value"
                    className="text-xl font-mono font-bold text-amber-300 mt-1"
                  >
                    {auditResult.slowMovingFormatted}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    {auditResult.slowMovingSkuCount} SKUs · {auditResult.slowMovingSharePct}% of stock
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <div className="text-[11px] font-semibold text-blue-300">4. Priority SKUs</div>
                  <div
                    data-testid="instant-dropzone-priority-skus"
                    className="text-xl font-mono font-bold text-white mt-1"
                  >
                    {auditResult.prioritySkuCount} Priority SKUs
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Flagged for floor disposition review
                  </div>
                </div>

                <div className="bg-slate-950 border border-l-4 border-l-sky-500 border-slate-800 rounded-xl p-3.5">
                  <div className="text-[11px] font-semibold text-sky-300">
                    5. 22% Annual Carrying Burn
                  </div>
                  <div
                    data-testid="instant-dropzone-carrying-burn"
                    className="text-xl font-mono font-bold text-sky-300 mt-1"
                  >
                    {auditResult.annualCarryingBurnFormatted}/yr
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Estimated capital &amp; storage drain
                  </div>
                </div>
              </div>

              {/* Top Non-Moving SKUs Table & Conversion CTA */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-2 border-t border-slate-800">
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Top non-moving exposure:{' '}
                    {auditResult.topNonMovingRows
                      .slice(0, 3)
                      .map(
                        (r) =>
                          `${r.partId} (₹${r.totalValueInr.toLocaleString('en-IN')} · ${r.daysIdle}d idle)`
                      )
                      .join(', ')}
                  </span>
                </div>

                <button
                  type="button"
                  data-testid="instant-dropzone-request-audit-btn"
                  onClick={() => {
                    trackEvent('hero_primary_cta_clicked', { source: 'instant_dropzone_results' });
                    onOpenRequestAuditModal();
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer shrink-0"
                >
                  <span>Get Full 48-Hour Verified Audit &amp; PDF Brief →</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
