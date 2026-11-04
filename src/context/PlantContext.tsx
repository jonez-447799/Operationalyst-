/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PlantId = 'ambattur' | 'sriperumbudur' | 'hosur';
export type PeriodId = 'fortnight_sep' | 'month_sep' | 'q3_fy26';

export interface PlantConfig {
  id: PlantId;
  name: string;
  division: string;
  cluster: string;
  industry: string;
  currencySymbol: string;
  managerPhone: string;
  managerEmail: string;
  kpis: {
    deadStockRupees: number;
    deadStockDisplay: string;
    recoverableRupees: number;
    recoverableDisplay: string;
    aClassDeadRupees: number;
    aClassDeadDisplay: string;
    otifPercent: number;
    totalDispatches: number;
    passDispatches: number;
    failDispatches: number;
    freightLeakRupees: number;
    freightLeakDisplay: string;
    totalFreightPaid: number;
    binAccuracyPercent: number;
    unreliabilityCostRupees: number;
    factoryHealthScore: number;
    subScores: {
      inventory: number;
      otif: number;
      freight: number;
      warehouse: number;
    };
    unpaidBillsRupees: number;
    unpaidBillsDisplay: string;
    topPriorities: {
      rank: number;
      headline: string;
      owner: string;
      pillar: string;
      engine: 'p1' | 'p2' | 'p3' | 'p4' | 'p5';
      badge: string;
    }[];
  };
}

export interface PeriodConfig {
  id: PeriodId;
  label: string;
  shortLabel: string;
  dateRange: string;
  asOfDate: string;
}

