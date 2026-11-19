/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Truck,
  Package,
  Scale,
  ScanBarcode,
  Radio,
  Sparkles,import { useState, useEffect, useMemo, type FormEvent, type ChangeEvent } from "react";

type RoomId = "home" | "sandbox" | "sample" | "methodology";
type SampleMode = "modeA" | "modeB";
type HitlistFilter = "all" | "action" | "spares";

interface ParsedSku {
  partId: string;
  desc: string;
  qty: number;
  cost: number;
  bookValue: number;
  daysIdle: number;
  annualBurn: number;
  isProtectedSpare: boolean;
  bracket: "0–90d Active" | "91–180d Slow" | "181–365d Non-Moving" | ">365d Dead Stock";
}

const AMBATTUR_20_CSV = `Part_ID,Part_Description,Closing_Stock_Qty,Unit_Cost_INR,Last_Movement_Date,Vendor_Name
PRG-4402-SS,CNC Machined Flange Housing SS316,185,4200,2025-11-10,Sri Lakshmi Precision Works
HSG-910-ALU,Die-Cast Gearbox Cover Housing,220,1900,2026-03-04,Apex Die Castings Pvt Ltd
SHF-208-EN24,Hardened Spline Drive Shaft EN24,95,3400,2025-09-18,Coimbatore Forgings Ltd
MTR-1.5KW-IE3,3-Phase Foot Mounted Motor 1.5kW,18,14800,2025-10-05,CG Power Industrial
VLV-330-BRS,Forged Brass Pressure Relief Valve,310,780,2026-01-19,Hosur Valve Tech
BRG-6209-ZZ,CNC Spindle Bearing Reserve Pack,45,3200,2025-12-02,SKF Authorised Industrial
SNS-PROX-24V,Inductive Spindle Sensor Spare M18,60,2150,2026-02-11,Omron Automation Channel
GSK-112-VTN,Viton High-Temp Manifold Seal Kit,640,290,2026-04-12,Polymer Seals India
PLT-804-MS,Laser-Cut Base Mounting Plate 12mm,150,1450,2026-06-28,Ambattur Laser Fab
CPL-FLEX-90,Elastomeric Jaw Coupling Spider 90,110,1250,2026-07-15,Fenner Power Trans
PMP-COOL-40L,Submersible Coolant Pump 40LPM,28,5600,2026-08-14,Rajamane Pumps Dealer
BLT-M16-109,High-Tensile Hex Bolt M16x65 10.9,2400,38,2026-10-20,Sundram Fasteners Dist
PIN-DOW-12M,Hardened Ground Dowel Pin Lot,950,65,2026-10-28,TVS Industrial Supply
BSH-BRZ-45,Phosphor Bronze Oilite Bush 45mm,190,890,2026-02-02,Madras Non-Ferrous
RNG-RET-72,Internal Circlip Heavy Duty 72mm,1600,24,2026-11-01,Spring Steel Corp
CBL-SRV-5M,Shielded CNC Servo Encoder Spare Cable,14,6800,2025-11-25,Fanuc Spares Desk
CAST-BODY-09,Raw Grey Iron Pump Casing FG260,88,3650,2025-08-29,Trichy Foundry Unit 2
NUT-LCK-M20,Nyloc Prevailing Torque Nut M20,1800,19,2026-10-12,Fastener House Padi
GEAR-HEL-32,Carburized Helical Pinion 32T,64,2950,2026-01-08,Hosur Gear Works
FLTR-HYD-10,Hydraulic Return Line Filter Spare,35,1950,2026-09-19,Parker Hydraulics`;

const DIRTY_TALLY_CSV = `Part_ID,Part_Description,Closing_Stock_Qty,Unit_Cost_INR,Last_Movement_Date,Party_Name,Supplier_GSTIN
  CAST-771-CI , Rough Machined Valve Bonnet  , 140 , 3850 , 14-08-2025 , Kaveri Castings , 33AABCK4491L1Z2
SHF-902-SS,Pump Impeller Shaft SS304,85,4600,2025/10/19,velmurugan engg,33AAFCV8821P1Z9
BRG-NU208,Cylindrical Roller Bearing CNC Spare,32,2900,05-12-2025,NBC Industrial,33AAACN1120K1Z5
,BLANK_CORRUPT_ROW_TEST,0,0,,Unknown,
HSG-404-AL,Anodized Actuator End Cap,310,920,2026-01-22,Sri Sai Die Cast,33ABDCS9910M1Z1
MTR-0.75KW, Flange Geared Motor 0.75kW , 16 , 11400 , 19-09-2025 , Bharat Bijlee Dealer , 33AAACB3319Q1Z4
FAST-KIT-04,SS316 Assembly Fastener Pack,1200,45,2026-10-15,Padi Industrial Store,33AAJFP2210D1Z8`;

const formatINR = (value: number): string => {
  return "₹" + Math.round(value || 0).toLocaleString("en-IN");
};

const parseFlexibleDate = (raw: string): Date | null => {
  const clean = (raw || "").trim();
  if (!clean) return null;
  const dmyMatch = clean.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    const dt = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
    return isNaN(dt.getTime()) ? null : dt;
  }
  const normalized = clean.replace(/\//g, "-");
  const dt = new Date(normalized);
  return isNaN(dt.getTime()) ? null : dt;
};

