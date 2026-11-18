import React, { useState } from 'react';

export interface CleanResult {
  headers: string[];
  rows: string[][];
  bannerFooterRowsRemoved: number;
  drCrRupeeNormalized: boolean;
  confidentialColsStripped: boolean;
  cleanAuditRowsReady: number;
  asOfDate?: string;
  negativeStockCount?: number;
  zeroRateJobWorkCount?: number;
  oemRedactedCount?: number;
}

const CONFIDENTIAL_COL_PATTERNS = [
  /margin/i, /markup/i, /cost\s*price/i, /profit/i, /discount/i, /secret/i
];

const OEM_PATTERNS = [
  /\bTVS\b/i, /\bAshok\s+Leyland\b/i, /\bLeyland\b/i, /\bHyundai\b/i,
  /\bMahindra\b/i, /\bTata\b/i, /\bBosch\b/i, /\bRoyal\s+Enfield\b/i,
  /\bYamaha\b/i, /\bMaruti\b/i, /\bBajaj\b/i, /\bHero\b/i
];

function parseQuotedCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

const MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

export function parseStrictIndianDate(dateStr: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const s = dateStr.trim();
  
  const isoMatch = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10) - 1;
    const d = parseInt(isoMatch[3], 10);
    const dt = new Date(y, m, d);
    if (!isNaN(dt.getTime())) return dt;
  }

  const dMmmMatch = s.match(/^(\d{1,2})[-/]([A-Za-z]{3})[-/](\d{2,4})$/);
  if (dMmmMatch) {
    const d = parseInt(dMmmMatch[1], 10);
    const mStr = dMmmMatch[2].toLowerCase();
    let y = parseInt(dMmmMatch[3], 10);
    if (y < 100) y += 2000;
    if (MONTH_MAP[mStr] !== undefined) {
      const dt = new Date(y, MONTH_MAP[mStr], d);
      if (!isNaN(dt.getTime())) return dt;
    }
  }

  const ddmmyyyyMatch = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/);
  if (ddmmyyyyMatch) {
    const d = parseInt(ddmmyyyyMatch[1], 10);
    const m = parseInt(ddmmyyyyMatch[2], 10) - 1;
    let y = parseInt(ddmmyyyyMatch[3], 10);
    if (y < 100) y += 2000;
    const dt = new Date(y, m, d);
    if (!isNaN(dt.getTime())) return dt;
  }

  return null;
}

export function maskOemBrand(str: string): { text: string; redacted: boolean } {
  let text = str;
  let redacted = false;
  for (const pattern of OEM_PATTERNS) {
    if (pattern.test(text)) {
      text = text.replace(pattern, '[OEM-REDACTED]');
      redacted = true;
    }
  }
  return { text, redacted };
}

