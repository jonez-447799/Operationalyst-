/**
 * Working Capital Stress & Carrying-Cost Sensitivity Engine
 * 100% Client-side pure analytical engine for MSME inventory optimization.
 * Ref: Operationalyst PRD & Policy Simulator Specification
 */

export interface InventoryItem {
  itemId: string;
  itemName: string;
  unitCost: number;
  currentStock: number;
  leadTimeDays: number;
  dailyUsageRate: number;
  holdingCostRate?: number;
}

export interface WorkingCapitalSensitivityResult {
  itemId: string;
  totalInventoryValue: number;
  annualCarryingBurn: number;
  reorderFreezeSavings: number;
  recommendedBuffer: number;
  criticalSpareBuffer15: number;
  isDeadStock: boolean;
}

export function calculateWorkingCapitalSensitivity(
  items: InventoryItem[],
  annualCarryingCostRate: number = 0.22
): WorkingCapitalSensitivityResult[] {
  return items.map((item) => {
    const totalInventoryValue = item.unitCost * item.currentStock;
    const rate = item.holdingCostRate ?? annualCarryingCostRate;
    const annualCarryingBurn = totalInventoryValue * rate;

    const daysOfSupply = item.dailyUsageRate > 0 ? item.currentStock / item.dailyUsageRate : 999;
    const isDeadStock = daysOfSupply > 180;

    const reorderFreezeSavings = isDeadStock ? totalInventoryValue * 0.78 : 0;
    const criticalSpareBuffer15 = Math.ceil(item.currentStock * 0.15);
    const recommendedBuffer = Math.ceil(item.dailyUsageRate * item.leadTimeDays * 1.15);

    return {
      itemId: item.itemId,
      totalInventoryValue,
      annualCarryingBurn,
      reorderFreezeSavings,
      recommendedBuffer,
      criticalSpareBuffer15,
      isDeadStock
    };
  });
}
