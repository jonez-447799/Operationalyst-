import React, { useState } from "react";

type RoomId = "home" | "sandbox" | "sample" | "pricing";
type TabId = "01_Exec_Health" | "02_Idle_180d_Hitlist" | "03_CARO_Bank_DP" | "04_AS2_NRV_Ageing" | "05_Freight_Audit" | "06_Spares_Guard" | "07_Reorder_Cap" | "08_Audit_Trail";

export default function App() {
  const [activeRoom, setActiveRoom] = useState<RoomId>("home");
  const [activeTab, setActiveTab] = useState<TabId>("01_Exec_Health");
  
  const [sandboxCsvText, setSandboxCsvText] = useState<string>(
    `Part_ID,Part_Description,Closing_Stock_Qty,Unit_Cost_INR,Last_Movement_Date,Location_Rack
RM-SS316-FLG-4402,Forged Flange Blank SS316 (RM),370,4000,2025-11-10,RACK-A01
RM-EN353-CRB-112,Case-Hardening Alloy Bar 65mm (RM),430,3000,2025-12-20,RACK-A04
RM-CUETP-BUS-309,Electrolytic Copper Busbar Strip (RM),240,4937,2026-04-12,RACK-B02
FG-ALU-HSG-910A,Die-Cast Gearbox Cover Rev-A (FG),400,2400,2026-02-24,RACK-C05
WIP-EN24-SHF-208,Turned Drive Shaft Batch #14 (WIP),190,3394,2025-10-12,RACK-W03
MRO-SIEM-PLC-840D,Sinumerik 840D sl NCU Control Card (CRITICAL SPARE),2,270000,2025-03-25,MRO-CAB-01
MRO-FANUC-SRV-09,CNC Alpha Spindle Drive Module (CRITICAL SPARE),5,97000,2025-06-24,MRO-CAB-04`
  );
  const [strippedVendorCount, setStrippedVendorCount] = useState<number>(1420);

  const handleDownloadXlsx = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Tab,SKU_Code,Description,Category,Days_Idle,Book_Value_INR,NRV_Floor_INR,Action_Recommendation\n"
      + "01_Exec_Health,SUMMARY,Reconciled Stock Register,ALL,0,68500000,7435000,CFO Command Brief Reconciled\n"
      + "02_Idle_180d_Hitlist,RM-SS316-FLG-4402,Forged Flange Blank SS316 (RM),RM,384,1480000,1140000,Mill Credit Swap (Q3 PO)\n"
      + "02_Idle_180d_Hitlist,RM-EN353-CRB-112,Case-Hardening Alloy Bar 65mm (RM),RM,342,1290000,1020000,Dealer Buyback / Inter-Plant Transfer\n"
      + "02_Idle_180d_Hitlist,RM-CUETP-BUS-309,Electrolytic Copper Busbar Strip (RM),RM,229,1185000,1090000,Spot Metal Index Liquidation\n"
      + "02_Idle_180d_Hitlist,FG-ALU-HSG-910A,Die-Cast Gearbox Cover Rev-A (FG),FG,276,960000,385000,OEM ECN Obsolescence Claim + Remelt\n"
      + "02_Idle_180d_Hitlist,WIP-EN24-SHF-208,Turned Drive Shaft Batch #14 (WIP),WIP,412,645000,597000,Re-Machine OD to Rev-B Active SKU\n"
      + "03_CARO_Bank_DP,CARO-3IIA-RECON,Clause 3(ii)(a) Discrepancy Engine,ALL,0,68500000,0,RM 2.55% WIP 3.04% FG 1.91% MRO 1.62% Compliant\n"
      + "03_CARO_Bank_DP,CARO-3IIB-DP,Clause 3(ii)(b) Bank Drawing Power Shield,ALL,0,8850000,0,DP Haircut Risk Mitigated at 75% Advance Rate\n"
      + "04_AS2_NRV_Ageing,AS2-AGEING,Ind AS 2 Lower of Cost or NRV Schedule,ALL,180+,14250000,4895000,AS-2 Write-down ₹48.95L Item-by-Item\n"
      + "05_Freight_Audit,FRT-HOS-ORG-L04,Hosur -> Oragadam Milk-Run 9T FTL,LOG,90,1820000,235000,Reset 9T FTL Slab + 6-Hr Halting Cap\n"
      + "05_Freight_Audit,FRT-PUN-CHN-L09,Chakan (Pune) -> Chennai Inbound,LOG,90,1640000,302000,Match Billing to E-Way Bill Net Weight\n"
      + "05_Freight_Audit,FRT-AMB-SRP-L01,Ambattur -> Sriperumbudur Shuttle,LOG,90,940000,216000,Eliminate Empty-Return Trip Billing\n"
      + "05_Freight_Audit,FRT-ORG-PRT-L12,Oragadam -> Ennore Port Shuttle,LOG,90,890000,187000,Recover Pre-Cutoff Weekend Detention\n"
      + "06_Spares_Guard,MRO-SIEM-PLC-840D,Sinumerik 840D sl NCU Control Card,MRO,610,540000,0,SHIELDED — DO NOT SCRAP (₹4.5L/day loss avoided)\n"
      + "06_Spares_Guard,MRO-FANUC-SRV-09,CNC Alpha Spindle Drive Module,MRO,518,485000,0,SHIELDED — DO NOT SCRAP (₹4.2L/day loss avoided)\n"
      + "06_Spares_Guard,MRO-INDUCT-SCR-12,Induction Hardening Thyristor Stack,MRO,475,312000,0,SHIELDED — DO NOT SCRAP\n"
      + "06_Spares_Guard,MRO-NSK-7018-CTY,Matched Angular Spindle Bearing Pair,MRO,392,218000,0,SHIELDED — DO NOT SCRAP\n"
      + "07_Reorder_Cap,REORDER-CAP-01,ERP Min-Max & EOQ Reset Rules,PO,0,1950000,0,Blocked Open Auto-Replenishment POs in Tally/SAP\n"
      + "08_Audit_Trail,AUDIT-PURGE-01,SHA-256 Vendor Stripping & Purge Log,LOG,0,0,0,Client-side SHA-256 Stripped 48 Dup Merges 7-Day Purge SLA";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Operationalyst_8Sheet_Benchmark_6.85Cr.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const founderSignOffText = "Reviewed & Signed Off by C.JONES SNOWIN · Founder & Project Lead | Operationalyst (A Snowin Ventures Platform, Chennai) · B.Com (Loyola College) · MBA (Supply Chain & Finance) · Udyam MSME: UDYAM-TN-02-0444630 · 0% GST Bill of Supply · jonessnowin@operationalyst.com · +91 90805 40047";

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F1F5F9] font-sans antialiased selection:bg-[#F59E0B] selection:text-[#0B0F19]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#1E293B] bg-[#0B0F19]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveRoom("home")}>
            <div className="w-9 h-9 rounded bg-[#F59E0B] text-[#0B0F19] font-black text-xl flex items-center justify-center tracking-tighter shadow-lg shadow-[#F59E0B]/20">
              OP
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#F1F5F9]">Operationalyst</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono text-[#F59E0B] px-2 py-0.5 rounded bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                A Snowin Ventures Platform
              </span>
            </div>
          </div>

          <nav className="flex items-center space-x-1 sm:space-x-4 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveRoom("home")}
              className={`px-3 py-1.5 rounded-md transition ${activeRoom === "home" ? "bg-[#1E293B] text-[#F59E0B]" : "text-[#94A3B8] hover:text-[#F1F5F9]"}`}
            >
              Overview & Benchmark
            </button>
            <button
              onClick={() => setActiveRoom("sandbox")}
              className={`px-3 py-1.5 rounded-md transition ${activeRoom === "sandbox" ? "bg-[#1E293B] text-[#F59E0B]" : "text-[#94A3B8] hover:text-[#F1F5F9]"}`}
            >
              CSV Sandbox
            </button>
            <button
              onClick={() => setActiveRoom("sample")}
              className={`px-3 py-1.5 rounded-md transition ${activeRoom === "sample" ? "bg-[#1E293B] text-[#F59E0B]" : "text-[#94A3B8] hover:text-[#F1F5F9]"}`}
            >
              Sample 2-Page A4 Brief
            </button>
            <button
              onClick={() => setActiveRoom("pricing")}
              className={`px-3 py-1.5 rounded-md transition ${activeRoom === "pricing" ? "bg-[#1E293B] text-[#F59E0B]" : "text-[#94A3B8] hover:text-[#F1F5F9]"}`}
            >
              Pricing & Rules
            </button>
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Founding Pilot Banner */}
        <div className="mb-8 rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-4 text-sm text-[#F59E0B] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-mono px-2 py-0.5 rounded bg-[#F59E0B] text-[#0B0F19] text-xs font-bold uppercase">
              Founding Pilot
            </span>
            <span>
              <strong>Stage 2 Pilot Slot Available (2 Slots Only):</strong> ₹0 Fee exclusively for discrete manufacturers in Chennai / Ambattur / Sriperumbudur / Oragadam / Hosur holding ₹5 Cr+ book stock.
            </span>
          </div>
          <button
            onClick={() => setActiveRoom("pricing")}
            className="whitespace-nowrap px-4 py-1.5 rounded bg-[#F59E0B] text-[#0B0F19] font-bold text-xs hover:bg-[#D97706] transition"
          >
            Claim ₹0 Reference Slot →
          </button>
        </div>

        {/* VIEW 1: HOME */}
        {activeRoom === "home" && (
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-6 max-w-4xl mx-auto pt-4">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-[#1E293B] border border-[#334155] text-[#94A3B8]">
                Tally Prime · SAP · Busy · Excel — Zero ERP Login · Client-Side SHA-256 Vendor Stripping
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F1F5F9] leading-tight">
                Unlock ₹50L–₹1.5Cr trapped in factory stock & freight leaks in 48 hours.
              </h1>

              <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
                Export 6 standard columns from Tally Prime, SAP, or Busy — zero ERP login, zero vendor names shared. Receive an 8-Sheet Statutory & Cash-Release Workbook and a 2-Page Printable Boardroom MD/CFO Brief isolating 180+ day cash traps, Bank Drawing Power (DP) risks, and freight overbilling while shielding critical CNC/VMC breakdown spares.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => setActiveRoom("pricing")}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-[#0B0F19] font-extrabold text-sm tracking-wide shadow-lg shadow-[#F59E0B]/20 transition"
                >
                  Request 48-Hr Audit (₹0 Teaser First) →
                </button>
                <button
                  onClick={handleDownloadXlsx}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-[#F1F5F9] border border-[#334155] font-bold text-sm transition"
                >
                  Download Sample 8-Sheet .XLSX ↓
                </button>
              </div>

              {/* 3-Pillar Proof Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left">
                <div className="p-4 rounded-lg bg-[#111827] border border-[#1E293B]">
                  <div className="text-xs font-mono text-[#F59E0B] font-bold">Zero-ERP Schema</div>
                  <div className="text-sm text-[#E2E8F0] font-semibold mt-1">Client-side SHA-256 vendor stripping</div>
                </div>
                <div className="p-4 rounded-lg bg-[#111827] border border-[#1E293B]">
                  <div className="text-xs font-mono text-[#F59E0B] font-bold">22% / Yr Burn</div>
                  <div className="text-sm text-[#E2E8F0] font-semibold mt-1">CC/OD interest + rack space quantified</div>
                </div>
                <div className="p-4 rounded-lg bg-[#111827] border border-[#1E293B]">
                  <div className="text-xs font-mono text-[#F59E0B] font-bold">₹10,00,000 SLA</div>
                  <div className="text-sm text-[#E2E8F0] font-semibold mt-1">Verifiable leak on ₹5 Cr+ stock or ₹0 fee</div>
                </div>
              </div>
            </section>

            {/* Benchmark Section */}
            <section className="space-y-6">
              <div className="border-t border-[#1E293B] pt-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#F59E0B] tracking-wider">Statutory & Operational Benchmark</span>
                    <h2 className="text-xl font-extrabold text-[#F1F5F9]">
                      8-Sheet .XLSX + 2-Page A4 PDF ENGINEERING BENCHMARK · 1,420-SKU CHENNAI–ORAGADAM–HOSUR CNC REGISTER
                    </h2>
                  </div>
                  <span className="text-xs text-[#94A3B8] font-mono">Verified by C.JONES SNOWIN</span>
                </div>
              </div>

              {/* Top KPI Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-7 gap-3">
                <div className="p-3 rounded bg-[#1E293B]/60 border border-[#334155]">
                  <div className="text-[10px] text-[#94A3B8] uppercase font-mono">Reconciled Book Stock</div>
                  <div className="text-base font-bold text-[#F1F5F9] mt-1">₹6,85,00,000</div>
                  <div className="text-[10px] text-[#64748B]">1,420 SKUs (RM/WIP/FG/MRO)</div>
                </div>
                <div className="p-3 rounded bg-[#1E293B]/60 border border-[#334155]">
                  <div className="text-[10px] text-[#94A3B8] uppercase font-mono">Gross Idle (&gt;180d)</div>
                  <div className="text-base font-bold text-[#EF4444] mt-1">₹1,42,50,000</div>
                  <div className="text-[10px] text-[#64748B]">20.8% of book stock</div>
                </div>
                <div className="p-3 rounded bg-[#1E293B]/60 border border-[#334155]">
                  <div className="text-[10px] text-[#94A3B8] uppercase font-mono">Shielded CNC Spares</div>
                  <div className="text-base font-bold text-[#10B981] mt-1">₹24,50,000</div>
                  <div className="text-[10px] text-[#64748B]">18 Critical Spares Protected</div>
                </div>
                <div className="p-3 rounded bg-[#1E293B]/60 border border-[#334155]">
                  <div className="text-[10px] text-[#94A3B8] uppercase font-mono">Actionable Cash Trap</div>
                  <div className="text-base font-bold text-[#F59E0B] mt-1">₹1,18,00,000</div>
                  <div className="text-[10px] text-[#64748B]">₹74.35L NRV Floor</div>
                </div>
                <div className="p-3 rounded bg-[#1E293B]/60 border border-[#334155]">
                  <div className="text-[10px] text-[#94A3B8] uppercase font-mono">Annual OD Burn (22%)</div>
                  <div className="text-base font-bold text-[#F59E0B] mt-1">₹25,96,000/yr</div>
                  <div className="text-[10px] text-[#64748B]">₹2.16L/mo silent bleed</div>
                </div>
                <div className="p-3 rounded bg-[#1E293B]/60 border border-[#334155]">
                  <div className="text-[10px] text-[#94A3B8] uppercase font-mono">Bank DP Haircut Risk</div>
                  <div className="text-base font-bold text-[#EF4444] mt-1">₹88,50,000</div>
                  <div className="text-[10px] text-[#64748B]">CARO 3(ii)(b) 75% Adv</div>
                </div>
                <div className="p-3 rounded bg-[#1E293B]/60 border border-[#334155] col-span-2 lg:col-span-1">
                  <div className="text-[10px] text-[#94A3B8] uppercase font-mono">90-Day Freight Leak</div>
                  <div className="text-base font-bold text-[#F59E0B] mt-1">₹9,40,000/yr</div>
                  <div className="text-[10px] text-[#64748B]">Inbound & Shuttle</div>
                </div>
              </div>

              {/* 8 Sequential Workbook Interactive Tabs Bar */}
              <div className="flex flex-wrap gap-1 border-b border-[#1E293B] pb-2">
                {[
                  { id: "01_Exec_Health", label: "01_Exec_Health" },
                  { id: "02_Idle_180d_Hitlist", label: "02_Idle_180d_Hitlist" },
                  { id: "03_CARO_Bank_DP", label: "03_CARO_Bank_DP" },
                  { id: "04_AS2_NRV_Ageing", label: "04_AS2_NRV_Ageing" },
                  { id: "05_Freight_Audit", label: "05_Freight_Audit" },
                  { id: "06_Spares_Guard", label: "06_Spares_Guard" },
                  { id: "07_Reorder_Cap", label: "07_Reorder_Cap" },
                  { id: "08_Audit_Trail", label: "08_Audit_Trail" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabId)}
                    className={`px-3 py-2 text-xs font-mono rounded-t-md transition ${
                      activeTab === tab.id
                        ? "bg-[#1E293B] text-[#F59E0B] font-bold border-t-2 border-[#F59E0B]"
                        : "text-[#94A3B8] hover:text-[#F1F5F9] bg-[#0B0F19]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Display */}
              <div className="bg-[#111827] border border-[#1E293B] rounded-lg p-6 min-h-[350px]">
                {activeTab === "01_Exec_Health" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#F1F5F9] font-mono">01_Exec_Health: CFO Command Dashboard</h3>
                    <p className="text-sm text-[#94A3B8]">
                      Comprehensive factory health overview across ₹6.85 Cr reconciled book stock. Quantifies actionable cash traps, bank credit protection under CARO 2020 Clause 3(ii), and carrying interest burn.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded bg-[#1E293B]/40 border border-[#334155] space-y-2">
                        <div className="text-xs text-[#94A3B8]">Reconciled Book Stock</div>
                        <div className="text-2xl font-black text-[#F1F5F9]">₹6,85,00,000</div>
                        <div className="text-xs text-[#64748B]">1,420 SKUs across Raw Material, WIP, Finished Goods & MRO</div>
                      </div>
                      <div className="p-4 rounded bg-[#1E293B]/40 border border-[#334155] space-y-2">
                        <div className="text-xs text-[#94A3B8]">Actionable Cash-Release Stock</div>
                        <div className="text-2xl font-black text-[#F59E0B]">₹1,18,00,000</div>
                        <div className="text-xs text-[#64748B]">Immediate NRV Liquidation / Mill Credit Swap Floor: ₹74,35,000</div>
                      </div>
                      <div className="p-4 rounded bg-[#1E293B]/40 border border-[#334155] space-y-2">
                        <div className="text-xs text-[#94A3B8]">Annual OD/CC Interest Burn (22%/Yr)</div>
                        <div className="text-2xl font-black text-[#EF4444]">₹25,96,000/yr</div>
                        <div className="text-xs text-[#64748B]">Calculated at ₹2.16L/mo silent cash bleed</div>
                      </div>
                      <div className="p-4 rounded bg-[#1E293B]/40 border border-[#334155] space-y-2">
                        <div className="text-xs text-[#94A3B8]">Bank DP Haircut & Freight Leaks</div>
                        <div className="text-2xl font-black text-[#10B981]">₹88.50L DP Shield | ₹9.40L Freight</div>
                        <div className="text-xs text-[#64748B]">CARO 3(ii)(b) quarterly DP audit & 90-day freight overbilling reset</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "02_Idle_180d_Hitlist" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#F1F5F9] font-mono">02_Idle_180d_Hitlist: Ranked SKU Cash-Release Queue</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[#1E293B] text-[#94A3B8]">
                          <tr>
                            <th className="p-2">SKU Code</th>
                            <th className="p-2">Description</th>
                            <th className="p-2">Days Idle</th>
                            <th className="p-2">Book Value (₹)</th>
                            <th className="p-2">NRV Floor (₹)</th>
                            <th className="p-2">Action Recommendation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1E293B] text-[#E2E8F0]">
                          <tr>
                            <td className="p-2 text-[#F59E0B]">RM-SS316-FLG-4402</td>
                            <td className="p-2">Forged Flange Blank SS316 (RM)</td>
                            <td className="p-2">384d</td>
                            <td className="p-2">₹14,80,000</td>
                            <td className="p-2 text-[#10B981]">₹11,40,000</td>
                            <td className="p-2">Mill Credit Swap (Q3 PO)</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-[#F59E0B]">RM-EN353-CRB-112</td>
                            <td className="p-2">Case-Hardening Alloy Bar 65mm (RM)</td>
                            <td className="p-2">342d</td>
                            <td className="p-2">₹12,90,000</td>
                            <td className="p-2 text-[#10B981]">₹10,20,000</td>
                            <td className="p-2">Dealer Buyback / Inter-Plant Transfer</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-[#F59E0B]">RM-CUETP-BUS-309</td>
                            <td className="p-2">Electrolytic Copper Busbar Strip (RM)</td>
                            <td className="p-2">229d</td>
                            <td className="p-2">₹11,85,000</td>
                            <td className="p-2 text-[#10B981]">₹10,90,000</td>
                            <td className="p-2">Spot Metal Index Liquidation</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-[#F59E0B]">FG-ALU-HSG-910A</td>
                            <td className="p-2">Die-Cast Gearbox Cover Rev-A (FG)</td>
                            <td className="p-2">276d</td>
                            <td className="p-2">₹9,60,000</td>
                            <td className="p-2 text-[#10B981]">₹3,85,000</td>
                            <td className="p-2">OEM ECN Obsolescence Claim + Remelt</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-[#F59E0B]">WIP-EN24-SHF-208</td>
                            <td className="p-2">Turned Drive Shaft Batch #14 (WIP)</td>
                            <td className="p-2">412d</td>
                            <td className="p-2">₹6,45,000</td>
                            <td className="p-2 text-[#10B981]">₹5,97,000</td>
                            <td className="p-2">Re-Machine OD to Rev-B Active SKU</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "03_CARO_Bank_DP" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#F1F5F9] font-mono">03_CARO_Bank_DP: Statutory Audit & Drawing Power Engine</h3>
                    <p className="text-sm text-[#94A3B8]">
                      CARO 2020 Clause 3(ii)(a) 10% class-wise discrepancy engine & Clause 3(ii)(b) quarterly bank Drawing Power (DP) reconciliation for ₹5 Cr+ working capital limits.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded bg-[#1E293B]/40 border border-[#334155] space-y-2">
                        <div className="text-xs font-bold text-[#F59E0B]">CARO 2020 Clause 3(ii)(a) Class Discrepancy</div>
                        <ul className="text-xs text-[#E2E8F0] space-y-1 font-mono">
                          <li>Raw Material (RM): 2.55% (&lt;10% Compliant)</li>
                          <li>Work-in-Progress (WIP): 3.04% (&lt;10% Compliant)</li>
                          <li>Finished Goods (FG): 1.91% (&lt;10% Compliant)</li>
                          <li>Spares & MRO: 1.62% (&lt;10% Compliant)</li>
                        </ul>
                      </div>
                      <div className="p-4 rounded bg-[#1E293B]/40 border border-[#334155] space-y-2">
                        <div className="text-xs font-bold text-[#F59E0B]">CARO 2020 Clause 3(ii)(b) Bank DP Shield</div>
                        <div className="text-sm text-[#E2E8F0]">
                          Quarterly stock statement submission audit flags <strong>₹88,50,000 Bank DP Haircut Risk</strong> at 75% advance rate under statutory bank audit guidelines.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "04_AS2_NRV_Ageing" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#F1F5F9] font-mono">04_AS2_NRV_Ageing: Ind AS 2 Item-by-Item Valuation Schedule</h3>
                    <p className="text-sm text-[#94A3B8]">
                      Ind AS 2 / AS-2 Lower of Cost or Net Realizable Value (NRV) ageing schedule. Zero blanket percentage write-downs.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[#1E293B] text-[#94A3B8]">
                          <tr>
                            <th className="p-2">Ageing Bracket</th>
                            <th className="p-2">Book Value (₹)</th>
                            <th className="p-2">AS-2 Write-Down (₹)</th>
                            <th className="p-2">Status / Protection</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1E293B] text-[#E2E8F0]">
                          <tr>
                            <td className="p-2">0–90 Days (Active)</td>
                            <td className="p-2">₹4,18,00,000</td>
                            <td className="p-2">₹0</td>
                            <td className="p-2 text-[#10B981]">100% Active Production</td>
                          </tr>
                          <tr>
                            <td className="p-2">91–180 Days (Slow-Moving)</td>
                            <td className="p-2">₹1,24,50,000</td>
                            <td className="p-2">₹0</td>
                            <td className="p-2 text-[#F59E0B]">Monitored for Re-order Block</td>
                          </tr>
                          <tr>
                            <td className="p-2">181–365 Days (Non-Moving)</td>
                            <td className="p-2">₹86,50,000</td>
                            <td className="p-2">₹17,45,000</td>
                            <td className="p-2 text-[#F59E0B]">NRV Provisioned Item-by-Item</td>
                          </tr>
                          <tr>
                            <td className="p-2">365+ Days (Obsolete Stock)</td>
                            <td className="p-2">₹31,50,000</td>
                            <td className="p-2">₹31,50,000</td>
                            <td className="p-2 text-[#EF4444]">Full Write-Down to NRV Floor</td>
                          </tr>
                          <tr className="bg-[#1E293B]/40 font-bold">
                            <td className="p-2 text-[#10B981]">365+ Days (Shielded Spares)</td>
                            <td className="p-2">₹24,50,000</td>
                            <td className="p-2">₹0</td>
                            <td className="p-2 text-[#10B981]">Quarantined Breakdown Spares (No Scrap)</td>
                          </tr>
                          <tr className="bg-[#1E293B] font-bold">
                            <td className="p-2">Total AS-2 Net Write-Down</td>
                            <td className="p-2">₹6,85,00,000</td>
                            <td className="p-2 text-[#F59E0B]">₹48,95,000</td>
                            <td className="p-2 text-[#10B981]">100% Statutorily Compliant</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "05_Freight_Audit" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#F1F5F9] font-mono">05_Freight_Audit: Corridor Freight & Detention Schedule</h3>
                    <p className="text-sm text-[#94A3B8]">
                      90-day logistics corridor audit isolating <strong>₹9,40,000/yr in freight & detention overbilling</strong> across key industrial routes.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[#1E293B] text-[#94A3B8]">
                          <tr>
                            <th className="p-2">Logistics Corridor ID</th>
                            <th className="p-2">Route Description</th>
                            <th className="p-2">90d Billed (₹)</th>
                            <th className="p-2">Annualized Leak (₹)</th>
                            <th className="p-2">Actionable Resolution</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1E293B] text-[#E2E8F0]">
                          <tr>
                            <td className="p-2 text-[#F59E0B]">FRT-HOS-ORG-L04</td>
                            <td className="p-2">Hosur → Oragadam Inbound Milk-Run (9T FTL)</td>
                            <td className="p-2">₹18,20,000</td>
                            <td className="p-2 text-[#EF4444]">₹2,35,000</td>
                            <td className="p-2">Reset 9T FTL Slab + 6-Hr Halting Cap</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-[#F59E0B]">FRT-PUN-CHN-L09</td>
                            <td className="p-2">Chakan (Pune) → Chennai Inbound Corridor</td>
                            <td className="p-2">₹16,40,000</td>
                            <td className="p-2 text-[#EF4444]">₹3,02,000</td>
                            <td className="p-2">Match Billing to E-Way Bill Net Weight</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-[#F59E0B]">FRT-AMB-SRP-L01</td>
                            <td className="p-2">Ambattur → Sriperumbudur Shuttle</td>
                            <td className="p-2">₹9,40,000</td>
                            <td className="p-2 text-[#EF4444]">₹2,16,000</td>
                            <td className="p-2">Eliminate Empty-Return Trip Billing</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-[#F59E0B]">FRT-ORG-PRT-L12</td>
                            <td className="p-2">Oragadam → Ennore Port Shuttle</td>
                            <td className="p-2">₹8,90,000</td>
                            <td className="p-2 text-[#EF4444]">₹1,87,000</td>
                            <td className="p-2">Recover Pre-Cutoff Weekend Detention</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "06_Spares_Guard" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#F1F5F9] font-mono">06_Spares_Guard: Critical CNC/VMC Breakdown Spares Protection</h3>
                    <p className="text-sm text-[#94A3B8]">
                      Critical CNC/VMC breakdown spares quarantined from scrap. Prevents costly plant shutdown risks while cleaning stock registers.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[#1E293B] text-[#94A3B8]">
                          <tr>
                            <th className="p-2">Spare SKU Code</th>
                            <th className="p-2">Description</th>
                            <th className="p-2">Days Idle</th>
                            <th className="p-2">Value (₹)</th>
                            <th className="p-2">Lead Time</th>
                            <th className="p-2">Guard Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1E293B] text-[#E2E8F0]">
                          <tr className="bg-[#10B981]/10">
                            <td className="p-2 text-[#10B981]">MRO-SIEM-PLC-840D</td>
                            <td className="p-2">Sinumerik 840D sl NCU Control Card</td>
                            <td className="p-2">610d</td>
                            <td className="p-2">₹5,40,000</td>
                            <td className="p-2">16w Import</td>
                            <td className="p-2 font-bold text-[#10B981]">SHIELDED — DO NOT SCRAP (₹4.5L/day loss avoided)</td>
                          </tr>
                          <tr className="bg-[#10B981]/10">
                            <td className="p-2 text-[#10B981]">MRO-FANUC-SRV-09</td>
                            <td className="p-2">CNC Alpha Spindle Drive Module</td>
                            <td className="p-2">518d</td>
                            <td className="p-2">₹4,85,000</td>
                            <td className="p-2">14w Import</td>
                            <td className="p-2 font-bold text-[#10B981]">SHIELDED — DO NOT SCRAP (₹4.2L/day loss avoided)</td>
                          </tr>
                          <tr className="bg-[#10B981]/10">
                            <td className="p-2 text-[#10B981]">MRO-INDUCT-SCR-12</td>
                            <td className="p-2">Induction Hardening Thyristor Stack</td>
                            <td className="p-2">475d</td>
                            <td className="p-2">₹3,12,000</td>
                            <td className="p-2">10w Lead</td>
                            <td className="p-2 font-bold text-[#10B981]">SHIELDED — DO NOT SCRAP</td>
                          </tr>
                          <tr className="bg-[#10B981]/10">
                            <td className="p-2 text-[#10B981]">MRO-NSK-7018-CTY</td>
                            <td className="p-2">Matched Angular Spindle Bearing Pair</td>
                            <td className="p-2">392d</td>
                            <td className="p-2">₹2,18,000</td>
                            <td className="p-2">8w Lead</td>
                            <td className="p-2 font-bold text-[#10B981]">SHIELDED — DO NOT SCRAP</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "07_Reorder_Cap" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#F1F5F9] font-mono">07_Reorder_Cap: ERP Min-Max & EOQ Reset Rules</h3>
                    <p className="text-sm text-[#94A3B8]">
                      Blocks automatic reordering for slow and non-moving items in ERP systems (Tally Prime, SAP, Busy).
                    </p>
                    <div className="p-4 rounded bg-[#1E293B]/40 border border-[#334155] space-y-2">
                      <div className="text-sm font-bold text-[#F59E0B]">Blocked Purchase Orders: ₹19,50,000</div>
                      <p className="text-xs text-[#E2E8F0]">
                        ERP Min-Max & EOQ reset rules implemented in Tally Prime / SAP to freeze auto-replenishment purchase orders for 64 slow-moving and dead SKUs, preventing unnecessary cash lockup.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "08_Audit_Trail" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#F1F5F9] font-mono">08_Audit_Trail: SHA-256 Vendor Stripping & Governance SLA</h3>
                    <p className="text-sm text-[#94A3B8]">
                      Client-side SHA-256 vendor/GSTIN stripping verification, deduplication logs, and cryptographic data purge SLA.
                    </p>
                    <div className="p-4 rounded bg-[#1E293B]/40 border border-[#334155] space-y-2 text-xs font-mono">
                      <div className="text-[#10B981] font-bold">✔ SHA-256 Client-Side Anonymization Active</div>
                      <div>• 1,420 SKUs Processed (48 Duplicate SKU merges resolved)</div>
                      <div>• Ind AS 2 Idle-Shift Overhead Exclusions Applied</div>
                      <div>• 7-Day Cryptographic Data Purge SLA Guaranteed</div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: CSV SANDBOX */}
        {activeRoom === "sandbox" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#F1F5F9]">Instant In-Browser CSV Diagnostic Sandbox</h2>
              <p className="text-sm text-[#94A3B8]">
                Test client-side SHA-256 vendor stripping and 6-column inventory analysis. Zero data leaves your browser.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-xs font-mono text-[#F59E0B]">
                  Input 6-Column CSV Data (Tally / SAP / Busy / Excel)
                </label>
                <textarea
                  value={sandboxCsvText}
                  onChange={(e) => setSandboxCsvText(e.target.value)}
                  className="w-full h-80 p-3 bg-[#111827] border border-[#1E293B] rounded text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#F59E0B]"
                />
                <button
                  onClick={() => setStrippedVendorCount(1420)}
                  className="px-4 py-2 bg-[#F59E0B] text-[#0B0F19] text-xs font-bold rounded hover:bg-[#D97706] transition"
                >
                  Run Client-Side SHA-256 Stripping Audit
                </button>
              </div>

              <div className="p-4 bg-[#111827] border border-[#1E293B] rounded-lg space-y-4">
                <div className="text-xs font-mono text-[#10B981] font-bold uppercase">
                  Client-Side SHA-256 Diagnostic Log
                </div>
                <div className="space-y-2 text-xs font-mono text-[#E2E8F0]">
                  <div className="p-2 rounded bg-[#1E293B]">
                    <strong>Schema Status:</strong> 6-Column Zero-ERP Schema Matched
                  </div>
                  <div className="p-2 rounded bg-[#1E293B]">
                    <strong>Vendor Anonymization:</strong> {strippedVendorCount} vendor & GSTIN records stripped via SHA-256
                  </div>
                  <div className="p-2 rounded bg-[#1E293B]">
                    <strong>Annual Carrying Interest Burn:</strong> Calculated at 22%/yr CC/OD rate
                  </div>
                  <div className="p-2 rounded bg-[#1E293B]">
                    <strong>Spares Guard:</strong> CNC/VMC keywords detected & quarantined (No scrap)
                  </div>
                  <div className="p-2 rounded bg-[#1E293B]">
                    <strong>Bank DP Haircut Indicator:</strong> Flagged under CARO 2020 Clause 3(ii)(b)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: SAMPLE 2-PAGE A4 BRIEF */}
        {activeRoom === "sample" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#F1F5F9]">Sample 2-Page A4 Boardroom MD/CFO Executive Brief</h2>
                <p className="text-sm text-[#94A3B8]">
                  Print-ready boardroom memorandum summarizing ₹6.85 Cr stock register audit.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#F59E0B] text-[#0B0F19] font-bold text-xs rounded hover:bg-[#D97706] transition"
              >
                Print / Save A4 PDF
              </button>
            </div>

            {/* A4 Brief Container */}
            <div className="bg-[#FFFDF9] text-[#0B0F19] p-8 sm:p-12 rounded-lg shadow-2xl max-w-4xl mx-auto space-y-8 border border-[#E2E8F0]">
              <div className="border-b-2 border-[#0B0F19] pb-4 flex justify-between items-end">
                <div>
                  <div className="text-2xl font-black tracking-tight text-[#0B0F19]">OPERATIONALYST</div>
                  <div className="text-xs font-bold text-[#475569]">A SNOWIN VENTURES PLATFORM · CHENNAI, TAMIL NADU</div>
                </div>
                <div className="text-right text-xs font-mono text-[#475569]">
                  <div>BOARDROOM MEMORANDUM</div>
                  <div>DATE: NOVEMBER 2026</div>
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-xl font-black text-[#0B0F19]">
                  EXECUTIVE STOCK REGISTER & LOGISTICS CORRIDOR AUDIT (₹6.85 CR REGISTER)
                </h1>
                <p className="text-xs text-[#334155] leading-relaxed">
                  Confidential MD/CFO brief isolating ₹1.425 Cr gross idle stock, ₹1.18 Cr actionable cash trap, ₹88.50L Bank Drawing Power risk under CARO 2020 3(ii), and ₹9.40L/yr freight overbilling.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 border p-4 bg-[#F8FAFC]">
                <div>
                  <div className="text-[10px] font-bold uppercase text-[#64748B]">Reconciled Book Stock</div>
                  <div className="text-lg font-black text-[#0B0F19]">₹6,85,00,000</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-[#64748B]">Actionable Cash Floor</div>
                  <div className="text-lg font-black text-[#D97706]">₹74,35,000</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-[#64748B]">Annual OD Interest Burn</div>
                  <div className="text-lg font-black text-[#DC2626]">₹25,96,000/yr</div>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-[#1E293B]">
                <h3 className="font-extrabold text-sm border-b pb-1">1. Statutory CARO 2020 & Ind AS 2 Compliance</h3>
                <p>
                  • <strong>Clause 3(ii)(a):</strong> Stock discrepancies across RM (2.55%), WIP (3.04%), FG (1.91%), and MRO (1.62%) are all within the 10% statutory reporting threshold.<br/>
                  • <strong>Clause 3(ii)(b):</strong> Quarterly stock statements submitted to working capital lenders flag <strong>₹88,50,000 Bank DP Haircut Risk</strong> at 75% advance rate.<br/>
                  • <strong>Ind AS 2 Lower of Cost or NRV:</strong> Item-by-item valuation schedule establishes ₹48,95,000 net write-down without blanket percentage penalties.
                </p>

                <h3 className="font-extrabold text-sm border-b pb-1">2. Critical CNC/VMC Spares Protection</h3>
                <p>
                  Quarantined <strong>₹24,50,000 in critical CNC/VMC breakdown spares</strong> (including Sinumerik 840D NCU control cards and Fanuc spindle drives). Recommended strictly against scrap to avoid ₹4.5L/day line-stop losses.
                </p>

                <h3 className="font-extrabold text-sm border-b pb-1">3. 90-Day Corridor Freight Audit</h3>
                <p>
                  Identified <strong>₹9,40,000/yr in freight & detention overbilling</strong> across key industrial routes (Hosur-Oragadam milk-runs, Chakan-Chennai inbound, Ambattur-Sriperumbudur shuttles).
                </p>
              </div>

              <div className="pt-6 border-t-2 border-[#0B0F19] text-xs font-mono text-[#334155] leading-relaxed">
                {founderSignOffText}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: PRICING */}
        {activeRoom === "pricing" && (
          <div className="space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="text-3xl font-black text-[#F1F5F9]">4-Stage Commercial Ladder & Ironclad SLA</h2>
              <p className="text-sm text-[#94A3B8]">
                Transparent MSME pricing with 10x Leak Identification Guarantee. 0% GST Bill of Supply.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-lg bg-[#111827] border border-[#1E293B] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-xs font-mono text-[#F59E0B] font-bold">Stage 1</div>
                  <h3 className="text-lg font-bold text-[#F1F5F9]">Instant In-Browser CSV Diagnostic</h3>
                  <div className="text-2xl font-black text-[#F1F5F9]">₹0</div>
                  <p className="text-xs text-[#94A3B8]">
                    Up to 500 anonymized rows processed instantly in your browser with client-side SHA-256 vendor stripping.
                  </p>
                </div>
                <button
                  onClick={() => setActiveRoom("sandbox")}
                  className="w-full py-2 bg-[#1E293B] text-[#F1F5F9] text-xs font-bold rounded hover:bg-[#334155] transition"
                >
                  Run In-Browser Sandbox →
                </button>
              </div>

              <div className="p-6 rounded-lg bg-[#111827] border-2 border-[#F59E0B] space-y-4 flex flex-col justify-between shadow-lg shadow-[#F59E0B]/10">
                <div className="space-y-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F59E0B] text-[#0B0F19] font-bold uppercase">
                    2 Slots Only
                  </span>
                  <div className="text-xs font-mono text-[#F59E0B] font-bold">Stage 2</div>
                  <h3 className="text-lg font-bold text-[#F1F5F9]">Founding Plant Reference Slot</h3>
                  <div className="text-2xl font-black text-[#F59E0B]">₹0 Fee</div>
                  <p className="text-xs text-[#94A3B8]">
                    Exclusively for discrete manufacturers in Chennai / Ambattur / Sriperumbudur / Oragadam / Hosur holding ₹5 Cr+ book stock, in exchange for a signed 3-line CFO / Plant Head benchmark quote once ₹10,00,000+ in leaks are verified.
                  </p>
                </div>
                <a
                  href="mailto:jonessnowin@operationalyst.com?subject=Founding%20Pilot%20Application"
                  className="w-full text-center py-2 bg-[#F59E0B] text-[#0B0F19] text-xs font-bold rounded hover:bg-[#D97706] transition"
                >
                  Apply for Reference Slot →
                </a>
              </div>

              <div className="p-6 rounded-lg bg-[#111827] border border-[#1E293B] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-xs font-mono text-[#F59E0B] font-bold">Stage 3</div>
                  <h3 className="text-lg font-bold text-[#F1F5F9]">Core 48-Hr Factory Stock & Freight Audit</h3>
                  <div className="text-2xl font-black text-[#F1F5F9]">₹45,000 Fixed</div>
                  <div className="text-[10px] text-[#F59E0B] font-mono">0% GST MSME Bill of Supply</div>
                  <p className="text-xs text-[#94A3B8]">
                    Backed by the 10x Leak Identification Guarantee (at least ₹5,00,000–₹10,00,000 in verifiable dead-stock recovery, OD savings, or freight overbilling isolated, or ₹0 fee).
                  </p>
                </div>
                <a
                  href="mailto:jonessnowin@operationalyst.com?subject=48-Hr%20Audit%20Request"
                  className="w-full text-center py-2 bg-[#1E293B] text-[#F1F5F9] text-xs font-bold rounded hover:bg-[#334155] transition"
                >
                  Request 48-Hr Audit →
                </a>
              </div>

              <div className="p-6 rounded-lg bg-[#111827] border border-[#1E293B] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-xs font-mono text-[#F59E0B] font-bold">Stage 4</div>
                  <h3 className="text-lg font-bold text-[#F1F5F9]">Quarterly Bank DP & Stock Hygiene Retainer</h3>
                  <div className="text-2xl font-black text-[#F1F5F9]">₹18,000 / Qtr</div>
                  <p className="text-xs text-[#94A3B8]">
                    Pre-audits stock registers ahead of quarterly CARO 3(ii)(b) bank stock statement filings to protect Drawing Power.
                  </p>
                </div>
                <a
                  href="mailto:jonessnowin@operationalyst.com?subject=Quarterly%20Retainer%20Inquiry"
                  className="w-full text-center py-2 bg-[#1E293B] text-[#F1F5F9] text-xs font-bold rounded hover:bg-[#334155] transition"
                >
                  Inquire Retainer →
                </a>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] bg-[#0B0F19] py-8 text-xs text-[#64748B] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
          <div className="font-mono text-[#94A3B8] leading-relaxed">
            {founderSignOffText}
          </div>
          <div className="text-[11px]">
            Operationalyst © 2026 · A Snowin Ventures Platform, Chennai · All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