export function cleanMessyTallyCsv(rawCsvText: string): CleanResult {
  const lines = rawCsvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) {
    return {
      headers: ['Col 1'],
      rows: [],
      bannerFooterRowsRemoved: 0,
      drCrRupeeNormalized: false,
      confidentialColsStripped: false,
      cleanAuditRowsReady: 0,
      asOfDate: undefined,
      negativeStockCount: 0,
      zeroRateJobWorkCount: 0,
      oemRedactedCount: 0
    };
  }

  let rawRows = lines.map(parseQuotedCsvLine);
  let bannerFooterRemoved = 0;

  const filteredRows = rawRows.filter(row => {
    const rowStr = row.join(' ').toLowerCase();
    if (rowStr.includes('tally.erp') || rowStr.includes('tally prime') || rowStr.includes('page ') || rowStr.includes('total:')) {
      bannerFooterRemoved++;
      return false;
    }
    return true;
  });

  const effectiveRows = filteredRows.length > 0 ? filteredRows : rawRows;
  let headers = effectiveRows[0];
  let dataRows = effectiveRows.slice(1);

  let drCrNormalized = false;
  dataRows = dataRows.map(row => row.map(cell => {
    let clean = cell.replace(/₹/g, '').trim();
    if (/\b\d+(\.\d+)?\s*(Dr|Cr)\b/i.test(clean)) {
      drCrNormalized = true;
      if (/Cr\b/i.test(clean)) {
        clean = '-' + clean.replace(/Cr\b/i, '').trim();
      } else {
        clean = clean.replace(/Dr\b/i, '').trim();
      }
    }
    return clean;
  }));

  let confidentialStripped = false;
  const keepIndices: number[] = [];
  headers.forEach((h, idx) => {
    if (CONFIDENTIAL_COL_PATTERNS.some(p => p.test(h))) {
      confidentialStripped = true;
    } else {
      keepIndices.push(idx);
    }
  });

  const cleanHeaders = keepIndices.map(i => headers[i]);
  let cleanRows = dataRows.map(row => keepIndices.map(i => row[i] || ''));

  let qtyColIdx = -1;
  let rateColIdx = -1;
  let totalValColIdx = -1;
  let dateColIdx = -1;

  cleanHeaders.forEach((h, idx) => {
    const lower = h.toLowerCase();
    if (lower.includes('qty') || lower.includes('quantity')) qtyColIdx = idx;
    else if (lower.includes('rate') || lower.includes('unit price')) rateColIdx = idx;
    else if (lower.includes('total') || lower.includes('closing value') || lower.includes('value')) totalValColIdx = idx;
    else if (lower.includes('date') || lower.includes('voucher date')) dateColIdx = idx;
  });

  let maxDate: Date | null = null;
  if (dateColIdx !== -1) {
    cleanRows.forEach(row => {
      const dt = parseStrictIndianDate(row[dateColIdx]);
      if (dt && (!maxDate || dt > maxDate)) {
        maxDate = dt;
      }
    });
  }

  let negativeStockCount = 0;
  let zeroRateJobWorkCount = 0;
  let oemRedactedCount = 0;

  cleanRows = cleanRows.map(row => {
    row = row.map(cell => {
      const res = maskOemBrand(cell);
      if (res.redacted) oemRedactedCount++;
      return res.text;
    });

    if (qtyColIdx !== -1) {
      const qtyVal = parseFloat(row[qtyColIdx]);
      if (!isNaN(qtyVal)) {
        if (qtyVal < 0) negativeStockCount++;
        if (qtyVal > 0 && rateColIdx !== -1) {
          const rateVal = parseFloat(row[rateColIdx]);
          if (isNaN(rateVal) || rateVal === 0) zeroRateJobWorkCount++;
        }
      }
    }

    if (qtyColIdx !== -1 && rateColIdx !== -1 && totalValColIdx === -1) {
      const qty = parseFloat(row[qtyColIdx]);
      const rateOrTotal = parseFloat(row[rateColIdx]);
      if (!isNaN(qty) && qty > 0 && !isNaN(rateOrTotal) && rateOrTotal > 100 * qty) {
        row[rateColIdx] = (rateOrTotal / qty).toFixed(2);
      }
    }

    return row;
  });

  const asOfDateStr = maxDate ? maxDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  return {
    headers: cleanHeaders,
    rows: cleanRows,
    bannerFooterRowsRemoved: bannerFooterRemoved,
    drCrRupeeNormalized: drCrNormalized,
    confidentialColsStripped: confidentialStripped,
    cleanAuditRowsReady: cleanRows.length,
    asOfDate: asOfDateStr,
    negativeStockCount,
    zeroRateJobWorkCount,
    oemRedactedCount
  };
}

const MSME_HEADER_HTML = `
  <div style="border: 2px solid #0f172a; padding: 16px; margin-bottom: 20px; font-family: sans-serif;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 12px; margin-bottom: 12px;">
      <div>
        <h2 style="margin: 0; color: #0f172a; font-size: 20px;">SNOWIN VENTURES</h2>
        <p style="margin: 4px 0 0 0; color: #475569; font-size: 13px;">MSME Bill of Supply (0% GST Exempt) | UDYAM-TN-02-0444630</p>
        <p style="margin: 2px 0 0 0; color: #475569; font-size: 13px;">SAC: 998311 - Operational & Margin Inventory Audit</p>
      </div>
      <div style="text-align: right;">
        <span style="background: #e2e8f0; color: #0f172a; padding: 4px 8px; font-weight: bold; font-size: 12px; border-radius: 4px;">OFFICIAL AUDIT CLAIM</span>
      </div>
    </div>
`;

