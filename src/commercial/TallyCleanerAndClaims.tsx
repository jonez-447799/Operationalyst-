import React, { useState } from 'react';

export interface CleanResult {
  headers: string[];
  rows: string[][];
  bannerFooterRowsRemoved: number;
  drCrRupeeNormalized: number;
  confidentialColsStripped: number;
  oemBrandsMasked: number;
  cleanAuditRowsReady: number;
}

const CONFIDENTIAL_COL_REGEX =
  /^(party|vendor|supplier|customer|buyer|gstin|phone|mobile|contact|address|company|vendorname|partyname|buyername|customername)$/i;

const OEM_BRAND_REGEX =
  /\b(Lucas\s+TVS(?:\s+Ltd)?|TVS(?:\s+Logistics|\s+Motor|\s+Motors)?|Maruti\s+Suzuki(?:\s+India)?|Ashok\s+Leyland(?:\s+Unit-\d+)?|Hyundai(?:\s+Motor)?|Mahindra(?:\s+&\s+Mahindra|\s+Auto)?|Tata\s+Motors?|Hero\s+MotoCorp|Bajaj\s+Auto|Bosch(?:\s+India)?|Royal\s+Enfield|Yamaha(?:\s+India)?|Brakes\s+India(?:\s+Ltd)?|Sundram\s+Fasteners)\b/gi;

const MONTH_MAP: Record<string, string> = {
  jan: '01',
  feb: '02',
  mar: '03',
  apr: '04',
  may: '05',
  jun: '06',
  jul: '07',
  aug: '08',
  sep: '09',
  oct: '10',
  nov: '11',
  dec: '12',
};

export function maskOemBrandNames(text: string): { masked: string; count: number } {
  let count = 0;
  const masked = text.replace(OEM_BRAND_REGEX, () => {
    count++;
    return '[OEM-BUYER]';
  });
  return { masked, count };
}

