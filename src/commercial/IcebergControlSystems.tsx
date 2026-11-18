/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Download,
  Calendar,
  MessageCircle,
  Copy,
  Check,
  FileSpreadsheet,
  Upload,
  UserCheck,
  FileText,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { BEHAVIORAL_ICEBERG_DIMENSIONS } from './homepageConfig';
import { parseCsvLineRFC, maskOemBrandNames } from './TallyCleanerAndClaims';

interface SampleLeakRow {
  rowNum: number;
  skuOrLr: string;
  category: string;
  discrepancyType: string;
  amountLakhs: number;
  status: string;
}

const SAMPLE_LEAK_ROWS: SampleLeakRow[] = [
  { rowNum: 1, skuOrLr: 'SKU-8842 / LR-99214', category: 'Logistics', discrepancyType: 'Demurrage Free-Time Breach', amountLakhs: 4.85, status: 'Audited' },
  { rowNum: 2, skuOrLr: 'SKU-1049 / PO-44812', category: 'Procurement', discrepancyType: 'PO SLA Late Delivery Penalty Waiver', amountLakhs: 3.20, status: 'Audited' },
  { rowNum: 3, skuOrLr: 'SKU-7720 / INV-88103', category: 'Accounts Payable', discrepancyType: 'Duplicate Voucher Submission', amountLakhs: 2.75, status: 'Audited' },
  { rowNum: 4, skuOrLr: 'SKU-3319 / BIN-00421', category: 'Physical Stock', discrepancyType: 'Phantom Bin Shortage Write-off', amountLakhs: 1.90, status: 'Locked' },
  { rowNum: 5, skuOrLr: 'SKU-9921 / LR-44102', category: 'Inbound Freight', discrepancyType: 'Weighbridge Gross-Tare Variance', amountLakhs: 1.50, status: 'Locked' },
  { rowNum: 6, skuOrLr: 'SKU-5120 / PO-11928', category: 'Vendor Rebates', discrepancyType: 'Unclaimed Volume Rebate Slip', amountLakhs: 3.80, status: 'Locked' },
];