function triggerPrintOrDownloadFallback(htmlContent: string, fileName: string): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      try {
        printWindow.print();
      } catch {
      }
    }, 500);
  } else {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export function exportPrintableRtvClaimLetter(claimDetails: {
  vendorName: string;
  claimAmount: number;
  itemDescription: string;
  rtvVoucherNo: string;
  date: string;
}): void {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>RTV Claim Letter - ${claimDetails.vendorName}</title>
      <style>
        body { font-family: sans-serif; padding: 24px; color: #1e293b; max-width: 800px; margin: 0 auto; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
        th { background-color: #f1f5f9; }
      </style>
    </head>
    <body>
      ${MSME_HEADER_HTML}
      <h3>RETURN-TO-VENDOR (RTV) OFFICIAL CLAIM DEBIT NOTE</h3>
      <p><strong>Date:</strong> ${claimDetails.date}</p>
      <p><strong>Vendor Name:</strong> ${claimDetails.vendorName}</p>
      <p><strong>RTV Voucher Reference:</strong> ${claimDetails.rtvVoucherNo}</p>
      
      <table>
        <thead>
          <tr>
            <th>Item Description</th>
            <th>Quarantine / Rejection Reason</th>
            <th>Claim Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${claimDetails.itemDescription}</td>
            <td>Quality Rejection / Non-Conforming Material RTV</td>
            <td>₹${claimDetails.claimAmount.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>
      
      <p style="margin-top: 24px;">This claim is issued under statutory MSME inventory audit provisions. Billed by SNOWIN VENTURES (UDYAM-TN-02-0444630, SAC 998311).</p>
      
      <div style="margin-top: 40px; display: flex; justify-content: space-between;">
        <div>
          <p>Prepared By:<br/><strong>Operationalyst Audit Engine</strong></p>
        </div>
        <div style="text-align: right;">
          <p>Executive Approval:<br/><strong>C. Jones Snowin</strong><br/>Founder & Principal Auditor</p>
        </div>
      </div>
      </div>
    </body>
    </html>
  `;
  triggerPrintOrDownloadFallback(html, `RTV_Claim_${claimDetails.rtvVoucherNo}.html`);
}

export function exportPrintableTransporterDebitNote(debitDetails: {
  transporterName: string;
  lrNumber: string;
  claimAmount: number;
  damageDescription: string;
  date: string;
}): void {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Transporter Debit Note - ${debitDetails.transporterName}</title>
      <style>
        body { font-family: sans-serif; padding: 24px; color: #1e293b; max-width: 800px; margin: 0 auto; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
        th { background-color: #f1f5f9; }
      </style>
    </head>
    <body>
      ${MSME_HEADER_HTML}
      <h3>TRANSPORTER SHORTAGE & DAMAGE DEBIT NOTE</h3>
      <p><strong>Date:</strong> ${debitDetails.date}</p>
      <p><strong>Transporter Name:</strong> ${debitDetails.transporterName}</p>
      <p><strong>Lorry Receipt (LR) No:</strong> ${debitDetails.lrNumber}</p>
      
      <table>
        <thead>
          <tr>
            <th>Transit Incident Description</th>
            <th>Recovery Category</th>
            <th>Debit Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${debitDetails.damageDescription}</td>
            <td>Transit Shortage / Damage Recovery</td>
            <td>₹${debitDetails.claimAmount.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>
      
      <p style="margin-top: 24px;">This debit note is issued for direct deduction against pending logistics freight bills. SNOWIN VENTURES MSME Bill of Supply (UDYAM-TN-02-0444630, SAC 998311).</p>
      
      <div style="margin-top: 40px; display: flex; justify-content: space-between;">
        <div>
          <p>Issued By:<br/><strong>Logistics Recovery Desk</strong></p>
        </div>
        <div style="text-align: right;">
          <p>Executive Approval:<br/><strong>C. Jones Snowin</strong><br/>Founder & Principal Auditor</p>
        </div>
      </div>
      </div>
    </body>
    </html>
  `;
  triggerPrintOrDownloadFallback(html, `Transporter_Debit_Note_${debitDetails.lrNumber}.html`);
}

export const TallyCleanerDesk: React.FC = () => {
  const [rawCsv, setRawCsv] = useState<string>('');
  const [cleanedResult, setCleanedResult] = useState<CleanResult | null>(null);

  const handleClean = () => {
    if (!rawCsv.trim()) return;
    const res = cleanMessyTallyCsv(rawCsv);
    setCleanedResult(res);
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ background: '#0f172a', color: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '22px' }}>Tally CSV Cleaner & Recovery Claim Desk</h2>
        <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
          Strict Indian Date Parsing, 100x Unit Rate Valuation Guard, OEM Redaction, and MSME 0% GST Claim Generation
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
          Paste Raw Tally CSV Export:
        </label>
        <textarea
          rows={8}
          value={rawCsv}
          onChange={e => setRawCsv(e.target.value)}
          placeholder="Paste raw CSV content here..."
          style={{ width: '100%', padding: '12px', fontFamily: 'monospace', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />
      </div>

      <button
        onClick={handleClean}
        style={{
          background: '#2563eb',
          color: '#fff',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '24px'
        }}
      >
        Run Automated Audit Sanitation
      </button>

      {cleanedResult && (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', background: '#f8fafc' }}>
          <h3 style={{ marginTop: 0, color: '#0f172a' }}>Audit Sanitation Scorecard</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>AsOfDate (Max Closing)</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{cleanedResult.asOfDate || 'N/A'}</div>
            </div>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Negative Stock Items</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: cleanedResult.negativeStockCount ? '#dc2626' : '#16a34a' }}>
                {cleanedResult.negativeStockCount || 0}
              </div>
            </div>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>₹0 Job-Work Items</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d97706' }}>
                {cleanedResult.zeroRateJobWorkCount || 0}
              </div>
            </div>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>OEM Masked Instances</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>
                {cleanedResult.oemRedactedCount || 0}
              </div>
            </div>
          </div>

          <h4>Sample Cleaned Data ({cleanedResult.cleanAuditRowsReady} rows ready)</h4>
          <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  {cleanedResult.headers.map((h, i) => (
                    <th key={i} style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cleanedResult.rows.slice(0, 5).map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ border: '1px solid #cbd5e1', padding: '8px' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