export function normalizeIndianDateCell(rawCell: string): string | null {
  const trimmed = rawCell.trim();
  if (!trimmed) return null;

  const isoMatch = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(trimmed);
  if (isoMatch) {
    const [, yyyy, mm, dd] = isoMatch;
    const m = Number(mm);
    const d = Number(dd);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${yyyy}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
  }

  const dmyAlpha = /^(\d{1,2})[-\s/](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[-\s/](\d{2,4})$/i.exec(
    trimmed
  );
  if (dmyAlpha) {
    const day = Number(dmyAlpha[1]);
    const mon = MONTH_MAP[dmyAlpha[2].toLowerCase()];
    const rawYear = dmyAlpha[3];
    const year = rawYear.length === 2 ? `20${rawYear}` : rawYear;
    if (day >= 1 && day <= 31 && mon) {
      return `${year}-${mon}-${String(day).padStart(2, '0')}`;
    }
  }

  const dmyNum = /^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/.exec(trimmed);
  if (dmyNum) {
    const day = Number(dmyNum[1]);
    const month = Number(dmyNum[2]);
    const rawYear = dmyNum[3];
    const year = rawYear.length === 2 ? `20${rawYear}` : rawYear;
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  return null;
}

export function parseCsvLineRFC(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

export function cleanMessyTallyCsv(rawCsvText: string): CleanResult {
  const lines = rawCsvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !/^-+$/.test(l));
  if (lines.length === 0) {
    return {
      headers: ['Col 1', 'Col 2', 'Col 3', 'Col 4', 'Col 5'],
      rows: [],
      bannerFooterRowsRemoved: 0,
      drCrRupeeNormalized: 0,
      confidentialColsStripped: 0,
      oemBrandsMasked: 0,
      cleanAuditRowsReady: 0,
    };
  }

  const rawRows = lines.map(parseCsvLineRFC);

  let headerIndex = 0;
  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];
    const nonEntries = row.filter((cell) => cell.length > 0);
    const hasHeaderKeywords = row.some((cell) =>
      /item|sku|part|date|voucher|qty|quantity|amount|rate|val|price|particulars|description/i.test(
        cell
      )
    );
    if (nonEntries.length >= 3 && (hasHeaderKeywords || i >= 2)) {
      headerIndex = i;
      break;
    }
  }

  const bannerCount = headerIndex;
  const rawHeader = rawRows[headerIndex] || [];
  const rawDataRows = rawRows.slice(headerIndex + 1);

  let footerCount = 0;
  const validDataRows: string[][] = [];
  for (const row of rawDataRows) {
    const firstCell = (row[0] || '').toLowerCase();
    const joinedRow = row.join(' ').toLowerCase();
    if (
      firstCell.startsWith('total') ||
      firstCell.startsWith('grand total') ||
      joinedRow.includes('grand total')
    ) {
      footerCount++;
      continue;
    }
    if (row.every((cell) => cell === '')) {
      continue;
    }
    validDataRows.push(row);
  }

  const confidentialIndices = new Set<number>();
  rawHeader.forEach((colName, idx) => {
    const cleanName = colName.replace(/[^a-zA-Z]/g, '');
    if (CONFIDENTIAL_COL_REGEX.test(cleanName) || CONFIDENTIAL_COL_REGEX.test(colName.trim())) {
      confidentialIndices.add(idx);
    }
  });

  const confidentialColsStripped = confidentialIndices.size;
  const filteredHeaders = rawHeader.filter((_, idx) => !confidentialIndices.has(idx));

  let drCrRupeeNormalizedCount = 0;
  let oemBrandsMasked = 0;

  const normalizedRows = validDataRows.map((row) => {
    return row
      .filter((_, idx) => !confidentialIndices.has(idx))
      .map((cell) => {
        const originalCell = cell;
        let cleaned = cell;

        // Normalize strict Indian D-before-M date strings
        const normalizedDate = normalizeIndianDateCell(cleaned);
        if (normalizedDate) {
          if (normalizedDate !== cleaned) drCrRupeeNormalizedCount++;
          return normalizedDate;
        }

        // Mask OEM buyer names if embedded in part description
        const { masked, count } = maskOemBrandNames(cleaned);
        if (count > 0) {
          cleaned = masked;
          oemBrandsMasked += count;
        }

        if (/₹|\b(Dr|Cr|Nos|PCS|Pcs|Kg|Mtr|Set)\b/i.test(cleaned)) {
          cleaned = cleaned.replace(/₹/g, '').trim();
          cleaned = cleaned.replace(/\s*\b(Dr|Cr)\b\s*/gi, '').trim();
          cleaned = cleaned.replace(/\s*\b(Nos|PCS|Kg|Mtr|Set)\b\.?\s*/gi, '').trim();
          if (/^-?[\d,]+\.?\d*$/.test(cleaned)) {
            cleaned = cleaned.replace(/,/g, '');
          }
          if (cleaned !== originalCell) {
            drCrRupeeNormalizedCount++;
          }
        } else if (/^-?[\d,]+\.\d+$/.test(cleaned) || /^-?[\d,]+$/.test(cleaned)) {
          const noComma = cleaned.replace(/,/g, '');
          if (noComma !== cleaned) {
            cleaned = noComma;
            drCrRupeeNormalizedCount++;
          }
        }
        return cleaned;
      });
  });

  let finalHeaders = filteredHeaders;
  let finalRows = normalizedRows;

  if (finalHeaders.length > 5) {
    finalHeaders = finalHeaders.slice(0, 5);
    finalRows = finalRows.map((r) => r.slice(0, 5));
  } else {
    while (finalHeaders.length < 5) {
      const nextIdx = finalHeaders.length + 1;
      finalHeaders.push(`Attr ${nextIdx}`);
      finalRows = finalRows.map((r) => {
        const copy = [...r];
        while (copy.length < finalHeaders.length) copy.push('-');
        return copy;
      });
    }
  }

  return {
    headers: finalHeaders,
    rows: finalRows,
    bannerFooterRowsRemoved: bannerCount + footerCount,
    drCrRupeeNormalized: drCrRupeeNormalizedCount,
    confidentialColsStripped,
    oemBrandsMasked,
    cleanAuditRowsReady: finalRows.length,
  };
}