const computeLocalDigest = (input: string): string => {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return "LOCAL-" + (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
};

const resolveRoomFromUrl = (): RoomId => {
  if (typeof window === "undefined") return "home";
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  if (path.includes("/sandbox") || hash.includes("sandbox")) return "sandbox";
  if (path.includes("/sample-report") || path.includes("/audit") || hash.includes("sample")) return "sample";
  if (path.includes("/methodology") || path.includes("/pricing") || hash.includes("pricing")) return "methodology";
  return "home";
};

const IcebergEmblem = () => (
  <div className="w-8 h-8 rounded-lg bg-[#0B1221] border border-white/10 border-t-white/25 flex items-center justify-center shrink-0">
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.5L18 9.2H6L12 2.5Z" fill="#F8FAFC" />
      <line x1="3" y1="11" x2="21" y2="11" stroke="#475569" strokeWidth="1.2" />
      <path d="M5.5 12.6H18.5L12 21.5L5.5 12.6Z" fill="#F59E0B" />
    </svg>
  </div>
);

const SAMPLE_HITLIST_ROWS = [
  {
    partId: "PRG-4402-SS",
    desc: "CNC Machined Flange Housing SS316",
    days: 374,
    qty: 185,
    cost: 4200,
    val: 777000,
    burn: 170940,
    isSpare: false,
    action: "Supplier Credit Swap / Alternate Assembly Use",
  },
  {
    partId: "HSG-910-ALU",
    desc: "Die-Cast Gearbox Cover Housing (Rev-A)",
    days: 260,
    qty: 220,
    cost: 1900,
    val: 418000,
    burn: 91960,
    isSpare: false,
    action: "OEM Drawing Change (ECN) Recovery Claim",
  },
  {
    partId: "SHF-208-EN24",
    desc: "Hardened Spline Drive Shaft EN24",
    days: 427,
    qty: 95,
    cost: 3400,
    val: 323000,
    burn: 71060,
    isSpare: false,
    action: "Re-machine to Active Model or Scrap Bid",
  },
  {
    partId: "CAST-BODY-09",
    desc: "Raw Grey Iron Pump Casing FG260",
    days: 447,
    qty: 88,
    cost: 3650,
    val: 321200,
    burn: 70664,
    isSpare: false,
    action: "Foundry Melt Credit Adjustment",
  },
  {
    partId: "MTR-1.5KW-IE3",
    desc: "3-Phase Foot Mounted Motor 1.5kW",
    days: 410,
    qty: 18,
    cost: 14800,
    val: 266400,
    burn: 58608,
    isSpare: false,
    action: "Dealer Buyback / Cross-Plant Transfer",
  },
  {
    partId: "BRG-6209-ZZ",
    desc: "CNC High-Speed Spindle Bearing Reserve",
    days: 352,
    qty: 45,
    cost: 3200,
    val: 144000,
    burn: 31680,
    isSpare: true,
    action: "PROTECTED: Critical CNC Breakdown Spare",
  },
  {
    partId: "CBL-SRV-5M",
    desc: "Shielded CNC Servo Encoder Spare Cable",
    days: 359,
    qty: 14,
    cost: 6800,
    val: 95200,
    burn: 20944,
    isSpare: true,
    action: "PROTECTED: Zero-Downtime Machine Insurance",
  },
];

const COMMITTEE_ROLES = [
  {
    role: "Owner / MD / CFO",
    badge: "CAPITAL & BANKING",
    question: "How much working capital is needlessly stuck on racks, and what is it costing our bank OD limit every month?",
    answer:
      "Isolates the exact 15–25 high-value SKUs locking up ~76% of stagnant cash, stops the 22% annual holding drain, and aligns book stock cleanly before quarterly bank drawing-power and statutory audit reviews.",
    safeguard:
      "₹0 3-SKU teaser first. Full ₹18,000 MSME audit carries a 100% refund if under ₹2,50,000 in verifiable stock leaks are identified.",
    kpis: ["₹18,42,000 Idle (>180d) Flagged", "₹4,05,240/yr Holding Drain Quantified", "AS-2 & Bank Stock Statement Ready"],
  },
  {
    role: "Plant Head / GM Operations",
    badge: "SHOP-FLOOR LEADERSHIP",
    question: "Will an external stock audit disrupt production or make my stores and planning team look bad?",
    answer:
      "Every active factory accumulates idle stock from customer ECN drawing updates, supplier MOQs, and safety buffers. Findings are framed 100% as forward cash recovery—never backward blame on plant staff.",
    safeguard:
      "Item 07 CNC Spares Guard separates critical spindle bearings, sensors, and maintenance reserves so floor uptime is never risked.",
    kpis: ["Zero Blame, Forward Action Plan", "6 Critical CNC Spares Shielded", "Zero Production or ERP Downtime"],
  },
  {
    role: "Stores & Materials Manager",
    badge: "DAILY EXECUTION",
    question: "How many hours of manual Excel cleanup will my stores team have to do before sending the file?",
    answer:
      "Zero manual re-typing. Export 5 standard columns straight from Tally Prime, SAP, Busy, or Excel—mixed date formats, blank rows, and duplicate codes are cleaned automatically in Stage 02.",
    safeguard:
      "Delivers a clean, rack-ready 18-SKU check sheet rather than dumping a 10,000-line spreadsheet back on the stores desk.",
    kpis: ["Standard 5-Column Export Only", "Dirty Tally Dates Auto-Cleaned", "Focused 18-SKU Physical Check List"],
  },
  {
    role: "IT Head / Chartered Accountant",
    badge: "PRIVACY & STATUTORY AUDIT",
    question: "Do supplier names, customer identities, or ERP passwords ever leave our company laptop?",
    answer:
      "Zero ERP logins, zero cloud plugins, and automatic in-browser removal of Vendor Name, Customer Name, and GSTIN columns before submission—retaining only anonymous Part IDs, quantities, unit book costs, and dates.",
    safeguard:
      "All working files are permanently purged within 14 days backed by a signed DELCERT purge certificate. ₹14,400 wholesale CA partner desk available.",
    kpis: ["Vendor & GSTIN Columns Stripped Locally", "14-Day Signed Purge Certificate", "ICAI & CARO Clause 3(ii) Ready"],
  },
];

const WORKING_PAPERS = [
  { id: "01", format: "Sheet 01 · Health Log", title: "Ledger Completeness & Date Check", rule: "Verified Rows = Total Export − Blank or Duplicate Lines", desc: "Reconciles imported SKU count and total book value against your Tally or SAP stock summary before ageing begins." },
  { id: "02", format: "Sheet 02 · >180d Register", title: "Non-Moving Stock Isolation", rule: "Idle Days = Audit Date − Last Receipt or Issue Date", desc: "Separates every raw material, casting, and component untouched for 181–365 days and beyond 365 days." },
  { id: "03", format: "Sheet 03 · 90–180d Watch", title: "Slow-Moving Early Warning", rule: "Slow Bracket = Items Idle Between 91 and 180 Days", desc: "Catches decelerating batches early so procurement can pause repeat purchase orders before stock turns dead." },
  { id: "04", format: "Sheet 04 · Cost Drain", title: "22% Annual Carrying-Cost Ledger", rule: "Yearly Drain = Idle Stock Value × 22% Benchmark", desc: "Calculates monthly and yearly holding cost across 11.5% bank OD interest, 4.5% space, 2.5% insurance, and 3.5% scrap." },
  { id: "05", format: "Sheet 05 · 80/20 Rank", title: "Pareto Cash Concentration", rule: "Cumulative Value % Sorted Highest Rupee Exposure First", desc: "Pinpoints the top 15–25 high-cost SKUs typically locking up over 75% of all non-moving working capital." },
  { id: "06", format: "Sheet 06 · Floor Sheet", title: "Stores Action & Recovery Hitlist", rule: "Each Flagged SKU Mapped to Specific Floor Action", desc: "Practical disposition list categorizing vendor credit swaps, ECN customer claims, alternate BOM use, or scrap." },
  { id: "07", format: "Safety Filter · Shield", title: "Critical CNC Breakdown Spares Guard", rule: "Spindle, Bearing, Servo & Sensor Reserves Excluded from Scrap", desc: "Protects vital maintenance insurance spares so freeing working capital never causes an unplanned machine halt." },
  { id: "08", format: "2-Page A4 PDF Brief", title: "MD & CFO Boardroom Summary", rule: "One-Glance Executive Sheet for Monday Review Meetings", desc: "Crisp white printable summary built for promoters, CFOs, bank stock reviews, and statutory audit files." },
  { id: "09", format: "30-Min Live Walkthrough", title: "Direct Founder Review & 14-Day Purge", rule: "1-on-1 Review with C. Jones Snowin + Signed DELCERT", desc: "Walks plant leadership through priority recovery steps, followed by permanent file deletion within 14 days." },
];

export default function App() {
  const [activeRoom, setActiveRoom] = useState<RoomId>(resolveRoomFromUrl);
  const [auditModalOpen, setAuditModalOpen] = useState<boolean>(false);

  const [sampleMode, setSampleMode] = useState<SampleMode>("modeA");
  const [hitlistFilter, setHitlistFilter] = useState<HitlistFilter>("all");
  const [selectedRole, setSelectedRole] = useState<number>(0);

  const [csvText, setCsvText] = useState<string>("");
  const [odRate, setOdRate] = useState<number>(11.5);
  const [spaceRate, setSpaceRate] = useState<number>(4.5);
  const [insRate, setInsRate] = useState<number>(2.5);
  const [scrapRate, setScrapRate] = useState<number>(3.5);

  const [openFaq, setOpenFaq] = useState<number>(0);

  const [leadForm, setLeadForm] = useState({
    name: "",
    company: "",
    erp: "Tally Prime",
    contact: "",
  });
  const [submittedCert, setSubmittedCert] = useState<string>("");

  const totalHoldingRate = Number((odRate + spaceRate + insRate + scrapRate).toFixed(1));

  useEffect(() => {
    const syncRoute = () => setActiveRoom(resolveRoomFromUrl());
    window.addEventListener("popstate", syncRoute);
    window.addEventListener("hashchange", syncRoute);
    return () => {
      window.removeEventListener("popstate", syncRoute);
      window.removeEventListener("hashchange", syncRoute);
    };
  }, []);

  useEffect(() => {
    const titles: Record<RoomId, string> = {
      home: "Operationalyst — Factory Stock & Working Capital Audit",
      sandbox: "CSV Sandbox | Operationalyst",
      sample: "Sample A4 Audit Brief | Operationalyst",
      methodology: "Rules & Pricing | Operationalyst",
    };
    document.title = titles[activeRoom];
  }, [activeRoom]);

  const navigateRoom = (room: RoomId, customPath?: string) => {
    const paths: Record<RoomId, string> = {
      home: "/",
      sandbox: "/sandbox",
      sample: "/sample-report",
      methodology: "/methodology",
    };
    const nextPath = customPath || paths[room];
    if (typeof window !== "undefined" && window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setActiveRoom(room);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sandboxData = useMemo(() => {
    if (!csvText.trim()) return null;
    const rawLines = csvText.trim().split(/\r?\n/);
    if (rawLines.length < 2) return null;

    const headers = rawLines[0].split(",").map((h) => h.trim());
    const strippedColumns = headers.filter((h) => /vendor|party|supplier|customer|gst/i.test(h));

    const auditDate = new Date("2026-11-19");
    const validRows: ParsedSku[] = [];
    let skippedDirtyRows = 0;
    let normalizedDateCount = 0;

    for (let i = 1; i < rawLines.length; i++) {
      const cols = rawLines[i].split(",").map((c) => c.trim());
      if (cols.length < 5 || !cols[0]) {
        skippedDirtyRows++;
        continue;
      }
      const [partId, desc, qtyStr, costStr, dateStr] = cols;
      const qty = parseFloat(qtyStr);
      const cost = parseFloat(costStr);
      if (isNaN(qty) || isNaN(cost) || qty <= 0) {
        skippedDirtyRows++;
        continue;
      }

      if (/^\d{1,2}[-/]\d{1,2}[-/](\d{4})$/.test(dateStr) || dateStr.includes("/")) {
        normalizedDateCount++;
      }

      const parsedDate = parseFlexibleDate(dateStr);
      const daysIdle = parsedDate
        ? Math.max(0, Math.floor((auditDate.getTime() - parsedDate.getTime()) / 86400000))
        : 240;

      const bookValue = qty * cost;
      const annualBurn = bookValue * (totalHoldingRate / 100);
      const isProtectedSpare = /bearing|spindle|sensor|servo|spare/i.test(desc);

      let bracket: ParsedSku["bracket"] = "0–90d Active";
      if (daysIdle > 365) bracket = ">365d Dead Stock";
      else if (daysIdle > 180) bracket = "181–365d Non-Moving";
      else if (daysIdle >= 91) bracket = "91–180d Slow";

      validRows.push({
        partId,
        desc,
        qty,
        cost,
        bookValue,
        daysIdle,
        annualBurn,
        isProtectedSpare,
        bracket,
      });
    }

    const totalValue = validRows.reduce((s, r) => s + r.bookValue, 0);
    const nonMovingAll = validRows
      .filter((r) => r.daysIdle > 180)
      .sort((a, b) => b.bookValue - a.bookValue);
    const nonMovingValue = nonMovingAll.reduce((s, r) => s + r.bookValue, 0);
    const sparesShielded = nonMovingAll.filter((r) => r.isProtectedSpare);
    const annualBurnOnDead = nonMovingValue * (totalHoldingRate / 100);

    return {
      sessionDigest: computeLocalDigest(csvText),
      totalSkus: validRows.length,
      skippedDirtyRows,
      normalizedDateCount,
      strippedColumns,
      totalValue,
      nonMovingCount: nonMovingAll.length,
      nonMovingValue,
      annualBurnOnDead,
      sparesShieldedCount: sparesShielded.length,
      topHitlist: nonMovingAll,
      cleanRows: validRows,
    };
  }, [csvText, totalHoldingRate]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setCsvText(String(evt.target?.result || ""));
    reader.readAsText(file);
  };

  const downloadCleanCsv = () => {
    const header = "Part_ID,Part_Description,Closing_Stock_Qty,Unit_Cost_INR,Days_Idle,Book_Value_INR,CNC_Spare_Guard\n";
    const body = sandboxData
      ? sandboxData.cleanRows
          .map(
            (r) =>
              `${r.partId},"${r.desc}",${r.qty},${r.cost},${r.daysIdle},${Math.round(r.bookValue)},${
                r.isProtectedSpare ? "PROTECTED_SPARE" : "REVIEW"
              }`
          )
          .join("\n")
      : "SKU-1001,Sample Cast Housing,120,2400,290,288000,REVIEW";
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = sandboxData ? "Operationalyst_Sanitized_5Col.csv" : "Operationalyst_5_Column_Template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAuditSubmit = (e: FormEvent) => {
    e.preventDefault();
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    setSubmittedCert(`DELCERT-2026-${randomCode}`);
  };

  const filteredSampleRows = useMemo(() => {
    if (hitlistFilter === "action") return SAMPLE_HITLIST_ROWS.filter((r) => !r.isSpare);
    if (hitlistFilter === "spares") return SAMPLE_HITLIST_ROWS.filter((r) => r.isSpare);
    return SAMPLE_HITLIST_ROWS;
  }, [hitlistFilter]);

  const whatsappHref = useMemo(() => {
    const protocol = "https://";
    const domain = ["api", "whatsapp", "com"].join(".");
    const msg = `Hi Jones, reserved Operationalyst 48-Hr Audit (${submittedCert}) for ${leadForm.company} (${leadForm.erp}). Please share the 5-column stock template.`;
    return `${protocol}${domain}/send?phone=919080540047&text=${encodeURIComponent(msg)}`;
  }, [submittedCert, leadForm.company, leadForm.erp]);

  return (
    <div className="min-h-screen bg-[#050811] text-[#F8FAFC] flex flex-col justify-between overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* ULTRA-MINIMALIST ARCHITECTURAL HEADER */}
      <header className="no-print sticky top-0 z-40 bg-[#050811]/85 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <button
            onClick={() => navigateRoom("home", "/")}
            className="flex items-center gap-3 text-left focus:outline-none shrink-0"
          >
            <IcebergEmblem />
            <span className="text-sm font-bold tracking-[0.08em] text-white">OPERATIONALYST</span>
          </button>

          <nav className="hidden md:flex items-center gap-7 text-sm">
            {(
              [
                { id: "home", path: "/", label: "Overview" },
                { id: "sandbox", path: "/sandbox", label: "Sandbox" },
                { id: "sample", path: "/sample-report", label: "Sample Brief" },
                { id: "methodology", path: "/methodology", label: "Pricing & Rules" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigateRoom(tab.id, tab.path)}
                className={`whitespace-nowrap transition-colors duration-200 ${
                  activeRoom === tab.id ? "text-white font-semibold" : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setAuditModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 text-xs font-semibold text-white whitespace-nowrap transition-all shrink-0"
          >
            48-Hr Audit
          </button>
        </div>

        <div className="flex md:hidden border-t border-white/[0.05] px-6 py-2.5 gap-5 overflow-x-auto text-xs">
          {(
            [
              { id: "home", path: "/", label: "Overview" },
              { id: "sandbox", path: "/sandbox", label: "Sandbox" },
              { id: "sample", path: "/sample-report", label: "Sample Brief" },
              { id: "methodology", path: "/methodology", label: "Pricing & Rules" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigateRoom(tab.id, tab.path)}
              className={`whitespace-nowrap ${
                activeRoom === tab.id ? "text-white font-semibold" : "text-slate-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* =====================================================================
          ROOM 1: ULTRA-MINIMALIST, STRAIGHT-TO-THE-POINT FRONT PAGE (/)
         ===================================================================== */}
      {activeRoom === "home" && (
        <main className="no-print relative flex-1 flex flex-col justify-center">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 42% at 50% 0%, rgba(30, 58, 138, 0.16), transparent 70%)",
            }}
          />

          <div className="relative max-w-6xl w-full mx-auto px-6 pt-16 pb-16 lg:pt-24 lg:pb-20">
            {/* 1. Core Statement & Single Isolated Bullion-Gold Button */}
            <div className="max-w-3xl space-y-6">
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400">
                Manufacturing Working-Capital Audit
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-[-0.035em] text-white leading-[1.08]">
                Find the cash trapped in your factory stock in 48 hours.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Operationalyst audits one 5-column Tally, SAP, or Excel stock sheet to isolate non-moving inventory
                (&gt;180 days) burning 22% a year—with zero vendor names and zero ERP setup.
              </p>

              <div className="pt-3 space-y-3">
                <div className="flex flex-wrap items-center gap-6">
                  <button
                    onClick={() => setAuditModalOpen(true)}
                    className="px-7 py-4 rounded-lg bg-gradient-to-b from-[#FBBF24] via-[#F59E0B] to-[#D97706] hover:brightness-105 text-[#050811] font-bold text-sm sm:text-base whitespace-nowrap transition-all shadow-[0_0_0_1px_rgba(251,191,36,0.5),0_12px_30px_-6px_rgba(245,158,11,0.35)]"
                  >
                    Request 48-Hr Audit (₹0 Teaser First) →
                  </button>

                  <button
                    onClick={() => navigateRoom("sample", "/sample-report")}
                    className="text-sm font-medium text-slate-300 hover:text-white underline underline-offset-4 decoration-white/25 hover:decoration-white transition-colors whitespace-nowrap"
                  >
                    View Sample A4 Brief
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Reviewed personally by C. Jones Snowin · Critical CNC spares shielded · 14-day signed file purge
                </p>
              </div>
            </div>

            {/* 2. Three Razor-Sharp Proof Metrics (Hairline Strip, Zero Box Clutter) */}
            <div className="mt-16 pt-10 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-2xl font-mono font-bold text-white tabular-nums">5 Columns</div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Part ID, Description, Qty, Unit Cost &amp; Date. Supplier names never leave your laptop.
                </p>
              </div>

              <div>
                <div className="text-2xl font-mono font-bold text-white tabular-nums">22% / Year</div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Typical holding drain stopped across bank OD interest, floor space, and scrap risk.
                </p>
              </div>

              <div>
                <div className="text-2xl font-mono font-bold text-amber-400 tabular-nums">₹2,50,000</div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Minimum verifiable stock leak guarantee on the ₹18,000 MSME audit—or 100% refund.
                </p>
              </div>
            </div>

            {/* 3. Clean Doorways Leading Inside the Platform */}
            <div className="mt-10 pt-8 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => navigateRoom("sandbox", "/sandbox")}
                className="group flex items-center justify-between px-5 py-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.07] text-left transition-all"
              >
                <div>
                  <div className="text-[11px] font-mono text-slate-500">01 · LOCAL ENGINE</div>
                  <div className="text-sm font-semibold text-white mt-0.5">Test 5-Column CSV Sandbox</div>
                </div>
                <span className="text-slate-400 group-hover:text-amber-400 transition-colors">→</span>
              </button>

              <button
                onClick={() => navigateRoom("sample", "/sample-report")}
                className="group flex items-center justify-between px-5 py-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.07] text-left transition-all"
              >
                <div>
                  <div className="text-[11px] font-mono text-slate-500">02 · BOARDROOM PROOF</div>
                  <div className="text-sm font-semibold text-white mt-0.5">Sample Report &amp; White A4 Brief</div>
                </div>
                <span className="text-slate-400 group-hover:text-amber-400 transition-colors">→</span>
              </button>

              <button
                onClick={() => navigateRoom("methodology", "/methodology")}
                className="group flex items-center justify-between px-5 py-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.07] text-left transition-all"
              >
                <div>
                  <div className="text-[11px] font-mono text-slate-500">03 · COMMERCIAL TERMS</div>
                  <div className="text-sm font-semibold text-white mt-0.5">Audit Rules, ₹18k Pilot &amp; CA Desk</div>
                </div>
                <span className="text-slate-400 group-hover:text-amber-400 transition-colors">→</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          ROOM 2 (INSIDE): 5-COLUMN LOCAL CSV SANDBOX
         ===================================================================== */}
      {activeRoom === "sandbox" && (
        <main className="no-print flex-1 max-w-6xl w-full mx-auto px-6 py-14 space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-mono text-emerald-400">RUNS ON YOUR LAPTOP · ZERO SERVER UPLOAD</div>
              <h1 className="text-3xl font-bold text-white tracking-tight">5-Column Stock Ageing Sandbox</h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                Load our 20-SKU Ambattur CNC dataset, stress-test a messy Tally Prime export, or drop your own CSV.
                Supplier names and GSTIN columns are ignored automatically inside browser memory.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setCsvText(AMBATTUR_20_CSV)}
                className="px-4 py-2.5 rounded-lg bg-gradient-to-b from-[#FBBF24] via-[#F59E0B] to-[#D97706] text-[#050811] font-bold text-xs whitespace-nowrap"
              >
                Load 20-SKU Ambattur CNC Sheet
              </button>
              <button
                onClick={() => setCsvText(DIRTY_TALLY_CSV)}
                className="px-4 py-2.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15 font-semibold text-xs whitespace-nowrap"
              >
                Test Messy Tally Export
              </button>
              <button
                onClick={downloadCleanCsv}
                className="px-4 py-2.5 rounded-lg bg-[#0B1221] hover:bg-white/[0.06] text-slate-200 border border-white/10 font-medium text-xs whitespace-nowrap"
              >
                {sandboxData ? "Export Clean 5-Col CSV" : "Download Blank Template"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-5">
              <label className="block rounded-xl bg-[#0B1221] border border-dashed border-white/20 hover:border-amber-400 p-8 text-center cursor-pointer transition-colors">
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                <div className="text-sm font-bold text-white">Select or Drop 5-Column .CSV Stock Export</div>
                <div className="text-xs text-slate-400 font-mono mt-2 break-words">
                  Part_ID, Part_Description, Closing_Stock_Qty, Unit_Cost_INR, Last_Movement_Date
                </div>
              </label>

              <div className="rounded-xl bg-[#0B1221] border border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm font-bold text-white">Annual Carrying-Cost Breakdown</span>
                  <span className="font-mono text-base font-bold text-amber-400">{totalHoldingRate}% / yr</span>
                </div>

                {[
                  { label: "Bank CC / OD Interest", val: odRate, set: setOdRate, min: 7, max: 16 },
                  { label: "Warehouse Space & Racks", val: spaceRate, set: setSpaceRate, min: 2, max: 8 },
                  { label: "Insurance & Handling", val: insRate, set: setInsRate, min: 1, max: 5 },
                  { label: "Rust, ECN & Scrap Risk", val: scrapRate, set: setScrapRate, min: 1, max: 8 },
                ].map((s) => (
                  <div key={s.label} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{s.label}</span>
                      <span className="font-mono text-white">{s.val.toFixed(1)}%</span>
                    </div>
                    <input
                      type="range"
                      step="0.5"
                      min={s.min}
                      max={s.max}
                      value={s.val}
                      onChange={(e) => s.set(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                ))}
              </div>

              {sandboxData && (
                <div className="rounded-xl bg-[#0B1221] border border-white/10 p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Local Browser Verification</span>
                    <span className="font-mono text-emerald-400">{sandboxData.sessionDigest}</span>
                  </div>
                  {sandboxData.strippedColumns.length > 0 && (
                    <div className="text-emerald-300">
                      ✓ Stripped private columns locally:{" "}
                      <span className="font-mono">{sandboxData.strippedColumns.join(", ")}</span>
                    </div>
                  )}
                  {(sandboxData.normalizedDateCount > 0 || sandboxData.skippedDirtyRows > 0) && (
                    <div className="text-slate-300">
                      ✓ Cleaned {sandboxData.normalizedDateCount} mixed Tally dates &amp; skipped{" "}
                      {sandboxData.skippedDirtyRows} corrupt blank row(s).
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-7">
              {!sandboxData ? (
                <div className="h-full min-h-[320px] rounded-xl bg-[#0B1221] border border-white/10 p-10 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="text-lg font-bold text-white">Ready to Inspect Your Stock Velocity</div>
                  <p className="text-sm text-slate-400 max-w-md">
                    Click <strong className="text-white">Load 20-SKU Ambattur CNC Sheet</strong> above to see instant
                    non-moving rupee exposure, annual holding drain, and CNC spares protection.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-[#0B1221] border border-white/10 p-6 space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div className="p-3.5 rounded-lg bg-[#050811] border border-white/[0.07]">
                      <div className="text-[11px] text-slate-400">Analysed ({sandboxData.totalSkus} SKUs)</div>
                      <div className="text-lg font-mono font-bold text-white tabular-nums mt-1">
                        {formatINR(sandboxData.totalValue)}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#050811] border border-amber-500/35">
                      <div className="text-[11px] text-slate-300">Idle &gt;180d ({sandboxData.nonMovingCount})</div>
                      <div className="text-lg font-mono font-bold text-amber-400 tabular-nums mt-1">
                        {formatINR(sandboxData.nonMovingValue)}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#050811] border border-white/[0.07]">
                      <div className="text-[11px] text-slate-400">Yearly Drain ({totalHoldingRate}%)</div>
                      <div className="text-lg font-mono font-bold text-white tabular-nums mt-1">
                        {formatINR(sandboxData.annualBurnOnDead)}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#050811] border border-emerald-500/25">
                      <div className="text-[11px] text-emerald-300">CNC Spares Shielded</div>
                      <div className="text-lg font-mono font-bold text-emerald-400 tabular-nums mt-1">
                        {sandboxData.sparesShieldedCount} SKUs
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="text-xs uppercase tracking-wider text-slate-400">
                      Top 3 Non-Moving SKUs (₹0 Diagnostic Teaser)
                    </div>
                    {sandboxData.topHitlist.slice(0, 3).map((item) => (
                      <div
                        key={item.partId}
                        className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-lg bg-[#050811] border border-white/[0.07] text-sm"
                      >
                        <div>
                          <span className="font-mono font-bold text-white">{item.partId}</span>
                          <span className="text-slate-300 ml-2">{item.desc}</span>
                          <span className="text-xs font-mono text-slate-400 ml-2">
                            ({item.daysIdle}d · {item.bracket})
                          </span>
                          {item.isProtectedSpare && (
                            <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              CNC SPARE SHIELDED
                            </span>
                          )}
                        </div>
                        <div className="font-mono font-bold text-amber-400 tabular-nums">
                          {formatINR(item.bookValue)}
                        </div>
                      </div>
                    ))}

                    {sandboxData.topHitlist.length > 3 && (
                      <div className="p-4 rounded-lg bg-[#050811] border border-white/10 flex flex-wrap items-center justify-between gap-4">
                        <div className="text-xs text-slate-300">
                          + <strong>{sandboxData.topHitlist.length - 3} more stagnant SKUs</strong> isolated in the full
                          6-sheet workbook with floor recovery actions.
                        </div>
                        <button
                          onClick={() => setAuditModalOpen(true)}
                          className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-[#050811] font-bold text-xs whitespace-nowrap"
                        >
                          Unlock Full 48-Hr Audit →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* =====================================================================
          ROOM 3 (INSIDE): SAMPLE REPORT + CRISP WHITE PRINTABLE A4 BRIEF
         ===================================================================== */}
      {activeRoom === "sample" && (
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-14 space-y-16">
          <div className="no-print flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div>
              <div className="text-xs font-mono text-slate-400">RECONCILED AUDIT DOSSIER PREVIEW</div>
              <h1 className="text-3xl font-bold text-white mt-1">
                Sample Factory Stock Audit &amp; Printable MD Brief
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-lg bg-[#0B1221] p-1 border border-white/10 text-xs font-semibold">
                <button
                  onClick={() => setSampleMode("modeA")}
                  className={`px-3.5 py-2 rounded-md transition-all ${
                    sampleMode === "modeA" ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  12,400-SKU Auto Plant
                </button>
                <button
                  onClick={() => setSampleMode("modeB")}
                  className={`px-3.5 py-2 rounded-md transition-all ${
                    sampleMode === "modeB" ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  20-SKU Ambattur CNC
                </button>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-lg bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs whitespace-nowrap shadow"
              >
                Print / Save White A4 Brief
              </button>
            </div>
          </div>

          <section aria-label="Printable Executive Brief" className="space-y-4">
            <div className="no-print flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span>DELIVERABLE ITEM 08 · ACTUAL BOARDROOM PAPER PREVIEW (A4 PRINT-READY)</span>
              <span>Aligned with AS-2 Valuation &amp; CARO Clause 3(ii) Stock Reviews</span>
            </div>

            <div className="p-1.5 rounded-2xl bg-white/[0.04] border border-white/15">
              <div className="print-sheet rounded-xl bg-white text-slate-900 p-7 sm:p-10 shadow-2xl border border-slate-200 space-y-7">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-slate-900 pb-5">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-slate-500">
                      Operationalyst · Snowin Ventures (Chennai)
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 mt-1">
                      Executive Inventory Ageing &amp; Working Capital Brief
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Prepared for Management, CFO &amp; Statutory Stock Audit Review · Reviewed by C. Jones Snowin
                    </p>
                  </div>
                  <div className="text-left sm:text-right font-mono text-xs text-slate-600 space-y-0.5">
                    <div className="font-bold text-slate-900">
                      Ref: {sampleMode === "modeA" ? "OPL-2026-TIER1-01" : "OPL-2026-AMB-20"}
                    </div>
                    <div>Udyam: UDYAM-TN-02-0444630</div>
                    <div>Purge Cert: DELCERT-2026-9F4A</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {(sampleMode === "modeA"
                    ? [
                        { k: "Total Stock Reconciled", v: "₹4,82,50,000", s: "12,400 Line Items (99.8% Match)" },
                        { k: "Idle Past 180 Days", v: "₹18,42,000", s: "24 Dormant SKUs (3.8% Share)", strong: true },
                        { k: "22% Yearly Holding Drain", v: "₹4,05,240 / yr", s: "₹33,770 / mo OD & Space Cost" },
                        { k: "CNC Spares Protected", v: "6 Critical SKUs", s: "₹3,14,000 Excluded from Scrap" },
                      ]
                    : [
                        { k: "Total Stock Reconciled", v: "₹38,50,350", s: "20 Precision CNC SKUs" },
                        { k: "Idle Past 180 Days", v: "₹30,29,150", s: "9 Dormant Batches Flagged", strong: true },
                        { k: "22% Yearly Holding Drain", v: "₹6,66,413 / yr", s: "₹55,534 / mo OD & Space Cost" },
                        { k: "CNC Spares Protected", v: "3 Critical SKUs", s: "Bearings, Sensor & Servo Cable" },
                      ]
                  ).map((box) => (
                    <div
                      key={box.k}
                      className={`p-4 rounded-lg border ${
                        box.strong ? "bg-amber-50/70 border-amber-400" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{box.k}</div>
                      <div className="text-xl font-mono font-bold text-slate-950 tabular-nums mt-1">{box.v}</div>
                      <div className="text-xs text-slate-600 mt-1">{box.s}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Schedule A · Reconciled Inventory Ageing &amp; Carrying-Cost Summary
                  </div>
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                          <th className="py-2.5 px-4 font-bold">Ageing Bracket</th>
                          <th className="py-2.5 px-4 font-bold">SKU Count</th>
                          <th className="py-2.5 px-4 font-bold">Book Value (₹)</th>
                          <th className="py-2.5 px-4 font-bold">22% Annual Drain</th>
                          <th className="py-2.5 px-4 font-bold">Management &amp; AS-2 Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        <tr>
                          <td className="py-2.5 px-4 font-medium">0–90 Days (Active Stock)</td>
                          <td className="py-2.5 px-4 font-mono">12,335</td>
                          <td className="py-2.5 px-4 font-mono tabular-nums">₹4,31,48,000</td>
                          <td className="py-2.5 px-4 font-mono text-slate-400">—</td>
                          <td className="py-2.5 px-4">Normal production cycle; no intervention</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-medium">91–180 Days (Slow-Moving)</td>
                          <td className="py-2.5 px-4 font-mono">41</td>
                          <td className="py-2.5 px-4 font-mono tabular-nums">₹32,60,000</td>
                          <td className="py-2.5 px-4 font-mono tabular-nums">₹7,17,200</td>
                          <td className="py-2.5 px-4">Pause repeat auto-reorder POs in Tally/SAP</td>
                        </tr>
                        <tr className="bg-amber-50/50">
                          <td className="py-2.5 px-4 font-bold text-slate-950">181–365 Days (Non-Moving)</td>
                          <td className="py-2.5 px-4 font-mono font-bold">11</td>
                          <td className="py-2.5 px-4 font-mono font-bold tabular-nums">₹7,94,000</td>
                          <td className="py-2.5 px-4 font-mono font-bold tabular-nums">₹1,74,680</td>
                          <td className="py-2.5 px-4 font-medium">Supplier credit swap or alternate BOM issue</td>
                        </tr>
                        <tr className="bg-amber-50/80">
                          <td className="py-2.5 px-4 font-bold text-slate-950">&gt;365 Days (Obsolete / Dead)</td>
                          <td className="py-2.5 px-4 font-mono font-bold">7</td>
                          <td className="py-2.5 px-4 font-mono font-bold tabular-nums">₹7,34,000</td>
                          <td className="py-2.5 px-4 font-mono font-bold tabular-nums">₹1,61,480</td>
                          <td className="py-2.5 px-4 font-medium">ECN claim, NRV provision review &amp; liquidation</td>
                        </tr>
                        <tr className="bg-emerald-50/60">
                          <td className="py-2.5 px-4 font-semibold text-emerald-950">Item 07 Protected CNC Spares</td>
                          <td className="py-2.5 px-4 font-mono">6</td>
                          <td className="py-2.5 px-4 font-mono tabular-nums">₹3,14,000</td>
                          <td className="py-2.5 px-4 font-mono tabular-nums">₹69,080</td>
                          <td className="py-2.5 px-4 text-emerald-900 font-medium">
                            Retain on rack — critical machine breakdown reserve
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-600">
                  <div>
                    <strong>Audit Scope Note:</strong> Prepared from client 5-column stock register to assist working
                    capital release, AS-2 slow/obsolete review, and bank stock-statement reconciliation.
                  </div>
                  <div className="font-mono text-slate-900 font-semibold">
                    Signed: C. Jones Snowin · Operationalyst Audit Desk
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="no-print space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">Priority SKU Floor Hitlist (Sheet 06 Preview)</h2>
              <div className="inline-flex rounded-lg bg-[#0B1221] p-1 border border-white/10 text-xs">
                {(
                  [
                    ["all", "All Flagged SKUs"],
                    ["action", "Cash Recovery Candidates"],
                    ["spares", "Protected CNC Spares"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setHitlistFilter(key)}
                    className={`px-3 py-1.5 rounded-md font-medium ${
                      hitlistFilter === key ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl bg-[#0B1221] border border-white/10">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-slate-400 bg-[#050811]">
                    <th className="py-3.5 px-5">Part ID &amp; Description</th>
                    <th className="py-3.5 px-4">Idle Days</th>
                    <th className="py-3.5 px-4">Book Value</th>
                    <th className="py-3.5 px-4">22% Drain/Yr</th>
                    <th className="py-3.5 px-5">Recommended Floor Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredSampleRows.map((row) => (
                    <tr key={row.partId} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-5">
                        <div className="font-mono font-bold text-white">{row.partId}</div>
                        <div className="text-xs text-slate-300">{row.desc}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-200">{row.days}d</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400 tabular-nums">
                        {formatINR(row.val)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300 tabular-nums">{formatINR(row.burn)}</td>
                      <td className="py-3.5 px-5 text-xs">
                        <span
                          className={`px-2.5 py-1 rounded font-medium inline-block ${
                            row.isSpare
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                              : "bg-white/[0.07] text-slate-200"
                          }`}
                        >
                          {row.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="no-print space-y-6">
            <h2 className="text-2xl font-bold text-white">Zero-Blame Alignment Across Every Plant Seat</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {COMMITTEE_ROLES.map((item, idx) => (
                <button
                  key={item.role}
                  onClick={() => setSelectedRole(idx)}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    selectedRole === idx
                      ? "bg-white/[0.1] border-white/25 text-white"
                      : "bg-[#0B1221] border-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  <div className="text-[11px] font-mono text-slate-400">{item.badge}</div>
                  <div className="text-sm font-bold mt-1">{item.role}</div>
                </button>
              ))}
            </div>

            <div className="rounded-xl bg-[#0B1221] border border-white/10 p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs font-mono text-emerald-400">{COMMITTEE_ROLES[selectedRole].badge}</div>
                <h3 className="text-xl font-bold text-white leading-snug">
                  “{COMMITTEE_ROLES[selectedRole].question}”
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">{COMMITTEE_ROLES[selectedRole].answer}</p>
                <div className="p-4 rounded-lg bg-[#050811] border border-white/[0.08] text-xs text-slate-300">
                  <strong className="text-white">Built-In Safeguard:</strong>{" "}
                  {COMMITTEE_ROLES[selectedRole].safeguard}
                </div>
              </div>
              <div className="lg:col-span-5 rounded-xl bg-[#050811] border border-white/[0.08] p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <div className="text-xs uppercase tracking-wider text-slate-400">Deliverables Prepared</div>
                  {COMMITTEE_ROLES[selectedRole].kpis.map((k) => (
                    <div key={k} className="text-sm font-medium text-white flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> {k}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setAuditModalOpen(true)}
                  className="w-full py-3 rounded-lg bg-gradient-to-b from-[#FBBF24] via-[#F59E0B] to-[#D97706] text-[#050811] font-bold text-sm"
                >
                  Request 48-Hr Factory Audit →
                </button>
              </div>
            </div>
          </section>

          <section className="no-print space-y-6">
            <h2 className="text-2xl font-bold text-white">All 9 Working Papers Included in Your 48-Hour Pack</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {WORKING_PAPERS.map((wp) => (
                <div
                  key={wp.id}
                  className="rounded-xl bg-[#0B1221] border border-white/10 p-6 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>PAPER {wp.id}</span>
                    <span>{wp.format}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{wp.title}</h3>
                  <div className="text-[11px] font-mono text-slate-200 bg-[#050811] px-2.5 py-1.5 rounded border border-white/[0.06] break-words">
                    {wp.rule}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{wp.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* =====================================================================
          ROOM 4 (INSIDE): PLAIN ACCOUNTING RULES, P1-P4 MATRIX & PRICING
         ===================================================================== */}
      {activeRoom === "methodology" && (
        <main className="no-print flex-1 max-w-6xl w-full mx-auto px-6 py-14 space-y-16">
          <section className="space-y-6">
            <div className="max-w-2xl">
              <div className="text-xs font-mono text-slate-400">PLAIN COST-ACCOUNTING · ZERO BLACK-BOX GUESSING</div>
              <h1 className="text-3xl font-bold text-white mt-1">How the 6-Stage Factory Stock Audit Works</h1>
              <p className="text-slate-300 mt-2 text-sm leading-relaxed">
                Every rupee in your report reconciles directly back to your own Tally Prime, SAP, or Excel stock
                balance—written in plain accounting terms your CFO and statutory auditor can verify in minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  tag: "STAGE 01 · PRIVACY FILTER",
                  step: "Supplier & Customer Confidentiality",
                  formula: "Shared File = 5 Stock Columns Only (Vendor Names & GSTINs Removed)",
                  desc: "Only Part ID, Description, Closing Qty, Unit Cost, and Last Movement Date are used. Supplier names, customer names, and GSTINs never leave your computer.",
                },
                {
                  tag: "STAGE 02 · LEDGER TIE-OUT",
                  step: "Stock Summary Reconciliation",
                  formula: "Item Book Value = Closing Qty × Unit Cost (Agreed to Stock Summary)",
                  desc: "Cleans mixed Indian date formats, flags negative or blank stock lines, and agrees total book value to your general ledger stock summary.",
                },
                {
                  tag: "STAGE 03 · IDLE-DAY AGEING",
                  step: "Movement Bracket Classification",
                  formula: "Days Untouched = Audit Date − Last Issue or Receipt Date",
                  desc: "Groups every item cleanly into 0–90d Active, 91–180d Slow-Moving, 181–365d Non-Moving, and >365d Obsolete brackets.",
                },
                {
                  tag: "STAGE 04 · CARRYING DRAIN",
                  step: "22% Annual Holding-Cost Burn",
                  formula: "Yearly Cash Drain = Idle Stock Value × (11.5% OD + 4.5% Space + 2.5% Ins + 3.5% Scrap)",
                  desc: "Shows management the real monthly cash cost of keeping non-moving inventory funded on bank working-capital limits.",
                },
                {
                  tag: "STAGE 05 · PARETO FOCUS",
                  step: "80/20 Rupee Concentration Rank",
                  formula: "Priority Hitlist = Top 15–25 SKUs Holding ~76% of Stagnant Cash",
                  desc: "Focuses floor teams on the small handful of castings, motors, and assemblies locking up the bulk of trapped cash.",
                },
                {
                  tag: "STAGE 06 · UPTIME SHIELD",
                  step: "CNC Breakdown Spares Protection",
                  formula: "Critical Maintenance Spares = Tagged 'Retain' & Excluded from Liquidation",
                  desc: "Separates vital spindle bearings, servo cables, and sensors so freeing cash never puts factory uptime at risk.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="rounded-xl bg-[#0B1221] border border-white/10 p-6 space-y-3"
                >
                  <div className="text-[11px] font-mono text-slate-400">{s.tag}</div>
                  <div className="text-base font-bold text-white">{s.step}</div>
                  <div className="p-3 rounded-lg bg-[#050811] border border-white/[0.08] font-mono text-xs text-slate-200 whitespace-normal break-words">
                    {s.formula}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="pricing" className="space-y-8">
            <div className="max-w-2xl">
              <div className="text-xs font-mono text-slate-300">
                0% GST MSME BILL OF SUPPLY · UDYAM-TN-02-0444630
              </div>
              <h2 className="text-3xl font-bold text-white mt-1">Flat, Transparent Audit Pricing</h2>
              <p className="text-slate-300 mt-2 text-sm">
                Start with a ₹0 3-SKU teaser. Actual cash recovery depends on shop-floor execution; our guarantee covers
                identifying at least ₹2,50,000 in verifiable stock leaks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl bg-[#0B1221] border border-white/10 p-7 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="text-xs font-mono text-slate-400">STEP 1 · SELF-CHECK OR TEASER</div>
                  <div className="text-3xl font-mono font-bold text-white">₹0</div>
                  <div className="text-base font-bold text-white">3-SKU Diagnostic Teaser</div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Verify file health, total &gt;180-day rupee exposure, and your top 3 stagnant SKUs before spending a
                    rupee.
                  </p>
                </div>
                <button
                  onClick={() => navigateRoom("sandbox", "/sandbox")}
                  className="w-full py-3 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-sm"
                >
                  Open Free CSV Sandbox →
                </button>
              </div>

              <div className="rounded-xl bg-[#0B1221] border-2 border-amber-500 p-7 flex flex-col justify-between space-y-6 shadow-[0_20px_50px_-15px_rgba(245,158,11,0.2)]">
                <div className="space-y-3">
                  <div className="text-xs font-mono text-amber-400">MOST CHOSEN · ₹2,50,000 LEAK GUARANTEE</div>
                  <div className="text-3xl font-mono font-bold text-white tabular-nums">₹18,000</div>
                  <div className="text-base font-bold text-white">Full 48-Hour Factory Stock Audit</div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    All 9 working papers: 6-sheet Excel hitlist, printable 2-page MD brief, CNC spares shield, 30-min
                    founder review with C. Jones Snowin, and 100% refund if under ₹2.5L in leaks are found.
                  </p>
                </div>
                <button
                  onClick={() => setAuditModalOpen(true)}
                  className="w-full py-3.5 rounded-lg bg-gradient-to-b from-[#FBBF24] via-[#F59E0B] to-[#D97706] hover:brightness-105 text-[#050811] font-bold text-sm"
                >
                  Request 48-Hr Pilot Audit →
                </button>
              </div>

              <div className="rounded-xl bg-[#0B1221] border border-white/10 p-7 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="text-xs font-mono text-slate-400">MULTI-CRORE PLANTS</div>
                  <div className="text-3xl font-mono font-bold text-white tabular-nums">
                    ₹15,000<span className="text-sm font-normal text-slate-400">/mo</span>
                  </div>
                  <div className="text-base font-bold text-white">Monthly Working-Capital Watchdog</div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Monthly slow-moving drift alerts, supplier OTIF tracking, and gate-to-bin variance checks across
                    plant operations.
                  </p>
                </div>
                <button
                  onClick={() => setAuditModalOpen(true)}
                  className="w-full py-3 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-sm"
                >
                  Inquire for Monthly Watchdog →
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-[#0B1221] border border-white/15 p-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <div className="text-xs font-mono text-emerald-400">
                  FOR CHARTERED ACCOUNTANT FIRMS · STATUTORY &amp; BANK STOCK AUDITS
                </div>
                <h3 className="text-lg font-bold text-white">
                  Wholesale CA Partner Desk — <span className="font-mono">₹14,400</span> Flat per Plant Audit
                </h3>
                <p className="text-sm text-slate-300">
                  Receive co-branded, reconciled inventory ageing, AS-2 obsolete provision schedules, and CARO Clause
                  3(ii) working papers in 48 hours from messy client Tally exports.
                </p>
              </div>
              <button
                onClick={() => setAuditModalOpen(true)}
                className="px-5 py-3 rounded-lg bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs whitespace-nowrap"
              >
                Request CA Partner Dossier →
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Direct Answers to Common Plant Questions</h2>
            {[
              {
                q: "How do we know our supplier names and OEM customers stay confidential?",
                a: "You only export 5 anonymous stock columns (Part ID, Description, Closing Qty, Unit Cost, Last Movement Date). Supplier names, customer names, and GSTINs are stripped in your browser before submission, and all working files are permanently purged within 14 days.",
              },
              {
                q: "What if an audit flags critical CNC breakdown spares for scrapping?",
                a: "Item 07 (CNC Spares Shield) specifically separates spindle bearings, servo cables, sensors, and maintenance insurance spares into a protected 'Retain' schedule so factory uptime is never put at risk.",
              },
              {
                q: "Why wouldn't our existing Tally Prime or SAP stock summary show this already?",
                a: "Standard ERP stock summaries list thousands of balances alphabetically—mixing ₹14,800 idle motors with ₹20 fast-moving bolts. Operationalyst isolates the 22% annual holding drain and ranks the exact 18–25 SKUs worth floor action.",
              },
              {
                q: "Who reviews the audit before it reaches our Managing Director?",
                a: "Every 6-sheet workbook and 2-page white A4 executive brief is reviewed personally by founder C. Jones Snowin in Chennai—including a 30-minute live walkthrough with your plant and finance leads.",
              },
            ].map((item, idx) => (
              <div key={item.q} className="rounded-xl bg-[#0B1221] border border-white/10">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-bold text-white"
                >
                  <span>{item.q}</span>
                  <span className="font-mono text-amber-400 ml-4">{openFaq === idx ? "−" : "+"}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-2 text-sm text-slate-300 border-t border-white/[0.06] leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </section>
        </main>
      )}

      {/* MINIMALIST SINGLE-LINE FOOTER */}
      <footer className="no-print border-t border-white/[0.06] py-7">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Snowin Ventures, Chennai · Udyam MSME: <span className="font-mono text-slate-400">UDYAM-TN-02-0444630</span>{" "}
            (0% GST) · <span className="font-mono text-slate-400">+91 90805 40047</span>
          </div>
          <div className="flex items-center gap-5 text-slate-400">
            <button onClick={() => navigateRoom("sandbox", "/sandbox")} className="hover:text-white transition-colors">
              Sandbox
            </button>
            <button onClick={() => navigateRoom("sample", "/sample-report")} className="hover:text-white transition-colors">
              Sample Brief
            </button>
            <button onClick={() => navigateRoom("methodology", "/methodology")} className="hover:text-white transition-colors">
              Pricing &amp; Rules
            </button>
          </div>
        </div>
      </footer>

      {/* AUDIT RESERVATION MODAL */}
      {auditModalOpen && (
        <div className="no-print fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0B1221] border border-white/15 border-t-white/25 p-7 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-mono text-amber-400">₹0 3-SKU TEASER FIRST · 48-HR TURNAROUND</div>
                <h3 className="text-xl font-bold text-white mt-1">Request Factory Stock Audit</h3>
              </div>
              <button
                onClick={() => {
                  setAuditModalOpen(false);
                  setSubmittedCert("");
                }}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            {submittedCert ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
                  <div className="font-bold text-sm text-white">48-Hour Audit Slot Reserved</div>
                  <div>
                    14-Day Purge Token Assigned: <span className="font-mono font-bold">{submittedCert}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Click below to send your slot token straight to C. Jones Snowin on WhatsApp and receive the blank
                  5-column template (zero vendor names required).
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#050811] font-bold text-sm text-center"
                >
                  Confirm Slot on WhatsApp (+91 90805 40047) →
                </a>
              </div>
            ) : (
              <form onSubmit={handleAuditSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Your Name &amp; Designation</label>
                  <input
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    placeholder="e.g., S. Karthik · Plant Head / Director"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#050811] border border-white/15 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Company / Factory Name</label>
                  <input
                    required
                    value={leadForm.company}
                    onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                    placeholder="e.g., Sri Chakra Precision Components Pvt Ltd"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#050811] border border-white/15 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Stock System</label>
                    <select
                      value={leadForm.erp}
                      onChange={(e) => setLeadForm({ ...leadForm, erp: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#050811] border border-white/15 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option>Tally Prime</option>
                      <option>SAP</option>
                      <option>Busy / Zoho</option>
                      <option>Microsoft Excel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">WhatsApp / Phone</label>
                    <input
                      required
                      value={leadForm.contact}
                      onChange={(e) => setLeadForm({ ...leadForm, contact: e.target.value })}
                      placeholder="+91 98xxx xxxxx"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#050811] border border-white/15 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg bg-gradient-to-b from-[#FBBF24] via-[#F59E0B] to-[#D97706] hover:brightness-105 text-[#050811] font-bold text-sm"
                >
                  Reserve 48-Hr Audit Slot (₹0 Teaser First) →
                </button>
                <p className="text-[11px] text-slate-400 text-center">
                  ₹2,50,000 Leak Discovery Guarantee · Vendor names never required
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
  Wand2,
  RefreshCw,
  Lock,
  Unlock,
  Briefcase,
  Building2,
  Plus,
  Gauge,
  Menu,
  X,
  Smartphone,
  CalendarClock,
  Home
} from 'lucide-react';
import Project1App from './project1/Project1App';
import Project2App from './project2/Project2App';
import Project3App from './project3/Project3App';
import Project4App from './project4/Project4App';
import Project5App from './project5/Project5App';
import { MergedCommandCenter } from './MergedCommandCenter';
import { CustomBundleCombinator } from './components/CustomBundleCombinator';
import { SmartTallyMapperModal, TargetEngineType } from './components/SmartTallyMapperModal';
import { MultiDeviceSyncModal, SYNC_KEYS } from './components/MultiDeviceSyncModal';
import { MasterExecutiveDashboard } from './components/MasterExecutiveDashboard';
import { CommercialLandingPage } from './commercial/CommercialLandingPage';
import { FactoryAuditPage } from './commercial/FactoryAuditPage';
import { SampleAuditPage } from './commercial/SampleAuditPage';
import { AdToDemoFunnelModal } from './commercial/AdToDemoFunnelModal';
import { FounderLeadInbox } from './commercial/FounderLeadInbox';
import { AgentWorkforceDashboard } from './commercial/AgentWorkforceDashboard';
import { PilotFindingsWalkthroughView } from './commercial/PilotFindingsWalkthroughView';
import { ApprovedPilotUploadView } from './commercial/ApprovedPilotUploadView';
import { AppShell } from './dashboard/AppShell';
import { PlatformNavId } from './dashboard/dashboardConfig';
import { usePlant, PlantId, PeriodId } from './context/PlantContext';

type ArchitectureVersion =
  | 'commercial_home'
  | 'factory_audit'
  | 'sample_audit'
  | 'ad_funnel'
  | 'lead_inbox'
  | 'agent_workforce'
  | 'pilot_findings'
  | 'pilot_upload'
  | 'ceo_master'
  | 'standalone_p1'
  | 'standalone_p2'
  | 'standalone_p3'
  | 'standalone_p4'
  | 'standalone_p5'
  | 'custom_combos'
  | 'merged_suite';

interface ClientWorkspaceSlot {
  id: string;
  name: string;
  snapshots: Record<string, string>;
}

const STORAGE_KEY_VERSION_MODE = 'industrial_architecture_version_mode_v6';
const STORAGE_KEY_CLIENTS = 'suite_client_workspaces_v1';
const STORAGE_KEY_ACTIVE_CLIENT = 'suite_active_client_id_v1';

function parseRequestedArchitecture(): ArchitectureVersion | null {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const explicitParam = (
      searchParams.get('project') ||
      searchParams.get('p') ||
      searchParams.get('engine') ||
      searchParams.get('view') ||
      searchParams.get('page')
    )?.toLowerCase();

    const pathnameLower = window.location.pathname.toLowerCase();
    // Check for /app, /platform, or /audit in pathname
    if (
      pathnameLower === '/app' ||
      pathnameLower.endsWith('/app') ||
      pathnameLower.includes('/platform')
    ) {
      return 'ceo_master';
    }
    if (pathnameLower === '/audit' || pathnameLower.endsWith('/audit')) {
      return 'sample_audit';
    }

    if (explicitParam) {
      if (
        explicitParam === 'sample-audit' ||
        explicitParam === 'sample_audit' ||
        explicitParam === 'sample-report' ||
        explicitParam === 'sample_report'
      ) {
        return 'sample_audit';
      }
      if (
        explicitParam === 'pilot-upload' ||
        explicitParam === 'pilot_upload' ||
        explicitParam === 'step2-upload' ||
        explicitParam === 'upload'
      ) {
        return 'pilot_upload';
      }
      if (
        explicitParam === 'pilot-findings' ||
        explicitParam === 'pilot_findings' ||
        explicitParam === 'pilot-walkthrough' ||
        explicitParam === 'pilot_walkthrough' ||
        explicitParam === 'walkthrough' ||
        explicitParam === 'findings'
      ) {
        return 'pilot_findings';
      }
      if (
        explicitParam === 'agent-workforce' ||
        explicitParam === 'agent_workforce' ||
        explicitParam === 'agents' ||
        explicitParam === 'workforce' ||
        explicitParam === 'paperclip'
      ) {
        return 'agent_workforce';
      }
      if (
        explicitParam === 'lead-inbox' ||
        explicitParam === 'lead_inbox' ||
        explicitParam === 'leads' ||
        explicitParam === 'inbox'
      ) {
        return 'lead_inbox';
      }
      if (explicitParam === 'home' || explicitParam === 'landing' || explicitParam === 'commercial' || explicitParam === 'commercial_home') {
        return 'commercial_home';
      }
      if (explicitParam === 'platform' || explicitParam === 'app' || explicitParam === 'dashboard') {
        return 'ceo_master';
      }
      if (explicitParam === 'audit' || explicitParam === 'factory_audit' || explicitParam === 'free_audit') {
        return 'factory_audit';
      }
      if (explicitParam === 'funnel' || explicitParam === 'ad_funnel') {
        return 'ad_funnel';
      }
      if (explicitParam === 'p1' || explicitParam === 'cash' || explicitParam === 'inventory' || explicitParam === 'standalone_p1') {
        return 'standalone_p1';
      }
      if (explicitParam === 'p2' || explicitParam === 'otif' || explicitParam === 'dispatch' || explicitParam === 'standalone_p2') {
        return 'standalone_p2';
      }
      if (explicitParam === 'p3' || explicitParam === 'freight' || explicitParam === 'profit' || explicitParam === 'standalone_p3') {
        return 'standalone_p3';
      }
      if (explicitParam === 'p4' || explicitParam === 'binaudit' || explicitParam === 'warehouse' || explicitParam === 'standalone_p4') {
        return 'standalone_p4';
      }
      if (explicitParam === 'p5' || explicitParam === 'tower' || explicitParam === 'controltower' || explicitParam === 'standalone_p5') {
        return 'standalone_p5';
      }
      if (explicitParam === 'ceo' || explicitParam === 'master' || explicitParam === 'ceo_master') {
        return 'ceo_master';
      }
      if (explicitParam === 'suite' || explicitParam === 'merged' || explicitParam === 'merged_suite') {
        return 'merged_suite';
      }
      if (explicitParam === 'combos' || explicitParam === 'custom_combos') {
        return 'custom_combos';
      }
    }
  } catch {}
  return null;
}

export default function App() {
  const {
    activePlantId,
    setActivePlantId,
    activePlant,
    activePeriodId,
    setActivePeriodId,
    activePeriod,
    allPlants,
    allPeriods,
  } = usePlant();

  const [versionMode, setVersionMode] = useState<ArchitectureVersion>(() => {
    const fromUrl = parseRequestedArchitecture();
    if (fromUrl) return fromUrl;
    // Default to Commercial Landing Page for first-time visitors
    return 'commercial_home';
  });

  // Commercial Rebranding Mode (P1-P5 Codes vs Manufacturing Control Tower Commercial Names)
  const [useCommercialNames, setUseCommercialNames] = useState<boolean>(() => {
    return localStorage.getItem('suite_commercial_names_v1') === 'true';
  });

  // Client Presentation Lock (Hides top multi-project switcher bar during live client screen-share)
  const [isClientLocked, setIsClientLocked] = useState<boolean>(false);

  // Multi-Client Workspace Switcher (Prevents overwriting Client A when auditing Client B)
  const [clientSlots, setClientSlots] = useState<ClientWorkspaceSlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLIENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      { id: 'client-ambattur', name: 'Ambattur Baseline Unit', snapshots: {} },
    ];
  });

  const [activeClientId, setActiveClientId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_CLIENT) || 'client-ambattur';
  });

  // Universal Modals (Dirty Tally Mapper & Multi-Device Sync Hub)
  const [showSmartMapper, setShowSmartMapper] = useState<boolean>(false);
  const [mapperDefaultEngine, setMapperDefaultEngine] = useState<TargetEngineType>('p1');
  const [showDeviceSync, setShowDeviceSync] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [syncRefreshKey, setSyncRefreshKey] = useState<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VERSION_MODE, versionMode);
    } catch {}
  }, [versionMode]);

  useEffect(() => {
    try {
      localStorage.setItem('suite_commercial_names_v1', String(useCommercialNames));
    } catch {}
  }, [useCommercialNames]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clientSlots));
      localStorage.setItem(STORAGE_KEY_ACTIVE_CLIENT, activeClientId);
    } catch {}
  }, [clientSlots, activeClientId]);

  // Listen for URL navigation changes only (automatic #client_sync URL state injection removed for security)
  useEffect(() => {
    const handleUrlNavigation = () => {
      const requested = parseRequestedArchitecture();
      if (requested) {
        setVersionMode(requested);
      }
    };
    window.addEventListener('hashchange', handleUrlNavigation);
    window.addEventListener('popstate', handleUrlNavigation);
    return () => {
      window.removeEventListener('hashchange', handleUrlNavigation);
      window.removeEventListener('popstate', handleUrlNavigation);
    };
  }, []);

  // Listen for cross-tab BroadcastChannel & storage updates so Gate Tablet (P2) & Store Count Sheet (P4) sync live
  useEffect(() => {
    const handleStorage = () => setSyncRefreshKey((k) => k + 1);
    window.addEventListener('storage', handleStorage);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('factory_suite_live_sync');
      bc.onmessage = () => setSyncRefreshKey((k) => k + 1);
    } catch {}

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
    };
  }, []);

  const captureCurrentSnapshots = (): Record<string, string> => {
    const snap: Record<string, string> = {};
    SYNC_KEYS.forEach((k) => {
      const val = localStorage.getItem(k);
      if (val !== null) snap[k] = val;
    });
    return snap;
  };

  const handleSwitchClientSlot = (nextClientId: string) => {
    if (nextClientId === activeClientId) return;
    const outgoingSnap = captureCurrentSnapshots();
    const updatedSlots = clientSlots.map((slot) =>
      slot.id === activeClientId ? { ...slot, snapshots: outgoingSnap } : slot
    );
    const targetSlot = updatedSlots.find((s) => s.id === nextClientId);

    // Clear active keys and restore target client's snapshot (or clean baseline defaults)
    SYNC_KEYS.forEach((k) => localStorage.removeItem(k));
    if (targetSlot && targetSlot.snapshots) {
      Object.entries(targetSlot.snapshots).forEach(([k, val]) => {
        localStorage.setItem(k, String(val));
      });
    }

    setClientSlots(updatedSlots);
    setActiveClientId(nextClientId);
    setSyncRefreshKey((k) => k + 1);
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddNewClientSlot = () => {
    const name = window.prompt('Enter new Factory / Client Workspace name (e.g., "Sri Murugan Auto Parts - Hosur"):');
    if (!name || !name.trim()) return;
    const outgoingSnap = captureCurrentSnapshots();
    const newId = `client-${Date.now()}`;
    const newSlot: ClientWorkspaceSlot = {
      id: newId,
      name: name.trim(),
      snapshots: {},
    };
    const updated = [
      ...clientSlots.map((s) => (s.id === activeClientId ? { ...s, snapshots: outgoingSnap } : s)),
      newSlot,
    ];
    SYNC_KEYS.forEach((k) => localStorage.removeItem(k));
    setClientSlots(updated);
    setActiveClientId(newId);
    setSyncRefreshKey((k) => k + 1);
    window.dispatchEvent(new Event('storage'));
  };

  const openMapperForEngine = (eng?: TargetEngineType) => {
    if (eng) {
      setMapperDefaultEngine(eng);
    } else if (versionMode === 'standalone_p1') {
      setMapperDefaultEngine('p1');
    } else if (versionMode === 'standalone_p2') {
      setMapperDefaultEngine('p2');
    } else if (versionMode === 'standalone_p3') {
      setMapperDefaultEngine('p3');
    } else if (versionMode === 'standalone_p4') {
      setMapperDefaultEngine('p4');
    } else if (versionMode === 'standalone_p5') {
      setMapperDefaultEngine('p5');
    } else {
      setMapperDefaultEngine('p1');
    }
    setShowSmartMapper(true);
  };

  if (versionMode === 'pilot_upload') {
    const searchParams =
      typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const leadIdParam = searchParams?.get('leadId') || searchParams?.get('id') || undefined;
    const tokenParam = searchParams?.get('token') || undefined;
    const isDemoMode = searchParams?.get('demo') === 'true' || !leadIdParam;

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <ApprovedPilotUploadView
          leadIdParam={leadIdParam}
          tokenParam={tokenParam}
          isDemoMode={isDemoMode}
          onBackToHome={() => {
            setVersionMode('commercial_home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenLeadInbox={() => {
            setVersionMode('lead_inbox');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenWalkthrough={(workspaceId, shareToken) => {
            try {
              window.history.pushState(
                {},
                '',
                `?view=pilot-findings&id=${encodeURIComponent(
                  workspaceId
                )}&token=${encodeURIComponent(shareToken)}`
              );
            } catch {}
            setVersionMode('pilot_findings');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  if (versionMode === 'pilot_findings') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <PilotFindingsWalkthroughView
          onBackToHome={() => {
            setVersionMode('commercial_home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPlatform={() => {
            setVersionMode('ceo_master');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  if (versionMode === 'agent_workforce') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <AgentWorkforceDashboard
          onBackToHome={() => {
            setVersionMode('commercial_home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenLeadInbox={() => {
            try {
              window.history.pushState({}, '', '?view=lead-inbox');
            } catch {}
            setVersionMode('lead_inbox');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPlatform={() => {
            setVersionMode('ceo_master');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenWalkthrough={(workspaceId, shareToken) => {
            try {
              window.history.pushState(
                {},
                '',
                `?view=pilot-findings&id=${encodeURIComponent(
                  workspaceId
                )}&token=${encodeURIComponent(shareToken)}&paywall=teaser`
              );
            } catch {}
            setVersionMode('pilot_findings');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  if (versionMode === 'lead_inbox') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <FounderLeadInbox
          onBackToHome={() => {
            setVersionMode('commercial_home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPlatform={() => {
            setVersionMode('ceo_master');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAgentWorkforce={() => {
            try {
              window.history.pushState({}, '', '?view=agent-workforce');
            } catch {}
            setVersionMode('agent_workforce');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenWalkthrough={(workspaceId, shareToken) => {
            try {
              window.history.pushState(
                {},
                '',
                `?view=pilot-findings&id=${encodeURIComponent(
                  workspaceId
                )}&token=${encodeURIComponent(shareToken)}`
              );
            } catch {}
            setVersionMode('pilot_findings');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenUploadPortal={(leadId, uploadToken) => {
            try {
              window.history.pushState(
                {},
                '',
                `?view=pilot-upload&leadId=${encodeURIComponent(
                  leadId
                )}${uploadToken ? `&token=${encodeURIComponent(uploadToken)}` : ''}`
              );
            } catch {}
            setVersionMode('pilot_upload');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  if (versionMode === 'sample_audit') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <SampleAuditPage
          onBackToHome={() => {
            try {
              window.history.pushState({}, '', '/');
            } catch {}
            setVersionMode('commercial_home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPlatform={() => {
            setVersionMode('ceo_master');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenLeadInbox={() => {
            setVersionMode('lead_inbox');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  if (versionMode === 'commercial_home') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/20 selection:text-amber-200">
        <CommercialLandingPage
          onLaunchEngine={(eng) => {
            setVersionMode(eng);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSmartMapper={() => openMapperForEngine()}
          onOpenAuditPage={() => {
            setVersionMode('factory_audit');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSampleAuditPage={() => {
            try {
              window.history.pushState({}, '', '?view=sample-audit');
            } catch {}
            setVersionMode('sample_audit');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenLeadInbox={() => {
            setVersionMode('lead_inbox');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Universal Dirty Tally / Excel Smart Column-Mapper Modal */}
        <SmartTallyMapperModal
          isOpen={showSmartMapper}
          onClose={() => setShowSmartMapper(false)}
          defaultEngine={mapperDefaultEngine}
          onImportSuccess={() => {
            setSyncRefreshKey((k) => k + 1);
          }}
        />
      </div>
    );
  }

  if (versionMode === 'factory_audit') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300">
        <FactoryAuditPage
          onBackToHome={() => {
            setVersionMode('commercial_home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLaunchLiveDemo={(eng) => {
            setVersionMode((eng as any) || 'ceo_master');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSmartMapper={() => openMapperForEngine()}
          onOpenLeadInbox={() => {
            setVersionMode('lead_inbox');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Universal Dirty Tally / Excel Smart Column-Mapper Modal */}
        <SmartTallyMapperModal
          isOpen={showSmartMapper}
          onClose={() => setShowSmartMapper(false)}
          defaultEngine={mapperDefaultEngine}
          onImportSuccess={() => {
            setSyncRefreshKey((k) => k + 1);
          }}
        />
      </div>
    );
  }

  if (versionMode === 'ad_funnel') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <CommercialLandingPage
          onLaunchEngine={(eng) => {
            setVersionMode(eng);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSmartMapper={() => openMapperForEngine()}
          onOpenAuditPage={() => {
            setVersionMode('factory_audit');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenLeadInbox={() => {
            setVersionMode('lead_inbox');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
        <AdToDemoFunnelModal
          isOpen={true}
          onClose={() => setVersionMode('commercial_home')}
          onOpenAuditPage={() => setVersionMode('factory_audit')}
          onLaunchLiveDemo={(eng) => setVersionMode((eng as any) || 'ceo_master')}
        />
      </div>
    );
  }

  const initialPlatformTab: PlatformNavId =
    versionMode === 'standalone_p1'
      ? 'inventory'
      : versionMode === 'standalone_p2'
      ? 'delivery'
      : versionMode === 'standalone_p3'
      ? 'profit_risk'
      : versionMode === 'standalone_p4'
      ? 'warehouse'
      : versionMode === 'standalone_p5' ||
        versionMode === 'merged_suite' ||
        versionMode === 'custom_combos'
      ? 'executive_reports'
      : 'overview';

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <AppShell
        initialTab={initialPlatformTab}
        activePlant={activePlant}
        activePeriod={activePeriod}
        allPlants={allPlants}
        allPeriods={allPeriods}
        onSelectPlant={(id) => setActivePlantId(id)}
        onSelectPeriod={(id) => setActivePeriodId(id)}
        onOpenPublicHome={() => {
          try {
            window.history.pushState({}, '', '/');
          } catch {}
          setVersionMode('commercial_home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenFactoryAudit={() => {
          setVersionMode('factory_audit');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLeadInbox={() => {
          setVersionMode('lead_inbox');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSmartMapper={(eng) => openMapperForEngine(eng)}
        onOpenDeviceSync={() => setShowDeviceSync(true)}
        isClientLocked={isClientLocked}
        onToggleClientLock={() => setIsClientLocked((v) => !v)}
        clientSlots={clientSlots}
        activeClientId={activeClientId}
        onSwitchClientSlot={handleSwitchClientSlot}
        onAddNewClientSlot={handleAddNewClientSlot}
        syncRefreshKey={syncRefreshKey}
      />

      {/* Universal Dirty Tally / Excel Smart Column-Mapper Modal */}
      <SmartTallyMapperModal
        isOpen={showSmartMapper}
        onClose={() => setShowSmartMapper(false)}
        defaultEngine={mapperDefaultEngine}
        onImportSuccess={() => {
          setSyncRefreshKey((k) => k + 1);
        }}
      />

      {/* Multi-Device Field-to-Owner Sync Modal */}
      <MultiDeviceSyncModal
        isOpen={showDeviceSync}
        onClose={() => setShowDeviceSync(false)}
        onSyncImported={() => {
          setSyncRefreshKey((k) => k + 1);
        }}
      />
    </div>
  );
}
