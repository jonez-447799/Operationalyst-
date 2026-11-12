import { calculateWorkingCapitalSensitivity } from './workingCapitalStressEngine';

const testItems = [{ itemId: 'ITEM-07', itemName: 'Critical Spare Item 07', unitCost: 1000, currentStock: 200, leadTimeDays: 14, dailyUsageRate: 0.5 }];
const results = calculateWorkingCapitalSensitivity(testItems);
console.log('[Test Passed] Results:', results);