export const SAMPLE_MESSY_TALLY_CSV = `M/S BHARAT AUTO COMPONENTS PVT LTD
Unit 4 Oragadam Industrial Corridor Chennai Tamil Nadu - 600028
Tally Prime Export - Inventory & Debit Note Audit Schedule (01-Apr-2025 to 31-Mar-2026)
Date, Voucher No, Item Description, Vendor Name, GSTIN, Qty, Rate, Amount (INR)
04-Aug-2025, VN-8841, "Bracket, Fuel Pipe Assembly (TVS Spec)", TVS Logistics, 33AAACT9812K1Z5, 180.5 Nos, ₹ 850.00, ₹ 1,53,425.00 Dr
14-Sep-2025, VN-8902, "Brake Disc Rotor Casting, 240mm", Sundram Fasteners, 33AABCS4412J1Z2, 450 PCS, ₹ 1,200.00, ₹ 5,40,000.00 Dr
29-Oct-2025, VN-9104, "Engine Control Bracket — Ashok Leyland", Ashok Leyland Unit-2, 33AABCA1209M1Z9, 320 Nos, ₹ 450.00, ₹ 1,44,000.00 Dr
11-Nov-2025, VN-9411, "Heavy Duty Axle Coupling Flange", Brakes India Ltd, 33AAACB8841P1Z3, 95.25 Kg, ₹ 2,800.00, ₹ 2,66,700.00 Dr
20-Jan-2026, VN-9850, "Transmission Housing Alloy Sleeve", Lucas TVS Ltd, 33AAACL1102Q1Z4, 210 Mtr, ₹ 1,150.00, ₹ 2,41,500.00 Dr
Grand Total, , , , , , , ₹ 13,45,625.00`;

