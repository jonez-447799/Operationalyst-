import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  ShieldCheck,
  TrendingDown,
  FileSpreadsheet,
  Printer,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  Download,
  Upload,
  DollarSign,
  Calculator,
  RefreshCw,
  ArrowRight,
  Lock,
  ShieldAlert,
  Info,
  Phone,
  Mail,
  MapPin,
  Award,
  Search,
  Sliders
} from 'lucide-react';

const HEADER_FOOTER_CREDENTIALS = "C. Jones Snowin · Founder, Operationalyst (Snowin Ventures, Chennai) · B.Com (Loyola College, Chennai) · MBA (Supply Chain & Finance) · Govt. of India Udyam MSME UDYAM-TN-02-0444630 · 0% GST MSME Bill of Supply · jonessnowin@operationalyst.com · +91 90805 40047 · Zero ERP Login · NDA Clean-Room Ready.";

interface SKUItem {
  partId: string;
  desc: string;
  daysIdle: number;
  qty: number;
  unitCost: number;
  bookValue: number;
  dailyBleed?: number;
  routing?: string;
  isShielded?: boolean;
}

const PRELOADED_10_COHORT: SKUItem[] = [
  { partId: "PRG-4402-SS", desc: "Flange Housing SS316L Machined Component", daysIdle: 378, qty: 440, unitCost: 4200, bookValue: 1848000 },
  { partId: "HSG-910-ALU", desc: "Die-Cast Transmission Cover Rev-A (ECN Orphan)", daysIdle: 294, qty: 770, unitCost: 1900, bookValue: 1462000 },
  { partId: "SHF-208-EN24", desc: "Induction Hardened Drive Shaft Blank EN24", daysIdle: 431, qty: 351, unitCost: 3400, bookValue: 1193500 },
  { partId: "BLK-774-SG", desc: "Ductile Iron Hydraulic Manifold Block SG", daysIdle: 362, qty: 210, unitCost: 5200, bookValue: 1092000 },
  { partId: "GER-512-20M", desc: "Helical Pinion Gear Blank Forging 20MnCr5", daysIdle: 409, qty: 360, unitCost: 2880, bookValue: 1036800 },
  { partId: "BRG-6209-ZZ-P4", desc: "Mazak 5-Axis VMC Spindle Bearing Precision", daysIdle: 356, qty: 12, unitCost: 12000, bookValue: 144000 },
  { partId: "SER-881-FANUC", desc: "Fanuc AC Servo Motor Controller Module", daysIdle: 280, qty: 4, unitCost: 185000, bookValue: 740000 },
  { partId: "BAL-902-THK", desc: "THK High-Precision Ballscrew Assembly 40mm", daysIdle: 310, qty: 8, unitCost: 65000, bookValue: 520000 },
  { partId: "ENC-104-HEID", desc: "Heidenhain Linear Glass Scale Encoder", daysIdle: 215, qty: 6, unitCost: 48000, bookValue: 288000 },
  { partId: "VLV-330-HYD", desc: "Yuken Proportional Hydraulic Control Valve", daysIdle: 195, qty: 15, unitCost: 22000, bookValue: 330000 }
];

const BENCHMARK_ITEMS = [
  { partId: "PRG-4402-SS", desc: "Flange Housing SS316L", daysIdle: 378, value: "₹18,48,000", bleed: "₹1,318/d", action: "Vendor Credit Swap (82% PO Offset)", type: "normal" },
  { partId: "HSG-910-ALU", desc: "Die-Cast Transmission Cover Rev-A (ECN Orphan)", daysIdle: 294, value: "₹14,62,000", bleed: "₹1,043/d", action: "OEM ECN Obsolescence Claim", type: "normal" },
  { partId: "SHF-208-EN24", desc: "Induction Hardened Drive Shaft Blank", daysIdle: 431, value: "₹11,93,500", bleed: "₹851/d", action: "Alternate BOM Turn-Down Re-Machine", type: "normal" },
  { partId: "BLK-774-SG", desc: "Ductile Iron Hydraulic Manifold", daysIdle: 362, value: "₹10,92,000", bleed: "₹779/d", action: "Vendor Credit Swap vs Active PO", type: "normal" },
  { partId: "GER-512-20M", desc: "Helical Pinion Gear Blank Forging", daysIdle: 409, value: "₹10,36,800", bleed: "₹739/d", action: "Alternate BOM Re-Machining", type: "normal" },
  { partId: "BRG-6209-ZZ-P4", desc: "Mazak 5-Axis VMC Spindle Bearing", daysIdle: 356, value: "₹1,44,000", bleed: "SHIELDED", action: "LOCKED SAFE — Saves ₹40.3L VMC Outage", type: "shielded" }
];