export const IcebergControlSystems: React.FC = () => {
  const officialPhone = '+91 90805 40047';
  const rawPhone = '919080540047';
  const officialEmail = 'joneszz2004@gmail.com';
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [sanitizerFileName, setSanitizerFileName] = useState<string>('sample_tally_dump.csv');
  const [strippedColumns, setStrippedColumns] = useState<string[]>(['Party_Name', 'Vendor_GSTIN', 'Buyer_Contact_Phone']);
  const [sanitizedRows, setSanitizedRows] = useState<Array<Record<string, string>>>([
    { Row: '1', Document_Ref: 'INV-2024-001', Category: 'Freight', Discrepancy_INR: '4,85,000', Risk_Flag: 'High' },
    { Row: '2', Document_Ref: 'PO-8812-B', Category: 'SLA Breach', Discrepancy_INR: '3,20,000', Risk_Flag: 'High' },
    { Row: '3', Document_Ref: 'VOUCH-99182', Category: 'Duplicate Claim', Discrepancy_INR: '2,75,000', Risk_Flag: 'Medium' },
    { Row: '4', Document_Ref: 'BIN-STK-441', Category: 'Bin Variance', Discrepancy_INR: '1,90,000', Risk_Flag: 'Medium' },
    { Row: '5', Document_Ref: 'WB-SCALE-12', Category: 'Weighbridge', Discrepancy_INR: '1,50,000', Risk_Flag: 'Low' },
  ]);

  const [selectedDate, setSelectedDate] = useState<string>('2026-11-18');
  const [selectedSlot, setSelectedSlot] = useState<string>('11:00 AM IST');
  const [companyName, setCompanyName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('Plant Head / Operations Director');
  const [delcertHash, setDelcertHash] = useState<string>('DELCERT-E3B0C44298FC1C14');
  const [slotCopiedNotice, setSlotCopiedNotice] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const seed = `${sanitizerFileName}|${sanitizedRows.length}|operationalyst`;
    if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
      const data = new TextEncoder().encode(seed);
      crypto.subtle
        .digest('SHA-256', data)
        .then((buf) => {
          if (!active) return;
          const hex = Array.from(new Uint8Array(buf))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase()
            .slice(0, 16);
          setDelcertHash(`DELCERT-${hex}`);
        })
        .catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [sanitizerFileName, sanitizedRows.length]);

  const handleCopyPhone = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(officialPhone).catch(() => {});
    }
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyEmail = () => {
    const scopeText = `Operationalyst Audit Scope Request\nContact: ${officialEmail}\nPhone: ${officialPhone}\nTerms: ₹18,000 48-Hour Diagnostic (MSME Bill of Supply, 0% GST — 100% Fee Refund if < ₹2.5L Verifiable Leaks Found)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(scopeText).catch(() => {});
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSanitizerFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;
      const lines = text.split(/\r\n|\n/).filter((line) => line.trim() !== '');
      if (lines.length < 2) return;

      const headers = parseCsvLineRFC(lines[0]);
      const sensitivePattern =
        /party|vendor|supplier|customer|buyer|gstin|phone|mobile|contact|address|company/i;

      const keptHeaderIndices: number[] = [];
      const removed: string[] = [];

      headers.forEach((h, idx) => {
        if (sensitivePattern.test(h)) {
          removed.push(h);
        } else {
          keptHeaderIndices.push(idx);
        }
      });

      setStrippedColumns(
        removed.length > 0 ? removed : ['(No sensitive vendor/party headers detected)']
      );

      const parsedRows: Array<Record<string, string>> = [];
      lines.slice(1, 6).forEach((line, rowIdx) => {
        const cols = parseCsvLineRFC(line);
        const rowObj: Record<string, string> = { Row: (rowIdx + 1).toString() };
        keptHeaderIndices.slice(0, 4).forEach((colIdx, idx) => {
          const colName = headers[colIdx] || `Col_${idx + 1}`;
          const { masked } = maskOemBrandNames(cols[colIdx] || '-');
          rowObj[colName] = masked;
        });
        parsedRows.push(rowObj);
      });

      setSanitizedRows(parsedRows);
    };
    reader.readAsText(file);
  };

  const handleDownloadSanitizedCSV = () => {
    if (sanitizedRows.length === 0) return;
    const keys = Object.keys(sanitizedRows[0]);
    const headerRow = keys.join(',');
    const dataRows = sanitizedRows.map((r) =>
      keys.map((k) => `"${(r[k] || '').replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = [headerRow, ...dataRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sanitized_5Column_${sanitizerFileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const slotWhatsAppMessage = `Hello C. Jones Snowin,\nI would like to lock a 15-Minute Factory Leak Review slot:\n• Date: ${selectedDate}\n• Time: ${selectedSlot}\n• Company/Plant: ${companyName || 'Not specified'}\n• Role: ${userRole}\n\nPlease confirm availability for the ₹18,000 Diagnostic review (MSME Bill of Supply, 0% GST).`;
  const slotWhatsAppUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(slotWhatsAppMessage)}`;

  const handleCopySlotSummary = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(slotWhatsAppMessage).catch(() => {});
    }
    setSlotCopiedNotice(true);
    setTimeout(() => setSlotCopiedNotice(false), 2500);
  };

  const handleDownloadICS = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Operationalyst//Leak Review Scheduler//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Operationalyst 15-Min Leak Review - ${companyName || 'Factory Audit'}`,
      `DESCRIPTION:15-Minute Working Capital & Leak Audit Consultation with C. Jones Snowin.\\nWhatsApp: ${officialPhone}\\nEmail: ${officialEmail}`,
      'LOCATION:Google Meet / WhatsApp Audio Call',
      `DTSTART:${selectedDate.replace(/-/g, '')}T110000Z`,
      `DTEND:${selectedDate.replace(/-/g, '')}T111500Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Operationalyst_Leak_Review_${selectedDate}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTeaserReport = () => {
    const htmlReport = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Operationalyst - Boardroom Executive Teaser Audit Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; margin: 0; }
    .container { max-width: 900px; margin: 0 auto; background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .header { border-b: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 24px; font-weight: 800; color: #ffffff; margin: 0; }
    .subtitle { color: #10b981; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .badge { background: #064e3b; color: #34d399; padding: 6px 12px; border-radius: 9999px; font-weight: 700; font-size: 13px; border: 1px solid #059669; }
    .metric-box { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .metric-value { font-size: 32px; font-weight: 900; color: #ef4444; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; }
    th { background: #0f172a; color: #94a3b8; text-align: left; padding: 12px; border-bottom: 1px solid #334155; font-size: 12px; text-transform: uppercase; }
    td { padding: 12px; border-bottom: 1px solid #334155; }
    .blurred { filter: blur(5px); select: none; user-select: none; opacity: 0.6; }
    .banner { background: linear-gradient(135deg, #065f46 0%, #064e3b 100%); border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin-top: 32px; text-align: center; }
    .signoff { margin-top: 32px; border-t: 1px solid #334155; padding-top: 20px; display: flex; justify-content: space-between; align-items: center; color: #94a3b8; font-size: 13px; }
    .signoff strong { color: #ffffff; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="subtitle">Operationalyst Executive Teaser Audit Report</div>
        <h1 class="title">Boardroom Factory Leak & Capital Exposure Summary</h1>
      </div>
      <div class="badge">CONFIDENTIAL AUDIT</div>
    </div>

    <div class="metric-box">
      <div style="color: #94a3b8; font-size: 13px; font-weight: 600;">TOTAL IDENTIFIED WORKING CAPITAL LEAKAGE</div>
      <div class="metric-value">₹ 18,00,000+ (18.0 Lakhs)</div>
      <div style="color: #64748b; font-size: 12px; margin-top: 4px;">Audited across 6 core operational discrepancy vectors</div>
    </div>

    <h3 style="color: #ffffff; font-size: 16px;">Top 3 Verified Sample Discrepancy Rows</h3>
    <table>
      <thead>
        <tr>
          <th>Row</th>
          <th>SKU / Document Reference</th>
          <th>Category</th>
          <th>Discrepancy Vector</th>
          <th>Leak Value (₹ Lakhs)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td style="font-weight:700; color:#34d399;">SKU-8842 / LR-99214</td>
          <td>Logistics</td>
          <td>Demurrage Free-Time Breach</td>
          <td style="font-weight:700; color:#ef4444;">₹ 4.85 L</td>
        </tr>
        <tr>
          <td>2</td>
          <td style="font-weight:700; color:#34d399;">SKU-1049 / PO-44812</td>
          <td>Procurement</td>
          <td>PO SLA Late Delivery Penalty Waiver</td>
          <td style="font-weight:700; color:#ef4444;">₹ 3.20 L</td>
        </tr>
        <tr>
          <td>3</td>
          <td style="font-weight:700; color:#34d399;">SKU-7720 / INV-88103</td>
          <td>Accounts Payable</td>
          <td>Duplicate Voucher Submission</td>
          <td style="font-weight:700; color:#ef4444;">₹ 2.75 L</td>
        </tr>
        <tr class="blurred">
          <td>4</td>
          <td>SKU-3319 / BIN-00421</td>
          <td>Physical Stock</td>
          <td>Phantom Bin Shortage Write-off</td>
          <td>₹ 1.90 L</td>
        </tr>
        <tr class="blurred">
          <td>5</td>
          <td>SKU-9921 / LR-44102</td>
          <td>Inbound Freight</td>
          <td>Weighbridge Gross-Tare Variance</td>
          <td>₹ 1.50 L</td>
        </tr>
        <tr class="blurred">
          <td>6</td>
          <td>SKU-5120 / PO-11928</td>
          <td>Vendor Rebates</td>
          <td>Unclaimed Volume Rebate Slip</td>
          <td>₹ 3.80 L</td>
        </tr>
      </tbody>
    </table>

    <div class="banner">
      <h3 style="color: #ffffff; margin: 0 0 8px 0; font-size: 18px;">Unlock Full Unredacted Audit & 48-Hour Factory Diagnostic</h3>
      <p style="color: #a7f3d0; margin: 0 0 12px 0; font-size: 14px;">Fixed ₹18,000 Engagement Fee — <strong>100% Full Refund Guarantee</strong> if less than ₹2,50,000 leakage is discovered.</p>
      <div style="font-weight: 700; color: #ffffff; font-size: 15px;">Direct WhatsApp: ${officialPhone} | Email: ${officialEmail}</div>
    </div>

    <div class="signoff">
      <div>Founder Signoff: <strong>C. Jones Snowin</strong></div>
      <div>Operationalyst Oversight & Mathematical Invariants Gate</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlReport], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Operationalyst_Executive_Teaser_Report.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="iceberg-controls" className="py-20 bg-slate-950 text-slate-100 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> ICEBERG CONTROL SYSTEMS & REMEDIATION TOOLS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Institutional Audit Rigor Meets Immediate Commercial Action
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Zero-risk diagnostic tools, instant CSV privacy sanitization, and direct executive access to resolve hidden working capital leaks.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" /> Founder & Principal Auditor Signoff
              </span>
              <h3 className="text-2xl font-bold text-white">Direct Line to C. Jones Snowin</h3>
              <p className="text-slate-400 text-sm">
                No sales reps or gatekeepers. Speak directly with the audit engineer behind the Supervision Gate & Invariants Engine.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-sm font-semibold">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" /> {officialPhone}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> {officialEmail}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={`https://wa.me/${rawPhone}?text=${encodeURIComponent("Hello C. Jones Snowin, I'm reaching out regarding an Operationalyst Diagnostic Audit.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-900/50 transition flex items-center justify-center gap-2 border border-emerald-500/30"
              >
                <MessageCircle className="w-5 h-5 fill-current" /> Open WhatsApp (+91 90805 40047)
              </a>
              <button
                type="button"
                onClick={handleCopyPhone}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
              >
                {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedPhone ? 'Copied Number!' : 'Copy WhatsApp'}
              </button>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedEmail ? 'Copied Scope!' : 'Copy Scope / Email'}
              </button>
            </div>
          </div>
        </div>

        <div id="csv-sanitizer-tool" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
                <FileSpreadsheet className="w-4 h-4" /> 100% In-Browser Privacy Protection
              </div>
              <h3 className="text-xl font-bold text-white">Client-Side CSV Party &amp; Vendor Name Stripper</h3>
              <p className="text-slate-400 text-sm">
                Sanitizes sensitive vendor names, GSTINs, OEM buyer tags, and buyer details before sharing dumps. Data never leaves your browser.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-1.5 rounded-md bg-slate-950 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{delcertHash}</span>
              </span>
              <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition cursor-pointer flex items-center gap-2 border border-slate-700">
                <Upload className="w-4 h-4 text-emerald-400" /> Upload CSV File
                <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
              </label>
              <button
                type="button"
                onClick={handleDownloadSanitizedCSV}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow-lg transition flex items-center gap-2 border border-emerald-500/30 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Sanitized 5-Column CSV
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>Active File: <strong className="text-emerald-400">{sanitizerFileName}</strong></span>
              <span>Automatically Stripped Sensitive Columns:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {strippedColumns.map((col, i) => (
                <span key={i} className="px-2.5 py-1 bg-rose-950/80 text-rose-400 border border-rose-800/60 rounded-md text-xs font-mono font-semibold flex items-center gap-1">
                  <span className="line-through">{col}</span> (Stripped)
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase font-sans font-semibold border-b border-slate-800">
                <tr>
                  {sanitizedRows.length > 0 &&
                    Object.keys(sanitizedRows[0]).map((key, i) => (
                      <th key={i} className="py-3 px-4">{key.replace(/_/g, ' ')}</th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sanitizedRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="py-3 px-4 text-slate-200">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div id="slot-scheduler" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4" /> Zero-Friction Consultation Booking
              </div>
              <h3 className="text-2xl font-bold text-white">Schedule 15-Minute Factory Leak Review</h3>
              <p className="text-slate-400 text-sm">
                Select your preferred date and time slot to discuss diagnostic audit findings directly with Founder C. Jones Snowin.
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">IST Time Slot</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="10:00 AM IST">10:00 AM IST</option>
                    <option value="11:00 AM IST">11:00 AM IST (Recommended)</option>
                    <option value="02:30 PM IST">02:30 PM IST</option>
                    <option value="04:00 PM IST">04:00 PM IST</option>
                    <option value="06:00 PM IST">06:00 PM IST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Plant / CA Firm Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Auto Components Pvt Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Your Role</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Plant Head / Operations Director">Plant Head / Operations Director</option>
                    <option value="CFO / Finance Controller">CFO / Finance Controller</option>
                    <option value="Statutory Auditor / CA Partner">Statutory Auditor / CA Partner</option>
                    <option value="Supply Chain / Procurement Lead">Supply Chain / Procurement Lead</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={slotWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 border border-emerald-500/30"
              >
                <Send className="w-4 h-4" /> Confirm Slot on WhatsApp (+91 90805 40047)
              </a>
              <button
                type="button"
                onClick={handleCopySlotSummary}
                className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
              >
                {slotCopiedNotice ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {slotCopiedNotice ? 'Copied Slot Summary' : 'Copy Slot Note'}
              </button>
              <button
                type="button"
                onClick={handleDownloadICS}
                className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-emerald-400" /> Download Calendar (.ics)
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4" /> Boardroom Deliverable
              </div>
              <h3 className="text-2xl font-bold text-white">Boardroom Printable Executive Teaser Report</h3>
              <p className="text-slate-400 text-sm">
                Generates a clean, self-contained HTML teaser report showing Total Leakage, Top 3 full SKU/LR rows, CSS-blurred rows 4+, Founder Signoff, and Guarantee Details.
              </p>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 font-mono text-xs text-slate-300">
                <div className="flex justify-between items-center text-slate-400 font-sans font-semibold border-b border-slate-800 pb-2">
                  <span>Audited Discrepancy Sample</span>
                  <span className="text-emerald-400">Total ₹ 18.00 Lakhs</span>
                </div>
                {SAMPLE_LEAK_ROWS.slice(0, 3).map(row => (
                  <div key={row.rowNum} className="flex justify-between items-center text-emerald-400">
                    <span>Row {row.rowNum}: {row.skuOrLr}</span>
                    <span className="font-bold">₹ {row.amountLakhs.toFixed(2)} L</span>
                  </div>
                ))}
                {SAMPLE_LEAK_ROWS.slice(3, 5).map(row => (
                  <div key={row.rowNum} className="flex justify-between items-center text-slate-500 blur-[3px]">
                    <span>Row {row.rowNum}: {row.skuOrLr}</span>
                    <span>₹ {row.amountLakhs.toFixed(2)} L</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleDownloadTeaserReport}
                className="w-full px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 border border-emerald-500/30 cursor-pointer"
              >
                <Download className="w-5 h-5" /> Download Boardroom Teaser HTML Report
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-6">
          <h3 className="text-xl font-bold text-white text-center">Institutional Operationalyst Iceberg Control Dimensions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BEHAVIORAL_ICEBERG_DIMENSIONS.map(dim => (
              <div key={dim.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
                <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Dimension {dim.id}</div>
                <h4 className="text-base font-bold text-white">{dim.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{dim.description}</p>
                <div className="text-emerald-400/90 text-xs font-semibold pt-1 border-t border-slate-800">{dim.metric}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default IcebergControlSystems;
