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
  Sparkles,
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
import { AdToDemoFunnelModal } from './commercial/AdToDemoFunnelModal';
import { usePlant, PlantId, PeriodId } from './context/PlantContext';

type ArchitectureVersion =
  | 'commercial_home'
  | 'factory_audit'
  | 'ad_funnel'
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

    // Check for /platform in pathname or explicit platform query parameter
    if (window.location.pathname.toLowerCase().includes('/platform')) {
      return 'ceo_master';
    }

    if (explicitParam) {
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

  // Hydrate 1-Click Shareable Client Link (#client_sync=... or ?client_sync=...) on mount & hashchange
  useEffect(() => {
    const hydrateFromUrl = () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashRaw = window.location.hash.startsWith('#')
          ? window.location.hash.slice(1)
          : window.location.hash;
        const hashParams = new URLSearchParams(hashRaw);
        const encoded = hashParams.get('client_sync') || searchParams.get('client_sync');
        if (encoded) {
          const decoded = decodeURIComponent(escape(atob(encoded)));
          const parsed = JSON.parse(decoded);
          const engines = parsed.engines || parsed;
          SYNC_KEYS.forEach((k) => {
            if (engines[k] !== undefined) {
              localStorage.setItem(
                k,
                typeof engines[k] === 'string' ? engines[k] : JSON.stringify(engines[k])
              );
            }
          });
          setUseCommercialNames(true);
          setIsClientLocked(true);
          setSyncRefreshKey((k) => k + 1);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (err) {
        console.warn('Failed to hydrate client_sync URL param', err);
      }
    };
    hydrateFromUrl();
    const handleUrlNavigation = () => {
      const requested = parseRequestedArchitecture();
      if (requested) {
        setVersionMode(requested);
      }
    };
    window.addEventListener('hashchange', hydrateFromUrl);
    window.addEventListener('hashchange', handleUrlNavigation);
    window.addEventListener('popstate', handleUrlNavigation);
    return () => {
      window.removeEventListener('hashchange', hydrateFromUrl);
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Architecture & Commercial Controls Bar (Compact App Bar on Mobile, Full Strip on Desktop) */}
      {!isClientLocked ? (
        <div className="bg-slate-950/95 backdrop-blur-md border-b border-indigo-500/30 px-3 sm:px-4 py-1.5 sticky top-0 z-50 no-print shadow-md">
          {/* MOBILE COMPACT TOP BAR (< md) — Prevents vertical screen crowding on phones */}
          <div className="flex md:hidden items-center justify-between gap-2 h-10">
            <div className="flex items-center gap-2 min-w-0">
              <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-black text-white truncate">
                {versionMode === 'ceo_master'
                  ? 'CEO Command Center'
                  : versionMode === 'standalone_p1'
                  ? 'P1 Cash Recovery'
                  : versionMode === 'standalone_p2'
                  ? 'P2 Promise OTIF'
                  : versionMode === 'standalone_p3'
                  ? 'P3 Profit Protection'
                  : versionMode === 'standalone_p4'
                  ? 'P4 Warehouse Bins'
                  : versionMode === 'standalone_p5'
                  ? 'P5 CEO Briefing'
                  : versionMode === 'custom_combos'
                  ? 'Modular Bundles'
                  : '5-Engine Suite'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  setVersionMode('commercial_home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-2 py-1.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                title="Commercial Overview"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <button
                onClick={() => openMapperForEngine()}
                className="px-2 py-1.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold text-[11px] flex items-center gap-1"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Tally</span>
              </button>
              <button
                onClick={() => setShowDeviceSync(true)}
                className="px-2 py-1.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold text-[11px] flex items-center gap-1"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Sync/QR</span>
              </button>
              <button
                onClick={() => setShowMobileMenu((v) => !v)}
                className="min-h-[44px] min-w-[44px] p-2 rounded-lg bg-slate-900 border border-slate-750 text-slate-200 flex items-center justify-center cursor-pointer touch-manipulation"
                aria-label="Toggle Mobile Suite Menu"
              >
                {showMobileMenu ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* MOBILE SLIDE-DOWN DRAWER (< md) */}
          {showMobileMenu && (
            <div className="md:hidden pt-2.5 pb-2 mt-1.5 border-t border-slate-800 space-y-2.5 text-xs animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2">
                  <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <select
                    value={activePlantId}
                    onChange={(e) => setActivePlantId(e.target.value as PlantId)}
                    className="bg-transparent text-xs font-bold text-white focus:outline-none w-full cursor-pointer py-1"
                    title="Select Factory Unit"
                  >
                    {allPlants.map((p) => (
                      <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2">
                  <CalendarClock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <select
                    value={activePeriodId}
                    onChange={(e) => setActivePeriodId(e.target.value as PeriodId)}
                    className="bg-transparent text-xs font-bold text-cyan-200 focus:outline-none w-full cursor-pointer py-1"
                    title="Select Audit Period Window"
                  >
                    {allPeriods.map((per) => (
                      <option key={per.id} value={per.id} className="bg-slate-900 text-cyan-200">
                        {per.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* All Individual Engines Switchers (Mobile Full Access) */}
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  onClick={() => {
                    setVersionMode('commercial_home');
                    setShowMobileMenu(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] py-2 px-2.5 rounded-lg border font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-[0.98] bg-amber-500/15 border-amber-500/40 text-amber-300 col-span-2"
                >
                  <Home className="w-3.5 h-3.5 text-amber-400" />
                  <span>Overview &amp; Solution</span>
                </button>
                <button
                  onClick={() => {
                    setVersionMode('factory_audit');
                    setShowMobileMenu(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] py-2 px-2.5 rounded-lg border font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-[0.98] bg-emerald-500/20 border-emerald-500/50 text-emerald-300 col-span-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Free Factory Audit (Ad Landing)</span>
                </button>
                <button
                  onClick={() => {
                    setVersionMode('ceo_master');
                    setShowMobileMenu(false);
                  }}
                  className={`min-h-[44px] py-2 px-2.5 rounded-lg border font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-[0.98] ${
                    versionMode === 'ceo_master'
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-900 border-slate-750 text-slate-200 hover:text-white'
                  }`}
                >
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CEO Master</span>
                </button>
                <button
                  onClick={() => {
                    setVersionMode('standalone_p1');
                    setShowMobileMenu(false);
                  }}
                  className={`min-h-[44px] py-2 px-2.5 rounded-lg border font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-[0.98] ${
                    versionMode === 'standalone_p1'
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-900 border-slate-750 text-slate-200 hover:text-white'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 text-emerald-400" />
                  <span>P1 Cash</span>
                </button>
                <button
                  onClick={() => {
                    setVersionMode('standalone_p2');
                    setShowMobileMenu(false);
                  }}
                  className={`min-h-[44px] py-2 px-2.5 rounded-lg border font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-[0.98] ${
                    versionMode === 'standalone_p2'
                      ? 'bg-amber-600 text-white border-amber-400'
                      : 'bg-slate-900 border-slate-750 text-slate-200 hover:text-white'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>P2 OTIF</span>
                </button>
                <button
                  onClick={() => {
                    setVersionMode('standalone_p3');
                    setShowMobileMenu(false);
                  }}
                  className={`min-h-[44px] py-2 px-2.5 rounded-lg border font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-[0.98] ${
                    versionMode === 'standalone_p3'
                      ? 'bg-cyan-600 text-white border-cyan-400'
                      : 'bg-slate-900 border-slate-750 text-slate-200 hover:text-white'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5 text-cyan-400" />
                  <span>P3 Freight</span>
                </button>
                <button
                  onClick={() => {
                    setVersionMode('standalone_p4');
                    setShowMobileMenu(false);
                  }}
                  className={`min-h-[44px] py-2 px-2.5 rounded-lg border font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-[0.98] ${
                    versionMode === 'standalone_p4'
                      ? 'bg-fuchsia-600 text-white border-fuchsia-400'
                      : 'bg-slate-900 border-slate-750 text-slate-200 hover:text-white'
                  }`}
                >
                  <ScanBarcode className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>P4 Warehouse</span>
                </button>
                <button
                  onClick={() => {
                    setVersionMode('standalone_p5');
                    setShowMobileMenu(false);
                  }}
                  className={`min-h-[44px] py-2 px-2.5 rounded-lg border font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-[0.98] ${
                    versionMode === 'standalone_p5'
                      ? 'bg-rose-600 text-white border-rose-400'
                      : 'bg-slate-900 border-slate-750 text-slate-200 hover:text-white'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-rose-400" />
                  <span>P5 Briefing</span>
                </button>
              </div>

              {/* Combo Suites and Utilities */}
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  onClick={() => {
                    setVersionMode('custom_combos');
                    setShowMobileMenu(false);
                  }}
                  className="min-h-[44px] py-2 px-2.5 rounded-lg bg-slate-900 border border-amber-500/30 text-amber-300 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer touch-manipulation active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Modular Bundles</span>
                </button>
                <button
                  onClick={() => {
                    setVersionMode('merged_suite');
                    setShowMobileMenu(false);
                  }}
                  className="min-h-[44px] py-2 px-2.5 rounded-lg bg-slate-900 border border-indigo-500/30 text-indigo-300 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer touch-manipulation active:scale-[0.98]"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Full 5-Engine Suite</span>
                </button>
                <button
                  onClick={() => setUseCommercialNames((prev) => !prev)}
                  className="min-h-[44px] py-2 px-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-[11px] cursor-pointer touch-manipulation active:scale-[0.98]"
                >
                  {useCommercialNames ? 'Brand Names: ON' : 'P1–P5 Codes: ON'}
                </button>
                <button
                  onClick={() => {
                    setIsClientLocked(true);
                    setShowMobileMenu(false);
                  }}
                  className="min-h-[44px] py-2 px-2.5 rounded-lg bg-slate-900 border border-rose-500/30 text-rose-300 font-semibold text-[11px] cursor-pointer touch-manipulation active:scale-[0.98]"
                >
                  Client Screen Lock
                </button>
              </div>
            </div>
          )}

          {/* DESKTOP FULL BAR (md and up) */}
          <div className="hidden md:flex max-w-7xl mx-auto flex-wrap items-center justify-between gap-2 text-xs">
            {/* Left: Mode Switcher Buttons */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => {
                  setVersionMode('commercial_home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
                  (versionMode as string) === 'commercial_home'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-500/40 bg-amber-500/10'
                }`}
                title="Return to Operationalyst Commercial Landing Page & Solution Overview"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => {
                  setVersionMode('factory_audit');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
                  (versionMode as string) === 'factory_audit'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                    : 'text-emerald-300 hover:text-white hover:bg-slate-800 border border-emerald-500/40 bg-emerald-500/10'
                }`}
                title="Free Executive-Level Factory Audit (Ad Landing Page)"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Free Audit</span>
              </button>

              <button
                onClick={() => {
                  setVersionMode('ceo_master');
                }}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
                  versionMode === 'ceo_master'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-sm font-black'
                    : 'text-emerald-300 hover:text-white hover:bg-slate-800 border border-emerald-500/30'
                }`}
                title="2-Minute CEO Master Executive Dashboard (Factory Health Score) + PM Backlog (P0-P3) & 3-Phase Roadmap"
              >
                <Gauge className="w-3.5 h-3.5" />
                <span>{useCommercialNames ? 'Factory Health & Roadmap' : 'CEO Master'}</span>
              </button>

              <button
                onClick={() => setVersionMode('standalone_p1')}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
                  versionMode === 'standalone_p1'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Dead Stock Recovery (Recovers Cash Locked in Dead Inventory Only)"
              >
                <Package className="w-3.5 h-3.5" />
                <span>{useCommercialNames ? 'Dead Stock Recovery' : 'P1 (Dead Stock)'}</span>
              </button>

              <button
                onClick={() => setVersionMode('standalone_p2')}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
                  versionMode === 'standalone_p2'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Dispatch Performance & Delivery Protection (Protects Customer Service & Revenue via Strict OTIF)"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{useCommercialNames ? 'Dispatch Performance' : 'P2 (Promise OTIF)'}</span>
              </button>

              <button
                onClick={() => setVersionMode('standalone_p3')}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
                  versionMode === 'standalone_p3'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Margin Protection & Freight Audit (Protects Profit Margin from Freight Leaks)"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{useCommercialNames ? 'Margin Protection' : 'P3 (Profit Protection)'}</span>
              </button>

              <button
                onClick={() => setVersionMode('standalone_p4')}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
                  versionMode === 'standalone_p4'
                    ? 'bg-fuchsia-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Warehouse Accuracy & Trust (Protects Inventory Integrity & Bin Accuracy)"
              >
                <ScanBarcode className="w-3.5 h-3.5" />
                <span>{useCommercialNames ? 'Warehouse Accuracy' : 'P4 (Warehouse Trust)'}</span>
              </button>

              <button
                onClick={() => setVersionMode('standalone_p5')}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
                  versionMode === 'standalone_p5'
                    ? 'bg-rose-500 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="CEO Dashboard & Monday Briefing (Executive Operations Control Tower)"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{useCommercialNames ? 'CEO Dashboard' : 'P5 (CEO Briefing)'}</span>
              </button>

              <button
                onClick={() => setVersionMode('custom_combos')}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
                  versionMode === 'custom_combos'
                    ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm font-bold border border-amber-400/50'
                    : 'text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-500/20'
                }`}
                title="Explore Custom Order Combinations: P1+P4, P1+P3+P5, P2+P3, P2+P4, or build your own sequence"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{useCommercialNames ? 'Modular Control Bundles' : 'Custom Combos'}</span>
              </button>

              <button
                onClick={() => setVersionMode('merged_suite')}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
                  versionMode === 'merged_suite'
                    ? 'bg-indigo-600 text-white shadow-sm font-bold border border-indigo-400/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Run Unified Manufacturing Intelligence Suite (P1 + P2 + P3 + P4 + P5)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{useCommercialNames ? 'Operations Control Tower' : 'P1+P2+P3+P4+P5'}</span>
              </button>
            </div>

            {/* Right: Multi-Plant & Time-Window Switchers + Commercial Utilities */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Global Plant Selector */}
              <div className="flex items-center bg-slate-900 border border-slate-750 rounded-md px-2 py-0.5 gap-1.5 shadow-sm">
                <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <select
                  value={activePlantId}
                  onChange={(e) => setActivePlantId(e.target.value as PlantId)}
                  className="bg-transparent text-[11px] font-bold text-white focus:outline-none cursor-pointer max-w-[170px]"
                  title="Global Multi-Plant Selector (Syncs across P1–P5)"
                >
                  {allPlants.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Global Period Selector */}
              <div className="flex items-center bg-slate-900 border border-slate-750 rounded-md px-2 py-0.5 gap-1.5 shadow-sm">
                <CalendarClock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <select
                  value={activePeriodId}
                  onChange={(e) => setActivePeriodId(e.target.value as PeriodId)}
                  className="bg-transparent text-[11px] font-bold text-cyan-200 focus:outline-none cursor-pointer max-w-[160px]"
                  title="Global Audit Window (Syncs calendar period across P1–P5)"
                >
                  {allPeriods.map((per) => (
                    <option key={per.id} value={per.id} className="bg-slate-900 text-cyan-200">
                      {per.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => openMapperForEngine()}
                className="px-2.5 py-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition"
                title="Import messy Tally Prime / Excel CSV files with automatic column mapping & Grand Total stripping"
              >
                <Wand2 className="w-3 h-3" />
                <span>Smart Tally Import</span>
              </button>

              <button
                onClick={() => setShowDeviceSync(true)}
                className="px-2.5 py-1 rounded-md bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition"
                title="Sync Gate Guard Tablet (P2), Storekeeper Phone (P4) & Share 1-Click Client Link"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Device &amp; Client Sync</span>
              </button>

              <button
                onClick={() => setUseCommercialNames((prev) => !prev)}
                className={`px-2.5 py-1 rounded-md border font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition ${
                  useCommercialNames
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title="Toggle between internal P1–P5 codes and Executive Control Tower Brand Names"
              >
                <Briefcase className="w-3 h-3" />
                <span>{useCommercialNames ? 'Brand Names: ON' : 'P1–P5 Codes'}</span>
              </button>

              <button
                onClick={() => setIsClientLocked(true)}
                className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition"
                title="Hide this top multi-project switcher bar when screen-sharing a single product with a client"
              >
                <Lock className="w-3 h-3" />
                <span>Client Lock</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Discreet Floating Unlock Pill when in Client Presentation Lock Mode */
        <button
          onClick={() => setIsClientLocked(false)}
          className="fixed bottom-4 left-4 z-50 no-print px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-indigo-600 text-slate-400 hover:text-white border border-slate-700 shadow-xl text-[11px] font-mono flex items-center gap-1.5 backdrop-blur-md transition cursor-pointer"
          title="Exit Client Presentation Mode and restore the top suite switcher bar"
        >
          <Unlock className="w-3 h-3" />
          <span>Exit Client Presentation Lock</span>
        </button>
      )}

      {/* Universal Multi-Plant & Time Window Synchronization Bar */}
      <div className="bg-slate-900/90 border-b border-indigo-500/20 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-300 no-print shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-white tracking-wide">{activePlant.name}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">{activePlant.division}</span>
          <span className="text-slate-500 text-[11px]">({activePlant.cluster})</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px]">
          <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-semibold">
            📅 Window: {activePeriod.dateRange}
          </span>
          <span className="text-amber-300 font-bold">
            Dead Stock: {activePlant.kpis.deadStockDisplay}
          </span>
          <span className="text-emerald-300 font-bold">
            OTIF: {activePlant.kpis.otifPercent}%
          </span>
          <span className="text-cyan-300 font-bold">
            Freight Leak: {activePlant.kpis.freightLeakDisplay}
          </span>
          <span className="text-fuchsia-300 font-bold">
            Bin Match: {activePlant.kpis.binAccuracyPercent}%
          </span>
        </div>
      </div>

      {/* Render Selected Version (pb-20 on mobile reserves space for the thumb-friendly bottom nav bar) */}
      <div className="flex-1 pb-20 md:pb-0" key={`${activePlantId}-${activePeriodId}-${syncRefreshKey}`}>
        {versionMode === 'ceo_master' && (
          <MasterExecutiveDashboard
            onNavigateEngine={(eng) => {
              if (eng === 'p1') setVersionMode('standalone_p1');
              if (eng === 'p2') setVersionMode('standalone_p2');
              if (eng === 'p3') setVersionMode('standalone_p3');
              if (eng === 'p4') setVersionMode('standalone_p4');
              if (eng === 'p5') setVersionMode('standalone_p5');
            }}
          />
        )}
        {versionMode === 'standalone_p1' && <Project1App />}
        {versionMode === 'standalone_p2' && <Project2App />}
        {versionMode === 'standalone_p3' && <Project3App />}
        {versionMode === 'standalone_p4' && <Project4App />}
        {versionMode === 'standalone_p5' && (
          <Project5App
            onJumpToEngine={(engine) => {
              if (engine === 'p1') setVersionMode('standalone_p1');
              if (engine === 'p2') setVersionMode('standalone_p2');
              if (engine === 'p3') setVersionMode('standalone_p3');
              if (engine === 'p4') setVersionMode('standalone_p4');
            }}
          />
        )}
        {versionMode === 'custom_combos' && (
          <CustomBundleCombinator
            useCommercialNames={useCommercialNames}
            onOpenSmartMapper={(eng) => openMapperForEngine(eng)}
          />
        )}
        {versionMode === 'merged_suite' && (
          <MergedCommandCenter
            onSwitchToStandaloneP1={() => setVersionMode('standalone_p1')}
            onSwitchToStandaloneP2={() => setVersionMode('standalone_p2')}
            onSwitchToStandaloneP3={() => setVersionMode('standalone_p3')}
            onSwitchToStandaloneP4={() => setVersionMode('standalone_p4')}
            onSwitchToStandaloneP5={() => setVersionMode('standalone_p5')}
          />
        )}
      </div>

      {/* MOBILE THUMB-FRIENDLY FIXED BOTTOM NAVIGATION BAR (< md) */}
      {!isClientLocked && (
        <nav
          aria-label="Mobile Engine Switcher"
          className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-1 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] grid grid-cols-6 gap-0.5 no-print shadow-2xl"
        >
          {[
            { id: 'ceo_master' as const, label: 'CEO', icon: Gauge, activeCls: 'text-emerald-400 bg-emerald-500/15' },
            { id: 'standalone_p1' as const, label: 'P1 Cash', icon: Package, activeCls: 'text-amber-400 bg-amber-500/15' },
            { id: 'standalone_p2' as const, label: 'P2 OTIF', icon: Truck, activeCls: 'text-emerald-400 bg-emerald-500/15' },
            { id: 'standalone_p3' as const, label: 'P3 Frt', icon: Scale, activeCls: 'text-cyan-400 bg-cyan-500/15' },
            { id: 'standalone_p4' as const, label: 'P4 Bins', icon: ScanBarcode, activeCls: 'text-fuchsia-400 bg-fuchsia-500/15' },
            { id: 'standalone_p5' as const, label: 'P5 Brief', icon: Radio, activeCls: 'text-rose-400 bg-rose-500/15' },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = versionMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setVersionMode(tab.id);
                  setShowMobileMenu(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition ${
                  active ? `${tab.activeCls} font-black` : 'text-slate-400 font-medium'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] mt-0.5 leading-none">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

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