export const PLANTS: Record<PlantId, PlantConfig> = {
  ambattur: {
    id: 'ambattur',
    name: 'Ambattur Baseline Unit',
    division: 'Unit 1 - Industrial Fabrication & Machinery',
    cluster: 'Ambattur Industrial Estate, Chennai (TN)',
    industry: 'Automotive & Industrial Fabrication',
    currencySymbol: '₹',
    managerPhone: '+91 98401 54321',
    managerEmail: 'planthead.ambattur@factorytower.in',
    kpis: {
      deadStockRupees: 223110,
      deadStockDisplay: '₹2.23L',
      recoverableRupees: 156000,
      recoverableDisplay: '₹1.56L',
      aClassDeadRupees: 115000,
      aClassDeadDisplay: '₹1.15L',
      otifPercent: 50,
      totalDispatches: 18,
      passDispatches: 9,
      failDispatches: 9,
      freightLeakRupees: 14177,
      freightLeakDisplay: '₹14K',
      totalFreightPaid: 105400,
      binAccuracyPercent: 60,
      unreliabilityCostRupees: 126100,
      factoryHealthScore: 69,
      subScores: {
        inventory: 69,
        otif: 50,
        freight: 74,
        warehouse: 60,
      },
      unpaidBillsRupees: 485000,
      unpaidBillsDisplay: '₹4.85L',
      topPriorities: [
        {
          rank: 1,
          headline: '₹2.23L Dead Stock Locked (8 SKUs >180 Days)',
          owner: 'Inventory Manager',
          pillar: 'P1 • Cash Recovery',
          engine: 'p1',
          badge: '🔴 Critical',
        },
        {
          rank: 2,
          headline: 'Hyundai vendor park (40% OTIF, 2/5 loads)',
          owner: 'Dispatch Head',
          pillar: 'P2 • Revenue Protection',
          engine: 'p2',
          badge: '🔴 Critical',
        },
        {
          rank: 3,
          headline: 'Siva Transport — ₹10,178 Freight Leakage',
          owner: 'Logistics Head',
          pillar: 'P3 • Profit Protection',
          engine: 'p3',
          badge: '🔴 Critical',
        },
        {
          rank: 4,
          headline: '6 Mismatched Bins (₹1.26L Variance Cost)',
          owner: 'Warehouse Head',
          pillar: 'P4 • Inventory Trust',
          engine: 'p4',
          badge: '🟡 Warning',
        },
        {
          rank: 5,
          headline: '₹4.85L Overdue Customer Bills (>45 Days)',
          owner: 'Finance Head',
          pillar: 'P5 • Control Tower',
          engine: 'p5',
          badge: '🟡 Monitor',
        },
      ],
    },
  },
  sriperumbudur: {
    id: 'sriperumbudur',
    name: 'Sriperumbudur Press & Machining',
    division: 'Unit 2 - Press & Machining Division (Sriperumbudur - Oragadam)',
    cluster: 'Sriperumbudur - Oragadam Industrial Corridor, Chennai (TN)',
    industry: 'High-Speed Press & Precision Machining',
    currencySymbol: '₹',
    managerPhone: '+91 98401 23456',
    managerEmail: 'planthead.sriperumbudur@apexprecision.com',
    kpis: {
      deadStockRupees: 1840000,
      deadStockDisplay: '₹18.4L',
      recoverableRupees: 1260000,
      recoverableDisplay: '₹12.6L',
      aClassDeadRupees: 930000,
      aClassDeadDisplay: '₹9.3L',
      otifPercent: 91,
      totalDispatches: 45,
      passDispatches: 41,
      failDispatches: 4,
      freightLeakRupees: 74200,
      freightLeakDisplay: '₹74K',
      totalFreightPaid: 580000,
      binAccuracyPercent: 96,
      unreliabilityCostRupees: 38500,
      factoryHealthScore: 88,
      subScores: {
        inventory: 84,
        otif: 91,
        freight: 85,
        warehouse: 96,
      },
      unpaidBillsRupees: 1820000,
      unpaidBillsDisplay: '₹18.2L',
      topPriorities: [
        {
          rank: 1,
          headline: '₹18.4L Dead Stock Locked (Servo Motors & Gearboxes)',
          owner: 'Inventory Manager',
          pillar: 'P1 • Cash Recovery',
          engine: 'p1',
          badge: '🔴 Critical',
        },
        {
          rank: 2,
          headline: 'Tata Motors CV Pune (85% OTIF, 1 Late Crown Wheel)',
          owner: 'Dispatch Head',
          pillar: 'P2 • Revenue Protection',
          engine: 'p2',
          badge: '🟡 Warning',
        },
        {
          rank: 3,
          headline: 'North India Express Lane — ₹74K Rate Leak',
          owner: 'Logistics Head',
          pillar: 'P3 • Profit Protection',
          engine: 'p3',
          badge: '🔴 Critical',
        },
        {
          rank: 4,
          headline: '2 Critical Stamping Die Spares Short',
          owner: 'Warehouse Head',
          pillar: 'P4 • Inventory Trust',
          engine: 'p4',
          badge: '🟢 Healthy',
        },
        {
          rank: 5,
          headline: '₹18.2L Overdue Commercial Debtors',
          owner: 'Finance Head',
          pillar: 'P5 • Control Tower',
          engine: 'p5',
          badge: '🟡 Monitor',
        },
      ],
    },
  },
  hosur: {
    id: 'hosur',
    name: 'Hosur Auto Components Unit',
    division: 'Unit 3 - Precision Auto Components & Fasteners',
    cluster: 'Hosur SIPCOT Phase-II Industrial Complex (TN)',
    industry: 'Precision Stamping & Electrical Fasteners',
    currencySymbol: '₹',
    managerPhone: '+91 94432 11223',
    managerEmail: 'factoryhead@sundaramstamping.com',
    kpis: {
      deadStockRupees: 875000,
      deadStockDisplay: '₹8.75L',
      recoverableRupees: 610000,
      recoverableDisplay: '₹6.1L',
      aClassDeadRupees: 450000,
      aClassDeadDisplay: '₹4.5L',
      otifPercent: 84,
      totalDispatches: 25,
      passDispatches: 21,
      failDispatches: 4,
      freightLeakRupees: 36400,
      freightLeakDisplay: '₹36K',
      totalFreightPaid: 248000,
      binAccuracyPercent: 88,
      unreliabilityCostRupees: 64200,
      factoryHealthScore: 82,
      subScores: {
        inventory: 80,
        otif: 84,
        freight: 81,
        warehouse: 88,
      },
      unpaidBillsRupees: 940000,
      unpaidBillsDisplay: '₹9.4L',
      topPriorities: [
        {
          rank: 1,
          headline: '₹8.75L Trapped in Stator Lamination Cores',
          owner: 'Inventory Manager',
          pillar: 'P1 • Cash Recovery',
          engine: 'p1',
          badge: '🔴 Critical',
        },
        {
          rank: 2,
          headline: 'TVS Motor Hosur Line (80% OTIF, 1 Material Short)',
          owner: 'Dispatch Head',
          pillar: 'P2 • Revenue Protection',
          engine: 'p2',
          badge: '🟡 Warning',
        },
        {
          rank: 3,
          headline: 'Bengaluru Corridor — ₹36.4K Detention Leak',
          owner: 'Logistics Head',
          pillar: 'P3 • Profit Protection',
          engine: 'p3',
          badge: '🟡 Warning',
        },
        {
          rank: 4,
          headline: '3 Stamped Bracket Bins Mismatched',
          owner: 'Warehouse Head',
          pillar: 'P4 • Inventory Trust',
          engine: 'p4',
          badge: '🟡 Warning',
        },
        {
          rank: 5,
          headline: '₹9.4L Debtors Overdue >30 Days',
          owner: 'Finance Head',
          pillar: 'P5 • Control Tower',
          engine: 'p5',
          badge: '🟢 Good',
        },
      ],
    },
  },
};

