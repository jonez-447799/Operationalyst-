import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Download,
  IndianRupee,
  Layers,
  FileCheck2,
  Boxes,
  Zap,
  Target,
  Users
} from 'lucide-react';
import { IcebergControlSystems } from './IcebergControlSystems';
import { B2BBehavioralSystem } from './B2BBehavioralSystem';
import { TallyCleanerDesk } from './TallyCleanerAndClaims';

export function CommercialLandingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'tiers' | 'tools'>('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    Commercial Remediation &amp; Conversion Hub
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Master Operations
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400">
                    Unified Enterprise Architecture: 4 Commercial Tiers, 14 Specialized Teams, and Invariant Engines
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'overview'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'teams'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                14 Teams
              </button>
              <button
                onClick={() => setActiveTab('tiers')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'tiers'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                4 Tiers
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'tools'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Remediation Tools
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Tier Overview Cards */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Tier 1</div>
                <div className="text-lg font-bold text-white">Commercial Conversion</div>
                <div className="text-xs text-slate-400 mt-2">
                  Tally/Busy ERP sanitization, non-standard unit conversion, invoice layout normalization.
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Tier 2</div>
                <div className="text-lg font-bold text-white">Leakage Remediation</div>
                <div className="text-xs text-slate-400 mt-2">
                  Freight overcharge recovery, detention audit, scrap &amp; salvage liquidation workflows.
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
                <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">Tier 3</div>
                <div className="text-lg font-bold text-white">Behavioral Governance</div>
                <div className="text-xs text-slate-400 mt-2">
                  Credit limit enforcement, buyer payment discipline grading, and contract compliance.
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Tier 4</div>
                <div className="text-lg font-bold text-white">Iceberg Control</div>
                <div className="text-xs text-slate-400 mt-2">
                  Deep hidden cost visibility, holding cost math, and unearned discount reversal.
                </div>
              </div>
            </div>

            {/* Embedded Sub-Systems */}
            <div className="space-y-8">
              <TallyCleanerDesk />
              <B2BBehavioralSystem />
              <IcebergControlSystems />
            </div>
          </div>
        )}

        {/* 14 Teams Grid */}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" /> 14 Specialized Commercial Operations Teams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Tally / Busy ERP Sanitization', tier: 'Tier 1', desc: 'Normalizes messy Tally XML, Busy ERP text files, and non-standard UOM formats.' },
                { name: 'Invoice Layout Normalizer', tier: 'Tier 1', desc: 'Standardizes disparate regional vendor invoice layouts into uniform schema.' },
                { name: 'Unit of Measure Standardization', tier: 'Tier 1', desc: 'Converts legacy regional units (bundles, bags, tins, brass) to metric standards.' },
                { name: 'Freight Overcharge Recovery', tier: 'Tier 2', desc: 'Audits freight invoices against master rate cards and issues debit notes.' },
                { name: 'Detention & Unloading Audit', tier: 'Tier 2', desc: 'Tracks vehicle turnaround times and eliminates unverified detention claims.' },
                { name: 'Scrap & Salvage Liquidation', tier: 'Tier 2', desc: 'Routes slow-moving and stagnant inventory (>180d) to liquidation channels.' },
                { name: 'RTV & Vendor Claim Recovery', tier: 'Tier 2', desc: 'Automates Return-to-Vendor debit note issuance and credit note tracking.' },
                { name: 'Credit Limit Enforcement', tier: 'Tier 3', desc: 'Dynamically halts orders for buyers exceeding contractual credit windows.' },
                { name: 'Buyer Payment Discipline Grading', tier: 'Tier 3', desc: 'Scores buyer payment timeliness and adjusts commercial terms automatically.' },
                { name: 'Unearned Discount Reversal', tier: 'Tier 3', desc: 'Clawback cash discounts taken by buyers outside allowed credit terms.' },
                { name: 'Contract Compliance Audit', tier: 'Tier 3', desc: 'Verifies price escalation clauses and volume discount tier eligibility.' },
                { name: 'Holding Cost & Capital Drag', tier: 'Tier 4', desc: 'Calculates real interest, warehouse, and opportunity costs of idle stock.' },
                { name: 'Deep Hidden Cost Visibility', tier: 'Tier 4', desc: 'Uncovers submerged operational leakages across purchasing and dispatch.' },
                { name: 'Executive Invariant Dashboard', tier: 'Tier 4', desc: 'Provides aggregate ROI, cash recovery, and mathematical invariant telemetry.' }
              ].map((team, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Team {idx + 1}
                    </span>
                    <span className="text-xs text-emerald-400 font-mono">{team.tier}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{team.name}</h3>
                  <p className="text-xs text-slate-400">{team.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4 Tiers Detail */}
        {activeTab === 'tiers' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" /> Commercial Architecture: 4 Operational Tiers
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Tier 1: Commercial Data Conversion & Normalization', desc: 'Ingests non-standard ERP exports (Tally, Busy, legacy software), fixes corrupt invoice headers, aligns tax structures (GST/HSN), and harmonizes UOM definitions.' },
                { title: 'Tier 2: Revenue & Margin Leakage Remediation', desc: 'Executes mathematical invariant audits on freight, logistics detention, vendor returns, and idle stock liquidation to recapture lost margin dollars.' },
                { title: 'Tier 3: B2B Governance & Payment Discipline', desc: 'Enforces strict credit governance, automated buyer grading, unearned cash discount clawback, and contract price compliance.' },
                { title: 'Tier 4: Deep Iceberg Cost & Invariant Analytics', desc: 'Exposes hidden capital drag, carrying cost math, multi-facility leakage benchmarks, and C-suite financial invariance metrics.' }
              ].map((tier, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-base font-bold text-white mb-2">{tier.title}</h3>
                  <p className="text-sm text-slate-400">{tier.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Remediation Tools */}
        {activeTab === 'tools' && (
          <div className="space-y-8">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" /> Active Conversion &amp; Remediation Workdesks
            </h2>
            <TallyCleanerDesk />
            <B2BBehavioralSystem />
            <IcebergControlSystems />
          </div>
        )}
      </div>
    </div>
  );
}

export default CommercialLandingPage;
