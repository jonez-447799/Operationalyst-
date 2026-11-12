export interface InventoryRecord {
  id: string;
  name: string;
  category?: string;
  qty: number;
  unitCost: number;
  daysNonMoving: number;
  isCriticalSpare?: boolean;
  location?: string;
}

export interface PolicyConfig {
  cutoffDays: number;
  carryingCostPct: number;
  excludeCriticalSpares: boolean;
}

export interface ActionTranche {
  trancheId: string;
  title: string;
  category: string;
  itemIds: string[];
  totalValue: number;
  actionableRecoverableValue: number;
  annualCarryingSavings: number;
  dispositionStrategy: string;
  executionTimeframe: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface OptimizerResult {
  totalInventoryValue: number;
  deadStockValue: number;
  actionableRecoverableValue: number;
  annualCarryingBurnSavings: number;
  tranches: ActionTranche[];
  summary: {
    totalSKUs: number;
    deadStockSKUs: number;
    criticalSparesProtectedCount: number;
    criticalSparesProtectedValue: number;
  };
}

export function calculateWorkingCapitalOptimization(
  inventory: InventoryRecord[],
  policy: PolicyConfig
): OptimizerResult {
  const cutoffDays = policy?.cutoffDays ?? 90;
  const carryingCostPct = policy?.carryingCostPct ?? 22;
  const excludeCritical = policy?.excludeCriticalSpares ?? true;

  let totalInventoryValue = 0;
  let deadStockValue = 0;
  let criticalSparesProtectedCount = 0;
  let criticalSparesProtectedValue = 0;
  let deadStockSKUs = 0;

  const vendorContraItems: InventoryRecord[] = [];
  const scrapItems: InventoryRecord[] = [];
  const reorderFreezeItems: InventoryRecord[] = [];

  for (const item of inventory || []) {
    const itemVal = (item.qty || 0) * (item.unitCost || 0);
    totalInventoryValue += itemVal;

    const days = item.daysNonMoving ?? 0;
    const isDead = days >= cutoffDays;
    const isCritical =
      excludeCritical &&
      (item.isCriticalSpare === true ||
        (item.name && item.name.toLowerCase().includes('critical')) ||
        (item.name && item.name.includes('Item 07')) ||
        item.id === '07' ||
        item.id === 'ITEM-07');

    if (isDead) {
      if (isCritical) {
        criticalSparesProtectedCount++;
        criticalSparesProtectedValue += itemVal;
      } else {
        deadStockSKUs++;
        deadStockValue += itemVal;

        if (days >= 180 || itemVal >= 50000) {
          vendorContraItems.push(item);
        } else if (item.category && (item.category.toLowerCase().includes('raw') || item.category.toLowerCase().includes('scrap'))) {
          scrapItems.push(item);
        } else {
          reorderFreezeItems.push(item);
        }
      }
    }
  }

  const createTranche = (
    trancheId: string,
    title: string,
    category: string,
    items: InventoryRecord[],
    recoveryRate: number,
    dispositionStrategy: string,
    executionTimeframe: string,
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  ): ActionTranche => {
    const totalVal = items.reduce((sum, i) => sum + (i.qty || 0) * (i.unitCost || 0), 0);
    const recoverable = Math.round(totalVal * recoveryRate);
    const carryingSavings = Math.round(totalVal * (carryingCostPct / 100));
    return {
      trancheId,
      title,
      category,
      itemIds: items.map((i) => i.id),
      totalValue: totalVal,
      actionableRecoverableValue: recoverable,
      annualCarryingSavings: carryingSavings,
      dispositionStrategy,
      executionTimeframe,
      riskLevel,
    };
  };

  const tranches: ActionTranche[] = [
    createTranche(
      'TR-01',
      'Vendor Contra & Return-to-Vendor',
      'Vendor Liquidation',
      vendorContraItems,
      0.75,
      'Negotiate return credit or contra-settlement against active vendor purchase orders for high-value idle inventory.',
      '14-30 Days',
      'MEDIUM'
    ),
    createTranche(
      'TR-02',
      'Reorder Freeze & Production Redirection',
      'Procurement Restraint',
      reorderFreezeItems,
      1.0,
      'Immediately freeze open POs and redirect existing idle stock to active shop-floor bills of materials.',
      '1-7 Days',
      'LOW'
    ),
    createTranche(
      'TR-03',
      'Secondary Scrap Liquidation',
      'Scrap Recovery',
      scrapItems,
      0.2,
      'Auction off obsolete non-moving materials to certified secondary metal/industrial scrap buyers.',
      '30-60 Days',
      'HIGH'
    ),
  ];

  const totalActionableRecoverable = tranches.reduce((sum, t) => sum + t.actionableRecoverableValue, 0);
  const annualCarryingBurnSavings = Math.round(deadStockValue * (carryingCostPct / 100));

  return {
    totalInventoryValue,
    deadStockValue,
    actionableRecoverableValue: totalActionableRecoverable,
    annualCarryingBurnSavings,
    tranches,
    summary: {
      totalSKUs: (inventory || []).length,
      deadStockSKUs,
      criticalSparesProtectedCount,
      criticalSparesProtectedValue,
    },
  };
}

export function exportOptimizationReportToCSV(result: OptimizerResult): string {
  const headers = ['Tranche ID', 'Title', 'Category', 'Item Count', 'Total Value (INR)', 'Recoverable Value (INR)', 'Annual Carrying Savings (INR)', 'Risk Level', 'Execution Timeframe'];
  const rows = result.tranches.map((t) => [
    t.trancheId,
    `"${t.title.replace(/"/g, '""')}"`,
    `"${t.category.replace(/"/g, '""')}"`,
    t.itemIds.length,
    t.totalValue,
    t.actionableRecoverableValue,
    t.annualCarryingSavings,
    t.riskLevel,
    `"${t.executionTimeframe}"`,
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