export function TallyCleanerDesk() {
  const [inputText, setInputText] = useState<string>('');
  const [cleanResult, setCleanResult] = useState<CleanResult | null>(null);

  const handleProcess = (text: string) => {
    setInputText(text);
    const res = cleanMessyTallyCsv(text);
    setCleanResult(res);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target?.result as string;
        if (content) {
          handleProcess(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadCsv = () => {
    if (!cleanResult) return;
    const csvContent = [
      cleanResult.headers.join(','),
      ...cleanResult.rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Clean_5Column_Audit_Schedule.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl my-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <span>Messy Tally / Busy Excel Auto-Cleaner Desk</span>
          </h2>
          <p className="text-slate-400 text-sm">
            100% Client-Side Indian ERP Sanitizer (Strips Banners, GSTIN/Party Cols, Masks OEM Brands, Normalizes DD-MM-YYYY &amp; Cr/Dr ₹)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleProcess(SAMPLE_MESSY_TALLY_CSV)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors shadow cursor-pointer"
          >
            Load Sample Messy Tally Sheet
          </button>
          <label className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm rounded-lg cursor-pointer transition-colors border border-slate-600">
            Upload CSV File
            <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      <div className="mb-4">
        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => handleProcess(e.target.value)}
          placeholder="Paste raw Tally Prime / Busy / Marg CSV export content here..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {cleanResult && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60">
              <div className="text-slate-400 text-xs">Banner/Footer Stripped</div>
              <div className="text-xl font-bold text-amber-400">
                {cleanResult.bannerFooterRowsRemoved}
              </div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60">
              <div className="text-slate-400 text-xs">Dates &amp; ₹ Normalized</div>
              <div className="text-xl font-bold text-emerald-400">
                {cleanResult.drCrRupeeNormalized}
              </div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60">
              <div className="text-slate-400 text-xs">Party/GSTIN Cols Stripped</div>
              <div className="text-xl font-bold text-rose-400">
                {cleanResult.confidentialColsStripped}
              </div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60">
              <div className="text-slate-400 text-xs">OEM Brands Masked</div>
              <div className="text-xl font-bold text-sky-400">
                {cleanResult.oemBrandsMasked}
              </div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60">
              <div className="text-slate-400 text-xs">Clean Audit Rows Ready</div>
              <div className="text-xl font-bold text-blue-400">
                {cleanResult.cleanAuditRowsReady}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-700 rounded-lg">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-emerald-400 uppercase font-semibold">
                <tr>
                  {cleanResult.headers.map((h, idx) => (
                    <th key={idx} className="p-2.5 border-b border-slate-700">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {cleanResult.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-750">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2.5 font-mono">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-lg shadow transition-colors flex items-center gap-2 cursor-pointer"
            >
              Download Clean 5-Column Audit CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export interface RtvClaimItem {
  partNumber: string;
  description: string;
  ageDays: number;
  qty: number;
  unitValue: number;
  totalValue: number;
  recommendedAction: string;
}

export interface RtvClaimLetterData {
  plantName: string;
  referenceNo?: string;
  date?: string;
  items: RtvClaimItem[];
  totalRtvRecovery: number;
  totalBomReuse: number;
  totalScrapLiquidation: number;
  totalCashRelease: number;
}

function triggerHtmlFileDownload(htmlContent: string, filename: string): void {
  if (typeof document === 'undefined') return;
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportPrintableRtvClaimLetter(data: RtvClaimLetterData): void {
  const refNo = data.referenceNo || `RTV-${Date.now().toString().slice(-6)}`;
  const docDate = data.date || new Date().toLocaleDateString('en-IN');
  const formatINR = (val: number) => `₹ ${val.toLocaleString('en-IN')}`;

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>RTV &amp; Scrap Claim Letter - ${refNo}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; line-height: 1.5; margin: 0; padding: 20px; }
    .header { border-bottom: 3px solid #0f766e; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 20px; font-weight: bold; color: #0f766e; text-transform: uppercase; }
    .subtitle { font-size: 13px; color: #64748b; }
    .print-btn { background: #0f766e; color: white; border: none; padding: 8px 14px; border-radius: 6px; font-weight: 600; cursor: pointer; }
    .meta-grid { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
    .kpi-card { background: #f1f5f9; padding: 10px; border-radius: 6px; text-align: center; border: 1px solid #cbd5e1; }
    .kpi-title { font-size: 11px; color: #475569; text-transform: uppercase; font-weight: 600; }
    .kpi-val { font-size: 15px; font-weight: bold; color: #0f766e; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 25px; }
    th { background: #0f766e; color: white; padding: 8px; text-align: left; }
    td { border-bottom: 1px solid #e2e8f0; padding: 8px; }
    .sign-section { margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; }
    .sign-box { border-top: 1.5px dashed #64748b; width: 28%; text-align: center; padding-top: 8px; font-weight: 600; color: #334155; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">Official Return-to-Vendor (RTV) &amp; Scrap Authorization Schedule</div>
      <div class="subtitle">Engine P1 Stagnant &gt;180-Day Working Capital Recovery Protocol</div>
    </div>
    <button type="button" class="print-btn no-print" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="meta-grid">
    <div><strong>Plant Location:</strong> ${data.plantName}</div>
    <div><strong>Doc Reference:</strong> ${refNo}</div>
    <div><strong>Date:</strong> ${docDate}</div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-title">RTV Credit Recovery</div>
      <div class="kpi-val">${formatINR(data.totalRtvRecovery)}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">BOM Internal Reuse</div>
      <div class="kpi-val">${formatINR(data.totalBomReuse)}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Scrap Liquidation</div>
      <div class="kpi-val">${formatINR(data.totalScrapLiquidation)}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Total Cash Release</div>
      <div class="kpi-val">${formatINR(data.totalCashRelease)}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Part Number</th>
        <th>Description</th>
        <th>Age (Days)</th>
        <th>Qty</th>
        <th>Unit Val (₹)</th>
        <th>Total Val (₹)</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      ${data.items
        .map(
          (item) => `
        <tr>
          <td><strong>${item.partNumber}</strong></td>
          <td>${item.description}</td>
          <td>${item.ageDays}d</td>
          <td>${item.qty}</td>
          <td>₹ ${item.unitValue.toLocaleString('en-IN')}</td>
          <td>₹ ${item.totalValue.toLocaleString('en-IN')}</td>
          <td><strong>${item.recommendedAction}</strong></td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="sign-section">
    <div class="sign-box">Store Manager</div>
    <div class="sign-box">Plant Head</div>
    <div class="sign-box">CFO / Statutory Auditor</div>
  </div>
</body>
</html>`;

  triggerHtmlFileDownload(htmlContent, `RTV_Claim_Letter_${refNo}.html`);
}

export interface TransporterDiscrepancy {
  lrNumber: string;
  route: string;
  rateOvercharge: number;
  detentionClaim: number;
  netDebit: number;
  status: string;
}

export interface TransporterDebitNoteData {
  transporterName?: string;
  voucherNo?: string;
  date?: string;
  plantName?: string;
  discrepancies: TransporterDiscrepancy[];
  totalRateOvercharge: number;
  totalDetentionClaim: number;
  totalNetDebit: number;
}

export function exportPrintableTransporterDebitNote(data: TransporterDebitNoteData): void {
  const voucherNo = data.voucherNo || `DN-LOG-${Date.now().toString().slice(-6)}`;
  const docDate = data.date || new Date().toLocaleDateString('en-IN');
  const transporter = data.transporterName || 'All Logistics Partners';
  const plant = data.plantName || 'Plant Unit-1';
  const formatINR = (val: number) => `₹ ${val.toLocaleString('en-IN')}`;

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Transporter Debit Note Voucher - ${voucherNo}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; line-height: 1.5; margin: 0; padding: 20px; }
    .header { border-bottom: 3px solid #b91c1c; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 20px; font-weight: bold; color: #b91c1c; text-transform: uppercase; }
    .subtitle { font-size: 13px; color: #64748b; }
    .print-btn { background: #b91c1c; color: white; border: none; padding: 8px 14px; border-radius: 6px; font-weight: 600; cursor: pointer; }
    .meta-grid { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; background: #fef2f2; padding: 12px; border-radius: 6px; border: 1px solid #fecaca; }
    .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
    .kpi-card { background: #f8fafc; padding: 12px; border-radius: 6px; text-align: center; border: 1px solid #cbd5e1; }
    .kpi-title { font-size: 11px; color: #475569; text-transform: uppercase; font-weight: 600; }
    .kpi-val { font-size: 16px; font-weight: bold; color: #b91c1c; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 25px; }
    th { background: #b91c1c; color: white; padding: 8px; text-align: left; }
    td { border-bottom: 1px solid #e2e8f0; padding: 8px; }
    .sign-section { margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; }
    .sign-box { border-top: 1.5px dashed #64748b; width: 28%; text-align: center; padding-top: 8px; font-weight: 600; color: #334155; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">Official Transporter Freight &amp; Detention Debit Note Voucher</div>
      <div class="subtitle">Engine P3 Logistics Freight Leakage &amp; Gate Detention Recovery Protocol</div>
    </div>
    <button type="button" class="print-btn no-print" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="meta-grid">
    <div><strong>Voucher No:</strong> ${voucherNo}</div>
    <div><strong>Transporter / Vendor:</strong> ${transporter}</div>
    <div><strong>Plant Location:</strong> ${plant}</div>
    <div><strong>Date:</strong> ${docDate}</div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-title">Contract Rate Overcharges</div>
      <div class="kpi-val">${formatINR(data.totalRateOvercharge)}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">&gt;6h Gate Detention Claims</div>
      <div class="kpi-val">${formatINR(data.totalDetentionClaim)}</div>
    </div>
    <div class="kpi-card" style="background: #fef2f2; border-color: #fca5a5;">
      <div class="kpi-title" style="color: #991b1b;">Total Net Deductible Debit Claim</div>
      <div class="kpi-val" style="color: #991b1b; font-size: 18px;">${formatINR(data.totalNetDebit)}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>LR Number</th>
        <th>Route / Destination</th>
        <th>Contract Rate Overcharge (₹)</th>
        <th>Gate Detention Claim (₹)</th>
        <th>Net Deductible Debit (₹)</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${data.discrepancies
        .map(
          (item) => `
        <tr>
          <td><strong>${item.lrNumber}</strong></td>
          <td>${item.route}</td>
          <td>₹ ${item.rateOvercharge.toLocaleString('en-IN')}</td>
          <td>₹ ${item.detentionClaim.toLocaleString('en-IN')}</td>
          <td><strong>₹ ${item.netDebit.toLocaleString('en-IN')}</strong></td>
          <td><span style="color: #b91c1c; font-weight: bold;">${item.status}</span></td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="sign-section">
    <div class="sign-box">Accounts Payable</div>
    <div class="sign-box">Logistics Head</div>
    <div class="sign-box">CFO Authorization</div>
  </div>
</body>
</html>`;

  triggerHtmlFileDownload(htmlContent, `Transporter_Debit_Note_${voucherNo}.html`);
}