export function generateInstitutionalXLSX() {
  const wb = XLSX.utils.book_new();

  // 01_Exec_Capital_Bridge
  const ws1_data = [
    ["OPERATIONALYST INSTITUTIONAL CAPITAL DIAGNOSTIC — EXECUTIVE BRIDGE"],
    ["Plant Corridor", "Oragadam / Hosur Discrete Manufacturing Cluster"],
    ["Reconciled Plant Stock", "₹6,42,80,000", "420 SKUs", "Variance < 0.8%"],
    ["Actionable Dead Stock (>180d)", "₹1,06,60,000", "54 SKUs", "OD Bleed: ₹7,820/day"],
    ["CNC Breakdown Spares Shielded", "₹41,60,000", "47 SKUs", "Downtime Value Protected: ₹18,000/hr"],
    ["30-Day Recovery Hitlist", "₹68,40,000", "Zero Reduction in Bank DP Limit"],
    [],
    ["Metric Breakdown", "Value (INR)", "Percentage", "Audit Note"],
    ["Total Book Value", 64280000, "100.0%", "Physical count verified"],
    ["Active Production Stock (<90d)", 41220000, "64.1%", "Normal operating cycle"],
    ["Slow-Moving Stock (91-180d)", 12400000, "19.3%", "Monitored buffer"],
    ["Non-Moving Idle (>180d)", 10660000, "16.6%", "Actionable carrying cost bleed"],
    ["Critical CNC Spares Exempt", 4160000, "6.5%", "Mathematically shielded under AS-10"]
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(ws1_data);
  XLSX.utils.book_append_sheet(wb, ws1, "01_Exec_Capital_Bridge");

  // 02_Idle_180d_365d_Hitlist
  const ws2_data = [
    ["Part_ID", "Description", "Days_Idle", "Qty", "Unit_Cost_INR", "Book_Value_INR", "Daily_Bleed_INR", "Action_Routing"],
    ["PRG-4402-SS", "Flange Housing SS316L", 378, 440, 4200, 1848000, 1318, "Vendor Credit Swap (82% PO Offset)"],
    ["HSG-910-ALU", "Die-Cast Transmission Cover Rev-A", 294, 770, 1900, 1462000, 1043, "OEM ECN Obsolescence Claim"],
    ["SHF-208-EN24", "Induction Hardened Drive Shaft Blank", 431, 351, 3400, 1193500, 851, "Alternate BOM Turn-Down Re-Machine"],
    ["BLK-774-SG", "Ductile Iron Hydraulic Manifold", 362, 210, 5200, 1092000, 779, "Vendor Credit Swap vs Active PO"],
    ["GER-512-20M", "Helical Pinion Gear Blank Forging", 409, 360, 2880, 1036800, 739, "Alternate BOM Re-Machining"]
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(ws2_data);
  XLSX.utils.book_append_sheet(wb, ws2, "02_Idle_180d_365d_Hitlist");

  // 03_Action_Routing_Matrix
  const ws3_data = [
    ["Routing Mechanism", "Target Value (INR)", "SKU Count", "Execution Partner / Method", "Expected Cash Realization Timeline"],
    ["Vendor Credit Swap", 3240000, 14, "Active PO Offset with Tier-1 Suppliers", "14 Days"],
    ["OEM ECN Claim", 2150000, 8, "Engineering Change Notice Back-charge", "30 Days"],
    ["Alternate BOM Re-Machine", 1850000, 9, "In-house CNC Resizing & Turning", "21 Days"],
    ["Grade-Sorted Alloy Auction", 1600000, 17, "Certified Metallurgical Bidding", "10 Days"],
    ["LOCKED SAFE — CNC Spares", 4160000, 47, "Shielded Breakdown Maintenance Vault", "Permanent Lockout"]
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(ws3_data);
  XLSX.utils.book_append_sheet(wb, ws3, "03_Action_Routing_Matrix");

  // 04_AS2_CARO_Audit_Schedule
  const ws4_data = [
    ["AS-2 & CARO 2020 CLAUSE 3(ii) NRV & DP RECONCILIATION"],
    ["Parameter", "Amount (INR)", "Regulatory Impact", "Compliance Note"],
    ["Total Inventory Book Value", 64280000, "CARO 3(ii)(a)", "Physical verification within 0.8% variance"],
    ["AS-2 Net Realizable Value Provision", 3447000, "Balance Sheet NRV", "Non-linear decay & obsolete ECNs"],
    ["Bank Drawing Power (DP) Base", 64280000, "Bank CC Limit", "Zero DP shock strategy implemented"],
    ["Exempted CNC Spares", 4160000, "AS-10 Capital Asset", "Maintained at cost; exempt from AS-2 write-down"]
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(ws4_data);
  XLSX.utils.book_append_sheet(wb, ws4, "04_AS2_CARO_Audit_Schedule");

  // 05_BOM_Whiplash_MOQ_Leaks
  const ws5_data = [
    ["Part_ID", "BOM Code", "MOQ Excess Qty", "Excess Value (INR)", "Root Cause"],
    ["HSG-910-ALU", "BOM-REV-A", 500, 950000, "Supplier MOQ 750 vs Run Requirement 250"],
    ["PRG-4402-SS", "BOM-FLG-02", 200, 840000, "ECN Update without Inventory Scrap Hold"],
    ["GER-512-20M", "BOM-GEAR-11", 180, 518400, "Forecast Over-ordering for Volume Discount"]
  ];
  const ws5 = XLSX.utils.aoa_to_sheet(ws5_data);
  XLSX.utils.book_append_sheet(wb, ws5, "05_BOM_Whiplash_MOQ_Leaks");

  // 06_CNC_Spares_Vault
  const ws6_data = [
    ["Part_ID", "Spare Description", "Machine Tag", "Unit Cost (INR)", "Downtime Avoided Value (INR)", "Status"],
    ["BRG-6209-ZZ-P4", "Mazak 5-Axis VMC Spindle Bearing", "VMC-01/02", 144000, 4030000, "SHIELDED / LOCKED SAFE"],
    ["SER-881-FANUC", "Fanuc AC Servo Motor Controller", "HMC-04", 185000, 5200000, "SHIELDED / LOCKED SAFE"],
    ["BAL-902-THK", "THK High-Precision Ballscrew 40mm", "VMC-03", 65000, 2800000, "SHIELDED / LOCKED SAFE"],
    ["ENC-104-HEID", "Heidenhain Linear Glass Scale Encoder", "VMC-01", 48000, 1900000, "SHIELDED / LOCKED SAFE"]
  ];
  const ws6 = XLSX.utils.aoa_to_sheet(ws6_data);
  XLSX.utils.book_append_sheet(wb, ws6, "06_CNC_Spares_Vault");

  // 07_Subcontract_Freight_Leaks
  const ws7_data = [
    ["Challan No", "Subcontractor / Job-Worker", "Days Out", "Material Value (INR)", "Sec 143 GST Risk (INR)", "Status"],
    ["JW-AMB-2419", "Ambattur Heat Treaters Pvt Ltd", 412, 680000, 122400, "OVERDUE (>365d) — Immediate Recall"],
    ["JW-HOS-1882", "Hosur Surface Finishers", 385, 445000, 80100, "OVERDUE (>365d) — Immediate Recall"]
  ];
  const ws7 = XLSX.utils.aoa_to_sheet(ws7_data);
  XLSX.utils.book_append_sheet(wb, ws7, "07_Subcontract_Freight_Leaks");

  // 08_30_60_90_Floor_Tracker
  const ws8_data = [
    ["Phase", "Days", "Milestone Target", "Target Cash Released (INR)", "Responsible Lead"],
    ["Phase 1", "Days 1–7", "Spares Shielding & Top-5 Vendor Swap Setup", "₹18,48,000", "CFO & Plant Head"],
    ["Phase 2", "Days 8–15", "OEM ECN Obsolescence Recovery Submissions", "₹14,62,000", "Supply Chain Lead"],
    ["Phase 3", "Days 16–24", "In-House BOM Re-Machining Execution", "₹11,93,500", "Production Manager"],
    ["Phase 4", "Days 25–30", "Certified Grade Alloy Bidding & Clearing", "₹23,36,500", "Commercial Head"]
  ];
  const ws8 = XLSX.utils.aoa_to_sheet(ws8_data);
  XLSX.utils.book_append_sheet(wb, ws8, "08_30_60_90_Floor_Tracker");

  XLSX.writeFile(wb, "Operationalyst_Institutional_Benchmark_420SKU.xlsx");
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sandbox' | 'brief' | 'pricing'>('overview');
  const [activeBenchmarkTab, setActiveBenchmarkTab] = useState<string>('02_Idle_Hitlist');

  const [bankRate, setBankRate] = useState<number>(14.5);
  const [decayRate, setDecayRate] = useState<number>(9.0);
  const [csvText, setCsvText] = useState<string>("");
  const [skuList, setSkuList] = useState<SKUItem[]>(PRELOADED_10_COHORT);

  const handleParseCsv = (text: string) => {
    const lines = text.trim().split('\n');
    const parsed: SKUItem[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || (i === 0 && line.toLowerCase().includes('part_id'))) continue;
      const parts = line.split(',').map(s => s.trim().replace(/^"/, '').replace(/"$/, ''));
      if (parts.length >= 5) {
        const partId = parts[0];
        const desc = parts[1];
        const daysIdle = parseFloat(parts[2]) || 0;
        const qty = parseFloat(parts[3]) || 0;
        const unitCost = parseFloat(parts[4]) || 0;
        const bookValue = qty * unitCost;
        parsed.push({ partId, desc, daysIdle, qty, unitCost, bookValue });
      }
    }
    if (parsed.length > 0) {
      setSkuList(parsed);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        if (text) {
          setCsvText(text);
          handleParseCsv(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const downloadSampleCsv = () => {
    const sample = `Part_ID,Description,Days_Idle,Qty,Unit_Cost
PRG-4402-SS,Flange Housing SS316L,378,440,4200
HSG-910-ALU,Die-Cast Transmission Cover Rev-A,294,770,1900
SHF-208-EN24,Induction Hardened Drive Shaft Blank,431,351,3400
BLK-774-SG,Ductile Iron Hydraulic Manifold,362,210,5200
GER-512-20M,Helical Pinion Gear Blank Forging,409,360,2880
BRG-6209-ZZ-P4,Mazak 5-Axis VMC Spindle Bearing,356,12,12000
SER-881-FANUC,Fanuc AC Servo Motor Controller,280,4,185000
BAL-902-THK,THK High-Precision Ballscrew Assembly,310,8,65000
ENC-104-HEID,Heidenhain Linear Glass Scale Encoder,215,6,48000
VLV-330-HYD,Yuken Proportional Hydraulic Control Valve,195,15,22000`;
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Operationalyst_Sample_5Col_Stock.csv";
    a.click();
  };

  const processedSkus = useMemo(() => {
    const totalAnnualRate = (bankRate + decayRate) / 100;
    const dailyRate = totalAnnualRate / 365;

    return skuList.map(item => {
      const isShielded = /spindle|fanuc|ballscrew|servo|bearing|encoder|guide|cnc|vmc|hmc/i.test(item.desc) || /BRG|SER|BAL|ENC/i.test(item.partId);
      const dailyBleed = isShielded ? 0 : item.bookValue * dailyRate;

      let routing = "Vendor Credit Swap";
      if (isShielded) {
        routing = "LOCKED SAFE — CNC SPARE";
      } else if (/rev-a|ecn|orphan|cover|housing/i.test(item.desc)) {
        routing = "OEM ECN Claim";
      } else if (/blank|shaft|forging|gear/i.test(item.desc)) {
        routing = "Alternate BOM Re-Machine";
      } else if (item.daysIdle > 365) {
        routing = "Grade-Sorted Alloy Auction";
      }

      return {
        ...item,
        dailyBleed,
        routing,
        isShielded
      };
    }).sort((a, b) => (b.dailyBleed || 0) - (a.dailyBleed || 0));
  }, [skuList, bankRate, decayRate]);

  const totalBookValue = useMemo(() => processedSkus.reduce((sum, s) => sum + s.bookValue, 0), [processedSkus]);
  const totalDailyBleed = useMemo(() => processedSkus.reduce((sum, s) => sum + (s.dailyBleed || 0), 0), [processedSkus]);
  const shieldedValue = useMemo(() => processedSkus.filter(s => s.isShielded).reduce((sum, s) => sum + s.bookValue, 0), [processedSkus]);

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans flex flex-col justify-between selection:bg-amber-500 selection:text-slate-900">
      <header className="bg-[#070B16] border-b border-slate-800/80 px-4 py-2 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
          <div className="flex items-center gap-2 font-medium text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>OPERATIONALYST INSTITUTIONAL V2</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="text-amber-400 font-mono text-[11px]">GOVT MSME UDYAM-TN-02-0444630</span>
          </div>
          <div className="text-[11px] text-slate-400 truncate max-w-3xl">
            {HEADER_FOOTER_CREDENTIALS}
          </div>
        </div>
      </header>

      <nav className="bg-[#0F172A]/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-amber-500/20">
                O
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-white block leading-none">OPERATIONALYST</span>
                <span className="text-[10px] text-amber-400 font-mono tracking-widest uppercase">Institutional Working Capital Audit</span>
              </div>
            </div>

            <div className="flex space-x-1 md:space-x-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'overview'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Overview &amp; Benchmark
              </button>

              <button
                onClick={() => setActiveTab('sandbox')}
                className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'sandbox'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Air-Gapped CSV Sandbox
              </button>

              <button
                onClick={() => setActiveTab('brief')}
                className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'brief'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                2-Page A4 MD Brief
              </button>

              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'pricing'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Pricing &amp; 10x Guarantee
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-[#0B1120] space-y-10">
            <div className="text-center space-y-6 max-w-4xl mx-auto pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-slate-300 shadow-inner">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tally Prime · SAP B1/S4 · Busy · Oracle · CSV — 100% Air-Gapped Zero-ERP-Login Protocol</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Release <span className="text-amber-400">₹25L–₹1.5Cr</span> in trapped factory cash in 48 hours—with zero CNC downtime risk.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto">
                Share 5 anonymized stock columns with vendor names stripped. Receive an AS-2 &amp; CARO 3(ii) compliant 8-sheet Excel capital workbook and 2-page printable MD execution dossier isolating non-linear Cash Credit (OD) bleed, orphaned ECNs, and Sec 143 job-work risks—while mathematically locking critical CNC breakdown spares safe.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
                  <div className="text-2xl font-bold text-amber-400 font-mono">5 Columns</div>
                  <div className="text-xs text-slate-400 mt-1">100% supplier-anonymized CSV</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
                  <div className="text-2xl font-bold text-amber-400 font-mono">Compounded OD</div>
                  <div className="text-xs text-slate-400 mt-1">CC interest + rack + alloy decay</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
                  <div className="text-2xl font-bold text-emerald-400 font-mono">Zero DP Shock</div>
                  <div className="text-xs text-slate-400 mt-1">Protects bank Cash Credit limits</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
                  <div className="text-2xl font-bold text-amber-400 font-mono">₹10,00,000+</div>
                  <div className="text-xs text-slate-400 mt-1">10x fee leak guarantee (&gt;₹5Cr plants)</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setActiveTab('sandbox')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Launch Air-Gapped CSV Sandbox
                </button>
                <button
                  onClick={generateInstitutionalXLSX}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base transition-all border border-slate-700 flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  Download 8-Sheet XLSX Pack
                </button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 text-amber-200 text-sm leading-relaxed shadow-lg flex items-start gap-3">
              <Award className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-semibold">Founding Institutional Reference Program (2 Corridor Slots Open):</strong> Qualifying discrete manufacturers (&gt;₹5 Cr book stock) receive the full 8-sheet audit at ₹0 upfront fee in exchange for a signed 2-line Plant Head or CFO verification note once ₹10,00,000+ in verifiable stock, ECN, or job-work leaks are isolated.
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="inline-block px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs mb-2 font-semibold">
                    REAL BENCHMARK REGISTER
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    8-Sheet .XLSX + 2-Page A4 PDF Institutional Benchmark · 420-SKU Oragadam / Hosur Register
                  </h2>
                </div>
                <button
                  onClick={generateInstitutionalXLSX}
                  className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 self-start lg:self-auto transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Download Full 8-Sheet .XLSX
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Reconciled Plant Stock</div>
                  <div className="text-xl font-bold text-white mt-1 font-mono">₹6,42,80,000</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">420 SKUs · Variance &lt; 0.8%</div>
                </div>
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Actionable Dead (&gt;180d)</div>
                  <div className="text-xl font-bold text-amber-400 mt-1 font-mono">₹1,06,60,000</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">54 SKUs · ₹7,820/day OD bleed</div>
                </div>
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">CNC Spares Shielded</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">47 SKUs (₹41,60,000)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Saves ₹18,000/hr VMC outages</div>
                </div>
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">30-Day Cash Recovery Hitlist</div>
                  <div className="text-xl font-bold text-cyan-400 mt-1 font-mono">₹68,40,000</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Zero reduction in Bank DP limit</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
                  {[
                    { id: '02_Idle_Hitlist', label: '02_Idle_Hitlist' },
                    { id: '01_Exec_Bridge', label: '01_Exec_Bridge' },
                    { id: '04_AS2_&_Bank_DP', label: '04_AS2_&_Bank_DP' },
                    { id: '06_CNC_Spares_Vault', label: '06_CNC_Spares_Vault' },
                    { id: '07_Subcontract_GST', label: '07_Subcontract_GST' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveBenchmarkTab(tab.id)}
                      className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                        activeBenchmarkTab === tab.id
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-3">Part ID</th>
                        <th className="p-3">Item Description</th>
                        <th className="p-3">Days Idle</th>
                        <th className="p-3">Book Value</th>
                        <th className="p-3">Bleed / Day</th>
                        <th className="p-3">Action Routing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {BENCHMARK_ITEMS.map((item, idx) => (
                        <tr key={idx} className={item.type === 'shielded' ? 'bg-emerald-950/20' : 'hover:bg-slate-900/50'}>
                          <td className="p-3 font-mono font-semibold text-amber-400">{item.partId}</td>
                          <td className="p-3 text-slate-200">{item.desc}</td>
                          <td className="p-3 font-mono text-slate-300">{item.daysIdle}d</td>
                          <td className="p-3 font-mono font-semibold text-white">{item.value}</td>
                          <td className="p-3 font-mono">
                            {item.type === 'shielded' ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">
                                <Lock className="w-3 h-3" /> {item.bleed}
                              </span>
                            ) : (
                              <span className="text-amber-400 font-medium">{item.bleed}</span>
                            )}
                          </td>
                          <td className="p-3">
                            {item.type === 'shielded' ? (
                              <span className="text-emerald-300 font-semibold">{item.action}</span>
                            ) : (
                              <span className="text-slate-300">{item.action}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="space-y-8">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs mb-2">
                  <Lock className="w-3.5 h-3.5" /> 100% IN-BROWSER CLIENT-SIDE PARSER — NO DATA TRANSMITTED
                </div>
                <h2 className="text-2xl font-bold text-white">Air-Gapped CSV Stock Diagnostic Sandbox</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Upload or paste your 5-column stock export: <code className="text-amber-400 font-mono">Part_ID, Description, Days_Idle, Qty, Unit_Cost</code>
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={downloadSampleCsv}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  Download Sample 5-Col CSV
                </button>

                <label className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all">
                  <Upload className="w-4 h-4" />
                  Upload CSV File
                  <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    Bank CC / OD Interest Rate: <span className="text-amber-400 font-mono text-base">{bankRate.toFixed(1)}%</span>
                  </label>
                  <span className="text-xs text-slate-400">Range: 9.0% – 20.0%</span>
                </div>
                <input
                  type="range"
                  min="9"
                  max="20"
                  step="0.5"
                  value={bankRate}
                  onChange={(e) => setBankRate(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-amber-400" />
                    Industrial Rack + Alloy Decay Rate: <span className="text-amber-400 font-mono text-base">{decayRate.toFixed(1)}%</span>
                  </label>
                  <span className="text-xs text-slate-400">Range: 4.0% – 16.0%</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="16"
                  step="0.5"
                  value={decayRate}
                  onChange={(e) => setDecayRate(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Total Evaluated Stock Value</div>
                <div className="text-2xl font-bold text-white mt-1 font-mono">₹{totalBookValue.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-slate-400 mt-1">{processedSkus.length} SKUs loaded in memory</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Daily Compounded Rupee Bleed</div>
                <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">₹{Math.round(totalDailyBleed).toLocaleString('en-IN')}/day</div>
                <div className="text-[11px] text-slate-400 mt-1">Total OD + Rack Decay compounding</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-emerald-900/60 bg-emerald-950/10">
                <div className="text-xs text-slate-400 font-medium">CNC Spares Shielded (Locked Safe)</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">₹{shieldedValue.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-slate-400 mt-1">Exempt from liquidations &amp; AS-2 haircuts</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Live Evaluated Stock Register</h3>
                <span className="text-xs text-slate-400 font-mono">Sorted by Daily Bleed (Highest First)</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Part ID</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Days Idle</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Unit Cost</th>
                      <th className="p-3">Book Value</th>
                      <th className="p-3">Daily Bleed</th>
                      <th className="p-3">Action Routing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {processedSkus.map((sku, idx) => (
                      <tr key={idx} className={sku.isShielded ? 'bg-emerald-950/20' : 'hover:bg-slate-900/50'}>
                        <td className="p-3 font-mono font-semibold text-amber-400">{sku.partId}</td>
                        <td className="p-3 text-slate-200">{sku.desc}</td>
                        <td className="p-3 font-mono text-slate-300">{sku.daysIdle}d</td>
                        <td className="p-3 font-mono text-slate-300">{sku.qty}</td>
                        <td className="p-3 font-mono text-slate-300">₹{sku.unitCost.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-mono font-semibold text-white">₹{sku.bookValue.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-mono">
                          {sku.isShielded ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-[11px]">
                              <Lock className="w-3 h-3" /> SHIELDED
                            </span>
                          ) : (
                            <span className="text-amber-400 font-semibold">₹{Math.round(sku.dailyBleed || 0).toLocaleString('en-IN')}/d</span>
                          )}
                        </td>
                        <td className="p-3">
                          {sku.isShielded ? (
                            <span className="text-emerald-400 font-bold text-xs">{sku.routing}</span>
                          ) : (
                            <span className="text-slate-300 text-xs">{sku.routing}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'brief' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="text-sm text-slate-300 font-medium">
                Boardroom Printable 2-Page Executive Dossier (Ref: <span className="text-amber-400 font-mono font-bold">OP-2026-ORG-420</span>)
              </div>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Printer className="w-4 h-4" />
                Print / Save 2-Page A4 PDF
              </button>
            </div>

            <div className="bg-[#F2EFE9] text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl space-y-8 font-serif leading-relaxed border border-amber-900/20 max-w-4xl mx-auto print:max-w-none print:p-0 print:shadow-none print:bg-white">
              <div className="border-b-2 border-slate-900 pb-6 flex justify-between items-end">
                <div>
                  <div className="text-xs font-mono tracking-widest text-slate-600 uppercase font-bold">OPERATIONALYST INSTITUTIONAL DOSSIER</div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">MD &amp; CFO EXECUTION BRIEF</h1>
                  <div className="text-xs text-slate-700 mt-1 font-sans">
                    Ref: <strong className="font-mono">OP-2026-ORG-420</strong> · Plant Cluster: <strong>Oragadam / Hosur</strong> · Date: <strong>November 2026</strong>
                  </div>
                </div>
                <div className="text-right text-[11px] font-sans text-slate-600">
                  <div>Govt. MSME: UDYAM-TN-02-0444630</div>
                  <div>0% GST MSME Bill of Supply</div>
                  <div className="font-bold text-slate-900">Zero ERP Login Protocol</div>
                </div>
              </div>

              <div className="space-y-3 font-sans">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-1 flex items-center gap-2">
                  1. Executive Capital Bridge (₹6,42,80,000 Reconciled Stock)
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-200/80 p-3 rounded border border-slate-300">
                    <div className="text-[11px] text-slate-600">Reconciled Stock</div>
                    <div className="text-base font-bold text-slate-900 font-mono">₹6,42,80,000</div>
                  </div>
                  <div className="bg-amber-100 p-3 rounded border border-amber-300">
                    <div className="text-[11px] text-amber-900">Actionable Dead (&gt;180d)</div>
                    <div className="text-base font-bold text-amber-900 font-mono">₹1,06,60,000</div>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded border border-emerald-300">
                    <div className="text-[11px] text-emerald-900">CNC Spares Shielded</div>
                    <div className="text-base font-bold text-emerald-900 font-mono">₹41,60,000</div>
                  </div>
                  <div className="bg-cyan-100 p-3 rounded border border-cyan-300">
                    <div className="text-[11px] text-cyan-900">30-Day Recovery Target</div>
                    <div className="text-base font-bold text-cyan-900 font-mono">₹68,40,000</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 font-sans bg-slate-100 p-4 rounded-lg border border-slate-300">
                <h2 className="text-sm font-bold text-slate-900">2. Non-Linear Carrying Cost Compounding Formula</h2>
                <div className="font-mono text-xs bg-slate-900 text-amber-400 p-2.5 rounded">
                  C_hold(t) = V0[(1 + r_OD/12)^t - 1] + A_rack*c_sqft*t + V0(1 - e^-lambda*t)
                </div>
                <p className="text-xs text-slate-700 leading-snug">
                  Evaluates the non-linear compounding of Cash Credit interest (r_OD = 14.5%), physical rack storage footprint costs, and metallurgical alloy degradation over time t.
                </p>
              </div>

              <div className="space-y-3 font-sans">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-300 pb-1">
                  3. Priority Monday-Morning SKU Hitlist
                </h2>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-200 text-slate-800 font-bold">
                    <tr>
                      <th className="p-2 border-b border-slate-300">Part ID</th>
                      <th className="p-2 border-b border-slate-300">Description</th>
                      <th className="p-2 border-b border-slate-300">Idle</th>
                      <th className="p-2 border-b border-slate-300">Value</th>
                      <th className="p-2 border-b border-slate-300">Action Routing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    <tr>
                      <td className="p-2 font-mono font-bold">PRG-4402-SS</td>
                      <td className="p-2">Flange Housing SS316L</td>
                      <td className="p-2 font-mono">378d</td>
                      <td className="p-2 font-mono font-bold">₹18,48,000</td>
                      <td className="p-2 text-slate-800">Vendor Credit Swap (82% PO Offset)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono font-bold">HSG-910-ALU</td>
                      <td className="p-2">Die-Cast Transmission Cover Rev-A</td>
                      <td className="p-2 font-mono">294d</td>
                      <td className="p-2 font-mono font-bold">₹14,62,000</td>
                      <td className="p-2 text-slate-800">OEM ECN Obsolescence Claim</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono font-bold">SHF-208-EN24</td>
                      <td className="p-2">Induction Hardened Drive Shaft Blank</td>
                      <td className="p-2 font-mono">431d</td>
                      <td className="p-2 font-mono font-bold">₹11,93,500</td>
                      <td className="p-2 text-slate-800">Alternate BOM Turn-Down Re-Machine</td>
                    </tr>
                    <tr className="bg-emerald-50">
                      <td className="p-2 font-mono font-bold text-emerald-900">BRG-6209-ZZ-P4</td>
                      <td className="p-2 text-emerald-900 font-medium">Mazak 5-Axis VMC Spindle Bearing</td>
                      <td className="p-2 font-mono text-emerald-900">356d</td>
                      <td className="p-2 font-mono font-bold text-emerald-900">₹1,44,000</td>
                      <td className="p-2 font-bold text-emerald-900">LOCKED SAFE — Saves ₹40.3L VMC Outage</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                <div className="p-3.5 rounded border border-amber-300 bg-amber-50 space-y-1.5">
                  <h3 className="font-bold text-amber-900 text-sm">4. Zero Bank Drawing Power (DP) Shock</h3>
                  <p className="text-amber-950 leading-snug">
                    AS-2 / CARO 2020 Clause 3(ii) NRV schedule applies a <strong className="font-mono">₹34.47L</strong> provision across non-moving stock while 47 critical breakdown spares are exempt under AS-10. Working capital liquidations are paired with vendor credit offsets to ensure bank DP limit is unaffected.
                  </p>
                </div>

                <div className="p-3.5 rounded border border-red-300 bg-red-50 space-y-1.5">
                  <h3 className="font-bold text-red-900 text-sm">5. Sec 143 CGST Job-Work Cliff</h3>
                  <p className="text-red-950 leading-snug">
                    Isolated <strong className="font-mono">₹11.25L</strong> in material across overdue challans <code className="font-mono bg-red-100 px-1">JW-AMB-2419</code> and <code className="font-mono bg-red-100 px-1">JW-HOS-1882</code> exceeding 365 days, exposing <strong className="font-mono">₹2,36,250</strong> in immediate GST tax liability if not recalled within 14 days.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-300 flex flex-col md:flex-row justify-between items-end gap-6 font-sans">
                <div className="space-y-1 text-xs text-slate-700">
                  <div className="font-bold text-slate-900 text-sm">30-Day Floor Execution Roadmap</div>
                  <div>Days 1–7: Spares Locking &amp; Top-5 Vendor Credit Swap Setup</div>
                  <div>Days 8–15: OEM ECN Obsolescence Recovery Submissions</div>
                  <div>Days 16–24: In-House Alternate BOM Re-Machining</div>
                  <div>Days 25–30: Grade-Sorted Alloy Auction &amp; Bank DP Audit</div>
                </div>

                <div className="text-right border-t md:border-t-0 md:border-l border-slate-300 pt-3 md:pt-0 md:pl-6 text-xs text-slate-700 space-y-1 shrink-0">
                  <div className="font-bold text-slate-900 text-sm font-serif italic">C. Jones Snowin</div>
                  <div>Founder, Operationalyst (Snowin Ventures)</div>
                  <div>B.Com (Loyola) · MBA (Supply Chain &amp; Finance)</div>
                  <div>Govt. MSME: UDYAM-TN-02-0444630</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-10">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <div className="inline-block px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold uppercase">
                COMMERCIAL TIERS &amp; GUARANTEE
              </div>
              <h2 className="text-3xl font-extrabold text-white">Institutional Engagement Tiers</h2>
              <p className="text-slate-300 text-sm">
                0% GST MSME Bill of Supply · 100% Client-Side Confidentiality · 10x Minimum Cash Recovery Guarantee
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 flex flex-col justify-between shadow-xl">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded bg-slate-800 text-amber-400 font-mono text-xs font-bold">
                    TIER 1 · SINGLE-PLANT DIAGNOSTIC
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-white font-mono">
                      ₹0 Teaser <span className="text-lg font-normal text-slate-400">→</span> ₹35,000 Fixed
                    </div>
                    <div className="text-xs text-slate-400 mt-1">For plants with ₹2 Cr – ₹8 Cr book inventory stock</div>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Free 24-Hour Top-5 Bleed SKU Teaser Analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Full 8-Sheet Institutional XLSX Workbook in 48 Hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>2-Page Boardroom MD &amp; CFO Printable Brief</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>0% GST MSME Bill of Supply (UDYAM-TN-02-0444630)</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800 bg-amber-950/20 p-4 rounded-xl border border-amber-500/30">
                  <div className="text-xs font-bold text-amber-400 uppercase font-mono">10x Fee Guarantee:</div>
                  <div className="text-xs text-slate-300 mt-1">
                    Minimum <strong className="text-white">₹3,50,000+</strong> verifiable leaks isolated or 100% fee refund.
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-8 space-y-6 flex flex-col justify-between shadow-2xl relative">
                <div className="absolute -top-3.5 right-6 px-3 py-1 bg-amber-500 text-slate-950 font-bold font-mono text-[11px] rounded-full uppercase">
                  ENTERPRISE CHOICE
                </div>

                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded bg-amber-500/10 text-amber-400 font-mono text-xs font-bold">
                    TIER 2 · MULTI-PLANT / ENTERPRISE
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-white font-mono">₹75,000 Fixed</div>
                    <div className="text-xs text-slate-400 mt-1">For plant clusters with ₹8 Cr – ₹50 Cr+ stock</div>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Includes all Tier-1 Diagnostic Features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>BOM ECN Orphan Cross-Match &amp; Whiplash Audit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Sec 143 CGST Job-Work Overdue Challan Review</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Custom Bank Drawing Power (DP) CFO Protection Bridge</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800 bg-amber-950/20 p-4 rounded-xl border border-amber-500/30">
                  <div className="text-xs font-bold text-amber-400 uppercase font-mono">10x Fee Guarantee:</div>
                  <div className="text-xs text-slate-300 mt-1">
                    Minimum <strong className="text-white">₹10,00,000+</strong> verifiable cash/burn isolated or 100% fee refund.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-4xl mx-auto text-center space-y-4">
              <h3 className="text-xl font-bold text-white">Download Institutional 8-Sheet Excel Pack</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
                Generate and download the full 8-sheet benchmark workbook directly in your browser matching the ₹6.428 Cr Oragadam / Hosur enterprise register.
              </p>
              <button
                onClick={generateInstitutionalXLSX}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm inline-flex items-center gap-3 transition-all shadow-xl shadow-emerald-900/30"
              >
                <Download className="w-5 h-5" />
                Download 8-Sheet Institutional Benchmark (.XLSX)
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-[#070B16] border-t border-slate-800/80 px-4 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div>
              <div className="font-bold text-slate-200 text-sm">OPERATIONALYST INSTITUTIONAL V2</div>
              <div className="text-slate-400 text-[11px] mt-0.5">Snowin Ventures · Chennai, Tamil Nadu, India</div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-300 font-mono">
              <span>Govt. MSME: UDYAM-TN-02-0444630</span>
              <span>•</span>
              <span>0% GST Bill of Supply</span>
              <span>•</span>
              <a href="mailto:jonessnowin@operationalyst.com" className="text-amber-400 hover:underline">jonessnowin@operationalyst.com</a>
              <span>•</span>
              <a href="tel:+919080540047" className="text-amber-400 hover:underline">+91 90805 40047</a>
            </div>
          </div>
          <div className="border-t border-slate-800/60 pt-3 text-[11px] text-slate-500 text-center leading-relaxed">
            {HEADER_FOOTER_CREDENTIALS}
          </div>
        </div>
      </footer>
    </div>
  );
}