export const PERIODS: Record<PeriodId, PeriodConfig> = {
  fortnight_sep: {
    id: 'fortnight_sep',
    label: 'Current Fortnight (15–28 Sep 2026)',
    shortLabel: '15–28 Sep \'26',
    dateRange: '15 Sep – 28 Sep 2026',
    asOfDate: '2026-09-28',
  },
  month_sep: {
    id: 'month_sep',
    label: 'Full Month: Sep 2026',
    shortLabel: 'Sep 2026',
    dateRange: '01 Sep – 30 Sep 2026',
    asOfDate: '2026-09-30',
  },
  q3_fy26: {
    id: 'q3_fy26',
    label: 'Quarter: Q3 FY26 (Oct–Dec 2026)',
    shortLabel: 'Q3 FY26',
    dateRange: '01 Oct – 31 Dec 2026',
    asOfDate: '2026-10-01',
  },
};

interface PlantContextType {
  activePlantId: PlantId;
  activePlant: PlantConfig;
  setActivePlantId: (plantId: PlantId) => void;
  activePeriodId: PeriodId;
  activePeriod: PeriodConfig;
  setActivePeriodId: (periodId: PeriodId) => void;
  allPlants: PlantConfig[];
  allPeriods: PeriodConfig[];
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

const STORAGE_KEY_PLANT = 'suite_active_plant_id_v2';
const STORAGE_KEY_PERIOD = 'suite_active_period_id_v2';

export const PlantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePlantId, setActivePlantIdState] = useState<PlantId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLANT) as PlantId;
      if (saved && PLANTS[saved]) return saved;
    } catch {}
    return 'ambattur';
  });

  const [activePeriodId, setActivePeriodIdState] = useState<PeriodId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PERIOD) as PeriodId;
      if (saved && PERIODS[saved]) return saved;
    } catch {}
    return 'fortnight_sep';
  });

  const setActivePlantId = (plantId: PlantId) => {
    if (!PLANTS[plantId]) return;
    setActivePlantIdState(plantId);
    try {
      localStorage.setItem(STORAGE_KEY_PLANT, plantId);
      // Sync P2 active workspace key
      if (plantId === 'ambattur') {
        localStorage.setItem('otif_active_workspace_id_v2', 'ws_apex_01');
      } else if (plantId === 'sriperumbudur') {
        localStorage.setItem('otif_active_workspace_id_v2', 'ws_apex_01');
      } else if (plantId === 'hosur') {
        localStorage.setItem('otif_active_workspace_id_v2', 'ws_sundaram_03');
      }
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const setActivePeriodId = (periodId: PeriodId) => {
    if (!PERIODS[periodId]) return;
    setActivePeriodIdState(periodId);
    try {
      localStorage.setItem(STORAGE_KEY_PERIOD, periodId);
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  useEffect(() => {
    const handleStorage = () => {
      try {
        const p = localStorage.getItem(STORAGE_KEY_PLANT) as PlantId;
        if (p && PLANTS[p] && p !== activePlantId) setActivePlantIdState(p);
        const per = localStorage.getItem(STORAGE_KEY_PERIOD) as PeriodId;
        if (per && PERIODS[per] && per !== activePeriodId) setActivePeriodIdState(per);
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [activePlantId, activePeriodId]);

  const value: PlantContextType = {
    activePlantId,
    activePlant: PLANTS[activePlantId],
    activePeriodId,
    activePeriod: PERIODS[activePeriodId],
    setActivePlantId,
    setActivePeriodId,
    allPlants: Object.values(PLANTS),
    allPeriods: Object.values(PERIODS),
  };

  return <PlantContext.Provider value={value}>{children}</PlantContext.Provider>;
};

export const usePlant = (): PlantContextType => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlant must be used within a PlantProvider');
  }
  return context;
};
